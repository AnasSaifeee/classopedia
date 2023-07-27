import React, { useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { Checkmark } from 'react-checkmark'
import {Button} from '@mui/material'
import {AiFillFileText} from 'react-icons/ai'
import { FaExclamationCircle } from 'react-icons/fa';
const List2 = ({expiredAssignments,enrollNum}) => {
  return (
    <>
      {expiredAssignments.map((teach, index) => {
        const { _id, date, teacher, subject, deadline, file, fileurl,submitted } = teach;
        return(
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
               
             <td>
             {submitted.includes(enrollNum)?<td  ><div style={{display:"flex",justifyContent:"space-around",alignItems:"center",width:"8em"}}> Submitted <Checkmark  size="20" /></div></td>
                   :<td>

                    <p>Deadline Expired!</p>
                 
                </td>}
             </td>
           </tr>
         
 
            </>
        )
        

        
      })}
    </>
  )
}
export default List2




