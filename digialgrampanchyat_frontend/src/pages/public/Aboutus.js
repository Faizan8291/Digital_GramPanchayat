import { Container, Row, Col, Card } from 'react-bootstrap';
import "./style.css";

export default function Aboutus() {
    const teamMembers = [
        {
            name: "Sarpanch Office",
            role: "Village Head",
            icon: "👨‍💼",
            description: "Leading our community towards digital transformation"
        },
        {
            name: "Gram Sevak",
            role: "Village Secretary",
            icon: "📋",
            description: "Managing day-to-day administrative operations"
        },
        {
            name: "PDO Office",
            role: "Development Officer",
            icon: "🏛️",
            description: "Overseeing rural development initiatives"
        }
    ];

    const achievements = [
        { icon: "📱", title: "Digital Services", count: "10+", description: "Online Services Available" },
        { icon: "👥", title: "Citizens Registered", count: "500+", description: "Active Users" },
        { icon: "📄", title: "Applications Processed", count: "1000+", description: "Certificates Issued" },
        { icon: "🎯", title: "Schemes", count: "20+", description: "Government Programs" }
    ];

    const values = [
        {
            icon: "🎯",
            title: "Transparency",
            description: "We believe in open and transparent governance for all citizens"
        },
        {
            icon: "⚡",
            title: "Efficiency",
            description: "Streamlined processes to serve citizens quickly and effectively"
        },
        {
            icon: "🤝",
            title: "Accessibility",
            description: "Making government services accessible to everyone, everywhere"
        },
        {
            icon: "🔒",
            title: "Security",
            description: "Protecting citizen data with advanced security measures"
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
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏛️</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
                        About Digital Grampanchayat
                    </h1>
                    <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>
                        Empowering rural India through digital governance and bringing government services to your fingertips
                    </p>
                </Container>
            </div>

            <Container className="my-5">
                {/* Vision and Mission Section */}
                <Row className="mb-5">
                    <Col md={6} className="mb-4">
                        <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <div className="text-center mb-3">
                                    <div style={{ 
                                        fontSize: '3.5rem',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        🎯
                                    </div>
                                </div>
                                <h3 className="text-center mb-3 fw-bold" style={{ color: '#667eea' }}>
                                    Our Vision
                                </h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'center' }}>
                                    To be a center of excellence for training and research in the field of 
                                    Rural Development, creating a model digital village that inspires others 
                                    across the nation.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} className="mb-4">
                        <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <div className="text-center mb-3">
                                    <div style={{ 
                                        fontSize: '3.5rem',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        🚀
                                    </div>
                                </div>
                                <h3 className="text-center mb-3 fw-bold" style={{ color: '#f5576c' }}>
                                    Our Mission
                                </h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'center' }}>
                                    To initiate, facilitate, coordinate, catalyze and implement an integrated 
                                    rural development programme that brings transparency, efficiency, and 
                                    accessibility to government services.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* About Section */}
                <section className="mb-5">
                    <h2 className="text-center mb-4 fw-bold">Welcome to Loahgoan Grampanchayat</h2>
                    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify' }}>
                                Digital Grampanchayat is a revolutionary initiative aimed at transforming rural 
                                governance through technology. Our platform brings together citizens, government 
                                officials, and service providers on a single digital platform, making it easier 
                                than ever to access government services, apply for certificates, browse schemes, 
                                and register complaints.
                            </p>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify' }}>
                                We believe that every citizen deserves quick, transparent, and efficient access 
                                to government services. Through our digital platform, we're eliminating paperwork, 
                                reducing processing times, and ensuring that no one is left behind in the digital age.
                            </p>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify' }}>
                                Our commitment extends beyond just digitization – we're building a community where 
                                citizens are empowered, informed, and actively participating in the development of 
                                their village. Together, we're creating a model for digital governance that can be 
                                replicated across rural India.
                            </p>
                        </Card.Body>
                    </Card>
                </section>

                {/* Core Values Section */}
                <section className="mb-5">
                    <h2 className="text-center mb-4 fw-bold">Our Core Values</h2>
                    <Row>
                        {values.map((value, index) => (
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
                                            {value.icon}
                                        </div>
                                        <h5 className="fw-bold mb-3">{value.title}</h5>
                                        <p style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                                            {value.description}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Achievements Section */}
                <section className="mb-5">
                    <h2 className="text-center mb-4 fw-bold">Our Achievements</h2>
                    <Row>
                        {achievements.map((achievement, index) => (
                            <Col md={6} lg={3} key={index} className="mb-4">
                                <Card 
                                    className="text-center shadow-sm border-0"
                                    style={{ 
                                        borderRadius: '15px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                                            {achievement.icon}
                                        </div>
                                        <h2 className="fw-bold mb-2">{achievement.count}</h2>
                                        <h5 className="mb-2">{achievement.title}</h5>
                                        <p className="mb-0" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                            {achievement.description}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Team Section */}
                <section className="mb-5">
                    <h2 className="text-center mb-4 fw-bold">Our Leadership</h2>
                    <Row>
                        {teamMembers.map((member, index) => (
                            <Col md={4} key={index} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 text-center" style={{ borderRadius: '15px' }}>
                                    <Card.Body className="p-4">
                                        <div style={{ 
                                            fontSize: '4rem', 
                                            marginBottom: '20px',
                                            background: '#f8f9fa',
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 20px'
                                        }}>
                                            {member.icon}
                                        </div>
                                        <h4 className="fw-bold mb-2">{member.name}</h4>
                                        <p className="text-primary fw-semibold mb-3">{member.role}</p>
                                        <p style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                                            {member.description}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Services Overview */}
                <section className="mb-5">
                    <Card 
                        className="shadow-sm border-0"
                        style={{ 
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white'
                        }}
                    >
                        <Card.Body className="p-5 text-center">
                            <h2 className="fw-bold mb-3">What We Offer</h2>
                            <Row className="mt-4">
                                <Col md={3} className="mb-3">
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📄</div>
                                    <h5>Certificate Services</h5>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                        Birth, Death, Property Tax, Ration Card
                                    </p>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📋</div>
                                    <h5>Government Schemes</h5>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                        Browse and apply for benefits
                                    </p>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔧</div>
                                    <h5>Complaint System</h5>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                        Register and track issues
                                    </p>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
                                    <h5>Transparency</h5>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                        Real-time application tracking
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </section>

                {/* Contact CTA */}
                <section className="text-center">
                    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-5">
                            <h3 className="fw-bold mb-3">Have Questions?</h3>
                            <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '30px' }}>
                                We're here to help! Reach out to us for any inquiries or support.
                            </p>
                            <a 
                                href="/Contact" 
                                className="btn btn-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 40px',
                                    borderRadius: '8px',
                                    textDecoration: 'none'
                                }}
                            >
                                <i className="bi bi-envelope-fill me-2"></i>
                                Contact Us
                            </a>
                        </Card.Body>
                    </Card>
                </section>
            </Container>
        </>
    );
}