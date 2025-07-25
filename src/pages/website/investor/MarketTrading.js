import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, 
  ProgressBar, Button, Alert, Spinner, Form, InputGroup,
  Modal
} from 'react-bootstrap';
import { 
  FaSearch, FaMoneyBillWave, FaChartLine, 
  FaCalendarAlt, FaPercentage, FaInfoCircle,
  FaUser, FaIdCard, FaCoins, FaShoppingCart
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const InvestmentMarket = () => {
  const { user } = useAuth();
  const token = user?.token;
  
  // State for investment opportunities
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);
  
  // Fetch investment opportunities from API
  const fetchInvestmentOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/api/offer/index',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('بيانات العروض غير متوفرة أو غير صالحة');
      }

      setOffers(response.data);
    } catch (err) {
      console.error('Error fetching investment offers:', err);
      setError(err.response?.data?.message || err.message || 'حدث خطأ في جلب بيانات العروض');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle purchase offer
  const handlePurchaseOffer = async (offerId) => {
    try {
      setPurchaseLoading(true);
      setPurchaseError(null);
      setPurchaseSuccess(null);

      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/offer/buyOffer',
        { offer_id: offerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );console.log(response);

      if (response.data.success) {
        setPurchaseSuccess('تم شراء الحصة بنجاح!');
        // Refresh offers after successful purchase
        fetchInvestmentOffers();
      } else {
        throw new Error(response.data.message || 'فشلت عملية الشراء');
      }
    } catch (err) {
      console.error('Error purchasing offer:', err);
      setPurchaseError(err.response?.data?.message || err.message || 'حدث خطأ أثناء عملية الشراء');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Calculate progress percentage
  const calculateProgress = (collected, target) => {
    return Math.min(100, (collected / target) * 100);
  };

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    return (
      offer.investment.opprtunty.descrption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.offred_amount.toString().includes(searchTerm) ||
      offer.price.toString().includes(searchTerm));
  });

  // Calculate market stats
  const totalInvested = offers.reduce((sum, offer) => sum + parseFloat(offer.offred_amount), 0);
  const averageProfit = offers.length > 0 
    ? offers.reduce((sum, offer) => sum + parseFloat(offer.investment.opprtunty.profit_percentage), 0) / offers.length
    : 0;

  // Handle view details
  const handleViewDetails = (offer) => {
    setSelectedOffer(offer);
    setShowDetails(true);
    // Reset purchase messages when opening modal
    setPurchaseSuccess(null);
    setPurchaseError(null);
  };

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchInvestmentOffers();
    } else {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
    }
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">جاري تحميل الفرص الاستثمارية...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <FaInfoCircle className="me-2" />
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={fetchInvestmentOffers}>
              إعادة المحاولة
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">سوق الفرص الاستثمارية</h2>
          <p className="text-muted">تصفح واختر الفرص الاستثمارية المناسبة لك</p>
        </Col>
      </Row>
      
      {/* Market Stats */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">إجمالي الاستثمارات</h6>
                  <h3 className="mb-0 text-primary">
                    {formatCurrency(totalInvested)}
                  </h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <FaMoneyBillWave size={24} className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">متوسط العائد</h6>
                  <h3 className="mb-0 text-success">
                    {averageProfit.toFixed(2)}%
                  </h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <FaChartLine size={24} className="text-success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Search */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="ابحث في الفرص الاستثمارية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      
      {/* Investment Opportunities Table */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">الفرص المتاحة للاستثمار</h5>
        </Card.Header>
        <Card.Body>
          {filteredOffers.length > 0 ? (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>الوصف</th>
                  <th>المبلغ المعروض</th>
                  <th>السعر</th>
                  <th>الهدف</th>
                  <th>التقدم</th>
                  <th>العائد</th>
                  <th>البداية</th>
                  <th>التكرار</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer, index) => (
                  <tr key={index}>
                    <td>{offer.investment.opprtunty.descrption || 'لا يوجد وصف'}</td>
                    <td className="text-primary fw-bold">
                      {formatCurrency(offer.offred_amount)}
                    </td>
                    <td>{formatCurrency(offer.price)}</td>
                    <td>
                      {formatCurrency(offer.investment.opprtunty.target_amount)}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          {calculateProgress(
                            parseFloat(offer.investment.opprtunty.collected_amount),
                            parseFloat(offer.investment.opprtunty.target_amount)
                          ).toFixed(0)}%
                        </span>
                        <ProgressBar 
                          now={calculateProgress(
                            parseFloat(offer.investment.opprtunty.collected_amount),
                            parseFloat(offer.investment.opprtunty.target_amount)
                          )} 
                          style={{ width: '100px', height: '8px' }} 
                        />
                      </div>
                    </td>
                    <td className="text-success fw-bold">
                      <FaPercentage className="me-1" />
                      {offer.investment.opprtunty.profit_percentage}%
                    </td>
                    <td>
                      <Badge bg="info">
                        <FaCalendarAlt className="me-1" />
                        {offer.investment.opprtunty.strtup}
                      </Badge>
                    </td>
                    <td>{offer.investment.opprtunty.payout_frequency}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewDetails(offer)}
                      >
                        عرض التفاصيل
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              <FaInfoCircle className="me-2" />
              لا توجد فرص استثمارية مطابقة لمعايير البحث
            </Alert>
          )}
        </Card.Body>
      </Card>
      
      {/* Offer Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>تفاصيل الفرصة الاستثمارية</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffer && (
            <div>
              {/* Purchase status messages */}
              {purchaseSuccess && (
                <Alert variant="success" className="text-center">
                  {purchaseSuccess}
                </Alert>
              )}
              {purchaseError && (
                <Alert variant="danger" className="text-center">
                  {purchaseError}
                </Alert>
              )}

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">
                        <FaIdCard className="me-2" />
                        معلومات العرض
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="fw-bold">معرف العرض:</td>
                            <td>{selectedOffer.investment_id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">المبلغ المعروض:</td>
                            <td className="text-primary fw-bold">
                              {formatCurrency(selectedOffer.offred_amount)}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">السعر:</td>
                            <td>{formatCurrency(selectedOffer.price)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">
                        <FaUser className="me-2" />
                        معلومات الاستثمار
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="fw-bold">معرف الاستثمار:</td>
                            <td>{selectedOffer.investment.id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">معرف المستخدم:</td>
                            <td>{selectedOffer.investment.user_id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">معرف الفرصة:</td>
                            <td>{selectedOffer.investment.opprtunty_id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">المبلغ:</td>
                            <td>{formatCurrency(selectedOffer.investment.amount)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">
                    <FaInfoCircle className="me-2" />
                    تفاصيل الفرصة
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">الوصف:</td>
                        <td>{selectedOffer.investment.opprtunty.descrption || 'لا يوجد وصف'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الهدف:</td>
                        <td>{formatCurrency(selectedOffer.investment.opprtunty.target_amount)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">المبلغ المحصل:</td>
                        <td>{formatCurrency(selectedOffer.investment.opprtunty.collected_amount)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">الحد الأدنى:</td>
                        <td>{formatCurrency(selectedOffer.investment.opprtunty.minimum_target)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">تاريخ البدء:</td>
                        <td>{selectedOffer.investment.opprtunty.strtup}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">تكرار الدفع:</td>
                        <td>{selectedOffer.investment.opprtunty.payout_frequency}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">نسبة الربح:</td>
                        <td className="text-success fw-bold">
                          {selectedOffer.investment.opprtunty.profit_percentage}%
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              
              <div className="text-center mt-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => handlePurchaseOffer(selectedOffer.id)}
                  disabled={purchaseLoading}
                >
                  {purchaseLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">جاري المعالجة...</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="me-2" />
                      شراء الحصة
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Additional Information */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">كيف يعمل سوق الاستثمار؟</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <div className="d-flex">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <FaSearch size={24} className="text-primary" />
                </div>
                <div>
                  <h6>تصفح الفرص</h6>
                  <p className="text-muted mb-0">
                    تصفح الفرص الاستثمارية المتاحة واختر ما يناسبك
                  </p>
                </div>
              </div>
            </Col>
            
            <Col md={4} className="mb-3">
              <div className="d-flex">
                <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                  <FaMoneyBillWave size={24} className="text-success" />
                </div>
                <div>
                  <h6>استثمر</h6>
                  <p className="text-muted mb-0">
                    اختر المبلغ الذي ترغب في استثماره
                  </p>
                </div>
              </div>
            </Col>
            
            <Col md={4} className="mb-3">
              <div className="d-flex">
                <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                  <FaChartLine size={24} className="text-warning" />
                </div>
                <div>
                  <h6>احصل على عوائدك</h6>
                  <p className="text-muted mb-0">
                    استلم أرباحك حسب الجدول الزمني المحدد
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InvestmentMarket;