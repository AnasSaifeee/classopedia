const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sem2subjects = new Schema(
  {
    
    subjects:{
      type:Array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sem2subjects", sem2subjects);
