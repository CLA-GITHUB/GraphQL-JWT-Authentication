const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User!
  }
  type Mutation {
    login(email: String!, password: String!): User!
    register(id: ID!, email: String!, password: String!): User!
    invalidateToken: Boolean!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    count: Int!
  }
`;

module.exports = typeDefs;
