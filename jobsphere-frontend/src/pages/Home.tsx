import React from 'react';
import { Container, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex flex-column" style={{ backgroundColor: '#0f172a', color: '#ffffff', overflow: 'hidden' }}>
      <NavbarComponent />

      {/* Main Hero Wrapper */}
      <div 
        className="flex-grow-1 d-flex align-items-center"
        style={{
          background: 'radial-gradient(circle at 50% 25%, #1e3a8a 0%, #0f172a 75%)',
          paddingTop: '60px' // Reduced top padding significantly
        }}
      >
        <Container className="text-center">
          {/* Compact Badge */}
          <Badge 
            bg="primary" 
            className="mb-3 px-3 py-2 rounded-pill shadow-sm"
            style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.05em', 
              backgroundColor: '#3b82f6',
              textTransform: 'uppercase'
            }}
          >
            The #1 Career Platform
          </Badge>
          
          {/* Scaled Down Heading */}
          <h1 
            className="display-4 fw-bold mb-2 text-white" 
            style={{ letterSpacing: '-0.03em', lineHeight: '1.2' }}
          >
            Your Next <span className="text-primary">Career Move</span> <br /> Starts Here.
          </h1>
          
          <p className="mb-4 mx-auto text-white-50 small" style={{ maxWidth: '550px' }}>
            Join thousands of professionals finding meaningful work at the world’s most innovative companies.
          </p>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center mb-5">
            <Button 
              className="px-4 py-2 fw-bold rounded-pill shadow-blue-button"
              style={{ backgroundColor: '#3b82f6', border: 'none' }}
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </Button>
            <Button 
              variant="outline-light" 
              className="px-4 py-2 fw-bold rounded-pill"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={() => navigate('/register')}
            >
              Hire Talent
            </Button>
          </div>

          {/* Compact Features Grid */}
          <Row className="g-3 justify-content-center">
            <Col md={4}>
              <Card 
                className="border-0 rounded-4 hover-lift h-100"
                style={{ background: '#1e293b' }}
              >
                <Card.Body className="py-3 px-2 text-center text-white">
                  <div className="fs-3 mb-1">🎯</div>
                  <h6 className="fw-bold mb-1">Curated Roles</h6>
                  <p className="text-white-50 extra-small mb-0">Hand-picked tech opportunities.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card 
                className="border-0 rounded-4 hover-lift h-100"
                style={{ background: '#1e293b' }}
              >
                <Card.Body className="py-3 px-2 text-center text-white">
                  <div className="fs-3 mb-1">⚡</div>
                  <h6 className="fw-bold mb-1">Instant Apply</h6>
                  <p className="text-white-50 extra-small mb-0">Apply to roles in seconds.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card 
                className="border-0 rounded-4 hover-lift h-100"
                style={{ background: '#1e293b' }}
              >
                <Card.Body className="py-3 px-2 text-center text-white">
                  <div className="fs-3 mb-1">🔒</div>
                  <h6 className="fw-bold mb-1">Verified Only</h6>
                  <p className="text-white-50 extra-small mb-0">Safe and authentic posts.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{`
        .extra-small { font-size: 0.75rem; }
        .shadow-blue-button {
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .hover-lift {
          transition: transform 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default Home;