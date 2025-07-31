import React, { useEffect, useState } from "react";
import aboutImage from "../../src/assets/image6.jpg";

function About() {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dynamicGridStyle = {
    ...styles.grid,
    gridTemplateColumns: isWideScreen ? "1fr 1fr" : "1fr",
    justifyItems: isWideScreen ? "start" : "center",
  };

  return (
    <div style={styles.wrapper}>
      {/* Hero Section */}
      <header style={styles.hero}>
        <img src={aboutImage} alt="About Background" style={styles.heroImage} />
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>About Menna</h1>
          <p style={styles.heroSubtitle}>ስለ እኛ</p>
          <a href="/donate" style={styles.donateButton}>
            Donate Now
          </a>
        </div>
      </header>

      {/* About Section */}
      <section style={styles.aboutSection}>
        <div style={dynamicGridStyle}>
          <div>
            <img src={aboutImage} alt="Menna" style={styles.image} />
          </div>
          <div style={styles.aboutText}>
            <h2 style={styles.sectionTitle}>
              About <span style={styles.highlight}>Menna</span>
            </h2>
            <p style={styles.paragraph}>
              <strong>Background of the Organization:</strong> Menna Elderly &
              Mentally Challenging Support Center is a local, non-profit,
              non-governmental organization founded in 2014 in Gondar by
              university students...
              <br /><br />
              Over time, Menna evolved into a holistic care center...
              <br /><br />
              <strong>Meaning:</strong> The word “MENNA” means new light, new
              hope, and unexpected free food.
              <br /><br />
              <strong>Profile:</strong><br />
              Name: MENNA Elderly and Mentally Challenging Support Center<br />
              Established: 2014<br />
              Type: Local NGO<br />
              Registration Number: 046<br />
              City: Gondar, Ethiopia
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section style={styles.missionSection}>
        <div style={styles.centeredContent}>
          <h2 style={styles.sectionTitleWhite}>Our Mission</h2>
          <p style={styles.whiteParagraph}>
       Build the best product that creates the most value for our customers,
        use business to inspire and implement environmentally friendly solutions.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section style={styles.visionSection}>
        <div style={styles.centeredContent}>
          <h2 style={styles.sectionTitleWhite}>Our Vision</h2>
          <p style={styles.whiteParagraph}>
We strive to go above and beyond for our clients no matter the challenge.
 We aim to deliver our very best work every single day across our services.
          </p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#fff",
    color: "#1f2937",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  hero: {
    position: "relative",
    height: "500px",
    overflow: "hidden",
  },
  heroImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 1rem",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: "1.5rem",
    color: "#fff",
    marginTop: "0.5rem",
  },
  donateButton: {
    marginTop: "1.5rem",
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
    textDecoration: "none",
  },
  aboutSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 1.5rem",
  },
  grid: {
    display: "grid",
    gap: "2.5rem",
    alignItems: "center",
    textAlign: "left",
  },
  aboutText: {
    maxWidth: "600px",
  },
  image: {
    width: "400px",
    height: "400px", // fixed typo from "hight"
    borderRadius: "1.5rem",
    boxShadow: "0 8px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    padding: "2rem",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
  },
  highlight: {
    color: "#ef4444",
  },
  paragraph: {
    fontSize: "1.125rem",
    lineHeight: "1.75",
    color: "#374151",
  },
  missionSection: {
    background: 'linear-gradient(to right,hsl(35, 100.00%, 91.20%),rgb(243, 238, 237))',
    color: "#1f2937",
    padding: "5rem 1rem",
  },
  visionSection: {
    background: 'linear-gradient(to right,hsl(35, 100.00%, 91.20%),rgb(250, 241, 238))',
     color: "#1f2937",
    padding: "5rem 1rem",
  },
  centeredContent: {
    maxWidth: "768px",
    margin: "0 auto",
    textAlign: "center",
  },
  sectionTitleWhite: {
    fontSize: "2.75rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  whiteParagraph: {
    fontSize: "1.25rem",
    lineHeight: "1.75",
  },
};

export default About;
