const { loadConfig } = require("../configs/config");
exports.greeting = (application, port) => {
  const conf = loadConfig();
  console.log("==========================");
  console.log(`🚀 ${application} has started`);
  console.log("==========================");
  console.log("CONFIG : ");
  console.log(conf);
  console.log("Hello there! Service Running on PORT:" + port);
};
