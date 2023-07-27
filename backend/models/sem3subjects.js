const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sem3subjects = new Schema(
  {
    
    subjects:{
      type:Array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sem3subjects", sem3subjects);
