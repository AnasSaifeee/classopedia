import React from 'react'
import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import Navbar from "../Teacher_dashboard/Navbar";
import autoTable from 'jspdf-autotable';
import '../schedule_report/scheduledclass.css'
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import List from './list';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
var XLSX = require("xlsx");

const Studymaterial_report = () => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState([]);
  const [visible, setVisible] = useState(false)
  const [string, setString] = useState("")
  
  const fetchdata = async () => {
    const response = await fetch("https://classopedia.onrender.com/studymaterial_teacher", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'x-access-token': localStorage.getItem('token'), //
      }
    })
    const json = await response.json()
    setMaterial(json.data)
    
    if (json.data.length != 0) {
      setVisible(true)
      setString("Study Materials Posted ")
    } else {
      setVisible(true)
      setString("No Study Material Posted !")
    }

  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt.decode(token)
     
      if (!user) {
        localStorage.removeItem('token')
        navigate("/Teacherdashboard");
      } else {
        fetchdata()

      }
    }
  }, [])

  const exporttoexcelhandler = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(material);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "MyExcel.xlsx")
  };

  const exporttopdfhandler = () => {
    const doc = new jsPDF()
    doc.text("Overall Tests Scheduled", 70, 10)
    autoTable(doc, { html: '#mytable' })
    doc.save('table.pdf')
  };
  return (
    <>
      <div className='height100vh'>
        <Navbar />
        {<h1 className='text-center pt-3'>{string} </h1>}
        {visible ? <div className='overflowxauto'>
          <table className='table table-striped overflowxauto' id='mytable-5'>
            <thead className='heading-2'>
              <tr>
                <th>Professor</th>
                <th>Subject</th>
                <th>Semester</th>
                <th>Date</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              <List material={material} />
            </tbody>
          </table>
        </div> : <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>}

        {/* {visible && <div className='text-center'>
   <button id='butn' class="btn btn-primary" onClick={exporttoexcelhandler}>Download in excel</button>
   <button id='butn' class="btn btn-primary-1" onClick={exporttopdfhandler}>Download in pdf</button>
   </div>} */}
      </div>
    </>
  )
}

export default Studymaterial_report