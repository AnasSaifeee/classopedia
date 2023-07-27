import React, { useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { Checkmark } from 'react-checkmark'
import {Button} from '@mui/material'
import {AiFillFileText} from 'react-icons/ai'
const List = ({ assignments, AssignmentSubmit, files, setfile, file,setsubmitfile, key, removefileid, setremovefileid, temp, setTemp, setassignment_id,enrollNum }) => {
  useEffect(() => {
    if (files.id !== "") {
      localStorage.setItem(files.id, files.name)
      setTemp({ id: files.id, name: files.name })
      setremovefileid("")
    }
  }, [files])
  return (
    <>
      {assignments.map((teach, index) => {
        const { _id, date, teacher, subject, deadline, file, fileurl,submitted } = teach;
        

        return (
          <>
            <tr >
              <td>
                {date}
              </td>
              <td>{teacher}
              </td>
              <td>
                {subject}
              </td>
              <td>
                {deadline}
              </td>
              <td>
                <div style={{ width: '235px' }} >
  <Button variant="outlined" color='error'>
    <a style={{ color: '#fa3e3e' }} href={fileurl} target="_blank" >
      <strong>{file}</strong> <AiFillFileText/>
    </a>
  </Button>
</div>
              </td>
                
                  {submitted.includes(enrollNum)?<td  ><div style={{display:"flex",justifyContent:"space-around",alignItems:"center",width:"8em"}}> Submitted <Checkmark  size="20" /></div></td>
                   :<td><form id="uploadandsubmitblock" color='red'>
                  <input type="file" id='inputfilechoose' value={""} onChange={(e) => {
                    setfile({ id: _id, name: e.target.files[0].name })
                    setsubmitfile(e.target.files[0])
                    setassignment_id(_id)
                  }} />
                  <button   className='upload_button' accept=".pdf, .jpg, .png, .ppt, .doc"   style={{ backgroundColor: '#007bff', color: 'white',cursor:'pointer' }}>Upload</button>
                  <button className='submit_button'   type='submit' onClick={(e) => { AssignmentSubmit(e, _id) }}>Submit</button>
                </form>
                 <div style={{ color: 'blue' }}>{removefileid !== _id && (localStorage.getItem(_id) || (_id === temp.id && temp.name))}</div>

                </td>}
                
            </tr>
          </>
        )
      })}
    </>
  )
}
export default List




