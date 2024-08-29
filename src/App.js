// src/App.js
import './App.css';
import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import CreateBill from "./Components/CreateBill";
import ViewBill from "./Components/ViewBill";
import Homepage from "./Components/Homepage";
import BookingItems from "./Components/Booking_items";
import ViewBookings from './Components/ViewBookings';
import ViewBillAfterBooking from './Components/ViewBillAfterBooking';
import ViewReturnedOrders from './Components/ViewReturnedOrders';
import EditBill from './Components/EditBill';
import Login from './Components/Login_Page';
import Inventory from './Components/Inventory';
import EditBill2 from './Components/EditBill2';
import ViewItems from './Components/InventoryManagement';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='container1'>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-bill"
              element={
                <PrivateRoute>
                  <CreateBill />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-bill"
              element={
                <PrivateRoute>
                  <ViewBill />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <PrivateRoute>
                  <BookingItems />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-bookings"
              element={
                <PrivateRoute>
                  <ViewBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-bill-afterbook/:bookingId"
              element={
                <PrivateRoute>
                  <ViewBillAfterBooking />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-past-orders"
              element={
                <PrivateRoute>
                  <ViewReturnedOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-bookings"
              element={
                <PrivateRoute>
                  <EditBill />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-orders"
              element={
                <PrivateRoute>
                  <EditBill />
                </PrivateRoute>
              }
            />
            <Route
            path="/edit-orders/:id"
            element={
              <PrivateRoute>
                <EditBill2 />
              </PrivateRoute>
            }
          />
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <Inventory />
                </PrivateRoute>
              }
            />
            <Route
              path="/inventoryManagement"
              element={
                <PrivateRoute>
                  <ViewItems />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;


