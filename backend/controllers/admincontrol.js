const Admin = require("../models/admindata");
const jwt = require("jsonwebtoken");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const ClassesTaken = require("../models/classestaken");
const teacherdata = require("../models/teacherdata");
const Adminregister = async (req, res) => {
    const { name, password } =
      req.body;
  
    try {
      const admin = await Admin.create({
        name,
        password,
      });
      res.status(200).json(admin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  const Adminlogin = (req, res) => {
    const { name, password } = req.body;
    Admin.findOne({ name: name }, (err, admin) => {
      if (admin) {
        const token = jwt.sign(
          {
            name: admin.name,
          },
          "secret1234"
        );
  
        if (password === admin.password) {
          res.send({ message: "Login successful", admin: token });
        } else {
          res.send({ message: "password didn't match" });
        }
      } else {
        res.send({ message: "Admin not registered" });
      }
    });
  };


  const AdClassesTaken =async(req,res)=>{
    const name=req.params.teacher
    let status=false
    let classdata=await ClassesTaken.find({name})
    if(classdata && classdata.length>0)
    {
      status=true
    }
    return res.status(200).json({
      success:true,
      data : classdata,
      status
    })
  }
  
const Getteacherdata=async(req,res)=>{
  return res.status(200).json({
    success:true,
    data:await teacherdata.find()
  })
}

  module.exports = {Adminregister, Adminlogin, AdClassesTaken,Getteacherdata};
