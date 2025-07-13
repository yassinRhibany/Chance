import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, Button, 
  Badge, InputGroup, Modal, Spinner, Alert
} from 'react-bootstrap';
import { 
  FaIndustry, FaSearch, FaEdit, FaTrash, FaFilePdf, 
  FaFilter, FaSync, FaExclamationTriangle, FaPlus, FaTimes
} from 'react-icons/fa';
import axios from 'axios';

const FactoryManagement = () => {
  // حالات التطبيق
  const [factoryCategories, setFactoryCategories] = useState([]);
  const [factories, setFactories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeasibilityModal, setShowFeasibilityModal] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالات إدارة الفئات
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  
  // عنوان API الأساسي
  const API_URL = 'http://127.0.0.1:8000/api';
  
  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchData();
  }, []);

  // دالة لجلب البيانات من API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // جلب الفئات
      const categoriesResponse = await axios.get(`${API_URL}/categories/index`);
      setFactoryCategories(categoriesResponse.data);
      
      // جلب المصانع من API الجديد
      const factoriesResponse = await axios.get(`${API_URL}/factories/getAllFactories`);
      
      // معالجة البيانات للتأكد من عدم وجود كائنات متداخلة
      const processedFactories = factoriesResponse.data.map(factory => ({
        id: factory.id?.toString() || 'غير محدد',
        name: factory.name?.toString() || 'بدون اسم',
        category: factory.category?.toString() || 'أخرى',
        location: factory.location?.toString() || 'غير محدد',
        status: factory.status?.toString() || 'معلق',
        owner: factory.owner?.toString() || 'غير محدد',
        contact: factory.contact?.toString() || 'غير متوفر',
        products: factory.products?.toString() || 'غير محدد',
        feasibilityStudy: factory.feasibilityStudy?.toString() || '',
        registrationDate: factory.registrationDate?.toString() || 'غير محدد'
      }));
      
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
      (factory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      statusFilter === 'الكل' || factory.status === statusFilter
    ) && (
      categoryFilter === 'الكل' || factory.category === categoryFilter
    ));
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

  // تغيير لون الصنف
  const getCategoryColor = (category) => {
    const colors = {
      'أغذية ومشروبات': '#4caf50',
      'منسوجات وملابس': '#2196f3',
      'أثاث': '#795548',
      'بلاستيك': '#ff9800',
      'كيماويات': '#e91e63',
      'ورق وطباعة': '#3f51b5',
      'معدات وآلات': '#607d8b',
      'إلكترونيات': '#9c27b0',
      'أدوية': '#f44336',
      'مواد بناء': '#ff5722',
      'أخرى': '#9e9e9e'
    };
    return colors[category] || '#9e9e9e';
  };

  // فتح نافذة تعديل المصنع
  const openEditModal = (factory) => {
    setSelectedFactory(factory);
    setShowEditModal(true);
  };

  // فتح نافذة حذف المصنع
  const openDeleteModal = (factory) => {
    setSelectedFactory(factory);
    setShowDeleteModal(true);
  };

  // فتح دراسة الجدوى
  const openFeasibilityStudy = (factory) => {
    setSelectedFactory(factory);
    setShowFeasibilityModal(true);
  };

  // حفظ التعديلات
  const saveChanges = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_URL}/factories/updateFactory/${selectedFactory.id}`,
        selectedFactory
      );
      
      const updatedFactories = factories.map(factory => 
        factory.id === selectedFactory.id ? {
          ...response.data,
          // معالجة البيانات المرتجعة
          id: response.data.id?.toString() || factory.id,
          name: response.data.name?.toString() || factory.name,
          category: response.data.category?.toString() || factory.category,
          status: response.data.status?.toString() || factory.status,
          location: response.data.location?.toString() || factory.location,
          owner: response.data.owner?.toString() || factory.owner,
          contact: response.data.contact?.toString() || factory.contact,
          products: response.data.products?.toString() || factory.products,
          feasibilityStudy: response.data.feasibilityStudy?.toString() || factory.feasibilityStudy,
          registrationDate: response.data.registrationDate?.toString() || factory.registrationDate
        } : factory
      );
      
      setFactories(updatedFactories);
      setShowEditModal(false);
    } catch (err) {
      setError('فشل في تحديث بيانات المصنع');
      console.error('Error updating factory:', err);
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

  // إضافة صنف جديد
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

  // حذف صنف
  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/categories/destroy/${categoryToDelete.id}`);
      
      setFactoryCategories(factoryCategories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setShowDeleteCategoryModal(false);
      
      // تحديث المصانع التي تستخدم هذا الصنف
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

  // عرض قائمة الفئات مع إمكانية الحذف
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
        {/* رسالة خطأ إذا حدثت مشكلة في جلب البيانات */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <FaExclamationTriangle className="me-2" />
            {error}
            <Button variant="outline-light" size="sm" className="ms-3" onClick={fetchData}>
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
          <Col md={3}>
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
          <Col md={3}>
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
          <Col md={3}>
            <Card style={{ 
              backgroundColor: '#1e1e1e',
              borderLeft: '4px solid #dc3545',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase small" style={{ color: '#aaa' }}>المصانع المعطلة</h6>
                    <h3 className="mb-0 text-danger">
                      {factories.filter(f => f.status === 'معطل').length}
                    </h3>
                  </div>
                  <div className="bg-danger bg-opacity-10 p-3 rounded">
                    <FaIndustry size={24} className="text-danger" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
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
              <Button variant="outline-secondary" size="sm" className="me-2" onClick={fetchData}>
                <FaSync /> تحديث البيانات
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body>
            {/* أدوات البحث والتصفية */}
            <Row className="mb-4 g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text style={{ 
                    backgroundColor: '#333', 
                    border: '1px solid #555',
                    color: '#e0e0e0'
                  }}>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="ابحث باسم المصنع، الموقع، المالك، أو الصنف..."
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
              
              <Col md={3}>
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
            
            {/* جدول المصانع */}
            <div className="table-responsive">
              <Table hover className="mb-0" variant="dark">
                <thead style={{ backgroundColor: '#2d2d2d' }}>
                  <tr>
                    <th>رقم المصنع</th>
                    <th>اسم المصنع</th>
                    <th>الصنف</th>
                    <th>الموقع</th>
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
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="bg-dark rounded-circle d-flex align-items-center justify-content-center me-3" 
                              style={{ width: 36, height: 36 }}
                            >
                              <FaIndustry size={16} className="text-warning" />
                            </div>
                            <div>
                              <div>{factory.name}</div>
                              <small className="text-muted">{factory.owner}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            style={{ 
                              backgroundColor: getCategoryColor(factory.category),
                              color: 'white'
                            }}
                          >
                            {factory.category}
                          </Badge>
                        </td>
                        <td>{factory.location}</td>
                        <td>
                          <Badge bg={getStatusBadge(factory.status)}>
                            {factory.status}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => openFeasibilityStudy(factory)}
                          >
                            <FaFilePdf className="me-1" /> عرض الدراسة
                          </Button>
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
        
        {/* نافذة تعديل المصنع */}
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
                <Col md={6}>
                  <Form.Group controlId="editName" className="mb-3">
                    <Form.Label>اسم المصنع</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.name || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, name: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="editCategory" className="mb-3">
                    <Form.Label>صنف المصنع</Form.Label>
                    <Form.Select
                      value={selectedFactory.category || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, category: e.target.value})}
                      className="bg-dark text-light"
                    >
                      {factoryCategories.map((category, index) => (
                        <option key={index} value={category.name}>{category.name?.toString() || 'صنف غير معروف'}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group controlId="editOwner" className="mb-3">
                    <Form.Label>المالك</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.owner || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, owner: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group controlId="editStatus" className="mb-3">
                    <Form.Label>حالة المصنع</Form.Label>
                    <Form.Select
                      value={selectedFactory.status || 'معلق'}
                      onChange={(e) => setSelectedFactory({...selectedFactory, status: e.target.value})}
                      className="bg-dark text-light"
                    >
                      <option value="نشط">نشط</option>
                      <option value="معلق">معلق</option>
                      <option value="معطل">معطل</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group controlId="editLocation" className="mb-3">
                    <Form.Label>الموقع</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.location || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, location: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="editContact" className="mb-3">
                    <Form.Label>جهة الاتصال</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.contact || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, contact: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group controlId="editProducts" className="mb-3">
                    <Form.Label>المنتجات</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={selectedFactory.products || ''}
                      onChange={(e) => setSelectedFactory({...selectedFactory, products: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="editFeasibility" className="mb-3">
                    <Form.Label>دراسة الجدوى (PDF)</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={selectedFactory.feasibilityStudy || ''}
                        onChange={(e) => setSelectedFactory({...selectedFactory, feasibilityStudy: e.target.value})}
                        className="bg-dark text-light"
                        placeholder="رابط ملف PDF"
                      />
                      <Button variant="danger" onClick={() => openFeasibilityStudy(selectedFactory)}>
                        <FaFilePdf className="me-1" /> فتح
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#1a1a1a" }}>
            <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={saveChanges}>
              حفظ التغييرات
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
                  <Row className="mb-3">
                    <Col md={4} className="text-end">
                      <strong>الصنف:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      {selectedFactory.category}
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
                  <Button variant="danger" size="lg" onClick={deleteFactory}>
                    <FaTrash className="me-1" /> تأكيد الحذف
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
        
        {/* نافذة دراسة الجدوى */}
        <Modal 
          show={showFeasibilityModal} 
          onHide={() => setShowFeasibilityModal(false)} 
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
              <FaFilePdf className="me-2 text-danger" /> دراسة جدوى المصنع
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFactory && (
              <div className="text-center">
                <div className="mb-4">
                  <FaFilePdf size={64} className="text-danger mb-3" />
                  <h4>{selectedFactory.name}</h4>
                  <p className="text-muted">دراسة الجدوى الاقتصادية والتقنية</p>
                </div>
                
                <div className="border rounded p-4 mb-4" style={{ backgroundColor: '#1e1e1e' }}>
                  <Row className="mb-3">
                    <Col md={4} className="text-end">
                      <strong>رقم المصنع:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      {selectedFactory.id}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="text-end">
                      <strong>الصنف:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      {selectedFactory.category}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="text-end">
                      <strong>تاريخ التسجيل:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      {selectedFactory.registrationDate}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="text-end">
                      <strong>حالة المصنع:</strong>
                    </Col>
                    <Col md={8} className="text-start">
                      <Badge bg={getStatusBadge(selectedFactory.status)}>
                        {selectedFactory.status}
                      </Badge>
                    </Col>
                  </Row>
                </div>
                
                <div className="d-flex justify-content-center mb-4">
                  <div className="border p-3 rounded" style={{ width: '80%', backgroundColor: '#1e1e1e' }}>
                    <h5>محتوى دراسة الجدوى</h5>
                    <p className="text-muted">
                      تمت الموافقة على دراسة الجدوى الخاصة بالمصنع بناءً على المعايير التالية:
                    </p>
                    <ul className="text-start">
                      <li>تحليل السوق والمنافسة</li>
                      <li>الدراسة الفنية للمشروع</li>
                      <li>التحليل المالي والاقتصادي</li>
                      <li>تقييم المخاطر وخطط الطوارئ</li>
                      <li>الآثار البيئية والاجتماعية</li>
                    </ul>
                  </div>
                </div>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="danger" size="lg">
                    <FaFilePdf className="me-2" /> تحميل الدراسة
                  </Button>
                  <Button variant="outline-secondary" size="lg">
                    طباعة
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#1a1a1a" }}>
            <Button variant="outline-secondary" onClick={() => setShowFeasibilityModal(false)}>
              إغلاق
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* نافذة إضافة صنف جديد */}
        <Modal 
          show={showAddCategoryModal} 
          onHide={() => {
            setShowAddCategoryModal(false);
            setCategoryError('');
          }} 
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
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setCategoryError('');
                }}
                className="bg-dark text-light"
                placeholder="أدخل اسم الصنف الجديد"
              />
              {categoryError && <Alert variant="danger" className="mt-2">{categoryError}</Alert>}
            </Form.Group>
            
            {renderCategoriesList()}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#1a1a1a" }}>
            <Button variant="outline-secondary" onClick={() => {
              setShowAddCategoryModal(false);
              setCategoryError('');
            }}>
              إلغاء
            </Button>
            <Button variant="success" onClick={addNewCategory}>
              <FaPlus className="me-1" /> إضافة الصنف
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* نافذة تأكيد حذف الصنف */}
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
                  <h4>هل أنت متأكد من حذف هذا الصنف؟</h4>
                  <p className="text-muted">هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
                
                <div className="border rounded p-4 mb-4" style={{ backgroundColor: '#1e1e1e' }}>
                  <Row className="mb-3">
                    <Col md={12} className="text-center">
                      <Badge 
                        pill 
                        style={{ 
                          backgroundColor: getCategoryColor(categoryToDelete.name),
                          fontSize: '1.2rem',
                          padding: '8px 16px'
                        }}
                      >
                        {categoryToDelete.name}
                      </Badge>
                    </Col>
                  </Row>
                </div>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="outline-secondary" size="lg" onClick={() => setShowDeleteCategoryModal(false)}>
                    إلغاء
                  </Button>
                  <Button variant="danger" size="lg" onClick={deleteCategory}>
                    <FaTrash className="me-1" /> تأكيد الحذف
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