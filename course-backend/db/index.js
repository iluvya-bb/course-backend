const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const { loadConfig } = require("../configs/config");

const conf = loadConfig();
const db = {}; // Initialize db as an object

async function DB() {
  if (Object.keys(db).length > 0) {
    return db;
  }

  conf.tenant.forEach((tenant) => {
    db[tenant.name] = {
      // @ts-ignore
      sequelize: new Sequelize(tenant.name, tenant.user, tenant.password, {
        host: tenant.host,
        dialect: tenant.dialect,
        logging: false,
      }),
      models: {},
    };
  });

  await Promise.all(
    Object.keys(db).map(async (tenant) => {
      await db[tenant].sequelize.authenticate();

      await db[tenant].sequelize.createSchema(conf.app.name, {
        ifNotExists: true,
      }); // Ensure schema exists

      const modelFiles = fs
        .readdirSync(__dirname)
        .filter(
          (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );

      for (const file of modelFiles) {
        console.log("Loading :", file);
        const model = require(path.join(__dirname, file))(
          db[tenant].sequelize,
          Sequelize.DataTypes
        );
        await db[tenant].sequelize.sync({ alter: true });

        db[tenant].models[model.name] = model;
      }

      Object.keys(db[tenant].models).forEach((modelName) => {
        if (db[tenant].models[modelName].associate) {
          db[tenant].models[modelName].associate(db[tenant].models);
        }
      });
    })
  );

  console.log("DB Models Loaded");
  console.log(db);
  return db;
}

module.exports = { DB };
