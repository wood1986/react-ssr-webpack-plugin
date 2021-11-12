const express = require("express");
const app = express();
require("./index.js")({app});
// eslint-disable-next-line no-magic-numbers
app.listen(8080);
