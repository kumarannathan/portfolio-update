import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: "📧",
      label: "Email",
      value: "kumarann@umich.edu",
      link: "mailto:kumarann@umich.edu"
    },
    {
      icon: "📱",
      label: "Phone",
      value: "248-635-7735",
      link: "tel:+12486357735"
    },
    {
      icon: "📍",
      label: "Location",
      value: "Ann Arbor, MI",
      link: "#"
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "linkedin.com/in/kkumarann",
      link: "https://linkedin.com/in/kkumarann"
    }
  ];

  return (
    <div className="contact">
      <h2 className="section-title">get in touch</h2>
      <div className="section-line"></div>
      
      <div className="contact-container">
        <div className="contact-info">
          <h3>I'm happy you read this far.</h3>
          <p>Have a project in mind or just want to chat about tech? I'd love to hear from you!</p>
          
          <div className="contact-details">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-item">
                <span className="contact-icon">{info.icon}</span>
                <a href={info.link} className="contact-value" target="_blank" rel="noopener noreferrer">
                  {info.value}
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">
              send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 