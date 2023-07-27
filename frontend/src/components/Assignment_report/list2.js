import React from 'react'
import {Button} from '@mui/material'
import {AiFillFileText} from 'react-icons/ai'
const List2 = ({ submissions }) => {
  return (
    <>
      {submissions.map((submission) => {
        const { name, date, files, semester, fileurl } = submission
        return (
          <>
            <tr>
              <td>{name}</td>
              <td>{semester}</td>
              <td>{date}</td>
              <td><div>
  <Button variant="outlined" color='error'>
    <a style={{ color: '#fa3e3e' }} href={fileurl} target="_blank" >
      <strong>{files}</strong> <AiFillFileText/>
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

export default List2;