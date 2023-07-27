import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./attendance.css";
import List from "./List";
import Navbar from "../Teacher_dashboard/Navbar.js";
import { useNavigate,useParams } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import SchList from "../Scheduling/SchList";
const Attendance = ({subjects,studentsattend,render,setrender,subjectdata}) => {
  const params=useParams()
  const navigate = useNavigate();
  const [students, setstudents] = useState([]);
  const [status, setstatus] = useState({});
  const [subject, setsubject] = useState("");
   const[Sem1,setSem1]=useState(false)
  const[Sem2,setSem2]=useState(false)
  const[Sem3,setSem3]=useState(false)
  const[Sem4,setSem4]=useState(false)
  const [success, setsuccess] = useState(false)
  const [visible, setVisible] = useState(false)
  const sem = params.semester ;
  const semparam=sem.slice(0,3) + sem.slice(4,5)
  const [loader,setloader]=useState(false)
  const [teacher,setTeacher]=useState("")
  let semval;
if(Sem1)
{
   semval = subjects.Sem1;
}
else if(Sem2)
{
   semval = subjects.Sem2;
}
else if(Sem3)
{
   semval = subjects.Sem3;
}
else if(Sem4)
{
   semval = subjects.Sem4;
}
useEffect(()=>{
  if(semval && semval.length>0)
  {
    setsubject(semval[0])
  }
},[semval])
  
  useEffect(() => {
    setstudents(studentsattend.filter((data) => data.semester == sem));
    setVisible(true)
  },[studentsattend])
  

  useEffect(() => {
      switch(sem)
      {
        case "Sem-1":
            setSem1(true)
            break;
        case "Sem-2":
            setSem2(true)
            break;
        case "Sem-3":
            setSem3(true)
            break
        case "Sem-4":
            setSem4(true)
      }
    

  }, [],[Sem1],[Sem2],[Sem3],[Sem4])

  useEffect(()=>{

  },[semval])


  async function Submit(e) {
  
    if(subject) {
      setloader(true)
      e.preventDefault()
      const response = await fetch(`https://isd-b4ev.onrender.com/attendance/${semparam}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'x-access-token': localStorage.getItem('token'), //
        },
        body: JSON.stringify({
          subject,
          status,
        }),
      }).then(async (response) => {
        let dataa = await response.json();
        setrender(!render)
        setsuccess(dataa.success)
      });
      setTimeout(() => {
        setsuccess(false)
        navigate("/Teacherdashboard");
      }, 2500);
    }
    else{
  
        document.getElementById("subject").style.borderColor = "red"
        document.getElementById("subject").style.backgroundColor = "pink"
        document.getElementById("subject").classList.add("shaking")
        setTimeout(() => {
          document.getElementById("subject").classList.remove("shaking")
        }, 1000);
    }

  }
  useEffect(()=>{
    setloader(false)
    },[success])
  return (
    <>
      <div className='height100vh'>
        <div className="attendencebody">
          <Navbar />
          <h1 className="atte1">{sem} Attendance</h1>
          <div className="selectsubjectcontainer">
              <select
                type="text"
                className="form-control mt-2 shadow-none"
                id="subject"
                name="subject"
                
                value={subject}
                onChange={(e) => setsubject(e.target.value)}>
                <SchList semval={semval} setsubject={setsubject} />
              </select></div>
         
          {visible ? <div className="table-1">
            <table className="table table-striped">
              <thead className="heading-1">
                <tr>
                  <th>Student</th>
                  <th>Present</th>
                </tr>
              </thead>
              <tbody>
                <List students={students} status={status} setstatus={setstatus} />
              </tbody>
            </table>
          </div> : <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop> }
          {visible && <div className="button-1">
            <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off" onClick={Submit}>Save</button>
          </div>}
        </div>
        {success && <div className="container-fluid blacky">
          <div className="success">
            <div classNam="wrappertick"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            </div>
            <h4>Attendance Saved</h4>
          </div>
        </div>}
        {loader&&<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
      </div>
    </>
  );
};

export default Attendance;
