import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    // Inject keyframes for scrolling text and ocean wave
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollText {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      @keyframes wave {
        0% { background-position-x: 0; }
        100% { background-position-x: 1000px; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", overflowX: "hidden", marginTop: "0px" }}>
      {/* Scrolling Marquee */}
      <div style={styles.marqueeContainer}>
        <div style={styles.marqueeText}>
          ELDERLY AND MENTALLY CHALLENGING SUPPORT CENTER – GONDAR, ETHIOPIA
        </div>
      </div>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        {/* Ocean wave animation layer */}
        <div style={{ ...styles.heroOverlay, ...styles.oceanWave }}></div>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>
            The word MENNA means new light, new hope and unexpected free food.
          </h1>
          <div style={styles.ctaContainer}>
            <div style={styles.mennaGlow}>Menna</div>
            <Link to="/donate" style={styles.donateButton}>Donate Now</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>
          Our Services <br />
          <span style={{ color: "red" }}>የእኛ አገልግሎቶች</span>
        </h2>
        <div style={styles.servicesGrid}>
          <div style={styles.serviceItem}>
             <div>
              <h3 style={styles.serviceTitle}>Full Shelter Care Service</h3>
              <p>
                We provide basic services—food, clothes, shelter, hygiene, and
                medical—to elderly people and those with mental disabilities in
                our center.
              </p>
            </div>
            <img
              src="https://cms.mennacenter.com/uploads/S_R60694eee_1587x2048_b75a1a5637.jpg"
              alt="Full Shelter care service"
              style={styles.serviceImage}
            />
           
          </div>

          <div style={styles.serviceItem }>
            <div>
              <h3 style={styles.serviceTitle}>Medical and Medication Support</h3>
              <p>
                We provide residents with access to essential medicines and
                medical care to ensure both their physical and mental
                well-being.
              </p>
            </div>
            <img
              src="https://cms.mennacenter.com/uploads/photo_2022_01_28_20_13_11_3316424b08.jpg"
              alt="Medical and medication support"
              style={styles.serviceImage}
            />
          </div>
          
            <div style={styles.serviceItem}>
            <div>
              <h3 style={styles.serviceTitle}>Free Clothing and showering</h3>
              <p>
             One of the services provided by the Mena Elderly and Mentally Ill Support Center to the community is the street shower service.
              This street shower was started with the intention of providing services to street children who live and sleep on the streets,
               but it is a service that also includes other people.
              </p>
            </div>
            <img
              src="https://cms.mennacenter.com/uploads/showring_38504a7da3.jpg"
              alt="Medical and medication support"
              style={styles.serviceImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  marqueeContainer: {
    position: "relative",
    textAlign: "center",
    top: "350px",
    width: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    zIndex: 2,
  },

  marqueeText: {
    display: "inline-block",
    paddingLeft: "100%",
    fontSize: "1.5rem",
    fontWeight: "bold",
    animation: "scrollText 70s linear infinite",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
    color: "#ffffff",
  },

  heroSection: {
    height: "100vh",
    backgroundImage: "url('https://cms.mennacenter.com/uploads/photo_33_2024_06_24_11_08_57_c238876904.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#fff",
  },

  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },

  oceanWave: {
    backgroundImage: 'url("https://i.ibb.co/1nZ4tzL/ocean-wave.png")',
    backgroundRepeat: "repeat-x",
    backgroundSize: "contain",
    opacity: 0.3,
    animation: "wave 20s linear infinite",
  },

  heroText: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    marginTop: "100px",
  },

  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "100px",
  },

  ctaContainer: {
    position: "relative",
    bottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    zIndex: 2,
  },

  mennaGlow: {
    fontSize: "2rem",
    background: "linear-gradient(to right, #a1ffce, #faffd1)",
    color: "#111",
    padding: "12px 30px",
    borderRadius: "12px",
    fontWeight: "bold",
    animation: "glow 2s ease-in-out infinite alternate",
    boxShadow: "0 0 15px rgba(255,255,255,0.5)",
  },

  donateButton: {
    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
    color: "white",
    padding: "12px 30px",
    borderRadius: "20px",
    fontSize: "1rem",
    fontWeight: "bold",
    textDecoration: "none",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
  },

  servicesSection: {
    padding: "80px 20px",
    background: "#f9f9f9",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "2.5rem",
    overflow: "hidden",
    display: "inline-block",
    marginBottom: "40px",
    background: "linear-gradient(to right, #00c9ff, #92fe9d)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  },
servicesGrid: {
    display: "grid",
    gap: "3rem",
    maxWidth: "3000px",
    margin: "10 auto",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    alignItems: "center",
  },

  serviceItem: {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "20px",
    background: "#fff",
    borderRadius: "1.25rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  serviceImage: {
    width: "350px",
    height: "auto",
    borderRadius: "1.25rem",
    boxShadow: "1p 1px 1px rgba(0,0,0,0.2)",
  },
  serviceTitle: {
    fontSize: "1.75rem",
    fontWeight: "700",
    marginBottom: "0.8rem",
    color: "#111827",
  },
};

export default Home;
