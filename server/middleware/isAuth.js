const { verify } = require("jsonwebtoken");
const createTokens = require("../auth");
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require("../constants");
const users = require("../data/users");

const isAuth = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return next();
  }

  try {
    const { userId } = verify(accessToken, ACCESS_TOKEN_SECRET);
    req.userId = userId;
  } catch (error) {}

  if (!refreshToken) {
    return next();
  }

  let data;

  try {
    data = verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    return next();
  }

  const user = users.find((user) => user.id == data.userId);

  if (!user || user.count !== data.count) {
    return next();
  }

  const tokens = createTokens(user);

  res.cookie("accessToken", tokens.accessToken, {
    maxAge: 60 * 60 * 15,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  req.userId = user.id;

  next();
};

module.exports = isAuth;
