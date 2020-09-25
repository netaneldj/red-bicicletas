const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((db) => {
    console.log("MongoDB conexión exitosa a " + db.connection.host);
  })
  .catch((err) => {
    console.error("MongoDB error en la conexión: " + err);
  });
