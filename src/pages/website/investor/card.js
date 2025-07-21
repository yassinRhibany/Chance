import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  ProgressBar,
  Row,
  Col,
  Form,
  Modal,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import Message from '../../../components/Message.js/Message';

const InvestmentDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = 'http://127.0.0.1:8000/api';
  const { state } = useLocation();
  const { itemData } = state;
  console.log(user.token)
  // الألوان المخصصة
  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';

  // حالات المكون
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.token) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.get(
          `${API_URL}/InvestmentOpprtunities/getFactoryOpportunities/${id}`,
          config
        );
        console.log(response)
        if (!response.data) {
          throw new Error('تنسيق البيانات غير صحيح');
        }

        const apiData = response.data;

        const formattedOpportunity = {
          id: apiData.opportunities, id,
          name: apiData.factory || 'غير معروف',
          // category: apiData.category_name || 'غير محدد',
          // address: apiData.factory_address || 'غير محدد',
          description: apiData.opportunities.descrption || 'لا يوجد وصف متاح',
          image: apiData.image_url || `https://source.unsplash.com/random/800x600?factory=${apiData.opportunity_id}`,
          // feasibility_pdf: apiData.factory_feasibility_pdf ?
          // `${API_URL}/storage/${apiData.factory_feasibility_pdf}` : null,
          target_amount: apiData.opportunity_target_amount,
          minimum_target: apiData.opportunity_minimum_target,
          collected_amount: apiData.opportunity_collected_amount,
          start_date: apiData.opportunity_strtup,
          payout_frequency: apiData.opportunity_payout_frequency,
          profit_percentage: apiData.opportunity_profit_percentage,
          progress: calculateProgress(apiData.opportunity_collected_amount, apiData.opportunity_target_amount)
        };

        setOpportunity(formattedOpportunity);
        setLoading(false);

      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب البيانات';
        setError(errorMsg);
        setMessage('حدث خطأ أثناء جلب البيانات');
        setMessageColor('#DC3545');
        setShowMessage(true);
        setLoading(false);
      }
    };

    fetchOpportunityDetails();
  }, [id, user]);

  // دوال مساعدة
  const translateFrequency = (freq) => {
    const frequencies = {
      'quarterly': 'ربع سنوي',
      'monthly': 'شهري',
      'annually': 'سنوي',
      'biannually': 'نصف سنوي'
    };
    return frequencies[freq] || freq;
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  const calculateProgress = (collected, target) => {
    if (!collected || !target) return 0;
    const collectedNum = parseFloat(collected);
    const targetNum = parseFloat(target);
    return Math.min(Math.round((collectedNum / targetNum) * 100), 100);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        user: user?.name || 'مستثمر جديد',
        text: commentText
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const handleInvestSubmit = async () => {
    try {
      if (!investmentAmount || parseFloat(investmentAmount) < 200) {
        setMessage('المبلغ يجب أن لا يقل عن 200 ريال');
        setMessageColor('#DC3545');
        setShowMessage(true);
        return;
      }

      // إنشاء FormData وإضافة الحقول
      const formData = new FormData();
      formData.append('opprtunty_id', itemData.id); // التأكد من أن الاسم مطابق لما يتوقعه الخادم
      formData.append('amount', investmentAmount); // القيمة كـ string أو number

      // لا تحدد Content-Type يدويًا عند استخدام FormData (يضبطه axios تلقائيًا)
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          // 'Content-Type': 'multipart/form-data' // ⚠️ لا تضف هذا السطر! axios يضبطه تلقائيًا
        }
      };

      console.log("FormData Contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value); // تأكد من أن البيانات مضاف بشكل صحيح
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/InvestmentOpprtunities/confirmPurchase`,
        formData,
        config
      );

      console.log("Response:", response.data);
      setShowInvestModal(false);
      setInvestmentAmount('');
      setMessage('تمت عملية الاستثمار بنجاح');
      setMessageColor('#28A745');
      setShowMessage(true);
       setTimeout(() => { setShowMessage(false); navigate(0) }, 5000);

    } catch (err) {
      console.error("Full Error:", err);
      const errorDetails = err.response?.data?.message;
      
      if (errorDetails == "Insufficient wallet balance")
        setMessage("..رصيدك غير كافي");
      else
        setMessage(errorDetails);

      setMessageColor('#DC3545');
      setShowMessage(true);
      setTimeout(() => { setShowMessage(false); navigate(0) }, 5000);

    }
  };

  if (loading) {
    return (
      <Container fluid className="py-5 d-flex justify-content-center align-items-center" style={{
        backgroundColor: primaryDark,
        minHeight: '100vh'
      }}>
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5" style={{
        backgroundColor: primaryDark,
        minHeight: '100vh'
      }}>
        <Container>
          <Alert variant="danger">
            خطأ: {error}
          </Alert>
          <Button
            variant="primary"
            onClick={() => navigate('/investor/investment')}
            className="mt-3"
          >
            العودة إلى قائمة الفرص
          </Button>
        </Container>
      </Container>
    );
  }

  if (!opportunity) {
    return (
      <Container fluid className="py-5" style={{
        backgroundColor: primaryDark,
        minHeight: '100vh'
      }}>
        <Container>
          <Alert variant="info">
            لا توجد بيانات متاحة لهذه الفرصة الاستثمارية
          </Alert>
        </Container>
      </Container>
    );
  }

  return (
    <>
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
              src={opportunity.image}
              style={{
                height: '400px',
                objectFit: 'cover',
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px'
              }}
              alt={`صورة مصنع ${opportunity.name}`}
            />

            <Card.Body className="text-end">
              <Card.Title style={{ color: accent, fontSize: '2rem' }}>
                {opportunity.name}
                <Badge bg="warning" text="dark" className="me-2">
                  {opportunity.category}
                </Badge>
              </Card.Title>

              <div className="mb-4">
                <h5 style={{ color: accent }}>الوصف:</h5>
                <p>{itemData.description}</p>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <p>📍 <strong>العنوان:</strong> {itemData.address}</p>
                  <p>📅 <strong>تاريخ البدء:</strong> {itemData.opportunity_strtup}</p>
                  <p>🔄 <strong>تكرار الدفع:</strong> {translateFrequency(itemData.opportunity_payout_frequency)}</p>
                  <p>📈 <strong>نسبة الربح:</strong> {itemData.opportunity_profit_percentage}%</p>
                </Col>
                <Col md={6}>
                  <p>💰 <strong>المبلغ المستهدف:</strong> {formatCurrency(itemData.target_amount)}</p>
                  <p>📉 <strong>الحد الأدنى للمساهمة:</strong> {formatCurrency(itemData.minimum_target)}</p>
                  <p>💹 <strong>المبلغ المجموع:</strong> {formatCurrency(itemData.collected_amount)}</p>
                  {itemData.factory_feasibility_pdf && (
                    <p>
                      📄 <strong>دراسة الجدوى:</strong>{' '}
                      <a
                        href={itemData.factory_feasibility_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: accent }}
                      >
                        عرض الملف
                      </a>
                    </p>
                  )}
                </Col>
              </Row>

              <div className="mb-4">
                <h5 style={{ color: accent }}>مستوى الإنجاز:</h5>
                <ProgressBar
                  now={(itemData.collected_amount/itemData.target_amount)*100}
                  label={`${(itemData.collected_amount/itemData.target_amount)*100}%`}
                  style={{ height: '30px' }}
                  variant="warning"
                />
              </div>

              <div className="mb-4">
                <h5 style={{ color: accent }}>التعليقات:</h5>

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

      <Modal
        show={showInvestModal}
        onHide={() => setShowInvestModal(false)}
        centered
        dir="rtl"
        contentClassName="bg-dark text-light"
      >
        {showMessage && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '100%',
            maxWidth: '600px',
            padding: '0 15px'
          }}>
            <Message
              coler={messageColor}
              show={showMessage}
              message={message}
              onClose={() => setShowMessage(false)}
            />
          </div>
        )}
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="w-100 text-center" style={{ color: accent }}>
            استثمار في الفرصة
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center mb-4">
            <h5>{opportunity.name}</h5>
            <p>الحد الأدنى للمساهمة: ${itemData.minimum_target}</p>
          </div>

          <Form>
            <Form.Group controlId="investmentAmount">
              <Form.Label style={{ color: accent }}>المبلغ المراد استثماره (دولار)</Form.Label>
              <Form.Control
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min="200"
                step="100"
                placeholder="أدخل المبلغ $"
                className="bg-secondary border-secondary text-light"
                required
              />
              <Form.Text className="text-warning">
                يجب أن لا يقل المبلغ عن {formatCurrency(itemData.minimum_target)}
              </Form.Text>
            </Form.Group>
          </Form>

          <div className="mt-4 text-center">
            <Button
              variant="warning"
              className="w-100 fw-bold"
              onClick={handleInvestSubmit}
              disabled={!investmentAmount || parseFloat(investmentAmount) < 200}
            >
              تأكيد الاستثمار
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InvestmentDetails;