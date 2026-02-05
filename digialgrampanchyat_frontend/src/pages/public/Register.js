import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, ProgressBar, InputGroup } from 'react-bootstrap';
import { API } from '../../config/api';
import './style.css';

export default function Register() {
  const [userTypes, setUserTypes] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    fetch(API.userTypes)
      .then(res => res.json())
      .then(data => {
        setUserTypes(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching user types:', err);
      });
  }, []);

  const init = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    contact_no: '',
    aadharcard_no: '',
    username: '',
    type: '',
    password: ''
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'updateField':
        const newState = { ...state, [action.field]: action.val };
        calculateProgress(newState);
        if (action.field === 'password') {
          calculatePasswordStrength(action.val);
        }
        return newState;
      default:
        return state;
    }
  };

  const [user, dispatch] = useReducer(reducer, init);
  const navigate = useNavigate();

  function calculateProgress(userData) {
    const fields = Object.keys(init);
    const filledFields = fields.filter(field => userData[field]?.toString().trim()).length;
    setFormProgress((filledFields / fields.length) * 100);
  };

  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateAadhar = (aadhar) => {
    return /^[0-9]{12}$/.test(aadhar);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setIsLoading(true);

    if (!user.first_name?.trim() || !user.last_name?.trim() ||
        !user.email?.trim() || !user.username?.trim() ||
        !user.password?.trim() || !user.type?.toString().trim()) {
      setErrorMsg('All mandatory fields must be filled');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(user.email)) {
      setErrorMsg('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (user.contact_no && !validatePhone(user.contact_no)) {
      setErrorMsg('Contact number must be 10 digits');
      setIsLoading(false);
      return;
    }

    if (user.aadharcard_no && !validateAadhar(user.aadharcard_no)) {
      setErrorMsg('Aadhar number must be 12 digits');
      setIsLoading(false);
      return;
    }

    if (user.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    const roleId = Number(user.type);
    const endpoint = Number.isFinite(roleId)
      ? API.auth.registerWithRole(roleId)
      : API.auth.register;

    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      address: user.address,
      contact_no: user.contact_no,
      aadharcard_no: user.aadharcard_no,
      username: user.username,
      password: user.password
    };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const message = data?.message || 'Registration failed.';
          throw new Error(message);
        }
        return data;
      })
      .then((data) => {
        setIsLoading(false);
        if (data?.success === false) {
          setErrorMsg(data?.message || 'Registration failed.');
          return;
        }
        setSuccessMsg(data?.message || 'Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/Userlogin'), 2000);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMsg(error?.message || 'Registration failed. Username or email may already exist.');
      });
  };

  return (
    <div style={{
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '40px',
      paddingBottom: '40px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Create Your Account</h2>
                  <p className="text-muted">Join Digital Grampanchayat today</p>
                </div>

                <div className="mb-4">
                  <small className="text-muted">Registration Progress</small>
                  <ProgressBar
                    now={formProgress}
                    label={`${Math.round(formProgress)}%`}
                    variant="success"
                    style={{ height: '8px' }}
                  />
                </div>

                {successMsg && (
                  <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMsg}
                  </Alert>
                )}

                {errorMsg && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMsg}
                  </Alert>
                )}

                <Form onSubmit={handleRegister}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <h5 className="text-primary mb-3">
                        <i className="bi bi-person-badge me-2"></i>Personal Information
                      </h5>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          First Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={user.first_name}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="Enter first name"
                          required
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Last Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={user.last_name}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="Enter last name"
                          required
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={user.email}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="example@email.com"
                          required
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Contact Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="contact_no"
                          value={user.contact_no}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                        <Form.Text className="text-muted">
                          Enter 10-digit mobile number
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={user.address}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="Enter your complete address"
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Aadhar Card Number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="aadharcard_no"
                          value={user.aadharcard_no}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="12-digit Aadhar number"
                          maxLength="12"
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                        <Form.Text className="text-muted">
                          Enter 12-digit Aadhar number
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          User Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="type"
                          value={user.type}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          required
                          style={{ padding: '10px', borderRadius: '8px' }}
                        >
                          <option value="">Select user type...</option>
                          {userTypes.map((v, index) => (
                            <option key={index} value={v.type}>
                              {v.user_type}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3 mt-3">
                      <h5 className="text-primary mb-3">
                        <i className="bi bi-shield-lock me-2"></i>Account Credentials
                      </h5>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Username <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={user.username}
                          onChange={(e) => dispatch({
                            type: 'updateField',
                            field: e.target.name,
                            val: e.target.value
                          })}
                          placeholder="Choose a unique username"
                          required
                          style={{ padding: '10px', borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Password <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={user.password}
                            onChange={(e) => dispatch({
                              type: 'updateField',
                              field: e.target.name,
                              val: e.target.value
                            })}
                            placeholder="Create a strong password"
                            required
                            style={{ padding: '10px', borderRadius: '8px 0 0 8px' }}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ borderRadius: '0 8px 8px 0' }}
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </Button>
                        </InputGroup>
                        {user.password && (
                          <div className="mt-2">
                            <small className="text-muted">Password Strength:</small>
                            <ProgressBar
                              now={passwordStrength}
                              variant={getPasswordStrengthColor()}
                              style={{ height: '6px' }}
                            />
                          </div>
                        )}
                        <Form.Text className="text-muted">
                          Use 8+ characters with mix of letters, numbers
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id="terms"
                          label={
                            <>
                              I agree to the{' '}
                              <Link to="#" style={{ color: '#667eea' }}>
                                Terms and Conditions
                              </Link>
                            </>
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="w-100 fw-semibold mt-3"
                    size="lg"
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/Userlogin" className="fw-semibold text-decoration-none" style={{ color: '#667eea' }}>
                      Sign In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-3">
              <p className="text-white small">
                <i className="bi bi-shield-check-fill me-2"></i>
                Your information is secure and will be kept confidential
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
