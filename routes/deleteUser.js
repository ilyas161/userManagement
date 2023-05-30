const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const usersController = require("../controllers/usersController");
const logger = require("../logger/logger");
const router = Router();

router.delete(
    "/v1/users/:id",
    param("id")
        .notEmpty()
        .custom(async (value) => {
            const isIdExist = await usersController.isExistById(value, false);
            if (!isIdExist) throw new Error("this Id doesn't exist");
        }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.params.id;
        try {
            let userData = await usersController.deleteUser(userId);
            if (!userData) return res.status(500).send("something go wrong");
            res.status(200).send("deleted");
        } catch (err) {
            logger.error(err);
            res.status(400).send("this user does not exist");
        }
    }
);

module.exports = router;
