// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Navbar, Nav } from 'react-bootstrap';
import { FaSearch, FaFilter, FaChartLine, FaFileExport, FaCog } from 'react-icons/fa';

const AdminReturnes = () => {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalReturns: 0,
    activeInvestments: 0
  });

  useEffect(() => {
    // Simulating API call to fetch investment data
    const mockInvestments = [
      { id: 1, factory: 'مصنع الأثاث الحديث', investor: 'عمر أحمد', amount: 250000, date: '2023-05-15', return: 312500, status: 'مكتمل', shares: 25 },
      { id: 2, factory: 'مصنع البلاستيك المتطور', investor: 'سارة محمد', amount: 150000, date: '2023-06-20', return: 180000, status: 'نشط', shares: 15 },
      { id: 3, factory: 'مصنع الأغذية الصحية', investor: 'خالد عبدالله', amount: 500000, date: '2023-04-10', return: 625000, status: 'مكتمل', shares: 50 },
      { id: 4, factory: 'مصنع الأدوات الكهربائية', investor: 'لمى سعيد', amount: 300000, date: '2023-07-05', return: 345000, status: 'نشط', shares: 30 },
      { id: 5, factory: 'مصنع المواد الكيميائية', investor: 'ناصر علي', amount: 750000, date: '2023-03-22', return: 900000, status: 'معلق', shares: 75 },
      { id: 6, factory: 'مصنع الورق والكرتون', investor: 'هناء فهد', amount: 200000, date: '2023-08-15', return: 230000, status: 'نشط', shares: 20 },
      { id: 7, factory: 'مصنع الأثاث الحديث', investor: 'طارق محمود', amount: 350000, date: '2023-02-18', return: 420000, status: 'مكتمل', shares: 35 },
      { id: 8, factory: 'مصنع الأغذية الصحية', investor: 'فاطمة خالد', amount: 100000, date: '2023-09-01', return: 115000, status: 'نشط', shares: 10 },
    ];

    setInvestments(mockInvestments);
    setFilteredInvestments(mockInvestments);
    
    // Calculate statistics
    const totalInvestments = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = mockInvestments.reduce((sum, inv) => sum + inv.return, 0);
    const activeInvestments = mockInvestments.filter(inv => inv.status === 'نشط').length;
    
    setStats({
      totalInvestments,
      totalReturns,
      activeInvestments
    });
  }, []);

  useEffect(() => {
    let result = investments;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(inv => 
        inv.factory.toLowerCase().includes(term) || 
        inv.investor.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(inv => inv.status === statusFilter);
    }
    
    setFilteredInvestments(result);
  }, [searchTerm, statusFilter, investments]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'نشط':
        return <Badge bg="success">{status}</Badge>;
      case 'مكتمل':
        return <Badge bg="primary">{status}</Badge>;
      case 'معلق':
        return <Badge bg="warning" text="dark">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      

      {/* Main Content */}
      <Container fluid className="mt-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">إدارة الاستثمارات والعوائد</h1>
            <p className="text-muted">مراجعة وتتبع جميع الاستثمارات في المصانع والعوائد المتحققة</p>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <Card.Title>إجمالي الاستثمارات</Card.Title>
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="stat-value">{formatCurrency(stats.totalInvestments)}</h2>
                  <div className="stat-icon bg-primary">
                    <FaChartLine size={24} />
                  </div>
                </div>
                <Card.Text className="text-muted">منذ بداية النظام</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <Card.Title>إجمالي العوائد</Card.Title>
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="stat-value">{formatCurrency(stats.totalReturns)}</h2>
                  <div className="stat-icon bg-success">
                    <FaChartLine size={24} />
                  </div>
                </div>
                <Card.Text className="text-muted">منذ بداية النظام</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <Card.Title>الاستثمارات النشطة</Card.Title>
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="stat-value">{stats.activeInvestments}</h2>
                  <div className="stat-icon bg-info">
                    <FaChartLine size={24} />
                  </div>
                </div>
                <Card.Text className="text-muted">استثمارات قيد التنفيذ</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control 
                    type="text" 
                    placeholder="بحث باسم المصنع أو المستثمر..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
              
              <Col md={3}>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaFilter />
                  </span>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">جميع الحالات</option>
                    <option value="نشط">نشط</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="معلق">معلق</option>
                  </Form.Select>
                </div>
              </Col>
              
              <Col md={3} className="d-flex justify-content-end">
                <Button variant="primary" className="me-2">
                  <FaFileExport className="me-1" /> تصدير البيانات
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Investments Table */}
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>المصنع</th>
                  <th>المستثمر</th>
                  <th>مبلغ الاستثمار</th>
                  <th>العائد</th>
                  <th>عدد الحصص</th>
                  <th>تاريخ الاستثمار</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.map(investment => (
                  <tr key={investment.id}>
                    <td>{investment.id}</td>
                    <td>{investment.factory}</td>
                    <td>{investment.investor}</td>
                    <td className="fw-bold">{formatCurrency(investment.amount)}</td>
                    <td className="text-success fw-bold">{formatCurrency(investment.return)}</td>
                    <td>{investment.shares}</td>
                    <td>{investment.date}</td>
                    <td>{getStatusBadge(investment.status)}</td>
                    <td>
                      <Button variant="outline-primary" size="sm">تفاصيل</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {filteredInvestments.length === 0 && (
              <div className="text-center py-5">
                <h5 className="text-muted">لا توجد استثمارات تطابق معايير البحث</h5>
              </div>
            )}
          </Card.Body>
        </Card>
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

export default AdminReturnes;