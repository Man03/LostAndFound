import { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AllUser() {
  const [coordinator, setCoordinator] = useState([]);
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // For set dialoge Box
  const [deleteUser, setDeleteUser] = useState(false); // For set delete user which one is clicked

  // When user click on updatestatus
  const handleClickOpen = () => {
    setOpen(true);
  };

  // When user click on No in dialoge Box
  const handleClose = () => {
    setOpen(false);
  };

  // const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://lnfbackend.onrender.com/coordinator/req", {
        status: "Active",
      })
      .then((res) => {
        setCoordinator(res.data.coordinator);
        setLoading(false);
      });

    axios
      .post("https://lnfbackend.onrender.com/student/req", { status: "Active" })
      .then((res) => {
        setStudent(res.data.student);
      });
  }, []);

  const HandleCoordinatorDelete = async (user) => {
    await axios
      .post("https://lnfbackend.onrender.com/coordinator/delete", {
        email: user.email,
      })
      .then((res) => {
        window.location.reload("admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("admin/dashboard");
      });
  };
  const HandleStudentDelete = async (user) => {
    await axios
      .post("https://lnfbackend.onrender.com/student/delete", {
        email: user.email,
      })
      .then((res) => {
        window.location.reload("admin/dashboard");
      })
      .catch((err) => {
        window.location.reload("admin/dashboard");
      });
  };

  return (
    <>
      {loading ? (
        <div className="loading">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
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
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-2 px-5 text-center">Username</th>
                          <th className="py-3 px-6 text-center">Email</th>
                          <th className="py-3 px-6 text-center">Department</th>
                          <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-Neutral-900 text-sm font-light">
                        {coordinator.map((coordinator, index) => (
                          <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center">
                              <span className="font-medium">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className="font-medium">
                                {coordinator.userName}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className="font-normal">
                                {coordinator.email}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {coordinator.department}
                              </div>
                            </td>
                            <td
                              className="py-3 px-6 text-center"
                              style={{ cursor: "pointer" }}
                            >
                              <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle
                                  id="alert-dialog-title"
                                  style={{ color: "black" }}
                                >
                                  {`Are you sure want to Delete User : ${deleteUser.userName}?`}
                                </DialogTitle>
                                <DialogContent>
                                  {/* <DialogContentText id="alert-dialog-description">
                                      Let Google help apps determine location.
                                      This means sending anonymous location data
                                      to Google, even when no apps are running.
                                    </DialogContentText> */}
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose}>
                                    <p
                                      className="yes_btn"
                                      onClick={() => {
                                        HandleCoordinatorDelete(deleteUser);
                                      }}
                                    >
                                      Yes
                                    </p>
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleClose();
                                    }}
                                    autoFocus
                                  >
                                    <p className="no_btn">No</p>
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <div
                                className="transform hover:text-red-500 hover:scale-110 font-normal"
                                onClick={() => {
                                  setDeleteUser(coordinator);
                                  handleClickOpen();
                                }}
                              >
                                <RiDeleteBin6Line className="table-icons"></RiDeleteBin6Line>
                                Delete
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
                          <th className="py-3 px-6 text-center">Index</th>
                          <th className="py-3 px-6 text-center">User Name</th>
                          <th className="py-3 px-6 text-center">Email</th>
                          <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-sm font-light">
                        {student.map((student, index) => (
                          <tr className="border-b border-slate-300 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center">
                              <span className="font-medium">{index + 1}</span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className="font-medium">
                                {student.userName}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">{student.email}</div>
                            </td>
                            <td
                              className="py-3 px-6 text-center"
                              style={{ cursor: "pointer" }}
                            >
                              <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle
                                  id="alert-dialog-title"
                                  style={{ color: "black" }}
                                >
                                  {`Are you sure want to Delete User : ${deleteUser.userName}?`}
                                </DialogTitle>
                                <DialogContent>
                                  {/* <DialogContentText id="alert-dialog-description">
                                      Let Google help apps determine location.
                                      This means sending anonymous location data
                                      to Google, even when no apps are running.
                                    </DialogContentText> */}
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose}>
                                    <p
                                      className="yes_btn"
                                      onClick={() => {
                                        HandleStudentDelete(deleteUser);
                                      }}
                                    >
                                      Yes
                                    </p>
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleClose();
                                    }}
                                    autoFocus
                                  >
                                    <p className="no_btn">No</p>
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <div
                                className="transform hover:text-red-500 hover:scale-110 font-normal"
                                onClick={() => {
                                  setDeleteUser(student);
                                  handleClickOpen();
                                }}
                              >
                                <RiDeleteBin6Line className="table-icons"></RiDeleteBin6Line>
                                Delete
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
      )}
    </>
  );
}

export default AllUser;
