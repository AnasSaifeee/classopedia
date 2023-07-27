import React from "react";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate, useParams } from "react-router-dom";
import List from "./List";
import jsPDF from "jspdf";
import Navbar from "../Teacher_dashboard/Navbar";
import autoTable from "jspdf-autotable";
import "./filters.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SchList from "../Scheduling/SchList";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
var XLSX = require("xlsx");
const Filters = ({
 subjects
}) => {
  const navigate = useNavigate();
  const [subject, setsubject] = useState(false);
  const [multipledates,setmultipledates]=useState(false)
  const [date, setdate] = useState(false);
  const [month, setmonth] = useState(true);
  const [filter, setfilter] = useState("");
  const [filterval, setfilterval] = useState("");
  const [date1,setdate1]=useState("none")
  const [date2,setdate2]=useState(false)
  const [student, setstudent] = useState([]);
  const [Sem1, setSem1] = useState(false);
  const [Sem2, setSem2] = useState(false);
  const [Sem3, setSem3] = useState(false);
  const [Sem4, setSem4] = useState(false);
  const [visible, setVisible] = useState(true);
  const [visiblity, setVisiblity] = useState(false);
  const [loader,setloader]=useState(true)
  const [heading, setHeading] = useState("Overall Attendance Report");
  const params = useParams();
  const sem = params.semester;
  const semparam = sem.slice(0, 3) + sem.slice(4, 5);
  let newdate=new Date()
  let monthVal = (newdate.getMonth() + 1).toString().padStart(2, '0');
  console.log(monthVal)
  let semval;
  let json;
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

  const fetchdata = async () => {
    setVisible(false)
    if(filterval==="")
    {
      setfilter("month")
      setfilterval(monthVal)
    }

    const response = await fetch(
      `https://isd-b4ev.onrender.com/attendancereport/${semparam}/${filter}/${filterval}/${date1}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
     json = await response.json();
     setloader(false)
    setstudent(json.data);
    setVisible(true)
    setVisiblity(json.status)
    setHeading(json.message)


   
  };
let val;
  function handlechange(e) {
   val = e.target.value;
    console.log(val)  
    // if(val==="overall")
    // {
    //   window.location.reload()
    // }
    setfilter(val);
     setVisiblity(false)
     setHeading('')
    // if (val === "overall") {
    //   setdate(false);
    //   setmonth(false);
    //   setsubject(false);

    // }
    if(val==="multipledate")
    {

      setmultipledates(true)
      setdate(false);
      setmonth(false);
      setsubject(false);
    }
    if (val === "date") {
      setfilterval("")
      setdate(true);
      setmonth(false);
      setsubject(false);
      setmultipledates(false)
    }
    if (val === "month") {
      setdate(false);
      setmonth(true);
      setsubject(false);
      setmultipledates(false)
    }
    if (val === "subject") {
      setdate(false);
      setmonth(false);
      setsubject(true);
      setmultipledates(false)
      setfilterval(semval[0])
      fetchdata()
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/");
      } else
      {
        setfilterval(monthVal)
        fetchdata()
      }
    }
    switch (sem) {
      case "Sem-1":
        setSem1(true);
        break;
      case "Sem-2":
        setSem2(true);
        break;
      case "Sem-3":
        setSem3(true);
        break;
      case "Sem-4":
        setSem4(true);
    }
  }, [],[Sem1],[Sem2],[Sem3],[Sem4]);


  useEffect(()=>{
    if(filterval)
    {
      setloader(true)
   fetchdata()
    }
  },[filterval])

  useEffect(()=>{
  
      if(date2)
      {
        setloader(true)
      fetchdata()
      }
    
  },[date1])

  const exporttopdfhandler = () => {
    const doc = new jsPDF();
    doc.text(heading, 20, 10);
    autoTable(doc, { html: "#mytable" });
    doc.save("AttendanceReport.pdf");
  };
 
  return (
    <>
      <div className="height100vh">
        <div className=" mb-3">
          <Navbar />
          <select
            type="text"
            className="form-control-8"
            id="filter"
            name="filter"
            value={filter}
            onChange={handlechange}
          >
            <option value="month">Month</option>
            <option value="date" >Date</option>
            <option value="subject">Subject</option>
            <option value="multipledate">Between Two Dates</option>
          </select>
        </div>
        {date && (
          <form  >
            <div className="mb-3" id="date_block1" >
              <input
                type="date"
                className="form-control-12"
                id="formdate"
                value={filterval}
                onChange={(e) => setfilterval(e.target.value)}
              />
            </div>
          </form>
        )}
         
          {month && <form>
            <div className=" mb-3" id="date_block1">
              <select
                type="text"
                className="form-control-12"
                id="month"
                name="month"
                value={filterval}
                onChange={(e) => setfilterval(e.target.value)}
              >
                <option required>Select Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </form>}
        
        {subject && <form> <div className=" mb-3" id="date_block1">
              <select
               type="text"
               className="form-control-12"
             
                
                value={filterval} 
                onChange={(e) => setfilterval(e.target.value)}>
                <SchList semval={semval} setsubject={setsubject} />
              </select></div></form>}


              {multipledates && <div className="abc-1" style={{paddingLeft:"2%"}} >
              <div className="class-div">
                <label htmlFor="date" className="class-form-label" id="date">
                 Initial Date:
                </label>
                <input style={{width:"60%"}}
                  type="date"
                  className="class-form-control"
                  id="date-1"
                  aria-describedby="date"
                  value={date1}
                  onChange={(e) => setdate1(e.target.value)}
                />
              </div>
              <br />
              <div className="class-div">
                <label htmlFor="date" className="class-form-label" id="date">
                 Final Date:
                </label>
                <input style={{width:"60%"}}
                  type="date"
                  className="class-form-control"
                  id="date-1"
                  aria-describedby="date"
                  value={filterval}
                  onChange={(e) => {
                    setdate2(true)
                    setfilterval(e.target.value)
                  }}
                />
              </div>
            </div>}
        
        {visible && (
          <div>
            <h3 className="overall-1">{heading}</h3>
          </div>
        )}
        {visiblity &&(
          <>
            <div className="table-24 overflowxauto">
              <table className="table table-striped overflowxauto">
                <thead className="heading-2">
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  <List student={student} />
                </tbody>
              </table>
            </div>
            <div className="text-center">
            <ReactHTMLTableToExcel
                   id="butn"
                    className="btn btn-primary"
                    table="mytable"
                    filename="AttendanceReport"
                    data-toggle="button"
                  aria-pressed="false"
                  autocomplete="off"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
              <button
                type="button"
                class="btn btn-primary-1"
                id="butn"
                data-toggle="button"
                aria-pressed="false"
                autocomplete="off"
                onClick={exporttopdfhandler}
              >
                Download as pdf
              </button>
            </div>
          </>
        ) } 
        
        {loader &&  <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>}
        
      </div>
    </>
  );
};

export default Filters;