const Students = require("../models/studentdata");
const Sem1Attendance = require("../models/Sem1Attendance");
const Sem2Attendance = require("../models/Sem2Attendance");
const Sem3Attendance = require("../models/Sem3Attendance");
const Sem4Attendance = require("../models/Sem4Attendance");
const ScheduledClass = require("../models/scheduledclass");
const ScheduledTest = require("../models/scheduledtest");
const ClassesTaken = require("../models/classestaken");
const Teacher = require("../models/teacherdata");
const AssignmentsPosted = require("../models/Assignment");
const StudyMaterial = require("../models/StudyMaterial");
const SubmittedAssignment = require("../models/SubmittedAssignment")
const sem1subjects=require("../models/sem1subjects")
const sem2subjects=require("../models/sem2subjects")
const sem3subjects=require("../models/sem3subjects")
const sem4subjects=require("../models/sem4subjects")
const jwt = require("jsonwebtoken");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var newDate = new Date();
      var year=newDate.getFullYear()
      var getMonth = String(newDate.getMonth() + 1).padStart(2, '0');
      var getDate = String(newDate.getDate() ).padStart(2, '0');
      var date = [year,getMonth,getDate].join("-");
const loginteacher = (req, res) => {
  const { Teacher_id, password } = req.body;
  Teacher.findOne({ Teacher_id: Teacher_id }, (err, teacher) => {
    if (teacher) {
      const token = jwt.sign(
        {
          Teacher_id: teacher.Teacher_id,
        },
        "secret1234"
      );
      if (password === teacher.password) {
        res.send({ message: "Login successful", teacher: token });
      } else {
        res.send({ message: "password didn't match" });
      }
    } else {
      res.send({ message: "Teacher not registered" });
    }
  });
};

const PatchTeacherChangePassword = async (req, res) => {
  console.log("request rcvd")
  const token = req.headers["x-access-token"];
  const { oldpassword, newpassword, confirmpassword } = req.body;
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    if (!oldpassword || !newpassword || !confirmpassword) {
      return res.status(400).json({ status:false, message: "Please enter all fields" });
    }

    if (oldpassword === newpassword) {
      return res.status(400).json({
        status: false,
        message: "old and new password cannot be same",
      });
    }

    Teacher.findOne({ Teacher_id: Teacher_id }, (err, teacher) => {
      if (teacher) {
        if (oldpassword === teacher.password) {
          console.log(teacher)
          Teacher.findOneAndUpdate(
            { Teacher_id },
            { $set: { password: newpassword } },
            (err, user) => {
              if (!err && user) {
                return res.status(200).json({ status: true, message: "Updated successfully" });
              }
            }
          );
        } else {
          res.status(404).send({ message: "password entered is incorrect",
        status:false });
        }
      } else {
        res.status(404).send({ message: "Students not registered",
      status:false });
      }
    });
  } catch (error) {
   
    res.json({ status: "error", error: "invalid token" });
  }
};

const RegisterTeacher = async (req, res) => {
  const { name, email, Teacher_id, contactNum, password, Sem1, Sem2, Sem3, Sem4} = req.body;


  const teacher = await Teacher.find({Teacher_id: Teacher_id}) 
let check
teacher.map((x) => {
  if(x.Teacher_id == Teacher_id)
  {
    check = "true"
    return
  }
  else {
    check = "false"
  }
})

if(check) {
  res.status(400).json({status: "notok", msg: "Another Teacher already registered with this Teacher ID"})
} else {
  try {
    
    const teacher = await Teacher.create({
      name,
      email,
      Teacher_id,
      contactNum,
      password,
      Sem1,
      Sem2,
      Sem3,
      Sem4,
    });
    res.status(200).json({success:true});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
};

const Teacherverification = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });

    const Classes_taken_count = await ClassesTaken.count({
      name: teacher.name,
    });
    const Classes_Scheduled = await ScheduledClass.count({
      name: teacher.name,
    });
    const Test_Scheduled = await ScheduledTest.count({ name: teacher.name });
    const Assignments_posted = await AssignmentsPosted.count({
      teacher: teacher.name,
    });
    const Study_Material_posted = await StudyMaterial.count({
      teacher: teacher.name,
    });

    return res.status(200).json({
      status: "ok",
      teacher:teacher,
      Teacher_id: teacher.Teacher_id,
      Classes_taken_count,
      Classes_Scheduled,
      Test_Scheduled,
      Assignments_posted,
      Study_Material_posted,
      name: teacher.name,
      email: teacher.email,
      contactNum: teacher.contactNum,
      data: await Students.find({}),
    });
  } catch (error) {
   
    res.json({ status: "error", error: "invalid token" });
  }
};



