import React from "react";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";

function FoundItemsCoordinator(item) {
  const HandleUpdate = async (event) => {
    event.preventDefault();
    await axios
      .post("http://localhost:8000/item/updateStatus", {
        _id: item.item._id,
      })
      .then((res) => {
        window.location.reload("user/admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("user/admin/dashboard");
      });
  };

  return (
    <tbody className="text-black  -600 text-sm font-light">
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 text-center">
          <span className="font-medium">{item.item.userName}</span>
        </td>
        <td className="py-3 px-6 text-center">
          <div>{item.item.email}</div>
        </td>
        <td className="py-3 px-6 text-center" style={{ cursor: "pointer" }}>
          <div
            className="transform hover:text-red-500 hover:scale-110"
            onClick={HandleUpdate}
          >
            <GrUpdate className="table-icons"></GrUpdate>
            Delete
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default FoundItemsCoordinator;
