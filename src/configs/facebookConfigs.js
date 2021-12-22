module.exports = {
  facebook_key: "6772254792816334", //Điền App ID của bạn vào đây
  facebook_secret: "abee5d5b427917d7fff316980c958e39", //Điền App Secret ở đây
  callback_url: `${process.env.HOST_BE}/v1/api/auth/facebook/callback`,
  fb_graph_api_url:  process.env.FACEBOOK_API_URL||"https://graph.facebook.com",
};
