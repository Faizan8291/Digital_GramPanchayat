import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../store/slice';
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { API } from '../../config/api';
import './style.css';

function Userlogin() {
  const init = {
    username: '',
    password: ''
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'logincheck':
        return { ...state, [action.field]: action.val };
      default:
        return state;
    }
  };

  const [user, dispatch] = useReducer(reducer, init);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const reduxAction = useDispatch();
  const navigate = useNavigate();

  const logincheck = (e) => {
    e.preventDefault();
    setMsg('');
    setIsLoading(true);

    const payload = {
      username: user.username.trim(),
      password: user.password
    };

    fetch(API.auth.login, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const message = data?.message || 'Invalid username or password.';
          throw new Error(message);
        }
        return data;
      })
      .then((data) => {
        setIsLoading(false);
        if (!data?.success) {
          setMsg(data?.message || 'Invalid username or password. Please try again.');
          return;
        }

        const responseUser = data?.userData ?? data?.user ?? {};
        const userTypeObj = responseUser?.userType ?? responseUser?.ut ?? {};

        const roleStr = String(
          userTypeObj?.user_type ??
          userTypeObj?.userType ??
          responseUser?.role ??
          responseUser?.userType ??
          ''
        ).toLowerCase();

        const rawType = userTypeObj?.type ?? responseUser?.type ?? responseUser?.userTypeId;
        const resolvedType =
          Number.isFinite(Number(rawType)) ? Number(rawType)
          : ['admin', 'administrator'].includes(roleStr) ? 1
          : ['pdo'].includes(roleStr) ? 4
          : ['gramsevak', 'gram sevak', 'sevak'].includes(roleStr) ? 2
          : ['citizen', 'villager', 'villagers', 'user'].includes(roleStr) ? 3
          : NaN;

        const normalizedUser = {
          user_id: responseUser?.userId ?? responseUser?.user_id,
          username: responseUser?.username ?? payload.username,
          first_name: responseUser?.firstName ?? responseUser?.first_name ?? '',
          last_name: responseUser?.lastName ?? responseUser?.last_name ?? '',
          email: responseUser?.email ?? '',
          address: responseUser?.address ?? '',
          contact_no: responseUser?.contactNo ?? responseUser?.contact_no ?? '',
          aadharcard_no: responseUser?.aadharcardNo ?? responseUser?.aadharcard_no ?? '',
          ut: (userTypeObj?.type || userTypeObj?.user_type) ? {
            type: userTypeObj?.type ?? resolvedType,
            user_type: userTypeObj?.user_type ?? roleStr
          } : undefined
        };

        reduxAction(login());

        localStorage.removeItem('loggeduser');
        localStorage.removeItem('loggedgram');
        localStorage.removeItem('loggedpdo');
        localStorage.removeItem('loggedadmin');

        if (resolvedType === 3) {
          localStorage.setItem('loggeduser', JSON.stringify(normalizedUser));
          navigate('/citizen/dashboard');
        } else if (resolvedType === 2) {
          localStorage.setItem('loggedgram', JSON.stringify(normalizedUser));
          navigate('/gramsevak/dashboard');
        } else if (resolvedType === 4) {
          // PDO role merged into Admin panel
          localStorage.setItem('loggedadmin', JSON.stringify(normalizedUser));
          navigate('/admin/dashboard');
        } else if (resolvedType === 1) {
          localStorage.setItem('loggedadmin', JSON.stringify(normalizedUser));
          navigate('/admin/dashboard');
        } else {
          setMsg('Unknown user type from server. Please contact support.');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setMsg(error?.message || 'Connection error. Please try again later.');
      });
  };

  return (
    <div style={{
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '40px',
      paddingBottom: '40px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <h2 className="fw-bold mb-2">Welcome Back!</h2>
                  <p className="text-muted">Sign in to access your account</p>
                </div>

                {msg && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {msg}
                  </Alert>
                )}

                <Form onSubmit={logincheck}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-person-fill me-2"></i>Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={(e) => {
                        dispatch({
                          type: 'logincheck',
                          field: e.target.name,
                          val: e.target.value,
                        });
                      }}
                      placeholder="Enter your username"
                      required
                      style={{ padding: '12px', borderRadius: '8px' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-lock-fill me-2"></i>Password
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={user.password}
                        onChange={(e) => {
                          dispatch({
                            type: 'logincheck',
                            field: e.target.name,
                            val: e.target.value,
                          });
                        }}
                        placeholder="Enter your password"
                        required
                        style={{ padding: '12px', borderRadius: '8px 0 0 8px' }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderRadius: '0 8px 8px 0' }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      id="rememberMe"
                    />
                    <Link to="#" className="text-decoration-none" style={{ color: '#667eea' }}>
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 fw-semibold"
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <div className="position-relative my-4">
                  <hr />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                    OR
                  </span>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/Register" className="fw-semibold text-decoration-none" style={{ color: '#667eea' }}>
                      Register Now
                    </Link>
                  </p>
                </div>

                <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h6 className="mb-2 fw-semibold">Select Your Role:</h6>
                  <div className="small text-muted">
                    <div><i className="bi bi-people-fill me-2"></i><strong>Citizen:</strong> Apply for certificates, browse schemes</div>
                    <div><i className="bi bi-briefcase-fill me-2"></i><strong>Gram Sevak:</strong> Manage schemes and approvals</div>
                    <div><i className="bi bi-person-badge-fill me-2"></i><strong>PDO:</strong> Uses the same Admin panel</div>
                    <div><i className="bi bi-shield-fill-check me-2"></i><strong>Admin:</strong> Manage users and oversee system</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-3">
              <p className="text-white small">
                <i className="bi bi-shield-lock-fill me-2"></i>
                Your data is secure and encrypted
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Userlogin;
