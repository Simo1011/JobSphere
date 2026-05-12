import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      
      setSuccess(true);

      // Smooth transition to the jobs page
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ 
        background: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #0f172a 70%)',
        fontFamily: "'Inter', sans-serif" 
      }}
    >
      <Card 
        style={{ width: '420px', background: '#1e293b' }}
        className="border-0 shadow-lg rounded-4 overflow-hidden position-relative"
      >
        <Card.Body className="p-5 text-white text-center">
          
          {/* SUCCESS OVERLAY */}
          {success ? (
            <div className="py-4 animate-fade-in">
              <div className="mb-4">
                <div 
                  className="bg-success bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '80px', height: '80px' }}
                >
                  <span style={{ fontSize: '2.5rem' }}>✅</span>
                </div>
              </div>
              <h2 className="fw-bold text-white mb-2" style={{ letterSpacing: '-0.03em' }}>Welcome Back!</h2>
              <p className="text-white-50 small">Login successful. Redirecting you to JobSphere...</p>
              <div className="spinner-border spinner-border-sm text-primary mt-3" role="status"></div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h1 className="fw-bold fs-2 mb-2 text-white" style={{ letterSpacing: '-0.04em' }}>JobSphere</h1>
                <p className="text-white-50 small">Welcome back. Sign in to continue.</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4 py-2 small border-0 bg-danger bg-opacity-10 text-danger animate-shake">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="text-start">
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-light small opacity-75">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white text-dark py-2 border-0 shadow-sm" 
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-light small opacity-75">Password</Form.Label>
                  <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white text-dark py-2 border-0"
                      style={{ borderRadius: '10px 0 0 10px' }}
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-0 px-3 text-muted bg-white"
                      style={{ fontSize: '0.75rem', fontWeight: '600' }}
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fw-bold rounded-3 mt-2 shadow-blue-button" 
                  disabled={loading}
                  style={{ backgroundColor: '#3b82f6', border: 'none', transition: 'all 0.2s ease' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <small className="text-white-50">
                  Don't have an account?{' '}
                  <a href="/register" className="text-primary fw-semibold text-decoration-none">
                    Create one
                  </a>
                </small>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <style>{`
        .shadow-blue-button {
           box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
        }
        .shadow-blue-button:hover {
           box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
           transform: translateY(-1px);
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </Container>
  );
};

export default Login; 