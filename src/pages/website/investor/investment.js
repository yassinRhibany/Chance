import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import Message from '../../../components/Message.js/Message';

const Investment = () => {
  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useAuth();
  const API_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const fetchInvestmentOpportunities = async () => {
      try {
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
          `${API_URL}/InvestmentOpprtunities/getAcceptedOpportunitiesWithDetails`,
          config
        );

        const apiData = response.data;

        if (!apiData || !Array.isArray(apiData)) {
          throw new Error('تنسيق البيانات غير صحيح');
        }

        // جلب الصور لكل مصنع بشكل متوازي
        const opportunitiesWithImages = await Promise.all(
          apiData.map(async (item) => {
            try {
              const imageResponse = await axios.get(
                `${API_URL}/images/getFactoryImages/${item.factory_id}`,
                {
                  headers: { 'Authorization': `Bearer ${user.token}` }
                }
              );

              const imagePath = imageResponse.data.images?.[0]?.image_path
                ? `http://127.0.0.1:8000/storage/${imageResponse.data.images[1].image_path}`
                : '';

              return {
                id: item.opportunity_id,
                factory_id: item.factory_id,
                collected_amount: item.opportunity_collected_amount || '10',
                minimum_target: item.opportunity_minimum_target,
                opportunity_strtup: item.opportunity_strtup || 'غير محدد',
                opportunity_payout_frequency: item.opportunity_payout_frequency || 'غير محدد',
                opportunity_profit_percentage: item.opportunity_profit_percentage,
                category: item.category_name || 'غير محدد',
                name: item.factory_name || 'غير معروف',
                address: item.factory_address || 'غير محدد',
                factory_feasibility_pdf: item.factory_feasibility_pdf,
                image: imagePath,
                target_amount: item.opportunity_target_amount,
                description: item.opportunity_description || 'لا يوجد وصف متاح',
              };
            } catch (imageError) {
              console.error('Error fetching image:', imageError);
              return {
                ...item,
                image: '/default-image.jpg'
              };
            }
          })
        );

        setOpportunities(opportunitiesWithImages);

      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب الفرص الاستثمارية';
        setError(errorMsg);
        setMessage('حدث خطأ أثناء جلب البيانات');
        setMessageColor('#DC3545');
        setShowMessage(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentOpportunities();
  }, [user]);

  const formatCurrency = (amount) => {
<<<<<<< HEAD
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

  const calculateProgress = (collected, target) => {
    if (!collected || !target) return 0;
    return (collected / target) * 100;
=======
    if (!amount) return '0.00 $';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('ar-SA').format(num) + '$';
>>>>>>> a8b06c4d8b6e51caeffeaba0ffa48210a26f9229
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
            onClick={() => window.location.reload()}
            className="mt-3"
          >
            إعادة المحاولة
          </Button>
        </Container>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{
      backgroundColor: primaryDark,
      minHeight: '100vh'
    }}>
      <Container>
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
              color={messageColor}
              show={showMessage}
              message={message}
              onClose={() => setShowMessage(false)}
            />
          </div>
        )}

        <h1 className="text-center mb-5" style={{ color: accent }}>
          فرص استثمارية
        </h1>

        {opportunities.length === 0 ? (
          <div className="text-center" style={{ color: lightText }}>
            لا توجد فرص استثمارية متاحة حالياً
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {opportunities.map((opportunity) => (
              <Col key={opportunity.id}>
                <Card style={{
                  backgroundColor: darkGray,
                  color: lightText,
                  border: `1px solid ${accent}`,
                  borderRadius: '15px',
                  height: '100%',
                  transition: 'transform 0.3s',
                  ':hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <Card.Img
                    variant="top"
                    src={opportunity.image}
                    alt='imag not found'
                    style={{
                      height: '250px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px'
                    }}
                    onError={(e) => {
                      e.target.src = '/default-image.jpg';
                    }}
                  />
                  <Card.Body className="text-end">
                    <Card.Title style={{ color: accent }}>
                      {opportunity.name}
                      <Badge bg="warning" text="dark" className="me-2">
                        {opportunity.category}
                      </Badge>
                    </Card.Title>
                    <Card.Text>
                      <div>
                        <p>📍 العنوان: {opportunity.address}</p>
                        <p>💰 المبلغ المستهدف: {formatCurrency(opportunity.target_amount)}</p>
                        <p>📉 الحد الأدنى: {formatCurrency(opportunity.minimum_target)}</p>
                        <div className="mb-3">
                          <h6 style={{ color: accent }}>مستوى الإنجاز:</h6>
                          <ProgressBar
                            now={calculateProgress(opportunity.collected_amount, opportunity.target_amount)}
                            label={`${calculateProgress(opportunity.collected_amount, opportunity.target_amount).toFixed(2)}%`}
                            variant="success"
                            animated
                            style={{ height: '20px' }}
                          />
                        </div>
                      </div>
                    </Card.Text>
                    <Button
                      as={NavLink}
                      to={`/investor/investment/${opportunity.id}`}
                      state={{ itemData: opportunity }}
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
        )}
      </Container>
    </Container>
  );
};

export default Investment;