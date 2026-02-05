import { Carousel, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
    // Sample schemes data
    const schemes = [
        {
            id: 1,
            title: "PM Awas Yojana",
            description: "Housing for all - providing financial assistance for construction of houses to eligible beneficiaries.",
            icon: "🏠"
        },
        {
            id: 2,
            title: "MGNREGA",
            description: "Mahatma Gandhi National Rural Employment Guarantee Act - ensuring livelihood security in rural areas.",
            icon: "💼"
        },
        {
            id: 3,
            title: "Swachh Bharat Mission",
            description: "Clean India Mission - improving sanitation and hygiene across rural India.",
            icon: "🧹"
        },
        {
            id: 4,
            title: "PM Kisan Samman Nidhi",
            description: "Financial assistance to farmers - ₹6000 per year in three equal installments.",
            icon: "🌾"
        }
    ];

    // Quick links data
    const quickLinks = [
        { title: "Apply for Certificate", path: "/VillagersHome/apply-certificate", icon: "📄" },
        { title: "Browse Schemes", path: "/VillagersHome/BrowseSchemes", icon: "📋" },
        { title: "Register Problem", path: "/VillagersHome/Register_problem", icon: "🔧" },
        { title: "View Problems", path: "/VillagersHome/Viewproblems", icon: "👁️" }
    ];

    return (
      <>
        {/* Hero Carousel Section */}
        <Carousel className="mb-5">
          <Carousel.Item>
            <div style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="text-center text-white">
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Welcome to Digital Grampanchayat</h1>
                <p style={{ fontSize: '1.3rem' }}>Empowering Rural India Through Digital Services</p>
                <Link to="/Register">
                  <Button variant="light" size="lg" className="mt-3">Get Started</Button>
                </Link>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="text-center text-white">
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Apply for Certificates Online</h1>
                <p style={{ fontSize: '1.3rem' }}>Birth, Ration Card, Property Tax & More</p>
                <Link to="/VillagersHome/apply-certificate">
                  <Button variant="light" size="lg" className="mt-3">Apply Now</Button>
                </Link>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="text-center text-white">
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Government Schemes</h1>
                <p style={{ fontSize: '1.3rem' }}>Explore Benefits & Apply for Government Programs</p>
                <Link to="/VillagersHome/BrowseSchemes">
                  <Button variant="light" size="lg" className="mt-3">View Schemes</Button>
                </Link>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        <Container>
          {/* Quick Access Links Section */}
          <section className="mb-5">
            <h2 className="text-center mb-4">Quick Access</h2>
            <Row>
              {quickLinks.map((link, index) => (
                <Col md={3} sm={6} key={index} className="mb-4">
                  <Link to={link.path} style={{ textDecoration: 'none' }}>
                    <Card 
                      className="text-center h-100 shadow-sm"
                      style={{ 
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Card.Body>
                        <div style={{ fontSize: '3rem' }}>{link.icon}</div>
                        <Card.Title className="mt-3">{link.title}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </section>

          {/* Government Schemes Section */}
          <section className="mb-5">
            <h2 className="text-center mb-4">Popular Government Schemes</h2>
            <Row>
              {schemes.map((scheme) => (
                <Col md={6} lg={3} key={scheme.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="text-center mb-3" style={{ fontSize: '3rem' }}>
                        {scheme.icon}
                      </div>
                      <Card.Title className="text-center">{scheme.title}</Card.Title>
                      <Card.Text style={{ fontSize: '0.9rem' }}>
                        {scheme.description}
                      </Card.Text>
                      <div className="text-center mt-3">
                        <Link to="/VillagersHome/BrowseSchemes">
                          <Button variant="primary" size="sm">Learn More</Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Services Section */}
          <section className="mb-5">
            <h2 className="text-center mb-4">Our Services</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <h4>🎯 For Citizens</h4>
                    <ul style={{ lineHeight: '2' }}>
                      <li>Apply for Certificates</li>
                      <li>Browse Government Schemes</li>
                      <li>Register Complaints</li>
                      <li>Track Application Status</li>
                    </ul>
                    <Link to="/Userlogin">
                      <Button variant="outline-primary">Login as Citizen</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <h4>👨‍💼 For Gram Sevak</h4>
                    <ul style={{ lineHeight: '2' }}>
                      <li>Manage Schemes</li>
                      <li>Approve Applications</li>
                      <li>Handle Complaints</li>
                      <li>Generate Reports</li>
                    </ul>
                    <Link to="/Userlogin">
                      <Button variant="outline-success">Login as Gram Sevak</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <h4>👔 For PDO</h4>
                    <ul style={{ lineHeight: '2' }}>
                      <li>Upload Schemes</li>
                      <li>Review Reports</li>
                      <li>Monitor Activities</li>
                      <li>Manage Resources</li>
                    </ul>
                    <Link to="/Userlogin">
                      <Button variant="outline-info">Login as PDO</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </section>

          {/* Call to Action Section */}
          <section className="text-center mb-5 p-5" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            color: 'white'
          }}>
            <h2>Join Digital Grampanchayat Today!</h2>
            <p style={{ fontSize: '1.2rem' }}>
              Experience seamless government services at your fingertips
            </p>
            <Link to="/Register">
              <Button variant="light" size="lg" className="m-2">Register Now</Button>
            </Link>
            <Link to="/Aboutus">
              <Button variant="outline-light" size="lg" className="m-2">Learn More</Button>
            </Link>
          </section>
        </Container>
      </>
    );
}
 
  