const sem1Attendance = async (req, res) => {
  const token = req.headers["x-access-token"];
  const semester = "Sem-1";
  
  const subject = req.body.subject;
  let teachername;
  const time =
    newDate.getHours() +
    ":" +
    newDate.getMinutes() +
    ":" +
    newDate.getSeconds();
  
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    teachername = teacher.name;

    res.status(200).json({
      success: true,
      data: await ClassesTaken.create({
        name: teacher.name,
        subject,
        semester,
        date,
        time,
      }),
    });
  } catch (error) {
  
    res.json({ status: "error", error: "invalid token" });
  }

  for (const key in req.body.status) {
    const name = key;
    const temp = req.body.status[key];
    var attendanceStatus;
   
    if (temp) {
      attendanceStatus = "Present";
    } else {
      attendanceStatus = "Absent";
    }

    try {
     
      await Sem1Attendance.create({
        teacher: teachername,
        date,
        name,
        subject,
        semester,
        attendanceStatus,
        time,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const sem2Attendance = async (req, res) => {
  const token = req.headers["x-access-token"];
  const semester = "Sem-2";
  const subject = req.body.subject;
  let teachername;
  var newDate = new Date();
  const time =
    newDate.getHours() +
    ":" +
    newDate.getMinutes() +
    ":" +
    newDate.getSeconds();
 

  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    teachername = teacher.name;
    res.status(200).json({
      success: true,
      data: await ClassesTaken.create({
        name: teacher.name,
        subject,
        semester,
        date,
        time,
      }),
    });
  } catch (error) {
   
    res.json({ status: "error", error: "invalid token" });
  }

  for (const key in req.body.status) {
    const name = key;
    const temp = req.body.status[key];
    var attendanceStatus;
    
    if (temp) {
      attendanceStatus = "Present";
    } else {
      attendanceStatus = "Absent";
    }

    try {
      await Sem2Attendance.create({
        teacher: teachername,
        date,
        name,
        subject,
        semester,
        attendanceStatus,
        time,
      });
    } catch (error) {
      console.log(error);
    }
  }
};
const sem3Attendance = async (req, res) => {
  const token = req.headers["x-access-token"];
  const semester = "Sem-3";
  const subject = req.body.subject;
  let teachername;
  
  var newDate = new Date();
  const time =
    newDate.getHours() +
    ":" +
    newDate.getMinutes() +
    ":" +
    newDate.getSeconds();
  const date =
    newDate.getFullYear() +
    "-" +
    (newDate.getMonth() + 1) +
    "-" +
    newDate.getDate();

  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    teachername = teacher.name;
    
    res.status(200).json({
      success: true,
      data: await ClassesTaken.create({
        name: teacher.name,
        subject,
        semester,
        date,
        time,
      }),
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }

  for (const key in req.body.status) {
    const name = key;
    const temp = req.body.status[key];
    var attendanceStatus;
   
    if (temp) {
      attendanceStatus = "Present";
    } else {
      attendanceStatus = "Absent";
    }

    try {
      await Sem3Attendance.create({
        teacher: teachername,
        date,
        name,
        subject,
        semester,
        attendanceStatus,
        time,
      });
    } catch (error) {
      
    }
  }
};
const sem4Attendance = async (req, res) => {
  const token = req.headers["x-access-token"];
  const semester = "Sem-4";
  const subject = req.body.subject;
  let teachername;
  
  var newDate = new Date();
  const time =
    newDate.getHours() +
    ":" +
    newDate.getMinutes() +
    ":" +
    newDate.getSeconds();
  

  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    
    teachername = teacher.name;
    res.status(200).json({
      success: true,
      data: await ClassesTaken.create({
        name: teacher.name,
        subject,
        semester,
        date,
        time,
      }),
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }

  for (const key in req.body.status) {
    const name = key;
    const temp = req.body.status[key];
    var attendanceStatus;
    
    if (temp) {
      attendanceStatus = "Present";
    } else {
      attendanceStatus = "Absent";
    }

    try {
      await Sem4Attendance.create({
        teacher: teachername,
        date,
        name,
        subject,
        semester,
        attendanceStatus,
        time,
      });
    } catch (error) {
      
    }
  }
};
const UploadContent=async(req,res)=>{
  console.log(req.params.postparam)
  
}


const SemAttendanceReport = async (req, res) => {
  console.log("request rcvd")
  const {sem,filter,filterval,idate}=req.params;
 
  const token = req.headers["x-access-token"];
  
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const admin = decoded.name;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    let attendancedata;
    let finaldata;
    let message=`Attendance report of ${filterval}`
    let status=true;
    let subjectdata;
    if(admin ){
      if(sem=="Sem1"){
        attendancedata=await Sem1Attendance.find()
        subjectdata=await sem1subjects.find()
      }
      else if(sem=="Sem2"){
  
        attendancedata=await Sem2Attendance.find()
        subjectdata=await sem2subjects.find()
      }
      else if(sem=="Sem3"){
  
        attendancedata=await Sem3Attendance.find()
        subjectdata=await sem3subjects.find()
      }
      else if(sem=="Sem4"){
        attendancedata=await Sem4Attendance.find()
        subjectdata=await sem4subjects.find()
      }
      if (filter === "multipledate") {
        const startDate = new Date(idate);
        const endDate = new Date(filterval);
        endDate.setDate(endDate.getDate() + 1); // Include end date in the filter
      
        finaldata = attendancedata.filter(
          (data) =>
            new Date(data.date) >= startDate && new Date(data.date) < endDate
        );
        message=`Attendance report between ${idate} and ${filterval}`
      }
      if (filter==="month") {
         finaldata = attendancedata.filter((data) => data.date.slice(5, 7) == filterval);
        const date = new Date();
        date.setMonth(filterval - 1);
        var month = date.toLocaleString("en-US", {
          month: "long",
        });
  
        message=`Attendance report of ${month}`
        
  
      } else if (filter==="date") {
        finaldata = attendancedata.filter((data) => data.date == filterval);
        
      } else if (filter==="subject") {
        finaldata = attendancedata.filter((data) => data.subject == filterval);
      } else if(filter==="overall") {
        finaldata=attendancedata
        message="Overall Attendance Report"
      }
      if(finaldata.length==0)
      {
          status=false
          message="No attendance report available!"
      }
      
      return res.status(200).json({
          success:true,
          data: finaldata,
          subjectdata,
          message,
          status
        });
    }
    else
    {
     if(sem=="Sem1"){
        attendancedata=await Sem1Attendance.find({ teacher: teacher.name })
      }
      else if(sem=="Sem2"){
  
        attendancedata=await Sem2Attendance.find({ teacher: teacher.name })
      }
      else if(sem=="Sem3"){
  
        attendancedata=await Sem3Attendance.find({ teacher: teacher.name })
      }
      else if(sem=="Sem4"){
        attendancedata=await Sem4Attendance.find({ teacher: teacher.name })
      }
      if (filter === "multipledate") {
        const startDate = new Date(idate);
        const endDate = new Date(filterval);
        endDate.setDate(endDate.getDate() + 1); // Include end date in the filter
      
        finaldata = attendancedata.filter(
          (data) =>
            new Date(data.date) >= startDate && new Date(data.date) < endDate
        );
        message=`Attendance report between ${idate} and ${filterval}`
      }
      
  
      if (filter==="month") {
         finaldata = attendancedata.filter((data) => data.date.slice(5, 7) == filterval);
        const date = new Date();
        date.setMonth(filterval - 1);
        var month = date.toLocaleString("en-US", {
          month: "long",
        });
  
        message=`Attendance report of ${month}`
        
  
      } else if (filter==="date") {
        finaldata = attendancedata.filter((data) => data.date == filterval);
        
      } else if (filter==="subject") {
        finaldata = attendancedata.filter((data) => data.subject == filterval);
      } else if(filter==="overall") {
        finaldata=attendancedata
        message="Overall Attendance Report"
      }
      if(finaldata.length==0)
      {
          status=false
          message="No attendance report available!"
      }
      return res.status(200).json({
          success:true,
          data: finaldata,
          name: teacher.name,
          message,
          status
        });
    }
    
  } 
  
  catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};


const ScheduledClassReport = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    return res.status(200).json({
      success: true,
      data: await ScheduledClass.find({ name: teacher.name }),
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};

const ScheduledTestReport = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    return res.status(200).json({
      success: true,
      data: await ScheduledTest.find({ name: teacher.name }),
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};

const Assignment_Schedule_teacher = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    return res.status(200).json({
      success: true,
      data: await AssignmentsPosted.find({ teacher: teacher.name }),
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};


const StudyMaterial_Posted = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    return res.status(200).json({
      success: true,
      data: await StudyMaterial.find({ teacher: teacher.name }),
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
};

const GetAssignmentSubmitt = async (req, res) => {
  const token = req.headers["x-access-token"];
  try{
    const decoded = jwt.verify(token, "secret1234");
    const Teacher_id = decoded.Teacher_id;
    const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
    return res.status(200).json({
      success: true,
      data: await SubmittedAssignment.find({}),
      name: teacher.name
    });
  } catch (error) {
    
    res.json({ status: "error", error: "invalid token" });
  }
 
};
const assignment_s_submited = async(req,res)=>{

  const token = req.headers["x-access-token"];
  const val = req.params.id
  
 try {
   const decoded = jwt.verify(token, "secret1234");
   const Teacher_id = decoded.Teacher_id;
   const teacher = await Teacher.findOne({ Teacher_id: Teacher_id });
   return res.status(200).json({
     success: true,
     data: await SubmittedAssignment.find({assignment_id:val }),
   });
 } catch (error) {
   
   res.json({ status: "error", error: "invalid token" });
 }
}

const createsemsubjects=async(req,res)=>{
  const {subjects}=req.body
  
  const semval=req.params.semvalue
 
  try
  {
    if(semval=="sem1")
    {
      
      const sem1=await sem1subjects.create({subjects})
      return res.status(200).json({success:true});

    }
    if(semval=="sem2")
    {
      const sem2=await sem2subjects.create({subjects})
      return res.status(200).json({success:true});

    }
    if(semval=="sem3")
    {
      const sem3=await sem3subjects.create({subjects})
      return res.status(200).json({success:true});

    }
    if(semval=="sem4")
    {
      const sem4=await sem4subjects.create({subjects})
      return res.status(200).json({success:true});

    }
  }
  catch(error)
  {
    res.status(400).json({ error: error.message });
  }
   
}

module.exports = {
  loginteacher,
  PatchTeacherChangePassword,
  RegisterTeacher,
  sem1Attendance,
  sem2Attendance,
  sem3Attendance,
  sem4Attendance,
  SemAttendanceReport,

  ScheduledClassReport,
  ScheduledTestReport,
  Assignment_Schedule_teacher,
  StudyMaterial_Posted,
  GetAssignmentSubmitt,
  assignment_s_submited,
  UploadContent,
  Teacherverification,
  createsemsubjects
};