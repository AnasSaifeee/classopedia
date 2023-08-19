import React from 'react'
import { useState,useEffect,useRef,useReactToPrint } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import '../scheduledclass.css';
import autoTable from 'jspdf-autotable';
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import List from '../list';
import Navbar from '../../Teacher_dashboard/Navbar'
import { useParams } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
var XLSX = require("xlsx");

const Classreport = () => {
  const params=useParams()




    const navigate = useNavigate();
    let testb=false;
    let classb=false;
    const [classes, setClasses]=useState([]);
    const [visible, setVisible] = useState(false)
    const [string, setString] = useState("")
    if(params.teachschparam==="scheduledclassreport"){
        classb=true;
        testb=false;
    }
    if(params.teachschparam==="scheduledtestreport")
    {
      classb=false;
      testb=true;
    }
    const fetchdata=async()=>{
        const response=await fetch(`https://classopedia.onrender.com/${params.teachschparam}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'x-access-token': localStorage.getItem('token'), //
            }})
            const json = await response.json()
                setClasses(json.data.reverse())
                if(json.data.length != 0)
                {
                  setVisible(true)
              }else{
                setVisible(true)
                if(params.teachschparam=="scheduledclassreport")
                {
                  setString("No Classes Scheduled")
                  // setClasschedule(true)
                }
                else
                {
                  
                  setString("No Tests Scheduled")
                }

              }
      }
      useEffect(() => {
        if(params.teachschparam=="scheduledclassreport")
        {
          setString("Overall Scheduled Classes")
          // setClasschedule(true)
        }
        else
        {
          
          setString("Overall Scheduled Tests")
        }
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
  

  const exporttopdfhandler = () =>{
    const doc = new jsPDF()
    doc.text(string,70,10)
    autoTable(doc, { html: '#mytable'})
    doc.save(`${params.teachschparam}.pdf`)
  };
  return (
   <div className='height100percent'>
<Navbar />
 {<h1 className='text-center pt-3'>{string}</h1>}
 
 {visible ? <div className='tableblock'>
    <table className='table table-striped' id='mytable'>
      <thead className='heading-2'>
        <tr>
          <th>Professor</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
      <List classes={classes} />
      </tbody>
    </table>
  </div> :  <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
  {visible && testb ? <div className='text-center'>
  <ReactHTMLTableToExcel
                   id="butn"
                    className="btn btn-primary"
                    table="mytable"
                    filename="scheduledtestreport"
                    data-toggle="button"
                  aria-pressed="false"
                  autocomplete="off"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
   <button id='butn' class="btn btn-primary-1" onClick={exporttopdfhandler}>Download as pdf</button>
   </div> :<div className='text-center'>
  <ReactHTMLTableToExcel
                   id="butn"
                    className="btn btn-primary"
                    table="mytable"
                    filename="scheduledclassreport"
                    data-toggle="button"
                  aria-pressed="false"
                  autocomplete="off"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
   <button id='butn' class="btn btn-primary-1" onClick={exporttopdfhandler}>Download as pdf</button>
   </div>  }
   </div>
  )
}

export default Classreport