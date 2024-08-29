import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddItems from "./AddItems";
import Sidebar from "../DesignComponents/SideBar";
//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateBill = () => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [advanceAmountPaid, setAdvanceAmountPaid] = useState('');
    const [onlineOfflineMode, setOnlineOfflineMode] = useState('online');
    const [discount, setDiscount] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerName, customerPhone, advanceAmount, advanceAmountPaid, discount]);

    const handleBookingDateChange = (event) => {
        const date = new Date(event.target.value);
        setBookingDate(event.target.value);

        const returnDate = new Date(date);
        returnDate.setDate(date.getDate() + 1);
        setReturnDate(returnDate.toISOString().split('T')[0]);
    };

    const handleReturnDateChange = (event) => {
        setReturnDate(event.target.value);
    };

    const validateInputs = () => {
        const newErrors = {};

        if (/\d/.test(customerName)) {
            newErrors.customerName = "Customer name cannot contain numbers.";
        }
        if (!/^\d{10,11}$/.test(customerPhone)) {
            newErrors.customerPhone = "Invalid phone number. Must be 10 or 11 digits and no alphabets";
        }
        if (isNaN(advanceAmount) || advanceAmount === '') {
            newErrors.advanceAmount = "Advance amount must be a number.";
        }
        if (isNaN(advanceAmountPaid) || advanceAmountPaid === '') {
            newErrors.advanceAmountPaid = "Advance amount paid must be a number.";
        }
        if (isNaN(discount)) {
            newErrors.discount = "Discount must be a number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        setIsFormValid(validateInputs());
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            //toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            const body = {
                customer_name: customerName,
                customer_mobile_number: customerPhone,
                booking_date: bookingDate,
                return_date: returnDate,
                advance_amount: advanceAmount,
                advance_amount_paid: advanceAmountPaid,
                total_amount: totalAmount,
                online_offline_mode: onlineOfflineMode,
                discount: discount,
                status: "Billed",
                items_ordered: selectedItems
            };

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bill/createBill`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error("Billing failed");
            }

            const data = await response.json();
            const createdBillId = data.bill_id; // Assuming your API returns the billId

            // Log each item with billId and insert into database
            const insertItemPromises = selectedItems.map(async (item, index) => {
                const itemParts = item.split(/\s*item_description:|\s*item_size:|\s*quantity:|\s*rate:/).filter(part => !!part);
                if (itemParts.length !== 4) {
                    throw new Error(`Invalid item format at index ${index}`);
                }

                const item_description = itemParts[0].trim();
                const item_size = parseInt(itemParts[1].trim(), 10);
                const quantity = parseInt(itemParts[2].trim(), 10);
                const rate = parseFloat(itemParts[3].trim());

                console.log(`Bill ID: ${createdBillId}`);
                console.log(`Item ${index + 1}:`);
                console.log(`  item_description: ${item_description}`);
                console.log(`  item_size: ${item_size}`);
                console.log(`  quantity: ${quantity}`);
                console.log(`  rate: ${rate}`);

                const itemBody = {
                    bill_id: createdBillId,
                    item_description: item_description,
                    item_size: item_size,
                    quantity: quantity,
                    rate: rate,
                    status: "Billed"
                };

                const itemResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/items/insertItems`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(itemBody)
                });

                if (!itemResponse.ok) {
                    throw new Error(`Failed to insert item ${index + 1}`);
                }

                return itemResponse.json();
            });

            await Promise.all(insertItemPromises);

            //toast.success("Billed successfully!");
            navigate('/view-bill'); // Navigate after success
        } catch (err) {
            console.error(err.message);
            //toast.error("Error processing items or billing");
        }
    };
    return (
        <Fragment>
            <Sidebar></Sidebar>
            <h1 className="text-center mt-5" style={{ fontFamily: 'Times New Roman, Times, serif' }}>Create Bill</h1>
            <form className="mt-5" onSubmit={onSubmitForm}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Customer Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        {errors.customerName && <small className="text-danger">{errors.customerName}</small>}
                    </div>
                    <div className="form-group col-md-6">
                        <label>Customer Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                        {errors.customerPhone && <small className="text-danger">{errors.customerPhone}</small>}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Booking Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={bookingDate}
                            onChange={handleBookingDateChange}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label>Return Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={returnDate}
                            onChange={handleReturnDateChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Advance Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            value={advanceAmount}
                            onChange={(e) => setAdvanceAmount(e.target.value)}
                        />
                        {errors.advanceAmount && <small className="text-danger">{errors.advanceAmount}</small>}
                    </div>
                    <div className="form-group col-md-6">
                        <label>Advance Amount Paid</label>
                        <input
                            type="number"
                            className="form-control"
                            value={advanceAmountPaid}
                            onChange={(e) => setAdvanceAmountPaid(e.target.value)}
                        />
                        {errors.advanceAmountPaid && <small className="text-danger">{errors.advanceAmountPaid}</small>}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Discount</label>
                        <input
                            type="number"
                            className="form-control"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                        {errors.discount && <small className="text-danger">{errors.discount}</small>}
                    </div>
                    <div className="form-group col-md-6">
                        <label>Online/Offline Mode</label>
                        <select
                            className="form-control"
                            value={onlineOfflineMode}
                            onChange={(e) => setOnlineOfflineMode(e.target.value)}
                        >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Total Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            value={totalAmount}
                            readOnly
                        />
                    </div>
                </div>
                <AddItems
                    getTotalAmount={setTotalAmount}
                    getSelectedItems={setSelectedItems}
                />
                <button className="btn btn-success" disabled={!isFormValid}>Create Bill</button>
            </form>
            {/*<ToastContainer />*/}
        </Fragment>
    );
};

export default CreateBill;
