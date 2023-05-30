const { Router } = require("express");
const router = Router();
const userModelController = require("../controllers/userModelController");
const logger = require("../logger/logger");
const validator = require("../middlewares/validators/registrationValidator");
router.post(
    "/v1/registration",
    validator.registrationValidators,
    async (req, res) => {
        let newUser;
        const dataToSet = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        };
        try {
            newUser = await userModelController.addUser(dataToSet);
            if (newUser === true)
                return res.status(201).send("user successfully added");
        } catch (error) {
            logger.error(error);
            res.status(501).send("had some problems");
        }
    }
);

module.exports = router;
