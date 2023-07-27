import React from 'react'
import { useState, useEffect, useRef, useReactToPrint } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import List from './list';
import Navbar from "../../Student_dashboard/Navbar";
import Subjectlist from '../../subjectlist/Subjectlist';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

var XLSX = require("xlsx");

const Classreport = ({subjectdata}) => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState([]);
  const [subject, setSubject] = useState("overall")
  const [loader, setloader] = useState(true)
  const [sem1, setSem1] = useState(false)
  const [sem2, setSem2] = useState(false)
  const [sem3, setSem3] = useState(false)
  const [sem4, setSem4] = useState(false)
  const [study, setStudy] = useState({})
  const [visible, setVisible] = useState(false)
  const [string, setString] = useState("")
  const [fetchedData, setFetchedData] = useState(false);

  const fetchdata = async () => {
    setVisible(false)
    setString("")
      setloader(true)
    const response = await fetch(`https://isd-b4ev.onrender.com/studymaterial_student/${subject}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'x-access-token': localStorage.getItem('token'),
      }
    })
    const json = await response.json()
  
           setMaterial(json.data.reverse())
            setloader(false)
            setString(json.message)
            setVisible(json.status)
  }

 
  


  // useEffect(() => {
  //   if (study.sem == 'Sem-1') {
  //     setSem1(true)
      

  //   }

  //   else if (study.sem == "Sem-2") {
  //     setSem2(true)
      
  //   }
  //   else if (study.sem == "Sem-3") {
  //     setSem3(true)
     
  //   }

  //   else if (study.sem == "Sem-4") {
  //     setSem4(true)
      
  //   }

  // }, [study])

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

  useEffect(() => {
    if (subjectdata && subjectdata.length > 0 && !fetchedData) {
      fetchdata();
      setFetchedData(true);
    }
  }, [subjectdata, fetchedData]);
   useEffect(()=>{
    if(subject && subjectdata.length>0)
    {
      fetchdata()

    }
    
   },[subject])
  return (
    <>
      <div className='height100vh'>
        <Navbar />
        {<h1 className='text-center-1'>Study Material</h1>}
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
                <th>File</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <List material={material}/>
            </tbody>
          </table>
        </div>}
      </div>
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

export default Classreport









