import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import StatusOverlay from '../components/StatusOverlay';

const PostJob: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // STATUS OVERLAY STATE
  const [status, setStatus] = useState({ 
    show: false, 
    type: 'success' as 'success' | 'error', 
    title: '', 
    message: '' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus({ 
          show: true, 
          type: 'error', 
          title: 'Login Required', 
          message: 'Please login first to post a job.' 
        });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      await axios.post('http://localhost:8080/api/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ 
        show: true, 
        type: 'success', 
        title: 'Success!', 
        message: 'Your job has been posted successfully.' 
      });

      setTimeout(() => navigate('/my-posted-jobs'), 2000);
    } catch (err: any) {
      setStatus({ 
        show: true, 
        type: 'error', 
        title: 'Post Failed', 
        message: err.response?.data?.message || 'Failed to post job. Please try again.' 
      });
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <NavbarComponent />
      
      <Container style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-white">Post a New Job</h2>
          <Button 
            variant="outline-light" 
            className="rounded-pill px-4" 
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => navigate('/my-posted-jobs')}
          >
            ← Back to My Posted Jobs
          </Button>
        </div>

        <Card className="border-0 shadow-lg" style={{ background: '#1e293b', borderRadius: '24px' }}>
          <Card.Body className="p-5">
            {error && <Alert variant="danger" className="bg-danger bg-opacity-25 border-0 text-white">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="text-start">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white-50 small fw-bold">JOB TITLE</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="e.g. Senior Java Backend Developer"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white-50 small fw-bold">COMPANY NAME</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      placeholder="Your Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="text-white-50 small fw-bold">LOCATION</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="e.g. New York, NY or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white-50 small fw-bold">MINIMUM SALARY ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="salaryMin"
                      placeholder="120000"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      required
                      className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white-50 small fw-bold">MAXIMUM SALARY ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="salaryMax"
                      placeholder="160000"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      required
                      className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white-50 small fw-bold">JOB TYPE</Form.Label>
                    <Form.Select 
                      name="jobType" 
                      value={formData.jobType} 
                      onChange={handleChange}
                      className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="REMOTE">Remote</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white-50 small fw-bold">EXPERIENCE LEVEL</Form.Label>
                    <Form.Select 
                      name="experienceLevel" 
                      value={formData.experienceLevel} 
                      onChange={handleChange}
                      className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                    >
                      <option value="ENTRY">Entry Level</option>
                      <option value="MID">Mid Level</option>
                      <option value="SENIOR">Senior Level</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-5">
                <Form.Label className="text-white-50 small fw-bold">JOB DESCRIPTION</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="description"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="bg-dark bg-opacity-50 border-secondary border-opacity-25 text-white py-2"
                  style={{ resize: 'none' }}
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-3 fw-bold rounded-pill shadow-blue-button" 
                disabled={loading}
                style={{ backgroundColor: '#3b82f6', border: 'none' }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Posting...</>
                ) : 'Post This Job'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* SUCCESS/ERROR OVERLAY */}
      <StatusOverlay {...status} />

      <style>{`
        .shadow-blue-button {
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }
        .shadow-blue-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.6);
        }
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }
        select option {
          background: #1e293b;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default PostJob;