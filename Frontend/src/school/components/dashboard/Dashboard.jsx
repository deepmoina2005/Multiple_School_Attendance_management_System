import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../../environment";
import UpdateSchool from "./updateSchoolData";

const Dashboard = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchool = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      const resp = await axios.get(`${API}/school/get-single`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSchool(resp.data.school);
    } catch (error) {
      console.error(
        "Error fetching school:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!school) return <p>No school data found.</p>;

  return (
   <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
  <h1 className="text-3xl font-bold text-blue-600 mb-4">
    {school.school_name}
  </h1>
  <p className="text-gray-700 text-lg mb-2">
    <span className="font-semibold">Email:</span> {school.email}
  </p>
  <p className="text-gray-700 text-lg mb-2">
    <span className="font-semibold">Phone:</span> {school.phone}
  </p>
  <p className="text-gray-700 text-lg">
    <span className="font-semibold">Admin:</span> {school.admin_name}
  </p>
  <UpdateSchool/>
</div>
  );
};

export default Dashboard;
