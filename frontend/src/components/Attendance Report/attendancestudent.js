import React from 'react'
import { useState, useEffect, useRef, useReactToPrint } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import './attendance_report.css'
import List from './list2';
import Navbar from "../Student_dashboard/Navbar";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Subjectlist from '../subjectlist/Subjectlist';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
var XLSX = require("xlsx");

const Attendancereport = ({subjectdata}) => {
  const navigate = useNavigate();
  const [student, setstudent] = useState([]);
  const [attendmaterial, setAttendmaterial] = useState([]);
  var [string, setString] = useState("Overall Attendance Report")
  var [string2, setString2] = useState("")
  const [sem1, setSem1] = useState(false)
  const [sem2, setSem2] = useState(false)
  const [sem3, setSem3] = useState(false)
  const [sem4, setSem4] = useState(false)
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [visible, setVisible] = useState(false)
  const [show, setshow] = useState(false)
  const [loader, setloader] = useState(true)
  console.log("runnibg")
  const fetchdata = async () => {
    const response = await fetch(`https://classopedia.onrender.com/attendance/student/${subject}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'x-access-token': localStorage.getItem('token'), //
      }
    })
    const json = await response.json()
    setVisible(json.status)
    setString(json.message)
    setloader(false)
    setAttendmaterial(json.data.reverse())
   
  }

 

  useEffect(()=>{
    if(subjectdata && subjectdata.length>0)
    {
     setSubject(subjectdata[0])
     fetchdata()
    }
   },[subjectdata])
 
   useEffect(()=>{
     setloader(true)
      fetchdata()
   },[subject])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt.decode(token)
      
      if (!user) {
        localStorage.removeItem('token')
        navigate("/dashboard");
      } 

    }
  }, [])

 

  const exporttoexcelhandler = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(attendmaterial);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "MyExcel.xlsx")
  };

  const exporttopdfhandler = () => {
    const doc = new jsPDF()
    doc.text(`${string}`, 20, 10)
    autoTable(doc, { html: '#mytable-2' })
    doc.save('AttendanceReport.pdf')
  };

  return (
    <>
      <div className='height100vh'>
        <Navbar />
        {<h3 className='text-center' id='string-12'>Subject Wise Attendance Report</h3>}
        <div className='rep_1 '>
       
        <form className='repform1' >
      <select
                  type="text"
                  className="form-control shadow-none"
                  id="subject1"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}>
                  <Subjectlist subjectdata={subjectdata} /> 
                </select>
        </form>

        </div>
        <div className='nothing_block'>{string}</div>
        <br></br>
        {visible && <div className='overflowxauto'>
          <table className='table table-striped overflowxauto' id='mytable-2'>
            <thead className='heading-2'>
              <tr>

                <th>subject</th>
                <th>Date</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              <List attendmaterial={attendmaterial} />
            </tbody>
          </table>
        </div>} 
        {loader && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}

        {visible && <div className='text-center  button_block8'>
        <ReactHTMLTableToExcel
                   id="butn"
                    className="btn btn-primary"
                    table="mytable-2"
                    filename="AttendanceReport"
                    data-toggle="button"
                  aria-pressed="false"
                  autocomplete="off"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
          <button id='butn' class="btn btn-primary-1" onClick={exporttopdfhandler}>Download in pdf</button>
        </div>}
      </div>
    </>
  )
}

export default Attendancereport