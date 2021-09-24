const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

// Linking the router file
app.use(require("./routes"));

app.listen(port, () => {
  console.log(`Listening at Port at ${port}`);
});
