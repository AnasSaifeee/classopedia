const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sem1subjects = new Schema(
  {
    
    subjects:{
      type:Array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sem1subjects", sem1subjects);
