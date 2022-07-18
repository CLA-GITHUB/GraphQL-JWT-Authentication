const { sign } = require("jsonwebtoken");
const createTokens = require("../auth");
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require("../constants");
let users = require("../data/users");

const resolvers = {
  Query: {
    me: (_parent, _args, { req }) => {
      const foundUser = users.find((user) => user.id == req.userId);
      console.log(req.userId);
      if (!foundUser) {
        throw new Error("user not found");
      }

      return foundUser;
    },
  },

  Mutation: {
    register: (_parent, { id, email, password }, _context) => {
      users = [...users, { id, email, password, count: 0 }];
      const createdUser = users.find((user) => user.id === id);
      console.log(users);

      return createdUser;
    },
    login: (_parent, { email, password }, { res }) => {
      //find a user
      const foundUser = users.find((user) => user.email === email);
      if (!foundUser) {
        throw new Error("user not found");
      }

      if (foundUser.password !== password) {
        throw new Error("password incorrect");
      }

      //create the token in the cookie

      const { accessToken, refreshToken } = createTokens(foundUser);

      res.cookie("accessToken", accessToken, {
        maxAge: 60 * 60 * 15,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return foundUser;
    },

    invalidateToken: (_parent, _args, { req, res }) => {
      if (!req.userId) {
        return false;
      }

      const user = users.find((user) => user.id == req.userId);
      if (!user) {
        return false;
      }

      user.count += 1;
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return true;
    },
  },
};

module.exports = resolvers;
