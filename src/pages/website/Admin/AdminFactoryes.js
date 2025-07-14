import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, Button, 
  Badge, InputGroup, Modal, Spinner, Alert
} from 'react-bootstrap';
import { 
  FaIndustry, FaSearch, FaEdit, FaTrash, FaFilePdf, 
  FaFilter, FaSync, FaExclamationTriangle, FaPlus, FaTimes, FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';

const FactoryManagement = () => {
  // حالات التطبيق
  const [factories, setFactories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // عنوان API الأساسي
  const API_URL = 'http://127.0.0.1:8000/api';
  
  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchFactories();
  }, []);

  // دالة لجلب المصانع من API
  const fetchFactories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/factories/getAllFactories`);
      const processedFactories = response.data.map(factory => ({
        id: factory.id?.toString() || 'غير محدد',
        name: factory.name?.toString() || 'بدون اسم',
        address: factory.address?.toString() || 'غير محدد',
        status: factory.status?.toString() || 'معلق',
        category: factory.category.name?.toString() || 'غير محدد',
        feasibility_pdf: factory.feasibility_pdf || null
      }));
      console.log(response);
      
      setFactories(processedFactories);
    } catch (err) {
      setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // تصفية المصانع
  const filteredFactories = factories.filter(factory => {
    return (
      factory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.address.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      statusFilter === 'الكل' || factory.status === statusFilter
    );
  });

  // تغيير لون الحالة
  const getStatusBadge = (status) => {
    switch(status) {
      case 'نشط': return 'success';
      case 'معلق': return 'warning';
      case 'معطل': return 'danger';
      default: return 'primary';
    }
  };

  // فتح نافذة تعديل المصنع
  const openEditModal = (factory) => {
    setSelectedFactory(factory);
    setPdfFile(null);
    setShowEditModal(true);
  };

  // فتح نافذة حذف المصنع
  const openDeleteModal = (factory) => {
    setSelectedFactory(factory);
    setShowDeleteModal(true);
  };

  // حفظ التعديلات
  const handleUpdateFactory = async () => {
    try {
      setIsLoading(true);
      
      // التحقق من الحقول المطلوبة
      if (!selectedFactory.name || !selectedFactory.address) {
        setMessage('الرجاء إدخال اسم المصنع وعنوانه');
        setMessageColor('danger');
        setShowMessage(true);
        return;
      }

      // إنشاء FormData
      const formData = new FormData();
      formData.append('name', selectedFactory.name);
      formData.append('address', selectedFactory.address);
      
      // إضافة ملف PDF إذا تم اختياره
      if (pdfFile) {
        formData.append('feasibility_pdf', pdfFile);
      }

      // إرسال الطلب
      const response = await axios.post(
        `${API_URL}/factories/updateFactory/${selectedFactory.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // في حالة نجاح العملية
      setMessage('تم تحديث بيانات المصنع بنجاح');
      setMessageColor('success');
      setShowMessage(true);
      
      // إغلاق المودال وتحديث البيانات
      setShowEditModal(false);
      fetchFactories();
      
    } catch (error) {
      console.error('حدث خطأ:', error);
      setMessage(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
      setMessageColor('danger');
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // حذف المصنع
  const deleteFactory = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/factories/deleteFactory/${selectedFactory.id}`);
      
      const updatedFactories = factories.filter(factory => factory.id !== selectedFactory.id);
      setFactories(updatedFactories);
      setShowDeleteModal(false);
    } catch (err) {
      setError('فشل في حذف المصنع');
      console.error('Error deleting factory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      <Container fluid className="py-4">
        {/* رسالة خطأ إذا حدثت مشكلة في جلب البيانات */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <FaExclamationTriangle className="me-2" />
            {error}
            <Button variant="outline-light" size="sm" className="ms-3" onClick={fetchFactories}>
              <FaSync /> إعادة المحاولة
            </Button>
          </Alert>
        )}
        
        {/* العنوان الرئيسي */}
        <Row className="mb-4 align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <div className="bg-dark p-2 rounded me-3">
                <FaIndustry size={32} className="text-warning" />
              </div>
              <div>
                <h1 className="fw-bold mb-0 text-light">إدارة المصانع</h1>
                <p className="mb-0 text-light">عرض وتعديل وحذف المصانع المسجلة في النظام</p>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* بطاقات الإحصائيات السريعة */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card style={{ 
              backgroundColor: '#1e1e1e',
              borderLeft: '4px solid #28a745',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small" style={{ color: '#aaa' }}>المصانع النشطة</h6>
                    <h3 className="mb-0 text-success">
                      {factories.filter(f => f.status === 'نشط').length}
                    </h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaIndustry size={24} className="text-success" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ 
              backgroundColor: '#1e1e1e',
              borderLeft: '4px solid #ffc107',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small" style={{ color: '#aaa' }}>المصانع المعلقة</h6>
                    <h3 className="mb-0 text-warning">
                      {factories.filter(f => f.status === 'معلق').length}
                    </h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <FaIndustry size={24} className="text-warning" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ 
              backgroundColor: '#1e1e1e',
              borderLeft: '4px solid #0d6efd',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small" style={{ color: '#aaa' }}>إجمالي المصانع</h6>
                    <h3 className="mb-0 text-primary">{factories.length}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaIndustry size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* بطاقة قائمة المصانع */}
        <Card style={{ 
          backgroundColor: '#1e1e1e', 
          border: '1px solid #444',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
        }}>
          <Card.Header style={{ 
            backgroundColor: '#2d2d2d', 
            borderBottom: '1px solid #444',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem'
          }}>
            <h5 className="mb-0 text-light">
              <FaIndustry className="me-2 text-warning" /> تفاصيل المصانع
            </h5>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2" onClick={fetchFactories}>
                <FaSync /> تحديث البيانات
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body>
            {/* أدوات البحث والتصفية */}
            <Row className="mb-4 g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text style={{ 
                    backgroundColor: '#333', 
                    border: '1px solid #555',
                    color: '#e0e0e0'
                  }}>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="ابحث باسم المصنع أو العنوان..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      backgroundColor: '#333', 
                      border: '1px solid #555',
                      color: '#e0e0e0'
                    }}
                  />
                </InputGroup>
              </Col>
              
              <Col md={4}>
                <Form.Select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ 
                    backgroundColor: '#333', 
                    border: '1px solid #555',
                    color: '#e0e0e0'
                  }}
                >
                  <option value="الكل">كل الحالات</option>
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                  <option value="معطل">معطل</option>
                </Form.Select>
              </Col>
            </Row>
            
            {/* جدول المصانع */}
            <div className="table-responsive">
              <Table hover className="mb-0" variant="dark">
                <thead style={{ backgroundColor: '#2d2d2d' }}>
                  <tr>
                    <th>رقم المصنع</th>
                    <th>اسم المصنع</th>
                    <th>العنوان</th>
                    <th>الصنف</th>
                    <th>الحالة</th>
                    <th>دراسة الجدوى</th>
                    <th className="text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <Spinner animation="border" variant="light" />
                        <p className="mt-2">جاري تحميل البيانات...</p>
                      </td>
                    </tr>
                  ) : filteredFactories.length > 0 ? (
                    filteredFactories.map((factory, index) => (
                      <tr key={index} style={{ backgroundColor: '#252525' }}>
                        <td className="fw-bold">{factory.id}</td>
                        <td>{factory.name}</td>
                        <td>{factory.address}</td>
                        <td>{factory.category}</td>
                        <td>
                          <Badge bg={getStatusBadge(factory.status)}>
                            {factory.status}
                          </Badge>
                        </td>
                        <td>
                          {factory.feasibility_pdf ? (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => window.open(factory.feasibility_pdf.url, '_blank')}
                            >
                              <FaFilePdf className="me-1" /> عرض الملف
                            </Button>
                          ) : (
                            <span className="text-muted">لا يوجد ملف</span>
                          )}
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal(factory)}
                          >
                            <FaEdit /> تعديل
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => openDeleteModal(factory)}
                          >
                            <FaTrash /> حذف
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ backgroundColor: '#252525' }}>
                      <td colSpan="6" className="text-center py-4">
                        <div className="py-4">
                          <FaIndustry size={48} className="text-muted mb-3" />
                          <h5>لا توجد مصانع مطابقة لمعايير البحث</h5>
                          <p className="text-muted">حاول تغيير معايير البحث</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
        
        {/* نافذة تعديل المصنع المعدلة */}
        <Modal 
          show={showEditModal} 
          onHide={() => setShowEditModal(false)} 
          size="lg" 
          centered
          contentClassName="bg-dark text-light"
        >
          <Modal.Header 
            closeButton 
            closeVariant="white"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <Modal.Title className="d-flex align-items-center">
              <FaEdit className="me-2 text-primary" /> تعديل بيانات المصنع
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFactory && (
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group controlId="editName" className="mb-3">
                    <Form.Label>اسم المصنع</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.name || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, name: e.target.value})}
                      className="bg-dark text-light"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group controlId="editAddress" className="mb-3">
                    <Form.Label>عنوان المصنع</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.address || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, address: e.target.value})}
                      className="bg-dark text-light"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group controlId="editFeasibility" className="mb-3">
                    <Form.Label>دراسة الجدوى (PDF)</Form.Label>
                    <div className="border border-secondary rounded p-3 bg-dark">
                      {selectedFactory.feasibility_pdf ? (
                        <div className="d-flex justify-content-between align-items-center mb-2 text-white">
                          <div>
                            <FaFilePdf className="text-danger me-2" />
                            <span>{selectedFactory.feasibility_pdf.name || 'ملف دراسة الجدوى'}</span>
                          </div>
                          <div>
                            <a 
                              href={selectedFactory.feasibility_pdf.url || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-info me-3"
                            >
                              عرض الملف الحالي
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="text-white mb-2">
                          <FaInfoCircle className="me-2" />
                          لا يوجد ملف مرفق حالياً
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <Form.Label className="text-white">رفع ملف جديد:</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files[0])}
                          className="bg-dark text-light"
                        />
                        {pdfFile && (
                          <div className="mt-2 text-success">
                            <FaInfoCircle className="me-1" /> تم اختيار ملف: {pdfFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#1a1a1a" }}>
            <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button 
              variant="primary" 
              onClick={handleUpdateFactory}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" />
                  <span className="ms-2">جاري الحفظ...</span>
                </>
              ) : 'حفظ التغييرات'}
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* نافذة حذف المصنع */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)} 
          centered
          contentClassName="bg-dark text-light"
        >
          <Modal.Header 
            closeButton 
            closeVariant="white"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <Modal.Title className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2 text-danger" /> تأكيد الحذف
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {selectedFactory && (
              <>
                <div className="mb-4">
                  <FaExclamationTriangle size={48} className="text-danger mb-3" />
                  <h4>هل أنت متأكد من حذف هذا المصنع؟</h4>
                  <p className="text-muted">هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
                
                <div className="border rounded p-4 mb-4" style={{ backgroundColor: '#1e1e1e' }}>
                  <Row className="mb-3">
                    <Col md={4} className="text-end">
                      <strong>اسم المصنع:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      {selectedFactory.name}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="text-end">
                      <strong>رقم المصنع:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      {selectedFactory.id}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="text-end">
                      <strong>الحالة:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      <Badge bg={getStatusBadge(selectedFactory.status)}>
                        {selectedFactory.status}
                      </Badge>
                    </Col>
                  </Row>
                </div>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="outline-secondary" size="lg" onClick={() => setShowDeleteModal(false)}>
                    إلغاء
                  </Button>
                  <Button 
                    variant="danger" 
                    size="lg" 
                    onClick={deleteFactory}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" />
                        <span className="ms-2">جاري الحذف...</span>
                      </>
                    ) : (
                      <>
                        <FaTrash className="me-1" /> تأكيد الحذف
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default FactoryManagement;