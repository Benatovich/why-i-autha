const fetch = require('cross-fetch');
const jwt = require('jsonwebtoken');

const exchangeCodeForToken = async (code) => {
  // TODO: Implement me!
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
};

const sign = (payload) => {
  return jwt.sign({ ...payload }, process.env.JWT_SECRET, {
    expiresIn: '1 day',
  });
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { 
  exchangeCodeForToken, 
  getGithubProfile,
  sign, verify };
