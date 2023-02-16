import { useState, useEffect, useRef, React } from "react";

import { Link } from "react-router-dom";

import image from "../Assets/image.png";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const popUpRef = useRef();

  const togglePopUp = () => {
    setIsOpen(!isOpen);
    setIsBlurred(!isBlurred);
  };

  const closePopUp = () => {
    setIsOpen(false);
    setIsBlurred(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        closePopUp();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <div className="workspace">
        <div className="left-home">
          <div id="top">
            <p className="text-color left-text" id="top-text">
              LOST AND FOUND
            </p>
          </div>
          <div id="middle">
            <p className="text-color left-text" id="left-long-text">
              LOST IT.LIST IT.FOUND IT.
            </p>
          </div>
          <button
            onClick={togglePopUp}
            id="down-get-started-btn"
            className="getStartedText"
          >
            Get Started
          </button>
          {isOpen && (
            <div ref={popUpRef} className="popup" id="unblurred">
              <p className="SelectRole-Text">Select your role</p>
              <div className="roles">
                <div className="admin-box">
                  <Link to="/admin/login">
                    <p className="admin-text">Admin</p>
                  </Link>
                </div>
                <div className="coordi-box">
                  <Link to="/coordinator/login">
                    <p className="coordi-text">Coordinator</p>
                  </Link>
                </div>
                <div className="student-box">
                  <Link to="/student/login">
                    <p className="student-text">Student</p>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="right-home">
          <img id="image" src={image} alt="" srcSet="" />
        </div>
      </div>
    </div>
  );
}
