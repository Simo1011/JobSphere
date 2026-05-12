import React from 'react';
import { Card } from 'react-bootstrap';

interface StatusOverlayProps {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const StatusOverlay: React.FC<StatusOverlayProps> = ({ show, type, title, message }) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in" 
         style={{ zIndex: 9999, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)' }}>
      <Card style={{ width: '400px', background: '#1e293b' }} className="border-0 shadow-lg rounded-4 text-center p-5 text-white">
        <div className="mb-4">
          <div className={`${type === 'success' ? 'bg-success' : 'bg-danger'} bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto`}
               style={{ width: '80px', height: '80px' }}>
            <span style={{ fontSize: '2.5rem' }}>{type === 'success' ? '✅' : '❌'}</span>
          </div>
        </div>
        <h2 className="fw-bold mb-2">{title}</h2>
        <p className="text-white-50">{message}</p>
        <div className="spinner-border spinner-border-sm text-primary mt-3" role="status"></div>
      </Card>
    </div>
  );
};

export default StatusOverlay;