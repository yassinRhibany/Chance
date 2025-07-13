import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, ProgressBar, Badge, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FaBuilding, FaEdit, FaTrash, FaMapMarkerAlt, FaFilePdf, FaSearch, FaFilter, FaPlus, FaChartLine, FaInfoCircle, FaUpload, FaDollarSign } from 'react-icons/fa';
import { data, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import Message from '../../../components/Message.js/Message';

const MyFactories = () => {
  // حالة المصانع
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالات النماذج
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFactory, setCurrentFactory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [pdfFile, setPdfFile] = useState(null);
  
  // رسائل النظام
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  const { user } = useAuth();
  const API_URL = 'http://127.0.0.1:8000/api';

  // دالة لتحويل التاريخ إلى نص قابل للعرض
  const formatDateForDisplay = (date) => {
    if (!date) return 'غير محدد';
    
    try {
      // إذا كان كائن تاريخ
      if (typeof date === 'object' && date.date) {
        return new Date(date.date).toLocaleDateString('ar-SA');
      }
      // إذا كان نص تاريخ
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString('ar-SA');
      }
      // إذا كان timestamp
      if (typeof date === 'number') {
        return new Date(date).toLocaleDateString('ar-SA');
      }
      // أي نوع آخر
      return date.toString();
    } catch (e) {
      console.error('خطأ في تحويل التاريخ:', e);
      return 'غير محدد';
    }
  };

  // جلب بيانات المصانع من API
  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await axios.get(`${API_URL}/factories/indexForUser`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
         
       
        }
      );
       
        // معالجة الاستجابة لضمان الحصول على مصفوفة
        let factoriesData = [];
        
        if (Array.isArray(response.data)) {
          factoriesData = response.data;
        } 
        else if (response.data && Array.isArray(response.data.data)) {
          factoriesData = response.data.data;
        }
        else if (response.data && Array.isArray(response.data.factories)) {
          factoriesData = response.data.factories;
        }
        else if (response.data && typeof response.data === 'object') {
          factoriesData = [response.data];
        }
        
        // معالجة كل مصنع لضمان صحة البيانات
        const processedFactories = (factoriesData || []).map(factory => ({
          id: factory.id?.toString() || '',
          name: factory.name?.toString() || 'بدون اسم',
          category: factory.category?.toString() || 'بدون تصنيف',
          status: factory.status?.toString() || 'غير محدد',
          requiredAmount: Number(factory.requiredAmount) || 0,
          location: factory.location?.toString() || 'غير محدد',
          description: factory.description?.toString() || 'لا يوجد وصف',
          progress: Number(factory.progress) || 0,
          feasibilityStudy: factory.feasibilityStudy?.toString() || 'لا يوجد ملف',
          registeredDate: formatDateForDisplay(factory.registeredDate)
        }));
        
        setFactories(processedFactories);
        
      } catch (err) {
        console.error('تفاصيل الخطأ:', err.response?.data || err.message);
        setError('فشل في تحميل بيانات المصانع');
        setFactories([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchFactories();
      console.log(data.res);
    }
  }, [user]);

  // تنسيق العملة
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // تصفية المصانع بشكل آمن
  const filteredFactories = useMemo(() => {
    if (!Array.isArray(factories)) {
      console.error('المصانع يجب أن تكون مصفوفة:', factories);
      return [];
    }
    
    const lowerSearchTerm = (searchTerm || '').toLowerCase();
    return factories.filter(factory => {
      const name = factory.name?.toString().toLowerCase() || '';
      const category = factory.category?.toString().toLowerCase() || '';
      const location = factory.location?.toString().toLowerCase() || '';
      const status = factory.status?.toString() || '';
      
      const matchesSearch = 
        name.includes(lowerSearchTerm) ||
        category.includes(lowerSearchTerm) ||
        location.includes(lowerSearchTerm);
      
      const matchesStatus = 
        statusFilter === 'الكل' || 
        status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [factories, searchTerm, statusFilter]);

  // فتح نموذج التعديل
  const openEditModal = (factory) => {
    setCurrentFactory(factory);
    setPdfFile(null);
    setShowEditModal(true);
  };

  // فتح نموذج الحذف
  const openDeleteModal = (factory) => {
    setCurrentFactory(factory);
    setShowDeleteModal(true);
  };

  // حفظ التعديلات
  const handleSaveChanges = async () => {
    if (!currentFactory) return;
    
    try {
      const formData = new FormData();
      formData.append('name', currentFactory.name.toString());
      formData.append('category', currentFactory.category.toString());
      formData.append('status', currentFactory.status.toString());
      formData.append('requiredAmount', currentFactory.requiredAmount.toString());
      formData.append('location', currentFactory.location.toString());
      formData.append('description', currentFactory.description.toString());
      formData.append('progress', currentFactory.progress.toString());
      
      if (pdfFile) {
        formData.append('feasibility_pdf', pdfFile);
      }

      const response = await axios.put(
        `${API_URL}/factories/${currentFactory.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log(formData);

      // تحديث قائمة المصانع مع ضمان تحويل البيانات
      setFactories(factories.map(f => {
        if (f.id === currentFactory.id) {
          const updatedFactory = response.data;
          return {
            id: updatedFactory.id?.toString() || '',
            name: updatedFactory.name?.toString() || '',
            category: updatedFactory.category?.toString() || '',
            status: updatedFactory.status?.toString() || '',
            requiredAmount: Number(updatedFactory.requiredAmount) || 0,
            location: updatedFactory.location?.toString() || '',
            description: updatedFactory.description?.toString() || '',
            progress: Number(updatedFactory.progress) || 0,
            feasibilityStudy: updatedFactory.feasibilityStudy?.toString() || '',
            registeredDate: formatDateForDisplay(updatedFactory.registeredDate)
          };
        }
        return f;
      }));
      
      setMessage('تم تحديث بيانات المصنع بنجاح');
      setMessageColor('#198754');
      setShowMessage(true);
      setShowEditModal(false);
    } catch (err) {
      setMessage('حدث خطأ أثناء تحديث بيانات المصنع');
      setMessageColor('#DC3545');
      setShowMessage(true);
      console.error('Error updating factory:', err);
    }
  };

  // حذف المصنع
  const handleDeleteFactory = async () => {
    if (!currentFactory) return;
    
    try {
      await axios.delete(`${API_URL}/factories/${currentFactory.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      setFactories(factories.filter(f => f.id !== currentFactory.id));
      setMessage('تم حذف المصنع بنجاح');
      setMessageColor('#198754');
      setShowMessage(true);
      setShowDeleteModal(false);
    } catch (err) {
      setMessage('حدث خطأ أثناء حذف المصنع');
      setMessageColor('#DC3545');
      setShowMessage(true);
      console.error('Error deleting factory:', err);
    }
  };

  // الحالة إلى لون
  const getStatusBadge = (status) => {
    const statusMap = {
      'نشط': 'success',
      'معلق': 'warning',
      'مكتمل': 'primary'
    };
    return statusMap[status] || 'secondary';
  };

  // معالجة رفع ملف PDF
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      setMessage('الرجاء اختيار ملف PDF فقط');
      setMessageColor('#DC3545');
      setShowMessage(true);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        backgroundColor: '#121212', 
        minHeight: '100vh',
        color: '#f8f9fa'
      }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        backgroundColor: '#121212', 
        minHeight: '100vh',
        color: '#f8f9fa'
      }}>
        <div className="text-center">
          <FaBuilding size={48} className="text-danger mb-3" />
          <h5>{error}</h5>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            className="mt-3"
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="factory-owner-dashboard dark-theme" style={{ 
      backgroundColor: '#121212', 
      minHeight: '100vh',
      padding: '20px 0',
      color: '#f8f9fa'
    }}>
      <Container>
        {/* رسالة النظام */}
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

        {/* العنوان والإحصائيات */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary p-3 rounded me-3">
                <FaBuilding size={32} className="text-white" />
              </div>
              <div>
                <h1 className="fw-bold mb-0 text-white">لوحة تحكم صاحب المصنع</h1>
                <p className="mb-0 text-light">إدارة المصانع المسجلة للاستثمار</p>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* بطاقات الإحصائيات */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">إجمالي المصانع</h6>
                    <h3 className="mb-0 text-white">{factories.length}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <FaBuilding size={24} className="text-primary" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">مكتمل التمويل</h6>
                    <h3 className="mb-0 text-success">
                      {factories.filter(f => f.status === 'مكتمل').length}
                    </h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaChartLine size={24} className="text-success" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">قيد التمويل</h6>
                    <h3 className="mb-0 text-warning">
                      {factories.filter(f => f.status === 'نشط').length}
                    </h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <FaBuilding size={24} className="text-warning" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small text-light">المعلق</h6>
                    <h3 className="mb-0 text-info">
                      {factories.filter(f => f.status === 'معلق').length}
                    </h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <FaChartLine size={24} className="text-info" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* شريط البحث والإجراءات */}
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-dark text-light border-secondary">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="ابحث باسم المصنع أو الصنف أو الموقع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-dark text-light border-secondary"
                  />
                </InputGroup>
              </Col>
              
              <Col md={3}>
                <Form.Select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-dark text-light border-secondary"
                >
                  <option value="الكل">جميع الحالات</option>
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                  <option value="مكتمل">مكتمل</option>
                </Form.Select>
              </Col>
              
              <Col md={4} className="text-end">
                <Button as={NavLink} to={'/factory/registration'} variant="primary" className="me-2">
                  <FaPlus className="me-2" /> إضافة مصنع جديد
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {/* عرض المصانع على شكل بطاقات */}
        <Row className="g-4 mb-5">
          {filteredFactories.map((factory) => (
            <Col md={6} lg={4} key={factory.id}>
              <Card className="h-100 shadow-sm factory-card" style={{ backgroundColor: '#1e1e1e' }}>
                <Card.Body className="text-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="fw-bold mb-1 text-white">{factory.name}</Card.Title>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <Badge bg="secondary" className="fs-6">{factory.category}</Badge>
                        <Badge bg={getStatusBadge(factory.status)} className="fs-6">
                          {factory.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="d-flex">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openEditModal(factory)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => openDeleteModal(factory)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-light small mb-2">{factory.description}</p>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <ProgressBar 
                      now={factory.progress} 
                      variant={factory.progress === 100 ? 'success' : 'primary'} 
                      style={{ height: '8px', width: '100%' }} 
                    />
                    <span className="ms-2 fw-bold text-white">{factory.progress}%</span>
                  </div>
                  
                  <div className="factory-details mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="text-light">
                        <FaDollarSign className="me-1" /> المبلغ المطلوب
                      </div>
                      <div className="fw-bold text-white">{formatCurrency(factory.requiredAmount)}</div>
                    </div>
                    
                    <div className="d-flex mb-2">
                      <div className="text-light me-3">
                        <FaMapMarkerAlt className="me-1" /> الموقع
                      </div>
                      <div className="fw-bold text-white">{factory.location}</div>
                    </div>
                    
                    <div className="d-flex">
                      <div className="text-light me-3">
                        <FaFilePdf className="me-1 text-danger" /> دراسة الجدوى
                      </div>
                      <div>
                        <a href="#" className="text-decoration-none text-info">{factory.feasibilityStudy}</a>
                      </div>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-dark border-secondary text-light small">
                  مسجل في: {factory.registeredDate}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        
        {filteredFactories.length === 0 && !loading && (
          <Card className="border-0 shadow-sm mb-5" style={{ backgroundColor: '#1e1e1e' }}>
            <Card.Body className="text-center py-5 text-white">
              <FaBuilding size={48} className="text-light mb-3" />
              <h5 className="text-white">لا توجد مصانع مطابقة لمعايير البحث</h5>
              <p className="text-light">حاول تغيير معايير البحث أو أضف مصنعاً جديداً</p>
            </Card.Body>
          </Card>
        )}
      </Container>
      
      {/* نموذج تعديل المصنع مع رفع ملف PDF */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        contentClassName="bg-dark text-light"
      >
        <Modal.Header closeButton className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Modal.Title className="text-white">تعديل بيانات المصنع</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFactory && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">اسم المصنع</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentFactory.name}
                    onChange={(e) => setCurrentFactory({...currentFactory, name: e.target.value})}
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">صنف المصنع</Form.Label>
                  <Form.Select 
                    value={currentFactory.category}
                    onChange={(e) => setCurrentFactory({...currentFactory, category: e.target.value})}
                    className="bg-dark text-light border-secondary"
                  >
                    <option value="أثاث">أثاث</option>
                    <option value="بلاستيك">بلاستيك</option>
                    <option value="إلكترونيات">إلكترونيات</option>
                    <option value="ورق وطباعة">ورق وطباعة</option>
                    <option value="أغذية ومشروبات">أغذية ومشروبات</option>
                    <option value="معدات وآلات">معدات وآلات</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">حالة المصنع</Form.Label>
                  <Form.Select 
                    value={currentFactory.status}
                    onChange={(e) => setCurrentFactory({...currentFactory, status: e.target.value})}
                    className="bg-dark text-light border-secondary"
                  >
                    <option value="نشط">نشط</option>
                    <option value="معلق">معلق</option>
                    <option value="مكتمل">مكتمل</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">المبلغ المطلوب (ريال سعودي)</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={currentFactory.requiredAmount}
                    onChange={(e) => setCurrentFactory({...currentFactory, requiredAmount: parseInt(e.target.value) || 0})}
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">تفاصيل الموقع</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={currentFactory.location}
                    onChange={(e) => setCurrentFactory({...currentFactory, location: e.target.value})}
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              
              {/* رفع ملف دراسة الجدوى */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">دراسة الجدوى (PDF)</Form.Label>
                  <div className="border border-secondary rounded p-3 bg-dark">
                    <div className="d-flex justify-content-between align-items-center mb-2 text-white">
                      <div>
                        <FaFilePdf className="text-danger me-2" />
                        <span>{currentFactory.feasibilityStudy}</span>
                      </div>
                      <div>
                        <a href="#" className="text-info me-3">عرض الملف الحالي</a>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Form.Label className="text-white">رفع ملف جديد:</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="bg-dark text-light border-secondary"
                        />
                        <Button variant="outline-light">
                          <FaUpload className="me-1" /> رفع الملف
                        </Button>
                      </InputGroup>
                      {pdfFile && (
                        <div className="mt-2 text-success">
                          <FaInfoCircle className="me-1" /> تم اختيار ملف: {pdfFile.name}
                        </div>
                      )}
                      <Form.Text className="text-light">
                        يمكنك رفع ملف PDF جديد لدراسة الجدوى (الحجم الأقصى 10MB)
                      </Form.Text>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">وصف المصنع</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={currentFactory.description}
                    onChange={(e) => setCurrentFactory({...currentFactory, description: e.target.value})}
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">مستوى التقدم (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0"
                    max="100"
                    value={currentFactory.progress}
                    onChange={(e) => setCurrentFactory({...currentFactory, progress: parseInt(e.target.value) || 0})}
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-light" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            حفظ التغييرات
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* نموذج تأكيد الحذف */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        contentClassName="bg-dark text-light"
      >
        <Modal.Header closeButton className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Modal.Title className="text-white">تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFactory && (
            <div className="text-center text-white">
              <FaTrash size={48} className="text-danger mb-3" />
              <h5 className="text-white">هل أنت متأكد من حذف المصنع؟</h5>
              <p className="text-light">
                سيتم حذف مصنع <strong className="text-warning">{currentFactory.name}</strong> بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-light" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDeleteFactory}>
            <FaTrash className="me-1" /> حذف المصنع
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyFactories;