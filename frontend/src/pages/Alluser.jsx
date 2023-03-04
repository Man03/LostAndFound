import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AllCoordinatorTable from "../components/AllCoordinatorTable";
import AllStudentTable from "../components/AllStudentTable";

import * as React from "react";


function AllUser() {
  const [coordinator, setCoordinator] = useState([]);
  const [student, setStudent] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .all([
        axios.get("http://localhost:8000/admin/dashboard", {
          withCredentials: true,
        }),
        axios.post("http://localhost:8000/coordinator/req", {
          status: "Active",
        }),
        axios.post("http://localhost:8000/student/req", { status: "Active" }),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          setCoordinator(res2.data.coordinator);
          setStudent(res3.data.student);
        })
      )
      .catch((err) => navigate("/admin/login"));
  }, []); 

  return (
    <>
      <div className="min-h-screen">
        <div>
          <p className="text-color text-2xl headings">Active Coordinators</p>
        </div>
        <div className="container table">
          <div className="overflow-x-auto">
            <div>
              <div>
                <div className="shadow-md rounded my-5">
                  <table className="min-w-max bg-white w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                        <th className="py-2 px-5 text-center">Username</th>
                        <th className="py-3 px-6 text-center">Email</th>
                        <th className="py-3 px-6 text-center">Department</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    {coordinator.map((coordinator) => (
                      <AllCoordinatorTable coordinator={coordinator} />
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-color text-2xl headings  ">Active Students</p>
        </div>
        <div className="container table">
          <div className="overflow-x-auto">
            <div>
              <div className="w-full">
                <div className="shadow-md rounded my-5">
                  <table className="min-w-max bg-white w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-center">User Name</th>
                        <th className="py-3 px-6 text-center">Email</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    {student.map((student) => (
                      <AllStudentTable student={student} />
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    </>
  );
}

export default AllUser;
