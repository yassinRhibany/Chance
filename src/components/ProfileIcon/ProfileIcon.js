import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonFill, ExclamationTriangleFill } from 'react-bootstrap-icons';

export default function ProfileIcon ({ isProfileComplete }){
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/complete-profile')}
      className="profile-icon-btn"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#393F4D',
        border: `2px solid ${isProfileComplete ? '#FEDA6A' : '#ff5555'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        outline: 'none'
      }}
    >
      <PersonFill 
        size={20} 
        color={isProfileComplete ? '#FEDA6A' : '#ff5555'} 
      />
      
      {!isProfileComplete && (
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          width: '15px',
          height: '15px',
          backgroundColor: '#FEDA6A',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ExclamationTriangleFill color="#1D1E22" size={8} />
        </div>
      )}
    </button>
  );
};
