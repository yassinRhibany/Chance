import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Building, FilePdf } from 'react-bootstrap-icons';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Message from '../../../components/Message.js/Message';

export default function FactoryRegistration() {
  // الألوان المخصصة
  const primaryDark = '#1D1E22';
  const secondaryDark = '#393F4D';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';

  // حالة النموذج
  const [factoryData, setFactoryData] = useState({
    name: '',
    address: '',
    category_id: '',
    is_active: false,
    feasibility_pdf: null
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // جلب تصنيفات المصانع من API
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/categories/index',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }

        }
      );
      // تحقق من بنية الاستجابة
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('هيكل البيانات غير متوقع:', response.data);
        setMessage('هيكل البيانات غير متوقع من السيرفر');
        setMessageColor('#DC3545');
        setShowMessage(true);
      }
    } catch (err) {
      console.error('خطأ في جلب التصنيفات:', err);
      setMessage('حدث خطأ أثناء جلب تصنيفات المصانع');
      setMessageColor('#DC3545');
      setShowMessage(true);
      
      // تسجيل تفاصيل الخطأ
      if (err.response) {
        console.error('تفاصيل الخطأ:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  // جلب التصنيفات عند تحميل المكون
  useEffect(() => {
    if (!user?.token) {
      setAuthError(true);
      setMessage('يجب تسجيل الدخول أولاً للوصول إلى هذه الصفحة');
      setMessageColor('#DC3545');
      setShowMessage(true);
    } else {
      fetchCategories();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setFactoryData(prev => ({ 
      ...prev, 
      feasibility_pdf: e.target.files[0] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.token) {
      setMessage('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      setMessageColor('#DC3545');
      setShowMessage(true);
      setAuthError(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', factoryData.name);
      formData.append('address', factoryData.address);
      formData.append('category_id', factoryData.category_id);
      formData.append('is_active', factoryData.is_active ? '1' : '0');
      if (factoryData.feasibility_pdf) {
        formData.append('feasibility_pdf', factoryData.feasibility_pdf);
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/factories/store',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage('تم تسجيل المصنع بنجاح! سيتم مراجعة البيانات وإعلامك قريباً');
      setMessageColor('#198754');
      setShowMessage(true);
      
      // إعادة تعيين النموذج بعد النجاح
      setFactoryData({
        name: '',
        address: '',
        category_id: '',
        is_active: false,
        feasibility_pdf: null
      });
      
      // إعادة جلب التصنيفات بعد الإرسال الناجح
      fetchCategories();
    } catch (err) {
      console.error('خطأ في تسجيل المصنع:', err);
      
      if (err.response?.status === 401) {
        setMessage('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        setMessageColor('#DC3545');
        setAuthError(true);
        logout();
      } else {
        setMessage(err.response?.data?.message || 'حدث خطأ أثناء تسجيل المصنع');
        setMessageColor('#DC3545');
      }
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (authError) {
    return (
      <Container fluid className="py-5" style={{ backgroundColor: primaryDark, minHeight: '100vh' }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card style={{ 
              backgroundColor: secondaryDark, 
              color: lightText,
              border: `1px solid ${accent}`,
              borderRadius: '15px'
            }}>
              <Card.Body className="text-center py-5">
                <h4 style={{ color: accent }}>غير مصرح بالوصول</h4>
                <p className="mt-3">{message}</p>
                <Button 
                  variant="warning" 
                  onClick={() => navigate('/login')}
                  style={{ 
                    backgroundColor: accent, 
                    color: primaryDark,
                    fontWeight: 'bold',
                    border: 'none',
                    padding: '10px 20px',
                    marginTop: '20px'
                  }}
                >
                  الانتقال إلى صفحة تسجيل الدخول
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ backgroundColor: primaryDark, minHeight: '100vh' }}>
      {/* عرض رسالة النجاح أو الخطأ */}
      {showMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '100%',
          maxWidth: '600px',
          padding: '0 15px'
        }}>
          <Message
            color={messageColor}
            show={showMessage}
            message={message}
            onClose={() => setShowMessage(false)}
          />
        </div>
      )}

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card style={{ 
            backgroundColor: secondaryDark, 
            color: lightText,
            border: `1px solid ${accent}`,
            borderRadius: '15px'
          }}>
            <Card.Header style={{ 
              backgroundColor: primaryDark, 
              borderBottom: `1px solid ${accent}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Building size={24} color={accent} />
              <h4 style={{ margin: 0, color: accent }}>تسجيل بيانات المصنع</h4>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* القسم الأول: المعلومات الأساسية */}
                <div className="mb-4 p-3" style={{ 
                  backgroundColor: primaryDark, 
                  borderRadius: '10px',
                  borderLeft: `3px solid ${accent}`
                }}>
                  <h5 style={{ color: accent, marginBottom: '20px' }}>المعلومات الأساسية</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>اسم المصنع <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={factoryData.name}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>صنف المصنع <span className="text-danger">*</span></Form.Label>
                    {loadingCategories ? (
                      <div className="d-flex align-items-center">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <span>جاري تحميل التصنيفات...</span>
                      </div>
                    ) : categories.length > 0 ? (
                      <Form.Select
                        name="category_id"
                        value={factoryData.category_id}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                      >
                        <option value="">اختر تصنيف المصنع</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name || 'تصنيف بدون اسم'}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Alert variant="warning" className="mt-2">
                        لا توجد تصنيفات متاحة. يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني.
                      </Alert>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>حالة المصنع</Form.Label>
                    <div>
                      <Form.Check
                        type="switch"
                        id="is_active"
                        label={factoryData.is_active ? "نشط" : "غير نشط"}
                        name="is_active"
                        checked={factoryData.is_active}
                        onChange={(e) => setFactoryData(prev => ({ 
                          ...prev, 
                          is_active: e.target.checked 
                        }))}
                      />
                    </div>
                  </Form.Group>
                </div>

                {/* القسم الثاني: الموقع */}
                <div className="mb-4 p-3" style={{ 
                  backgroundColor: primaryDark, 
                  borderRadius: '10px',
                  borderLeft: `3px solid ${accent}`
                }}>
                  <h5 style={{ color: accent, marginBottom: '20px' }}>تفاصيل الموقع</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>العنوان التفصيلي <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={factoryData.address}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                  </Form.Group>
                </div>

                {/* القسم الثالث: المستندات */}
                <div className="mb-4 p-3" style={{ 
                  backgroundColor: primaryDark, 
                  borderRadius: '10px',
                  borderLeft: `3px solid ${accent}`
                }}>
                  <h5 style={{ color: accent, marginBottom: '20px' }}>المستندات المطلوبة</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FilePdf className="me-2" />
                      دراسة الجدوى (PDF) <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      required
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                    {factoryData.feasibility_pdf && (
                      <Form.Text style={{ color: lightText }}>
                        تم اختيار: {factoryData.feasibility_pdf.name}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>

                <div className="d-grid mt-4">
                  <Button 
                    variant="warning" 
                    type="submit"
                    disabled={isLoading || loadingCategories || categories.length === 0}
                    style={{ 
                      backgroundColor: accent, 
                      color: primaryDark,
                      fontWeight: 'bold',
                      border: 'none',
                      padding: '10px',
                      fontSize: '1.1rem',
                      height: '50px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        جاري الحفظ...
                      </>
                    ) : (
                      'حفظ بيانات المصنع'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}