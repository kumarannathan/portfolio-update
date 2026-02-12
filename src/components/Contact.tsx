import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Let's Connect</h2>

        <div className="contact-grid">
          <div className="contact-item">
            <p className="contact-label">Email</p>
            <a href="mailto:kumarann@umich.edu" className="contact-link">kumarann@umich.edu</a>
          </div>

          <div className="contact-item">
            <p className="contact-label">Phone</p>
            <p className="contact-value">+1 248 635 7735</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;