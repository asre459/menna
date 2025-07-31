import React from "react";

const heroImageUrl = "https://cms.mennacenter.com/uploads/photo_41_2024_06_24_11_08_57_d6d2c1b50a.jpg"; // Fallback or background

const styles = {
  container: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heroSection: {
    position: "relative",
    borderRadius: "0 0 1rem 1rem",
    color: "white",
    padding: "5rem 1rem 6rem",
    textAlign: "center",
    overflow: "hidden",
    background: "linear-gradient(90deg, #16a34a 0%, #0d9488 100%)",
  },
  backgroundImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlayBlack: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  overlayGradient: {
    position: "absolute",
    inset: 0,
    // background: "linear-gradient(90deg, rgba(22,163,74,0.85), rgba(13,148,136,0.85))",
    zIndex: 2,
  },
  heroContent: {
    position: "relative",
    zIndex: 10,
    maxWidth: "90rem",
    margin: "0 auto",
    padding: "0 1.5rem",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  heroButton: {
    display: "inline-block",
    background: "linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)",
    color: "white",
    fontWeight: "600",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    boxShadow: "0 10px 15px -3px rgba(239,68,68,0.5)",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    textDecoration: "none",
    cursor: "pointer",
  },
  causesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2.5rem",
    padding: "2rem",
    maxWidth: "90rem",
    margin: "0 auto",
  },
  causeItem: {
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    borderRadius: "0.5rem",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  causeImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  causeContent: {
    padding: "1rem 1.5rem 2rem",
    flex: "1",
  },
  causeTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  causeText: {
    fontSize: "0.95rem",
    color: "#475569",
    lineHeight: 1.5,
  },
  donateLink: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: "1.5rem",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)",
    borderRadius: "9999px",
    textDecoration: "none",
    boxShadow: "0 4px 6px rgba(239,68,68,0.5)",
    transition: "transform 0.3s ease",
  },
  arrow: {
    marginLeft: "0.75rem",
    stroke: "#cbd5e1",
  },
};

const causes = [
  {
    title: "Incontinence Supplies",
    text: "Donate to help us provide incontinence supplies — diapers, bed pads, gloves, and more — to over 2,500 bedridden and mentally disabled residents.",
    image: "https://cms.mennacenter.com/uploads/photo_41_2024_06_24_11_08_57_d6d2c1b50a.jpg",
  },
  {
    title: "Building Our New Home",
    text: "Help us build a sanctuary for the homeless, elderly, and disabled. Your support helps provide dignity, shelter, and hope to the most vulnerable.",
    image: "https://cms.mennacenter.com/uploads/photo_8_2024_06_24_11_08_57_b79706da38.jpg",
  },
];

function OurCause() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <img
          src={heroImageUrl}
          alt="Hero background"
          style={styles.backgroundImage}
        />
        <div style={styles.overlayBlack} />
        <div style={styles.overlayGradient} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Our Causes</h1>
          <p style={styles.heroSubtitle}>የእኛ ጉዳይ</p>
          <a
            href="/donate"
            style={styles.heroButton}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Donate Now
          </a>
        </div>
      </section>

      {/* Cause Cards */}
      <ul style={styles.causesList}>
        {causes.map((cause, idx) => (
          <li
            key={idx}
            style={styles.causeItem}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            <img src={cause.image} alt={cause.title} style={styles.causeImage} loading="lazy" />
            <div style={styles.causeContent}>
              <h3 style={styles.causeTitle}>{cause.title}</h3>
              <p style={styles.causeText}>{cause.text}</p>
              <a
                href="/donate"
                style={styles.donateLink}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Donate
                <svg
                  style={styles.arrow}
                  width="10"
                  height="16"
                  viewBox="0 0 10 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L9 8L1 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OurCause;
