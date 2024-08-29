import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DesignComponents/SideBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewBookings.css"; // Assuming you have a CSS file for styling

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // This will format the date as DD/MM/YYYY
};

const ViewBookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const getBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/getBookings`);
      const jsonData = await response.json();

      if (Array.isArray(jsonData)) {
        setBookings(jsonData);
      } else {
        setBookings([]);
        console.error("Failed to fetch bookings, invalid response format:", jsonData);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createBill = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/getBookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to get booking");
      }


      toast.success("Bill created successfully!");
      getBookings(); // Refresh the bookings list
      navigate(`/view-bill-afterbook/${id}`); // Navigate to the bill details
    } catch (err) {
      toast.error("Error creating bill.");
      console.error("Error creating bill:", err);
    } finally {
      setIsLoading(false);
    }
  };
const function1 = async(id)=>{
  const response1 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/setBookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response1.ok) {
        throw new Error("Failed to set booking");
      }
}
const function2= async(id)=>{
  const response1 = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/items/setItems/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!response1.ok) {
    
}
}
const combination = async(id)=>{
  createBill(id);
  function1(id);
  function2(id);
}
  useEffect(() => {
    getBookings();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchInput.toLowerCase();
    return (
      booking.customer_name.toLowerCase().includes(searchLower) ||
      booking.customer_mobile_number.includes(searchInput)
    );
  });

  return (
    <Fragment>
      <Sidebar />
      <div className="content">
        <ToastContainer />
        <h1 className="text-center mt-5" style={{ fontFamily: 'Times New Roman, Times, serif' }}>View Bookings</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Customer Name or Mobile Number"
            value={searchInput}
            onChange={handleSearchInputChange}
            className="search-input"
          />
        </div>
        {filteredBookings.length > 0 ? (
          <table className="table mt-5 text-center">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Customer Name</th>
                <th>Customer Phone</th>
                <th>Booking Date</th>
                <th>Return Date</th>
                <th>Advance Amount</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.bill_id}>
                  <td>{booking.bill_id}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.customer_mobile_number}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>{formatDate(booking.return_date)}</td>
                  <td>{booking.advance_amount}</td>
                  <td>{booking.total_amount}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => combination(booking.bill_id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Bill"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </Fragment>
  );
};

export default ViewBookings;

