const UserModel = require("./model");
const { createHmac, randomBytes } = require("node:crypto");
const JWT = require("jsonwebtoken");
const { SendEmail } = require("../notifications");

function generateHash(salt, password) {
   const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
   return hashedPassword;
}

function generateToken(user) {
   if (!user) throw new Error("User not found");

   if (!user.verified) throw new Error("User not verified");

   if (user.account_status !== "active") throw new Error("User not active");

   return JWT.sign(
      {
         _id: user._id,
         email: user.email,
         phone: user.phone,
         role: user.role,
      },
      process.env.JWT_SECRET
   );
}

async function getAllUsers(args) {
   try {
      const users = await UserModel.find(args);
      return {
         success: true,
         message: "Users fetched successfully",
         data: users,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function getUserByEmail(email) {
   const user = await UserModel.findOne({ email });
   return user || null;
}

async function getUserByPhone(phone) {
   const user = await UserModel.findOne({ phone });
   return user || null;
}
async function getUserById(id) {
   try {
      if (!id) throw new Error("Id is required");
      const user = await UserModel.findById(id);
      if (!user) throw new Error("User not found");
      return {
         success: true,
         message: "User fetched successfully",
         data: user,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}
async function createUser(args) {
   try {
      if (args.phone) {
         const userExistByPhone = await getUserByPhone(args.phone);
         if (userExistByPhone) {
            throw new Error("Phone number already exists");
         }
      }

      if (args.password) {
         const salt = randomBytes(32).toString("hex");
         const hashedPassword = generateHash(salt, args.password);
         args = {
            ...args,
            salt,
            password: hashedPassword,
         };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Generated OTP:", otp);

      await UserModel.create({
         ...args,
         otp,
         otp_expiry: Date.now() + 3600000,
      });

      return {
         success: true,
         message: "User created successfully",
         data: otp,
      };
   } catch (error) {
      console.log(error);
      throw new Error(error.message);
   }
}

async function updateUser(args) {
   try {
      const userExist = await getUserById(args._id);
      if (!userExist) throw new Error("User not found");

      const user = await UserModel.findByIdAndUpdate(args._id, args, {
         new: true,
         runValidators: true,
      });

      return {
         success: true,
         message: "User updated successfully",
         data: user,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function verifyEmail(args) {
   try {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error("User not found");
      if (user.verified) throw new Error("Email already verified");
      if (user.otp !== args.otp) throw new Error("Invalid OTP");
      if (user.otp_expiry < Date.now()) throw new Error("OTP expired");

      const newUser = await UserModel.findByIdAndUpdate(
         user._id,
         {
            verified: true,
            otp: null,
            otp_expiry: null,
         },
         {
            new: true,
         }
      );

      const token = generateToken(newUser);

      return {
         success: true,
         message: "Email verified successfully",
         data: token,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function verifyUser(args) {
   try {
      let user;
      if (args.email) {
         user = await getUserByEmail(args.email);
      } else if (args.phone) {
         user = await getUserByPhone(args.phone);
         // console.log(user);
         // console.log(args);
      } else {
         throw new Error("Email or phone is required");
      }

      if (!user) throw new Error("User not found");
      if (user.verified) throw new Error("Email already verified");
      if (user.otp !== args.otp) throw new Error("Invalid OTP");
      if (user.otp_expiry < Date.now()) throw new Error("OTP expired");

      const newUser = await UserModel.findByIdAndUpdate(
         user._id,
         {
            verified: true,
            otp: null,
            otp_expiry: null,
         },
         {
            new: true,
         }
      );

      const token = generateToken(newUser);

      return {
         success: true,
         message: "User verified successfully",
         data: token,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function getUserToken({ email, phone, password }) {
   try {
      let user;

      if (email) {
         user = await getUserByEmail(email);
      } else if (phone) {
         user = await getUserByPhone(phone);
      } else {
         throw new Error("Email or phone is required");
      }

      if (!user) throw new Error("User not found");

      const usersHashPassword = generateHash(user.salt, password);

      if (usersHashPassword !== user.password) {
         throw new Error("Incorrect password");
      }

      if (!user.verified) {
         const otp = String(Math.floor(100000 + Math.random() * 900000));
         const otpExpiry = Date.now() + 3600000;

         await UserModel.findByIdAndUpdate(user._id, {
            otp,
            otp_expiry: otpExpiry,
         });

         // Send OTP via email
         await SendEmail(user.email, "OTP Verification", otp, "otp");

         return {
            success: true,
            message: "User not verified",
            data: {
               verified: false,
               token: null,
            },
         };
      }

      const token = generateToken(user);

      return {
         success: true,
         message: "User logged in successfully",
         data: {
            verified: true,
            token,
         },
      };
   } catch (error) {
      console.error(error);
      throw new Error(
         error.message || "An error occurred while processing the request."
      );
   }
}

async function resendVerificationPhone(args) {
   try {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error("User not found");
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);
      // await SendPhone(args.email, "Verify Email", otp, "otp");

      await UserModel.findByIdAndUpdate(user._id, {
         otp,
         otp_expiry: Date.now() + 3600000,
      });
      return {
         success: true,
         message: "Email sent successfully",
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function resendVerificationEmail(args) {
   try {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error("User not found");
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);
      // await SendEmail(args.email, "Verify Email", otp, "otp");

      await UserModel.findByIdAndUpdate(user._id, {
         otp,
         otp_expiry: Date.now() + 3600000,
      });
      return {
         success: true,
         message: "Email sent successfully",
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function forgotPassword(args) {
   try {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error("User not found");
      if (user.otp_expiry > Date.now() + 300000) {
         return {
            success: true,
            message: "OTP sent already",
         };
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      await SendEmail(args.email, "Reset Password", otp, "otp");

      await UserModel.findByIdAndUpdate(user._id, {
         otp,
         otp_expiry: Date.now() + 3600000,
      });

      return {
         success: true,
         message: "OTP sent successfully",
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function resetPassword(args) {
   try {
      const user = await getUserByEmail(args.email);
      if (!user) throw new Error("User not found");

      if (args.otp !== user.otp) throw new Error("Invalid OTP");

      if (user.otp_expiry < Date.now()) throw new Error("OTP expired");

      const salt = randomBytes(32).toString("hex");
      const hashedPassword = generateHash(salt, args.password);

      await UserModel.findByIdAndUpdate(user._id, {
         salt,
         password: hashedPassword,
         otp: null,
         otp_expiry: null,
      });

      const token = generateToken(user);

      return {
         success: true,
         message: "Password reset successfully",
         data: token,
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function changePassword(args) {
   try {
      const user = await getUserById(args._id);
      if (!user) throw new Error("User not found");

      const userSalt = user.salt;
      const usersHashPassword = generateHash(userSalt, args.old_password);

      if (usersHashPassword !== user.password)
         throw new Error("Incorrect Password");

      const salt = randomBytes(32).toString("hex");
      const hashedPassword = generateHash(salt, args.new_password);

      await UserModel.findByIdAndUpdate(user._id, {
         salt,
         password: hashedPassword,
      });
      return {
         success: true,
         message: "Password Changed Successfully",
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

async function deleteUserById(id) {
   try {
      if (!id) throw new Error("Id is required");
      const user = await UserModel.findById(id);
      if (!user) throw new Error("User not found");
      await UserModel.findByIdAndDelete(id);
      return {
         success: true,
         message: "User deleted successfully",
      };
   } catch (error) {
      throw new Error(error.message);
   }
}

module.exports.UserService = {
   getUserToken,
   createUser,
   updateUser,
   getUserById,
   getUserByEmail,
   verifyEmail,
   verifyUser,
   resendVerificationEmail,
   resendVerificationPhone,
   forgotPassword,
   resetPassword,
   changePassword,
   getAllUsers,
   deleteUserById,
};
