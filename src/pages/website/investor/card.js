import React, { useState, useEffect, useCallback } from 'react';
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
import { FaArrowLeft, FaArrowRight, FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTag, FaCoins, FaMoneyBillWave, FaFilePdf } from 'react-icons/fa';
import { GiFactory, GiProfit } from 'react-icons/gi';
import { BsGraphUp, BsCurrencyDollar } from 'react-icons/bs';

const InvestmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();
  const { itemData } = state;

  // حالات السلايدر
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [images, setImages] = useState([]);

  // حالات المكون الأخرى
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // الألوان المخصصة
  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const darkGray = '#333';

  // جلب الصور من API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/images/getFactoryImages/${itemData.factory_id}`,
          {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }
        );
        setImages(response.data.images || []);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };

    if (itemData?.factory_id && user?.token) fetchImages();
  }, [itemData.factory_id, user?.token]);

  // دوال السلايدر
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // بدء التشغيل التلقائي
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const id = setInterval(() => {
        nextImage();
      }, 3000);
      setIntervalId(id);
      
      return () => clearInterval(id);
    }
  }, [autoPlay, images.length, nextImage]);

  // إيقاف التشغيل التلقائي عند التفاعل
  const handleUserInteraction = () => {
    setAutoPlay(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setTimeout(() => {
      setAutoPlay(true);
    }, 10000);
  };

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

  const calculateProgress = (collected, target) => {
    if (!collected || !target) return 0;
    const collectedNum = parseFloat(collected);
    const targetNum = parseFloat(target);
    return Math.min(Math.round((collectedNum / targetNum) * 100), 100);
  };

  const handleInvestSubmit = async () => {
    try {
      if (!investmentAmount || parseFloat(investmentAmount) < 200) {
        setMessage('المبلغ يجب أن لا يقل عن 200 ريال');
        setMessageColor('#DC3545');
        setShowMessage(true);
        return;
      }

      const formData = new FormData();
      formData.append('opprtunty_id', itemData.id);
      formData.append('amount', investmentAmount);

      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      };

      const response = await axios.post(
        `http://127.0.0.1:8000/api/InvestmentOpprtunities/confirmPurchase`,
        formData,
        config
      );

      setShowInvestModal(false);
      setInvestmentAmount('');
      setMessage('تمت عملية الاستثمار بنجاح');
      setMessageColor('#28A745');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);

    } catch (err) {
      const errorDetails = err.response?.data?.message;
      setMessage(errorDetails === "Insufficient wallet balance" 
        ? "لا يوجد رصيد كافي" 
        : errorDetails);
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

  if (!itemData) {
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


    // تصميم جديد لمشغل الصور
// تعريف جميع الأنماط في بداية المكون
  const cardStyle = {
    backgroundColor: '#2A2B32',
    color: '#F5F5F5',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  };

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(254, 218, 106, 0.2)',
    border: 'none',
    color: '#FEDA6A',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(254, 218, 106, 0.4)',
      transform: 'translateY(-50%) scale(1.1)'
    }
  };

  const imageSliderStyle = {
    height: '450px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1E1F25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1F25'
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    transition: 'opacity 0.8s ease-in-out'
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    backgroundColor: '#2E2F36',
    padding: '14px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#36373E',
      transform: 'translateX(5px)'
    }
  };

  const infoIconStyle = {
    backgroundColor: 'rgba(254, 218, 106, 0.1)',
    color: '#FEDA6A',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    flexShrink: 0
  };

  const infoTitleStyle = {
    color: '#FEDA6A',
    fontSize: '1rem',
    marginBottom: '4px',
    fontWeight: '500'
  };

  const infoTextStyle = {
    color: '#D4D4DC',
    fontSize: '0.95rem',
    marginBottom: '0',
    lineHeight: '1.6'
  };
   return (
    <>
      <Container fluid className="py-5 px-4" style={{
        backgroundColor: '#1A1B20',
        minHeight: '100vh'
      }}>
        <Container className="px-0">
          <Card style={cardStyle}>
            {/* جزء عرض الصور المحسن */}
            <div style={imageSliderStyle}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}>
              
              {images.length > 0 ? (
                <>
                  <div style={imageContainerStyle}>
                    {images.map((img, index) => (
                      <div 
                        key={img.id}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: index === currentImageIndex ? 1 : 0,
                          zIndex: index === currentImageIndex ? 1 : 0,
                          transition: 'opacity 0.8s ease-in-out'
                        }}
                      >
                        <img
                          src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                          alt={`صورة المصنع ${index + 1}`}
                          style={imageStyle}
                        />
                      </div>
                    ))}
                  </div>

                  {/* أسهم التنقل */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline-light"
                        style={{ ...arrowButtonStyle, left: '20px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserInteraction();
                          prevImage();
                        }}
                      >
                        <FaArrowLeft />
                      </Button>
                      <Button
                        variant="outline-light"
                        style={{ ...arrowButtonStyle, right: '20px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserInteraction();
                          nextImage();
                        }}
                      >
                        <FaArrowRight />
                      </Button>
                    </>
                  )}

                  {/* نقاط التوجيه */}
                  {images.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 2,
                      display: 'flex',
                      gap: '10px'
                    }}>
                      {images.map((_, index) => (
                        <div 
                          key={index}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: index === currentImageIndex ? '#FEDA6A' : 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            ':hover': {
                              transform: 'scale(1.2)'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserInteraction();
                            setCurrentImageIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1E1F25'
                }}>
                  <GiFactory size={120} color="#FEDA6A" opacity={0.3} />
                </div>
              )}
            </div>

            <Card.Body className="text-end">
              <Card.Title style={{ color: accent, fontSize: '2rem' }}>
                {itemData.name}
                <Badge bg="warning" text="dark" className="me-2">
                  {itemData.category}
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
                        href={`http://127.0.0.1:8000/storage/${itemData.factory_feasibility_pdf}`}
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
                  now={calculateProgress(itemData.collected_amount, itemData.target_amount)}
                  label={`${calculateProgress(itemData.collected_amount, itemData.target_amount)}%`}
                  style={{ height: '30px' }}
                  animated
                  variant="success"
                />
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
            <h5>{itemData.name}</h5>
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