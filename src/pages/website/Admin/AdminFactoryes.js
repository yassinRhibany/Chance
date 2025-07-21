import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, Button, 
  Badge, InputGroup, Modal, Spinner, Alert, Dropdown
} from 'react-bootstrap';
import { 
  FaIndustry, FaSearch, FaEdit, FaTrash, FaFilePdf, 
  FaFilter, FaSync, FaExclamationTriangle, FaPlus, FaTimes, FaInfoCircle,
  FaCheckCircle, FaTimesCircle, FaEllipsisV
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const FactoryManagement = () => {
  // Application states
  const [factories, setFactories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [factoryCategories, setFactoryCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const { user } = useAuth();
const token=user.token; 
 console.log(categoryToDelete);
  // Base API URL
  const API_URL = 'http://127.0.0.1:8000/api';
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchFactories();
  }, []);

  // Function to fetch factories from API
  const fetchFactories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch categories
      const categoriesResponse = await axios.get(`${API_URL}/categories/index`);
      setFactoryCategories(categoriesResponse.data);

      const response = await axios.get(`${API_URL}/factories/getAllFactories`);
      const processedFactories = response.data.map(factory => ({
        id: factory.id?.toString() || 'غير محدد',
        name: factory.name?.toString() || 'بدون اسم',
        address: factory.address?.toString() || 'غير محدد',
        status: factory.status?.toString() || 'pending',
        category: factory.category?.name?.toString() || 'غير محدد',
        feasibility_pdf: factory.feasibility_pdf || null
      }));
      
      setFactories(processedFactories);
    } catch (err) {
      setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter factories
  const filteredFactories = factories.filter(factory => {
    return (
      factory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.address.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      statusFilter === 'الكل' || 
      (statusFilter === 'نشط' && factory.status === 'approved') ||
      (statusFilter === 'معلق' && factory.status === 'pending') ||
      (statusFilter === 'معطل' && factory.status === 'rejected')
    ) && (
      categoryFilter === 'الكل' ||
      factory.category === categoryFilter
    );
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'primary';
    }
  };

  // Translate status for display
  const translateStatus = (status) => {
    switch(status) {
      case 'approved': return 'مقبول';
      case 'pending': return 'معلق';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = ['#6f42c1', '#d63384', '#fd7e14', '#20c997', '#0dcaf0'];
    const index = factoryCategories.findIndex(cat => cat.name === category) % colors.length;
    return colors[index] || '#6c757d';
  };

  // Open edit modal
  const openEditModal = (factory) => {
    setSelectedFactory(factory);
    setPdfFile(null);
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (factory) => {
    setSelectedFactory(factory);
    setShowDeleteModal(true);
  };

  // Open status modal
  const openStatusModal = (factory, status) => {
    setSelectedFactory(factory);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  // Handle factory update
  const handleUpdateFactory = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!selectedFactory.name || !selectedFactory.address) {
        setMessage('الرجاء إدخال اسم المصنع وعنوانه');
        setMessageColor('danger');
        setShowMessage(true);
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('name', selectedFactory.name);
      formData.append('address', selectedFactory.address);
      
      // Add PDF file if selected
      if (pdfFile) {
        formData.append('feasibility_pdf', pdfFile);
      }

      // Send request
      const response = await axios.post(
        `${API_URL}/factories/updateFactory/${selectedFactory.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // On success
      setMessage('تم تحديث بيانات المصنع بنجاح');
      setMessageColor('success');
      setShowMessage(true);
      
      // Close modal and refresh data
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

  // Delete factory
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

  // Update factory status
  const updateFactoryStatus = async () => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('status', newStatus);
      
      await axios.post(
        `${API_URL}/factories/updateFactoryStatus/${selectedFactory.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage(`تم تغيير حالة المصنع إلى ${translateStatus(newStatus)} بنجاح`);
      setMessageColor('success');
      setShowMessage(true);
      
      setShowStatusModal(false);
      fetchFactories();
      
    } catch (error) {
      console.error('حدث خطأ:', error);
      setMessage(error.response?.data?.message || 'حدث خطأ أثناء تغيير الحالة');
      setMessageColor('danger');
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new category
  const addNewCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryError('يجب إدخال اسم الصنف');
      return;
    }
    
    if (factoryCategories.some(cat => cat.name === newCategory)) {
      setCategoryError('هذا الصنف موجود بالفعل');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/categories/store`, {
        name: newCategory
      });
      
      setFactoryCategories([...factoryCategories, {
        ...response.data,
        name: response.data.name?.toString() || newCategory
      }]);
      setNewCategory('');
      setShowAddCategoryModal(false);
      setCategoryError('');
    } catch (err) {
      setCategoryError('فشل في إضافة الصنف الجديد');
      console.error('Error adding category:', err);
    } finally {
      setIsLoading(false);
    }
  };


  // Delete category
  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/categories/destroy/${categoryToDelete.id}`, " ",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            
          }
        }
       
       
      );
      
       console.log(categoryToDelete);
     
      
      setFactoryCategories(factoryCategories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      
      setShowDeleteCategoryModal(false);
      
      // Update factories using this category
      const updatedFactories = factories.map(factory => {
        if (factory.category === categoryToDelete.name) {
          return { ...factory, category: 'أخرى' };
        }
        return factory;
      });
      setFactories(updatedFactories);
    } catch (err) {
      setError('فشل في حذف الصنف');
      console.error('Error deleting category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render categories list
  const renderCategoriesList = () => {
    return (
      <div className="mt-4">
        <h6>الأصناف الحالية:</h6>
        <div className="d-flex flex-wrap gap-2">
          {factoryCategories.map((category) => (
            <Badge 
              key={category.id}
              pill 
              style={{ 
                backgroundColor: getCategoryColor(category.name),
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
              className="d-flex align-items-center"
            >
              {category.name?.toString() || 'صنف غير معروف'}
              <FaTimes 
                size={12} 
                className="ms-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryToDelete(category);
                  setShowDeleteCategoryModal(true);
                }}
              />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      <Container fluid className="py-4">
        {/* Error message if data fetch fails */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <FaExclamationTriangle className="me-2" />
            {error}
            <Button variant="outline-light" size="sm" className="ms-3" onClick={fetchFactories}>
              <FaSync /> إعادة المحاولة
            </Button>
          </Alert>
        )}
        
        {/* Success/error message */}
        {showMessage && (
          <Alert 
            variant={messageColor} 
            className="mb-4" 
            onClose={() => setShowMessage(false)} 
            dismissible
          >
            {message}
          </Alert>
        )}
        
        {/* Main title */}
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
        
        {/* Quick statistics cards */}
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
                    <h6 className="text-uppercase small" style={{ color: '#aaa' }}>المصانع المقبولة</h6>
                    <h3 className="mb-0 text-success">
                      {factories.filter(f => f.status === 'approved').length}
                    </h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <FaCheckCircle size={24} className="text-success" />
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
                      {factories.filter(f => f.status === 'pending').length}
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
              borderLeft: '4px solid #dc3545',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small" style={{ color: '#aaa' }}>المصانع المرفوضة</h6>
                    <h3 className="mb-0 text-danger">
                      {factories.filter(f => f.status === 'rejected').length}
                    </h3>
                  </div>
                  <div className="bg-danger bg-opacity-10 p-3 rounded">
                    <FaTimesCircle size={24} className="text-danger" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Factories list card */}
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
            {/* Search and filter tools */}
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
                  <option value="نشط">مقبول</option>
                  <option value="معلق">معلق</option>
                  <option value="معطل">مرفوض</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <InputGroup>
                  <Form.Select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ 
                      backgroundColor: '#333', 
                      border: '1px solid #555',
                      color: '#e0e0e0'
                    }}
                  >
                    <option value="الكل">كل الأصناف</option>
                    {factoryCategories.map((category, index) => (
                      <option key={index} value={category.name}>{category.name?.toString() || 'صنف غير معروف'}</option>
                    ))}
                  </Form.Select>
                  <Button 
                    variant="outline-success" 
                    onClick={() => setShowAddCategoryModal(true)}
                    style={{ borderColor: '#555' }}
                  >
                    <FaPlus />
                  </Button>
                </InputGroup>
              </Col>

            </Row>
            
            {/* Factories table */}
            <div style={{height: "50vh"}} className="table-responsive">
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
                      <td colSpan="7" className="text-center py-5">
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
                            {translateStatus(factory.status)}
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
                        <td  className="text-center">
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-actions">
                              <FaEllipsisV />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="bg-dark border-secondary">
                              <Dropdown.Item 
                                className="text-light" 
                                onClick={() => openEditModal(factory)}
                              >
                                <FaEdit className="me-2 text-primary" /> تعديل
                              </Dropdown.Item>
                              <Dropdown.Item 
                                className="text-light" 
                                onClick={() => openStatusModal(factory, 'approved')}
                                disabled={factory.status === 'approved'}
                              >
                                <FaCheckCircle className="me-2 text-success" /> قبول
                              </Dropdown.Item>
                              <Dropdown.Item 
                                className="text-light" 
                                onClick={() => openStatusModal(factory, 'rejected')}
                                disabled={factory.status === 'rejected'}
                              >
                                <FaTimesCircle className="me-2 text-danger" /> رفض
                              </Dropdown.Item>
                              <Dropdown.Divider className="bg-secondary" />
                              <Dropdown.Item 
                                className="text-light" 
                                onClick={() => openDeleteModal(factory)}
                              >
                                <FaTrash className="me-2 text-danger" /> حذف
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ backgroundColor: '#252525' }}>
                      <td colSpan="7" className="text-center py-4">
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
        
        {/* Edit factory modal */}
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
        
        {/* Status change modal */}
        <Modal 
          show={showStatusModal} 
          onHide={() => setShowStatusModal(false)} 
          centered
          contentClassName="bg-dark text-light"
        >
          <Modal.Header 
            closeButton 
            closeVariant="white"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <Modal.Title className="d-flex align-items-center">
              {newStatus === 'approved' ? (
                <FaCheckCircle className="me-2 text-success" />
              ) : (
                <FaTimesCircle className="me-2 text-danger" />
              )}
              {newStatus === 'approved' ? 'قبول المصنع' : 'رفض المصنع'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {selectedFactory && (
              <>
                <div className="mb-4">
                  {newStatus === 'approved' ? (
                    <FaCheckCircle size={48} className="text-success mb-3" />
                  ) : (
                    <FaTimesCircle size={48} className="text-danger mb-3" />
                  )}
                  <h4>
                    هل أنت متأكد من {newStatus === 'approved' ? 'قبول' : 'رفض'} هذا المصنع؟
                  </h4>
                  <p className="text-muted">
                    {newStatus === 'approved' ? 
                      'سيتم تفعيل المصنع في النظام' : 
                      'سيتم تعطيل المصنع ولن يكون متاحاً للاستخدام'}
                  </p>
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
                      <strong>الحالة الحالية:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      <Badge bg={getStatusBadge(selectedFactory.status)}>
                        {translateStatus(selectedFactory.status)}
                      </Badge>
                    </Col>
                  </Row>
                </div>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="outline-secondary" size="lg" onClick={() => setShowStatusModal(false)}>
                    إلغاء
                  </Button>
                  <Button 
                    variant={newStatus === 'approved' ? 'success' : 'danger'} 
                    size="lg" 
                    onClick={updateFactoryStatus}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" />
                        <span className="ms-2">جاري التحديث...</span>
                      </>
                    ) : (
                      <>
                        {newStatus === 'approved' ? 
                          <FaCheckCircle className="me-1" /> : 
                          <FaTimesCircle className="me-1" />}
                        {newStatus === 'approved' ? 'تأكيد القبول' : 'تأكيد الرفض'}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
        
        {/* Delete factory modal */}
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
                        {translateStatus(selectedFactory.status)}
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

        {/* Add category modal */}
        <Modal 
          show={showAddCategoryModal} 
          onHide={() => setShowAddCategoryModal(false)} 
          centered
          contentClassName="bg-dark text-light"
        >
          <Modal.Header 
            closeButton 
            closeVariant="white"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <Modal.Title className="d-flex align-items-center">
              <FaPlus className="me-2 text-success" /> إضافة صنف جديد
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="newCategory" className="mb-3">
              <Form.Label>اسم الصنف الجديد</Form.Label>
              <Form.Control
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-dark text-light"
                placeholder="أدخل اسم الصنف الجديد"
              />
              {categoryError && (
                <Form.Text className="text-danger">{categoryError}</Form.Text>
              )}
            </Form.Group>
            {renderCategoriesList()}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#1a1a1a" }}>
            <Button variant="outline-secondary" onClick={() => setShowAddCategoryModal(false)}>
              إلغاء
            </Button>
            <Button 
              variant="success" 
              onClick={addNewCategory}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" />
                  <span className="ms-2">جاري الإضافة...</span>
                </>
              ) : 'إضافة الصنف'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete category modal */}
        <Modal 
          show={showDeleteCategoryModal} 
          onHide={() => setShowDeleteCategoryModal(false)} 
          centered
          contentClassName="bg-dark text-light"
        >
          <Modal.Header 
            closeButton 
            closeVariant="white"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <Modal.Title className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2 text-danger" /> تأكيد حذف الصنف
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {categoryToDelete && (
              <>
                <div className="mb-4">
                  <FaExclamationTriangle size={48} className="text-danger mb-3" />
                  <h4>هل أنت متأكد من حذف الصنف "{categoryToDelete.name}"؟</h4>
                  <p className="text-muted">سيتم تغيير تصنيف المصانع المرتبطة بهذا الصنف إلى "أخرى"</p>
                </div>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="outline-secondary" size="lg" onClick={() => setShowDeleteCategoryModal(false)}>
                    إلغاء
                  </Button>
                  <Button 
                    variant="danger" 
                    size="lg" 
                    onClick={deleteCategory}
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