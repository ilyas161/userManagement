const logger = require("../logger/logger");
const User = require("../db/sequelizeStructureDB");
const { Op } = require("sequelize");

module.exports.getUserData = async function (username, ...attribute) {
    try {
        return await User.findOne({
            attributes: attribute,
            where: {
                username: {
                    [Op.eq]: username,
                },
            },
        });
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};

module.exports.getUserDataById = async function (id, ...attribute) {
    try {
        return await User.findOne({
            attributes: attribute,
            where: {
                id: {
                    [Op.eq]: id,
                },
            },
        });
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};

module.exports.getUsersData = async function (parameters) {
    try {
        const attributeData = await User.findAll(parameters);
        if (!Object.keys(attributeData).length) {
            throw new Error("There aren't such users");
        }
        return attributeData;
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};

module.exports.isExist = async function (username) {
    try {
        return await User.findOne({
            attributes: ["username"],
            where: {
                username: {
                    [Op.eq]: username,
                },
            },
            paranoid: false,
        });
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};

module.exports.isExistById = async function (id, paranoid) {
    try {
        return await User.findOne({
            attributes: ["id"],
            where: {
                id: {
                    [Op.eq]: id,
                },
            },
            paranoid: paranoid,
        });
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};

module.exports.deleteUser = async function (id) {
    try {
        return await User.destroy({
            where: {
                id: id,
            },
        });
    } catch (err) {
        logger.error(err.message);
        throw new Error(err);
    }
};
