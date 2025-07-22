import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompleteUserProfile = () => {
  const auth = useAuth();
  const user = auth?.user;
  const token = user?.token || null;
  const logout = auth?.logout || (() => {});
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // ألوان التصميم
  const primaryColor = '#2A2C33';
  const cardBackground = '#3A3D46';
  const accentColor = '#FEDA6A';
  const textColor = '#E0E1E6';
  const mutedText = '#A0A2AA';

  // جلب بيانات الملف الشخصي
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!token) {
        logout();
        navigate('/login');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/User/showProfile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = response.data.user || response.data;
      setProfile(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        password: '',
        password_confirmation: ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'حدث خطأ في جلب بيانات الملف الشخصي');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

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
      setSuccessMessage('');

      if (!token) {
        logout();
        navigate('/login');
        return;
      }

      if (formData.password && formData.password !== formData.password_confirmation) {
        throw new Error('كلمة المرور غير متطابقة');
      }

      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/User/updateProfile',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccessMessage('تم تحديث الملف الشخصي بنجاح');
      setEditMode(false);
      await fetchProfile();
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء تحديث البيانات');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (error && !profile) {
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
        <Col lg={8}>
          <Card style={{ backgroundColor: cardBackground, border: 'none' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: accentColor }}>الملف الشخصي</h2>
                {!editMode && (
                  <Button 
                    variant="warning" 
                    onClick={() => setEditMode(true)}
                    style={{ color: '#000' }}
                  >
                    تعديل
                  </Button>
                )}
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}

              <Row>
                <Col md={4} className="text-center mb-4">
                  <div 
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      backgroundColor: accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      fontSize: '4rem',
                      color: primaryColor,
                      fontWeight: 'bold'
                    }}
                  >
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <h4 className="mt-3" style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {profile?.name}
                  </h4>
                  <p style={{ 
                    color: '#FFFFFF', 
                    fontSize: '1.1rem',
                    margin: '10px 0',
                    wordBreak: 'break-word'
                  }}>
                    {profile?.email}
                  </p>
                  <div style={{
                    backgroundColor: '#4A4D56',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginTop: '10px'
                  }}>
                    <p style={{ 
                      color: '#FFFFFF', 
                      margin: '0',
                      fontWeight: '500',
                      fontSize: '1rem'
                    }}>
                      {user?.roleName}
                    </p>
                  </div>
                </Col>

                <Col md={8}>
                  {editMode ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: textColor }}>الاسم الكامل</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: textColor }}>البريد الإلكتروني</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: textColor }}>كلمة المرور الجديدة</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="اتركه فارغاً إذا لم ترغب في تغيير كلمة المرور"
                          style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: textColor }}>تأكيد كلمة المرور</Form.Label>
                        <Form.Control
                          type="password"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          placeholder="تأكيد كلمة المرور الجديدة"
                          style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between">
                        <Button 
                          variant="warning" 
                          type="submit" 
                          disabled={loading}
                          className="me-2"
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span className="ms-2">جاري الحفظ...</span>
                            </>
                          ) : 'حفظ التغييرات'}
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => {
                            setEditMode(false);
                            setError('');
                            setFormData({
                              name: profile.name,
                              email: profile.email,
                              password: '',
                              password_confirmation: ''
                            });
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h5 style={{ color: accentColor }}>معلومات الحساب</h5>
                        <hr style={{ backgroundColor: mutedText }} />
                        <p>
                          <strong style={{ color: 'gray', fontSize: '1.1rem' }}>الاسم: </strong>
                          <span style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>{profile?.name}</span>
                        </p>
                        <p>
                          <strong style={{ color: 'gray', fontSize: '1.1rem' }}>البريد الإلكتروني: </strong>
                          <span style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>{profile?.email}</span>
                        </p>
                        <p>
                          <strong style={{ color: 'gray', fontSize: '1.1rem' }}>الدور: </strong>
                          <span style={{ 
                            color: '#FFFFFF', 
                            fontSize: '1.1rem',
                            backgroundColor: '#4A4D56',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {user?.roleName}
                          </span>
                        </p>
                        <p>
                          <strong style={{ color: 'gray', fontSize: '1.1rem' }}>تاريخ التسجيل: </strong>
                          <span style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>
                            {new Date(profile?.created_at).toLocaleDateString()}
                          </span>
                        </p>
                      </div>

                      <div>
                        <h5 style={{ color: accentColor }}>النشاط</h5>
                        <hr style={{ backgroundColor: mutedText }} />
                        <p>
                          <strong style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>آخر تسجيل دخول: </strong>
                          <span style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>
                            {profile?.last_login ? new Date(profile.last_login).toLocaleString() : 'غير معروف'}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompleteUserProfile;