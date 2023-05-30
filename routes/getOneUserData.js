const { Router } = require("express");
const router = Router();
const usersController = require("../controllers/usersController");
const { param, validationResult } = require("express-validator");
const logger = require("../logger/logger");

router.get(
    "/v1/users/:id",
    param("id")
        .notEmpty()
        .custom(async (value) => {
            const isIdExist = await usersController.isExistById(value, true);
            if (!isIdExist) throw new Error("this Id doesn't exist");
        }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.params.id;
        try {
            let userData = await usersController.getUserDataById(
                userId,
                "username",
                "firstname",
                "lastname",
                "updatedAt"
            );
            const { username, firstname, lastname, updatedAt: updateDate } = userData;
            res.header("Last-Modified", updateDate);
            res.status(200).send({ username, firstname, lastname });
        } catch (err) {
            logger.error(err);
            res.status(400).send("this user does not exist");
        }
    }
);

module.exports = router;
