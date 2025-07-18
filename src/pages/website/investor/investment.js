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

  // دالة مساعدة لتنسيق التاريخ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'غير محدد';
    }
  };

  // دالة مساعدة لتحويل تكرار الدفع
  const getFrequencyText = (frequency) => {
    const frequencies = {
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      yearly: 'سنوي',
      weekly: 'أسبوعي'
    };
    return frequencies[frequency] || frequency || 'غير محدد';
  };

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

        console.log('Fetching data from API...');
        const response = await axios.get(
          `${API_URL}/InvestmentOpprtunities/getAcceptedOpportunitiesWithDetails`,
          config
        );

        console.log('Full API Response:', response);

        // تحديد المصفوفة الصحيحة من البيانات المرجعة
        const responseData = response.data;
        let opportunitiesData = [];
        
        if (Array.isArray(responseData)) {
          opportunitiesData = responseData; // إذا كانت البيانات مصفوفة مباشرة
        } else if (responseData.data && Array.isArray(responseData.data)) {
          opportunitiesData = responseData.data; // إذا كانت البيانات في حقل data
        } else if (responseData.opportunities && Array.isArray(responseData.opportunities)) {
          opportunitiesData = responseData.opportunities; // إذا كانت البيانات في حقل opportunities
        } else if (responseData.results && Array.isArray(responseData.results)) {
          opportunitiesData = responseData.results; // إذا كانت البيانات في حقل results
        } else {
          throw new Error('لا يمكن العثور على مصفوفة الفرص الاستثمارية في الاستجابة');
        }

        console.log('Opportunities Data:', opportunitiesData);

        const formattedOpportunities = opportunitiesData.map((opp, index) => ({
          id: opp.id || `opp-${index}`,
          image: opp.image_url || opp.image || `https://source.unsplash.com/random/800x600?property=${index}`,
          title: opp.title || `فرصة استثمارية #${index + 1}`,
          target_amount: opp.target_amount ? `${Number(opp.target_amount).toLocaleString('ar-SA')} ريال` : 'غير محدد',
          minimum_target: opp.minimum_target ? `${Number(opp.minimum_target).toLocaleString('ar-SA')} ريال` : 'غير محدد',
          collected_amount: opp.collected_amount ? `${Number(opp.collected_amount).toLocaleString('ar-SA')} ريال` : 'غير محدد',
          start_date: opp.strtup || opp.start_date ? formatDate(opp.strtup || opp.start_date) : 'غير محدد',
          payout_frequency: getFrequencyText(opp.payout_frequency),
          profit_percentage: opp.profit_percentage ? `${opp.profit_percentage}%` : 'غير محدد',
          description: opp.descrption || opp.description || 'لا يوجد وصف'
        }));

        console.log('Formatted Opportunities:', formattedOpportunities);
        setOpportunities(formattedOpportunities);
      } catch (err) {
        console.error('Error details:', {
          error: err,
          response: err.response?.data
        });
        
        let errorMsg = 'حدث خطأ أثناء جلب الفرص الاستثمارية';
        if (err.response) {
          errorMsg = err.response.data?.message || 
                    `خطأ في الخادم: ${err.response.status}`;
        } else if (err.request) {
          errorMsg = 'لا يوجد اتصال بالخادم';
        }
        
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

  if (loading) {
    return (
      <Container fluid className="py-5 d-flex justify-content-center align-items-center" style={{ 
        backgroundColor: primaryDark, 
        minHeight: '100vh' 
      }}>
        <Spinner animation="border" variant="warning" />
        <span className="ms-3" style={{ color: lightText }}>جاري تحميل البيانات...</span>
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
          <Alert variant="danger" className="text-center">
            <Alert.Heading>خطأ في تحميل البيانات</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-center">
              <Button 
                variant="outline-danger" 
                onClick={() => window.location.reload()}
                className="me-2"
              >
                إعادة المحاولة
              </Button>
              <Button 
                variant="outline-secondary" 
                as={NavLink} 
                to="/"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </Alert>
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
          <Card className="text-center border-0 shadow" style={{ 
            backgroundColor: darkGray,
            color: lightText
          }}>
            <Card.Body>
              <Card.Title className="mb-3">لا توجد فرص استثمارية متاحة حالياً</Card.Title>
              <Button 
                variant="outline-primary" 
                onClick={() => window.location.reload()}
              >
                تحديث الصفحة
              </Button>
            </Card.Body>
          </Card>
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
                    boxShadow: `0 10px 20px rgba(254, 218, 106, 0.3)`
                  }
                }}>
                  <Card.Img
                    variant="top"
                    src={opportunity.image}
                    alt={opportunity.title}
                    style={{
                      height: '250px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=صورة+غير+متوفرة';
                    }}
                  />
                  <Card.Body className="text-end">
                    <Card.Title style={{ color: accent, minHeight: '3rem' }}>
                      {opportunity.title}
                    </Card.Title>
                    <Card.Text>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">المبلغ المستهدف:</span>
                          <span>{opportunity.target_amount}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">الحد الأدنى:</span>
                          <span>{opportunity.minimum_target}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">المجموع:</span>
                          <span>{opportunity.collected_amount}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">تاريخ البدء:</span>
                          <span>{opportunity.start_date}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">تكرار الدفع:</span>
                          <span>{opportunity.payout_frequency}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">نسبة الربح:</span>
                          <span>{opportunity.profit_percentage}</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-muted mb-1">الوصف:</p>
                          <p style={{ 
                            maxHeight: '3.6rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {opportunity.description}
                          </p>
                        </div>
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