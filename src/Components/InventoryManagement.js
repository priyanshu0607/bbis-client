import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "../DesignComponents/SideBar";
import { useNavigate } from "react-router-dom";
import "./ViewItems.css"; // Assuming you have a CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  const getItems = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/items`);
      const jsonData = await response.json();

      if (jsonData && Array.isArray(jsonData.rows)) {
        setItems(jsonData.rows);
      } else {
        setItems([]);
        console.error("Failed to fetch items, invalid response format:", jsonData);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    }
  };

  const handleEditClick = (item) => {
    setEditItemId(item.item_id);
    setEditFormData({ ...item });
  };

  const handleSaveClick = async (itemId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/items/edit/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      // Update the items list with the edited item
      const updatedItems = items.map((item) =>
        item.item_id === itemId ? editFormData : item
      );
      setItems(updatedItems);
      setEditItemId(null);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/items/delete/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedItems = items.filter((item) => item.item_id !== itemId);
      setItems(updatedItems);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Fragment>
      <Sidebar />
      <div className="content">
        <h1 className="text-center mt-3" style={{ fontFamily: 'Times New Roman, Times, serif' }}>View All Items</h1>
        {items.length > 0 ? (
          <table className="table mt-5 text-center">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Description</th>
                <th>Size</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.item_id}</td>
                  <td>
                    {editItemId === item.item_id ? (
                      <input
                        type="text"
                        name="item_description"
                        value={editFormData.item_description}
                        onChange={handleInputChange}
                      />
                    ) : (
                      item.item_description
                    )}
                  </td>
                  <td>
                    {editItemId === item.item_id ? (
                      <input
                        type="text"
                        name="item_size"
                        value={editFormData.item_size}
                        onChange={handleInputChange}
                      />
                    ) : (
                      item.item_size
                    )}
                  </td>
                  <td>
                    {editItemId === item.item_id ? (
                      <input
                        type="number"
                        name="rate"
                        value={editFormData.rate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      item.rate
                    )}
                  </td>
                  <td>
                    {editItemId === item.item_id ? (
                      <input
                        type="number"
                        name="item_quantity"
                        value={editFormData.item_quantity}
                        onChange={handleInputChange}
                      />
                    ) : (
                      item.item_quantity
                    )}
                  </td>
                  <td>
                    {editItemId === item.item_id ? (
                      <button
                        className="btn btn-success action-button"
                        onClick={() => handleSaveClick(item.item_id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning action-button"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="btn btn-danger action-button2"
                      onClick={() => handleDelete(item.item_id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items found in inventory.</p>
        )}
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </Fragment>
  );
};

export default ViewItems;
