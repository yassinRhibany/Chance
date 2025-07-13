import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, Button, Form, Modal, InputGroup ,Spinner} from 'react-bootstrap';
import { FaCoins, FaChartLine, FaDollarSign, FaInfoCircle, FaTrash, FaEdit, FaPlus, FaSearch, FaFilter, FaFilePdf, FaSync , } from 'react-icons/fa';

const InvestmentPortfolio = () => {
  // بيانات محفظة المستثمر
  const [portfolio, setPortfolio] = useState([
    {
      id: 'SH-001',
      name: 'مصنع الأثاث الحديث',
      category: 'أثاث',
      shares: 25,
      purchasePrice: 250000,
      currentValue: 312500,
      returnRate: 25,
      status: 'نشط',
      listedForSale: false,
      askingPrice: 0
    },
    {
      id: 'SH-002',
      name: 'مصنع البلاستيك المتطور',
      category: 'بلاستيك',
      shares: 15,
      purchasePrice: 150000,
      currentValue: 180000,
      returnRate: 20,
      status: 'نشط',
      listedForSale: true,
      askingPrice: 195000
    },
    {
      id: 'SH-003',
      name: 'مصنع الأدوات الكهربائية',
      category: 'إلكترونيات',
      shares: 35,
      purchasePrice: 350000,
      currentValue: 420000,
      returnRate: 20,
      status: 'نشط',
      listedForSale: false,
      askingPrice: 0
    },
    {
      id: 'SH-004',
      name: 'مصنع الورق الصحي',
      category: 'ورق وطباعة',
      shares: 30,
      purchasePrice: 300000,
      currentValue: 375000,
      returnRate: 25,
      status: 'مكتمل',
      listedForSale: false,
      askingPrice: 0
    }
  ]);

  // حالة النموذج
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null);
  const [askPrice, setAskPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(false);

  // تنسيق العملة
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // فتح نموذج البيع
  const openSellModal = (share) => {
    setSelectedShare(share);
    setAskPrice(share.currentValue);
    setShowSellModal(true);
  };

  // إدراج الحصة للبيع
  const listShareForSale = () => {
    const updatedPortfolio = portfolio.map(share => {
      if (share.id === selectedShare.id) {
        return {
          ...share,
          listedForSale: true,
          askingPrice: askPrice
        };
      }
      return share;
    });
    
    setPortfolio(updatedPortfolio);
    setShowSellModal(false);
  };

  // إزالة إدراج الحصة من السوق
  const removeListing = (share) => {
    const updatedPortfolio = portfolio.map(s => {
      if (s.id === share.id) {
        return {
          ...s,
          listedForSale: false,
          askingPrice: 0
        };
      }
      return s;
    });
    
    setPortfolio(updatedPortfolio);
  };

  // محاكاة تحديث البيانات
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  // تصفية الحصص
  const filteredPortfolio = portfolio.filter(share => {
    return (
      (share.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      share.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      statusFilter === 'الكل' || share.status === statusFilter
    ));
  });

  // إحصائيات المحفظة
  const portfolioStats = {
    totalValue: portfolio.reduce((sum, share) => sum + share.currentValue, 0),
    totalInvested: portfolio.reduce((sum, share) => sum + share.purchasePrice, 0),
    totalReturns: portfolio.reduce((sum, share) => sum + (share.currentValue - share.purchasePrice), 0),
    listedShares: portfolio.filter(share => share.listedForSale).length,
    avgReturnRate: Math.round(portfolio.reduce((sum, share) => sum + share.returnRate, 0) / portfolio.length)
  };

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      <Container fluid className="py-4">
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
                    <h6 className="text-uppercase small text-muted">إجمالي العوائد</h6>
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
                    <h6 className="text-uppercase small text-muted">متوسط العائد</h6>
                    <h3 className="mb-0 text-warning">
                      {portfolioStats.avgReturnRate}%
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
                    <h6 className="text-uppercase small text-muted">الحصص المعروضة</h6>
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
                    <th>الصنف</th>
                    <th>عدد الحصص</th>
                    <th>سعر الشراء</th>
                    <th>القيمة الحالية</th>
                    <th>العوائد</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPortfolio.map((share, index) => (
                    <tr key={index} style={{ backgroundColor: '#252525' }}>
                      <td className="fw-bold">{share.name}</td>
                      <td>
                        <Badge bg="secondary">{share.category}</Badge>
                      </td>
                      <td>{share.shares}</td>
                      <td className="text-muted">{formatCurrency(share.purchasePrice)}</td>
                      <td className="fw-bold">{formatCurrency(share.currentValue)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2 text-success">+{share.returnRate}%</span>
                          <ProgressBar 
                            now={share.returnRate} 
                            variant="success" 
                            style={{ height: '8px', width: '100px' }} 
                          />
                        </div>
                      </td>
                      <td>
                        <Badge bg={share.status === 'نشط' ? 'success' : share.status === 'مكتمل' ? 'primary' : 'warning'}>
                          {share.status}
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
                      <span>أثاث</span>
                      <span>25%</span>
                    </div>
                    <ProgressBar variant="warning" now={25} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>بلاستيك</span>
                      <span>15%</span>
                    </div>
                    <ProgressBar variant="info" now={15} style={{ height: '10px' }} />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>إلكترونيات</span>
                      <span>35%</span>
                    </div>
                    <ProgressBar variant="primary" now={35} style={{ height: '10px' }} />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>ورق وطباعة</span>
                      <span>25%</span>
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
                      <div className="text-muted small">قيمة حالية: {formatCurrency(312500)}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                      <FaCoins size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="fw-bold">مصنع الورق الصحي</div>
                      <div className="text-success">+25% عائد</div>
                      <div className="text-muted small">قيمة حالية: {formatCurrency(375000)}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                      <FaCoins size={24} className="text-info" />
                    </div>
                    <div>
                      <div className="fw-bold">مصنع الأدوات الكهربائية</div>
                      <div className="text-success">+20% عائد</div>
                      <div className="text-muted small">قيمة حالية: {formatCurrency(420000)}</div>
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
                  <span>عدد الحصص:</span>
                  <span className="fw-bold">{selectedShare.shares}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>القيمة الحالية:</span>
                  <span className="fw-bold">{formatCurrency(selectedShare.currentValue)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>معدل العائد:</span>
                  <span className="text-success fw-bold">+{selectedShare.returnRate}%</span>
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
                    min={selectedShare.currentValue}
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  أدخل سعراً يساوي أو يزيد عن القيمة الحالية: {formatCurrency(selectedShare.currentValue)}
                </Form.Text>
              </Form.Group>
              
              <div className="alert alert-info bg-dark border-info">
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
            disabled={askPrice < selectedShare?.currentValue}
          >
            <FaDollarSign className="me-1" /> عرض للبيع
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvestmentPortfolio;