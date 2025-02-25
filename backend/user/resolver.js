const { UserService } = require("./datasource");
// const UserModel = require("./model");

const queries = {
   getUserById: async (parent, args, context, info) => {
      try {
         if (!context.user) throw new Error("You are not logged in");
         if (context.user._id !== args.id && context.user.role !== "admin") {
            throw new Error("You are not authorized to access this user");
         }
         if (!args) throw new Error("Invalid arguments");
         if (!args.id) throw new Error("User ID is required");
         return await UserService.getUserById(args.id);
      } catch (error) {
         console.log(error);
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   getAllUsers: async (parent, args, context, info) => {
      try {
         if (!context.user) throw new Error("You are not logged in");
         if (context.user.role !== "admin") {
            throw new Error("You are not authorized to access all users");
         }
         return await UserService.getAllUsers(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   getCurrentLoggedInUser: async (parent, args, context, _info) => {
      try {
         if (context && context.user)
            return await UserService.getUserById(context.user._id);
         return null;
      } catch (error) {
         console.log(error);
         return null;
      }
   },
};

const mutations = {
   createUser: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");
         if (!args.username) throw new Error("username is required");
         if (!args.fullName) throw new Error("First name is required");
         if (!args.phone) throw new Error("Phone is required");
         if (!args.role) throw new Error("Role is required");
         if (!args.password) throw new Error("Password is required");
         if (args.password.length < 8) throw new Error("Password is too short");
         if (args.password.length > 20) throw new Error("Password is too long");
         if (!args.cnic) throw new Error("CNIC is required");
         if (!args.skills) throw new Error("Skills are required");

         const response = await UserService.createUser(args);
         console.log("Response from UserService.createUser:", response);
         return response;
      } catch (error) {
         console.log(error);
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   getUserToken: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");

         if (!args.email && !args.phone)
            throw new Error("Email or phone is required");

         if (!args.password) throw new Error("Password is required");

         if (args.password.length < 8) throw new Error("Password too short");

         if (args.password.length > 20) throw new Error("Password too long");

         return await UserService.getUserToken(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   updateUser: async (parent, args, context, info) => {
      try {
         if (!context.user) throw new Error("You are not logged in");
         if (!args) throw new Error("Invalid arguments");
         if (!args._id) throw new Error("User ID is required");
         if (context.user._id !== args._id && context.user.role !== "admin")
            throw new Error("You are not authorized to update this user");

         return await UserService.updateUser(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   deleteUserById: async (parent, args, context, info) => {
      try {
         if (!context.user) throw new Error("You are not logged in");
         if (!args) throw new Error("Invalid arguments");
         if (!args.id) throw new Error("User ID is required");
         if (context.user._id !== args.id && context.user.role !== "admin")
            throw new Error("You are not authorized to delete this user");
         return await UserService.deleteUserById(args.id);
      } catch (error) {
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   verifyUser: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");

         if (!args.email && !args.phone)
            throw new Error("Email or phone is required");
         if (!args.otp) throw new Error("OTP is required");

         return await UserService.verifyUser(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   resendVerificationPhone: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");
         if (!args.phone) throw new Error("Phone Number is required");
         return await UserService.resendVerificationPhone(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
         };
      }
   },

   resendVerificationEmail: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");
         if (!args.email) throw new Error("Email is required");
         return await UserService.resendVerificationEmail(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
         };
      }
   },

   forgotPassword: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");
         if (!args.email) throw new Error("Email is required");
         return await UserService.forgotPassword(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
         };
      }
   },

   resetPassword: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");
         if (!args.email) throw new Error("Email is required");
         if (!args.otp) throw new Error("OTP is required");
         if (!args.password) throw new Error("Password is required");
         if (!args.confirm_password)
            throw new Error("Confirm password is required");
         if (args.password !== args.confirm_password)
            throw new Error("Passwords do not match");

         if (args.password.length < 8) throw new Error("Password too short");

         if (args.password.length > 20) throw new Error("Password too long");

         return await UserService.resetPassword(args);
      } catch (error) {
         return {
            success: false,
            message: error.message,
            data: null,
         };
      }
   },

   changePassword: async (parent, args, context, info) => {
      try {
         if (!args) throw new Error("Invalid arguments");
         const user = context.user;
         if (!user) throw new Error("User not found");

         if (!args.old_password) throw new Error("Old password is required");

         if (!args.new_password) throw new Error("New password is required");

         if (args.new_password.length < 8)
            throw new Error("New password too short");

         if (args.new_password.length > 20)
            throw new Error("New password too long");

         return await UserService.changePassword({
            _id: user._id,
            ...args,
         });
      } catch (error) {
         return {
            success: false,
            message: error.message,
         };
      }
   },
};

module.exports.resolvers = { queries, mutations };
