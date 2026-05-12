import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const fetchMyApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplications(response.data || []);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError("Failed to load your applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApps = applications.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'ACCEPTED') return <Badge bg="success" className="px-3 py-2 rounded-pill">Accepted</Badge>;
    if (s === 'REJECTED') return <Badge bg="danger" className="px-3 py-2 rounded-pill">Rejected</Badge>;
    if (s === 'REVIEWED') return <Badge bg="info" className="px-3 py-2 rounded-pill">Reviewed</Badge>;
    return <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill">Pending</Badge>;
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <NavbarComponent />

      {/* BANNER SECTION */}
      <div style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'radial-gradient(circle at 50% -20%, #1e3a8a 0%, #0f172a 80%)',
        position: 'relative',
        zIndex: 1
      }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-start">
              <h1 className="fw-bold display-4 mb-2" style={{ letterSpacing: '-0.02em' }}>My Applications</h1>
              <p className="text-white-50 fs-5 mb-0">Track the status of your job applications</p>
            </div>
            <Button 
              variant="primary" 
              className="rounded-pill px-4 py-2 fw-bold shadow-blue-button"
              style={{ backgroundColor: '#3b82f6', border: 'none' }}
              onClick={() => navigate('/jobs')}
            >
              Browse More Jobs
            </Button>
          </div>
        </Container>
      </div>

      {/* CONTENT SECTION */}
      <Container className="pb-5" style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
        {error && <Alert variant="danger" className="bg-danger bg-opacity-25 border-0 text-white text-center">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-white-50">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-5 bg-dark bg-opacity-25 rounded-4 border border-secondary border-opacity-10">
            <p className="fs-4 text-white-50 mb-4">You haven't applied to any jobs yet.</p>
            <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => navigate('/jobs')}>
              Browse Available Jobs
            </Button>
          </div>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {paginatedApps.map((app, index) => (
                <Col key={index}>
                  <Card 
                    className="h-100 border-0 shadow-lg job-card-hover" 
                    style={{ background: '#1e293b', borderRadius: '24px' }}
                  >
                    <Card.Body className="d-flex flex-column p-4 text-start">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        {getStatusBadge(app.status)}
                        <span className="text-white-50 small">📍 {app.location || 'Remote'}</span>
                      </div>

                      <Card.Title className="text-white fw-bold h4 mb-1">
                        {app.jobTitle}
                      </Card.Title>
                      <Card.Subtitle className="text-primary fw-medium mb-4">
                        {app.companyName}
                      </Card.Subtitle>

                      <div className="bg-dark bg-opacity-40 rounded-4 p-3 mb-4 border border-secondary border-opacity-10">
                        <small className="text-white-50 d-block mb-1">Applied on</small>
                        <div className="text-white fw-medium">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {app.resumeUrl && (
                        <Button 
                          variant="link" 
                          className="text-primary p-0 mb-4 text-start text-decoration-none fw-medium"
                          onClick={() => {
                            const url = app.resumeUrl.startsWith('http') 
                              ? app.resumeUrl 
                              : `http://localhost:8080${app.resumeUrl}`;
                            window.open(url, '_blank');
                          }}
                        >
                          📄 View My Resume
                        </Button>
                      )}

                      <Button 
                        variant="outline-primary" 
                        className="mt-auto rounded-pill py-2 fw-bold"
                        onClick={() => navigate('/jobs')}
                      >
                        Browse Similar Jobs
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* DARK THEME PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination className="custom-pagination">
                  <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item 
                      key={i} 
                      active={i === currentPage}
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>

      <style>{`
        .job-card-hover {
          transition: all 0.3s ease;
        }
        .job-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
        }
        .shadow-blue-button {
          box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }
        .shadow-blue-button:hover {
          box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.6);
        }
        .custom-pagination .page-link {
          background-color: #1e293b;
          border-color: rgba(255,255,255,0.1);
          color: white;
          margin: 0 3px;
          border-radius: 8px;
        }
        .custom-pagination .page-item.active .page-link {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        .custom-pagination .page-item.disabled .page-link {
          background-color: #0f172a;
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default MyApplications;