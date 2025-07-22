import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Form, Button, Card, Row, Col, Spinner, Alert, Badge 
} from 'react-bootstrap';
import axios from 'axios';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const primaryDark = '#2A2C33';
  const cardBackground = '#3A3D46';
  const accent = '#FEDA6A';
  const lightText = '#E0E1E6';
  const mutedText = '#A0A2AA';
  const borderColor = '#4A4D56';
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  // دالة لاستعادة التوكن من localStorage أو من حالة المستخدم
  const getAuthToken = () => {
    const token = localStorage.getItem('token') || (user && user.token);
    if (!token) {
      navigate('/login');
      throw new Error('لم يتم العثور على رمز المصادقة');
    }
    return token;
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        const response = await axios.get('http://127.0.0.1:8000/api/User/showProfile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const userData = response.data;
        
        // حفظ التوكن في حالة المستخدم للاستخدام لاحقاً
        setUser({ ...userData, token });
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          password_confirmation: ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء تحميل بيانات المستخدم');
        setLoading(false);
        
        // إذا كان الخطأ متعلقاً بالمصادقة، توجيه إلى صفحة تسجيل الدخول
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    fetchUser();
  }, [userId, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const token = getAuthToken();
      
      // تحضير البيانات للإرسال
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        _method: 'PUT' // مطلوب لبعض إعدادات Laravel
      };
      
      // إضافة حقول كلمة المرور فقط إذا تم إدخالها
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          throw new Error('كلمة المرور وتأكيدها غير متطابقين');
        }
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }
      
      // إرسال طلب PUT لتحديث البيانات
      const response = await axios.post(
        'http://127.0.0.1:8000/api/User/updateProfile',
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      setSuccess('تم تحديث بيانات المستخدم بنجاح');
      setEditMode(false);
      
      // تحديث حالة المستخدم بالبيانات الجديدة مع الحفاظ على التوكن
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        token // الحفاظ على التوكن
      });

      // تحديث التوكن في localStorage إذا كان مختلفاً
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.errors?.join(', ') || 
                         err.message || 
                         'حدث خطأ أثناء تحديث البيانات';
      setError(errorMessage);
      
      // إذا كان الخطأ متعلقاً بالمصادقة، توجيه إلى صفحة تسجيل الدخول
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته بشكل دائم.')) {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        await axios.delete(`http://127.0.0.1:8000/api/User/deleteUser/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        localStorage.removeItem('token');
        navigate('/login');
        alert('تم حذف المستخدم بنجاح');
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء حذف المستخدم');
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh', backgroundColor: primaryDark }}>
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3" style={{ color: lightText }}>جاري تحميل بيانات المستخدم...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container fluid className="py-5" style={{ minHeight: '100vh', backgroundColor: primaryDark }}>
        <Container>
          <Alert variant="danger" className="text-center">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </Alert>
          <div className="text-center mt-4">
            <Button 
              variant="outline-warning" 
              onClick={() => navigate('/admin/users')}
            >
              العودة إلى إدارة الحسابات
            </Button>
          </div>
        </Container>
      </Container>
    );
  }
  
  return (
    <Container fluid className="py-5" style={{ 
      minHeight: '100vh', 
      backgroundColor: primaryDark,
      color: lightText
    }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold" style={{ color: accent }}>تفاصيل المستخدم</h2>
            <p className="mb-0" style={{ color: mutedText }}>تعديل بيانات المستخدم رقم: {userId}</p>
          </div>
          
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/users')}
            className="d-flex align-items-center"
            style={{ borderColor: borderColor }}
          >
            <i className="bi bi-arrow-right me-2"></i> رجوع
          </Button>
        </div>
        
        {success && (
          <Alert variant="success" className="mb-4" onClose={() => setSuccess('')} dismissible
            style={{ backgroundColor: '#1a3a1a', borderColor: '#2a6e2a' }}>
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </Alert>
        )}
        
        <Row className="g-4">
          <Col lg={8}>
            <Card style={{ backgroundColor: cardBackground, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold" style={{ color: accent }}>
                    <i className="bi bi-person-circle me-2"></i>
                    معلومات الحساب
                  </h5>
                  
                  {editMode ? (
                    <Button 
                      variant="outline-light" 
                      onClick={() => setEditMode(false)}
                      style={{ borderColor: borderColor }}
                    >
                      إلغاء التعديل
                    </Button>
                  ) : (
                    <Button 
                      variant="warning" 
                      onClick={() => setEditMode(true)}
                      className="text-dark fw-medium"
                    >
                      <i className="bi bi-pencil me-2"></i> تعديل البيانات
                    </Button>
                  )}
                </div>
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>الاسم الكامل</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          style={{ 
                            backgroundColor: primaryDark, 
                            color: lightText, 
                            borderColor: borderColor, 
                            height: '48px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>البريد الإلكتروني</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          style={{ 
                            backgroundColor: primaryDark, 
                            color: lightText, 
                            borderColor: borderColor, 
                            height: '48px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {editMode && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label style={{ color: lightText }}>كلمة المرور الجديدة</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="اتركه فارغًا إذا لم ترغب في التغيير"
                              style={{ 
                                backgroundColor: primaryDark, 
                                color: lightText, 
                                borderColor: borderColor, 
                                height: '48px'
                              }}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label style={{ color: lightText }}>تأكيد كلمة المرور</Form.Label>
                            <Form.Control
                              type="password"
                              name="password_confirmation"
                              value={formData.password_confirmation}
                              onChange={handleInputChange}
                              placeholder="تأكيد كلمة المرور الجديدة"
                              style={{ 
                                backgroundColor: primaryDark, 
                                color: lightText, 
                                borderColor: borderColor, 
                                height: '48px'
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>تاريخ التسجيل</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'غير متوفر'}
                          disabled
                          style={{ 
                            backgroundColor: primaryDark, 
                            color: lightText, 
                            borderColor: borderColor, 
                            height: '48px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>حالة الحساب</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.status === 'active' ? 'نشط' : 'موقوف'}
                          disabled
                          style={{ 
                            backgroundColor: primaryDark, 
                            color: lightText, 
                            borderColor: borderColor, 
                            height: '48px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {editMode && (
                    <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top" style={{ borderColor }}>
                      <Button 
                        variant="outline-light" 
                        onClick={() => setEditMode(false)}
                        style={{ 
                          width: '120px', 
                          height: '44px',
                          borderColor: borderColor
                        }}
                      >
                        إلغاء
                      </Button>
                      
                      <Button 
                        variant="warning" 
                        type="submit"
                        className="text-dark fw-medium"
                        style={{ width: '160px', height: '44px' }}
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          'حفظ التعديلات'
                        )}
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
            
            <Card className="mt-4" style={{ backgroundColor: cardBackground, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold" style={{ color: accent }}>
                    <i className="bi bi-activity me-2"></i>
                    نشاط المستخدم
                  </h5>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <p className="mb-1" style={{ color: mutedText }}>آخر تسجيل دخول</p>
                    <p className="mb-0 fw-medium">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : 'غير متوفر'}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="mt-4" style={{ 
              backgroundColor: cardBackground, 
              border: `1px solid #6e2a2a`,
              borderLeft: `3px solid ${accent}`
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold" style={{ color: '#ff6b6b' }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    إجراءات خطيرة
                  </h5>
                  <Button 
                    variant="outline-danger"
                    onClick={handleDelete}
                    className="d-flex align-items-center"
                    style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                    disabled={loading}
                  >
                    <i className="bi bi-trash me-2"></i> حذف الحساب
                  </Button>
                </div>
                
                <p style={{ color: mutedText }}>
                  <i className="bi bi-info-circle me-2"></i>
                  سيؤدي حذف هذا الحساب إلى إزالة جميع البيانات المرتبطة به بشكل دائم ولا يمكن التراجع عن هذا الإجراء.
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card style={{ backgroundColor: cardBackground, border: `1px solid ${borderColor}` }}>
              <Card.Body className="text-center">
                <div className="d-flex justify-content-center mb-4">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accent} 0%, #FFE194 100%)`,
                      fontSize: '3rem',
                      color: primaryDark,
                      fontWeight: 'bold'
                    }}
                  >
                    {user.name?.charAt(0) || '?'}
                  </div>
                </div>
                
                <h4 className="fw-bold mb-2" style={{ color: accent }}>{user.name}</h4>
                <p style={{ color: mutedText }}>{user.email}</p>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="outline-light" 
                    className="mb-2 d-flex align-items-center justify-content-center"
                    style={{ borderColor: borderColor }}
                  >
                    <i className="bi bi-envelope me-2"></i> إرسال رسالة
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default UserDetailsPage;