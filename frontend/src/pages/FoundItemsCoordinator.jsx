import React from "react";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function FoundItemsCoordinator() {
  const navigate = useNavigate();

  const [item, setItem] = useState([]);

  useEffect(() => {
    axios
      .all([
        axios.post("http://localhost:8000/coordinator/getFoundItems", {
          status: "Active",
        }),
      ])
      .then(
        axios.spread((res1) => {
          const dataWithIndex = res1.data.items.map((itemData, index) => ({
            ...itemData,
            index: index + 1,
          }));
          setItem(dataWithIndex);
        })
      );
  }, []);

  const HandleUpdate = async (event) => {
    // event.preventDefault();
    // await axios
    //   .post("http://localhost:8000/item/updateStatus", {
    //     _id: item.item._id,
    //   })
    //   .then((res) => {
    //     window.location.reload("user/admin/dashboard");
    //   })
    //   .catch((err) => {
    //     window.location.reload("user/admin/dashboard");
    //   });
  };

  return (
    <div className="min-h-screen">
      <div>
        <p className="text-color headings text-3xl">Found Items</p>
      </div>
      <div className="container table">
        <div className="overflow-x-auto">
          <div>
            <div>
              <div className="shadow-md rounded my-5">
                <table className="min-w-max bg-white w-full table-auto">
                  <thead>
                    <tr className="border-b bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                      <th className="py-2 px-5 text-center">Index</th>
                      <th className="py-3 px-6 text-center">Item name</th>
                      <th className="py-3 px-6 text-center">Description</th>
                      <th className="py-3 px-6 text-center">Location</th>
                      <th className="py-3 px-6 text-center">Found-Date</th>
                      <th className="py-3 px-6 text-center">Listed By</th>
                      <th className="py-3 px-6 text-center">Listed At</th>
                      <th className="py-3 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-black-600 text-sm font-light">
                    {item.map((itemData) => (
                      <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                        <td className="py-3 px-6 text-center">
                          <span className="font-semibold">
                            {itemData.index}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-normal">{itemData.itemName}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-normal">
                            {itemData.description}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-normal">{itemData.location}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-normal">
                            {itemData.foundDate}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-normal">{itemData.listedBy}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="font-normal">{itemData.ListedAt}</div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div>
                            <GrUpdate
                              className="table-icons transform hover:scale-110"
                              style={{ cursor: "pointer" }}
                              onClick={HandleUpdate}
                            ></GrUpdate>
                            <p className="status-text font-normal text-red-600">
                              {itemData.status}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoundItemsCoordinator;
