import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// CRITICAL: This line must match your file name in src/assets/
// If you saved it as logo.svg, change the extension here!
import logoImg from '../assets/logo.svg'; 

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || payload.sub || 'User';
        setUserName(email.split('@')[0]);
        setUserRole(payload.role || null);
      } catch (e) {
        console.error("Failed to parse token");
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isRecruiter = userRole === 'RECRUITER';

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      variant="dark"
      className="py-3 shadow-sm"
      style={{ 
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
      }}
    >
      <Container>
        <Navbar.Brand 
          onClick={() => navigate('/')} 
          className="fw-bold fs-3 d-flex align-items-center"
          style={{ cursor: 'pointer', gap: '12px' }}
        >
          <img
            src={logoImg}
            alt="JobSphere"
            width="40"
            height="40"
            className="d-inline-block align-top"
          />
          <div className="d-flex align-items-center">
            <span className="text-white">Job</span>
            <span style={{ color: '#3b82f6' }}>Sphere</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link onClick={() => navigate('/jobs')} className="px-3 text-white-50">
              Jobs
            </Nav.Link>

            {token && (
              <>
                {!isRecruiter ? (
                  <Nav.Link onClick={() => navigate('/my-applications')} className="px-3 text-white-50">
                    My Applications
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={() => navigate('/my-posted-jobs')} className="px-3 text-white-50">
                    Dashboard
                  </Nav.Link>
                )}
              </>
            )}

            {token ? (
              <div className="d-flex align-items-center ms-lg-4 mt-3 mt-lg-0">
                <div className="me-3 text-end d-none d-sm-block border-end pe-3 border-secondary border-opacity-50">
                  <div className="text-white fw-medium small">{userName}</div>
                  <Badge bg="primary" style={{ fontSize: '0.6rem' }}>{userRole}</Badge>
                </div>
                <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ms-lg-4 mt-3 mt-lg-0">
                <Button variant="link" className="text-white-50 text-decoration-none me-3" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  className="rounded-pill px-4 fw-bold" 
                  style={{ backgroundColor: '#3b82f6', border: 'none' }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;