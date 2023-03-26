import React from "react";
import axios from "axios";
import { useState } from "react";
import { HiFilter } from "react-icons/hi";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function Summary() {
  const [item, setItem] = useState([]);
  const [filter, setFilter] = useState();
  const [lostItem, setLostItem] = useState(false);
  const [foundItem, setFoundItem] = useState(false);
  const [claimedItem, setClaimedItem] = useState(false);
  const [allItem, setAllItem] = useState(false);
  const [relostItem, resetLostItem] = useState(false);
  const [refoundItem, resetFoundItem] = useState(false);
  const [reclaimedItem, resetClaimedItem] = useState(false);
  const [reallItem, resetAllItem] = useState(true);
  const [duration, setDuration] = useState("All time");

  const handleChange = (event) => {
    setFilter(event.target.value);
    if (event.target.value === "Lost Items") {
      setLostItem(true);
      setFoundItem(false);
      setClaimedItem(false);
      setAllItem(false);
    } else if (event.target.value === "Found Items") {
      setLostItem(false);
      setFoundItem(true);
      setClaimedItem(false);
      setAllItem(false);
    } else if (event.target.value === "Claimed Items") {
      setLostItem(false);
      setFoundItem(false);
      setClaimedItem(true);
      setAllItem(false);
    } else {
      setLostItem(false);
      setFoundItem(false);
      setClaimedItem(false);
      setAllItem(true);
    }
  };

  const handleDurationChange = (event) => {
    setFilter(event.target.value);
  };

  const handleFilter = async (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:8000/admin/getFilterItems`, {
        filter: filter,
      })
      .then((res) => {
        console.log(res.data.items);
        const data = res.data.items;
        setItem(data);
      });
    if (lostItem) {
      resetLostItem(true);
      resetFoundItem(false);
      resetClaimedItem(false);
      resetAllItem(false);
    } else if (foundItem) {
      resetLostItem(false);
      resetFoundItem(true);
      resetClaimedItem(false);
      resetAllItem(false);
    } else if (claimedItem) {
      resetLostItem(false);
      resetFoundItem(false);
      resetClaimedItem(true);
      resetAllItem(false);
    } else {
      resetLostItem(false);
      resetFoundItem(false);
      resetClaimedItem(false);
      resetAllItem(true);
    }
  };

  const exportExcel = async (event) => {
    event.preventDefault();
    const response = await axios.get("http://localhost:8000/admin/exportFile", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${Date.now()}` + "test.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSelect = (date) => {
    console.log(date);
  };

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  return (
    <>
      <div className="main-filter">
        <div className="inner-filter">
          <HiFilter className="filter-icon"></HiFilter>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="Filter"
                onChange={handleChange}
              >
                <MenuItem value={"Lost Items"}>Lost Item</MenuItem>
                <MenuItem value={"Found Items"}>Found Item</MenuItem>
                <MenuItem value={"Claimed Items"}>Claimed Item</MenuItem>
                <MenuItem value={"All Items"}>All Item</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Duration</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={duration}
                label="Duration"
                onChange={handleDurationChange}
              >
                <MenuItem value={"Lost Items"}>Lost Item</MenuItem>
                <MenuItem value={"Found Items"}>Found Item</MenuItem>
                <MenuItem value={"Claimed Items"}>Claimed Item</MenuItem>
                <MenuItem value={"All Items"}>All Item</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* <label>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
          </label> */}
        </div>
        <button className="filter-btn" onClick={handleFilter}>
          Apply Filter
        </button>
        <button className="export-btn" onClick={exportExcel}>
          Export
        </button>
      </div>
      <div className="min-h-screen">
        <div className="table-heading">
          {relostItem ? (
            <p className="text-color headings text-3xl">Lost Item Data</p>
          ) : (
            <></>
          )}
          {refoundItem ? (
            <p className="text-color headings text-3xl">Found Item Data</p>
          ) : (
            <></>
          )}
          {reclaimedItem ? (
            <p className="text-color headings text-3xl">Claimed Item Data</p>
          ) : (
            <></>
          )}
          {reallItem ? (
            <p className="text-color headings text-3xl">All Item Data</p>
          ) : (
            <></>
          )}
        </div>
        <div className="container table">
          <div className="overflow-x-scroll max-w-[1100px]">
            <div>
              <div>
                <div className="shadow-md rounded my-5">
                  {relostItem ? (
                    <table className="min-w-max bg-white table-auto">
                      <thead>
                        <tr className="border-b bg-gray-200 text-black-600 uppercase text-xs leading-normal">
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-2 px-5 text-center">Item Type</th>
                          <th className="py-3 px-6 text-center">Item name</th>
                          <th className="py-3 px-6 text-center">Description</th>
                          <th className="py-3 px-6 text-center">Location</th>
                          <th className="py-3 px-6 text-center">Lost-Date</th>
                          <th className="py-3 px-6 text-center">Listed By</th>
                          <th className="py-3 px-6 text-center">Listed At</th>
                          <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-xs font-light">
                        {item.map((itemData, index) => (
                          <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                            <td className="py-3 px-6 text-center">
                              <span className="font-semibold">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.ItemType}
                              </div>
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
                                {itemData.lostDate}
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
                  ) : (
                    <></>
                  )}
                  {refoundItem ? (
                    <table className="min-w-max bg-white w-full table-auto">
                      <thead>
                        <tr className="border-b bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-2 px-5 text-center">Item Type</th>
                          <th className="py-3 px-6 text-center">Item name</th>
                          <th className="py-3 px-6 text-center">Description</th>
                          <th className="py-3 px-6 text-center">Location</th>
                          <th className="py-3 px-6 text-center">found-Date</th>
                          <th className="py-3 px-6 text-center">Listed By</th>
                          <th className="py-3 px-6 text-center">Listed At</th>
                          <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-sm font-light">
                        {item.map((itemData, index) => (
                          <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                            <td className="py-3 px-6 text-center">
                              <span className="font-semibold">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.ItemType}
                              </div>
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
                  ) : (
                    <></>
                  )}
                  {reclaimedItem ? (
                    <table className="min-w-max bg-white w-full table-auto">
                      <thead>
                        <tr className="border-b bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-2 px-5 text-center">Item Type</th>
                          <th className="py-3 px-6 text-center">Item name</th>
                          <th className="py-3 px-6 text-center">Description</th>
                          <th className="py-3 px-6 text-center">Location</th>
                          <th className="py-3 px-6 text-center">Lost-Date</th>
                          <th className="py-3 px-6 text-center">found-Date</th>
                          <th className="py-3 px-6 text-center">Listed By</th>
                          <th className="py-3 px-6 text-center">Listed At</th>
                          <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-sm font-light">
                        {item.map((itemData, index) => (
                          <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                            <td className="py-3 px-6 text-center">
                              <span className="font-semibold">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.ItemType}
                              </div>
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
                                {itemData.lostDate}
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
                  ) : (
                    <></>
                  )}
                  {reallItem ? (
                    <table className="min-w-max bg-white w-full table-auto">
                      <thead>
                        <tr className="border-b bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-2 px-5 text-center">Item Type</th>
                          <th className="py-3 px-6 text-center">Item name</th>
                          <th className="py-3 px-6 text-center">Description</th>
                          <th className="py-3 px-6 text-center">Location</th>
                          <th className="py-3 px-6 text-center">Lost-Date</th>
                          <th className="py-3 px-6 text-center">found-Date</th>
                          <th className="py-3 px-6 text-center">Listed By</th>
                          <th className="py-3 px-6 text-center">Listed At</th>
                          <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-sm font-light">
                        {item.map((itemData, index) => (
                          <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                            <td className="py-3 px-6 text-center">
                              <span className="font-semibold">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.ItemType}
                              </div>
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
                                {itemData.lostDate}
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
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Summary;
