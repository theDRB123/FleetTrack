import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';
import contactimg from '../assets/contactus.png';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    emailjs.init("userid");
  
    const emailData = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };
  

    emailjs.send("serviceid", "templateid", emailData)
      .then((result) => {
        console.log(result.text);
        alert('Thank you for contacting us!');
      }, (error) => {
        console.error('Failed to send email:', error.text);
        alert('Failed to send your message. Please try again later.');
      });
  };

  return (
    <div className="contact-us-container" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="contact-us-content">
        <h1>Contatct - Us</h1>
        </div>
      <img src = {contactimg} alt="contact"/>
      <div>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;