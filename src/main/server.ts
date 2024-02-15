import "module-alias/register";
import setupApp from "@main/config/app";
import env from "@main/config/env";
import mongoose from "mongoose";


const app = setupApp()

const dbURL = env.mongoUrl;
console.log(dbURL,"db url")
// const dbURL = "mongodb+srv://satansharma:satansharma@cluster0.ncc9mtu.mongodb.net/?retryWrites=true&w=majority";
// Set up the required options for the connection
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "busData", // Replace with the name of your database
  // Other options like user and password can also be added if necessary
};

// Create the mongoose connection
mongoose.connect(dbURL, dbOptions).then(() => {
  console.log("Connected to MongoDB successfully!");
});



app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
