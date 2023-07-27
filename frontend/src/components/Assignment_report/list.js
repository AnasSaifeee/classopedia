import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from '@mui/material'
import { AiFillFileText } from 'react-icons/ai'
const List = ({ assignments, handleclick }) => {
  return (
    <>
      {assignments.map((teach) => {
        const { date, teacher, subject, deadline, file, _id, fileurl } = teach;
        return (
          <>
            <tr>
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
              <td><div>
                <Button variant="outlined" color='error'>
                  <a style={{ color: '#fa3e3e' }} href={fileurl} target="_blank" >
                    <strong>{file}</strong> <AiFillFileText />
                  </a>
                </Button>
              </div></td>
              <td>
                <button value={_id} style={{ backgroundColor: '#007bff', color: 'white', borderRadius: "10px", border: "none", height: "30px", width: "10rem", opacity: "0.8" }} onClick={handleclick} >View Submissions</button>
              </td>
            </tr>
          </>
        )
      })}
    </>
  )
}

export default List