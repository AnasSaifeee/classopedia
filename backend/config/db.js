const mongoose = require("mongoose");
const connectDB = async () => {
    mongoose.connect(process.env.MONG_URI)
      .then(() => {
        // Require socketServer.js
        // const io = require('./socketServer');

        console.log("connected to Mongodb")
    
    //    server= app.listen(process.env.PORT, () => {
    //       console.log('Connected to db listening at port 4000!');
    //     });
      })
      .catch((error) => {
        console.log(error);
      });
};

module.exports = connectDB;