import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useEffect,useRef,useReactToPrint } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import './scheduledclass.css';
import autoTable from 'jspdf-autotable';
import '../Student_dashboard/Navbar';
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import List from './list';
import Navbar from '../Student_dashboard/Navbar';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
var XLSX = require("xlsx");

const Classreport = () => {
    const params=useParams()
    const[classschedule,setClasschedule]=useState(false)
    const navigate = useNavigate();
    const [classes,setClasses]=useState([]);
    const [visible, setVisible] = useState(false)
    const [string, setString] = useState("")  
    const newdate = new Date()
    const monthval = newdate.getMonth()+1;
    const day = newdate.getDate()
    const year = newdate.getFullYear()

    const fetchdata=async()=>{
        const response=await fetch(`https://classopedia.onrender.com/${params.schrparam}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'x-access-token': localStorage.getItem('token'), //
            }})
            const json = await response.json()
            let data = json.data

                setClasses(data.reverse())
                if(json.data.length != 0)
                {
                  setVisible(true)
              }else{
                setVisible(true)
                if(params.schrparam=="classschedule")
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
        if(params.schrparam=="classschedule")
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
            navigate("/dashboard");
          } else {
            fetchdata()
    
          }
        }
      }, [])
  

  
  return (
   <>
   <div className='height100vh'>
  <Navbar/>
 {<h1 className='text-center'>{string} </h1>}

  {visible ? <div className='tableblock'>
    <table className='table table-striped overflowxauto' id='mytable'>
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
  </div> : <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}

   </div>
   </>
  )
}

export default Classreport