const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verify } = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("./constants");
const isAuth = require("./middleware/isAuth");

const PORT = process.env.PORT;

const main = async () => {
  const app = express();
  app.use(cookieParser());
  app.set("trust proxy", true);
  app.use(
    cors({
      origin: [
        "https://studio.apollographql.com",
        "http://localhost:5000/graphql",
      ],
      credentials: true,
    })
  );

  // app.use((req, _, next) => {
  //   try {
  //     const accessToken = req.cookies["accessToken"];
  //     const { userId } = verify(accessToken, ACCESS_TOKEN_SECRET);
  //     req.userId = userId;
  //   } catch (error) {}
  //   next();
  // });

  app.use(isAuth);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`server running on: ${PORT} ${server.graphqlPath}`);
  });
};

main();
