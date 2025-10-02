import React, { useState } from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";  


import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobNo: "",
    subject: "",
    message: "",
  });

  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch("http://localhost:2012/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      const res = await data.json();
      console.log(res);

      if (data.ok) {
        toast.success("Message submitted successfully");
      } else {
        toast.error(res.message || "Error in submitting message");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error in submitting message"); 
    }

    // reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobNo: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-form-container">
      {/* contact info */}
      <div className="contact-info">
        <h2>Have A Question Or Issue?</h2>
        <p>
          We are here to support you anytime. If you face any problems using our
          platform, feel free to reach out.
        </p>
        <p>
          Our team ensures smooth supply chain tracking with quick solutions to
          your queries.
        </p>
        <p>
          Transparency and communication are our priorities, so don’t hesitate
          to connect with us.
        </p>
        <p>
          We value your feedback and will always work to improve your
          experience.
        </p>

        <div className="contact">
          <p>
            <FaEnvelope className="icon" /> supply@gmail.com
          </p>
          <p>
            <FaPhone className="icon" /> +91 234364536
          </p>
        </div>
      </div>

      {/* contact form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="row">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          type="text"
          value={formData.mobNo}
          name="mobNo"
          onChange={handleChange}
          placeholder="Phone No"
        />

        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Your Subject"
        />

        <textarea
          placeholder="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default ContactPage;
