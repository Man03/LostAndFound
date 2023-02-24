import React from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import HeaderAdmin from "../components/HeaderAdmin";

function AddCoordinator() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setconformPassword] = useState("");

  // const navigate = useNavigate();

  const handleSubmit = async (event, response) => {
    event.preventDefault();
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      department === "" ||
      password === "" ||
      conformPassword === ""
    ) {
      toast.error("All fields are required");
    } else if (password !== conformPassword) {
      toast.error("Password and Confirm Password does not match");
    } else if (response.data.message === "User alreay exists") {
      toast.error("User alreay exists");
    } else {
      // make a POST request to the login route on the back-end server

      await axios
        .post("http://localhost:8000/coordinator/signup", {
          firstName: firstName,
          lastName: lastName,
          email: email,
          department: department,
          password: password,
          conPassword: conformPassword,
        })
        .then((response) => {
          if (response.data.message === "User alreay exists") {
            toast.error("User alreay exists");
          } else {
            toast.success("Password is sent to Coordinator");
          }
        });
    }
  };
  return (
    <div>
      <ToastContainer />
      <HeaderAdmin />
      <div>
        <div className="workspace">
        {/* <div className="backbtn">
          <Link to="/coordinator/founditems">
            <button className="back-btn">Back</button>
          </Link>
        </div> */}
          <div className="add_Co-main-left flex-box">
            <div className="login-title">
              <p>Add Coordinator</p>
              <hr className="line"></hr>
            </div>
            <div className="form">
              <form action="" className="box-grp">
                <input
                  className="form-box"
                  type="text"
                  name="firstName"
                  placeholder="Enter your First Name"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                ></input>
                <input
                  className="form-box"
                  type="text"
                  name="lastName"
                  placeholder="Enter your last Name"
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                  }}
                ></input>
                <input
                  className="form-box"
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                ></input>
                <select
                  className="dropdown"
                  value={department}
                  onChange={(event) => {
                    setDepartment(event.target.value);
                    console.log(event.target.value);
                  }}
                >
                  <option>Computer engineering</option>
                  <option>Information technology</option>
                  <option>Chemical engineering</option>
                  <option>Civil engineering</option>
                  <option>Mechanical engineering</option>
                  <option>Electronics & Communication engineering</option>
                </select>
                <input
                  className="form-box"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                ></input>
                <input
                  className="form-box"
                  type="password"
                  name="conformPassword"
                  placeholder="Enter password"
                  value={conformPassword}
                  onChange={(event) => {
                    setconformPassword(event.target.value);
                  }}
                ></input>

                <button
                  type="submit"
                  className="form-box"
                  id="submit-btn"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCoordinator;
