const passport = require("passport");
const request = require("request-promise");
const facebookConfigs = require("../configs/facebookConfigs");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(
  new FacebookStrategy(
    {
      clientID: facebookConfigs.facebook_key,
      clientSecret: facebookConfigs.facebook_secret,
      callbackURL: facebookConfigs.callback_url,
      profileFields: [
        "id",
        "displayName",
        "link",
        "picture.type(large)",
        "email",
        "birthday",
      ],
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        try {
          const data = profile?._json;
          const info = {
            idFacebook: data?.id,
            name: data?.name,
            email: data?.email,
            avatar: data?.picture?.data?.url,
          };
          return done(null, info);
        } catch (error) {
          done(error);
        }
      });
    }
  )
);
