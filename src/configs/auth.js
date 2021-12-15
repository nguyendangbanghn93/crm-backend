module.exports.authConfigs = {
  secret: "crm",
  refreshTokenSecret: "crm-refresh-token",
  tokenLife: 86400, // 1 ngày
  refreshTokenLife: 86400 * 5, // 5 ngày
  salt: 8,
  emailService: "gmail",
  emailHost: "smtp.gmail.com",
  emailUser: "va.crm.ftech@gmail.com",
  emailPass: "Vbn693178",
};
