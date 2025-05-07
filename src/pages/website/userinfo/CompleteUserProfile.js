import { useState } from 'react';
import { Container, Form, Button, Alert, Card, ProgressBar } from 'react-bootstrap';
import { Person, Envelope, Telephone, GeoAlt, CardHeading } from 'react-bootstrap-icons';
import './CompleteUserProfile.css'

export default function CompleteUserProfile () {
  const [formData, setFormData] = useState({
    idNumber: '',
    birthDate: '',
    phone: '',
    address: '',
    riskLevel: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.idNumber) newErrors.idNumber = 'رقم الهوية مطلوب';
    if (!formData.birthDate) newErrors.birthDate = 'تاريخ الميلاد مطلوب';
    if (!formData.phone) newErrors.phone = 'رقم الجوال مطلوب';
    if (!formData.address) newErrors.address = 'العنوان مطلوب';
    if (!formData.riskLevel) newErrors.riskLevel = 'مستوى المخاطرة مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // هنا يتم إرسال البيانات للخادم
      setIsSubmitted(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <Card className="border-0 shadow" style={{ backgroundColor: '#393F4D' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4" style={{ color: '#FEDA6A' }}>
            <span className="border-bottom border-2 border-accent pb-2">
              إكمال البيانات الإلزامية
            </span>
          </h2>
          
          {/* <ProgressBar now={75} label="75% مكتمل" 
            className="mb-4" 
            style={{ height: '10px' }}
            variant="accent"
          /> */}
          
          {isSubmitted ? (
            <Alert variant="success" className="text-center">
              تم حفظ البيانات بنجاح! يمكنك الآن البدء في الاستثمار.
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* حقل رقم الهوية */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#D4D4DC' }}>
                  <CardHeading className="me-2" />
                  رقم الهوية / الإقامة
                </Form.Label>
                <Form.Control
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className={`border-0 ${errors.idNumber ? 'is-invalid' : ''}`}
                  style={{ 
                    backgroundColor: '#ffff', 
                    // color: '#D4D4DC',
                    height: '50px'
                  }}
                />
                {errors.idNumber && (
                  <Form.Text className="text-danger">{errors.idNumber}</Form.Text>
                )}
              </Form.Group>
              
              {/* حقل تاريخ الميلاد */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#D4D4DC' }}>
                  <Person className="me-2" />
                  تاريخ الميلاد
                </Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`border-0 ${errors.birthDate ? 'is-invalid' : ''}`}
                  style={{ 
                    backgroundColor: '#ffff', 
                    // color: '#333',
                    height: '50px'
                  }}
                />
                {errors.birthDate && (
                  <Form.Text className="text-danger">{errors.birthDate}</Form.Text>
                )}
              </Form.Group>
              
              {/* حقل رقم الجوال */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#D4D4DC' }}>
                  <Telephone className="me-2" />
                  رقم الجوال
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`border-0 ${errors.phone ? 'is-invalid' : ''}`}
                  style={{ 
                    backgroundColor: '#ffff', 
                    // color: '#D4D4DC',
                    height: '50px'
                  }}
                />
                {errors.phone && (
                  <Form.Text className="text-danger">{errors.phone}</Form.Text>
                )}
              </Form.Group>
              
              {/* حقل العنوان */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#D4D4DC' }}>
                  <GeoAlt className="me-2" />
                  العنوان الوطني
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`border-0 ${errors.address ? 'is-invalid' : ''}`}
                  style={{ 
                    backgroundColor: '#ffff', 
                    // color: '#D4D4DC'
                  }}
                />
                {errors.address && (
                  <Form.Text className="text-danger">{errors.address}</Form.Text>
                )}
              </Form.Group>
              
              {/* حقل مستوى المخاطرة */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#D4D4DC' }}>
                  مستوى تقبلك للمخاطرة
                </Form.Label>
                <div className="d-flex gap-3">
                  {['محافظ', 'متوازن', 'عدواني'].map((level) => (
                    <Button
                      key={level}
                      variant={formData.riskLevel === level ? 'accent' : 'outline-accent'}
                      onClick={() => setFormData({...formData, riskLevel: level})}
                      style={{
                        backgroundColor: formData.riskLevel === level ? '#FEDA6A' : 'transparent',
                        color: formData.riskLevel === level ? '#1D1E22' : '#FEDA6A',
                        borderColor: '#FEDA6A',
                        flex: 1
                      }}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                {errors.riskLevel && (
                  <Form.Text className="text-danger">{errors.riskLevel}</Form.Text>
                )}
              </Form.Group>
              
              {/* زر الحفظ */}
              <div className="text-center mt-4">
                <Button
                  type="submit"
                  size="lg"
                  style={{
                    backgroundColor: '#FEDA6A',
                    borderColor: '#FEDA6A',
                    color: '#1D1E22',
                    fontWeight: '600',
                    minWidth: '200px'
                  }}
                >
                  حفظ البيانات
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

