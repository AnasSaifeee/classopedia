import React from 'react'

const Subjectlist = ({ subjectdata }) => {
  return (
    <>
      {subjectdata &&
        subjectdata.map((x, index) => {
          return (
            <option key={index} value={x}>
              {x}
            </option>
          );
        })}
    </>
  );
};



export default Subjectlist;
