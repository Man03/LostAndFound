import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import { TiDelete } from "react-icons/ti";
import AllUser from "./Alluser";
import AddCoordinator from "../pages/AddCoordinator";
import { BiUserCheck } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import {  faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(true);
  const [user, setUser] = useState(false);
  const [founditems, setfounditems] = useState(false);
  const [lostitems, setlostitems] = useState(false);
  const [addCoordinator, setAddCoordinator] = useState(false);
  const [addDept, setAddDept] = useState(false);
  const [summary, setSummary] = useState(false);

  const [dept, setDept] = useState("");
  const [all, setAll] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/dashboard", {
        withCredentials: true,
      })
      .then((response) => {})
      .catch((err) => navigate("/admin/login"));
  });

  const handleDept = async (event) => {
    event.preventDefault();
    await axios
      .post(
        "http://localhost:5000/admin/adddept",
        {
          department: dept,
        },
        { withCredentials: true }
      )
      .then((response) => {})
      .catch((error) => {
        console.log("Error is " + error);
      });
  };
  const deptDelete = async (event, department) => {
    event.preventDefault();
    await axios
      .post("http://localhost:5000/admin/deletedept", {
        department: department,
      })
      .then((res) => {
        window.location.reload("user/admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("user/admin/dashboard");
      });
  };

  return (
    <>
      <div className="d-main">
        <div className="Header-in-page">
          <HeaderAdmin />
        </div>  
        <div className="below-part">
          <div className="slidebar">
            <div className="navbar">
              <div className="navbar-inner">
                <div className="user">
                  <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                  <div className="user-name">Admin</div>
                </div>
                <div className="nav-menu">
                  <ul className="nav-menu-items ">
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(true);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <MdOutlineDashboard className="icon" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(true);
                          setfounditems(false);
                          setlostitems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <BiUserCheck className="icon" />
                        <span>Active users</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(true);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <RiEmotionUnhappyLine className="icon" />
                        <span>Lost Items</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(true);
                          setlostitems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <RiEmotionHappyLine className="icon" />
                        <span>Found Items</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setAddCoordinator(true);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <IoAddCircleOutline className="icon" />
                        <span>Add Coordinator</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setAddCoordinator(false);
                          setAddDept(true);
                          setSummary(false);
                        }}
                      >
                        <IoAddCircleOutline className="icon" />
                        <span>Add Department</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(true);
                        }}
                      >
                        <AiOutlineFileText className="icon" />
                        <span>Summary</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-right">
            {user ? <AllUser /> : <></>}
            {addCoordinator ? <AddCoordinator /> : <></>}
            {addDept ? (
              <>
                <div className="main">
                  <div className="main-left">
                    <div className="innner-left">
                      <p id="form-text">Add Department </p>
                      <form action="" className="box-grp">
                        <input
                          className="form-box"
                          type="text"
                          name="dept"
                          placeholder="Enter new department"
                          value={dept}
                          onChange={(event) => {
                            setDept(event.target.value);
                          }}
                        ></input>

                        <button
                          type="submit"
                          className="form-box"
                          id="submit-btn"
                          onClick={handleDept}
                        >
                          Add Department
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="main-right text-color">
                    <div className="box">
                      <div className="box-title">All Departments</div>
                      <div className="box-inner">
                        {all.map((dept) => (
                          <>
                            <div className="flex-row">
                              <div>{dept.department}</div>
                              <span>
                                <TiDelete
                                  className="icon"
                                  size={20}
                                  onClick={(event) =>
                                    deptDelete(event, dept.department)
                                  }
                                />
                              </span>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
