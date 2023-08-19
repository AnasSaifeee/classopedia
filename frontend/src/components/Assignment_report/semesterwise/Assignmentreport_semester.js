import React, { memo } from 'react';
import { useState, useEffect, useRef, useReactToPrint } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import "../../schedule_report/Scheduledcommon.css";
import List from './list';
import Navbar from "../../Student_dashboard/Navbar";
import Subjectlist from '../../subjectlist/Subjectlist';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import List2 from './list2';
let user;
const Assignmentreport = ({subjectdata}) => {
  const navigate = useNavigate();
  const [loader, setloader] = useState(true)
  const [assignments, setAssignments] = useState([]);
  const [subject, setSubject] = useState("overall")
  const [fetchedData, setFetchedData] = useState(false);
  const [visible, setVisible] = useState(false)
  const [string, setString] = useState("")
  const [success, setsuccess] = useState(false)
  const [run,setrun]=useState("")
  const [files, setfile] = useState({ _id: "", name: "" })
  const [removefileid, setremovefileid] = useState("")
  const [temp, setTemp] = React.useState({ id: "", name: "" })
  const [assignment_id, setassignment_id] = useState("")
  const [check, setcheck] = useState([])
   const [file, setsubmitfile] = useState(null)
   const [expiredAssignments,setexpiredAssignments]=useState([])
   useEffect(() => {
    if (subjectdata && subjectdata.length > 0 && !fetchedData) {
      fetchdata();
      setFetchedData(true);
    }
  }, [subjectdata, fetchedData]);

  useEffect(() => {
    if (subject && subjectdata.length>0) {
      fetchdata();
    }
  }, [subject]);

  useEffect(() => {
    if (run !== "" && subjectdata.length>0) {
      fetchdata();
    }
  }, [run]);


  async function fetchdata() {
    setloader(true);
    setString("")
    setVisible(false)
    const response1 = await fetch(`https://classopedia.onrender.com/assignmentreportstudent/${subject}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'x-access-token': localStorage.getItem('token'),
      },
    });
    const json1 = await response1.json();
    console.log(json1)
    setloader(false);
    setAssignments(json1.data.reverse());
    setVisible(json1.status);
    if (json1.expiredAssignments) {
      setexpiredAssignments(json1.expiredAssignments.reverse());
    }
    setString(json1.message);
  }
    
   
 

  


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      user = jwt.decode(token)
      if (!user) {
        localStorage.removeItem('token')
        navigate("/dashboard");
      } 
    }
  }, [])
  const AssignmentSubmit = async (e, _id) => {
    setloader(true)
    e.preventDefault()
    const formData = new FormData(); 
    formData.append("pdf", file); 
    formData.append('_id', _id);
    formData.append('files', localStorage.getItem(_id));
    formData.append('enrollNum', user.enrollNum);
    formData.append('subject', subject);
    const response = await fetch("https://classopedia.onrender.com/assignmentsubmit", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
 
      body: formData
    })
    const data = await response.json();
    
    if (data.success) {
      setloader(false)
      setrun(data._id)
      setsuccess(data.success)
      setTimeout(() => {
        setsuccess(false)
      }, 2500);
      localStorage.removeItem(_id)
      setremovefileid(_id)
      setTemp("")
    }
   
  }

  return (
    <>
      <div className='height100vh'>
        <Navbar />
        {<h1 className='text-center-1'>Assignments Posted </h1>}
      
        <form className='repform1' >
      <select
                  type="text"
                  className="form-control shadow-none"
                  id="subject1"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}>
                  <option value={"overall"} >Overall</option>
                  <Subjectlist subjectdata={subjectdata} /> 
                </select>
        </form>

        <div className='nothing_block'>{string}</div>
        {visible && <div classname="main" id="mytableblock-1">
          <table className='table table-striped' id='mytable-1'>
            <thead className='heading_1'>
              <tr>
                <th>Date</th>
                <th>Professor</th>
                <th>Subject</th>
                <th>Deadline</th>
                <th>Assignment</th>
                <th>Upload</th>
              </tr>
            </thead>
            <tbody>
              <List key={assignments.id} assignments={assignments} files={files} setfile={setfile} file={file} setsubmitfile={setsubmitfile} AssignmentSubmit={AssignmentSubmit} removefileid={removefileid} setremovefileid={setremovefileid} temp={temp} setTemp={setTemp} setassignment_id={setassignment_id} enrollNum={user.enrollNum}/>
              {expiredAssignments && <List2 expiredAssignments={expiredAssignments} enrollNum={user.enrollNum} />}
            </tbody>
          </table>
        </div>}
      </div>
      {success && <div className="container-fluid blacky">
        <div className="success">
          <div classNam="wrappertick"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          </div>
          <h4>Assignment Submitted</h4>
        </div>
      </div>}
      {loader && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    </>
  )
}

export default memo(Assignmentreport);