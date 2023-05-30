const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");
const usersController = require("../controllers/usersController");
const userModelController = require("../controllers/userModelController");
const logger = require("../logger/logger");
const validators = require("../middlewares/validators/changeUserValidator");
router.put("/v1/users", validators.changeUserValidators, async (req, res) => {
    const [username, password] = req.headers.authorization.split("/");
    //const [username, password] = Buffer.from(req.headers.authorization, "base64").toString().split("/"); //if send with base64 coder
    let isAuthorized;
    try {
        isAuthorized = await authenticationController.checkAuthentication(
            username,
            password
        );
    } catch (err) {
        logger.error(err);
        return res.status(500).send("have some problems");
    }

    if (!isAuthorized) {
        return res.status(401).send("password is incorrect");
    }
    try {
        const updatedAt = await usersController.getUserData(username, "updatedAt");
        const cashedDate = new Date(req.header("If-Unmodified-Since")).getTime();
        const lastDate = new Date(updatedAt.updatedAt).getTime();
        const trimMilliseconds = new Date(updatedAt.updatedAt).getMilliseconds();
        if (lastDate - cashedDate - trimMilliseconds > 0) {
            return res
                .status(400)
                .send("please update your page, we have new changes");
        }
    } catch (err) {
        logger.error(err);
        return res.status(500).send("something go wrong");
    }
    const dataToSet = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
    };
    try {
        await userModelController.updateUser(username, dataToSet);
        res.status(200).send("user was update");
    } catch (error) {
        logger.error(error);
        return res.status(500).send("something go wrong");
    }
});

module.exports = router;
