import React from "react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

function AllStudentTable(student) {
  const HandleDelete = async (event) => {
    event.preventDefault();
    await axios
      .post("http://localhost:8000/student/delete", {
        email: student.student.email,
      })
      .then((res) => {
        window.location.reload("user/admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("user/admin/dashboard");
      });
  };

  return (
    <tbody className="text-black-600 text-sm font-light">
      <tr className="border-b border-slate-300 hover:bg-gray-100">
        <td className="py-3 px-6 text-center">
          <span className="font-medium">{student.student.userName}</span>
        </td>
        <td className="py-3 px-6 text-center">
          <div className="font-normal">{student.student.email}</div>
        </td>
        <td className="py-3 px-6 text-center" style={{ cursor: "pointer" }}>
          <div
            className="transform hover:text-red-500 hover:scale-110 font-normal"
            onClick={HandleDelete}
          >
            <RiDeleteBin6Line className="table-icons"></RiDeleteBin6Line>
            Delete
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default AllStudentTable;
