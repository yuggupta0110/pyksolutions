import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');

    fetch("https://formsubmit.co/ajax/pyksolutions2026@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: "New Integration Inquiry - PYK Solutions"
      })
    })
    .then(response => {
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    })
    .catch(error => {
      console.error("Form submission error:", error);
      setStatus('error');
    });
  };

  return (
    <div className="double-bezel-wrapper scroll-reveal" id="contact" style={{ maxWidth: '600px', margin: '40px auto 0' }}>
      <div className="double-bezel-inner" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="eyebrow">Connect</span>
          <h3 style={{ fontSize: '28px', marginBottom: '8px' }}>Start an Integration</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Need an enterprise integration pipeline, custom API mapping, or Azure cloud setup? Let's build a solution together.
          </p>
        </div>

        {status === 'success' ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', animation: 'line-fade-in 400ms var(--ease-out) forwards' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <h4 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--secondary)' }}>Message Sent Successfully!</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Thank you for reaching out. PYK Solutions will get back to you shortly to discuss your integration needs.
            </p>
            <button className="btn-pill btn-secondary" onClick={() => setStatus('idle')}>
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="form-input" 
                placeholder="Your Name"
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className="form-input" 
                placeholder="your.email@example.com"
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Project Details / Message</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange}
                className="form-input" 
                placeholder="Describe the source/destination systems, mapping requirements, or cloud deployment details..."
                required
                disabled={status === 'sending'}
              />
            </div>

            {status === 'error' && (
              <p style={{ color: 'var(--warning)', fontSize: '13px', marginBottom: '16px', textAlign: 'left', fontWeight: 600 }}>
                ⚠ Submission failed. Please check your network and try again.
              </p>
            )}

            <button 
              type="submit" 
              className="btn-pill btn-primary" 
              style={{ alignSelf: 'flex-start', width: '100%', marginTop: '8px' }}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Transmitting Data...' : 'Submit Message'}
              <span className="btn-arrow-wrapper">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
