import React, { useState } from "react";
import heroImage from "../../src/assets/image13-c-w0pB1D.jpg";
import phoneIcon from "../../src/assets/phone.png";
import emailIcon from "../../src/assets/asreE.jpg";
import locationIcon from "../../src/assets/location.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState("");

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field) => setFocused({ ...focused, [field]: false });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://asremenaapp.onrender.com/api/contact", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setStatus(data.message || "Message sent!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  const phones = [
    "+251934641309", "+251934641310",
    "+33664495674", "+14257800316", "+15713989298"
  ];

  // Fixed style objects to avoid mixing shorthand and non-shorthand properties
  const inputBaseStyle = {
    width: "100%",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    fontSize: "1rem",
    outline: "none",
  };

  const inputFocusedStyle = {
    borderColor: "#4f46e5",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.5)"
  };

  return (
    <div style={{ backgroundColor: "#fff", fontFamily: "sans-serif" }}>
      <div style={{
        position: "relative", 
        padding: "5rem 1rem", 
        textAlign: "center",
        color: "white", 
        borderBottomLeftRadius: "1rem", 
        borderBottomRightRadius: "1rem"
      }}>
        <img
          src={heroImage}
          alt="Background"
          style={{
            position: "absolute", 
            inset: 0, 
            width: "100%", 
            height: "100%",
            objectFit: "cover", 
            zIndex: 0
          }}
        />
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          backgroundColor: "rgba(0,0,0,0.5)", 
          zIndex: 1 
        }}></div>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          background: "linear-gradient(to right, #16a34a, #14b8a6)", 
          zIndex: 2 
        }}><img
          src={heroImage}
          alt="Background"
          style={{
            position: "absolute", 
            inset: 0, 
            width: "100%", 
            height: "100%",
            objectFit: "cover", 
            zIndex: 0
          }}
        /></div>

        <div style={{ 
          position: "relative", 
          zIndex: 3, 
          maxWidth: "1120px", 
          margin: "0 auto" 
        }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "700" }}>Contact</h1>
          <p style={{ fontSize: "1.25rem" }}>ያግኙን</p>
          <a
            href="/donate"
            style={{
              display: "inline-block",
              background: "linear-gradient(to right, #ef4444, #b91c1c)",
              color: "white",
              fontWeight: "600",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              marginTop: "1rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Donate Now
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth >= 1024 ? "repeat(2, 1fr)" : "1fr",
        gap: "4rem",
        padding: "4rem 1.5rem",
        maxWidth: "1120px",
        margin: "0 auto",
      }}>
        {/* Contact Info */}
        <div>
          <h2 style={{ 
            fontSize: "2.25rem", 
            fontWeight: "700", 
            color: "#7f1d1d", 
            marginBottom: "1.5rem" 
          }}>
            Get in Touch
          </h2>
          <p style={{ 
            fontSize: "1.125rem", 
            color: "#4b5563", 
            marginBottom: "1.5rem" 
          }}>
            We are optimists who love to work together
          </p>

          {phones.map((phone, i) => (
            <div key={i} style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "1rem", 
              color: "#374151" 
            }}>
              <img src={phoneIcon} alt="Phone" style={{ width: "28px", height: "28px" }} />
              <span style={{ marginLeft: "0.75rem" }}>{phone}</span>
            </div>
          ))}

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: "1rem", 
            color: "#374151" 
          }}>
            <img src={emailIcon} alt="Email" style={{ width: "28px", height: "28px" }} />
            <span style={{ marginLeft: "0.75rem" }}>Mennainfo@gmail.com</span>
          </div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            color: "#374151" 
          }}>
            <img src={locationIcon} alt="Location" style={{ width: "28px", height: "28px" }} />
            <p style={{ marginLeft: "0.75rem", maxWidth: "350px" }}>
              Gondar City Kebele 15 Around Stadium Next to Basketball Court
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form 
          id="contact-form" 
          onSubmit={handleSubmit} 
          style={{
            backgroundColor: "white",
            boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
            borderRadius: "0.5rem",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          <div>
            <label 
              htmlFor="name" 
              style={{ 
                fontWeight: "600", 
                marginBottom: "0.5rem", 
                display: "block" 
              }}
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              required
              style={{
                ...inputBaseStyle,
                ...(focused.name ? inputFocusedStyle : {})
              }}
            />
          </div>
          <div>
            <label 
              htmlFor="email" 
              style={{ 
                fontWeight: "600", 
                marginBottom: "0.5rem", 
                display: "block" 
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              required
              style={{
                ...inputBaseStyle,
                ...(focused.email ? inputFocusedStyle : {})
              }}
            />
          </div>
          <div>
            <label 
              htmlFor="message" 
              style={{ 
                fontWeight: "600", 
                marginBottom: "0.5rem", 
                display: "block" 
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus("message")}
              onBlur={() => handleBlur("message")}
              required
              rows="5"
              style={{
                ...inputBaseStyle,
                resize: "vertical",
                ...(focused.message ? inputFocusedStyle : {})
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#dc2626",
              color: "white",
              fontWeight: "700",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6366f1"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
          >
            Send Message
          </button>
          {status && <p style={{ 
            color: status.includes("wrong") ? "#ef4444" : "#16a34a", 
            marginTop: "1rem" 
          }}>
            {status}
          </p>}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;