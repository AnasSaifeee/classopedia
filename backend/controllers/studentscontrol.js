const Students = require("../models/studentdata");
const Sem1Attendance = require("../models/Sem1Attendance");
const Sem2Attendance = require("../models/Sem2Attendance");
const Sem3Attendance = require("../models/Sem3Attendance");
const Sem4Attendance = require("../models/Sem4Attendance");
const ScheduledClass = require("../models/scheduledclass");
const ScheduledTest = require("../models/scheduledtest");
const ClassesTaken = require("../models/classestaken");
const sem1subjects=require('../models/sem1subjects')
const sem2subjects=require('../models/sem2subjects')
const sem3subjects=require('../models/sem3subjects')
const sem4subjects=require('../models/sem4subjects')
const Teacher = require("../models/teacherdata");
const AssignmentsPosted = require("../models/Assignment");
const StudyMaterial = require("../models/StudyMaterial");
const SubmittedAssignment = require("../models/SubmittedAssignment")
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const { PostUploadassignment } = require("./emailcontrol");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var newDate = new Date();
var year = newDate.getFullYear()
var getMonth = String(newDate.getMonth() + 1).padStart(2, '0');
var getDate = String(newDate.getDate()).padStart(2, '0');
var date = [year, getMonth, getDate].join("-");

const login = (req, res) => {
  const { enrollNum, password } = req.body;
  Students.findOne({ enrollNum: enrollNum }, (err, student) => {
    if (student) {
      const token = jwt.sign(
        {
          enrollNum: student.enrollNum,
        },
        "secret123"
      );

      if (password === student.password) {
        res.send({ message: "Login successful", student: token });
      } else {
        res.send({ message: "password didn't match" });
      }
    } else {
      res.send({ message: "Students not registered" });
    }
  });
};

