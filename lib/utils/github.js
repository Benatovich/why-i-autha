const fetch = require('cross-fetch');
const jwt = require('jsonwebtoken');

const exchangeCodeForToken = async (code) => {
  // TODO: Implement me!
  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  });
  const { access_token } = await resp.json();
  return access_token;
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
  const profileResp = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  const { avatar_url, login } = await profileResp.json();
  return { username: login, photoUrl: avatar_url };
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
