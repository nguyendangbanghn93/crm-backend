const request = require("request-promise");
const facebookConfigs = require("../configs/facebookConfigs");
const facebookApi = {
  async getProfilePicture(profileId,pageAccessToken) {
    try {
      const res = await request({
        method: "GET",
        uri: `${facebookConfigs.fb_graph_api_url}/v12.0/${profileId}?fields=name,profile_pic&access_token=${pageAccessToken}`,
      });
      console.log("res",res);
      
      return JSON.parse(res);
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = facebookApi;
// module.exports.getUserProfileFacebook = async (pageAccessToken,profileId) => {
//   try {
//     const res = await request({
//       method: "GET",
//       uri: `${facebookConfigs.fb_graph_api_url}/${profileId}?fields=name,profile_pic&access_token=${pageAccessToken}`,
//     });
//     return JSON.parse(res);
//   } catch (error) {
//     console.log(error);
//   }
// };
