const { body, validationResult } = require("express-validator");
const usernameController = require("../../controllers/usersController");
const logger = require("../../logger/logger");

module.exports.registrationValidators = [
    body("username")
        .notEmpty()
        .custom(async (value) => {
            try {
                const usernameCheckResult = await usernameController.isExist(value);
                if (usernameCheckResult) {
                    throw new Error("username already exist");
                }
            } catch (error) {
                logger.error(error);
                throw new Error(error.message);
            }
        }),
    body("password").notEmpty(),
    body("firstname").notEmpty(),
    body("lastname").notEmpty(),
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
