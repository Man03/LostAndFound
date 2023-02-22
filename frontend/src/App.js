import "./index.css";
import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginAdmin from "./pages/LoginAdmin";
import LoginCoordinator from "./pages/LoginCoordinator";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentFounditems from "./pages/StudentFounditems";
import SelectRole from "./pages/SelectRole";
import AddCoordinator from "./pages/AddCoordinator";
import CoordinatorFoundItems from "./pages/CoordinatorFoundItems";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          {/* ------------------------------------Login------------------------------------------------- */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/selectRole" element={<SelectRole />}></Route>
          <Route path="/admin/login" element={<LoginAdmin />}></Route>
          <Route
            path="/coordinator/login"
            element={<LoginCoordinator />}
          ></Route>
          <Route path="/student/login" element={<StudentLogin />}></Route>

          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route
            path="/student/foundItems"
            element={<StudentFounditems />}
          ></Route>
          <Route
            path="/coordinator/foundItems"
            element={<CoordinatorFoundItems />}
          ></Route>

          <Route
            path="/admin/addCoordinator"
            element={<AddCoordinator />}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
