import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Admin Dashboard/Navbar";
import Multiselect from 'multiselect-react-dropdown'

function TeacherRegister() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [Sem1select, setSem1select] =useState([
    'Algorithms And Data Structure', 
    'Software Design & Programming', 
    'Mathematical Foundation of Computing',
    'Computer System Architecture'
  ])
  const [Sem2select, setSem2select] =useState([
    'Computer Communication and Networks', 
    'Operating Systems', 
    'Database Systems',
    'Applied Machine Learning',
    'Open Elective-1'
  ])
  const [Sem3select, setSem3select] =useState([
    'Information System Design', 
    'Cloud Computing', 
    'Software Engineering',
    'IT Planning and Management'
  ])
  const [Sem4select, setSem4select] =useState([
    'Internet of Things Systems, Security and Cloud', 
    'Health Informatics', 
    'Research Methods in Informatics'
  ])
  const [Sem1, setSem1] = useState([])
  const [Sem2, setSem2] = useState([])
  const [Sem3, setSem3] = useState([])
  const [Sem4, setSem4] = useState([])

  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [Teacher_id, setTeacher_id] = useState("")
  const [contactNum, setcontactNum] = useState("")
  const [password, setpassword] = useState("")
  const [errmsg, setErrmsg] = useState("");



  async function Register(e) {
    e.preventDefault();
    const response = await fetch(
      "https://isd-b4ev.onrender.com/registerteacher",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, 
          email, 
          Teacher_id, 
          contactNum, 
          password, 
          Sem1, 
          Sem2, 
          Sem3, 
          Sem4}),
      }
    );
     
    const data = await response.json();
    setSuccess(data.success);
    setTimeout(() => {
      setSuccess(false);
      navigate("/admindashboard");
    }, 2500);

    if (data.status === "notok") {
      setErrmsg(data.msg);
    }
  }

  return (
    <>
      <Navbar />
      <section>
        <div className="container pt-10">
          <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center">
            <form className="rounded bg-white shadow p-5">
              <h3 className="text-dark fw-bolder fs-4 mb-2">
                Register new Teacher
              </h3>

              <label htmlFor="floatingInput">Name</label>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  name="name"
                  placeholder="name"
                  value={name}
                  onChange={(e)=>{setname(e.target.value)}}
                />
              </div>

              <label htmlFor="floatingemail">Email</label>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingemail"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>{setemail(e.target.value)}}
                />
              </div>

              <label htmlFor="floatingid">Teacher's ID</label>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingid"
                  name="Teacher_id"
                  placeholder="Teacher's ID"
                  value={Teacher_id}
                  onChange={(e)=>{setTeacher_id(e.target.value)}}
                />
              </div>

              <label htmlFor="floatingcontact">Contact Number</label>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingcontact"
                  name="contactNum"
                  placeholder="Contact Number"
                  value={contactNum}
                  onChange={(e)=>{setcontactNum(e.target.value)}}
                />
              </div>

              <label htmlFor="floatingPassword">Password</label>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>{setpassword(e.target.value)}}
                />
              </div>
              <div>
              <label htmlFor="floatingSubject1">Sem-1 Subjects</label>
              <Multiselect
              isObject={false}
              options={Sem1select}
              name="Sem1"
              showCheckbox
              onSelect={(e)=>{setSem1(e)}}
              
              />
              </div>
              <div>
              <label htmlFor="floatingSubject1">Sem-2 Subjects</label>
              <Multiselect
              isObject={false}
              options={Sem2select}
              name="Sem2"
              showCheckbox
              onSelect={(e)=>{setSem2(e)}}
              
              />
              </div>
              <div>
              <label htmlFor="floatingSubject1">Sem-3 Subjects</label>
              <Multiselect
              isObject={false}
              options={Sem3select}
              name="Sem3"
              showCheckbox
              onSelect={(e)=>{setSem3(e)}}
              
              />
              </div>
              <div>
              <label htmlFor="floatingSubject1">Sem-4 Subjects</label>
              <Multiselect
              isObject={false}
              options={Sem4select}
              name="Sem4"
              showCheckbox
              onSelect={(e)=>{setSem4(e)}}
              
              />
              </div>
              

              {errmsg ? <h3 className="text-danger">{errmsg}</h3> : ""}

              <button
                type="submit"
                className="btn btn-primary submi_btn w-100 my-4"
                onClick={Register}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
      {success && (
        <div className="container-fluid blacky">
          <div className="success">
            <div classNam="wrappertick">
              {" "}
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
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
            <h4>Teacher Registered succesfully</h4>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherRegister;
