import { colors } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, ProgressBar, 
  Button, Badge, Form, InputGroup, Spinner, Accordion
} from 'react-bootstrap';
import { 
  FaMoneyBillWave, FaCalendarAlt, FaSearch, 
  FaFilter, FaFilePdf, FaSync, FaArrowUp,
  FaInfoCircle, FaCoins, FaChartLine, FaBuilding
} from 'react-icons/fa';

const InvestorDashboard = () => {
  // بيانات الاستثمارات والعوائد
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [timeFilter, setTimeFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  
  // الإحصائيات
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    projectedReturns: 0,
    activeInvestments: 0,
    lastReturn: 0
  });
  
  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      
      // بيانات وهمية للاستثمارات
      const mockInvestments = [
        {
          id: 'INV-2023-001',
          factory: 'مصنع الأثاث الحديث',
          category: 'أثاث',
          shares: 25,
          investedAmount: 250000,
          date: '2023-05-15',
          status: 'نشط',
          returns: [
            { date: '2023-06-30', amount: 31250 },
            { date: '2023-09-30', amount: 37500 },
            { date: '2023-12-31', amount: 43750 }
          ],
          projectedReturns: 62500
        },
        {
          id: 'INV-2023-002',
          factory: 'مصنع البلاستيك المتطور',
          category: 'بلاستيك',
          shares: 15,
          investedAmount: 150000,
          date: '2023-06-20',
          status: 'نشط',
          returns: [
            { date: '2023-07-31', amount: 15000 },
            { date: '2023-10-31', amount: 18000 }
          ],
          projectedReturns: 30000
        },
        {
          id: 'INV-2022-045',
          factory: 'مصنع الورق الصحي',
          category: 'ورق وطباعة',
          shares: 30,
          investedAmount: 300000,
          date: '2022-11-22',
          status: 'مكتمل',
          returns: [
            { date: '2023-01-31', amount: 37500 },
            { date: '2023-04-30', amount: 45000 },
            { date: '2023-07-31', amount: 52500 },
            { date: '2023-10-31', amount: 60000 }
          ],
          projectedReturns: 0
        },
        {
          id: 'INV-2023-015',
          factory: 'مصنع الأغذية المعلبة',
          category: 'أغذية ومشروبات',
          shares: 20,
          investedAmount: 200000,
          date: '2023-03-05',
          status: 'معلق',
          returns: [],
          projectedReturns: 50000
        },
        {
          id: 'INV-2023-078',
          factory: 'مصنع الأدوات الكهربائية',
          category: 'إلكترونيات',
          shares: 35,
          investedAmount: 350000,
          date: '2023-08-10',
          status: 'نشط',
          returns: [
            { date: '2023-09-30', amount: 43750 }
          ],
          projectedReturns: 87500
        }
      ];

      setInvestments(mockInvestments);
      setFilteredInvestments(mockInvestments);
      
      // حساب الإحصائيات
      const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
      const totalReturns = mockInvestments.reduce((sum, inv) => 
        sum + inv.returns.reduce((retSum, ret) => retSum + ret.amount, 0), 0);
      const projectedReturns = mockInvestments.reduce((sum, inv) => sum + inv.projectedReturns, 0);
      const activeInvestments = mockInvestments.filter(inv => inv.status === 'نشط').length;
      
      // الحصول على آخر عائد
      const allReturns = mockInvestments.flatMap(inv => inv.returns);
      const lastReturn = allReturns.length > 0 
        ? allReturns.sort((a, b) => new Date(b.date) - new Date(a.date))[0].amount
        : 0;
      
      setStats({
        totalInvested,
        totalReturns,
        projectedReturns,
        activeInvestments,
        lastReturn
      });
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // تصفية الاستثمارات
  useEffect(() => {
    let result = investments;
    
    // تطبيق تصفية البحث
    if (searchTerm) {
      result = result.filter(inv => 
        inv.factory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // تطبيق تصفية الحالة
    if (statusFilter !== 'الكل') {
      result = result.filter(inv => inv.status === statusFilter);
    }
    
    // تطبيق تصفية الوقت
    if (timeFilter === 'السنة الحالية') {
      const currentYear = new Date().getFullYear();
      result = result.filter(inv => new Date(inv.date).getFullYear() === currentYear);
    } else if (timeFilter === 'السنة الماضية') {
      const lastYear = new Date().getFullYear() - 1;
      result = result.filter(inv => new Date(inv.date).getFullYear() === lastYear);
    }
    
    setFilteredInvestments(result);
  }, [searchTerm, statusFilter, timeFilter, investments]);

  // تنسيق العملة
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  // الحصول على لون الحالة
  const getStatusBadge = (status) => {
    switch(status) {
      case 'نشط': return 'success';
      case 'مكتمل': return 'primary';
      case 'معلق': return 'warning';
      default: return 'secondary';
    }
  };

  // الحصول على لون الصنف
  const getCategoryColor = (category) => {
    const colors = {
      'أثاث': '#795548',
      'بلاستيك': '#ff9800',
      'ورق وطباعة': '#3f51b5',
      'أغذية ومشروبات': '#4caf50',
      'إلكترونيات': '#9c27b0',
      'أخرى': '#9e9e9e'
    };
    return colors[category] || '#9e9e9e';
  };

  // حساب إجمالي العوائد للاستثمار
  const getTotalReturns = (investment) => {
    return investment.returns.reduce((sum, ret) => sum + ret.amount, 0);
  };

  // حساب نسبة العائد
  const getReturnPercentage = (investment) => {
    const totalReturns = getTotalReturns(investment);
    return (totalReturns / investment.investedAmount) * 100;
  };

  // محاكاة تحديث البيانات
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
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
                <FaMoneyBillWave size={32} className="text-white" />
              </div>
              <div>
                <h1 className="fw-bold mb-0 text-light">تتبع العوائد المالية</h1>
                <p className="mb-0 text-light">مراقبة أرباح حصصك الاستثمارية في المصانع</p>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* بطاقات الإحصائيات السريعة */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small  text-light " >إجمالي الاستثمارات</h6>
                    <h3 className="mb-0 text-light">{formatCurrency(stats.totalInvested)}</h3>
                    <p className="mb-0 text-muted  text-light">ليرة سوري </p>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaBuilding size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small  text-light">العوائد المحققة</h6>
                    <h3 className="mb-0 text-success">{formatCurrency(stats.totalReturns)}</h3>
                    <p className="mb-0 text-light">ليرة سوري</p>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaCoins size={24} className="text-success" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small  text-light">العوائد المتوقعة</h6>
                    <h3 className="mb-0 text-warning">{formatCurrency(stats.projectedReturns)}</h3>
                    <p className="mb-0  text-light">ليرة  سوري</p>
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
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small  text-light">آخر عائد</h6>
                    <h3 className="mb-0 text-info">{formatCurrency(stats.lastReturn)}</h3>
                    <p className="mb-0  text-light">ليرة  سوري</p>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaMoneyBillWave size={24} className="text-info" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* معلومات العوائد */}
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="border-0 py-3" style={{ backgroundColor: '#2a2a2a' }}>
            <h5 className="mb-0 d-flex align-items-center text-light">
              <FaInfoCircle className="me-2 text-info" /> معلومات عن العوائد
            </h5>
          </Card.Header>
          <Card.Body>
            <div className="text-light">
              <p>
                العوائد المالية هي الأرباح التي تحصل عليها من استثماراتك في المصانع. يتم توزيع العوائد 
                بناءً على أداء المصنع وحصتك الاستثمارية. يمكن توزيع العوائد بشكل شهري، ربع سنوي، أو سنوي 
                حسب سياسة كل مصنع.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mt-4">
                <div className="d-flex align-items-center">
                  <Badge bg="success" className="me-2">نشط</Badge>
                  <span className=" text-light">استثمار قيد العمل ويحقق عوائد</span>
                </div>
                <div className="d-flex align-items-center">
                  <Badge bg="primary" className="me-2">مكتمل</Badge>
                  <span className=" text-light">استثمار انتهت مدته وحقق جميع عوائده</span>
                </div>
                <div className="d-flex align-items-center">
                  <Badge bg="warning" className="me-2">معلق</Badge>
                  <span className=" text-light">استثمار قيد المراجعة ولم يبدأ العمل بعد</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* أدوات التصفية والبحث */}
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-dark text-light border-secondary">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="ابحث باسم المصنع أو رقم الاستثمار..."
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
              
              <Col md={3}>
                <Form.Select 
                  value={timeFilter} 
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="الكل">كل الفترات</option>
                  <option value="السنة الحالية">السنة الحالية</option>
                  <option value="السنة الماضية">السنة الماضية</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* جدول الاستثمارات والعوائد */}
        <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="border-0 py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#2a2a2a' }}>
            <h5 className="mb-0 text-light">الاستثمارات والعوائد</h5>
            <div>
              <Button variant="outline-light" size="sm" className="me-2" onClick={refreshData}>
                <FaSync /> تحديث
              </Button>
              <Button variant="outline-primary" size="sm">
                <FaFilePdf /> تصدير
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-light">جاري تحميل بيانات الاستثمارات...</p>
              </div>
            ) : filteredInvestments.length > 0 ? (
              <Table hover responsive className="mb-0" variant="dark">
                <thead style={{ backgroundColor: '#2a2a2a' }}>
                  <tr>
                    <th className="text-light">رقم الاستثمار</th>
                    <th className="text-light">المصنع</th>
                    <th className="text-light">تاريخ الاستثمار</th>
                    <th className="text-light">مبلغ الاستثمار</th>
                    <th className="text-light">العوائد المحققة</th>
                    <th className="text-light">العوائد المتوقعة</th>
                    <th className="text-light">نسبة العائد</th>
                    <th className="text-light">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvestments.map((investment, index) => {
                    const totalReturns = getTotalReturns(investment);
                    const returnPercentage = getReturnPercentage(investment);
                    
                    return (
                      <tr key={index} style={{ backgroundColor: '#252525' }}>
                        <td className="fw-bold text-light">{investment.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <span 
                                className="d-inline-block rounded-circle"
                                style={{ 
                                  backgroundColor: getCategoryColor(investment.category),
                                  width: 10,
                                  height: 10
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-light">{investment.factory}</div>
                              <small className="text-muted">{investment.category}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-light">{formatDate(investment.date)}</td>
                        <td className="fw-bold text-light">{formatCurrency(investment.investedAmount)}</td>
                        <td className="text-success fw-bold">
                          {formatCurrency(totalReturns)}
                          {investment.returns.length > 0 && (
                            <div className="text-muted small">
                              آخر عائد: {formatDate(investment.returns[investment.returns.length - 1].date)}
                            </div>
                          )}
                        </td>
                        <td className={investment.projectedReturns > 0 ? "text-warning fw-bold" : "text-muted"}>
                          {formatCurrency(investment.projectedReturns)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              {returnPercentage > 0 ? (
                                <span className="text-success">
                                  <FaArrowUp /> +{returnPercentage.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-muted">0%</span>
                              )}
                            </div>
                            <div className="flex-grow-1">
                              <ProgressBar 
                                now={returnPercentage} 
                                variant={returnPercentage > 0 ? "success" : "secondary"} 
                                style={{ height: 8 }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(investment.status)}>
                            {investment.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5" style={{ backgroundColor: '#252525' }}>
                <div className="py-4">
                  <FaMoneyBillWave size={48} className="text-muted mb-3" />
                  <h5 className="text-light">لا توجد استثمارات مطابقة لمعايير البحث</h5>
                  <p className="text-muted">حاول تغيير معايير البحث أو أضف استثمارات جديدة</p>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
        
        {/* ملخص العوائد */}
        <Card className="border-0 shadow-sm mt-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="border-0 py-3" style={{ backgroundColor: '#2a2a2a' }}>
            <h5 className="mb-0 d-flex align-items-center text-light">
              <FaCoins className="me-2 text-warning" /> ملخص العوائد
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="border rounded p-3 mb-3" style={{ backgroundColor: '#252525' }}>
                  <h6 className="text-warning">العوائد القادمة</h6>
                  <ul className="text-light">
                    <li>مصنع الأثاث الحديث: 31 ديسمبر 2023 - {formatCurrency(43750)}</li>
                    <li>مصنع الأدوات الكهربائية: 31 ديسمبر 2023 - {formatCurrency(43750)}</li>
                    <li>مصنع البلاستيك المتطور: 31 ديسمبر 2023 - {formatCurrency(12000)}</li>
                  </ul>
                </div>
              </Col>
              <Col md={6}>
                <div className="border rounded p-3 mb-3" style={{ backgroundColor: '#252525' }}>
                  <h6 className="text-success">أفضل الاستثمارات أداءً</h6>
                  <ul className="text-light">
                    <li>مصنع الورق الصحي: عائد {formatCurrency(195000)} (65%)</li>
                    <li>مصنع الأثاث الحديث: عائد {formatCurrency(112500)} (45%)</li>
                    <li>مصنع الأدوات الكهربائية: عائد {formatCurrency(43750)} (12.5%)</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default InvestorDashboard;