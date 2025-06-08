import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function Investment  () {
  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';
  
  // بيانات العقارات
  const properties = [
    {
      id: 1,
      image: 'https://source.unsplash.com/random/800x600?property1',
      title: 'عقار تجاري مميز',
      owner: 'محمد أحمد',
      propertyNumber: '#1234',
      area: '500 م²',
      requiredAmount: '5,000,000 ريال',
      minContribution: '50,000 ريال'
    },
    {
      id: 2,
      image: 'https://source.unsplash.com/random/800x600?property2',
      title: 'مجمع سكني فاخر',
      owner: 'شركة التعمير',
      propertyNumber: '#5678',
      area: '1200 م²',
      requiredAmount: '12,000,000 ريال',
      minContribution: '100,000 ريال'
    },
    {
      id: 3,
      image: 'https://source.unsplash.com/random/800x600?property3',
      title: 'أرض استثمارية',
      owner: 'علي عبدالله',
      // propertyNumber: '#9012',
      // area: '3000 م²',
      requiredAmount: '8,000,000 ريال',
      minContribution: '80,000 ريال'
    }
  ];

  return (
    <Container fluid className="py-5" style={{ 
      backgroundColor: primaryDark, 
      minHeight: '100vh' 
    }}>
      <Container>
        <h1 className="text-center mb-5" style={{ color: accent }}>
          العقارات المتاحة للاستثمار
        </h1>
        
        <Row xs={1} md={2} lg={3} className="g-4">
          {properties.map((property) => (
            <Col key={property.id}>
              <Card style={{ 
                backgroundColor: darkGray,
                color: lightText,
                border: `1px solid ${accent}`,
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <Card.Img
                  variant="top"
                  src={property.image}
                  style={{
                    height: '250px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }}
                />
                <Card.Body className="text-end">
                  <Card.Title style={{ color: accent }}>
                    {property.title}
                  </Card.Title>
                  <Card.Text>
                    <div>
                      <p>👤 المالك: {property.owner}</p>
                      {/* <p>🔢 رقم العقار: {property.propertyNumber}</p> */}
                      {/* <p>📐 المساحة: {property.area}</p> */}
                      <p>💰 المبلغ المطلوب: {property.requiredAmount}</p>
                      <p>📉 أقل مساهمة: {property.minContribution}</p>
                    </div>
                  </Card.Text>
                  <Button as={NavLink} to={"/card"}
                    style={{
                      backgroundColor: accent,
                      borderColor: accent,
                      color: primaryDark,
                      fontWeight: 'bold',
                      width: '100%'
                    }}
                  >
                    المزيد من التفاصيل
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

