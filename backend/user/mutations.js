const mutations = `#graphql
  createUser(
    username: String!,
    fullName: String!,
    email: String,
    password: String!,
    phone: String!,
    bio: String,
    avatar: String,
    cnic: String,
    cnicFrontImage: String,
    cnicBackImage: String,
    age: Int,
    role: String,
    gender: String,
    street: String,
    state: String,
    postalCode: String,
    country: String,
    city: String,
    address: String,
    location: UserLocationInput,
    status: String,
    accountStatus: String,
    skills: [String],
    jobCounts: Int,
    experience: Int,
    featured: Boolean
  ): CreateUserResponse

  updateUser(
    _id: String!,
    fullName: String,
    age: Int,
    role: String,
    gender: String,
    cnic: String,
    street: String,
    state: String,
    postalCode: String,
    country: String,
    city: String,
    address: String,
    location: UserLocationInput,
    website: String,
    company: String,
    phone: String,
    avatar: String,
    bio: String,
    status: String,
    accountStatus: String,
    skills: [String],
    jobCounts: Int,
    experience: Int,
    featured: Boolean,
    available: Boolean
  ): UpdateUserResponse

  verifyUser(phone: String!, email: String, otp: String!): TokenResponse

  resendVerificationPhone(phone: String!): Response

  resendVerificationEmail(email: String!,): Response

  forgotPassword(email: String, phone: String): Response

  resetPassword(email: String, phone: String, otp: String!, password: String!, confirm_password: String!): TokenResponse

  changePassword(old_password: String!, new_password: String!): Response

  deleteUserById(id: String!): Response

  getUserToken(email: String, phone: String, password: String!): GetUserTokenResponse
`;
module.exports.mutations = mutations;
