import React, { useEffect, useState } from 'react'
import Navbar from "../../../Admin Dashboard/Navbar"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

function TeacherUpdate() {
    const navigate = useNavigate();
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
                setName(data.teacher.name);
                setEmail(data.teacher.email);
                setcontactNum(data.teacher.contactNum);
            })
            .catch(error => console.error('Error fetching student details:', error));
        }else{
                document.getElementById("input-12").style.borderColor = "red";
                document.getElementById("input-12").style.backgroundColor = "pink";
            }
    };

    const updateTeacherDetails = () => {
        if(name && email && contactNum){
        setloader(true)
        const updatedStudent = {
            name,
            email,
            contactNum,
        };

        fetch(`https://isd-b4ev.onrender.com/api/teachers/${Teacher_id}`, {
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
        }else{
            if(!name){
                document.getElementById("name-1").style.borderColor = "red";
                document.getElementById("name-1").style.backgroundColor = "pink";
            }else{
                document.getElementById("name-1").style.borderColor = "black";
                document.getElementById("name-1").style.backgroundColor = "white";
            }

            if(!email){
                document.getElementById('email-1').style.borderColor = "red";
                document.getElementById('email-1').style.backgroundColor = "pink";
            }else{
                document.getElementById('email-1').style.borderColor = "black";
                document.getElementById('email-1').style.backgroundColor = "white";
            }
            
            if(!contactNum){
                document.getElementById('contact-1').style.borderColor = "red";
                document.getElementById('contact-1').style.backgroundColor = "pink";
            }else{
                document.getElementById('contact-1').style.borderColor = "black";
                document.getElementById('contact-1').style.backgroundColor = "white";
            }

        }
    };

    
    return (
        <div className='height100vh'>
            <Navbar />
            <div className='text-center mt-4' >
                Teacher Id : 
                <input
                    type="text"
                    className="class-form2-control"
                    id='input-12'
                    value={Teacher_id}
                    onChange={(e) => setTeacher_id(e.target.value)}
                />
                <div className='text-center' id='prof_block'>
                    <button class="btn btn-primary " onClick={fetchTeacherDetails}>Update Details</button>
                </div>
            </div>

            {!message && <h1 className='user-not-found' >User not found</h1>}
            
            
             {visible && <div className='text-center' id='abcy2'>
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
                    E-mail:
                    <div>
                        <input
                            type="text"
                            className="class-form1-control"
                            id='email-1'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            onChange={(e) => setcontactNum(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='text-center' id='prof_block'>
                    <button class="btn btn-primary" onClick={updateTeacherDetails}>Save</button>
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

export default TeacherUpdate