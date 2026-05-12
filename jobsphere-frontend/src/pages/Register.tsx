import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StatusOverlay from '../components/StatusOverlay'; // Import the overlay

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'SEEKER' as 'SEEKER' | 'RECRUITER'
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

  const handleChange = (e: React.ChangeEvent<any>) => {
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
      await axios.post('http://localhost:8080/api/auth/register', formData);
      
      // Use Overlay instead of Alert
      setStatus({
        show: true,
        type: 'success',
        title: 'Registration Successful',
        message: 'Your account has been created. Redirecting to login...'
      });

      // Brief delay so they see the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      
      setStatus({
        show: true,
        type: 'error',
        title: 'Registration Failed',
        message: errorMsg
      });
      
      // Auto-hide error overlay after 3 seconds
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ 
        background: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #0f172a 70%)' 
      }}
    >
      <Card 
        style={{ width: '480px', background: '#1e293b' }} 
        className="border-0 shadow-lg rounded-4 my-5"
      >
        <Card.Body className="p-5 text-white">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary display-6">JobSphere</h2>
            <p className="text-white-50">Create your account to get started</p>
          </div>

          {error && <Alert variant="danger" className="py-2 small border-0 text-center bg-danger bg-opacity-25 text-white">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="text-start">
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-light small">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-white text-dark py-2 border-0" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-light small">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white text-dark py-2 border-0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-light small">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white text-dark py-2 border-0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-light small">Phone Number (optional)</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white text-dark py-2 border-0"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-light small">Register as</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-white text-dark py-2 border-0"
              >
                <option value="SEEKER">Job Seeker</option>
                <option value="RECRUITER">Recruiter (I want to post jobs)</option>
              </Form.Select>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 fw-bold rounded-3 shadow" 
              disabled={loading}
              style={{ backgroundColor: '#3b82f6', border: 'none' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <small className="text-white-50">
              Already have an account?{' '}
              <a href="/login" className="text-primary fw-medium text-decoration-none">Login here</a>
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Render the Overlay */}
      <StatusOverlay {...status} />
    </Container>
  );
};

export default Register;