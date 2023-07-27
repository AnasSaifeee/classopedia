import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from '@mui/material'
import { AiFillFileText } from 'react-icons/ai'
const List = ({ material }) => {
  return (
    <>
      {material.map((teach) => {
        const { teacher, subject, semester,date, file, fileurl } = teach;
        return (
          <>
            <tr>
              <td>{teacher}
              </td>
              <td>
                {subject}
              </td>
              <td>
                {semester}
              </td>
              <td>
                {date}
              </td>
              <td><div>
                <Button variant="outlined" color='error'>
                  <a style={{ color: '#fa3e3e' }} href={fileurl} target="_blank" >
                    <strong>{file}</strong> <AiFillFileText />
                  </a>
                </Button>
              </div></td>
            </tr>
          </>
        )
      })}
    </>
  )
}

export default List