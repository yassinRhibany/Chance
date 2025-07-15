import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, InputGroup, Spinner, Dropdown } from 'react-bootstrap';
import { FaBuilding, FaEdit, FaTrash, FaMapMarkerAlt, FaFilePdf, FaSearch, FaPlus, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaTags } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';
import Message from '../../../components/Message.js/Message';

const MyFactories = () => {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [currentFactory, setCurrentFactory] = useState({
    name: '',
    address: '',
    feasibility_pdf: null,
    status: ''
  });
  const [newStatus, setNewStatus] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  const { user } = useAuth();
  const API_URL = 'http://127.0.0.1:8000/api';

  const formatDateForDisplay = (date) => {
    if (!date) return 'غير محدد';
    try {
      if (typeof date === 'object' && date.date) {
        return new Date(date.date).toLocaleDateString('ar-SA');
      }
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString('ar-SA');
      }
      if (typeof date === 'number') {
        return new Date(date).toLocaleDateString('ar-SA');
      }
      return date.toString();
    } catch (e) {
      console.error('خطأ في تحويل التاريخ:', e);
      return 'غير محدد';
    }
  };

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await axios.get(`${API_URL}/factories/indexForUser`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        let factoriesData = [];
        if (Array.isArray(response.data)) {
          factoriesData = response.data;
        } 
        else if (response.data?.data && Array.isArray(response.data.data)) {
          factoriesData = response.data.data;
        }
        else if (response.data?.factories && Array.isArray(response.data.factories)) {
          factoriesData = response.data.factories;
        }
        else if (response.data && typeof response.data === 'object') {
          factoriesData = [response.data];
        }
        
        const processedFactories = (factoriesData || []).map(factory => ({
          id: factory.id?.toString() || '',
          name: factory.name?.toString() || 'بدون اسم',
          status: factory.status?.toString() || 'pending',
          address: factory.address?.toString() || 'غير محدد',
          feasibility_pdf: factory.feasibility_pdf || null,
          registeredDate: formatDateForDisplay(factory.registeredDate),
          category: factory.category?.name || 'غير محدد'
        }));
        
        setFactories(processedFactories);
      } catch (err) {
        setError('فشل في تحميل بيانات المصانع');
        setFactories([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchFactories();
  }, [user]);

  const filteredFactories = factories.filter(factory => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const name = factory.name?.toLowerCase() || '';
    const address = factory.address?.toLowerCase() || '';
    const status = factory.status || '';
    
    const matchesSearch = name.includes(lowerSearchTerm) || address.includes(lowerSearchTerm);
    const matchesStatus = statusFilter === 'الكل' || 
                         (statusFilter === 'نشط' && status === 'approved') ||
                         (statusFilter === 'معلق' && status === 'pending') ||
                         (statusFilter === 'مرفوض' && status === 'rejected');
    
    return matchesSearch && matchesStatus;
  });

  const openEditModal = (factory) => {
    setCurrentFactory(factory);
    setPdfFile(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (factory) => {
    setCurrentFactory(factory);
    setShowDeleteModal(true);
  };

  const openStatusModal = (factory, status) => {
    setCurrentFactory(factory);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const handleUpdateFactory = async () => {
    try {
      if (!currentFactory.name || !currentFactory.address) {
        alert('الرجاء إدخال جميع الحقول المطلوبة');
        return;
      }

      const formData = new FormData();
      formData.append('name', currentFactory.name);
      formData.append('address', currentFactory.address);
      
      if (pdfFile) formData.append('feasibility_pdf', pdfFile);

      const response = await fetch(`${API_URL}/factories/updateFactory/${currentFactory.id}`, {
        method: 'POST',
        body: formData
      });
     
      if (!response.ok) throw new Error('فشل في تحديث البيانات');
      
      const result = await response.json();
      setMessage('تم تحديث بيانات المصنع بنجاح');
      setMessageColor('#198754');
      setShowMessage(true);
      setShowEditModal(false);
      
      setFactories(factories.map(f => 
        f.id === currentFactory.id ? { ...f, ...result } : f
      ));
    } catch (error) {
      setMessage('حدث خطأ أثناء تحديث البيانات');
      setMessageColor('#DC3545');
      setShowMessage(true);
      console.error('Error:', error);
    }
  };

  const handleDeleteFactory = async () => {
    try {
      await axios.delete(`${API_URL}/factories/${currentFactory.id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
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
    }
  };

  const updateFactoryStatus = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('status', newStatus);
      
      const response = await axios.post(
        `${API_URL}/factories/updateFactoryStatus/${currentFactory.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage(`تم تغيير حالة المصنع إلى ${translateStatus(newStatus)} بنجاح`);
      setMessageColor('#198754');
      setShowMessage(true);
      
      setShowStatusModal(false);
      setFactories(factories.map(f => 
        f.id === currentFactory.id ? { ...f, status: newStatus } : f
      ));
    } catch (error) {
      console.error('حدث خطأ:', error);
      setMessage(error.response?.data?.message || 'حدث خطأ أثناء تغيير الحالة');
      setMessageColor('#DC3545');
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/factory-categories`,
        { name: newCategoryName },
        { headers: { 'Authorization': `Bearer ${user.token}` } }
      );

      setMessage('تم إضافة الصنف بنجاح');
      setMessageColor('#198754');
      setShowMessage(true);
      setShowAddCategoryModal(false);
      setNewCategoryName('');
      
      // يمكنك هنا إعادة تحميل بيانات المصانع إذا كانت تحتوي على الأصناف
      // fetchFactories();
    } catch (error) {
      setMessage('حدث خطأ أثناء إضافة الصنف');
      setMessageColor('#DC3545');
      setShowMessage(true);
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const translateStatus = (status) => {
    switch(status) {
      case 'approved': return 'مقبول';
      case 'pending': return 'معلق';
      case 'rejected': return 'مرفوض';
      default: return status;
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
        
        <Row className="mb-4 g-3">
          {['الكل', 'معلق', 'مقبول', 'مرفوض'].map((status, index) => (
            <Col md={3} key={index}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: '#1e1e1e' }}>
                <Card.Body className="text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase small text-light">
                        {status === 'الكل' ? 'إجمالي المصانع' : status}
                      </h6>
                      <h3 className="mb-0 text-white">
                        {status === 'الكل' ? factories.length : 
                         factories.filter(f => 
                           (status === 'معلق' && f.status === 'pending') ||
                           (status === 'مقبول' && f.status === 'approved') ||
                           (status === 'مرفوض' && f.status === 'rejected')
                         ).length}
                      </h3>
                    </div>
                    <div className={`bg-${getStatusBadge(
                      status === 'معلق' ? 'pending' : 
                      status === 'مقبول' ? 'approved' : 
                      status === 'مرفوض' ? 'rejected' : 'secondary'
                    )} bg-opacity-10 p-3 rounded`}>
                      {status === 'مقبول' ? (
                        <FaCheckCircle size={24} className="text-success" />
                      ) : status === 'مرفوض' ? (
                        <FaTimesCircle size={24} className="text-danger" />
                      ) : (
                        <FaBuilding size={24} className={
                          status === 'معلق' ? 'text-warning' : 'text-secondary'
                        } />
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-dark text-light border-secondary">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="ابحث باسم المصنع أو العنوان..."
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
                  <option value="معلق">معلق</option>
                  <option value="مقبول">مقبول</option>
                  <option value="مرفوض">مرفوض</option>
                </Form.Select>
              </Col>
              
              <Col md={5} className="text-end">
                <Button 
                  variant="success" 
                  className="me-2"
                  onClick={() => setShowAddCategoryModal(true)}
                >
                  <FaTags className="me-2" /> إضافة صنف جديد
                </Button>
                <Button as={NavLink} to={'/factory/registration'} variant="primary">
                  <FaPlus className="me-2" /> إضافة مصنع جديد
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Row className="g-4 mb-5">
          {filteredFactories.map((factory) => (
            <Col md={6} lg={4} key={factory.id}>
              <Card className="h-100 shadow-sm factory-card" style={{ backgroundColor: '#1e1e1e' }}>
                <Card.Body className="text-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="fw-bold mb-1 text-white">{factory.name}</Card.Title>
                      <Badge bg={getStatusBadge(factory.status)} className="fs-6">
                        {translateStatus(factory.status)}
                      </Badge>
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
                      
                      {factory.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openStatusModal(factory, 'approved')}
                          >
                            <FaCheckCircle />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => openStatusModal(factory, 'rejected')}
                          >
                            <FaTimesCircle />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="factory-details mb-3">
                    <div className="d-flex mb-2">
                      <div className="text-light me-3">
                        <FaMapMarkerAlt className="me-1" /> الموقع
                      </div>
                      <div className="fw-bold text-white">{factory.address}</div>
                    </div>
                    
                    <div className="d-flex mb-2">
                      <div className="text-light me-3">
                        <FaTags className="me-1" /> الصنف
                      </div>
                      <div className="fw-bold text-white">{factory.category}</div>
                    </div>
                    
                    <div className="d-flex">
                      <div className="text-light me-3">
                        <FaFilePdf className="me-1 text-danger" /> دراسة الجدوى
                      </div>
                      <div>
                        {factory.feasibility_pdf ? (
                          <a 
                            href={factory.feasibility_pdf.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none text-info"
                          >
                            عرض الملف
                          </a>
                        ) : (
                          <span className="text-muted">لا يوجد ملف</span>
                        )}
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
            </Card.Body>
          </Card>
        )}
      </Container>
      
      {/* نافذة إضافة صنف جديد */}
      <Modal 
        show={showAddCategoryModal} 
        onHide={() => setShowAddCategoryModal(false)} 
        centered
        contentClassName="bg-dark text-light"
      >
        <Modal.Header 
          closeButton 
          closeVariant="white"
          className="border-secondary" 
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <Modal.Title className="d-flex align-items-center text-white">
            <FaTags className="me-2 text-success" /> إضافة صنف جديد
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">اسم الصنف</Form.Label>
            <Form.Control 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-dark text-light border-secondary"
              placeholder="أدخل اسم الصنف الجديد"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-light" onClick={() => setShowAddCategoryModal(false)}>
            إلغاء
          </Button>
          <Button 
            variant="success" 
            onClick={handleAddCategory}
            disabled={!newCategoryName || loading}
          >
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" className="me-2" />
                جاري الإضافة...
              </>
            ) : (
              'إضافة الصنف'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* نافذة تعديل المصنع */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        contentClassName="bg-dark text-light"
      >
        <Modal.Header 
          closeButton 
          closeVariant="white"
          className="border-secondary" 
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <Modal.Title className="text-white">تعديل بيانات المصنع</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">اسم المصنع</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentFactory.name}
                  onChange={(e) => setCurrentFactory({...currentFactory, name: e.target.value})}
                  className="bg-dark text-light border-secondary"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">عنوان المصنع</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentFactory.address}
                  onChange={(e) => setCurrentFactory({...currentFactory, address: e.target.value})}
                  className="bg-dark text-light border-secondary"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">دراسة الجدوى (PDF)</Form.Label>
                <div className="border border-secondary rounded p-3 bg-dark">
                  {currentFactory.feasibility_pdf ? (
                    <div className="d-flex justify-content-between align-items-center mb-2 text-white">
                      <div>
                        <FaFilePdf className="text-danger me-2" />
                        <span>{currentFactory.feasibility_pdf.name || 'ملف دراسة الجدوى'}</span>
                      </div>
                      <div>
                        <a 
                          href={currentFactory.feasibility_pdf.url || "#"} 
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
                      className="bg-dark text-light border-secondary"
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
        </Modal.Body>
        <Modal.Footer className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-light" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleUpdateFactory}>
            حفظ التغييرات
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* نافذة تغيير حالة المصنع */}
      <Modal 
        show={showStatusModal} 
        onHide={() => setShowStatusModal(false)} 
        centered
        contentClassName="bg-dark text-light"
      >
        <Modal.Header 
          closeButton 
          closeVariant="white"
          className="border-secondary" 
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <Modal.Title className="d-flex align-items-center text-white">
            {newStatus === 'approved' ? (
              <FaCheckCircle className="me-2 text-success" />
            ) : (
              <FaTimesCircle className="me-2 text-danger" />
            )}
            {newStatus === 'approved' ? 'قبول المصنع' : 'رفض المصنع'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            {newStatus === 'approved' ? (
              <FaCheckCircle size={48} className="text-success mb-3" />
            ) : (
              <FaTimesCircle size={48} className="text-danger mb-3" />
            )}
            <h4 className="text-white">
              هل أنت متأكد من {newStatus === 'approved' ? 'قبول' : 'رفض'} هذا المصنع؟
            </h4>
            <p className="text-muted">
              {newStatus === 'approved' ? 
                'سيتم تفعيل المصنع في النظام' : 
                'سيتم تعطيل المصنع ولن يكون متاحاً للاستخدام'}
            </p>
          </div>
          
          <div className="border border-secondary rounded p-4 mb-4" style={{ backgroundColor: '#1e1e1e' }}>
            <Row className="mb-3">
              <Col md={4} className="text-end text-light">
                <strong>اسم المصنع:</strong>
              </Col>
              <Col md={8} className="text-start text-white">
                {currentFactory.name}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4} className="text-end text-light">
                <strong>رقم المصنع:</strong>
              </Col>
              <Col md={8} className="text-start text-white">
                {currentFactory.id}
              </Col>
            </Row>
            <Row>
              <Col md={4} className="text-end text-light">
                <strong>الحالة الحالية:</strong>
              </Col>
              <Col md={8} className="text-start">
                <Badge bg={getStatusBadge(currentFactory.status)}>
                  {translateStatus(currentFactory.status)}
                </Badge>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-light" onClick={() => setShowStatusModal(false)}>
            إلغاء
          </Button>
          <Button 
            variant={newStatus === 'approved' ? 'success' : 'danger'} 
            onClick={updateFactoryStatus}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" className="me-2" />
                جاري التحديث...
              </>
            ) : newStatus === 'approved' ? (
              'تأكيد القبول'
            ) : (
              'تأكيد الرفض'
            )}
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
          className="border-secondary" 
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <Modal.Title className="d-flex align-items-center text-white">
            <FaTimesCircle className="me-2 text-danger" /> تأكيد الحذف
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <FaTimesCircle size={48} className="text-danger mb-3" />
            <h4 className="text-white">هل أنت متأكد من حذف هذا المصنع؟</h4>
            <p className="text-muted">هذا الإجراء لا يمكن التراجع عنه</p>
          </div>
          
          <div className="border border-secondary rounded p-4 mb-4" style={{ backgroundColor: '#1e1e1e' }}>
            <Row className="mb-3">
              <Col md={4} className="text-end text-light">
                <strong>اسم المصنع:</strong>
              </Col>
              <Col md={8} className="text-start text-white">
                {currentFactory.name}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4} className="text-end text-light">
                <strong>رقم المصنع:</strong>
              </Col>
              <Col md={8} className="text-start text-white">
                {currentFactory.id}
              </Col>
            </Row>
            <Row>
              <Col md={4} className="text-end text-light">
                <strong>الحالة:</strong>
              </Col>
              <Col md={8} className="text-start">
                <Badge bg={getStatusBadge(currentFactory.status)}>
                  {translateStatus(currentFactory.status)}
                </Badge>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-secondary" style={{ backgroundColor: '#1a1a1a' }}>
          <Button variant="outline-light" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteFactory}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" className="me-2" />
                جاري الحذف...
              </>
            ) : (
              'تأكيد الحذف'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyFactories;