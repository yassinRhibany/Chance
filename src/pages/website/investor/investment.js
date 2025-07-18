import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
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

        // جلب البيانات بدون إرسال أي بيانات
        const response = await axios.get(
          `${API_URL}/InvestmentOpprtunities/getAcceptedOpportunitiesWithDetails`,
          config
        );

        console.log('API Raw Data:', response.data); // للتأكد من هيكل البيانات

        // البيانات تأتي كمصفوفة مباشرة [{...}] حسب ما يظهر
        const apiData = response.data;

        if (!apiData || !Array.isArray(apiData)) {
          throw new Error('تنسيق البيانات غير صحيح');
        }

        const formattedOpportunities = apiData.map(item => ({
          id: item.opportunity_id || Math.random().toString(36).substr(2, 9),
          category: item.category_name || 'غير محدد',
          name: item.factory_name || 'غير معروف',
          address: item.factory_address || 'غير محدد',
          feasibility_pdf: item.factory_feasibility_pdf ?
            `${API_URL}/storage/${item.factory_feasibility_pdf}` : null,
          image: item.image_url || `https://source.unsplash.com/random/300x200?factory=${item.opportunity_id}`,
          target_amount: formatCurrency(item.opportunity_target_amount),
          minimum_target: formatCurrency(item.opportunity_minimum_target),
          collected_amount: formatCurrency(item.opportunity_collected_amount),
          start_date: formatDate(item.opportunity_strtup),
          payout_frequency: translateFrequency(item.opportunity_payout_frequency),
          profit_percentage: `${item.opportunity_profit_percentage}%`,
          description: item.opportunity_description || 'لا يوجد وصف متاح'
        }));


        setOpportunities(formattedOpportunities);
        console.log(formattedOpportunities)

      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب الفرص الاستثمارية';
        setError(errorMsg);
        setMessage('حدث خطأ أثناء جلب البيانات');
        setMessageColor('#DC3545');
        setShowMessage(true);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentOpportunities();
  }, [user]);

  // ترجمة تكرار الدفع
const translateFrequency = (freq) => {
  const frequencies = {
    'quarterly': 'ربع سنوي',
    'monthly': 'شهري',
    'annually': 'سنوي',
    'biannually': 'نصف سنوي'
  };
  return frequencies[freq] || freq;
};

// تنسيق المبالغ المالية
const formatCurrency = (amount) => {
  if (!amount) return '0.00 ريال';
  const num = parseFloat(amount);
  return new Intl.NumberFormat('ar-SA').format(num) + ' ريال';
};

// تنسيق التاريخ
const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ar-SA', options);
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
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 20px rgba(254, 218, 106, 0.2)`
                  }
                }}>
                  <Card.Img
                    variant="top"
                    src={opportunity.image}
                    style={{
                      height: '250px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px'
                    }}
                  />
                  <Card.Body className="text-end">
                    <>
                    <Card.Title style={{ color: accent }}>
                      {opportunity.title}
                    </Card.Title>
                    <Card.Text>
                      <div>
                        <p>💰 المبلغ المستهدف: {opportunity.target_amount}</p>
                        <p>📉 الحد الأدنى للمساهمة: {opportunity.minimum_target}</p>
                        <p>🏦 المبلغ المجموع: {opportunity.collected_amount}</p>
                        <p>📅 تاريخ البدء: {opportunity.start_date}</p>
                        <p>🔄 تكرار الدفع: {opportunity.payout_frequency}</p>
                        <p>📈 نسبة الربح: {opportunity.profit_percentage}</p>
                        <p>📝 الوصف: {opportunity.description}</p>
                      </div>
                    </Card.Text>
                    <Button
                      as={NavLink}
                      to={`/investor/Card/${opportunity.id}`}
                      style={{
                        backgroundColor: accent,
                        borderColor: accent,
                        color: primaryDark,
                        fontWeight: 'bold',
                        width: '100%',
                        ':hover': {
                          backgroundColor: '#e6c860',
                          borderColor: '#e6c860'
                        }
                      }}
                    >
                      المزيد من التفاصيل
                    </Button>
                    </>
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