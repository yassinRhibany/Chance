import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  Form, 
  Button, 
  Badge, 
  Pagination, 
  Row, 
  Col, 
  Spinner, 
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const colors = {
    primary: '#3498db',
    dark: '#2c3e50',
    light: '#ecf0f1'
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://127.0.0.1:8000/api/User/getUsers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && Array.isArray(response.data)) {
          const formattedUsers = response.data.map(user => ({
            id: user.id,
            name: user.name || 'غير معروف',
            email: user.email || 'غير متوفر',
            role: user.role === 1 ? 'مستثمر' : 'صاحب مصنع',
            status: user.status || 'active',
            wallet: user.wallet ? `${parseFloat(user.wallet).toFixed(2)}` : '0.00'
          }));

          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
        } else {
          throw new Error('تنسيق البيانات غير متوقع');
        }
      } catch (err) {
        console.error('حدث خطأ أثناء جلب المستخدمين:', err);
        setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب بيانات المستخدمين');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }

    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleEditUser = (userId) => {
    navigate(`/Admin/UserDetailsPage/${userId}`);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">جاري تحميل البيانات...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>حدث خطأ!</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 style={{ color: colors.dark }}>
              <i className="bi bi-people-fill me-2"></i>
              إدارة المستخدمين
            </h2>
            <p className="text-muted">
              إجمالي المستخدمين: {filteredUsers.length}
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Button variant="primary" className="me-2">
              <i className="bi bi-plus-circle"></i> إضافة مستخدم
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="searchUsers">
              <Form.Control
                type="text"
                placeholder="ابحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: colors.primary }}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead style={{ backgroundColor: colors.light }}>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>نوع المستخدم</th>
                <th>رصيد المحفظة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.wallet} ر.س</td>
                    <td>
                      <Badge 
                        bg={user.status === 'active' ? 'success' : 'danger'}
                        style={{ fontSize: '0.9rem' }}
                      >
                        {user.status === 'active' ? 'نشط' : 'موقوف'}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <i className="bi bi-pencil"></i> تعديل
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: colors.warning }}></i>
                    <h4 className="mt-3">لا توجد نتائج</h4>
                    <p className="text-muted">لم يتم العثور على مستخدمين مطابقين لبحثك</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Pagination>
          </div>
        )}
      </Container>
    </Container>
  );
};

export default AdminUsersPage;