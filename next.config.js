require("dotenv").config();                                                        

const path = require("path");                                                                                               

module.exports = {
    env: {
      // Reference a variable that was defined in the .env file and make it available at Build Time
      TEST_VAR: process.env.TEST_VAR,
      DEV_MODE: process.env.ENV_DEV_MODE,
    },
  };           
