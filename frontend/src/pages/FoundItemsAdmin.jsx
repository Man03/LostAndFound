import React from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function FoundItemsCoordinator() {
  //const navigate = useNavigate();

  const [item, setItem] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios
      .all([axios.get(`http://localhost:8000/coordinator/getFoundItems`)]) // Here i use same route that used in Coordinator
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

  const ifQueryEmpty = async () => {
    axios
      .all([axios.get(`http://localhost:8000/coordinator/getFoundItems`)]) // Here i use same route that used in Coordinator
      .then(
        axios.spread((res1) => {
          const dataWithIndex = res1.data.items.map((itemData, index) => ({
            ...itemData,
            index: index + 1,
          }));
          setItem(dataWithIndex);
        })
      );
  };

  const handleSearch = async () => {
    if (query.length === 0) {
      // handle empty query
      ifQueryEmpty();
      return;
    }
    axios
      .all([
        axios.get(
          `http://localhost:8000/coordinator/getFoundItemsBySearch?q=${query}` // Here i use same route that used in Coordinator
        ),
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
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "15ch" },
        }}
        noValidate
        autoComplete="off"
      ></Box>

      <div className="search-area">
        <div className="search-btn">
          <BiSearch
            onClick={handleSearch}
            className="search-icon hover:scale-125"
          ></BiSearch>
        </div>
        <TextField
          id="outlined-required"
          label="Search by name"
          className="search-field"
          // defaultValue="Search by name..."
          placeholder="Search by name.."
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="min-h-screen">
        <div className="table-heading">
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
                            <div className="font-normal">
                              {itemData.itemName}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="font-normal break-normal break-all max-w-[150px]">
                              {itemData.description}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="font-normal">
                              {itemData.location}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="font-normal">
                              {itemData.foundDate}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="font-normal">
                              {itemData.listedBy}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="font-normal">
                              {itemData.ListedAt}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div>
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
    </>
  );
}

export default FoundItemsCoordinator;
