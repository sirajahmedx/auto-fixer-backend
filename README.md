# Auto Fixer Backend

Auto Fixer is a platform that connects car owners with mechanics. This backend is built using **GraphQL** with **Apollo Server**, **Node.js**, and **MongoDB**.

## Features

-  User authentication using JWT
-  Role-based access (Customer & Mechanic)
-  Job posting and management system
-  Real-time job notifications
-  Secure GraphQL API

## Tech Stack

-  **Backend**: Node.js, GraphQL (Apollo Server)
-  **Database**: MongoDB
-  **Authentication**: JSON Web Tokens (JWT)

---

## Installation & Setup

### Prerequisites

-  **Node.js** (>= 16.x)
-  **MongoDB** (local or cloud)
-  **npm** or **yarn**

### Steps to Run Locally

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/autofixer-backend.git
cd autofixer-backend
```

2. **Install Dependencies**

```bash
npm install  # or yarn install
```

3. **Create a .env File**
   Create a `.env` file in the root directory and add the following:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. **Start the Server**

```bash
npm start  # or yarn start
```

The server will start at `http://localhost:4000/graphql`.

---

## API Usage

### Running GraphQL Queries

You can use **Apollo Playground** or **Postman** to test GraphQL queries. Example:

```graphql
query GetMechanics {
   mechanics {
      id
      name
      rating
   }
}
```

### Running Mutations

Example of creating a new job:

```graphql
mutation CreateJob {
   createJob(
      input: {
         title: "Engine Repair"
         description: "Fix engine noise"
         customerId: "12345"
      }
   ) {
      id
      title
      status
   }
}
```

---

## Key Modules

-  **index.js** - Entry point of the backend.
-  **datasource.js** - Handles data fetching and integration.
-  **model.js** - Mongoose models for database operations.
-  **mutations.js** - Contains GraphQL mutations.
-  **queries.js** - Contains GraphQL queries.
-  **resolvers.js** - Defines resolvers for handling API requests.
-  **typedefs.js** - Defines GraphQL schema and types.

---

## Future Enhancements

-  WebSockets for real-time updates
-  Payment integration
-  Review and rating system

---

## Contributing

Pull requests are welcome! Open an issue for feature requests or bug reports.

---

## License

MIT License
