import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "../DesignComponents/SideBar";
import { useNavigate } from "react-router-dom";
import "./ViewBookings.css"; // Assuming you have a CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const ViewReturnedOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/getOrdersR`);
      const jsonData = await response.json();

      if (jsonData && Array.isArray(jsonData)) {
        // Sort bookings by bill_id
        const sortedBookings = jsonData.sort((a, b) => a.bill_id - b.bill_id);
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } else {
        setBookings([]);
        setFilteredBookings([]);
        console.error("Failed to fetch bookings, invalid response format:", jsonData);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setFilteredBookings([]);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query, timeFilter, startDate, endDate);
  };

  const handleTimeFilterChange = (e) => {
    const filter = e.target.value;
    setTimeFilter(filter);
    filterBookings(searchQuery, filter, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    filterBookings(searchQuery, timeFilter, date, endDate);
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    setEndDate(date);
    filterBookings(searchQuery, timeFilter, startDate, date);
  };

  const filterBookings = (query, filter, start, end) => {
    const filteredByQuery = bookings.filter(
      (booking) =>
        booking.customer_name.toLowerCase().includes(query) ||
        booking.customer_mobile_number.includes(query)
    );

    let filteredByTime = filteredByQuery;

    const now = new Date();
    if (filter === "lastWeek") {
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredByTime = filteredByQuery.filter(
        (booking) => new Date(booking.booking_date) >= lastWeek
      );
    } else if (filter === "lastMonth") {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredByTime = filteredByQuery.filter(
        (booking) => new Date(booking.booking_date) >= lastMonth
      );
    } else if (filter === "lastYear") {
      const lastYear = new Date(now);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      filteredByTime = filteredByQuery.filter(
        (booking) => new Date(booking.booking_date) >= lastYear
      );
    } else if (filter === "custom" && start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      filteredByTime = filteredByQuery.filter(
        (booking) =>
          new Date(booking.booking_date) >= startDate &&
          new Date(booking.booking_date) <= endDate
      );
    }

    setFilteredBookings(filteredByTime);
  };

  const handleEdit = (bookingId) => {
    navigate(`/edit-orders/${bookingId}`); // Navigate to edit page with bookingId
  };

  const handleDelete = async (bookingId) => {
    try {
      // Make API call to delete booking with bookingId
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/deleteBill/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Update bookings list after deletion
      const updatedBookings = bookings.filter((booking) => booking.bill_id !== bookingId);
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings); // Update filtered bookings as well
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/view-bill-afterbook/${bookingId}`);
  };

  return (
    <Fragment>
      <Sidebar />
      <div className="content">
        <h1 className="text-center mt-3" style={{ fontFamily: 'Times New Roman, Times, serif' }}>View Past Orders</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by customer name or phone number"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select value={timeFilter} onChange={handleTimeFilterChange} className="filter-select">
            <option value="all">All Time</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          {timeFilter === "custom" && (
            <div className="custom-date-range">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="date-input"
              />
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="date-input"
              />
            </div>
          )}
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
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.bill_id}>
                  <td>{booking.bill_id}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.customer_mobile_number}</td>
                  <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td>{new Date(booking.return_date).toLocaleDateString()}</td>
                  <td>{booking.advance_amount}</td>
                  <td>{booking.final_amount_paid}</td>
                  <td>{booking.status}</td>
                  <td>{booking.comments}</td>
                  <td>
                    <button className="btn btn-primary action-button" onClick={() => handleViewBooking(booking.bill_id)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn-warning action-button" onClick={() => handleEdit(booking.bill_id)}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="btn btn-danger action-button2" onClick={() => handleDelete(booking.bill_id)}>
                      <i className="fas fa-trash"></i>
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

export default ViewReturnedOrders;
