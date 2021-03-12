const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Route files
const contentRouter = require("./routes/content");
// const followRouter = require('./routes/follow');
// const newsfeedRouter = require('./routes/newsfeed');
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/content", contentRouter);
// app.use('/follow', followRouter);
// app.use('/newsfeed', newsfeedRouter);
app.use("/users", usersRouter);

module.exports = app;
