import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Spinner, 
  Alert, 
  Button, 
  Badge 
} from 'react-bootstrap';
import { FaMoneyBillWave, FaHistory, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminFinancialTransactions = () => {
  const auth = useAuth();
  const user = auth?.user;
  const token = user?.token || null;
  const logout = auth?.logout || (() => {});
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // ألوان التصميم
  const primaryColor = '#2A2C33';
  const cardBackground = '#3A3D46';
  const accentColor = '#FEDA6A';
  const textColor = '#E0E1E6';
  const mutedText = '#A0A2AA';

  // جلب بيانات العمليات المالية
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!token) {
        logout();
        navigate('/login');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/Transaction/index', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });console.log(response);
      

      setTransactions(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'حدث خطأ في جلب بيانات العمليات المالية');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  // تصفية العمليات حسب النوع
  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'الكل') return true;
    return transaction.type === filterType;
  });

  // تنسيق التاريخ للعرض
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // تحديد لون البادج حسب نوع العملية
  const getTypeBadge = (type) => {
    const typeMap = {
      'buy': 'success',
      'sell': 'danger',
      'deposit': 'primary',
      'withdraw': 'warning'
    };
    return typeMap[type] || 'secondary';
  };

  // تحديد نص العملية
  const getTypeText = (type) => {
    const typeText = {
      'buy': 'شراء',
      'sell': 'بيع',
      'deposit': 'إيداع',
      'withdraw': 'سحب'
    };
    return typeText[type] || type;
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <Button variant="link" onClick={() => navigate('/login')}>تسجيل الدخول</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ backgroundColor: primaryColor, minHeight: '100vh', color: textColor }}>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card style={{ backgroundColor: cardBackground, border: 'none' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary p-3 rounded me-3">
                    <FaMoneyBillWave size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 style={{ color: accentColor }}>العمليات المالية</h2>
                    <p className="mb-0 text-light">سجل جميع عملياتك المالية</p>
                  </div>
                </div>
                <Button 
                  variant="outline-primary" 
                  onClick={() => setShowFilters(!showFilters)}
                  style={{ color: textColor }}
                >
                  <FaFilter className="me-2" /> تصفية
                </Button>
              </div>

              {showFilters && (
                <div className="mb-4 p-3" style={{ backgroundColor: '#4A4D56', borderRadius: '8px' }}>
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ color: textColor }}>نوع العملية:</span>
                    <div className="btn-group" role="group">
                      {['الكل', 'buy', 'sell', 'deposit', 'withdraw'].map((type, index) => (
                        <Button
                          key={index}
                          variant={filterType === type ? 'primary' : 'outline-secondary'}
                          onClick={() => setFilterType(type)}
                          style={{ 
                            color: filterType === type ? '#fff' : textColor,
                            borderColor: mutedText
                          }}
                        >
                          {type === 'الكل' ? 'الكل' : getTypeText(type)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && <Alert variant="danger">{error}</Alert>}

              {filteredTransactions.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover variant="dark" style={{ color: textColor }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>نوع العملية</th>
                        <th>المبلغ</th>
                        <th>رقم الفرصة</th>
                        <th>تاريخ العملية</th>
                        <th>التاريخ</th>
                        <th>رقم  المعامل</th>

                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                          <td>{index + 1}</td>
                          <td>
                            <Badge bg={getTypeBadge(transaction.type)}>
                              {getTypeText(transaction.type)}
                            </Badge>
                          </td>
                          <td style={{ 
                            color: transaction.type === 'buy' || transaction.type === 'deposit' ? '#28a745' : '#dc3545',
                            fontWeight: 'bold'
                          }}>
                            {formatAmount(transaction.amount)} $
                          </td>
                          <td>{transaction.opprtunty_id}</td>
                          <td>{formatDate(transaction.time_operation)}</td>
                          <td>{formatDate(transaction.created_at)}</td>
                           <td>{transaction.user_id}</td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Card className="text-center py-5" style={{ backgroundColor: '#4A4D56' }}>
                  <Card.Body>
                    <FaHistory size={48} className="text-light mb-3" />
                    <h5 className="text-white">لا توجد عمليات مالية</h5>
                    <p className="text-muted">لم يتم العثور على أي عمليات مالية تطابق معايير البحث</p>
                  </Card.Body>
                </Card>
              )}

              <div className="mt-4 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-light">إجمالي العمليات: </span>
                  <span className="fw-bold text-white">{filteredTransactions.length}</span>
                </div>
                <div>
                  <span className="text-light me-3">إجمالي المبالغ: </span>
                  <span className="fw-bold text-white">
                    {formatAmount(filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0))} ر.س
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminFinancialTransactions;