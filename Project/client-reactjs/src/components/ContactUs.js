import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css';

import ContactBGImg from '../assets/ContactUsBG.jpg';


const ContactUs = () => {
  const form = useRef();

const[name, setName]= useState('');
const[email, setEmail]= useState('');
const[msg, setMsg]= useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_sgs299m', 'template_ck2dhm2', form.current, {
        publicKey: '4sBiKk-3zTFaxuA-5',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("Your message has been submited. Thank you!");
          window.location.href='/contactUs'
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div style={{
      paddingBottom: '20px',
    paddingTop: '20px',
    backgroundImage: `url(${ContactBGImg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    }}>
      <div
        style={{
          color: 'white',
          maxWidth: '520px',
          height: '500px',
          margin: '0 auto', // Center the form horizontally
          marginRight: '80px', // Add margin to shift it to the right
          padding: '20px',
          marginTop: '100px',
          borderRadius: '8px',
          
        }}
      >
        <h2>Contact Us</h2>
        <br />
        <form ref={form} onSubmit={sendEmail}>
          <div className="mb-3" id='name'>
            <b>Name </b>{' '}
            <input
              type="text"
              name="from_name"
              className="form-control"
              id="name"
              placeholder="Enter your Name"
            />
          </div>
          <div className="mb-3" id='email'>
            <b>Email </b>{' '}
            <input
              type="email"
              name="from_email"
              className="form-control"
              id="email"
              placeholder="Enter your Email Address"
            />
          </div>
          <div className="mb-3" id='msg'>
            <b>Message </b>{' '}
            <textarea
              name="message"
              className="form-control"
              id="message"
              rows="4"
              placeholder="Enter Message "
            ></textarea>
          </div>
          <button
            type="submit" // Change the button type to submit
            style={{
              width: '50%',
              padding: '10px',
              marginTop: '20px',
              marginLeft: '25%',
              border: '2px solid',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#2196F3', // Add a background color
              color: '#fff', // Add text color
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
