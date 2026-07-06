const express = require("express");
const mongo = require("./database/connection");
const cors = require("cors");
require("dotenv").config();

const app = express();
const cookieParser = require("cookie-parser");

mongo();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use(
    cors({
         origin: [
            "http://localhost:5173",
            "http://192.168.1.29:5173",
        ],
        credentials: true,
    })
);

app.use(cookieParser());

app.use("/signIn", require("./routes/signin"));
app.use("/logIn", require("./routes/login"));
app.use("/viewUser", require("./routes/Profile"));
app.use("/Post", require("./routes/posts"));
app.use("/Comment", require("./routes/comments"));

app.listen(port, () =>
    console.log("Server has been setuped successfully on: " + port)
);
