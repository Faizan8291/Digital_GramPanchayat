import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import "./contact.css";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            
            setTimeout(() => setSubmitMessage(''), 5000);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: '📞',
            title: 'Phone',
            details: '020-345867',
            subtext: 'Mon-Fri, 9 AM - 5 PM'
        },
        {
            icon: '📧',
            title: 'Email',
            details: 'info@digitalgrampanchayat.in',
            subtext: 'We reply within 24 hours'
        },
        {
            icon: '📍',
            title: 'Office Address',
            details: 'Shop no. 22, Grampanchayat Building',
            subtext: 'Near Bhairavnath Mandir, Loni, Ahmednagar'
        },
        {
            icon: '⏰',
            title: 'Working Hours',
            details: 'Monday - Friday',
            subtext: '9:00 AM - 5:00 PM'
        }
    ];

    const departments = [
        {
            name: 'Certificate Services',
            icon: '📄',
            contact: 'certificates@dgp.in',
            phone: '020-345867 (Ext. 101)'
        },
        {
            name: 'Scheme Information',
            icon: '📋',
            contact: 'schemes@dgp.in',
            phone: '020-345867 (Ext. 102)'
        },
        {
            name: 'Technical Support',
            icon: '💻',
            contact: 'support@dgp.in',
            phone: '020-345867 (Ext. 103)'
        },
        {
            name: 'Complaint Cell',
            icon: '🔧',
            contact: 'complaints@dgp.in',
            phone: '020-345867 (Ext. 104)'
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '80px 0',
                textAlign: 'center'
            }}>
                <Container>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📞</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
                        Get In Touch
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </Container>
            </div>

            <Container className="my-5">
                {/* Contact Information Cards */}
                <Row className="mb-5">
                    {contactInfo.map((info, index) => (
                        <Col md={6} lg={3} key={index} className="mb-4">
                            <Card 
                                className="h-100 shadow-sm border-0 text-center"
                                style={{ 
                                    borderRadius: '15px',
                                    transition: 'transform 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Card.Body className="p-4">
                                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                                        {info.icon}
                                    </div>
                                    <h5 className="fw-bold mb-3">{info.title}</h5>
                                    <p className="mb-1 fw-semibold" style={{ color: '#667eea' }}>
                                        {info.details}
                                    </p>
                                    <p className="mb-0 small text-muted">
                                        {info.subtext}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Main Contact Section */}
                <Row className="mb-5">
                    {/* Contact Form */}
                    <Col lg={7} className="mb-4">
                        <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <h3 className="fw-bold mb-4">
                                    <i className="bi bi-envelope-fill me-2" style={{ color: '#667eea' }}></i>
                                    Send Us a Message
                                </h3>

                                {submitMessage && (
                                    <Alert variant="success" className="mb-4">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        {submitMessage}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">
                                                    Your Name <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter your name"
                                                    required
                                                    style={{ padding: '12px', borderRadius: '8px' }}
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
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="your.email@example.com"
                                                    required
                                                    style={{ padding: '12px', borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">Phone Number</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Enter phone number"
                                                    style={{ padding: '12px', borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">
                                                    Subject <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ padding: '12px', borderRadius: '8px' }}
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="certificate">Certificate Services</option>
                                                    <option value="schemes">Government Schemes</option>
                                                    <option value="complaint">Register Complaint</option>
                                                    <option value="support">Technical Support</option>
                                                    <option value="general">General Inquiry</option>
                                                    <option value="other">Other</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold">
                                                    Message <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Write your message here..."
                                                    required
                                                    style={{ padding: '12px', borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-100 fw-semibold"
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send-fill me-2"></i>
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Contact Information & Map */}
                    <Col lg={5} className="mb-4">
                        {/* Quick Contact Info */}
                        <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4">
                                    <i className="bi bi-info-circle-fill me-2" style={{ color: '#667eea' }}></i>
                                    Quick Contact
                                </h5>
                                <div className="mb-3">
                                    <div className="d-flex align-items-start mb-3">
                                        <div style={{ fontSize: '1.5rem', marginRight: '15px' }}>📞</div>
                                        <div>
                                            <strong>Emergency Helpline</strong>
                                            <p className="mb-0 text-muted">020-345867</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start mb-3">
                                        <div style={{ fontSize: '1.5rem', marginRight: '15px' }}>📧</div>
                                        <div>
                                            <strong>General Inquiries</strong>
                                            <p className="mb-0 text-muted">info@digitalgrampanchayat.in</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start">
                                        <div style={{ fontSize: '1.5rem', marginRight: '15px' }}>📍</div>
                                        <div>
                                            <strong>Visit Us</strong>
                                            <p className="mb-0 text-muted">
                                                Shop no. 22, Grampanchayat Building,<br />
                                                Near Bhairavnath Mandir,<br />
                                                Loni, Ahmednagar
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Map Placeholder */}
                        <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-0">
                                <div style={{
                                    height: '250px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <div className="text-center">
                                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗺️</div>
                                        <h5>Find Us on Map</h5>
                                        <p className="mb-0">Loahgoan, Ahmednagar</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Department Contact Section */}
                <section className="mb-5">
                    <h3 className="text-center fw-bold mb-4">Department-wise Contact</h3>
                    <Row>
                        {departments.map((dept, index) => (
                            <Col md={6} key={index} className="mb-4">
                                <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div style={{ 
                                                fontSize: '2.5rem', 
                                                marginRight: '20px',
                                                background: '#f8f9fa',
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {dept.icon}
                                            </div>
                                            <div>
                                                <h5 className="mb-1 fw-bold">{dept.name}</h5>
                                                <p className="mb-0 text-muted small">{dept.phone}</p>
                                            </div>
                                        </div>
                                        <p className="mb-0">
                                            <i className="bi bi-envelope me-2" style={{ color: '#667eea' }}></i>
                                            {dept.contact}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* FAQ / Help Section */}
                <section>
                    <Card 
                        className="shadow-sm border-0"
                        style={{ 
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white'
                        }}
                    >
                        <Card.Body className="p-5 text-center">
                            <h3 className="fw-bold mb-3">Need Immediate Assistance?</h3>
                            <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>
                                Our support team is available during office hours to help you with any queries.
                            </p>
                            <Row className="justify-content-center">
                                <Col md={4} className="mb-3">
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
                                    <h6>Live Chat</h6>
                                    <p className="small mb-0" style={{ opacity: 0.9 }}>Chat with our support team</p>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📖</div>
                                    <h6>User Guide</h6>
                                    <p className="small mb-0" style={{ opacity: 0.9 }}>Browse our help documentation</p>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❓</div>
                                    <h6>FAQs</h6>
                                    <p className="small mb-0" style={{ opacity: 0.9 }}>Find quick answers</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </section>
            </Container>
        </>
    );
}