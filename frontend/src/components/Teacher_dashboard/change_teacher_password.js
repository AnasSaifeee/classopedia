import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import "./change_teach_password.css"
import { FaIcons } from 'react-icons/fa';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
const ChangeTeacherPassword = () => {
  const[success,setsuccess]=useState(false)
  const [loader,setloader]=useState(false)
  const [warning, setwarning] = useState("");
  const [ifpasswordsame, setIfpasswordsame] = useState(false);
  const [ifconfirmpassworddifferent, setIfconfirmpassworddifferent] = useState(false);
  const navigate = useNavigate();
  const [teacher_id, setTeacher_id] = useState([])
  const [allpasswords, setAllpasswords] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: ""
  })
  const [errmsg, setErrmsg] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setAllpasswords({
      ...allpasswords,
      [name]: value
    })
  }


  async function updatepassword(e) {

    e.preventDefault()

    if (allpasswords.oldpassword === allpasswords.newpassword) {
      setIfpasswordsame(true);
      setIfconfirmpassworddifferent(false);
      // setErrmsg("Old password and New password cannot be same");
    } else if (allpasswords.newpassword !== allpasswords.confirmpassword) {
      // setErrmsg("Confirm password and new password must be same");
      setIfpasswordsame(false);
      setIfconfirmpassworddifferent(true);
    } else {
      setwarning(false)
      setIfpasswordsame(false);
      setIfconfirmpassworddifferent(false);
      setloader(true)
      const req = await fetch('https://classopedia.onrender.com/Teacherdashboard/changepassword', {
        method: "PATCH",
        headers: {

          Accept: "application/json",
          "Content-Type": "application/json",
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(allpasswords),
      }
      )
      const json = await req.json()
      console.log(json)
      setloader(false)
      setsuccess(json.status)
      setwarning(!json.status)
      if(json.status)
      {
        setTimeout(() => {
          setsuccess(false);
          navigate("/Teacherdashboard");
        }, 2500);
      }
   
    }

  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt.decode(token)
      if (!user) {
        localStorage.removeItem('token')
        navigate("/Teacherdashboard");
      }
    }
  }, [teacher_id])

  return (
    <>
      <section className="wrapper ">

        <div className="container pt-10">
          <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center">
            <form className="rounded bg-white shadow p-5" >
              <h3 className="text-dark fw-bolder fs-4 mb-2">Change Password</h3>

              <label htmlFor="floatingInput">Old Password</label>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingInput"
                  name="oldpassword"
                  placeholder="Old Password"
                  value={allpasswords.oldpassword}
                  onChange={handleChange}
                />
              </div>

              <label htmlFor="floatingPassword">New Password</label>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  name="newpassword"
                  placeholder="New Password"
                  value={allpasswords.newpassword}
                  onChange={handleChange}
                />
              </div>

              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingConfirmPassword"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  value={allpasswords.confirmpassword}
                  onChange={handleChange}

                />
              </div>
              {
                errmsg ? <h3 className='text-danger'>{errmsg}</h3> : ""
              }

              {ifpasswordsame && <div class="alertmessage">
                <i class='fa fa-exclamation-circle'></i> &nbsp;
                Old password and New password cannot be same!
              </div>}

              {ifconfirmpassworddifferent && < div class="alertmessage">
                <i class='fa fa-exclamation-circle'></i> &nbsp;
                Confirm password and new password must be same
              </div>}
              {warning && < div class="alertmessage">
                <i class='fa fa-exclamation-circle'></i> &nbsp;
                Password is incorrect!
              </div>}
              <button
                type="submit"
                className="btn btn-primary submi_btn w-100 my-4"
                onClick={updatepassword}
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
        {success &&  <div className="container-fluid blacky">
    <div className="success">
   <div classNam="wrappertick"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none"/> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
</svg>
</div>
<h4>Password Updated successfully</h4>
</div>
      </div>}
      {loader&&<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
      </section>
    </>
  );

}

export default ChangeTeacherPassword