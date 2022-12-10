const express = require("express");
const { default: mongoose } = require("mongoose");

const cors = require("cors");
const resultRoutes = require("./src/routers/resultRoutes");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.set("strictQuery", true);

app.use("/", resultRoutes);

const mongoDBUrl =
  "mongodb+srv://mahfuz:mahfuzzz@cluster0.tai23b4.mongodb.net/ssc?retryWrites=true&w=majority";
// "mongodb+srv://admin:mahfuz@mahfuz.pute8tu.mongodb.net/scrape";

mongoose
  .connect(mongoDBUrl)
  .then(() => console.log("mongoDB connection successfully"))
  .catch((e) => console.log(e));

app.listen("5000", () => {
  console.log("app listen port 5000");
});