const Getdashboard = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    const student = await Students.findOne({ enrollNum: enrollNum });
    let semester=student.semester;
    let studymaterial;
    const sem1Attendance = await Sem1Attendance.find({ name: student.name });
    const sem2Attendance = await Sem2Attendance.find({ name: student.name });
    const sem3Attendance = await Sem3Attendance.find({ name: student.name });
    const sem4Attendance = await Sem4Attendance.find({ name: student.name });

    let Classes_taken_count = 0;
    let attend = [];
    let subjects;
    if (semester == "Sem-1") {
      subjects = await sem1subjects.find({})
      studymaterial=await StudyMaterial.find({semester})
      attend = sem1Attendance;
      for (const k of sem1Attendance) {
        if (k.attendanceStatus == "Present") {
          Classes_taken_count = Classes_taken_count + 1;
        }
      }
      
    } else if (semester == "Sem-2") {
      subjects = await sem2subjects.find({})
      studymaterial=await StudyMaterial.find({semester})
      attend = sem2Attendance;
      for (const k of sem2Attendance) {
        if (k.attendanceStatus == "Present") {
          Classes_taken_count = Classes_taken_count + 1;
        }
      }
      
    }

    if (semester == "Sem-3") {
      subjects = await sem3subjects.find({})
      studymaterial=await StudyMaterial.find({semester})
      attend = sem3Attendance;
      for (const k of sem3Attendance) {
        if (k.attendanceStatus == "Present") {
          Classes_taken_count = Classes_taken_count + 1;
        }
      }
      
    }

    if (semester == "Sem-4") {
      subjects = await sem4subjects.find({})
      studymaterial=await StudyMaterial.find({semester})
      attend = sem4Attendance;
      for (const k of sem4Attendance) {
        if (k.attendanceStatus == "Present") {
          Classes_taken_count = Classes_taken_count + 1;
        }
      }
    }
    const newdate = new Date();
    const monthval = newdate.getMonth() + 1;
    const day = newdate.getDate();
    const year = newdate.getFullYear();

    let scheduledclasses = await ScheduledClass.find({
      semester: semester,
    });
    const data1 = scheduledclasses.filter((data) => {
      if (
        (data.date.slice(8, 10) >= day && data.date.slice(5, 7) == monthval && data.date.slice(0, 4) == year) ||
        (data.date.slice(5, 7) > monthval && data.date.slice(0, 4) == year) ||
        data.date.slice(0, 4) > year
      ) {
        return data;
      }
    });

    let scheduledtests = await ScheduledTest.find({
      semester: semester,
    });
    const data2 = scheduledtests.filter((data) => {
      if (
        (data.date.slice(8, 10) >= day && data.date.slice(5, 7) == monthval && data.date.slice(0, 4) == year) ||
        (data.date.slice(5, 7) > monthval && data.date.slice(0, 4) == year) ||
        data.date.slice(0, 4) > year
      ) {
        return data;
      }
    });

    const Classes_held = await ClassesTaken.count({
      semester: semester,
    });
    const Classes_Scheduled = data1.length;
    const Test_Scheduled = data2.length;
    const Assignment_posted = await AssignmentsPosted.count({
      semester: semester,
    });
    const assignment_submitted = await SubmittedAssignment.count({name: student.name})
    return res.json({
      status: "ok",
      subjects:subjects,
      Classes_taken_count,
      Classes_held,
      Classes_Scheduled,
      Test_Scheduled,
      Assignment_posted,
      assignment_submitted,
      attend,
      enrollNum: student.enrollNum,
      name: student.name,
      email: student.email,
      semester: semester,
      rollNum: student.rollNum,
      contactNum: student.contactNum,
      studymaterial
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};

const PatchChangepassword = async (req, res) => {
  
  const token = req.headers["x-access-token"];
  const { oldpassword, newpassword, confirmpassword } = req.body;
  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    if (!oldpassword || !newpassword || !confirmpassword) {
      return res.json({ status: 400, msg: "Please enter all fields" });
    }

    if (oldpassword === newpassword) {
      return res.json({
        status: 400,
        msg: "old and new password cannot be same",
      });
    }

    Students.findOne({ enrollNum: enrollNum }, (err, student) => {
      if (student) {
        if (oldpassword === student.password) {
          Students.findOneAndUpdate(
            { enrollNum },
            { $set: { password: newpassword } },
            (err, user) => {
              if (!err && user) {
                return res.status(200).json({ status: true, msg: "Updated successfully" });
              }
            }
          );
        } else {
          res.status(404).send({
             message: "password entered is incorrect",
             status:false
             });
        }
      } else {
        res.status(404).send({ 
          status:false,
          message: "Students not registered" });
      }
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};

const register = async (req, res) => {
  const { name, semester, email, rollNum, contactNum, enrollNum, password } =
    req.body;
    const student = await Students.find({enrollNum: enrollNum}) 


let check 
 student.map((x) => {
  if(x.enrollNum == enrollNum)
  {
    check = "true"
    return
  }
  else{
    check = "false"
  }
})

  if(check){
    res.status(400).json({status: "notok", msg: "Another student already registered with this Enrollment Number"})
  } else {
    try {
      const student = await Students.create({
        name,
        semester,
        email,
        rollNum,
        contactNum,
        enrollNum,
        password,
      });
      res.status(200).json({success:true});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
};

const registerall = async (req, res) => {
  // const { name, semester, email, rollNum, contactNum, enrollNum, password } =
  //   req.body;
    const jsonData = req.body;
   
   try{
    jsonData.map(async(x) => {
      const { name, semester, email, rollNum, contactNum, enrollNum, password } = x;
              const student = await Students.create({
                name,
                semester,
                email,
                rollNum,
                contactNum,
                enrollNum,
                password,
              });
             
    })
    return res.status(200).json({status: "ok", success: true});
   }catch (error) {
    res.status(400).json({msg:"Something gone Wrong, Try Again!", error: error.message });
  }

};

const Test_Scheduled = async (req, res) => {
  const subject=req.params.subjectval
  let message=`${subject}'s Upcoming Tests`
  const token = req.headers["x-access-token"];
  let status=true;
  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    const newdate = new Date()
    const monthval = newdate.getMonth()+1;
    const day = newdate.getDate()
    const year = newdate.getFullYear()
    let tests2;
    
    const student = await Students.findOne({ enrollNum: enrollNum });
    const semester=student.semester
    if(subject==="overall")
    {
      tests2 = await ScheduledTest.find({ semester })
      message="Upcoming Tests"
    }
    else
    {
      tests2 = await ScheduledTest.find({ subject })

    }
    
    const tests = tests2.filter((data)=>{
      if((data.date.slice(8,10)>=day &&  data.date.slice(5,7)==monthval && data.date.slice(0,4)==year) || (data.date.slice(5,7)>monthval && data.date.slice(0,4)==year) || data.date.slice(0,4)>year  )
      {
          return data
      }
    })
    if(tests.length==0)
    {
      message="No Upcoming Tests"
      status=false
    }

    return res.status(200).json({
      status,
      success: true,
      data: tests,
      message
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};

const Classes_Scheduled = async (req, res) => {
  const subject=req.params.subjectval
  let message=`${subject}'s Upcoming Classes`
  const token = req.headers["x-access-token"];
  let status=true;
  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    let classes2;
    const newdate = new Date()
    const monthval = newdate.getMonth()+1;
    const day = newdate.getDate()
    const year = newdate.getFullYear()

    const student = await Students.findOne({ enrollNum: enrollNum });
    let semester=student.semester
    if(subject==="overall")
    {
       classes2 = await ScheduledClass.find({semester})
       message="Upcoming Classes"
    }
    else
    {
       classes2 = await ScheduledClass.find({ subject:subject })

    }

    const classes = classes2.filter((data)=>{
      if((data.date.slice(8,10)>=day &&  data.date.slice(5,7)==monthval && data.date.slice(0,4)==year) || (data.date.slice(5,7)>monthval && data.date.slice(0,4)==year) || data.date.slice(0,4)>year  )
      {
          return data
      }
    })
    if(classes.length==0)
    {
      message="No Upcoming Classes"
      status=false
    }

    return res.status(200).json({
      status,
      success: true,
      data: classes,
      message
    });
  } catch (error) {
   
    res.json({ status: "error", error: "invalid token" });
  }
};

const Assignment_Schedule_student = async (req, res) => {
 
  const subject=req.params.subjectval
  let message=`${subject}'s Assignments`
  const token = req.headers["x-access-token"];
  let status=true;
  try {
    const newdate = new Date()
    const monthval = newdate.getMonth()+1;
    const day = newdate.getDate()
    const year = newdate.getFullYear()
    const decoded = jwt.verify(token, "secret123");
    const today = new Date().toISOString().split('T')[0];
    const enrollNum = decoded.enrollNum;
    let assignments;
    let expiredAssignments;
    const student = await Students.findOne({ enrollNum: enrollNum });
    let semester=student.semester
    if(subject==="overall")
    {
      assignments=await AssignmentsPosted.find({ semester,deadline:{$gte:today}})
      expiredAssignments = await AssignmentsPosted.find({  deadline: { $lt: today } });
      message="Overall Assignments"

    }
    else
    {
      console.log(subject)
      assignments=await AssignmentsPosted.find({ subject, deadline: { $gte:today } })
      console.log(assignments)
      expiredAssignments = await AssignmentsPosted.find({ subject, deadline: { $lt: today } });

    }

    if(assignments.length==0)
    {
      message="No Assignments To Show"
      status=false
    }
    return res.status(200).json({
      status,
      success: true,
      data: assignments,
      sem: student.semester,
      message,
      expiredAssignments,

    });
  } catch (error) {
    res.json({ status: "error", error: "invalid token" });
  }
};

const GetAssignments = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: await AssignmentsPosted.find({}),
  });
};

const classnotification = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: await ScheduledClass.find({}),
  });
};
const testnotification = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: await ScheduledTest.find({}),
  });
};

