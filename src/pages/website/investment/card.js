import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Row,
  Col,
  Form,
  Modal,
  Carousel
} from 'react-bootstrap';
import Alertsucces from '../../../components/website/Alertsucces';

const FactoryDetails = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { user: 'مستثمر 1', text: 'فرصة استثمارية ممتازة، أنصح بالدخول فيها' },
    { user: 'مستثمر 2', text: 'الموقع استراتيجي والتوقع أرباح عالية' }
  ]);

  // حالة للتحكم بعرض الواجهة المنبثقة
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // الألوان المخصصة
  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';

  // بيانات المصنع المعدلة
  const factory = {
    id: 1,
    images: [
      'https://source.unsplash.com/random/800x600?factory1',
      'https://source.unsplash.com/random/800x600?factory2',
      'https://source.unsplash.com/random/800x600?factory3'
    ],
    title: 'مصنع مواد بناء متكامل',
    owner: 'شركة الصناعات الحديثة',
    type: 'صناعي',
    location: 'الرياض، الصناعية الثانية',
    productionCapacity: '10,000 طن شهرياً',
    requiredAmount: '5,000,000 ريال',
    minContribution: '50,000 ريال',
    currentInvestment: '2,500,000 ريال',
    description: 'مصنع متكامل لإنتاج مواد البناء بمواصفات عالمية، يحتوي على أحدث خطوط الإنتاج والتعبئة، مع وجود شهادات جودة عالمية. المصنع قائم ويعمل بكامل طاقته الإنتاجية ويحتاج إلى توسعة لزيادة الطاقة الإنتاجية لتلبية الطلب المتزايد.'
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

  const handleInvestSubmit = () => {
    if (investmentAmount) {
      console.log(`استثمار مبلغ: ${investmentAmount} ريال`);
      setShowInvestModal(false);
      setInvestmentAmount('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  };

  return (
    <Container fluid className="py-5" style={{
      backgroundColor: primaryDark,
      minHeight: '100vh'
    }}>
      <Card style={{
        backgroundColor: darkGray,
        color: lightText,
        border: `1px solid ${accent}`,
        borderRadius: '15px'
      }}>
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
              {/* عرض صور المصنع باستخدام Carousel */}
              <Carousel>
                {factory.images.map((img, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={img}
                      alt={`صورة المصنع ${index + 1}`}
                      style={{
                        height: '400px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px'
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>

              <Card.Body className="text-end">
                <Card.Title style={{ color: accent, fontSize: '2rem' }}>
                  {factory.title}
                </Card.Title>

                <div className="mb-4">
                  <h5 style={{ color: accent }}>وصف المصنع:</h5>
                  <p>{factory.description}</p>
                </div>

                <Row className="mb-4">
                  <Col md={6}>
                    <p>👤 المالك: {factory.owner}</p>
                    <p>🏭 نوع المصنع: {factory.type}</p>
                    <p>📍 الموقع: {factory.location}</p>
                  </Col>
                  <Col md={6}>
                    <p>🏗️ الطاقة الإنتاجية: {factory.productionCapacity}</p>
                    <p>💰 المبلغ المطلوب: {factory.requiredAmount}</p>
                    <p>📉 أقل مساهمة: {factory.minContribution}</p>
                    <p>💹 الاستثمار الحالي: {factory.currentInvestment}</p>
                  </Col>
                </Row>

                <div className="mb-4">
                  <h5 style={{ color: accent }}>مستوى الإنجاز:</h5>
                  <ProgressBar
                    now={50}
                    label={'50%'}
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
                      color: "white",
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
                  onClick={() => setShowInvestModal(true)}
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
      </Card>

      {/* واجهة الاستثمار المنبثقة */}
      <Modal
        show={showInvestModal}
        onHide={() => setShowInvestModal(false)}
        centered
        dir="rtl"
        contentClassName="bg-dark text-light"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="w-100 text-center" style={{ color: accent }}>
            استثمار في المصنع
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center mb-4">
            <h5>{factory.title}</h5>
            <p className="text-muted">أقل مساهمة: {factory.minContribution}</p>
          </div>

          <Form>
            <Form.Group controlId="investmentAmount">
              <Form.Label style={{ color: accent }}>المبلغ المراد استثماره (ريال)</Form.Label>
              <Form.Control
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min={50000}
                placeholder="أدخل المبلغ"
                className="bg-secondary border-secondary text-light"
              />
              <Form.Text className="text-warning">
                يجب أن لا يقل المبلغ عن {factory.minContribution}
              </Form.Text>
            </Form.Group>
          </Form>

          <div className="mt-4 text-center">
            <Button
              variant="warning"
              className="w-100 fw-bold"
              onClick={handleInvestSubmit}
              disabled={!investmentAmount || investmentAmount < 50000}
            >
              تأكيد الاستثمار
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Alertsucces showSuccessToast={showSuccessToast} investmentAmount={investmentAmount}/>
    </Container>
  );
};

export default FactoryDetails;