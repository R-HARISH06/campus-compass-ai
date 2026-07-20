import React from "react";
import { Container, Row, Col, Card, Accordion, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function Admissions() {
  return (
    <Container className="mt-5 pt-5 mb-5">
      <div className="text-center mb-5 animate-fade-in-up">
        <h1 className="display-4 fw-bold gradient-text">Admissions & Registration</h1>
        <p className="lead text-muted">Your guide to joining Campus Compass University</p>
      </div>

      <Row className="g-4">
        {/* Step-by-Step Registration Process */}
        <Col lg={8} className="animate-fade-in-up delay-1">
          <Card className="h-100 bg-dark text-white border-secondary shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fw-bold mb-4 gradient-text">📝 How Registration Works</h2>
              
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>1</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Create an Account</h4>
                  <p className="text-muted">Start by creating an account on our <Link to="/signup" className="text-primary text-decoration-none">Sign Up page</Link>. Select "Student" and fill in your basic details, department, and expected year of graduation.</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>2</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Submit Documents</h4>
                  <p className="text-muted">Once logged in, navigate to your Student Profile to upload your previous academic transcripts, standardized test scores, and ID proof.</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>3</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Pay Application Fee</h4>
                  <p className="text-muted">Pay the non-refundable processing fee of $50 via our secure payment gateway to confirm your application submission.</p>
                </div>
              </div>

              <div className="d-flex">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>4</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Receive Admission Offer</h4>
                  <p className="text-muted">The admissions committee will review your profile. You will be notified via email and your student dashboard within 2-3 weeks. Once accepted, you can pay your semester fees and pick your courses!</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Fee Structure Table */}
        <Col lg={4} className="animate-fade-in-up delay-2">
          <Card className="h-100 bg-dark text-white border-secondary shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fw-bold mb-4 text-center text-primary">💰 Fee Details</h2>
              <p className="text-muted text-center mb-4">Estimated tuition and fees per semester for the 2026-2027 academic year.</p>
              
              <Table variant="dark" bordered hover className="mb-4">
                <tbody>
                  <tr>
                    <td className="text-light">Tuition (Undergrad)</td>
                    <td className="text-end fw-bold text-success">$4,500</td>
                  </tr>
                  <tr>
                    <td className="text-light">Tuition (Postgrad)</td>
                    <td className="text-end fw-bold text-success">$5,800</td>
                  </tr>
                  <tr>
                    <td className="text-light">Hostel / Housing</td>
                    <td className="text-end fw-bold text-success">$1,200</td>
                  </tr>
                  <tr>
                    <td className="text-light">Library & Tech Fee</td>
                    <td className="text-end fw-bold text-success">$300</td>
                  </tr>
                  <tr>
                    <td className="text-light">Canteen Meal Plan</td>
                    <td className="text-end fw-bold text-success">$800</td>
                  </tr>
                </tbody>
              </Table>
              <div className="alert alert-info bg-primary bg-opacity-10 text-info border-info border-opacity-25" role="alert">
                <strong>Note:</strong> Financial aid and scholarships are available for eligible students. Check your profile dashboard after enrollment.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mt-5 animate-fade-in-up delay-3">
        <Col>
          <Card className="bg-dark text-white border-secondary shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fw-bold mb-4 gradient-text text-center">Frequently Asked Questions</h2>
              
              <Accordion flush className="custom-accordion">
                <Accordion.Item eventKey="0" className="bg-dark border-secondary">
                  <Accordion.Header className="text-light">When is the deadline to apply?</Accordion.Header>
                  <Accordion.Body className="text-muted">
                    For the Fall semester, all applications and documents must be submitted by August 15th. For the Spring semester, the deadline is December 15th.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="bg-dark border-secondary">
                  <Accordion.Header className="text-light">Do I need to pay the entire fee at once?</Accordion.Header>
                  <Accordion.Body className="text-muted">
                    No! We offer flexible payment plans. You can pay in 3 installments throughout the semester. The first installment is due before course registration.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="bg-dark border-secondary">
                  <Accordion.Header className="text-light">Can international students apply?</Accordion.Header>
                  <Accordion.Body className="text-muted">
                    Absolutely. International students follow the same registration process but must also provide valid passport copies and English proficiency test scores (IELTS/TOEFL).
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Admissions;
