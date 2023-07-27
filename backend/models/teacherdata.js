const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    Teacher_id: {
      type: String,
      required: true,
    },

    contactNum: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    Sem1:{
      type:Array
    },
    Sem2:{
      type:Array
    },
    Sem3:{
      type:Array
    },
    Sem4:{
      type:Array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
