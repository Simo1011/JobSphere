import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Badge, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarComponent from '../components/Navbar'; // Added this
import StatusOverlay from '../components/StatusOverlay';

interface Job {
  id: number;
  title: string;
  companyName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  jobType: string;
  experienceLevel: string;
}

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [applying, setApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);

  // STATUS OVERLAY STATE
  const [status, setStatus] = useState({ 
    show: false, 
    type: 'success' as 'success' | 'error', 
    title: '', 
    message: '' 
  });

  const token = localStorage.getItem('token');

  const fetchJobs = async (term: string = '', page: number = 0) => {
    setLoading(true);
    setError('');

    try {
      const lowerTerm = term.toLowerCase().trim();
      const isLikelyLocation = lowerTerm.includes('york') || 
                               lowerTerm.includes('new') || 
                               (lowerTerm.length > 5 && !['java', 'senior', 'react', 'devops'].some(k => lowerTerm.includes(k)));

      const params: any = { page: page, size: 6 };

      if (isLikelyLocation && term.length > 2) {
        params.location = term;
      } else if (term.length > 0) {
        params.keyword = term;
      }

      const response = await axios.get('http://localhost:8080/api/jobs', {
        params: params,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const data = response.data;
      setJobs(data.content || data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.number || 0);
    } catch (err: any) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:8080/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ids = response.data.map((app: any) => app.jobId);
      setAppliedJobIds(ids);
    } catch (err) {
      console.error("Could not fetch applications");
    }
  };

  useEffect(() => {
    fetchJobs(searchTerm, currentPage);
    fetchMyApplications();
  }, [token, currentPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(0);
      fetchJobs(searchTerm, 0);
    }, 600);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchJobs(searchTerm, 0);
  };

  const openApplyModal = (job: Job) => {
    if (!token) {
      setStatus({ 
        show: true, 
        type: 'error', 
        title: 'Login Required', 
        message: 'Please login first to apply for jobs.' 
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setSelectedJob(job);
    setResumeFile(null);
    setShowApplyModal(true);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    const formData = new FormData();
    if (resumeFile) formData.append('resume', resumeFile);

    try {
      await axios.post(`http://localhost:8080/api/applications/apply/${selectedJob.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setStatus({ 
        show: true, 
        type: 'success', 
        title: 'Application Sent!', 
        message: `Successfully applied to "${selectedJob.title}".` 
      });
      
      setShowApplyModal(false);
      fetchMyApplications();
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 2500);
    } catch (err: any) {
      setStatus({ 
        show: true, 
        type: 'error', 
        title: 'Submission Failed', 
        message: err.response?.data?.message || 'Could not submit application.' 
      });
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 2500);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      {/* 1. Navbar Added Here */}
      <NavbarComponent />

      {/* Header */}
      <div style={{
        paddingTop: '140px', // Adjusted to clear Navbar
        paddingBottom: '80px',
        background: 'radial-gradient(circle at 50% -20%, #1e3a8a 0%, #0f172a 70%)'
      }}>
        <Container className="text-center">
          <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill opacity-75 small fw-bold" style={{ letterSpacing: '0.05em' }}>
            LIVE OPPORTUNITIES
          </Badge>
          <h1 className="fw-bold display-4 mb-3 text-white" style={{ letterSpacing: '-0.04em' }}>Find Your Next Role</h1>
          <p className="text-white-50 mb-5 fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            Browse through verified positions at top-tier companies.
          </p>
          
          <div className="mx-auto" style={{ maxWidth: '750px' }}>
            <Form onSubmit={handleSearch} className="d-flex gap-2 p-2 rounded-pill shadow-lg border border-secondary border-opacity-25" style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
              <div className="d-flex align-items-center ps-3 text-white-50">🔍</div>
              <Form.Control
                type="text"
                placeholder="Job title, location, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 text-white py-2 shadow-none"
              />
              <Button type="submit" variant="primary" className="rounded-pill px-5 fw-bold shadow-sm" style={{ backgroundColor: '#3b82f6', border: 'none' }}>
                Search
              </Button>
            </Form>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {error && <Alert variant="danger" className="border-0 shadow-sm text-center bg-danger bg-opacity-25 text-white">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="mt-3 text-white-50 fw-medium">Scanning the market...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 mb-3">📂</div>
            <p className="fs-4 text-white-50">No jobs found for "{searchTerm}"</p>
            <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => setSearchTerm('')}>View All Jobs</Button>
          </div>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {jobs.map((job) => {
                const alreadyApplied = appliedJobIds.includes(job.id);
                return (
                  <Col key={job.id}>
                    <Card 
                      className="h-100 border-0 shadow-lg" 
                      style={{ 
                        background: '#1e293b', 
                        borderRadius: '20px',
                        transition: 'all 0.3s ease' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                    >
                      <Card.Body className="d-flex flex-column p-4 text-start">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill small fw-bold">
                            {job.jobType.replace('_', ' ')}
                          </Badge>
                          <span className="text-white-50 small fw-medium">📍 {job.location}</span>
                        </div>
                        
                        <Card.Title className="text-white fw-bold h4 mb-1">{job.title}</Card.Title>
                        <Card.Subtitle className="text-white-50 fw-normal mb-4">
                          at <span className="text-primary fw-semibold">{job.companyName}</span>
                        </Card.Subtitle>
                        
                        <div className="bg-dark bg-opacity-25 rounded-3 p-3 mb-4">
                          <div className="text-success fw-bold fs-5">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                          </div>
                          <div className="text-white-50 small mt-1">Experience: {job.experienceLevel}</div>
                        </div>

                        <div className="mt-auto">
                          <Button 
                            variant={alreadyApplied ? "secondary" : "primary"} 
                            className={`w-100 py-2 fw-bold rounded-pill ${alreadyApplied ? 'opacity-50' : ''}`}
                            disabled={alreadyApplied}
                            style={!alreadyApplied ? { backgroundColor: '#3b82f6', border: 'none' } : {}}
                            onClick={() => openApplyModal(job)}
                          >
                            {alreadyApplied ? "✓ Applied" : "Apply Now"}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
                  <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>

      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0" style={{ background: '#1e293b' }}>
          <Modal.Title className="text-white fw-bold">Apply for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: '#1e293b' }}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white-50 small">Upload Resume (PDF)</Form.Label>
            <Form.Control 
              type="file" 
              accept=".pdf"
              onChange={(e: any) => setResumeFile(e.target.files[0])}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Button 
            className="w-100 py-2 fw-bold rounded-pill" 
            onClick={handleApply}
            disabled={applying}
            style={{ backgroundColor: '#3b82f6', border: 'none' }}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </Button>
        </Modal.Body>
      </Modal>

      {/* Overlay component */}
      <StatusOverlay {...status} />
    </div>
  );
};

export default Jobs;