import React, { useState } from 'react'
import { useEffect } from 'react'
import List from './List'
import Navbar from './Navbar'
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import './notifications.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Notifications = () => {
    const navigate = useNavigate();
    const[notification,setnotification]=useState("")
    const [teacher, setTeacher] = useState("")


    
    const fetchdata=async()=>{
        const response = await fetch("https://isd-b4ev.onrender.com/assignmentsubmit", {
      
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('token'), //
            }})
            const json = await response.json()
            setnotification(json.data.reverse())
            setTeacher(json.name)
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
        },[])
        
  return (
    <>
    <div className='height100vh'>
    <Navbar/>
    <div className="container notification ">
     {notification ? <List notification={notification} teacher={teacher} /> :  <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>} 
     </div>
     </div>
    </>
  )
}



export default Notifications