const schema = {
   typeDefs: `#graphql
     
    type Response {
      success: Boolean
      message: String 
    }

    type Query {
    }

    type Mutation {
    }
    `,

   resolvers: {
      Query: {},
      Mutation: {},
   },
   introspection: true,
   formatError: (err) => ({
      message: err.message,
      success: false,
   }),
};

module.exports = schema;
