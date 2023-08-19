import React from 'react'
import { useState, useEffect, useRef, useReactToPrint } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Scheduledcommon.css"
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import List from './list';
import Navbar from "../Student_dashboard/Navbar";
import Subjectlist from '../subjectlist/Subjectlist';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
const Classreport = ({subjectdata}) => {
    const navigate = useNavigate();
    const [classes,setClasses]=useState([]);
    const [subject, setSubject] = useState("overall")
    const [visible, setVisible] = useState(false)
    const [loader, setloader] = useState(true)
    const [string, setString] = useState("")
    const fetchdata=async()=>{
      setVisible(false)
    setString("")
      setloader(true)
        const response=await fetch(`https://classopedia.onrender.com/class/schedule/info/${subject}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'x-access-token': localStorage.getItem('token'), //
            }})
            const json = await response.json()
            setClasses(json.data.reverse())
            setloader(false)
            setString(json.message)
            setVisible(json.status)
      }
    




  useEffect(()=>{
   if(subjectdata && subjectdata.length>0)
   {
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
        navigate("/Teacherdashboard");
      } 

    }
  }, [])


  return (
    <div className='height100vh'>
      <Navbar />
      {<h1 className='text-center-1'>Scheduled Classes </h1>}
      <div className='rep_1 '>
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
      </div>
      <div className='nothing_block'>{string}</div>
      {visible && <div className='overflowxauto'>
        <table className='table table-striped overflowxauto' id='mytable-1'>
          <thead className='heading_1'>
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
      </div>}
      {loader && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    </div>
  )
}

export default Classreport