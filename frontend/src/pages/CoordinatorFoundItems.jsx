import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return <>{<div>Hii</div>}</>;
}

export default CoordinatorFoundItems;
