import React from "react";

const SchList = ({ semval }) => {
  return (
    <>
      {semval &&
        semval.map((x) => {
          return (
            <>
              <option value={x}>{x}</option>
            </>
          );
        })}
    </>
  );
};

export default SchList;
