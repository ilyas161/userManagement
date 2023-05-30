const exp = require("express");
const app = exp();
const logger = require("./logger/logger");
require("dotenv").config();
const registrationRoute = require("./routes/registration");
const userListRoute = require("./routes/userList");
const changeUserDataRoute = require("./routes/changeUserData");
const getOneUserDataRoute = require("./routes/getOneUserData");
const deleteUserRoute = require("./routes/deleteUser");

app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));

const sequelize = require("./db/sequelizeConnect");
const User = require("./db/sequelizeStructureDB");

app.use(userListRoute);
app.use(registrationRoute);
app.use(changeUserDataRoute);
app.use(getOneUserDataRoute);
app.use(deleteUserRoute);

const PORT = process.env.port;

app.listen(PORT, async () => {
    logger.info(`app listening port ${PORT}`);
    try {
        await sequelize.authenticate();
        await User.sync();
        logger.info("Connection has been established successfully.");
    } catch (error) {
        logger.error(error);
    }
});
