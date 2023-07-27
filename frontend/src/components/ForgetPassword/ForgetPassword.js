import React from 'react'
import  { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './forgotpass.css'
 
const ForgetPassword = () => {
    const navigate=useNavigate()
    let params=useParams()
    const user=params.user
    const [email,setemail]=useState("")
    const [success,setsuccess]=useState(false)
    const [message,setmessage]=useState(false)
    async function sendmail(){
        console.log("reqst rcvd")
      const response = await fetch(`https://isd-b4ev.onrender.com/forgetpassword/${user}`,{
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
             email
            }),
          })
          const json= await response.json()
        setsuccess(json.success)
        setmessage(!json.success)
        setTimeout(() => {
            setsuccess(false);
            navigate(`/login${user}`);
          }, 2500);

        
    }
  return (
    <>
    <div className='height100vh'>
     {message && <h1 className='not-exist' >Email does not exist</h1>}
     {!message && (<div className='forgot-pass'>
    <input type='email' className='class-form5-control' onChange={(e)=>setemail(e.target.value)} placeholder='Registered Email ID' />
    
    <button id='butn-5' class="btn btn-primary" onClick={sendmail} >Reset password</button>
    </div>)}
    {success && (
          <div className="container-fluid blacky">
            <div className="success">
              <div classNam="wrappertick">
                {" "}
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52">
                  {" "}
                  <circle
                    className="checkmark__circle"
                    cx={26}
                    cy={26}
                    r={25}
                    fill="none"
                  />{" "}
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <h4>Mail Sent</h4>
            </div>
          </div>
          
        )}
        </div>
    </>
  )
}

export default ForgetPassword