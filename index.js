import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
dotenv.config({ path: ".env" });

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`server is runnng on port:${port}`));
  })
  .catch((error) => console.log(`there was some error:${error}`));