const StudyMaterial_Posted_Students = async (req, res) => {
  const subject=req.params.subjectval
  let message=`${subject}'s Study Material`
  const token = req.headers["x-access-token"];
  let status=true;
  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    const students = await Students.findOne({ enrollNum: enrollNum });
    let semester=students.semester
    let studymaterial;
    if(subject==="overall")
    {
      studymaterial = await StudyMaterial.find({ semester })
      message="Overall Studymaterial"

    }
    else
    {
      studymaterial = await StudyMaterial.find({ subject })

    }
    if(studymaterial.length==0)
    {
      message="No Studymaterial Available"
      status=false
    }
    return res.status(200).json({
      status,
      success: true,
      data: studymaterial,
      sem: students.semester,
      message
    });
  } catch (error) {
    res.json({ status: "error", error: "invalid token" });
  }
};

const PostAssignmentSubmitt = async (req, res) => {
  const file = req.file;

  const result = await cloudinary.uploader.upload(req.file.path);
  const fileurl = result.secure_url;
  const { _id,files, enrollNum, subject } = req.body
  const student = await Students.findOne({ enrollNum: enrollNum })
  const assignment= await AssignmentsPosted.findById({_id})
  assignment.submitted.push(enrollNum);
await assignment.save();
  const name = student.name;
  const semester = student.semester;
  let assignment_id=_id;
  try {

    const assignment = await SubmittedAssignment.create({
      assignment_id,
      name,
      subject,
      semester,
      date,
      files:file.originalname,
      fileurl
    });
    res.status(200).json({
      _id,
      success:true
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

const assignmentsubmited = async(req,res)=>{
  
   const token = req.headers["x-access-token"];
  
  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    const students = await Students.findOne({ enrollNum: enrollNum });
  
    const Assignment = await SubmittedAssignment.find({ name: students.name });
    return res.status(200).json({
      success: true,
      data: await SubmittedAssignment.find({ name:students.name}),
    });
  } catch (error) {
   
    res.json({ status: "error", error: "invalid token" });
  }
}
const Studentattendance=async(req,res)=>{
  const subject=req.params.subjectval
  let message=`Attendance Report Of ${subject}`
  const token = req.headers["x-access-token"];
  let status=true;
  let attendance;
  try {
    const decoded = jwt.verify(token, "secret123");
    const enrollNum = decoded.enrollNum;
    const students = await Students.findOne({ enrollNum: enrollNum });
    const name=students.name;
    const semester=students.semester
   if(semester==="Sem-1")
   {
      attendance = await Sem1Attendance.find({ semester,name,subject })
    
   }
   if(semester==="Sem-2")
   {
      attendance = await Sem2Attendance.find({ semester,name,subject })
    
   }
   if(semester==="Sem-3")
   {
      attendance = await Sem3Attendance.find({ semester,name,subject })
    
   }
   if(semester==="Sem-4")
   {
      attendance = await Sem4Attendance.find({ semester,name,subject })
    
   }
    if(attendance.length==0)
    {
      message="No Attendance Report Available"
      status=false
    }
    return res.status(200).json({
      status,
      success: true,
      data: attendance,
      message
    });
  } catch (error) {

    res.json({ status: "error", error: "invalid token" });
  }
}

module.exports = {
  login,
  Getdashboard,
  PatchChangepassword,
  register,
  registerall,
  Test_Scheduled,
  Classes_Scheduled,
  Assignment_Schedule_student,
  GetAssignments,
  classnotification,
  StudyMaterial_Posted_Students,
  PostAssignmentSubmitt,
  testnotification,
  assignmentsubmited,
  Studentattendance
};
