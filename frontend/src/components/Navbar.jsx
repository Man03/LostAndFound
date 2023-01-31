import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="header">
      <div className="title">
        <img src="DDU.png" alt="Girl in a jacket" width="50" height="50" />
        <h2>Lost and Found</h2>
      </div>
      <ul>
        <li>
          <Link to="/Login">
            <h4>Login</h4>
          </Link>
        </li>
        <li>
          <Link to="/Login">
            <h4>Register</h4>
          </Link>
        </li>
      </ul>
    </div>
  );
}
