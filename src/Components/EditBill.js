import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Homepage.css';
import SearchDropdown from './SearchDropDown';

const EditBill = () => {
  const [billData, setBillData] = useState({
    customer_name: '',
    customer_mobile_number: '',
    booking_date: '',
    return_date: '',
    total_amount: '',
    advance_amount: '',
    advance_amount_paid: '',
    online_offline_mode: '',
    discount: '',
    items_ordered: [],
    comments: ''
  });
  const [itemsOrdered, setItemsOrdered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { ids } = location.state || { ids: [] };

  useEffect(() => {
    if (ids.length === 1) {
      fetchBillData(ids[0]);
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const fetchBillData = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/displayBill/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      setBillData(jsonData);
      setItemsOrdered(parseItemsOrdered(jsonData.items_ordered));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bill data:", err);
      toast.error("Error fetching bill data.");
      setLoading(false);
    }
  };

  const parseItemsOrdered = (itemsArray) => {
    if (!itemsArray || !Array.isArray(itemsArray)) {
      console.error("Invalid items array:", itemsArray);
      return [];
    }

    return itemsArray.map(itemStr => {
      const itemParts = itemStr.match(/item_description:\s*([^,]+)\s*item_size:\s*(\d+)\s*quantity:\s*(\d+)\s*rate:\s*(\d+\.?\d*)/);
      if (!itemParts) {
        console.error("Invalid item string format:", itemStr);
        return null;
      }

      const item_description = itemParts[1].trim();
      const item_size = parseInt(itemParts[2].trim(), 10);
      const quantity = parseInt(itemParts[3].trim(), 10);
      const rate = parseFloat(itemParts[4].trim());
      const rateOfOne = rate/quantity;
      const totalrate = quantity * rateOfOne;

      return { item_description, item_size, quantity, rateOfOne, totalrate };
    }).filter(item => item !== null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = itemsOrdered.map((item, i) => {
      if (i === index) {
        const updatedItem = {
          ...item,
          [name]: value,
        };
        if (name === "quantity" || name === "rate") {
          const quantity = name === "quantity" ? parseInt(value, 10) : item.quantity;
          const rate = name === "rate" ? parseFloat(value) : item.rateOfOne;
          updatedItem.totalrate = quantity * rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItemsOrdered(updatedItems);
    updateTotalAmount(updatedItems);
  };

  const updateTotalAmount = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.totalrate, 0);
    setBillData((prevData) => ({
      ...prevData,
      total_amount: totalAmount,
    }));
  };
  
  const handleEdit = async () => {
    try {
      // Convert itemsOrdered back to array of strings
      const itemsStringArray = itemsOrdered.map(item => `item_description:${item.item_description} item_size:${item.item_size} quantity:${item.quantity} rate:${item.totalrate}`);
      const updatedBillData = {
        ...billData,
        items_ordered: itemsStringArray
      };
      console.log(updatedBillData)
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/updateBooking/${updatedBillData.bill_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBillData),
      });
      if (response.ok) {
        toast.success("Bill updated successfully!");
        navigate("/"); // Navigate back to homepage
      } else {
        throw new Error("Failed to update bill");
      }
    } catch (err) {
      console.error("Error updating bill:", err);
      toast.error("Error updating bill.");
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...itemsOrdered];
    updatedItems.splice(index, 1);
    setItemsOrdered(updatedItems);
    updateTotalAmount(updatedItems);
  };

  const handleAddItem = (selectedItem) => {
    const newItem = {
      item_description: selectedItem.item_description,
      item_size: selectedItem.item_size,
      quantity: 1, // Default quantity
      rateOfOne: selectedItem.rate,
      totalrate: selectedItem.rate * 1, // Initial total rate based on default quantity
    };
    
    const updatedItems = [...itemsOrdered, newItem];
    setItemsOrdered(updatedItems);
    updateTotalAmount(updatedItems);
  };
  

  const onSelectItem = (selectedItem) => {
    handleAddItem(selectedItem);
};
  return (
    <div>
      <ToastContainer />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="edit-form">
          <h2>Edit Bill</h2>
          {Object.keys(billData).length > 0 ? (
            <div>
              <div className="form-group">
                <label>Customer Name:</label>
                <input
                  type="text"
                  name="customer_name"
                  value={billData.customer_name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Customer Phone:</label>
                <input
                  type="text"
                  name="customer_mobile_number"
                  value={billData.customer_mobile_number}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Booking Date:</label>
                <input
                  type="date"
                  name="booking_date"
                  value={billData.booking_date.split('T')[0]}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Return Date:</label>
                <input
                  type="date"
                  name="return_date"
                  value={billData.return_date.split('T')[0]}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Advance Amount:</label>
                <input
                  type="number"
                  name="advance_amount"
                  value={billData.advance_amount}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Advance Amount Paid:</label>
                <input
                  type="number"
                  name="advance_amount_paid"
                  value={billData.advance_amount_paid}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Payment Mode (Online/Offline):</label>
                <select
                  name="online_offline_mode"
                  value={billData.online_offline_mode}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount:</label>
                <input
                  type="number"
                  name="discount"
                  value={billData.discount}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={billData.status}                  
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Comments:</label>
                <textarea
                  name="comments"
                  value={billData.comments}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <h3>Items Ordered</h3>
                <SearchDropdown onSelectItem={onSelectItem}></SearchDropdown>
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Item Size</th>
                      <th>Rate</th>
                      <th>Quantity</th>
                      <th>Total Rate</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsOrdered.map((item, index) => (
                      <tr key={index}>
                        <td>{item.item_description}</td>
                        <td>{item.item_size}</td>
                        <td>{item.rateOfOne}</td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control"
                          />
                        </td>
                        <td>{item.totalrate}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => handleDeleteItem(index)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-group">
                <label>Total Amount:</label>
                <input
                  type="number"
                  name="total_amount"
                  value={billData.total_amount}
                  readOnly
                  className="form-control"
                />
              </div>

              <button className="btn btn-primary" onClick={handleEdit}>Edit</button>

            </div>
          ) : (
            <p>No bill data available for editing.</p>
          )}
        </div>
      )}
    </div>
  ); 
};

export default EditBill;