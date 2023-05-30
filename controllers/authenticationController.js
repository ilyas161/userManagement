const hashController = require("../controllers/hashController");
const usersController = require("./usersController");
const logger = require("../logger/logger");

module.exports.checkAuthentication = async function (username, password) {
    logger.info(username);
    let salt = await usersController.getUserData(username, "salt");
    salt = salt.dataValues.salt;
    if (!salt) throw new Error("not found this salt");
    let inroducedHashPassword;
    try {
        inroducedHashPassword = await hashController.getHashPassword(
            password,
            salt + process.env.salt
        );
    } catch (error) {
        logger.error(error);
        throw new Error("problem with getting hash");
    }

    let passwordInDB;
    try {
        passwordInDB = await usersController.getUserData(username, "password");
        passwordInDB = passwordInDB.dataValues.password;

        return passwordInDB === inroducedHashPassword && inroducedHashPassword;
    } catch (error) {
        logger.error(error);
        throw new Error();
    }
};
