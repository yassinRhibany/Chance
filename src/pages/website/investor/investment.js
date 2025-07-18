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

        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data)) {
          const formattedOpportunities = response.data.map(opp => ({
            id: opp.id,
            // image: opp.image_url || `https://source.unsplash.com/random/800x600?property=${opp.id}`,
            title: opp.title || `فرصة استثمارية #${opp.id}`,
            target_amount: opp.target_amount ? `${opp.target_amount.toLocaleString()} ريال` : 'غير محدد',
            minimum_target: opp.minimum_target ? `${opp.minimum_target.toLocaleString()} ريال` : 'غير محدد',
            collected_amount: opp.collected_amount ? `${opp.collected_amount.toLocaleString()} ريال` : 'غير محدد',
            start_date: opp.strtup ? new Date(opp.strtup).toLocaleDateString('ar-SA') : 'غير محدد',
            payout_frequency: opp.payout_frequency || 'غير محدد',
            profit_percentage: opp.profit_percentage ? `${opp.profit_percentage}%` : 'غير محدد',
            description: opp.descrption || 'لا يوجد وصف'
            
          }));
        
          
          setOpportunities(formattedOpportunities);
        } else {
          throw new Error('تنسيق البيانات غير صحيح من الخادم');
        }
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
                      to={`/investor/Card/`}
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