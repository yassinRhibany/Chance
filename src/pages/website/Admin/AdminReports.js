// src/components/ReportsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Table, Navbar, Nav, Badge } from 'react-bootstrap';
import { 
  FaUsers, 
  FaBriefcase, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaChartBar, 
  FaCalendarAlt,
  FaFileExport,
  FaArrowLeft,
  FaUser,
  FaIndustry
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    totalInvestedAmount: 0,
    totalReturnsPaid: 0,
    activeUsers: 0,
    completedOpportunities: 0,
    monthlyStats: [],
    topFactories: [],
    topInvestors: []
  });

  const [timeRange, setTimeRange] = useState('yearly');
  
  useEffect(() => {
    // Simulating API call to fetch report data
    const mockData = {
      totalUsers: 1250,
      totalOpportunities: 42,
      totalInvestedAmount: 18500000,
      totalReturnsPaid: 23150000,
      activeUsers: 843,
      completedOpportunities: 28,
      monthlyStats: [
        { month: 'يناير', investments: 2500000, returns: 3125000 },
        { month: 'فبراير', investments: 1800000, returns: 2250000 },
        { month: 'مارس', investments: 3200000, returns: 4000000 },
        { month: 'أبريل', investments: 2100000, returns: 2625000 },
        { month: 'مايو', investments: 2800000, returns: 3500000 },
        { month: 'يونيو', investments: 3500000, returns: 4375000 },
        { month: 'يوليو', investments: 4100000, returns: 5125000 },
        { month: 'أغسطس', investments: 3800000, returns: 4750000 },
        { month: 'سبتمبر', investments: 4200000, returns: 5250000 },
        { month: 'أكتوبر', investments: 3900000, returns: 4875000 },
        { month: 'نوفمبر', investments: 4500000, returns: 5625000 },
        { month: 'ديسمبر', investments: 5000000, returns: 6250000 },
      ],
      topFactories: [
        { name: 'مصنع الأثاث الحديث', investments: 8500000, returns: 10625000 },
        { name: 'مصنع البلاستيك المتطور', investments: 4200000, returns: 5250000 },
        { name: 'مصنع الأغذية الصحية', investments: 3800000, returns: 4750000 },
        { name: 'مصنع الأدوات الكهربائية', investments: 2000000, returns: 2500000 }
      ],
      topInvestors: [
        { name: 'عمر أحمد', investments: 1250000, returns: 1562500 },
        { name: 'سارة محمد', investments: 950000, returns: 1187500 },
        { name: 'خالد عبدالله', investments: 850000, returns: 1062500 },
        { name: 'لمى سعيد', investments: 750000, returns: 937500 },
        { name: 'ناصر علي', investments: 650000, returns: 812500 }
      ]
    };

    setReportData(mockData);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const getChartData = () => {
    if (timeRange === 'yearly') {
      return reportData.monthlyStats;
    }
    
    // For quarterly or monthly data we would fetch from API
    // Here we'll just return a subset for demo
    return reportData.monthlyStats.slice(0, timeRange === 'quarterly' ? 3 : 1);
  };

  const chartData = getChartData();

  // Find max value for chart scaling
  const maxValue = Math.max(
    ...chartData.map(item => Math.max(item.investments, item.returns))
  );

  return (
    <div className="reports-page">
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <FaChartBar className="me-2" />
            التقارير الإجمالية
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">الاستثمارات</Nav.Link>
              <Nav.Link active>التقارير</Nav.Link>
              <Nav.Link>المستخدمين</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center">
              <Button variant="outline-light" className="me-2">
                <FaFileExport className="me-1" /> تصدير
              </Button>
              <Button variant="outline-light" as={Link} to="/">
                <FaArrowLeft className="me-1" /> رجوع
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="mt-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">التقارير الإجمالية</h1>
            <p className="text-muted">نظرة شاملة على أداء النظام والاستثمارات</p>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="stat-icon bg-primary">
                    <FaUsers size={20} />
                  </div>
                  <Card.Title className="mb-0">المستخدمين</Card.Title>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <h2 className="stat-value">{formatNumber(reportData.totalUsers)}</h2>
                    <p className="mb-0 text-muted">إجمالي المستخدمين</p>
                  </div>
                  <Badge bg="success" className="fs-6">
                    {reportData.activeUsers} نشطين
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="stat-icon bg-success">
                    <FaBriefcase size={20} />
                  </div>
                  <Card.Title className="mb-0">الفرص الاستثمارية</Card.Title>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <h2 className="stat-value">{formatNumber(reportData.totalOpportunities)}</h2>
                    <p className="mb-0 text-muted">فرصة استثمارية</p>
                  </div>
                  <Badge bg="primary" className="fs-6">
                    {reportData.completedOpportunities} مكتملة
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="stat-icon bg-info">
                    <FaMoneyBillWave size={20} />
                  </div>
                  <Card.Title className="mb-0">إجمالي الاستثمارات</Card.Title>
                </div>
                <h2 className="stat-value">{formatCurrency(reportData.totalInvestedAmount)}</h2>
                <p className="mb-0 text-muted">ريال سعودي</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="stat-card shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="stat-icon bg-warning">
                    <FaChartLine size={20} />
                  </div>
                  <Card.Title className="mb-0">العوائد المدفوعة</Card.Title>
                </div>
                <h2 className="stat-value">{formatCurrency(reportData.totalReturnsPaid)}</h2>
                <p className="mb-0 text-muted">ريال سعودي</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">تطور الاستثمارات والعوائد</h5>
                <div>
                  <Button 
                    variant={timeRange === 'monthly' ? 'primary' : 'outline-primary'} 
                    size="sm" 
                    className="me-2"
                    onClick={() => setTimeRange('monthly')}
                  >
                    شهري
                  </Button>
                  <Button 
                    variant={timeRange === 'quarterly' ? 'primary' : 'outline-primary'} 
                    size="sm" 
                    className="me-2"
                    onClick={() => setTimeRange('quarterly')}
                  >
                    ربع سنوي
                  </Button>
                  <Button 
                    variant={timeRange === 'yearly' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => setTimeRange('yearly')}
                  >
                    سنوي
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="chart-container">
                  {chartData.map((item, index) => (
                    <div key={index} className="chart-row mb-3">
                      <div className="chart-label text-end pe-2" style={{ width: '100px' }}>
                        {item.month}
                      </div>
                      <div className="chart-bars flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <span className="chart-legend bg-primary me-2"></span>
                          <small className="me-2">الاستثمارات</small>
                          <span className="text-primary fw-bold">{formatCurrency(item.investments)}</span>
                        </div>
                        <ProgressBar 
                          now={(item.investments / maxValue) * 100} 
                          variant="primary" 
                          className="mb-2"
                          style={{ height: '10px' }}
                        />
                        
                        <div className="d-flex align-items-center mb-1">
                          <span className="chart-legend bg-success me-2"></span>
                          <small className="me-2">العوائد</small>
                          <span className="text-success fw-bold">{formatCurrency(item.returns)}</span>
                        </div>
                        <ProgressBar 
                          now={(item.returns / maxValue) * 100} 
                          variant="success" 
                          style={{ height: '10px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-white">
                <h5 className="mb-0">أعلى المصانع أداءً</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>المصنع</th>
                      <th className="text-end">الاستثمارات</th>
                      <th className="text-end">العوائد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topFactories.map((factory, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <FaIndustry className="text-primary" />
                            </div>
                            <span>{factory.name}</span>
                          </div>
                        </td>
                        <td className="text-end text-primary fw-bold">{formatCurrency(factory.investments)}</td>
                        <td className="text-end text-success fw-bold">{formatCurrency(factory.returns)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Reports */}
        <Row>
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">أفضل المستثمرين</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>المستثمر</th>
                      <th className="text-end">الاستثمارات</th>
                      <th className="text-end">العوائد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topInvestors.map((investor, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <FaUser className="text-info" />
                            </div>
                            <span>{investor.name}</span>
                          </div>
                        </td>
                        <td className="text-end text-primary fw-bold">{formatCurrency(investor.investments)}</td>
                        <td className="text-end text-success fw-bold">{formatCurrency(investor.returns)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">مؤشرات الأداء</h5>
              </Card.Header>
              <Card.Body>
                <div className="kpi-card mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>نسبة نجاح الفرص الاستثمارية</span>
                    <span className="fw-bold">87.5%</span>
                  </div>
                  <ProgressBar now={87.5} variant="success" />
                </div>
                
                <div className="kpi-card mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>متوسط العائد على الاستثمار</span>
                    <span className="fw-bold">25%</span>
                  </div>
                  <ProgressBar now={25} variant="info" />
                </div>
                
                <div className="kpi-card mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>نمو المستخدمين (آخر 3 أشهر)</span>
                    <span className="fw-bold">12.8%</span>
                  </div>
                  <ProgressBar now={12.8} variant="primary" />
                </div>
                
                <div className="kpi-card">
                  <div className="d-flex justify-content-between mb-1">
                    <span>نسبة إكمال الاستثمارات</span>
                    <span className="fw-bold">95.2%</span>
                  </div>
                  <ProgressBar now={95.2} variant="warning" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="mt-5 py-3 bg-light text-center">
        <Container>
          <p className="mb-0 text-muted">© 2023 نظام إدارة استثمارات المصانع. جميع الحقوق محفوظة.</p>
        </Container>
      </footer>
    </div>
  );
};

export default ReportsPage;