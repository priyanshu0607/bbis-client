import React, { Fragment, useState, useEffect } from "react";
//import { ToastContainer, toast } from "react-toastify";
//import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../DesignComponents/SideBar";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [searchBookings, setSearchBookings] = useState("");
  const [searchOrders, setSearchOrders] = useState("");
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const navigate = useNavigate();

  const getBookings = async () => {
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
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/displayAllBill`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      if (jsonData && Array.isArray(jsonData.rows)) {
        const sortedOrders = jsonData.rows.sort((a, b) => new Date(a.return_date) - new Date(b.return_date));
        setOrders(sortedOrders);
      } else {
        throw new Error("Invalid response format: Expected an array");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setOrders([]);
      //toast.error(`Error: ${err.message}`);
    }
  };

  const handleCreateBill = async (id) => {
    try {
      console.log(`Attempting to return bill with ID: ${id}`);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/setOrders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response from server:', result);
      //toast.success("Bill returned successfully!");
      getOrders(); // Refresh the orders list
    } catch (err) {
      console.error("Error returning bill:", err);
      //toast.error(`Error: ${err.message}`);
    }
  };

  const createBill = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/getBookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        //toast.success("Bill created successfully!");
        getBookings(); // Refresh the bookings list
        navigate(`/view-bill-afterbook/${id}`); // Navigate to the bill details
      } else {
        //toast.error("Failed to create bill.");
        console.error("Error creating bill:", response.statusText);
      }
    } catch (err) {
      //toast.error("Error creating bill.");
      console.error("Error creating bill:", err);
    }
  };

  const editInvoiceDate = async(id) =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/setBookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        //toast.success("Bill created successfully!");
      } else {
        //toast.error("Failed to create bill.");
        console.error("Error creating bill:", response.statusText);
      }
    } catch (err) {
      //toast.error("Error creating bill.");
      console.error("Error creating bill:", err);
    }
  };
  const editItemsStatus = async(id) =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/items/setItems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        //toast.success("Bill created successfully!");
      } else {
        //toast.error("Failed to create bill.");
        console.error("Error creating bill:", response.statusText);
      }
    } catch (err) {
      //toast.error("Error creating bill.");
      console.error("Error creating bill:", err);
    }
  };
  const editItemsStatusR = async(id) =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/items/setItemsR/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        //toast.success("Bill created successfully!");
      } else {
        //toast.error("Failed to create bill.");
        console.error("Error creating bill:", response.statusText);
      }
    } catch (err) {
      //toast.error("Error creating bill.");
      console.error("Error creating bill:", err);
    }
  };
  const finalProgram = async(id) =>{
    editInvoiceDate(id);
    createBill(id);
    editItemsStatus(id);
  };
  const finalProgram2 = async(id) =>{
    handleCreateBill(id);
    editItemsStatusR(id);
  };

  const handleSearchBookings = (e) => {
    setSearchBookings(e.target.value);
  };

  const handleSearchOrders = (e) => {
    setSearchOrders(e.target.value);
  };

  const handleSelectBooking = (e, id) => {
    const isChecked = e.target.checked;
    setSelectedBookings((prevSelected) =>
      isChecked ? [...prevSelected, id] : prevSelected.filter((bookingId) => bookingId !== id)
    );
  };

  const handleSelectOrder = (e, id) => {
    const isChecked = e.target.checked;
    setSelectedOrders((prevSelected) =>
      isChecked ? [...prevSelected, id] : prevSelected.filter((orderId) => orderId !== id)
    );
  };

  const handleDeleteBookings = async () => {
    try {
      const deleteRequests = selectedBookings.map(id =>
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/deleteBill/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deleteRequests);
      //toast.success("Selected bookings deleted successfully!");
      setSelectedBookings([]);
      getBookings();
    } catch (err) {
      console.error("Error deleting bookings:", err);
      //toast.error("Error deleting bookings.");
    }
  };

  const handleDeleteOrders = async () => {
    try {
      const deleteRequests = selectedOrders.map(id =>
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/deleteBill/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deleteRequests);
      //toast.success("Selected orders deleted successfully!");
      setSelectedOrders([]);
      getOrders();
    } catch (err) {
      console.error("Error deleting orders:", err);
      //toast.error("Error deleting orders.");
    }
  };

  const handleEditBookings = () => {
    navigate('/edit-bookings', { state: { ids: selectedBookings } });
  };

  const handleEditOrders = () => {
    navigate('/edit-orders', { state: { ids: selectedOrders } });
  };

  const filteredBookings = bookings.filter(booking =>
    booking.customer_name.toLowerCase().includes(searchBookings.toLowerCase()) ||
    booking.customer_mobile_number.includes(searchBookings)
  );

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchOrders.toLowerCase()) ||
    order.customer_mobile_number.includes(searchOrders)
  );
  const handleViewBooking = (bookingId) => {
    navigate(`/view-bill-afterbook/${bookingId}`);
  };
  useEffect(() => {
    getBookings();
    getOrders();
  }, []);

  return (
    <Fragment>
      <Sidebar />
      {/*<ToastContainer />*/}
      <div className="content1">
        {error && <p className="text-danger">Error: {error}</p>}
        
        <div className="table-container">
          <div className="table-wrapper">
            <h2>Bookings</h2>
            <button className="btn btn-warning mb-2 mr-2" onClick={handleEditBookings}>Edit</button>
            <button className="btn btn-danger mb-2" onClick={handleDeleteBookings}>Delete</button>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by Customer Name or Phone Number"
              value={searchBookings}
              onChange={handleSearchBookings}
            />
            {filteredBookings.length > 0 ? (
              <table className="table mt-2 text-center">
                <thead>
                  <tr>
                    <th></th>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Customer Phone</th>
                    <th>Booking Date</th>
                    <th>Return Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.bill_id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.bill_id)}
                          onChange={(e) => handleSelectBooking(e, booking.bill_id)}
                        />
                      </td>
                      <td>{booking.bill_id}</td>
                      <td>{booking.customer_name}</td>
                      <td>{booking.customer_mobile_number}</td>
                      <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td>{new Date(booking.return_date).toLocaleDateString()}</td>
                      <td>{booking.total_amount}</td>
                      <td>{booking.status}</td>
                      <td><button
                          className="btn btn-primary"
                          onClick={() => finalProgram(booking.bill_id)}
                        >
                          Bill Items
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleViewBooking(booking.bill_id)}
                        >
                          View Order
                        </button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Bookings found.</p>
            )}
          </div>

          <div className="table-wrapper">
            <h2>Orders</h2>
            <button className="btn btn-warning mb-2 mr-2" onClick={handleEditOrders}>Edit and Add Comments</button>
            <button className="btn btn-danger mb-2" onClick={handleDeleteOrders}>Delete</button>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by Customer Name or Phone Number"
              value={searchOrders}
              onChange={handleSearchOrders}
            />
            {filteredOrders.length > 0 ? (
              <table className="table mt-2 text-center">
                <thead>
                  <tr>
                    <th></th>
                    <th>Bill ID</th>
                    <th>Customer Name</th>
                    <th>Customer Phone</th>
                    <th>Booking Date</th>
                    <th>Return Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.bill_id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.bill_id)}
                          onChange={(e) => handleSelectOrder(e, order.bill_id)}
                        />
                      </td>
                      <td>{order.bill_id}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.customer_mobile_number}</td>
                      <td>{new Date(order.booking_date).toLocaleDateString()}</td>
                      <td>{new Date(order.return_date).toLocaleDateString()}</td>
                      <td>{order.total_amount}</td>
                      <td>{order.status}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => finalProgram2(order.bill_id)}
                        >
                          Return Items
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleViewBooking(order.bill_id)}
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Orders found.</p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Homepage;