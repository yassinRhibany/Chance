import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, ProgressBar,
  Button, Form, Modal, InputGroup, Spinner, Alert
} from 'react-bootstrap';
import {
  FaCoins, FaChartLine, FaDollarSign, FaInfoCircle,
  FaTrash, FaEdit, FaPlus, FaSearch, FaFilter,
  FaFilePdf, FaSync
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const InvestmentPortfolio = () => {
  const { user } = useAuth();
  console.log(user.token)
  const [portfolio, setPortfolio] = useState([]);
  const [filteredPortfolio, setFilteredPortfolio] = useState([]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null);
  const [askPrice, setAskPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiMessage, setApiMessage] = useState({ text: '', variant: '' });
  const [showApiMessage, setShowApiMessage] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
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
          'http://127.0.0.1:8000/api/Investments/filterByUser',
          config
        );

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('تنسيق البيانات غير صحيح');
        }

        const formattedPortfolio = response.data.map((item, index) => {
          const investedAmount = parseFloat(item.amount);
          return {
            id: item.id,
            name: item.opportunity.factory_name,
            factory_name: item.opportunity.factory_name,
            shares: item.percentage,
            amount: investedAmount,
            profit_percentage: parseFloat(item.opportunity.profit_percentage),
            status: 'نشط',
            listedForSale: false,
            askingPrice: 0,
            payout_frequency: item.opportunity.payout_frequency,
            target_amount: item.opportunity.target_amount,
            collected_amount: item.opportunity.collected_amount
          };
        });

        setPortfolio(formattedPortfolio);
        setFilteredPortfolio(formattedPortfolio);
        setIsLoading(false);

      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message || 'حدث خطأ أثناء جلب البيانات');
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  useEffect(() => {
    let result = portfolio.filter(share => {
      return (
        (share.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          share.factory_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'الكل' || share.status === statusFilter)
      );
    });
    setFilteredPortfolio(result);
  }, [searchTerm, statusFilter, portfolio]);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

  const calculateProgress = (collected, target) => {
    if (!collected || !target) return 0;
    const collectedNum = parseFloat(collected);
    const targetNum = parseFloat(target);
    return Math.min(Math.round((collectedNum / targetNum) * 100), 100);
  };

  const openSellModal = (share) => {
    setSelectedShare(share);
    setAskPrice(share.amount);
    setShowSellModal(true);
  };

  const listShareForSale = async () => {
    try {
      if (!user?.token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const formData = new FormData();
      formData.append('investment_id', selectedShare.id);
      formData.append('offred_amount', selectedShare.amount);
      formData.append('price', askPrice);

      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/api/offer/storeOffer',
        formData,
        config
      );
      console.log(response)
      // تحديث الحالة المحلية بعد النجاح
      const updatedPortfolio = portfolio.map(share => {
        if (share.id === selectedShare.id) {
          return { ...share, listedForSale: true, askingPrice: askPrice };
        }
        return share;
      });

      setPortfolio(updatedPortfolio);
      setShowSellModal(false);
      
      setApiMessage({ text: 'تم عرض الحصة للبيع بنجاح', variant: 'success' });
      setShowApiMessage(true);
      setTimeout(() => setShowApiMessage(false), 5000);

    } catch (err) {
      console.error('Error listing share for sale:', err);
      setApiMessage({ 
        text: err.response?.data?.message || 'حدث خطأ أثناء محاولة عرض الحصة للبيع', 
        variant: 'danger' 
      });
      setShowApiMessage(true);
    }
  };

  const removeListing = (share) => {
    const updatedPortfolio = portfolio.map(s => {
      if (s.id === share.id) {
        return { ...s, listedForSale: false, askingPrice: 0 };
      }
      return s;
    });
    setPortfolio(updatedPortfolio);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const portfolioStats = {
    totalValue: portfolio.reduce((sum, share) => sum + share.amount, 0),
    totalInvested: portfolio.reduce((sum, share) => sum + share.amount, 0),
    totalReturns: portfolio.reduce((sum, share) => sum + (share.amount * (share.profit_percentage / 100)), 0),
    listedShares: portfolio.filter(share => share.listedForSale).length,
    avgprofit_percentage: portfolio.length > 0
      ? Math.round(portfolio.reduce((sum, share) => sum + share.profit_percentage, 0) / portfolio.length)
      : 0
  };

  if (error) {
    return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '2rem' }}>
        <Container className="text-center py-5">
          <div className="bg-danger p-3 rounded mb-3 d-inline-block">
            <FaInfoCircle size={32} className="text-white" />
          </div>
          <h5 className="text-light">{error}</h5>
          <Button variant="primary" className="mt-3" onClick={() => window.location.reload()}>
            حاول مرة أخرى
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#e0e0e0',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      <Container fluid className="py-4">
        {showApiMessage && (
          <Alert 
            variant={apiMessage.variant} 
            onClose={() => setShowApiMessage(false)} 
            dismissible
            className="mt-3"
          >
            {apiMessage.text}
          </Alert>
        )}

        {/* العنوان الرئيسي */}
        <Row className="mb-4 align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <div className="bg-primary p-3 rounded me-3">
                <FaCoins size={32} className="text-white" />
              </div>
              <div>
                <h1 className="fw-bold mb-0 text-light">محفظتي الاستثمارية</h1>
                <p className="mb-0 text-light">إدارة وتتبع جميع حصصك الاستثمارية في مكان واحد</p>
              </div>
            </div>
          </Col>
          <Col md="auto">
            <Button variant="outline-light">
              <FaPlus className="me-2" /> استثمار جديد
            </Button>
          </Col>
        </Row>

        {/* بطاقات الإحصائيات */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-muted">القيمة الإجمالية</h6>
                    <h3 className="mb-0 text-light">
                      {formatCurrency(portfolioStats.totalValue)}
                    </h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaCoins size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6  className="text-uppercase small text-white ">إجمالي العوائد</h6>
                    <h3 className="mb-0 text-success">
                      {formatCurrency(portfolioStats.totalReturns)}
                    </h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaChartLine size={24} className="text-success" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                   <h6 className="text-uppercase small text-white">متوسط العائد</h6>
                    <h3 className="mb-0 text-warning">
                      {portfolioStats.avgprofit_percentage}%
                    </h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <FaChartLine size={24} className="text-warning" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-muted text-white">الحصص المعروضة</h6>
                    <h3 className="mb-0 text-info">
                      {portfolioStats.listedShares}
                    </h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaDollarSign size={24} className="text-info" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* أدوات التحكم */}
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-dark text-light border-secondary">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="ابحث باسم المصنع أو الصنف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-dark text-light border-secondary"
                  />
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="الكل">كل الحالات</option>
                  <option value="نشط">نشط</option>
                  <option value="مكتمل">مكتمل</option>
                  <option value="معلق">معلق</option>
                </Form.Select>
              </Col>

              <Col md={3} className="d-flex">
                <Button variant="outline-secondary" className="me-2 flex-grow-1" onClick={refreshData}>
                  <FaSync /> تحديث
                </Button>
                <Button variant="outline-primary">
                  <FaFilePdf /> تصدير
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* جدول الحصص الاستثمارية */}
        <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="border-0 py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#2a2a2a' }}>
            <h5 className="mb-0 text-light">
              <FaCoins className="me-2 text-warning" /> حصصي الاستثمارية
            </h5>
            <p className="mb-0 text-muted">عدد الحصص: {portfolio.length}</p>
          </Card.Header>
          <Card.Body className="p-0">
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-light">جاري تحميل بيانات المحفظة...</p>
              </div>
            ) : filteredPortfolio.length > 0 ? (
              <Table hover responsive className="mb-0 text-light">
                <thead style={{ backgroundColor: '#2a2a2a' }}>
                  <tr>
                    <th>المصنع</th>
                    <th>نسبة الحصة</th>
                    <th>سعر الشراء</th>
                    <th>تردد العائد</th>
                    <th>العوائد</th>
                    <th>الهدف</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPortfolio.map((share, index) => (
                    <tr key={index} style={{ backgroundColor: '#252525' }}>
                      <td className="fw-bold">{share.name}</td>
                      <td>{share.shares}%</td>
                      <td className="text-muted">{formatCurrency(share.amount)}</td>
                      <td className="fw-bold">{share.payout_frequency}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2 text-success">+{share.profit_percentage}%</span>
                          <ProgressBar
                            now={share.profit_percentage}
                            variant="success"
                            style={{ height: '8px', width: '100px' }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2 text-success">{calculateProgress(share.collected_amount,share.target_amount)}%</span>
                          <ProgressBar
                            now={calculateProgress(share.collected_amount,share.target_amount)}
                            variant="success"
                            style={{ height: '8px', width: '100px' }}
                          />
                        </div>
                      </td>
                      <td>
                        <Badge bg={calculateProgress(share.collected_amount,share.target_amount) === 100 ? 'success' : 'warning'}>
                          {calculateProgress(share.collected_amount,share.target_amount) === 100 ? 'مكتمل' : 'غير مكتمل'}
                        </Badge>
                        {share.listedForSale && (
                          <Badge bg="warning" className="ms-2">
                            <FaDollarSign /> معروضة
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {share.listedForSale ? (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeListing(share)}
                            >
                              <FaTrash className="me-1" /> إلغاء
                            </Button>
                          ) : (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => openSellModal(share)}
                              disabled={share.status !== 'نشط'}
                            >
                              <FaDollarSign className="me-1" /> بيع
                            </Button>
                          )}
                          <Button variant="outline-info" size="sm">
                            <FaEdit /> تفاصيل
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5" style={{ backgroundColor: '#252525' }}>
                <FaCoins size={48} className="text-muted mb-3" />
                <h5 className="text-light">لا توجد حصص مطابقة لمعايير البحث</h5>
                <p className="text-muted">حاول تغيير معايير البحث أو أضف استثمارات جديدة</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* أداء المحفظة */}
        <Card className="border-0 shadow-sm mt-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="border-0 py-3" style={{ backgroundColor: '#2a2a2a' }}>
            <h5 className="mb-0 d-flex align-items-center text-light">
              <FaChartLine className="me-2 text-success" /> أداء المحفظة
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="border rounded p-4 mb-4" style={{ backgroundColor: '#252525' }}>
                  <h6 className="text-warning mb-4">توزيع الحصص حسب الصنف</h6>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-white">أثاث</span>
                      <span className="text-white">25%</span>
                    </div>
                    <ProgressBar variant="warning" now={25} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-white">بلاستيك</span>
                      <span className="text-white">15%</span>
                    </div>
                    <ProgressBar variant="info" now={15} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-white">إلكترونيات</span>
                      <span className="text-white">35%</span>
                    </div>
                    <ProgressBar variant="primary" now={35} style={{ height: '10px' }} />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-white">ورق وطباعة</span>
                      <span className="text-white">25%</span>
                    </div>
                    <ProgressBar variant="success" now={25} style={{ height: '10px' }} />
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="border rounded p-4 mb-4" style={{ backgroundColor: '#252525' }}>
                  <h6 className="text-success mb-4">أفضل الاستثمارات أداءً</h6>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                      <FaCoins size={24} className="text-success" />
                    </div>
                    <div>
                      <div className="fw-bold">مصنع الأثاث الحديث</div>
                      <div className="text-success">+25% عائد</div>
                      <div className="text-white small">قيمة حالية: {formatCurrency(312500)}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                      <FaCoins size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-white fw-bold">مصنع الورق الصحي</div>
                      <div className="text-success">+25% عائد</div>
                      <div className="text-white small">قيمة حالية: {formatCurrency(375000)}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                      <FaCoins size={24} className="text-info" />
                    </div>
                    <div>
                      <div className="text-white fw-bold">مصنع الأدوات الكهربائية</div>
                      <div className="text-success">+20% عائد</div>
                      <div className="text-white small">قيمة حالية: {formatCurrency(420000)}</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {/* نافذة بيع الحصة */}
      <Modal
        show={showSellModal}
        onHide={() => setShowSellModal(false)}
        centered
        contentClassName="bg-dark text-light"
      >
        <Modal.Header className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Modal.Title className="d-flex align-items-center">
            <FaDollarSign className="me-2 text-warning" /> عرض حصة للبيع
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedShare && (
            <div>
              <div className="border rounded p-3 mb-4" style={{ backgroundColor: '#252525' }}>
                <h5 className="text-warning">{selectedShare.name}</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>نسبة الحصة:</span>
                  <span className="fw-bold">{selectedShare.shares}%</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>القيمة الحالية:</span>
                  <span className="fw-bold">{formatCurrency(selectedShare.amount)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>معدل العائد:</span>
                  <span className="text-success fw-bold">+{selectedShare.profit_percentage}%</span>
                </div>
              </div>

              <Form.Group className="mb-4">
                <Form.Label>سعر البيع المطلوب</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-dark text-light border-secondary">
                    <FaDollarSign />
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={askPrice}
                    onChange={(e) => setAskPrice(parseInt(e.target.value) || 0)}
                    className="bg-dark text-light border-secondary"
                    min={selectedShare.amount}
                  />
                </InputGroup>
                <Form.Text style={{color:"white"}}>
                  أدخل سعراً يساوي أو يزيد عن القيمة الحالية: {formatCurrency(selectedShare.amount)}
                </Form.Text>
              </Form.Group>

              <div className="alert alert-info border-info">
                <FaInfoCircle className="me-2" />
                ستظل حصتك معروضة للبيع لمدة 7 أيام أو حتى يتم بيعها
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-secondary" onClick={() => setShowSellModal(false)}>
            إلغاء
          </Button>
          <Button
            variant="warning"
            onClick={listShareForSale}
            disabled={askPrice < selectedShare?.amount}
          >
            <FaDollarSign className="me-1" /> عرض للبيع
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvestmentPortfolio;