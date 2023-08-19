import React, { useState } from 'react'
import Navbar from '../../../Admin Dashboard/Navbar';
import { useNavigate } from "react-router-dom"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
function DeleteStudent() {
    let navigate = useNavigate()
    const [enrollNum, setenrollNum] = useState('');
    const [stuenrollNum, setstuenrollNum] = useState(''); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNum, setContactNumber] = useState('');
    const [rollNum, setRollNo] = useState('');
    const [semester, setSemester] = useState('');
    const [loader, setloader] = useState(false);
    const [visible,setvisible]=useState(false)
    const [message,setmessage]=useState(true)
    const [success,setsuccess]=useState(false)
    const fetchStudentDetails = () => {
        if(enrollNum){
            document.getElementById("input-12").style.borderColor = "black";
            document.getElementById("input-12").style.backgroundColor = "white";
            fetch(`https://classopedia.onrender.com/api/students/${enrollNum}`)
                .then(response => response.json())
                .then(data => {
                    setloader(false)
                    setvisible(data.success)
                    setmessage(data.success)
                    setName(data.student.name);
                    setstuenrollNum(data.student.enrollNum);
                    setEmail(data.student.email);
                    setContactNumber(data.student.contactNum);
                    setRollNo(data.student.rollNum);
                    setSemester(data.student.semester);
                })
                .catch(error => console.error('Error fetching student details:', error));
        }else{
             document.getElementById("input-12").style.borderColor = "red";
                document.getElementById("input-12").style.backgroundColor = "pink";
        }
    }


    const deleteStudent = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this teacher?');
        if (confirmed) {
            setloader(true)
        try {
            const response = await fetch(`https://classopedia.onrender.com/api/students/${enrollNum}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            setloader(false)
            console.log(data)
                setsuccess(data.success)
                setTimeout(() => {

                    setsuccess(false)
                    navigate("/");
                  }, 2500);
            // navigate("/admindashboard")
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
    };


    return (
        <div className='height100vh'>
            <Navbar />
            <div className='text-center mt-3'>
                Student Enrollment Number:
                <input
                    type="text"
                    className="class-form2-control"
                    id='input-12'
                    value={enrollNum}
                    onChange={(e) => setenrollNum(e.target.value)}
                />
                <div className='text-center' id='prof_block'>
                    <button id='butn' class="btn btn-primary" onClick={fetchStudentDetails}>Show Profile</button>
                </div>
                </div>
            {!message && <h1 className='user-not-found'>User not found</h1>}
            {visible && <div class="emp-profile">
                    <div className='pblock'>
                        <form method="post">
                            <div className='photo_block'>
                                <div class="profile-head">
                                    <h2>
                                        {name}
                                    </h2>
                                    <h4>
                                        {stuenrollNum}
                                    </h4>
                                </div>
                            </div>
                            <div class="teacherInfo">
                                <div className='keys'>
                                    <p>Roll No. </p>
                                    <p>Email: </p>
                                    <p>Phone: </p>
                                </div>
                                <div className='values'>
                                    <p>{rollNum}</p>
                                    <p>{email}</p>
                                    <p>{contactNum}</p>
                                </div>
                                <div className='teacherinfo2'>
                                    <p>Roll No. </p>
                                    <h6>{rollNum}</h6>
                                    <p>Email: </p>
                                    <h6>{email}</h6>
                                    <p>Phone: </p>
                                    <h6>{contactNum}</h6>
                                    <p>semester: </p>
                                    <h6>{semester}</h6>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='text-center' id='prof_block'>
                        <button id='butn' class="btn btn-primary" onClick={deleteStudent}>Delete</button>
                    </div>
                </div>}

            
            {loader && <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
            >
              <CircularProgress color="inherit" />
            </Backdrop>}
            {success && <div className="container-fluid blacky">
        <div className="success">
          <div classNam="wrappertick"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          </div>
          <h4>User Deleted</h4>
        </div>
      </div>}
        </div>
    );
}


export default DeleteStudent