//config.js
module.exports = {
  facebook_key: "6772254792816334", 
  facebook_secret: "abee5d5b427917d7fff316980c958e39", 
  callback_url: `${process.env.API_URL}/auth/facebook/callback`,
  facebook_api: process.env.FACEBOOK_API_URL
};
