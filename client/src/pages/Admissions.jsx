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
          <Card className="h-100 glass-card text-white border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fw-bold mb-4 gradient-text">📝 How Registration Works</h2>
              
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>1</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Visit the Official College Website</h4>
                  <p className="text-muted">All admission registrations begin on our <strong>official college website</strong>. Create your applicant account there to fill in your basic details, department, and expected year of graduation. (This AI app is only for viewing information!)</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>2</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Submit Documents</h4>
                  <p className="text-muted">On the official college website portal, upload your previous academic transcripts, standardized test scores, and ID proof for verification.</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>3</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Pay Application Fee</h4>
                  <p className="text-muted">Pay the non-refundable processing fee of $50 via the secure payment gateway on the <strong>official college website</strong> to confirm your application submission.</p>
                </div>
              </div>

              <div className="d-flex">
                <div className="me-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>4</div>
                </div>
                <div>
                  <h4 className="fw-bold text-light">Receive Admission Offer</h4>
                  <p className="text-muted">The admissions committee will review your profile. You will be notified via email within 2-3 weeks. Once accepted, you can pay your semester fees on the official college website and pick your courses!</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Fee Structure Table */}
        <Col lg={4} className="animate-fade-in-up delay-2">
          <Card className="h-100 glass-card text-white border-0 shadow-lg">
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mt-5 animate-fade-in-up delay-3">
        <Col>
          <Card className="glass-card text-white border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fw-bold mb-4 gradient-text text-center">Frequently Asked Questions</h2>
              
              <Accordion flush className="custom-accordion">
                <Accordion.Item eventKey="0" className="bg-transparent border-secondary text-white">
                  <Accordion.Header>When is the deadline to apply?</Accordion.Header>
                  <Accordion.Body className="text-muted">
                    For the Fall semester, all applications and documents must be submitted by August 15th. For the Spring semester, the deadline is December 15th.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="bg-transparent border-secondary text-white">
                  <Accordion.Header>Do I need to pay the entire fee at once?</Accordion.Header>
                  <Accordion.Body className="text-muted">
                    No! We offer flexible payment plans. You can pay in 3 installments on the official college website. The first installment is due before course registration.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="bg-transparent border-secondary text-white">
                  <Accordion.Header>Can international students apply?</Accordion.Header>
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
