const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sem4subjects = new Schema(
  {
    
    subjects:{
      type:Array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sem4subjects", sem4subjects);
