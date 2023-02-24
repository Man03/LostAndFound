import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";


export default function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/dashboard", {
        withCredentials: true,
      })
      .then((response) => {})
      .catch((err) => navigate("/admin/login"));
  });

  const handleAddCoClick = async () => {};

  return (
    <>
      {
        <div>
          <HeaderAdmin/>
          <div>
            <Link to="/admin/addCoordinator">
              <button className="add-co" onClick={handleAddCoClick}>
                + Add Coordinator
              </button>
            </Link>
          </div>
        </div>
      }
    </>
  );
}
