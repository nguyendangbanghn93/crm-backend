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
        "photos",
        "email",
        "birthday",
      ],
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        process.nextTick(function () {
          // console.log({
          //   accessToken,
          //   refreshToken,
          //   profile,
          //   email: profile.emails,
          // });
          // console.log(accessToken, refreshToken, profile, done);
          console.log(profile, "----------", JSON.parse(profile._raw));

          return done(null, profile);
        });
      } catch (error) {
        done(error);
      }
    }
  )
);
