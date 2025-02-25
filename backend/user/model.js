const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
   },
   rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
   },
   comment: {
      type: String,
      maxLength: [500, "Comment must not exceed 500 characters"],
      trim: true,
   },
   created_at: { type: Date, default: Date.now },
});

const userSchema = new Schema(
   {
      username: { type: String, maxLength: 50 },
      full_name: { type: String, maxLength: 50 },
      email: {
         type: String,
         maxLength: 50,
         unique: true,
      },
      phone: {
         type: String,
         maxLength: 20,
         unique: true,
      },
      password: { type: String, maxLength: 100 },
      bio: { type: String, maxLength: 500 },
      avatar: { type: String, maxLength: 500 },
      cnic: { type: String, maxLength: 15 },
      cnic_back_image: { type: String },
      cnic_front_image: { type: String },
      age: { type: Number, index: true, default: 0, max: 150 },
      role: {
         type: String,
         default: "user",
         enum: ["admin", "user"],
      },
      gender: {
         type: String,
         enum: ["male", "female"],
         index: true,
         default: "male",
      },
      street: { type: String },
      state: { type: String },
      postal_code: { type: String, maxLength: 10 },
      country: { type: String, index: true, maxLength: 20 },
      city: { type: String, index: true, maxLength: 20 },
      address: { type: String, maxLength: 200 },
      location: {
         type: {
            type: String,
            enum: ["Point"],
            default: "Point",
         },
         coordinates: {
            type: [Number],
            default: [30.3753, 69.3451],
         },
      },
      verified: { type: Boolean, default: false, index: true },
      status: { type: String, default: "not-approved" },
      account_status: { type: String, default: "active" },
      salt: { type: String },
      token: { type: String },
      otp: { type: String },
      otp_expiry: { type: Date },
      skills: [String],
      job_counts: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      ratings: [ratingSchema],
      available: { type: Boolean, default: true, index: true },
      featured: { type: Boolean, default: false, index: true },
   },
   {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
   }
);

userSchema.index({ location: "2dsphere" });

module.exports =
   mongoose.models.UserModel || mongoose.model("User", userSchema);
