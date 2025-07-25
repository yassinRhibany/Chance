import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, InputGroup, Spinner } from 'react-bootstrap';
import { FaBuilding, FaEdit, FaTrash, FaMapMarkerAlt, FaFilePdf, FaSearch, FaPlus, FaInfoCircle } from 'react-icons/fa';
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
  const [currentFactory, setCurrentFactory] = useState({
    name: '',
    address: '',
    feasibility_pdf: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showAddOpportunityModal, setShowAddOpportunityModal] = useState(false);
  const [opportunityData, setOpportunityData] = useState({
    target_amount: '',
    minimum_target: '',
    strtup: '',
    payout_frequency: 'monthly',
    profit_percentage: '',
    descrption: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  console.log(user.token)
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
console.log(response)
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
          status: factory.status?.toString() || 'غير محدد',
          address: factory.address?.toString() || 'غير محدد',
          feasibility_pdf: factory.feasibility_pdf || null,
          registeredDate: formatDateForDisplay(factory.registeredDate),
          user_id: factory.user_id || 'غير محدد',
          category_id: factory.category_id || 'غير محدد',
          user_id: factory.user_id || 'غير محدد',
          is_active: factory.is_active || 'غير محدد',
          created_at: factory.created_at || 'غير محدد',
          updated_at: factory.updated_at || 'غير محدد',
          category: factory.category.name || 'غير محدد'
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
    const matchesStatus = statusFilter === 'الكل' || status === statusFilter;

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
      setTimeout(() => {
        window.location.reload();
      }, 2000);

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

  const getStatusBadge = (status) => {
    const statusMap = {
      'approved': 'success',
      'rejected': 'danger',
      'pending': 'primary'
    };
    return statusMap[status] || 'secondary';
  };

  const handleAddOpportunity = async (factoryId) => {
    setIsSubmitting(true);
    try {
      if (!user?.token) {
        alert('يجب تسجيل الدخول أولاً');
        return;
      }

      // Validate required fields
      if (!opportunityData.target_amount || !opportunityData.minimum_target ||
        !opportunityData.strtup || !opportunityData.profit_percentage) {
        alert('الرجاء إدخال جميع الحقول المطلوبة');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const response = await axios.post(
        `${API_URL}/InvestmentOpprtunities/storeoppertunitiy/${factoryId}`,
        opportunityData,
        config
      );

      setShowAddOpportunityModal(false);
      setMessage('تمت إضافة الفرصة الاستثمارية بنجاح');
      setMessageColor('#198754');
      setShowMessage(true);

      // Reset form
      setOpportunityData({
        target_amount: '',
        minimum_target: '',
        strtup: '',
        payout_frequency: 'monthly',
        profit_percentage: '',
        descrption: ''
      });

      // Refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert('انتهت جلستك، يرجى تسجيل الدخول مرة أخرى');
            break;
          case 403:
            alert('ليس لديك صلاحية لإضافة فرص استثمارية');
            break;
          case 422:
            setValidationErrors(error.response.data.errors || {});
            alert('يوجد أخطاء في البيانات المدخلة');
            break;
          default:
            alert('حدث خطأ في الخادم: ' + error.response.status);
        }
      } else if (error.request) {
        alert('لا يوجد اتصال بالخادم');
      } else {
        alert('حدث خطأ أثناء إعداد الطلب');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const processedValue =
      name === 'target_amount' || name === 'minimum_target' || name === 'profit_percentage'
        ? Number(value)
        : value;

    setOpportunityData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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
          {['الكل', 'نشط', 'معلق', 'مكتمل'].map((status, index) => (
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
                          factories.filter(f => f.status === status).length}
                      </h3>
                    </div>
                    <div className={`bg-${getStatusBadge(status)} bg-opacity-10 p-3 rounded`}>
                      <FaBuilding size={24} className={`text-${getStatusBadge(status)}`} />
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
              <Col md={5}>
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

        <Row className="g-4 mb-5">
          {filteredFactories.map((factory) => (
            <Col md={6} lg={4} key={factory.id}>
              <Card className="h-100 shadow-sm factory-card" style={{ backgroundColor: 'var(--primary-dark)' }}>
                <Card.Body className="text-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="fw-bold mb-1" style={{ color: 'var(--light-text)' }}>{factory.name}</Card.Title>
                      <Badge bg={getStatusBadge(factory.status)} className="fs-6">
                        {factory.status}
                      </Badge>
                    </div>
                    <div className="d-flex">
                      {factory.status === 'pending' && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEditModal(factory)}
                          style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                        >
                          <FaEdit />
                        </Button>
                      )}

                    </div>
                  </div>

                  <div className="factory-details mb-3">
                    <div className="d-flex mb-2">
                      <div className="text-light me-3">
                        <FaMapMarkerAlt className="me-1" /> الموقع
                      </div>
                      <div className="fw-bold" style={{ color: 'var(--light-text)' }}>{factory.address}</div>
                    </div>

                    <div className="d-flex">
                      <div className="text-light me-3">
                        <FaFilePdf className="me-1 text-danger" /> دراسة الجدوى
                      </div>
                      <div>
                        <a href="#" className="text-decoration-none" style={{ color: 'var(--accent)' }}>
                          {factory.feasibility_pdf?.name || 'لا يوجد ملف'}
                        </a>
                      </div>
                    </div>
                    <div style={{ padding: "20px 10px", display: "flex" }}>

                      {factory.status === 'approved' && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setCurrentFactory(factory);
                            setShowAddOpportunityModal(true);
                          }}
                          style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                        >
                          <FaPlus /> اضافة فرصة
                        </Button>
                      )}
                      <Button
                        as={NavLink}
                        to={"/factory/FactoryDetails"}
                        variant="primary"
                        className="me-2"
                        state={{ item: factory }}
                        
                      >
                        <FaInfoCircle className="me-2" /> عرض تفاصيل المصنع
                      </Button>
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

        {/* Add Investment Opportunity Modal */}
        <Modal show={showAddOpportunityModal} onHide={() => setShowAddOpportunityModal(false)}>
          <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)' }}>
            <Modal.Title>إضافة فرصة استثمارية</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: 'var(--primary-dark)', color: 'var(--light-text)' }}>
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleAddOpportunity(currentFactory.id);
            }}>
              <Form.Group className="mb-3">
                <Form.Label>المبلغ المستهدف *</Form.Label>
                <Form.Control
                  type="number"
                  name="target_amount"
                  value={opportunityData.target_amount}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.target_amount}
                  required
                  style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)', borderColor: 'var(--accent)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.target_amount?.join(', ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>الحد الأدنى للاستثمار *</Form.Label>
                <Form.Control
                  type="number"
                  name="minimum_target"
                  value={opportunityData.minimum_target}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.minimum_target}
                  required
                  style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)', borderColor: 'var(--accent)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.minimum_target?.join(', ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>تاريخ البدء *</Form.Label>
                <Form.Control
                  type="date"
                  name="strtup"
                  value={opportunityData.strtup}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.strtup}
                  required
                  style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)', borderColor: 'var(--accent)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.strtup?.join(', ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>تكرار الدفع *</Form.Label>
                <Form.Select
                  name="payout_frequency"
                  value={opportunityData.payout_frequency}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.payout_frequency}
                  required
                  style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)', borderColor: 'var(--accent)' }}
                >
                  <option value="monthly">شهري</option>
                  <option value="quarterly">ربع سنوي</option>
                  <option value="yearly">سنوي</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.payout_frequency?.join(', ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>نسبة الربح (%) *</Form.Label>
                <Form.Control
                  type="number"
                  name="profit_percentage"
                  value={opportunityData.profit_percentage}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.profit_percentage}
                  required
                  style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)', borderColor: 'var(--accent)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.profit_percentage?.join(', ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>الوصف</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descrption"
                  value={opportunityData.descrption}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.descrption}
                  style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)', borderColor: 'var(--accent)' }}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.descrption?.join(', ')}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowAddOpportunityModal(false)}
                  style={{ backgroundColor: 'var(--secondary-dark)', borderColor: 'var(--accent)', color: 'var(--light-text)' }}
                >
                  إلغاء
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--primary-dark)' }}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">جاري الحفظ...</span>
                    </>
                  ) : 'حفظ الفرصة'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Factory Modal */}
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
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">اسم المصنع</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentFactory.name}
                    onChange={(e) => setCurrentFactory({ ...currentFactory, name: e.target.value })}
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
                    onChange={(e) => setCurrentFactory({ ...currentFactory, address: e.target.value })}
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

        {filteredFactories.length === 0 && !loading && (
          <Card className="border-0 shadow-sm mb-5" style={{ backgroundColor: '#1e1e1e' }}>
            <Card.Body className="text-center py-5 text-white">
              <FaBuilding size={48} className="text-light mb-3" />
              <h5 className="text-white">لا توجد مصانع مطابقة لمعايير البحث</h5>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default MyFactories;