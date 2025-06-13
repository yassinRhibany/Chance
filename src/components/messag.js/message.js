import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import './message.css'; // استيراد ملف الأنيميشن

const Message = ({ show, message, onClose, duration = 3000 , coler = "#198754" }) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsVisible(true);
      
      if (duration) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setShouldRender(false), 300); // انتظر انتهاء الأنيميشن
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300); // انتظر انتهاء الأنيميشن
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <Alert 
      variant="success"
      onClose={onClose}
      dismissible
      className={`alert-message ${!isVisible ? 'hide' : ''}`}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '90%',
        backgroundColor: coler,
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        borderRadius: '8px',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '1.2rem' }}></i>
      <span>{message}</span>
    </Alert>
  );
};

export default Message;