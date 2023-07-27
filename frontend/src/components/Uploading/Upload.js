import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../Teacher_dashboard/Navbar";
import "../Study Material/study.css";
import { useNavigate, useParams } from "react-router-dom";
import './Upload.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import SchList from "../Scheduling/SchList";
function Upload({ teacher, subjects, setrender,render }) {
  const params = useParams()
  const navigate = useNavigate();
  const [assignparam, setAssignparam] = useState(false)
  const [file, setFile] = useState(null);
  const [subject, setsubject] = useState("");
  const [deadline, setdeadline] = useState("");
  const [description, setdescription] = useState("");
  const [success, setsuccess] = useState(false)
  const [Sem1, setSem1] = useState(false)
  const [Sem2, setSem2] = useState(false)
  const [Sem3, setSem3] = useState(false)
  const [Sem4, setSem4] = useState(false)
  const semester = params.semester;
  const [loader, setloader] = useState(false)


  let semval;
  if (Sem1) {
    semval = subjects.Sem1;
  }
  else if (Sem2) {
    semval = subjects.Sem2;
  }
  else if (Sem3) {
    semval = subjects.Sem3;
  }
  else if (Sem4) {
    semval = subjects.Sem4;
  }

 
  useEffect(()=>{
    if(semval && semval.length>0)
    {
      setsubject(semval[0])
    }
  },[semval])

  async function Upload(e) {
    
    
    if (assignparam) {
      if (deadline && subject && file) {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("subject", subject);
        formData.append("semester", semester);
        formData.append("teacher", teacher);
        formData.append("description", description);
        formData.append("deadline", deadline);

        setloader(true)
        const response = await fetch("https://isd-b4ev.onrender.com/upload/assignment" , {
          method: "POST",
          headers: {
            Accept: "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: formData,
        });

        const data = await response.json();
        setsuccess(data.success)
          setrender(!render)
        
        setTimeout(() => {

          setsuccess(false)
          navigate("/Teacherdashboard");
        }, 2500);
      }
    }
    if (!assignparam) {

      if (subject && file) {

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("subject", subject);
        formData.append("semester", semester);
        formData.append("teacher", teacher);
        formData.append("description", description);

        setloader(true)
        const response = await fetch("https://isd-b4ev.onrender.com/upload/studymaterial", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: formData,
        });

        const data = await response.json();
        setsuccess(data.success)
        
          setrender(!render)
        
        setTimeout(() => {

          setsuccess(false)
          navigate("/Teacherdashboard");
        }, 2500);
      }
    }

    else {
      if (!subject) {
        document.getElementById("subject").style.borderColor = "red"
        document.getElementById("subject").style.backgroundColor = "pink"
        document.getElementById("subject").classList.add("shaking")
        setTimeout(() => {
          document.getElementById("subject").classList.remove("shaking")
        }, 1000);
      }
      else {
        document.getElementById("subject").style.borderColor = "black"
        document.getElementById("subject").style.backgroundColor = "white"
      }

      if (assignparam) {
        if (!deadline) {

          document.getElementById("deadlne_blk-1").style.borderColor = "red"
          document.getElementById("deadlne_blk-1").style.backgroundColor = "pink"
          document.getElementById("deadlne_blk-1").classList.add("shaking")

          setTimeout(() => {
            document.getElementById("deadlne_blk-1").classList.remove("shaking")

          }, 1000);
        }
        else {
          document.getElementById("deadlne_blk-1").style.borderColor = "black"
          document.getElementById("deadlne_blk-1").style.backgroundColor = "white"
        }
      }



      if (!file) {
        alert("Please upload a file")
      }
    }


  }

  //--------------------
  useEffect(() => {
    if (params.postparam == 'assignment') {
      setAssignparam(true)
    }
    switch (semester) {
      case "Sem-1":
        setSem1(true)
        break;
      case "Sem-2":
        setSem2(true)
        break;
      case "Sem-3":
        setSem3(true)
        break
      case "Sem-4":
        setSem4(true)
    }
  }, [], [Sem1], [Sem2], [Sem3], [Sem4]);
  useEffect(() => {

  }, [semval])
  useEffect(() => {
    setloader(false)
  }, [success])

  
  return (
    <>
      <div className="uploadassignmentbody">
        <Navbar />
        <div className="uploadheading">
          {assignparam ? <h1>Upload Assignment</h1> : <h1>Upload Study Material</h1>}
        </div>

        <div className="uploadassignmentcontent">
          <div className="selectsubjectcontainer" style={{ width: '50vw', transform: 'translateX(-20%)' }}>
            <select
              type="text"
              className="form-control mt-2 shadow-none"
              id="subject"
              name="subject"

              value={subject}
              onChange={(e) => setsubject(e.target.value)}>
              <SchList semval={semval} setsubject={setsubject} />
            </select></div>
         
          {assignparam && <div className="mb-3 " id="deadline_block">
            <label className="form-label deadline">Deadline</label>
            <input
              type="date"
              className="time_block12"
              id="deadlne_blk-1"
              value={deadline}
              onChange={(e) => setdeadline(e.target.value)}
            />
          </div>}
          {/* upload file */}

          <div className="file-card">
            <div className="file-inputs">
              <input type="file" accept=".pdf, .jpg, .png, .ppt, .doc" onChange={(e) => setFile(e.target.files[0])} />
              <button>Select File</button>
            </div>
            {file && <div className="fileuploaddisplay">{file.name}</div>}
            <div className="infocontent">
              <p className="main">Supported files</p>
              <p className="info">PDF, DOC, JPG, PNG, PPT</p>
            </div>
          </div>


          {/* text box */}

          <div class="mb-3 mt-4 descriptionbody">
            <label for="exampleFormControlTextarea1" class="form-label">
              Discription
            </label>
            <textarea
              class="form-control"
              placeholder="optional"
              id="text-area"
              rows="3"
              value={description}
              onChange={(e) => setdescription(e.target.value)}></textarea>
          </div>
          <div className="text-center">
            <button className="submitbutton mt-3 " onClick={Upload}>
              Post
            </button>
          </div>

          {/* submit button */}


        </div>
      </div>
      {success && <div className="container-fluid blacky">
        <div className="success">
          <div classNam="wrappertick"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          </div>
          {assignparam ? <h4>Assignment Posted</h4> : <h4>Study Material Posted</h4>}
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
  );
}

export default Upload;
