//3.1 page

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Regular = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [records, setRecords] = useState([]);
  const [records1, setRecords1] = useState([]);
  const [visit_stat, setvisit_stat] = useState([]);

  const [recordCount, setRecordCount] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [type, setType] = useState(localStorage.getItem("type"));
  const [date, setDate] = useState(localStorage.getItem("date"));
  localStorage.setItem("tickettype", "regular");

  const addRecord = () => {
    const newTotalAmount = recordCount * 900;
    setTotalAmount(newTotalAmount);
    // Validation for the first entry
    if (recordCount === 1 && (!phone || !email || !name || !age)) {
      setShowAlert(true);
      alert("All Details are required for the first entry!");
      return;
    }

    // Validation for subsequent entries
    if (recordCount > 1 && (!name || !age)) {
      setShowAlert(true);
      alert("Member Details are required for subsequent entries!");
      return;
    }

    // Validate name
    if (!name) {
      setShowAlert(true);
      alert("Name is required!");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    if (recordCount === 1 && !phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (recordCount === 1 && !emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }
    // Validate age (between 5 and 90)
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 90) {
      setShowAlert(true);
      alert("Please enter a valid age between 10 and 90!");
      return;
    }

    // Add record to the state
    setRecords([...records, { id: recordCount, name, age }]);
    setRecords1([...records1, { name, age, date, type }]);
    setvisit_stat([...visit_stat, { visited_status: "no" }]);

    // Increment record count
    setRecordCount(recordCount + 1);

    // Clear input fields

    setName("");
    setAge("");
    setShowAlert(false);
  };

  const removeRecord = (id) => {
    // Remove record from the state
    const updatedRecords = records.filter((record) => record.id !== id);

    // Update serial numbers based on the remaining records
    const updatedRecordsWithSerial = updatedRecords.map((record, index) => ({
      ...record,
      id: index + 1,
    }));

    // Update the state
    setRecords(updatedRecordsWithSerial);
  };

  const removeRecord1 = (name) => {
    // Remove record from the state
    const updatedRecords = records1.filter((record1) => record1.name !== name);

    // Update the state
    setRecords1(updatedRecords);
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Additional validation before navigating to the next page
    if (records.length === 0) {
      setShowAlert(true);
      alert("Please add at least one record before submitting!");
      return;
    }
    localStorage.setItem("name", records[0].name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("records1", JSON.stringify(records1));
    localStorage.setItem("totalTicket", totalAmount);
    localStorage.setItem("ticketCount", recordCount - 1);
    localStorage.setItem("visit_stat", JSON.stringify(visit_stat));

    // Perform any other actions or navigation logic here
    // For now, just log a message and navigate to "/meal"
    console.log("Submitting data:");
    navigate("/meal"); // Use navigate for navigation
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          height: "620px",
          margin: "0 auto",
          marginRight: "120px", // Add margin to shift it to the right
          padding: "20px",
          marginTop: "120px",
          border: "2px solid #000",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Adjust the alignment vertically
        }}
      >
        <h4 style={{ textAlign: "center" }}>Member Details</h4>

        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
        <br />

        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <br />
        <p>
          <b>Note:</b> Please enter the Email to receive the ticket!
        </p>
        {showAlert && (
          <div style={{ color: "red", marginBottom: "5px" }}>
            Please fill in the required fields with valid values!
          </div>
        )}
        <hr />

        <h4 style={{ textAlign: "center" }}>Add Members</h4>

        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <br />
        {showAlert && !name && (
          <div
            style={{ color: "red", marginTop: "-25px", marginBottom: "5px" }}
          >
            Please enter a name!
          </div>
        )}

        <input
          type="text"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
        />
        <br />
        {showAlert && !age && (
          <div
            style={{ color: "red", marginTop: "-25px", marginBottom: "5px" }}
          >
            Please enter a valid age!
          </div>
        )}

        <button
          style={{
            margin: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
          }}
          onClick={addRecord}
        >
          Add
        </button>
      </div>

      <div
        style={{
          width: "58%",
          textAlign: "center",
          paddingBottom: "20px",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            Width: "550px",
            height: "400px",
            margin: "0 auto", // Center the form horizontally
            marginRight: "120px", // Add margin to shift it to the right
            padding: "20px",
            marginTop: "100px",
            border: "2px solid #000",
            borderRadius: "8px",
          }}
        >
          <div style={{ maxHeight: "360px", overflowY: "scroll" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <thead style={{ backgroundColor: "grey", color: "white" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Sr. No</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Age</th>
                  <th style={{ padding: "12px" }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    style={{ borderBottom: "1px solid #ecf0f1" }}
                  >
                    <td style={{ padding: "10px" }}>{record.id}</td>
                    <td style={{ padding: "10px" }}>{record.name}</td>
                    <td style={{ padding: "10px" }}>{record.age}</td>
                    <td style={{ padding: "10px" }}>
                      <button
                        style={{
                          backgroundColor: "#e74c3c",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          removeRecord(record.id);
                          removeRecord1(record.name);
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            marginRight: "100px",
          }}
        >
          <a
            href="/meal"
            onClick={(e) => {
              e.preventDefault();
              if (records.length > 0) {
                handleSubmit();
              } else {
                setShowAlert(true);
                alert("Please add at least one record before submitting!");
              }
            }}
          >
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                marginRight: "100px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "4px",
                }}
              >
                Submit ({records.length} Members)
              </button>
              <div
                style={{ marginTop: "10px", color: "#333", fontSize: "18px" }}
              >
                Total Amount: ₹ {totalAmount}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Regular;
