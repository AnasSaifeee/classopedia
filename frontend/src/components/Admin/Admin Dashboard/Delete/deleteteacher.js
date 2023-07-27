import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Navbar from '../../../Admin Dashboard/Navbar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function DeleteTeacher() {
    let navigate = useNavigate()
    const [_id, set_id] = useState('');
    const [Teacher_id, setTeacher_id] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNum, setcontactNum] = useState('');
    const [loader, setloader] = useState(false);
    const [visible,setvisible]=useState(false)
    const [message,setmessage]=useState(true)
    const [success,setsuccess]=useState(false)

    const fetchTeacherDetails = () => {
        if(Teacher_id){
            document.getElementById("input-12").style.borderColor = "black";
            document.getElementById("input-12").style.backgroundColor = "white";
            fetch(`https://isd-b4ev.onrender.com/api/teachers/${Teacher_id}`)
                .then(response => response.json())
                .then(data => {
                    setloader(false)
                    setvisible(data.success)
                    setmessage(data.success)
                    set_id(data.teacher.Teacher_id);
                    setName(data.teacher.name);
                    setEmail(data.teacher.email);
                    setcontactNum(data.teacher.contactNum);
                })
                .catch(error => console.error('Error fetching student details:', error));
        }else{
            document.getElementById("input-12").style.borderColor = "red";
            document.getElementById("input-12").style.backgroundColor = "pink";
    
        }
    }


    const deleteTeacher = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this teacher?');
        if (confirmed) {
            setloader(true)
        try {
            const response = await fetch(`https://isd-b4ev.onrender.com/api/teachers/${Teacher_id}`, {
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
            <Navbar/>
            <div className='text-center mt-3'>
                Teacher Id:
                <input
                    type="text"
                    className="class-form2-control"
                    id='input-12'
                    value={Teacher_id}
                    onChange={(e) => setTeacher_id(e.target.value)}
                />
                <div className='text-center' id='prof_block'>
                    <button id='butn' class="btn btn-primary" onClick={fetchTeacherDetails}>Show Profile</button>
                </div>
            </div>
            {!message && <h1 className='user-not-found' >User not found</h1>}
            {visible &&  <div class="emp-profile">
                <div className='pblock'>
                    <form method="post">
                        <div className='photo_block'>
                            <div class="profile-head">
                                <h2>
                                    {name}
                                </h2>
                            </div>
                        </div>
                        <div class="teacherInfo">
                            <div className='keys'>
                                <p>User Id: </p>
                                <p>Email: </p>
                                <p>Phone: </p>
                            </div>
                            <div className='values'>
                                <p> {_id}</p>
                                <p>{email}</p>
                                <p>{contactNum}</p>
                            </div>
                            <div className='teacherinfo2'>
                                <p>User Id: </p>
                                <h6>{Teacher_id}</h6>
                                <p>Email: </p>
                                <h6>{email}</h6>
                                <p>Phone: </p>
                                <h6>{contactNum}</h6>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='text-center' id='prof_block'>
                    <button id='butn' class="btn btn-primary" onClick={deleteTeacher}>Delete</button>
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
    )
}

export default DeleteTeacher