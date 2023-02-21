import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const handleAddCoClick = async () => {};

  return (
    <div>
      <div>
        <Link to="/admin/addCoordinator">
          <button className="add-co" onClick={handleAddCoClick}>
            + Add Coordinator
          </button>
        </Link>
      </div>
    </div>
  );
}
