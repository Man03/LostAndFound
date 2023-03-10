// import React from 'react'

// function Summary() {
//   return (
//     <div>Summary</div>
//   )
// }

// export default Summary

import React, { Component } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { HiFilter } from "react-icons/hi";

import jsPDF from "jspdf";
import "jspdf-autotable";

function Summary() {
  const [item, setItem] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    axios
      .all([
        axios.get(`http://localhost:8000/coordinator/getFoundItems`, {
          withCredentials: true,
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

  function exportPDF() {
    const tableRows = [];

    // Iterate over the table rows and store them in an array
    document.querySelectorAll("table tbody tr").forEach((row) => {
      const rowData = [];

      // Iterate over the cells in each row and add their content to the `rowData` array
      row.querySelectorAll("td").forEach((cell) => {
        rowData.push(cell.textContent.trim());
      });

      tableRows.push(rowData);
    });

    var styles = {
      cell: {
        padding: 2,
        fontSize: 10,
        fontStyle: "normal",
        alignment: "center",
      },
    };

    const doc = new jsPDF();
    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      styles: styles,
      margin: { left: 3, right: 3 },
      didParseCell: function (data) {
        // Set a minimum width of 50 for the first column
        if (data.column.index === 0) {
          data.cell.styles.minCellWidth = 5;
        }
        if (data.column.index === 1) {
          data.cell.styles.minCellWidth = 20;
        }
        if (data.column.index === 2) {
          data.cell.styles.cellWidth = 30;
        }
        if (data.column.index === 3) {
          data.cell.styles.minCellWidth = 20;
        }
        if (data.column.index === 4) {
          data.cell.styles.minCellWidth = 20;
        }
        if (data.column.index === 5) {
          data.cell.styles.minCellWidth = 15;
        }
        if (data.column.index === 6) {
          data.cell.styles.minCellWidth = 10;
        }
      },
    });
    doc.save("Summary.pdf");
  }

  const tableHeaders = Array.from(document.querySelectorAll("table th")).map(
    (th) => th.textContent
  );

  return (
    <>
      <div className="main-filter">
        <div className="inner-filter"></div>
      </div>
      <div className="min-h-screen">
        <div className="table-heading">
          <p className="text-color headings text-3xl">My Listing</p>
          <button onClick={exportPDF}>Export as PDF</button>
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
                        <th className="py-3 px-6 text-center">Lost-Date</th>
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
                              {itemData.lostDate}
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

export default Summary;
