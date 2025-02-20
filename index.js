const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
dotenv.config();
const init = async () => {
   try {
      const app = express();
      app.use(express.json({ limit: "50mb" }));
      app.use(express.urlencoded({ limit: "50mb", extended: true }));

      app.use(
         cors({
            origin: function (origin, callback) {
               if (!origin) return callback(null, true);

               return callback(null, true);
            },
            credentials: true,
         })
      );

      app.use(
         compression({
            threshold: 10 * 1024,
         })
      );

      app.get("/", (req, res) => {
         res.json({ message: "Server is up and running" });
      });

      app.listen(8000, () => console.log("Server started on port 8000"));
   } catch (err) {
      console.error("Error during initialization", err);
      process.exit(1);
   }
};

init();
