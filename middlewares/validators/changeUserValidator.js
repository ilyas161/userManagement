const { body, validationResult } = require("express-validator");
const logger = require("../../logger/logger");
const usersController = require("../../controllers/usersController");

module.exports.changeUserValidators = [
    body("username").notEmpty(),
    body("password").notEmpty(),
    body("firstname").notEmpty(),
    body("lastname").notEmpty(),
    body("username").custom(async (value) => {
        try {
            const isExistName = await usersController.isExist(value);
            if (isExistName) throw new Error("this username already exists");
        } catch (error) {
            logger.error(error);
            throw new Error(error.message);
        }
    }),
    body("passwordRepeat")
        .notEmpty()
        .custom((value, { req }) => value === req.body.password),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
