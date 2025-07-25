import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, ProgressBar, Modal, InputGroup, Alert } from 'react-bootstrap';
import { FaCoins, FaChartLine, FaSearch, FaFilter, FaDollarSign, FaExchangeAlt, FaInfoCircle, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';

const MarketTrading = () => {
  // بيانات الحصص الاستثمارية
  const [marketShares, setMarketShares] = useState([
    {
      id: 'MS-101',
      factory: 'مصنع الورق الصحي',
      category: 'ورق وطباعة',
      shares: 30,
      currentValue: 300000,
      askingPrice: 330000,
      seller: 'محمد أحمد',
      returnRate: 22,
      timeLeft: '3 أيام'
    },
    {
      id: 'MS-102',
      factory: 'مصنع الأغذية المعلبة',
      category: 'أغذية ومشروبات',
      shares: 20,
      currentValue: 200000,
      askingPrice: 210000,
      seller: 'سارة عبدالله',
      returnRate: 18,
      timeLeft: '1 يوم'
    },
    {
      id: 'MS-103',
      factory: 'مصنع الألمنيوم الوطني',
      category: 'معدات وآلات',
      shares: 40,
      currentValue: 400000,
      askingPrice: 440000,
      seller: 'علي حسن',
      returnRate: 28,
      timeLeft: '5 أيام'
    }
  ]);

  // حالة البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  
  // حالة نافذة الشراء
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedShare, setSelectedShare] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // تنسيق العملة
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // فتح نافذة الشراء
  const handleBuyClick = (share) => {
    setSelectedShare(share);
    setShowBuyModal(true);
    setPurchaseSuccess(false);
  };

  // تأكيد عملية الشراء
  const confirmPurchase = () => {
    if (!agreeTerms) {
      alert('يجب الموافقة على الشروط والأحكام أولاً');
      return;
    }
    
    // محاكاة عملية الشراء
    setTimeout(() => {
      setPurchaseSuccess(true);
      
      // بعد 2 ثانية، إغلاق النافذة وتحديث البيانات
      setTimeout(() => {
        setMarketShares(marketShares.filter(s => s.id !== selectedShare.id));
        setShowBuyModal(false);
        setPurchaseSuccess(false);
      }, 2000);
    }, 1000);
  };

  // تصفية الحصص
  const filteredMarketShares = marketShares.filter(share => {
    return (
      (share.factory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      share.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      categoryFilter === 'الكل' || share.category === categoryFilter
    ));
  });

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
                <FaExchangeAlt size={32} className="text-white" />
              </div>
              <div>
                <h1 className="fw-bold mb-0 text-light">سوق تداول الحصص الاستثمارية</h1>
                <p className="mb-0 text-light">شراء وبيع الحصص الاستثمارية في المصانع بكل سهولة</p>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* إحصائيات السوق */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">إجمالي الحصص المتاحة</h6>
                    <h3 className="mb-0 text-light">
                      {marketShares.length}
                    </h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaCoins size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">متوسط سعر الطلب</h6>
                    <h3 className="mb-0 text-warning">
                      {marketShares.length > 0 ? 
                        formatCurrency(
                          marketShares.reduce((sum, share) => sum + share.askingPrice, 0) / marketShares.length
                        ) : 
                        '$0'}
                    </h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <FaDollarSign size={24} className="text-warning" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">متوسط العائد</h6>
                    <h3 className="mb-0 text-success">
         {Math.round(marketShares.reduce((sum, share) => sum + share.returnRate, 0) / marketShares.length)}%
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
        
        {/* سوق التداول */}
        <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="border-0 py-3" style={{ backgroundColor: '#2a2a2a' }}>
            <Row className="align-items-center">
              <Col md={6}>
                <h5 className="mb-0 text-light">
                  <FaExchangeAlt className="me-2 text-primary" /> جميع الحصص المتاحة للتداول
                </h5>
              </Col>
              <Col md={6}>
                <Row className="g-2">
                  <Col md={8}>
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
                  <Col md={4}>
                    <Form.Select 
                      value={categoryFilter} 
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-dark text-light border-secondary"
                    >
                      <option value="الكل">كل الأصناف</option>
                      <option value="ورق وطباعة">ورق وطباعة</option>
                      <option value="أغذية ومشروبات">أغذية ومشروبات</option>
                      <option value="معدات وآلات">معدات وآلات</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredMarketShares.length > 0 ? (
              <Table hover responsive className="mb-0 text-light">
                <thead style={{ backgroundColor: '#2a2a2a' }}>
                  <tr>
                    <th>المصنع</th>
                    <th>الصنف</th>
                    <th>البائع</th>
                    <th>نسبة الحصة</th>
                    <th>القيمة السوقية</th>
                    <th>سعر الطلب</th>
                    <th>معدل العائد</th>
                    <th>الوقت المتبقي</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarketShares.map((share, index) => (
                    <tr key={index} style={{ backgroundColor: '#252525' }}>
                      <td className="fw-bold">{share.factory}</td>
                      <td>
                        <Badge bg="secondary">{share.category}</Badge>
                      </td>
                      <td>{share.seller}</td>
                      <td>{share.shares}%</td>
                      <td>{formatCurrency(share.currentValue)}</td>
                      <td className="fw-bold text-warning">{formatCurrency(share.askingPrice)}</td>
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
                        <Badge bg="danger">{share.timeLeft}</Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleBuyClick(share)}
                        >
                          <FaShoppingCart className="me-1" /> شراء
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5" style={{ backgroundColor: '#252525' }}>
                <FaInfoCircle size={48} className="text-white mb-3" />
                <h5 className="text-light">لا توجد حصص مطابقة لمعايير البحث</h5>
                <p className="text-white">حاول تغيير معايير البحث أو عد لاحقاً</p>
              </div>
            )}
          </Card.Body>
        </Card>

          
        {/* معلومات إضافية */}
        <Container className="mt-5">
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1e1e1e' }}>
                <Card.Header className="border-0 py-3" style={{ backgroundColor: '#2a2a2a' }}>
                  <h5 className="mb-0 d-flex align-items-center text-light">
                    <FaInfoCircle className="me-2 text-info" /> كيف يعمل سوق التداول؟
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-4">
                      <div className="d-flex">
                        <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                          <FaExchangeAlt size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="text-light">البحث والاختيار</h6>
                          <p className="text-white mb-0">
                            تصفح الحصص المتاحة باستخدام فلاتر البحث واختر ما يناسب استثماراتك
                          </p>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={4} className="mb-4">
                      <div className="d-flex">
                        <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                          <FaShoppingCart size={24} className="text-success" />
                        </div>
                        <div>
                          <h6 className="text-light">عملية الشراء</h6>
                          <p className="text-white mb-0">
                            اضغط على زر الشراء وأكمل عملية الدفع لتصبح مالكاً للحصة
                          </p>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={4} className="mb-4">
                      <div className="d-flex">
                        <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                          <FaDollarSign size={24} className="text-warning" />
                        </div>
                        <div>
                          <h6 className="text-light">الملكية والتحويل</h6>
                          <p className="text-white mb-0">
                            تنتقل ملكية الحصة إلى محفظتك فور إتمام عملية الشراء
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
      
      {/* فوائد التداول */}
      <Container className="mt-5">
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Header className="border-0 py-3" style={{ backgroundColor: '#2a2a2a' }}>
                <h5 className="mb-0 d-flex align-items-center text-light">
                  <FaInfoCircle className="me-2 text-info" /> فوائد تداول الحصص الاستثمارية
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="mb-4">
                    <div className="d-flex">
                      <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                        <FaExchangeAlt size={24} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="text-light">سيولة مالية</h6>
                        <p className="text-white mb-0">
                          تحويل استثماراتك إلى سيولة نقدية عند الحاجة
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4} className="mb-4">
                    <div className="d-flex">
                      <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                        <FaChartLine size={24} className="text-success" />
                      </div>
                      <div>
                        <h6 className="text-light">تنويع المحفظة</h6>
                        <p className="text-white mb-0">
                          شراء حصص في مشاريع جديدة لتحقيق التوازن
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4} className="mb-4">
                    <div className="d-flex">
                      <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                        <FaDollarSign size={24} className="text-warning" />
                      </div>
                      <div>
                        <h6 className="text-light">تحقيق أرباح</h6>
                        <p className="text-white mb-0">
                          بيع الحصص بعد ارتفاع قيمتها لتحقيق أرباح سريعة
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4} className="mb-4">
                    <div className="d-flex">
                      <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                        <FaCoins size={24} className="text-info" />
                      </div>
                      <div>
                        <h6 className="text-light">دخل شهري</h6>
                        <p className="text-white mb-0">
                          تحقيق عوائد شهرية من أرباح المصانع
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4} className="mb-4">
                    <div className="d-flex">
                      <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                        <FaFilter size={24} className="text-danger" />
                      </div>
                      <div>
                        <h6 className="text-light">شفافية كاملة</h6>
                        <p className="text-white mb-0">
                          بيانات واضحة ومحدثة عن أداء المصانع
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4} className="mb-4">
                    <div className="d-flex">
                      <div className="bg-purple bg-opacity-10 p-3 rounded me-3">
                        <FaSearch size={24} />
                      </div>
                      <div>
                        <h6 className="text-light">سهولة التداول</h6>
                        <p className="text-white mb-0">
                          منصة سهلة الاستخدام لبيع وشراء الحصص
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      


        {/* نافذة شراء الحصة */}
        <Modal
          show={showBuyModal}
          onHide={() => setShowBuyModal(false)}
          size="lg"
          centered
          backdrop="static"
          className="text-right"
        >
          <Modal.Header closeButton style={{ backgroundColor: '#2a2a2a', color: '#e0e0e0' }}>
            <Modal.Title>
              {purchaseSuccess ? 'تمت العملية بنجاح' : 'تأكيد عملية الشراء'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1e1e1e', color: '#e0e0e0' }}>
            {purchaseSuccess ? (
              <div className="text-center py-4">
                <FaCheckCircle size={80} className="text-success mb-4" />
                <h4 className="text-success">تم شراء الحصة بنجاح!</h4>
                <p className="text-light mt-3">
                  تمت عملية شراء حصة <strong>{selectedShare?.factory}</strong> بقيمة{' '}
                  <strong className="text-warning">{selectedShare && formatCurrency(selectedShare.askingPrice)}</strong>
                </p>
              </div>
            ) : (
              selectedShare && (
                <div>
                  <h5 className="mb-4">تفاصيل الحصة</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <p><strong>المصنع:</strong> {selectedShare.factory}</p>
                      <p><strong>الصنف:</strong> {selectedShare.category}</p>
                      <p><strong>البائع:</strong> {selectedShare.seller}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>نسبة الحصة:</strong> {selectedShare.shares}%</p>
                      <p><strong>القيمة السوقية:</strong> {formatCurrency(selectedShare.currentValue)}</p>
                      <p className="text-warning"><strong>سعر الطلب:</strong> {formatCurrency(selectedShare.askingPrice)}</p>
                    </Col>
                  </Row>

                  <hr className="my-4" />



                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="agree-terms"
                      label="أوافق على الشروط والأحكام وسياسة الخصوصية"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="text-light"
                    />
                  </Form.Group>

                  <Alert variant="info" className="mt-4">
                    <FaInfoCircle className="me-2" />
                    سيتم خصم المبلغ من حسابك فور تأكيد العملية
                  </Alert>
                </div>
              )
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#2a2a2a' }}>
            {!purchaseSuccess && (
              <>
                <Button variant="secondary" onClick={() => setShowBuyModal(false)}>
                  إلغاء
                </Button>
                <Button variant="success" onClick={confirmPurchase}>
                  تأكيد الشراء
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default MarketTrading;