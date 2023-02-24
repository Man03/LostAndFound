import React from "react";
import admin_img from "../Assets/admin.png";
import Coordi_img from "../Assets/administrator.png";
import std_img from "../Assets/graduated.png";
import { Link } from "react-router-dom";
import BeforeLoginNavbar from "../components/Navbar";

function SelectRole() {
  return (
    <div>
      <BeforeLoginNavbar />
      <div className="Main">
        <div className="askRoleTitle">
          <p className="askRole-text">What's your role?</p>
        </div>
        <div className="roleBox">
          <Link to="/admin/login">
            <div className="role1box">
              <img id="admin-img" src={admin_img} alt="" srcSet="" />
              <p>Admin</p>
            </div>
          </Link>
          <Link to="/coordinator/login">
            <div className="role2box">
              <img id="Coordi-img" src={Coordi_img} alt="" srcSet="" />
              <p>Coordinator</p>
            </div>
          </Link>
          <Link to="/student/login">
            <div className="role3box">
              <img id="std-img" src={std_img} alt="" srcSet="" />
              <p>Student</p>
            </div>
          </Link>
        </div>
        {/* <div className="nbtn">
        <button className="nextbtn">Next</button>
      </div> */}
      </div>
    </div>
  );
}

export default SelectRole;
