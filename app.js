// Note that many configuration variables have been stored on Heroku's website

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const path = require("path");
const passport= require("passport");
const localStrategy = require("passport-local");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

require("./app/schema/user.js");

const localDatabase = "mongodb://localhost/finalProject";

mongoose.connect(process.env.DATABASE_URL || localDatabase, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const User = mongoose.model("User");

const app = express();

const authenticationRoutes = require('./app/routes/authenticationRoutes.js');
const dayRoutes = require('./app/routes/dayRoutes.js');
const databaseRoutes = require('./app/routes/databaseRoutes.js');
const exerciseAddRoutes = require('./app/routes/exerciseAddRoutes.js');
const exerciseEditRoutes = require('./app/routes/exerciseEditRoutes.js');

app.set("views", "./app/views");
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "./app/public")));
app.use(express.urlencoded({extended: false}));

app.use(flash());

const savesStore = new MongoDBStore({
    uri: process.env.DATABASE_URL || localDatabase,
    collection: "mySessions",
    expires: 1000 * 60 * 60 * 24 * 30,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000
    }
});

const sessionOptions = {
    secret: process.env.SECRET || "Secret Session",
    resave: false,
    saveUninitialized: true,
    store: savesStore
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;

    next();
});

app.get("/", (req, res) => {
    res.render("index", {});
});

app.use("/", authenticationRoutes);
app.use("/", dayRoutes);
app.use("/:daySlug/", exerciseAddRoutes);
app.use("/editexercise/", exerciseEditRoutes);
app.use("/data", databaseRoutes);

app.get("*", (req, res) => {
    res.render("error", {});
});

app.listen(process.env.PORT || 3000, () => {
    console.log("The server has started.");
});