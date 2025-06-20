import React from 'react';
import { Container, Card, ProgressBar, Row, Col ,Button} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Investmentrecord = () => {
  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';

  // بيانات وهمية للاستثمارات
  const investments = [
    {
      id: 1,
      property: 'مصنع عدد صناعية ',
      amount: '500,000 ريال',
      date: '15 مارس 2024',
      duration: '12 شهر',
      progress: 60,
      profit: '+18%'
    },
    {
      id: 2,
      property:  'مصنع اجهزة منزلية',
      amount: '750,000 ريال',
      date: '1 فبراير 2024',
      duration: '24 شهر',
      progress: 30,
      profit: '+12%'
    },
    {
      id: 3,
      property: ' شركة ماستر للغذئيات',
      amount: '1,200,000 ريال',
      date: '10 يناير 2024',
      duration: '36 شهر',
      progress: 45,
      profit: '+25%'
    }
  ];

  return (
    <Container fluid className="py-5" style={{ 
      backgroundColor: primaryDark, 
      minHeight: '100vh' 
    }}>
      <Container>
        <h1 className="text-center mb-5" style={{ color: accent }}>
          سجل الاستثمارات
        </h1>

        <Row xs={1} md={2} lg={3} className="g-4">
          {investments.map((investment) => (
            <Col key={investment.id}>
              <Card style={{ 
                backgroundColor: darkGray,
                color: lightText,
                border: `1px solid ${accent}`,
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                ':hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 0 15px ${accent}`
                }
              }}>
                <Card.Body className="text-end">
                  <Card.Title style={{ color: accent }}>
                    {investment.property}
                  </Card.Title>
                  
                  <div className="mb-3">
                    <Row>
                      <Col md={6}>
                        <p>📅 تاريخ الاستثمار: {investment.date}</p>
                        <p>⏳ المدة المتبقية:</p>
                      </Col>
                      <Col md={6}>
                        <p>💰 المبلغ المستثمر: {investment.amount}</p>
                        <p>📈 نسبة الأرباح: 
                          <span style={{ color: accent }}>
                            {investment.profit}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-3">
                    <h6 style={{ color: accent }}>مستوى الإنجاز:</h6>
                    <ProgressBar 
                      now={investment.progress}
                      label={`${investment.progress}%`}
                      // variant="#7CB2422"
                      style={{ height: '20px' }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span>المدة الكلية: {investment.duration}</span>
                    <Button 
                      variant="outline-warning"
                      style={{
                        borderColor: accent,
                        color: accent,
                        fontWeight: 'bold'
                      }}
                    >
                      التفاصيل الكاملة
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default Investmentrecord;