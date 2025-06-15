import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, InputGroup, Modal } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaFilter, FaSync } from 'react-icons/fa';

const AdminFactories = () => {
  // بيانات المصانع المثالبة
  const [factories, setFactories] = useState([
    {
      id: 'FAC-001',
      name: 'مصنع الأثاث الحديث',
      owner: 'محمد أحمد',
      location: 'الرياض، حي السليمانية',
      status: 'نشط',
      registrationDate: '2023-01-15',
      products: 'أثاث منزلي',
      employees: 45,
      contact: 'info@modern-furniture.com'
    },
    {
      id: 'FAC-002',
      name: 'مصنع البلاستيك المتكامل',
      owner: 'سارة عبدالله',
      location: 'جدة، حي الصفا',
      status: 'معلق',
      registrationDate: '2023-02-10',
      products: 'منتجات بلاستيكية',
      employees: 32,
      contact: 'contact@integrated-plastic.com'
    },
    {
      id: 'FAC-003',
      name: 'مصنع الورق الصحي',
      owner: 'خالد سعيد',
      location: 'الدمام، حي الراكة',
      status: 'نشط',
      registrationDate: '2022-11-22',
      products: 'منتجات ورقية',
      employees: 78,
      contact: 'info@sanitary-paper.com'
    },
    {
      id: 'FAC-004',
      name: 'مصنع الأغذية المعلبة',
      owner: 'نورة عبدالرحمن',
      location: 'الخبر، حي الجسر',
      status: 'معطل',
      registrationDate: '2023-03-05',
      products: 'أغذية معلبة',
      employees: 56,
      contact: 'support@canned-food.com'
    },
    {
      id: 'FAC-005',
      name: 'مصنع الألمنيوم الوطني',
      owner: 'علي حسن',
      location: 'الرياض، حي النخيل',
      status: 'نشط',
      registrationDate: '2022-09-18',
      products: 'منتجات ألمنيوم',
      employees: 102,
      contact: 'contact@national-aluminum.com'
    },
    {
      id: 'FAC-006',
      name: 'مصنع الأثاث الكلاسيكي',
      owner: 'فاطمة محمد',
      location: 'مكة، حي العزيزية',
      status: 'معلق',
      registrationDate: '2023-04-12',
      products: 'أثاث تقليدي',
      employees: 28,
      contact: 'info@classic-furniture.com'
    },
    {
      id: 'FAC-007',
      name: 'مصنع البلاستيك الحديث',
      owner: 'أحمد خالد',
      location: 'جدة، حي البغدادية',
      status: 'نشط',
      registrationDate: '2022-12-30',
      products: 'منتجات بلاستيكية',
      employees: 65,
      contact: 'support@modern-plastic.com'
    }
  ]);

  // متغيرات الحالة
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [newFactory, setNewFactory] = useState({
    name: '',
    owner: '',
    location: '',
    status: 'نشط',
    products: '',
    employees: '',
    contact: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // تصفية وتصنيف المصانع
  const filteredFactories = factories.filter(factory => {
    return (
      (factory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factory.owner.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      statusFilter === 'الكل' || factory.status === statusFilter
    ));
  });

  // ترتيب المصانع
  useEffect(() => {
    if (sortConfig.key !== null) {
      const sortedFactories = [...filteredFactories].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setFactories(sortedFactories);
    }
  }, [sortConfig]);

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
    setShowEditModal(true);
  };

  // فتح نافذة حذف المصنع
  const openDeleteModal = (factory) => {
    setSelectedFactory(factory);
    setShowDeleteModal(true);
  };

  // حفظ التعديلات
  const saveChanges = () => {
    const updatedFactories = factories.map(factory => 
      factory.id === selectedFactory.id ? selectedFactory : factory
    );
    setFactories(updatedFactories);
    setShowEditModal(false);
  };

  // حذف المصنع
  const deleteFactory = () => {
    const updatedFactories = factories.filter(factory => factory.id !== selectedFactory.id);
    setFactories(updatedFactories);
    setShowDeleteModal(false);
  };

  // إضافة مصنع جديد
  const addFactory = () => {
    const newFactoryWithId = {
      ...newFactory,
      id: `FAC-${String(factories.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      employees: parseInt(newFactory.employees)
    };
    setFactories([...factories, newFactoryWithId]);
    setShowAddModal(false);
    setNewFactory({
      name: '',
      owner: '',
      location: '',
      status: 'نشط',
      products: '',
      employees: '',
      contact: ''
    });
  };

  // ترتيب الجدول
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Container fluid className="py-4 admin-factories-page">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">إدارة المصانع</h2>
          <p className="text-muted">عرض وتعديل جميع المصانع المسجلة في النظام</p>
        </Col>
      </Row>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 className="mb-0">قائمة المصانع</h5>
            <Badge bg="secondary" className="ms-2">{factories.length}</Badge>
          </div>
          <div>
            <Button variant="success" className="me-2" onClick={() => setShowAddModal(true)}>
              <FaPlus className="me-1" /> إضافة مصنع
            </Button>
            <Button variant="outline-secondary">
              <FaSync /> تحديث البيانات
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          {/* أدوات البحث والتصفية */}
          <Row className="mb-4 g-3">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="ابحث باسم المصنع، الموقع، أو المالك..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="الكل">كل الحالات</option>
                <option value="نشط">نشط</option>
                <option value="معلق">معلق</option>
                <option value="معطل">معطل</option>
              </Form.Select>
            </Col>
            
            <Col md={1}>
              <Button variant="outline-primary" className="w-100">
                <FaFilter />
              </Button>
            </Col>
          </Row>
          
          {/* جدول المصانع */}
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th onClick={() => requestSort('id')}>رقم المصنع</th>
                  <th onClick={() => requestSort('name')}>اسم المصنع</th>
                  <th onClick={() => requestSort('owner')}>المالك</th>
                  <th onClick={() => requestSort('location')}>الموقع</th>
                  <th onClick={() => requestSort('status')}>الحالة</th>
                  <th onClick={() => requestSort('registrationDate')}>تاريخ التسجيل</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactories.length > 0 ? (
                  filteredFactories.map((factory, index) => (
                    <tr key={index}>
                      <td>{factory.id}</td>
                      <td>{factory.name}</td>
                      <td>{factory.owner}</td>
                      <td>{factory.location}</td>
                      <td>
                        <Badge bg={getStatusBadge(factory.status)}>
                          {factory.status}
                        </Badge>
                      </td>
                      <td>{factory.registrationDate}</td>
                      <td className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="me-1"
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      لا توجد مصانع مطابقة لمعايير البحث
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* إحصائيات سريعة */}
      <Row className="mt-4 g-3">
        <Col md={3}>
          <Card className="border-success">
            <Card.Body>
              <h6 className="text-muted">المصانع النشطة</h6>
              <h3 className="text-success">
                {factories.filter(f => f.status === 'نشط').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-warning">
            <Card.Body>
              <h6 className="text-muted">المصانع المعلقة</h6>
              <h3 className="text-warning">
                {factories.filter(f => f.status === 'معلق').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-danger">
            <Card.Body>
              <h6 className="text-muted">المصانع المعطلة</h6>
              <h3 className="text-danger">
                {factories.filter(f => f.status === 'معطل').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-primary">
            <Card.Body>
              <h6 className="text-muted">إجمالي المصانع</h6>
              <h3 className="text-primary">{factories.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* نافذة تعديل المصنع */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>تعديل بيانات المصنع</Modal.Title>
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
                  />
                </Form.Group>
                
                <Form.Group controlId="editOwner" className="mb-3">
                  <Form.Label>المالك</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedFactory.owner}
                    onChange={(e) => setSelectedFactory({...selectedFactory, owner: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group controlId="editLocation" className="mb-3">
                  <Form.Label>الموقع</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedFactory.location}
                    onChange={(e) => setSelectedFactory({...selectedFactory, location: e.target.value})}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="editStatus" className="mb-3">
                  <Form.Label>حالة المصنع</Form.Label>
                  <Form.Select
                    value={selectedFactory.status}
                    onChange={(e) => setSelectedFactory({...selectedFactory, status: e.target.value})}
                  >
                    <option value="نشط">نشط</option>
                    <option value="معلق">معلق</option>
                    <option value="معطل">معطل</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group controlId="editProducts" className="mb-3">
                  <Form.Label>المنتجات</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedFactory.products}
                    onChange={(e) => setSelectedFactory({...selectedFactory, products: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group controlId="editContact" className="mb-3">
                  <Form.Label>جهة الاتصال</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedFactory.contact}
                    onChange={(e) => setSelectedFactory({...selectedFactory, contact: e.target.value})}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="editEmployees" className="mb-3">
                  <Form.Label>عدد الموظفين</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedFactory.employees}
                    onChange={(e) => setSelectedFactory({...selectedFactory, employees: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            حفظ التغييرات
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* نافذة حذف المصنع */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFactory && (
            <div className="text-center">
              <h5>هل أنت متأكد من حذف المصنع التالي؟</h5>
              <p className="fw-bold">{selectedFactory.name}</p>
              <p className="text-muted">رقم المصنع: {selectedFactory.id}</p>
              <p className="text-danger">هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={deleteFactory}>
            حذف المصنع
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* نافذة إضافة مصنع جديد */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>إضافة مصنع جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="addName" className="mb-3">
                <Form.Label>اسم المصنع</Form.Label>
                <Form.Control
                  type="text"
                  value={newFactory.name}
                  onChange={(e) => setNewFactory({...newFactory, name: e.target.value})}
                  placeholder="أدخل اسم المصنع"
                />
              </Form.Group>
              
              <Form.Group controlId="addOwner" className="mb-3">
                <Form.Label>المالك</Form.Label>
                <Form.Control
                  type="text"
                  value={newFactory.owner}
                  onChange={(e) => setNewFactory({...newFactory, owner: e.target.value})}
                  placeholder="أدخل اسم المالك"
                />
              </Form.Group>
              
              <Form.Group controlId="addLocation" className="mb-3">
                <Form.Label>الموقع</Form.Label>
                <Form.Control
                  type="text"
                  value={newFactory.location}
                  onChange={(e) => setNewFactory({...newFactory, location: e.target.value})}
                  placeholder="أدخل موقع المصنع"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group controlId="addStatus" className="mb-3">
                <Form.Label>حالة المصنع</Form.Label>
                <Form.Select
                  value={newFactory.status}
                  onChange={(e) => setNewFactory({...newFactory, status: e.target.value})}
                >
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                  <option value="معطل">معطل</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group controlId="addProducts" className="mb-3">
                <Form.Label>المنتجات</Form.Label>
                <Form.Control
                  type="text"
                  value={newFactory.products}
                  onChange={(e) => setNewFactory({...newFactory, products: e.target.value})}
                  placeholder="أدخل المنتجات"
                />
              </Form.Group>
              
              <Form.Group controlId="addContact" className="mb-3">
                <Form.Label>جهة الاتصال</Form.Label>
                <Form.Control
                  type="text"
                  value={newFactory.contact}
                  onChange={(e) => setNewFactory({...newFactory, contact: e.target.value})}
                  placeholder="أدخل جهة الاتصال"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group controlId="addEmployees" className="mb-3">
                <Form.Label>عدد الموظفين</Form.Label>
                <Form.Control
                  type="number"
                  value={newFactory.employees}
                  onChange={(e) => setNewFactory({...newFactory, employees: e.target.value})}
                  placeholder="أدخل عدد الموظفين"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            إلغاء
          </Button>
          <Button variant="success" onClick={addFactory}>
            إضافة المصنع
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminFactories;