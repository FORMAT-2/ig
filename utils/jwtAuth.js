const jwt = require("jsonwebtoken");
const decodeJwt = require("jwt-decode");
const { userSchema } = require("../PostgresModels");
require("dotenv").config({path:'.env.local'});

const createJwtToken = async(payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRETKEY, {
      expiresIn: "10h",
    });
    return token;
  } catch (error) {
    console.log(error.message);
  }
};
const verifyJwtToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["access-token"];
    if (!token) {
      res
        .status(400)
        .json({ status: "error", message: "Enter token to proceed" });
      return;
    }
    decoded = jwt.verify(token, process.env.SECRETKEY);
    const decodedData = decodeJwt(token);
    const user = await userSchema.findOne({ where: { id: decodedData.user } });
    if (user.dataValues.role != "SADMIN") {
      if(user.dataValues.userJourneyStatus=="STEP0"){
        req.superAdminData = null
        req.superAdminId = null
      }
      else{
        const superAdminId = await userSchema.findOne({
          where: { id: user.dataValues.superAdminId },
        });
        if (!superAdminId) {
          console.log("Initiate Seeders");
        }
        req.superAdminData = superAdminId.dataValues;
        req.superAdminId = user.dataValues.superAdminId;
      }
    }
    if (!user) {
      res.status(400).json({ status: "error", message: "User not found" });
      return;
    }
    req.user = user.dataValues;

    //   let json = res.json;
    //   res.json = c => {
    //       // console.log(`Code: ${res.statusCode}`);
    //       // console.log("Body: ", c);
    //       loggerData.userId  = (user.id)
    //       loggerData.orgId = (user.id)
    //       loggerData.date = (Date.now().toString)
    //       loggerData.statusCode = (res.statusCode)
    //       loggerData.url = (req.originalUrl)  
    //       loggerData.method = (req.method)
    //       // loggerData.ipAddress = (token)
    //       // logData(loggerData)
    //       res.json = json;
    //       return res.json(c);
    //   }
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ status: "error", message: "Token is Expired" });
    } else {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
};

module.exports = { createJwtToken, verifyJwtToken };
