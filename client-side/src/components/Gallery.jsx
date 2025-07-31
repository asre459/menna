import React from "react";
import gallaryone from '../../src/assets/galary1.jpg';
import gallarytwo from '../../src/assets/gallery2.jpg';

const styles = {
  container: {
    maxWidth: '900px',
    margin: '3rem auto',
    padding: '0 1rem',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748', // dark slate
    marginBottom: '2rem',
    textShadow: '1px 1px 4px rgba(0,0,0,0.1)',
  },
  imagesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  imageHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
  }
};

function Gallery() {
  // Simple hover effect with React useState to toggle styles
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Here's some from our collection</h1>
      <div style={styles.imagesWrapper}>
        {[gallaryone, gallarytwo].map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Gallery image"
            style={{
              ...styles.image,
              ...(hoveredIndex === i ? styles.imageHover : {})
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;
