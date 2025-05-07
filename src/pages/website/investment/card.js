import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Button, 
  ProgressBar, 
  Row, 
  Col, 
  Form 
} from 'react-bootstrap';

const PropertyDetails = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { user: 'مستثمر 1', text: 'فرصة استثمارية ممتازة، أنصح بالدخول فيها' },
    { user: 'مستثمر 2', text: 'الموقع استراتيجي والتوقع أرباح عالية' }
  ]);

  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';

  const property = {
    id: 1,
    image: 'https://source.unsplash.com/random/800x600?property1',
    title: 'عقار تجاري مميز',
    owner: 'محمد أحمد',
    propertyNumber: '#1234',
    area: '500 م²',
    requiredAmount: '5,000,000 ريال',
    minContribution: '50,000 ريال',
    currentInvestment: '2,500,000 ريال',
    description: 'عقار تجاري بموقع مميز في قلب المدينة، مناسب للمشاريع التجارية الكبرى'
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        user: 'مستخدم جديد',
        text: commentText
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  return (
    <Container fluid className="py-5" style={{ 
      backgroundColor: primaryDark, 
      minHeight: '100vh' 
    }}>
      <Container>
        <Card style={{ 
          backgroundColor: darkGray,
          color: lightText,
          border: `1px solid ${accent}`,
          borderRadius: '15px'
        }}>
          <Card.Img
            variant="top"
            src={property.image}
            style={{
              height: '400px',
              objectFit: 'cover',
              borderTopLeftRadius: '15px',
              borderTopRightRadius: '15px'
            }}
          />
          
          <Card.Body className="text-end">
            <Card.Title style={{ color: accent, fontSize: '2rem' }}>
              {property.title}
            </Card.Title>

            <div className="mb-4">
              <h5 style={{ color: accent }}>وصف العقار:</h5>
              <p>{property.description}</p>
            </div>

            <Row className="mb-4">
              <Col md={6}>
                <p>👤 المالك: {property.owner}</p>
                <p>🔢 رقم العقار: {property.propertyNumber}</p>
                <p>📐 المساحة: {property.area}</p>
              </Col>
              <Col md={6}>
                <p>💰 المبلغ المطلوب: {property.requiredAmount}</p>
                <p>📉 أقل مساهمة: {property.minContribution}</p>
                <p>💹 الاستثمار الحالي: {property.currentInvestment}</p>
              </Col>
            </Row>

            <div className="mb-4">
              <h5 style={{ color: accent }}>مستوى الإنجاز:</h5>
              <ProgressBar 
                now={50} 
                label={50}
                style={{ height: '30px' }}
                variant="warning"
              />
            </div>

            <div className="mb-4">
              <h5 style={{ color: accent }}>التعليقات:</h5>
              
              {/* نموذج إضافة تعليق جديد */}
              <Card className="mb-4" style={{ 
                backgroundColor: primaryDark,
                border: `1px solid ${accent}`
              }}>
                <Card.Body>
                  <Form onSubmit={handleCommentSubmit}>
                    <Form.Group controlId="commentForm">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        style={{
                          backgroundColor: darkGray,
                          color: lightText,
                          border: `1px solid ${accent}`,
                          marginBottom: '1rem'
                        }}
                        placeholder="أكتب تعليقك هنا..."
                      />
                      <Button
                        type="submit"
                        style={{
                          backgroundColor: accent,
                          borderColor: accent,
                          color: primaryDark,
                          fontWeight: 'bold'
                        }}
                        disabled={!commentText.trim()}
                      >
                        نشر التعليق
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>

              {/* عرض التعليقات */}
              {comments.map((comment, index) => (
                <Card key={index} className="mb-3" style={{ 
                    color:"white",
                  backgroundColor: primaryDark,
                  border: `1px solid ${accent}`
                }}>
                  <Card.Body>
                    <Card.Title style={{ color: accent }}>{comment.user}</Card.Title>
                    <Card.Text>{comment.text}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>

            <Button
              style={{
                backgroundColor: accent,
                borderColor: accent,
                color: primaryDark,
                fontWeight: 'bold',
                width: '100%',
                fontSize: '1.2rem'
              }}
            >
              استثمر الآن
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default PropertyDetails;