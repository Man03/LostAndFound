import React from "react";
import HeaderStudent from "../components/HeaderStudent";

// import { useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

function StudentFounditems() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/student/founditems", {
  //       withCredentials: true,
  //     })
  //     .then((response) => {})
  //     .catch((err) => navigate("/student/login"));
  // });

  return (
    <>
      {
        <div>
          <HeaderStudent/>
          <div>Student Found Items</div>
        </div>
      }
    </>
  );
}

export default StudentFounditems;
