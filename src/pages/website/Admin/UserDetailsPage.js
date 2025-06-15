import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Form, Button, Card, Row, Col, Spinner, Alert, Badge 
} from 'react-bootstrap';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  // ألوان التصميم المعدلة (داكنة ولكن معتدلة)
  const primaryDark = '#2A2C33'; // رمادي داكن بدلاً من أسود قاتم
  const cardBackground = '#3A3D46'; // رمادي متوسط
  const accent = '#FEDA6A'; // اللون الذهبي المميز
  const lightText = '#E0E1E6'; // نص فاتح
  const mutedText = '#A0A2AA'; // نص ثانوي
  const borderColor = '#4A4D56'; // حدود داكنة
  
  // حالة بيانات المستخدم
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // حالة التعديل
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // محاكاة طلب API
        setTimeout(() => {
          const mockUser = {
            id: userId,
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            registrationDate: '15 مايو 2023',
            lastLogin: '20 أكتوبر 2023 - 14:30',
            investmentCount: 5,
            totalInvested: '1,250,000 ريال',
            status: 'نشط'
          };
          
          setUser(mockUser);
          setFormData({
            name: mockUser.name,
            email: mockUser.email,
            password: '********' // كلمة مرور مشفرة
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات المستخدم');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  // معالجة تغيير المدخلات
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // معالجة إرسال التعديلات
  const handleSubmit = (e) => {
    e.preventDefault();
    // محاكاة تحديث البيانات
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('تم تحديث بيانات المستخدم بنجاح');
      setEditMode(false);
      
      // تحديث بيانات المستخدم المعروضة
      setUser({
        ...user,
        name: formData.name,
        email: formData.email
      });
    }, 1000);
  };
  
  // حذف المستخدم
  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته بشكل دائم.')) {
      setLoading(true);
      // محاكاة حذف المستخدم
      setTimeout(() => {
        setLoading(false);
        navigate('/admin/accounts');
        alert('تم حذف المستخدم بنجاح');
      }, 1000);
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
              onClick={() => navigate('/admin/accounts')}
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
            onClick={() => navigate('/admin/accounts')}
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
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>كلمة المرور</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          style={{ 
                            backgroundColor: primaryDark, 
                            color: lightText, 
                            borderColor: borderColor, 
                            height: '48px'
                          }}
                        />
                        {editMode && (
                          <Form.Text style={{ color: mutedText }}>
                            اترك هذا الحقل فارغًا إذا كنت لا تريد تغيير كلمة المرور
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>تاريخ التسجيل</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.registrationDate}
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
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: lightText }}>حالة الحساب</Form.Label>
                        <Form.Control
                          type="text"
                          value={user.status}
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
                      >
                        حفظ التعديلات
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
                    <p className="mb-0 fw-medium">{user.lastLogin}</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedText }}>عدد الاستثمارات</p>
                    <p className="mb-0 fw-medium">{user.investmentCount}</p>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-1" style={{ color: mutedText }}>إجمالي المستثمر</p>
                    <p className="mb-0 fw-medium">{user.totalInvested}</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedText }}>حالة الحساب</p>
                    <Badge bg="success" className="fs-6" style={{ backgroundColor: '#2a6e2a' }}>
                      {user.status}
                    </Badge>
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
                    {user.name.charAt(0)}
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
                  <Button 
                    variant="outline-light" 
                    className="d-flex align-items-center justify-content-center"
                    style={{ borderColor: borderColor }}
                  >
                    <i className="bi bi-key me-2"></i> إعادة تعيين كلمة المرور
                  </Button>
                </div>
                
                <div className="mt-5 pt-3 border-top" style={{ borderColor }}>
                  <h6 className="fw-bold mb-3" style={{ color: accent }}>الأمان</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ color: lightText }}>المصادقة الثنائية</span>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="2faSwitch"
                        checked
                        disabled
                        style={{ backgroundColor: accent, borderColor: accent }}
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ color: lightText }}>تأكيد البريد الإلكتروني</span>
                    <Badge bg="success" style={{ backgroundColor: '#2a6e2a' }}>مؤكد</Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="mt-4" style={{ backgroundColor: cardBackground, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <h6 className="fw-bold mb-3" style={{ color: accent }}>معلومات إضافية</h6>
                
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded p-2 me-3"
                    style={{ backgroundColor: primaryDark }}
                  >
                    <i className="bi bi-calendar" style={{ color: accent, fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <p className="mb-0" style={{ color: mutedText }}>تاريخ التسجيل</p>
                    <p className="mb-0 fw-medium">{user.registrationDate}</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded p-2 me-3"
                    style={{ backgroundColor: primaryDark }}
                  >
                    <i className="bi bi-coin" style={{ color: accent, fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <p className="mb-0" style={{ color: mutedText }}>إجمالي الاستثمارات</p>
                    <p className="mb-0 fw-medium">{user.totalInvested}</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded p-2 me-3"
                    style={{ backgroundColor: primaryDark }}
                  >
                    <i className="bi bi-building" style={{ color: accent, fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <p className="mb-0" style={{ color: mutedText }}>الشركة التابعة</p>
                    <p className="mb-0 fw-medium">شركة الاستثمار المثالي</p>
                  </div>
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