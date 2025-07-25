import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, ProgressBar, 
  Button, Badge, Form, InputGroup, Spinner, Alert
} from 'react-bootstrap';
import { 
  FaMoneyBillWave, FaCalendarAlt, FaSearch, 
  FaFilter, FaFilePdf, FaSync, FaArrowUp,
  FaInfoCircle, FaCoins, FaChartLine, FaBuilding
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const TrackReturnes = () => {
  const { user } = useAuth();
  const token = user?.token || null;
  
  // State for investments and filters
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [timeFilter, setTimeFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Statistics state
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    projectedReturns: 0,
    activeInvestments: 0,
    lastReturn: 0
  });

  // Fetch returns data from API
  const fetchReturnsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/api/Returns/getUserReturns',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data); // Log for debugging

      // Check if response.data exists
      if (!response.data) {
        throw new Error('لا توجد بيانات في استجابة الخادم');
      }

      // Handle server error messages
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Check if data is in response.data.data or response.data directly
      const responseData = response.data.data || response.data;

      // If data is empty but request was successful
      if (!responseData) {
        setInvestments([]);
        setFilteredInvestments([]);
        calculateStats([]);
        return;
      }

      // Handle case where data might be an object that needs to be converted to array
      let returnsData = [];
      if (Array.isArray(responseData)) {
        returnsData = responseData;
      } else if (typeof responseData === 'object') {
        returnsData = [responseData];
      } else {
        throw new Error('صيغة البيانات غير متوقعة من الخادم');
      }

      // Format the data
      const formattedInvestments = returnsData.map((item, index) => ({
        id: item.id?.toString() || `temp-${index}`,
        factory: item.factory_name || item.factoryName || item.factory?.name || 'غير محدد',
        category: item.category || item.factory?.category || 'أخرى',
        shares: item.shares || 0,
        investedAmount: parseFloat(item.invested_amount || item.investedAmount || 0),
        date: item.investment_date || item.date || 'غير محدد',
        status: getStatusText(item.status || item.investment_status),
        returns: Array.isArray(item.returns) ? item.returns.map(ret => ({
          date: ret.return_date || ret.date,
          amount: parseFloat(ret.amount || 0)
        })) : [],
        projectedReturns: parseFloat(item.projected_returns || item.projectedReturns || 0)
      }));

      setInvestments(formattedInvestments);
      setFilteredInvestments(formattedInvestments);
      calculateStats(formattedInvestments);
    } catch (err) {
      console.error('Error fetching returns data:', err);
      setError(err.response?.data?.message || 
               err.response?.data?.error || 
               err.message || 
               'حدث خطأ في جلب بيانات العوائد');
      setInvestments([]);
      setFilteredInvestments([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert status to Arabic text
  const getStatusText = (status) => {
    if (!status) return 'غير محدد';
    
    status = status.toLowerCase();
    switch(status) {
      case 'active':
      case 'نشط':
        return 'نشط';
      case 'completed':
      case 'مكتمل':
        return 'مكتمل';
      case 'pending':
      case 'معلق':
        return 'معلق';
      default:
        return status;
    }
  };

  // Calculate statistics
  const calculateStats = (investmentsData) => {
    if (!investmentsData || investmentsData.length === 0) {
      setStats({
        totalInvested: 0,
        totalReturns: 0,
        projectedReturns: 0,
        activeInvestments: 0,
        lastReturn: 0
      });
      return;
    }

    const totalInvested = investmentsData.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
    const totalReturns = investmentsData.reduce((sum, inv) => 
      sum + (inv.returns?.reduce((retSum, ret) => retSum + (ret.amount || 0), 0) || 0), 0);
    const projectedReturns = investmentsData.reduce((sum, inv) => sum + (inv.projectedReturns || 0), 0);
    const activeInvestments = investmentsData.filter(inv => inv.status === 'نشط').length;
    
    const allReturns = investmentsData.flatMap(inv => inv.returns || []);
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
  };

  // Format currency (SYP)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'غير محدد') return 'غير محدد';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ar-SA', options);
    } catch {
      return dateString;
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'نشط': return 'success';
      case 'مكتمل': return 'primary';
      case 'معلق': return 'warning';
      default: return 'secondary';
    }
  };

  // Get category color
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

  // Calculate total returns for an investment
  const getTotalReturns = (investment) => {
    if (!investment.returns) return 0;
    return investment.returns.reduce((sum, ret) => sum + (ret.amount || 0), 0);
  };

  // Calculate return percentage
  const getReturnPercentage = (investment) => {
    const totalReturns = getTotalReturns(investment);
    const investedAmount = investment.investedAmount || 1; // Avoid division by zero
    return (totalReturns / investedAmount) * 100;
  };

  // Refresh data
  const refreshData = () => {
    fetchReturnsData();
  };

  // Apply filters
  useEffect(() => {
    let result = investments;
    
    if (searchTerm) {
      result = result.filter(inv => 
        (inv.factory?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (inv.id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'الكل') {
      result = result.filter(inv => inv.status === statusFilter);
    }
    
    if (timeFilter === 'السنة الحالية') {
      const currentYear = new Date().getFullYear();
      result = result.filter(inv => {
        try {
          return new Date(inv.date).getFullYear() === currentYear;
        } catch {
          return false;
        }
      });
    } else if (timeFilter === 'السنة الماضية') {
      const lastYear = new Date().getFullYear() - 1;
      result = result.filter(inv => {
        try {
          return new Date(inv.date).getFullYear() === lastYear;
        } catch {
          return false;
        }
      });
    }
    
    setFilteredInvestments(result);
    calculateStats(result);
  }, [searchTerm, statusFilter, timeFilter, investments]);

  // Initial data fetch
  useEffect(() => {
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      setIsLoading(false);
      return;
    }
    fetchReturnsData();
  }, [token]);

  // Loading state
  if (isLoading && investments.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#121212', 
        color: '#e0e0e0',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Spinner animation="border" variant="primary" />
        <span className="mt-3">جاري تحميل البيانات...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#121212', 
        color: '#e0e0e0',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Alert variant="danger" className="text-center" style={{ maxWidth: '500px' }}>
          <FaInfoCircle className="mb-2" size={24} />
          <h5>حدث خطأ</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={refreshData}>
              <FaSync className="me-2" /> إعادة المحاولة
            </Button>
          </div>
        </Alert>
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
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={12} lg={6} xl={3} className="mb-3">
            <Card className="h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">إجمالي الاستثمارات</h6>
                    <h4 className="mb-0">{formatCurrency(stats.totalInvested)}</h4>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaMoneyBillWave size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={12} lg={6} xl={3} className="mb-3">
            <Card className="h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">إجمالي العوائد</h6>
                    <h4 className="mb-0">{formatCurrency(stats.totalReturns)}</h4>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaCoins size={24} className="text-success" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={12} lg={6} xl={3} className="mb-3">
            <Card className="h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">العوائد المتوقعة</h6>
                    <h4 className="mb-0">{formatCurrency(stats.projectedReturns)}</h4>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <FaChartLine size={24} className="text-warning" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={12} lg={6} xl={3} className="mb-3">
            <Card className="h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">الاستثمارات النشطة</h6>
                    <h4 className="mb-0">{stats.activeInvestments}</h4>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaBuilding size={24} className="text-info" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card className="mb-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={6} lg={4} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: '#121212', borderColor: '#333', color: '#e0e0e0' }}>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="ابحث بالاسم أو الرقم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ backgroundColor: '#121212', borderColor: '#333', color: '#e0e0e0' }}
                  />
                </InputGroup>
              </Col>
              
              <Col md={6} lg={4} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: '#121212', borderColor: '#333', color: '#e0e0e0' }}>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ backgroundColor: '#121212', borderColor: '#333', color: '#e0e0e0' }}
                  >
                    <option value="الكل">حالة الاستثمار: الكل</option>
                    <option value="نشط">نشط</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="معلق">معلق</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: '#121212', borderColor: '#333', color: '#e0e0e0' }}>
                    <FaCalendarAlt />
                  </InputGroup.Text>
                  <Form.Select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    style={{ backgroundColor: '#121212', borderColor: '#333', color: '#e0e0e0' }}
                  >
                    <option value="الكل">الفترة الزمنية: الكل</option>
                    <option value="السنة الحالية">السنة الحالية</option>
                    <option value="السنة الماضية">السنة الماضية</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Investments Table */}
        <Card style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">سجل العوائد</h5>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">
                <FaFilePdf className="me-1" /> تصدير PDF
              </Button>
              <Button variant="outline-primary" size="sm" onClick={refreshData}>
                <FaSync className="me-1" /> تحديث
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body>
            {filteredInvestments.length === 0 ? (
              <div className="text-center py-5">
                <FaInfoCircle size={48} className="text-muted mb-3" />
                <h5>لا توجد استثمارات متاحة</h5>
                <p className="text-muted">لا توجد بيانات استثمارية لعرضها حسب معايير البحث المحددة</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover borderless className="mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>المصنع</th>
                      <th>التصنيف</th>
                      <th>تاريخ الاستثمار</th>
                      <th>المبلغ المستثمر</th>
                      <th>إجمالي العوائد</th>
                      <th>النسبة</th>
                      <th>الحالة</th>
                      <th>التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.map((investment, index) => (
                      <tr key={index}>
                        <td>{investment.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="me-2 rounded-circle" 
                              style={{
                                width: '12px', 
                                height: '12px', 
                                backgroundColor: getCategoryColor(investment.category)
                              }}
                            ></div>
                            {investment.factory}
                          </div>
                        </td>
                        <td>{investment.category}</td>
                        <td>{formatDate(investment.date)}</td>
                        <td>{formatCurrency(investment.investedAmount)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaArrowUp className="text-success me-1" />
                            {formatCurrency(getTotalReturns(investment))}
                          </div>
                        </td>
                        <td>
                          <ProgressBar 
                            now={getReturnPercentage(investment)} 
                            label={`${getReturnPercentage(investment).toFixed(1)}%`} 
                            variant="success"
                            style={{ height: '20px' }}
                          />
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(investment.status)}>
                            {investment.status}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-info" size="sm">
                            عرض التفاصيل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TrackReturnes;