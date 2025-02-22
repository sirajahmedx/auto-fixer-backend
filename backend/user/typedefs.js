const typedefs = `
    type User {
        _id: String
        fullName: String
        email: String
        phone: String
        password: String
        bio: String
        avatar: String
        cnic: String
        cnicFrontImage: String
        cnicBackImage: String
        age: Int
        role: String
        gender: String
        street: String
        state: String
        postalCode: String
        country: String
        city: String
        address: String
        location: UserLocation
        verified: Boolean
        status: String
        accountStatus: String
        salt: String
        token: String
        otp: String
        otpExpiry: String
        skills: [String]
        jobCounts: Int
        experience: Int
        ratings: [Rating]
        available: Boolean
        featured: Boolean
        bookings: [Booking]
        createdAt: String
        updatedAt: String
    }

    type UserLocation {
        type: String
        coordinates: [Float]
    }

    type Rating {
        user: String
        rating: Int
        comment: String
    }

    input UserLocationInput {
        type: String
        coordinates: [Float]
    }

    input UserTimingsInput {
        day: String
        from: String
        to: String
    }

    type UpdateUserResponse {
        success: Boolean
        message: String
        data: User
    }

    type CreateUserResponse {
        success: Boolean!
        message: String!
    }

    type TokenResponse {
        success: Boolean
        message: String
        data: String
    }

    type GetUserTokenResponse {
        success: Boolean
        message: String
        data: LoginUserResponse
    }

    type LoginUserResponse {
        verified: Boolean
        token: String
    }

    type GetAllUsersResponse {
        success: Boolean!
        message: String!
        data: [User]
        pageInfo: PageInfo
    }

    type PageInfo {
        totalRecords: Int
        totalPages: Int
        currentPage: Int
        hasNextPage: Boolean
        hasPreviousPage: Boolean
    }

    input UserFilterInput {
        fullName: String
        email: String
        role: String
        city: String
        verified: Boolean
        status: String
        skills: [String]
        featured: Boolean
        jobCounts: Int
        available: Boolean
    }

    type GetUserResponse {
        success: Boolean
        message: String
        data: User
    }
`;

module.exports.typedefs = typedefs;
