import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, Button, 
  Badge, InputGroup, Modal, Spinner
} from 'react-bootstrap';
import { 
  FaIndustry, FaSearch, FaEdit, FaTrash, FaFilePdf, 
  FaFilter, FaSync, FaExclamationTriangle
} from 'react-icons/fa';

const FactoryManagement = () => {
  // أنواع المصانع
  const factoryCategories = [
    'أغذية ومشروبات',
    'منسوجات وملابس',
    'أثاث',
    'بلاستيك',
    'كيماويات',
    'ورق وطباعة',
    'معدات وآلات',
    'إلكترونيات',
    'أدوية',
    'مواد بناء',
    'أخرى'
  ];

  // بيانات المصانع المثالبة
  const [factories, setFactories] = useState([
    {
      id: 'FAC-001',
      name: 'مصنع الأثاث الحديث',
      category: 'أثاث',
      owner: 'محمد أحمد',
      location: 'الرياض، حي السليمانية',
      status: 'نشط',
      registrationDate: '2023-01-15',
      products: 'أثاث منزلي',
      employees: 45,
      contact: 'info@modern-furniture.com',
      feasibilityStudy: '/feasibility/fac-001.pdf'
    },
    {
      id: 'FAC-002',
      name: 'مصنع البلاستيك المتكامل',
      category: 'بلاستيك',
      owner: 'سارة عبدالله',
      location: 'جدة، حي الصفا',
      status: 'معلق',
      registrationDate: '2023-02-10',
      products: 'منتجات بلاستيكية',
      employees: 32,
      contact: 'contact@integrated-plastic.com',
      feasibilityStudy: '/feasibility/fac-002.pdf'
    },
    {
      id: 'FAC-003',
      name: 'مصنع الورق الصحي',
      category: 'ورق وطباعة',
      owner: 'خالد سعيد',
      location: 'الدمام، حي الراكة',
      status: 'نشط',
      registrationDate: '2022-11-22',
      products: 'منتجات ورقية',
      employees: 78,
      contact: 'info@sanitary-paper.com',
      feasibilityStudy: '/feasibility/fac-003.pdf'
    },
    {
      id: 'FAC-004',
      name: 'مصنع الأغذية المعلبة',
      category: 'أغذية ومشروبات',
      owner: 'نورة عبدالرحمن',
      location: 'الخبر، حي الجسر',
      status: 'معطل',
      registrationDate: '2023-03-05',
      products: 'أغذية معلبة',
      employees: 56,
      contact: 'support@canned-food.com',
      feasibilityStudy: '/feasibility/fac-004.pdf'
    },
    {
      id: 'FAC-005',
      name: 'مصنع الألمنيوم الوطني',
      category: 'معدات وآلات',
      owner: 'علي حسن',
      location: 'الرياض، حي النخيل',
      status: 'نشط',
      registrationDate: '2022-09-18',
      products: 'منتجات ألمنيوم',
      employees: 102,
      contact: 'contact@national-aluminum.com',
      feasibilityStudy: '/feasibility/fac-005.pdf'
    }
  ]);

  // متغيرات الحالة
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeasibilityModal, setShowFeasibilityModal] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // محاكاة تحميل البيانات
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
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
  const saveChanges = () => {
    const updatedFactories = factories.map(factory => 
      factory.id === selectedFactory.id ? selectedFactory : factory
    );
    setFactories(updatedFactories);
    setShowEditModal(false);
    simulateLoading();
  };

  // حذف المصنع
  const deleteFactory = () => {
    const updatedFactories = factories.filter(factory => factory.id !== selectedFactory.id);
    setFactories(updatedFactories);
    setShowDeleteModal(false);
    simulateLoading();
  };

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      {/* شريط التنقل العلوي */}
    

      <Container fluid className="py-4">
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
              <Button variant="outline-secondary" size="sm" className="me-2" onClick={simulateLoading}>
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
                    <option key={index} value={category}>{category}</option>
                  ))}
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
                      value={selectedFactory.name}
                      onChange={(e) => setSelectedFactory({...selectedFactory, name: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="editCategory" className="mb-3">
                    <Form.Label>صنف المصنع</Form.Label>
                    <Form.Select
                      value={selectedFactory.category}
                      onChange={(e) => setSelectedFactory({...selectedFactory, category: e.target.value})}
                      className="bg-dark text-light"
                    >
                      {factoryCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group controlId="editOwner" className="mb-3">
                    <Form.Label>المالك</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.owner}
                      onChange={(e) => setSelectedFactory({...selectedFactory, owner: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group controlId="editStatus" className="mb-3">
                    <Form.Label>حالة المصنع</Form.Label>
                    <Form.Select
                      value={selectedFactory.status}
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
                      value={selectedFactory.location}
                      onChange={(e) => setSelectedFactory({...selectedFactory, location: e.target.value})}
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="editContact" className="mb-3">
                    <Form.Label>جهة الاتصال</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFactory.contact}
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
                      value={selectedFactory.products}
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
                        value={selectedFactory.feasibilityStudy}
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
      </Container>
    </div>
  );
};

export default FactoryManagement;