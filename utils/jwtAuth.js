const jwt = require("jsonwebtoken");
const {User}  = require('../apis/models/igmodel');
const decodeJwt = require("jwt-decode");
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
    const user = await User.findOne({ where: { id: decodedData.user } });
    if (!user) {
      res.status(400).json({ status: "error", message: "User not found" });
      return;
    }
    req.user = user;
    next();

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
