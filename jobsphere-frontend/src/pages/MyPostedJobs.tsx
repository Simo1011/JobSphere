import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal, ListGroup, ButtonGroup, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import StatusOverlay from '../components/StatusOverlay';

const MyPostedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const [status, setStatus] = useState({ 
    show: false, 
    type: 'success' as 'success' | 'error', 
    title: '', 
    message: '' 
  });

  const fetchMyPostedJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8080/api/applications/received', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      let fetchedJobs = response.data || [];

      // Logic preserved: Sort by applicant count then newest
      fetchedJobs.sort((a: any, b: any) => {
        const countA = a.totalApplications || 0;
        const countB = b.totalApplications || 0;
        if (countA !== countB) return countB - countA;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      setJobs(fetchedJobs);
    } catch (err: any) {
      setError("Failed to load your posted jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPostedJobs();
  }, []);

  const openApplications = (job: any) => {
    setSelectedJobTitle(job.jobTitle || job.title || "Job");
    setApplications(job.applications || []);
    setShowModal(true);
  };

  const updateStatus = async (applicationId: number, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      await axios.patch(
        `http://localhost:8080/api/applications/${applicationId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setStatus({ show: true, type: 'success', title: 'Updated', message: `Marked as ${newStatus}` });
      setShowModal(false);
      fetchMyPostedJobs();
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 2000);
    } catch (err) {
      setStatus({ show: true, type: 'error', title: 'Failed', message: 'Could not update status' });
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 2000);
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination Logic (Preserved)
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = jobs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <NavbarComponent />

      {/* FIXED BANNER: Increased padding to prevent card interference */}
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
              <h1 className="fw-bold display-4 mb-2" style={{ letterSpacing: '-0.02em' }}>My Posted Jobs</h1>
              <p className="text-white-50 fs-5 mb-0">Manage your listings and applicants</p>
            </div>
            <Button 
              variant="primary" 
              className="rounded-pill px-4 py-2 fw-bold shadow-blue-button"
              style={{ backgroundColor: '#3b82f6', border: 'none' }}
              onClick={() => navigate('/post-job')}
            >
              + Post New Job
            </Button>
          </div>
        </Container>
      </div>

      {/* MAIN CONTENT: Added Margin and higher Z-Index */}
      <Container className="pb-5" style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
        {error && <Alert variant="danger" className="text-center bg-danger bg-opacity-25 border-0 text-white">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5">
            <p className="fs-4 text-white-50">You haven't posted any jobs yet.</p>
            <Button variant="outline-primary" className="rounded-pill" onClick={() => navigate('/post-job')}>Post Your First Job</Button>
          </div>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {paginatedJobs.map((job, index) => (
                <Col key={index}>
                  <Card className="h-100 border-0 shadow-lg job-card-hover" 
                        style={{ background: '#1e293b', borderRadius: '24px' }}>
                    <Card.Body className="d-flex flex-column p-4 text-start">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill small fw-bold">ACTIVE</Badge>
                        <span className="text-white-50 small">📍 {job.location}</span>
                      </div>

                      <Card.Title className="text-white fw-bold h4 mb-1">
                        {job.jobTitle || job.title}
                      </Card.Title>
                      <Card.Subtitle className="text-primary fw-medium mb-4">
                        {job.companyName}
                      </Card.Subtitle>

                      <div className="bg-dark bg-opacity-40 rounded-4 p-4 mb-4 d-flex justify-content-between align-items-center border border-secondary border-opacity-10">
                        <div>
                          <div className="text-white fw-bold h2 mb-0">{job.totalApplications || 0}</div>
                          <div className="text-white-50 small text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Applicants</div>
                        </div>
                        <div className="text-end">
                          <div className="text-white-50 small">Posted on</div>
                          <div className="text-white fw-medium">
                            {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="primary" 
                        className="w-100 py-3 fw-bold rounded-pill mt-auto shadow-blue-button"
                        style={{ backgroundColor: '#3b82f6', border: 'none' }}
                        onClick={() => openApplications(job)}
                      >
                        Manage Applicants
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination with Dark Theme Styling */}
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

      {/* Modal Section */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton closeVariant="white" className="border-0" style={{ background: '#1e293b' }}>
          <Modal.Title className="text-white fw-bold">Applications for "{selectedJobTitle}"</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 text-start" style={{ background: '#1e293b' }}>
          {applications.length === 0 ? (
            <div className="text-center py-5 text-white-50">No applications received yet.</div>
          ) : (
            <ListGroup variant="flush">
              {applications.map((app) => (
                <ListGroup.Item key={app.id} className="py-3 bg-transparent border-secondary border-opacity-10 text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-bold">{app.applicantName || `Applicant #${app.applicantId}`}</h6>
                      <small className="text-white-50 d-block">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </small>
                      {app.resumeUrl && (
                        <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => window.open(app.resumeUrl, '_blank')}>
                          📄 View Resume
                        </Button>
                      )}
                    </div>
                    <div className="text-end">
                      <Badge bg={app.status === 'ACCEPTED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'warning'} className="mb-2 d-block">
                        {app.status || 'PENDING'}
                      </Badge>
                      <ButtonGroup size="sm">
                        <Button variant="success" onClick={() => updateStatus(app.id, 'ACCEPTED')} disabled={updatingId === app.id || app.status === 'ACCEPTED'}>
                          Accept
                        </Button>
                        <Button variant="danger" onClick={() => updateStatus(app.id, 'REJECTED')} disabled={updatingId === app.id || app.status === 'REJECTED'}>
                          Reject
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ background: '#1e293b' }}>
          <Button variant="outline-light" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <StatusOverlay {...status} />

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

export default MyPostedJobs;