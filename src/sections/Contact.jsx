import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
  const [state, handleSubmit] = useForm('maqrawae');

  const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;
  const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER;

  if (state.succeeded) {
    return (
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <span className="contact-label">04. Contact</span>
          <h2 className="contact-title">
            Let's build something<br />
            <span className="contact-highlight">that actually works</span>
          </h2>
          <div className="form-success">
             Message sent successfully! I'll get back to you soon.
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="form-submit"
            style={{ marginTop: '20px' }}
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-content">
        <span className="contact-label">04. Contact</span>
        <h2 className="contact-title">
          Let's build something<br />
          <span className="contact-highlight">that actually works</span>
        </h2>
        <p className="contact-text">
          Whether you need a website, a tester, or just want to chat — 
          I'm always down.
        </p>

        <div className="contact-grid">
          <div className="contact-form-column">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="form-input"
                  />
                  <ValidationError 
                    field="name" 
                    errors={state.errors} 
                    className="form-error-text"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    className="form-input"
                  />
                  <ValidationError 
                    field="email" 
                    errors={state.errors} 
                    className="form-error-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="form-input"
                />
                <ValidationError 
                  field="subject" 
                  errors={state.errors} 
                  className="form-error-text"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your message"
                  rows="5"
                  required
                  className="form-textarea"
                />
                <ValidationError 
                  field="message" 
                  errors={state.errors} 
                  className="form-error-text"
                />
              </div>

              <button 
                type="submit" 
                className={`form-submit ${state.submitting ? 'submitting' : ''}`}
                disabled={state.submitting}
              >
                {state.submitting ? 'Sending...' : 'Send Message →'}
              </button>

              {state.errors && (
                <div className="form-error">
                  Oops! Please check the fields above and try again.
                </div>
              )}
            </form>
          </div>

          <div className="contact-info-column">
            <div className="right-content-card">
              <h3 className="right-content-title">Reach me directly</h3>

              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-info-item" target="_blank" rel="noopener noreferrer">
                <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span className="info-text">{CONTACT_EMAIL}</span>
              </a>

              <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`} className="contact-info-item">
                <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="info-text">{PHONE_NUMBER}</span>
              </a>

              <a href="https://www.linkedin.com/in/john-cedric-acapulco" target="_blank" rel="noopener noreferrer" className="contact-info-item">
                <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="info-text">John Cedric Acapulco</span>
              </a>

              <a href="https://github.com/Ceddy21" target="_blank" rel="noopener noreferrer" className="contact-info-item">
                <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="info-text">Ceddy21</span>
              </a>

              <a href="https://www.facebook.com/john.cedric.acapulco" target="_blank" rel="noopener noreferrer" className="contact-info-item">
                <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="info-text">John Cedric Acapulco</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;