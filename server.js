const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 8000;

const app = express();
if (process.env.NODE_ENV === "development") {
  console.log("testing dev mode");
  app.use(morgan("dev"));
}
app.use("/api/v1/profile", require("./routes/profile"));

app.listen(port, () => {
  console.log(`app started on ${process.env.NODE_ENV} mode on port ${port}`);
});
