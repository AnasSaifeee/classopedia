import React, { useEffect, useState } from 'react'
import {useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar.js";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
const ClassroomsStudents = ({subjectdata}) => {
    useEffect(()=>{
        if(subjectdata && subjectdata.length>0)
        {
            setloader(false)
        }
    },[subjectdata])
    const navigate=useNavigate()
    console.log(subjectdata)
    const [loader,setloader]=useState(true)
  return (
    <div className='page height100vh'>
    <Navbar />
    <div class="album py-5 text-center">
        <h1 className='container semheadline'></h1>
        <div class="container">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
               {subjectdata&&subjectdata.map((classroom)=>{
                return(
                    <>
                    <div class="col" onClick={()=>navigate(`/chat/${classroom}`)} >
                    <div class="card-body">
                        <h3>{classroom}</h3>
                    </div>
                </div>
                    </>
                )
               })}
                
           
              
                   
                
        
                   
        
               
           
            
                
            </div>
        </div>
    </div>
    {loader && (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
      // onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )}
</div>

  )
}

export default ClassroomsStudents