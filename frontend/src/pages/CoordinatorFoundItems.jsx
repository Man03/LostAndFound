import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderCoordinator from "../components/HeaderCoordinator";

function CoordinatorFoundItems() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/coordinator/founditems", {
        withCredentials: true,
      })
      .then((response) => {})
      .catch((err) => navigate("/coordinator/login"));
  });

  return (
    <>
      {
        <div>
          <HeaderCoordinator/>
          <div>Hii</div>
        </div>
      }
    </>
  );
}

export default CoordinatorFoundItems;
