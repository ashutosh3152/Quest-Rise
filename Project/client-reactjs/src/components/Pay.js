//5th page

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";
import payBG from "../assets/payBG.png";

const Pay = () => {
  const form = useRef();

  // State and handlers for form input
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const amountTicket = parseInt(localStorage.getItem("totalTicket"));
  //const [amountTicket, setAmountTicket] = useState(0);
  const amountMeal = parseInt(localStorage.getItem("totalMeal"));
  //const [amountMeal, setAmountMeal] = useState(0);
  const totalAmount = amountTicket + amountMeal;
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [nameError, setNameError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvcError, setCvcError] = useState("");

  const [to_email, setEmail] = useState(localStorage.getItem("email"));
  const [park_type, setParkType] = useState(localStorage.getItem("type"));
  const [to_date, setDate] = useState(localStorage.getItem("date"));
  const [people_count, setPeopleCount] = useState(
    localStorage.getItem("ticketCount")
  );
  const [no_breakfast, setNoBreakfast] = useState(
    localStorage.getItem("breakfast")
  );
  const [no_lunch, setNoLunch] = useState(localStorage.getItem("lunch"));
  const [no_snacks, setNoSnacks] = useState(localStorage.getItem("snack"));
  const [no_dinner, setNoDinner] = useState(localStorage.getItem("dinner"));

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [ShowPaymentFail, setShowPaymentFail] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePayment(e);
    sendEmail(e);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_wh6ynav", "template_wxwuvwi", form.current, {
        publicKey: "4sBiKk-3zTFaxuA-5",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          //alert("Your message has been submited. Thank you!");
          handlePaymentSuccess();
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
const handlePaymentSuccess = ()=>{
  setShowPaymentSuccess(true);
}
const handlePaymentSuccessClose = ()=>{
  setShowPaymentSuccess(false);
  window.location.href="/";
}

const handlePaymentFail = ()=>{
  setShowPaymentFail(true);
  window.location.href="/";
}

const handlePaymentFailClose = ()=>{
  setShowPaymentFail(false);
}

  const handleTermsClick = () => {
    setShowTermsPopup(true);
  };

  const handleCloseTermsPopup = () => {
    setShowTermsPopup(false);
  };
  const handleCheckboxChange = () => {
    setAgreedToTerms(!agreedToTerms);
  };

  const validateForm = () => {
    let isValid = true;

    if (name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (cardNumber.trim() === "" || !/^\d{16}$/.test(cardNumber)) {
      setCardNumberError("Enter a valid 16-digit card number");
      isValid = false;
    } else {
      setCardNumberError("");
    }

    // Validate expiry date
    if (expiry.trim() === "") {
      setExpiryError("Expiry date is required");
      isValid = false;
    } else {
      // Assuming expiry is in the format MM/YYYY
      const [month, year] = expiry.split("/");
      const currentDate = new Date();
      const cardExpiryDate = new Date(`20${year}`, month - 1); // Subtracting 1 as months are 0-indexed

      if (cardExpiryDate < currentDate) {
        setExpiryError("Card has expired");
        isValid = false;
      } else {
        setExpiryError("");
      }
    }

    // Validate CVC
    if (cvc.trim() === "" || !/^\d{3}$/.test(cvc)) {
      setCvcError("Enter a valid 3-digit CVC");
      isValid = false;
    } else {
      setCvcError("");
    }

    return isValid;
  };
  // Function to handle payment
  const handlePayment = (e) => {
    e.preventDefault();
    const tickettype = localStorage.getItem("tickettype");

    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions before proceeding.");
      return;
    }
    if (!validateForm()) {
      return;
    }
    //===========================sending values of regular ticket=====================================
    if (tickettype === "regular" || tickettype === "group") {
      try {
        //=====add value to ticket table =====
        const userdata = JSON.parse(localStorage.getItem("records1"));
        const url = "http://localhost:5293/api/ticket/bookticket";
        axios.post(url, userdata);
      } catch (error) {
        alert("error in ticket");
      }
      try {
        //=====add contact to table=====
        const contactdata = {
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
          phone_no: localStorage.getItem("phone"),
        };

        const url1 = "http://localhost:5293/api/contact/contacts";
        axios.post(url1, contactdata);
      } catch (error) {
        alert("error in contact");
      }
      try {
        //=====add visit status=====
        const visit = JSON.parse(localStorage.getItem("visit_stat"));

        const url2 = "http://localhost:5293/api/visitinfo/visits";
        axios.post(url2, visit);
      } catch (error) {
        alert("error in meal");
      }
      try {
        //=====add meals=====
        const meals = {
          name: localStorage.getItem("name"),
          breakfast: parseInt(localStorage.getItem("breakfast")),
          lunch: parseInt(localStorage.getItem("lunch")),
          snack: parseInt(localStorage.getItem("snack")),
          dinner: parseInt(localStorage.getItem("dinner")),
        };

        const url3 = "http://localhost:5293/api/meal/bookmeal";
        axios.post(url3, meals);
      } catch (error) {
        alert("error in meal");
      }
      try {
        //=====add payments=====
        const payment = [
          {
            name: localStorage.getItem("name"),
            amount: localStorage.getItem("totalamount"),
            ticket_amount: localStorage.getItem("totalTicket"),
            meal_amount: localStorage.getItem("totalMeal"),
          },
        ];
        const url4 = "http://localhost:5293/api/payment/payments";
        axios.post(url4, payment);
      } catch (error) {
        alert("error in payments");
      }
    } else if (tickettype === "student") {
      try {
        //=====add value to ticket table =====
        const userdata = JSON.parse(localStorage.getItem("records1"));
        const url = "http://localhost:5293/api/ticket/bookticket";
        axios.post(url, userdata);
      } catch (error) {
        alert("error in ticket");
      }
      try {
        //=====add contact to table=====
        const contactdata = {
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
          phone_no: localStorage.getItem("phone"),
        };

        const url1 = "http://localhost:5293/api/contact/contacts";
        axios.post(url1, contactdata);
      } catch (error) {
        alert("error in contact");
      }
      try {
        //=====add visit status=====
        const visit = JSON.parse(localStorage.getItem("visit_stat"));

        const url2 = "http://localhost:5293/api/visitinfo/visits";
        axios.post(url2, visit);
      } catch (error) {
        alert("error in meal");
      }
      try {
        //=====add meals=====
        const meals = {
          name: localStorage.getItem("name"),
          breakfast: parseInt(localStorage.getItem("breakfast")),
          lunch: parseInt(localStorage.getItem("lunch")),
          snack: parseInt(localStorage.getItem("snack")),
          dinner: parseInt(localStorage.getItem("dinner")),
        };

        const url3 = "http://localhost:5293/api/meal/bookmeal";
        axios.post(url3, meals);
      } catch (error) {
        alert("error in meal");
      }
      try {
        //=====add payments=====
        const payment = [
          {
            name: localStorage.getItem("name"),
            amount: localStorage.getItem("totalamount"),
            ticket_amount: localStorage.getItem("totalTicket"),
            meal_amount: localStorage.getItem("totalMeal"),
          },
        ];
        const url4 = "http://localhost:5293/api/payment/payments";
        axios.post(url4, payment);
      } catch (error) {
        alert("error in payments");
      }
      try {
        //=====add college=====
        const college = JSON.parse(localStorage.getItem("records2"));
        const url4 = "http://localhost:5293/api/college/colleges";
        axios.post(url4, college);
      } catch (error) {
        alert("error in payments");
      }
    }
  };

  return (
    <div
      style={{
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "row",
        paddingTop: "20px",
        backgroundImage: `url(${payBG})`,
        backgroundSize: "cover",
      }}
    >
      {showTermsPopup && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            padding: "20px",
            margin: "20px",
            border: "2px solid #000",
            borderRadius: "8px",
            backgroundColor: "#fff",
            zIndex: "1000",
            overflowY: "scroll",
          }}
        >
          <p>
            <button
              onClick={handleCloseTermsPopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "2px solid #000",
                cursor: "pointer",
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            <h1
              style={{
                textAlign: "center",
              }}
            >
              Amusement Park Terms and Conditions
            </h1>

            <h6>1. General Information</h6>
            <p>
              By accessing or using our amusement park, you agree to comply with
              and be bound by these terms and conditions.
            </p>

            <h6>2. Ticket Purchase</h6>
            <p>
              All tickets are non-transferable and non-refundable. The park
              reserves the right to refuse entry.
            </p>

            <h6>3. Code of Conduct</h6>
            <p>
              Guests must follow the park's code of conduct. Any behavior deemed
              inappropriate may result in expulsion from the park.
            </p>

            <h6>4. Safety Regulations</h6>
            <p>
              Adhere to all safety guidelines and regulations posted within the
              park. Failure to do so may lead to injury and expulsion.
            </p>

            <h6>5. Attractions and Rides</h6>
            <p>
              Some attractions have height and health restrictions. Follow all
              posted guidelines and listen to ride operators.
            </p>

            <h6>6. Photography and Videography</h6>
            <p>
              Personal photography is allowed, but commercial use is prohibited
              without written consent from the park.
            </p>

            <h6>7. Lost Items</h6>
            <p>
              The park is not responsible for lost or stolen items. Use lockers
              for valuables, and report lost items to park staff.
            </p>

            <h6>8. Refusal of Service</h6>
            <p>
              The park reserves the right to refuse service to anyone for any
              reason.
            </p>

            <h6>9. Changes to Terms</h6>
            <p>
              The park reserves the right to modify these terms and conditions
              at any time. Check for updates regularly.
            </p>

            <h6>10. Cancellation of park ticked</h6>
            <p>
              Tickets once booked cannot be cancelled and will not be refunded.
            </p>
            <h6>11. Contact Information</h6>
            <p>
              For questions or concerns regarding these terms, contact us at
              support@amusementpark.com.
            </p>
          </p>
          <button onClick={handleCloseTermsPopup}>Close</button>
        </div>
      )}


