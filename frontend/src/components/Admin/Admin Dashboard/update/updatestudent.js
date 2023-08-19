import React, { useEffect, useState } from 'react'
import Navbar from "../../../Admin Dashboard/Navbar"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "./update.css"
import { useNavigate } from 'react-router-dom';
function StudentUpdate() {
    const navigate = useNavigate();
    const [enrollNum, setenrollNum] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNum, setContactNumber] = useState('');
    const [rollNum, setRollNo] = useState('');
    const [semester, setSemester] = useState('');
    const [loader, setloader] = useState(false);
    const [visible, setvisible] = useState(false)
    const [message, setmessage] = useState(true)
    const [success, setsuccess] = useState(false)
    const fetchStudentDetails = () => {
        if (enrollNum) {
            document.getElementById("input-12").style.borderColor = "black";
            document.getElementById("input-12").style.backgroundColor = "white";

            fetch(`https://classopedia.onrender.com/api/students/${enrollNum}`)
                .then(response => response.json())
                .then(data => {

                    setloader(false)
                    setvisible(data.success)
                    setmessage(data.success)
                    setName(data.student.name);
                    setEmail(data.student.email);
                    setContactNumber(data.student.contactNum);
                    setRollNo(data.student.rollNum);
                    setSemester(data.student.semester);
                })
                .catch(error => console.error('Error fetching student details:', error));
        } else {
            document.getElementById("input-12").style.borderColor = "red";
            document.getElementById("input-12").style.backgroundColor = "pink";
        }
    };



    const updateStudentDetails = () => {
        if (name && email && contactNum && rollNum && semester) {
            setloader(true)
            const updatedStudent = {
                name,
                email,
                contactNum,
                rollNum,
                semester
            };

            fetch(`https://classopedia.onrender.com/api/students/${enrollNum}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            })
                .then(response => response.json())
                .then(data => {
                    setloader(false)
                    setsuccess(data.success)
                    setTimeout(() => {

                        setsuccess(false)
                        navigate("/admindashboard");
                    }, 2500);
                })
                .catch(error => console.error('Error updating student details:', error));
        } else {
            if (!name) {
                document.getElementById("name-1").style.borderColor = "red";
                document.getElementById("name-1").style.backgroundColor = "pink";
            } else {
                document.getElementById("name-1").style.borderColor = "black";
                document.getElementById("name-1").style.backgroundColor = "white";
            }

            if (!email) {
                document.getElementById('email-1').style.borderColor = "red";
                document.getElementById('email-1').style.backgroundColor = "pink";
            } else {
                document.getElementById('email-1').style.borderColor = "black";
                document.getElementById('email-1').style.backgroundColor = "white";
            }

            if (!contactNum) {
                document.getElementById('contact-1').style.borderColor = "red";
                document.getElementById('contact-1').style.backgroundColor = "pink";
            } else {
                document.getElementById('contact-1').style.borderColor = "black";
                document.getElementById('contact-1').style.backgroundColor = "white";
            }

            if (!rollNum) {
                document.getElementById('rollno-1').style.borderColor = "red";
                document.getElementById('rollno-1').style.backgroundColor = "pink";
            } else {
                document.getElementById('rollno-1').style.borderColor = "black";
                document.getElementById('rollno-1').style.backgroundColor = "white";
            }

            if (!semester) {
                document.getElementById('sem-1').style.borderColor = "red";
                document.getElementById('sem-1').style.backgroundColor = "pink";
            } else {
                document.getElementById('sem-1').style.borderColor = "black";
                document.getElementById('sem-1').style.backgroundColor = "white";
            }

        }

    };
    return (
        <div className='height100vh'>
            <Navbar />
            <div className='text-center mt-2'>
                Student Enrollment Number:
                <input
                    type="text"
                    className="class-form2-control"
                    id='input-12'
                    value={enrollNum}
                    onChange={(e) => setenrollNum(e.target.value)}
                />
                <div className='text-center' id='prof_block'>
                    <button class="btn btn-primary " onClick={fetchStudentDetails}>Update Details</button>
                </div>
            </div>
            {!message && <h1 className='user-not-found' >User Not Found</h1>}
            {visible && <div className='text-center' id='abcy'>
                <div>
                    Name:
                    <div>
                        <input
                            type="text"
                            className="class-form1-control"
                            id="name-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    Email:
                    <div>
                        <input
                            type="text"
                            className="class-form1-control"
                            id='email-1'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                </div>
                <div>
                    Contact no.:
                    <div>
                        <input
                            type="text"
                            className="class-form1-control"
                            id='contact-1'
                            value={contactNum}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </div>

                </div>
                <div>
                    Roll No:
                    <div>
                        <input
                            type="text"
                            className="class-form1-control"
                            id='rollno-1'
                            value={rollNum}
                            onChange={(e) => setRollNo(e.target.value)}
                        />
                    </div>

                </div>
                <div>
                    Semester:
                    <div>
                        <input
                            type="text"
                            className="class-form1-control"
                            id='sem-1'
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        />
                    </div>
                </div>
                <div className='text-center' id='prof_block'>
                    <button class="btn btn-primary" onClick={updateStudentDetails}>Save</button>
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
                    <h4>Details Updated</h4>
                </div>
            </div>}
        </div>
    );
}

export default StudentUpdate