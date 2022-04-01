const { Router } = require('express');
const { sign } = require('../utils/github');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}
      &scope=user
      &redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    /*
      TODO:
     * create jwt
     * set cookie and redirect
     */
    try {
      // get code, exchange for token
      const token = await exchangeCodeForToken(req.query.code);

      // get info from github about user with token
      const profile = await getGithubProfile(token);

      // get existing user if there is one
      let user = await GithubUser.findByUsername(profile.username);

      // if not, create one
      if (!user) {
        user = await GithubUser.insert(profile);
      }
      

      res
        .cookie(process.env.COOKIE_NAME, sign(user), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS
        })
        .redirect('/');
    } catch (error) {
      next(error);
    }
  })


  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
