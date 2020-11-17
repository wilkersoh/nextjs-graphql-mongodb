import { ApolloServer, gql } from "apollo-server-micro";
import { makeExecutableSchema } from "graphql-tools";
import { MongoClient } from "mongodb";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    blog: String
    stars: Int
  }

  type Query {
    users: [User]!
  }
`;

const resolvers = {
  Query: {
    users(_parent, _args, _context, _info) {
      return _context.db
        .collection("users")
        .find()
        .toArray()
        .then((data) => {
          return data;
        });
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let db;

const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        if (!dbClient.isConnected()) await dbClient.connect();
        db = dbClient.db("next-graphql-mongodb");
      } catch (error) {
        console.log(
          `------error while connecting with graphql context (db)`,
          error
        );
      }
    }
    return { db };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