{showPaymentSuccess && (
        <div
          style={{
            position: "absolute",
            top: '50%',
            left: '50%',
            padding: "20px",
            margin: "20px",
            border: "2px solid #000",
            borderRadius: "8px",
            backgroundColor: "#fff",
            zIndex: "1000",
          }}
        >
          <p>
            <h1
              style={{
                textAlign: "center",
                color:'green',
              }}
            >
              Payment successful!
            </h1>
            <h5 style={{
                textAlign: "center",
              }}>Thank you for booking</h5>
            <h6 style={{
                textAlign: "center",
              }}>Please check your email for ticket.</h6>
          </p>
          <button style={{background: '#4CAF50',
  color: 'white'}}  onClick={handlePaymentSuccessClose}>Close</button>
        </div>
      )}

{ShowPaymentFail && (
        <div
          style={{
            position: "absolute",
            top: '50%',
            left: '50%',
            padding: "20px",
            margin: "20px",
            border: "2px solid #000",
            borderRadius: "8px",
            backgroundColor: "#fff",
            zIndex: "1000",
          }}
        >
          <p>
            <h1
              style={{
                textAlign: "center",
                color:'red',
              }}
            >
              Oops! something went wrong...
            </h1>
          </p>
          <button onClick={handlePaymentFailClose}>Close</button>
        </div>
      )}



      <div
        style={{
          color: "white",
          width: "480px",
          height: "530px",
          margin: "20px auto",
          marginRight: "0",
          padding: "20px",
          marginTop: "100px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <h2>Payment Details</h2>
        <hr />
        <form ref={form} onSubmit={handleFormSubmit}>
          {/* Hidden field start*/}
          <input
            type="hidden"
            className="form-control"
            name="email"
            defaultValue={to_email}
          />
          <input
            type="hidden"
            className="form-control"
            name="park_type"
            defaultValue={park_type}
          />
          <input
            type="hidden"
            className="form-control"
            name="date"
            defaultValue={to_date}
          />
          <input
            type="hidden"
            className="form-control"
            name="people_count"
            defaultValue={people_count}
          />
          <input
            type="hidden"
            className="form-control"
            name="no_breakfast"
            defaultValue={no_breakfast}
          />
          <input
            type="hidden"
            className="form-control"
            name="no_lunch"
            defaultValue={no_lunch}
          />
          <input
            type="hidden"
            className="form-control"
            name="no_snacks"
            defaultValue={no_snacks}
          />
          <input
            type="hidden"
            className="form-control"
            name="no_dinner"
            defaultValue={no_dinner}
          />
          {/* Hidden field end */}
          <p> Amount of Ticket: ₹{amountTicket} </p>
          <p> Amount of Meal: ₹{amountMeal} </p>
          <p>Total Amount: ₹{totalAmount}</p>
          Name on Card:
          <br />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span style={{ color: "red" }}>{nameError}</span>
          <br />
          Card Number:
          <br />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <span style={{ color: "red" }}>{cardNumberError}</span>
          <br />
          Expiry Date:
          <br />
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <span style={{ color: "red" }}>{expiryError}</span>
          <br />
          CVC:
          <br />
          <input
            type="password"
            value={cvc}
            placeholder="* * *"
            onChange={(e) => setCvc(e.target.value)}
          />
          <span style={{ color: "red" }}>{cvcError}</span>
          <br />
          <p>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleCheckboxChange}
            />{" "}
            I agree with{" "}
            <a href="#" onClick={handleTermsClick}>
              terms and conditions
            </a>
            <button
              type="submit"
              style={{
                width: "50%",
                padding: "5px",
                marginTop: "20px",
                border: "solid",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#2196F3",
              }}
            >
              <b>Pay</b>
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Pay;
