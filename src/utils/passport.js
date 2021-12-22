const passport = require("passport");
const facebookApi = require("../utils/facebookApi");
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  facebook_key,
  facebook_secret,
  callback_url,
} = require("../configs/facebookConfigs");
// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: facebook_key,
      clientSecret: facebook_secret,
      callbackURL: callback_url,
    },

    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        const picture = await facebookApi.getProfilePicture(profile.id,accessToken);
        console.log({ accessToken, refreshToken, profile, picture });

        //Check whether the User exists or not using profile.id
        // if (config.use_database) {
        //   //Further code of Database.
        // }
        return done(null, profile);
      });
    }
  )
);
