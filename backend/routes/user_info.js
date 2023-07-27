const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Students = require("../models/studentdata");
const Teachers = require("../models/teacherdata");
const ChatMessage=require("../models/Chats")
const { Adminregister, Adminlogin, AdClassesTaken,Getteacherdata } = require("../controllers/admincontrol")
const {
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
} = require("../controllers/teachercontrol");

const {
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
} = require("../controllers/studentscontrol");

const {
  Postscheduleclass,
  PostscheduleTest,
  PostUploadassignment,
  PostStudyMaterial,
  ForgetPassword
} = require("../controllers/emailcontrol");

const { json } = require("body-parser");
const StudyMaterial = require("../models/StudyMaterial");
const router = express.Router();

//-----------admin--------------------
router.post("/adminregister", Adminregister);
router.post("/adminlogin", Adminlogin);

//-----------login-student------------
router.post("/login", login);

//Dashboard - student (get)
router.get("/dashboard", Getdashboard);
router.get("/attendance/student/:subjectval", Studentattendance);

//student-change password
router.patch("/dashboard/changepassword", PatchChangepassword);

//student register
router.post("/register", register);
router.post("/registerall", registerall);


//------------------Teacher Login-------------------
router.post("/loginteacher", loginteacher);

//teacher-change password
router.patch("/Teacherdashboard/changepassword", PatchTeacherChangePassword);

//register teacher
router.post("/registerteacher", RegisterTeacher);

router.get("/teacherverify", Teacherverification);
router.post("/scheduleclass", Postscheduleclass);
router.post("/scheduletest", PostscheduleTest);

//............
router.post("/attendance/Sem1", sem1Attendance);
router.post("/attendance/Sem2", sem2Attendance);
router.post("/attendance/Sem3", sem3Attendance);
router.post("/attendance/Sem4", sem4Attendance);
router.get("/attendancereport/:sem/:filter/:filterval/:idate", SemAttendanceReport);
router.get("/scheduledclassreport", ScheduledClassReport);
router.get("/scheduledtestreport", ScheduledTestReport);
router.post("/sem1subjects/:semvalue",createsemsubjects)
router.get("/teacherdata",Getteacherdata)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'deipwedom',
  api_key: '991369626898443',
  api_secret: 'pFRw01J4XEiH6ZYOR5UlhrntV_M'
});

const storage = multer.diskStorage({});

const upload = multer({ storage });

router.post("/upload/assignment", upload.single('pdf'), PostUploadassignment);

router.post("/upload/studymaterial", upload.single('pdf'), PostStudyMaterial);

router.post("/assignmentsubmit", upload.single('pdf'), PostAssignmentSubmitt);

//..student
router.get("/class/schedule/info/:subjectval", Classes_Scheduled);
router.get("/testschedule/:subjectval", Test_Scheduled);
router.get("/assignmentreportstudent/:subjectval", Assignment_Schedule_student);
router.get("/studymaterial_student/:subjectval", StudyMaterial_Posted_Students);

router.get("/assignmentreportteacher", Assignment_Schedule_teacher);
router.get("/studymaterial_teacher", StudyMaterial_Posted);
router.get("/notifications/assignment", GetAssignments);
router.get("/notifications/classes", classnotification);
router.get("/notifications/tests", testnotification);

router.get("/assignmentsubmit", GetAssignmentSubmitt)

//admin
router.get('/classestaken/:teacher', AdClassesTaken)

router.get('/assignmentsubmited', assignmentsubmited)
router.get('/submissions/:id', assignment_s_submited)
router.post("/forgetpassword/:user",ForgetPassword)
router.get('/api/students/:enrollNum', (req, res) => {
  const enrollNum = req.params.enrollNum;
  Students.findOne({ enrollNum }, (error, student) => {
    if (error) {
      res.status(500).json({
         error: 'Internal server error',
         success:false
         });
    } else if (!student) {
      res.status(404).json({ error: 'Student not found',
      success:false
     });
    } else {
      res.status(200).json(
        {
          success:true,
          student
        }
      );
    }
  });
});


router.put('/api/students/:enrollNum', (req, res) => {
  const enrollNum = req.params.enrollNum;
  const updatedStudent = req.body;
  console.log(enrollNum,updatedStudent)
  Students.findOneAndUpdate(
    { enrollNum },
    updatedStudent,
    { new: true },
    (error, student) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error',
      success:false });
      } else if (!student) {
        res.status(404).json({ error: 'Student not found',
        success:false
       });
      } else {
        res.json({
          success:true
        });
      }
    }
  );
});

router.delete('/api/students/:enrollNum', async (req, res) => {
  try {
    const enrollNum = req.params.enrollNum;
    const student = await Students.findOneAndDelete({ enrollNum });
    
    if (!student) {
      res.status(404).json({ error: 'Student not found',
    success:false });
    } else {
      res.status(200).json({ message: 'Student deleted successfully',
      success:true
     });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/api/teachers/:Teacher_id', (req, res) => {
  const Teacher_id = req.params.Teacher_id;

  Teachers.findOne({ Teacher_id }, (error, teacher) => {
    if (error) {
      res.status(500).json({
         error: 'Internal server error',
         success:false
         });
    } else if (!teacher) {
      res.status(404).json({ error: 'Teacher not found',
      success:false
     });
    } else {
      res.status(200).json(
        {
          success:true,
          teacher
        }
      );
    }
  });
});


router.put('/api/teachers/:Teacher_id', (req, res) => {
  const Teacher_id = req.params.Teacher_id;
  const updatedTeacher = req.body;
  Teachers.findOneAndUpdate(
    { Teacher_id },
    updatedTeacher,
    { new: true },
    (error, teacher) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' ,success:false});
      } else if (!teacher) {
        res.status(404).json({ error: 'Teacher not found' ,success:false});
      } else {
        res.json({
          success:true
        });
      }
    }
  );
});

router.delete('/api/teachers/:Teacher_id', async (req, res) => {
  try {
    const Teacher_id = req.params.Teacher_id;
    const teacher = await Teachers.findOneAndDelete({ Teacher_id });
    console.log(teacher);
    if (!teacher) {
      res.status(404).json({ error: 'Teacher not found',
    success:false });
    } else {
      res.json({ message: 'teacher deleted successfully',success:true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/room/:room/messages', (req, res) => {
  console.log("request rcvd")
  const room = req.params.room;

  ChatMessage.find({ room })
    .sort({ timestamp: 1 }) // Sort messages by timestamp in ascending order
    .exec((err, messages) => {
      if (err) {
        console.error('Error retrieving chat messages from the database:', err);
        res.status(500).json({ error: 'Failed to retrieve chat messages' });
      } else {
        res.json(messages);
      }
    });
});
module.exports = router;