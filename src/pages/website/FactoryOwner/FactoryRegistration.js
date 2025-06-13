import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Badge } from 'react-bootstrap';
import { Building, FilePdf, CheckCircleFill, CurrencyDollar } from 'react-bootstrap-icons';

export default function FactoryRegistration () {
  // الألوان المخصصة
  const primaryDark = '#1D1E22';
  const secondaryDark = '#393F4D';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';

  // حالة النموذج
  const [factoryData, setFactoryData] = useState({
    factoryName: '',
    location: {
      city: '',
      address: ''
    },
    category: '',
    status: 'under_construction',
    minInvestment: '',
    feasibilityStudy: null,
    additionalDocuments: []
  });

  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFactoryData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    setFactoryData(prev => ({ 
      ...prev, 
      [fieldName]: e.target.files[0] 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('بيانات المصنع:', factoryData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

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
                      name="factoryName"
                      value={factoryData.factoryName}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>صنف المصنع <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="category"
                      value={factoryData.category}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    >
                      <option value="">اختر تصنيف المصنع</option>
                      <option value="صناعي">صناعي</option>
                      <option value="تحويلي">تحويلي</option>
                      <option value="إنتاجي">إنتاجي</option>
                      <option value="خدمي">خدمي</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>حالة المصنع <span className="text-danger">*</span></Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label={
                          <span>
                            قيد الإنشاء <Badge bg="warning" text="dark">Under Construction</Badge>
                          </span>
                        }
                        name="status"
                        value="under_construction"
                        checked={factoryData.status === 'under_construction'}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label={
                          <span>
                            يعمل حالياً <Badge bg="success">Operational</Badge>
                          </span>
                        }
                        name="status"
                        value="operational"
                        checked={factoryData.status === 'operational'}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>

                     <Form.Group className="mb-3">
                    <Form.Label>
                      <CurrencyDollar className="me-2" />
                      المبلغ المطلوب بالدولار الامريكي <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="minInvestment"
                      value={factoryData.minInvestment}
                      onChange={handleChange}
                      required
                      min="10000"
                      step="1000"
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <CurrencyDollar className="me-2" />
                      الحد الأدنى للاستثمار ( دولار امريكي) <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="minInvestment"
                      value={factoryData.minInvestment}
                      onChange={handleChange}
                      required
                      min="10000"
                      step="1000"
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                    <Form.Text style={{ color: lightText }}>
                      أقل مبلغ يمكن للمستثمر المساهمة به
                    </Form.Text>
                  </Form.Group>
                </div>

                {/* القسم الثاني: الموقع */}
                <div className="mb-4 p-3" style={{ 
                  backgroundColor: primaryDark, 
                  borderRadius: '10px',
                  borderLeft: `3px solid ${accent}`
                }}>
                  <h5 style={{ color: accent, marginBottom: '20px' }}>تفاصيل الموقع</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>المدينة <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={factoryData.location.city}
                          onChange={handleLocationChange}
                          required
                          style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>العنوان التفصيلي</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={factoryData.location.address}
                          onChange={handleLocationChange}
                          style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
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
                      onChange={(e) => handleFileUpload(e, 'feasibilityStudy')}
                      required
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                    {factoryData.feasibilityStudy && (
                      <Form.Text style={{ color: lightText }}>
                        تم اختيار: {factoryData.feasibilityStudy.name}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>مستندات إضافية (اختياري)</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'additionalDocuments')}
                      style={{ backgroundColor: secondaryDark, color: lightText, borderColor: accent }}
                    />
                    {factoryData.additionalDocuments.length > 0 && (
                      <Form.Text style={{ color: lightText }}>
                        {factoryData.additionalDocuments.length} ملف(ات) مرفقة
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>

                <div className="d-grid mt-4">
                  <Button 
                    variant="warning" 
                    type="submit"
                    style={{ 
                      backgroundColor: accent, 
                      color: primaryDark,
                      fontWeight: 'bold',
                      border: 'none',
                      padding: '10px',
                      fontSize: '1.1rem'
                    }}
                  >
                    حفظ بيانات المصنع
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* رسالة النجاح */}
      {success && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          maxWidth: '400px'
        }}>
          <Alert 
            variant="success" 
            onClose={() => setSuccess(false)} 
            dismissible
            style={{
              backgroundColor: '#198754',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircleFill size={24} />
            <div>
              <h6 style={{ marginBottom: 0 }}>تم حفظ بيانات المصنع بنجاح!</h6>
              <small>سيتم مراجعة البيانات وإعلامك قريباً</small>
            </div>
          </Alert>
        </div>
      )}
    </Container>
  );
};

