import React, { useState, useEffect } from 'react';
import { 
  Container, Card, Table, Form, Button, Badge, 
  Spinner, Alert, Modal, Pagination 
} from 'react-bootstrap';
import { 
  FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, 
  FiDollarSign, FiCalendar, FiMapPin, FiUser, FiBarChart2 
} from 'react-icons/fi';

const AdminInvestmentPage = () => {
  // ألوان التصميم
  const primaryDark = '#1D1E22';
  const cardDark = '#25262B';
  const accent = '#FEDA6A';
  const lightText = '#E0E1E6';
  const mutedText = '#8E8F94';
  const borderColor = '#3A3B40';
  
  // حالات التطبيق
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });

  // توليد بيانات وهمية للفرص الاستثمارية
  useEffect(() => {
    const mockOpportunities = [
      { id: 1, title: 'عقار تجاري مميز', owner: 'محمد أحمد', amount: '5,000,000 ريال', funded: '2,500,000 ريال', status: 'active', location: 'الرياض', date: '2023-10-15', investors: 24 },
      { id: 2, title: 'مجمع سكني فاخر', owner: 'شركة التعمير', amount: '12,000,000 ريال', funded: '8,400,000 ريال', status: 'active', location: 'جدة', date: '2023-10-10', investors: 42 },
      { id: 3, title: 'أرض استثمارية', owner: 'علي عبدالله', amount: '8,000,000 ريال', funded: '3,200,000 ريال', status: 'active', location: 'الدمام', date: '2023-10-05', investors: 18 },
      { id: 4, title: 'مشروع سياحي', owner: 'مجموعة السياحة', amount: '15,000,000 ريال', funded: '15,000,000 ريال', status: 'completed', location: 'العلا', date: '2023-09-20', investors: 65 },
      { id: 5, title: 'مصنع ألبان', owner: 'أحمد السليم', amount: '7,500,000 ريال', funded: '2,250,000 ريال', status: 'active', location: 'القصيم', date: '2023-10-12', investors: 15 },
      { id: 6, title: 'برج مكتبي', owner: 'شركة الأبراج', amount: '20,000,000 ريال', funded: '12,000,000 ريال', status: 'active', location: 'الرياض', date: '2023-09-25', investors: 38 },
      { id: 7, title: 'مشروع زراعي', owner: 'شركة الزراعة الحديثة', amount: '6,000,000 ريال', funded: '6,000,000 ريال', status: 'completed', location: 'حائل', date: '2023-08-15', investors: 28 },
      { id: 8, title: 'فندق خمس نجوم', owner: 'مجموعة الضيافة', amount: '25,000,000 ريال', funded: '10,000,000 ريال', status: 'active', location: 'مكة', date: '2023-10-08', investors: 52 },
      { id: 9, title: 'مركز تسوق', owner: 'شركة التجارة', amount: '18,000,000 ريال', funded: '5,400,000 ريال', status: 'pending', location: 'الشرقية', date: '2023-10-01', investors: 0 },
      { id: 10, title: 'مشروع تكنولوجي', owner: 'شركة التقنية', amount: '10,000,000 ريال', funded: '7,500,000 ريال', status: 'active', location: 'الرياض', date: '2023-09-30', investors: 31 },
    ];
    
    // حساب الإحصائيات
    const total = mockOpportunities.length;
    const active = mockOpportunities.filter(o => o.status === 'active').length;
    const completed = mockOpportunities.filter(o => o.status === 'completed').length;
    const pending = mockOpportunities.filter(o => o.status === 'pending').length;
    
    setStats({ total, active, completed, pending });
    setOpportunities(mockOpportunities);
    setFilteredOpportunities(mockOpportunities);
    setLoading(false);
  }, []);

  // تطبيق الفلاتر والبحث
  useEffect(() => {
    let result = opportunities;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(opp => 
        opp.title.toLowerCase().includes(term) || 
        opp.owner.toLowerCase().includes(term) ||
        opp.location.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(opp => opp.status === statusFilter);
    }
    
    setFilteredOpportunities(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, opportunities]);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  
  // الحصول على الفرص للصفحة الحالية
  const currentOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // تغيير الصفحة
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // حذف فرصة استثمارية
  const confirmDelete = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDeleteModal(true);
  };
  
  const deleteOpportunity = () => {
    if (selectedOpportunity) {
      setOpportunities(opportunities.filter(o => o.id !== selectedOpportunity.id));
      setShowDeleteModal(false);
      setSelectedOpportunity(null);
    }
  };
  
  // الحصول على لون البادج حسب الحالة
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'warning';
      case 'completed':
        return 'success';
      case 'pending':
        return 'secondary';
      default:
        return 'light';
    }
  };
  
  // الحصول على نص الحالة
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المراجعة';
      default:
        return status;
    }
  };
  
  // حساب نسبة التمويل
  const getFundingPercentage = (amount, funded) => {
    const amountNum = parseInt(amount.replace(/,/g, '')), 
          fundedNum = parseInt(funded.replace(/,/g, ''));
    return Math.round((fundedNum / amountNum) * 100);
  };

  return (
    <Container fluid className="py-4" style={{ 
      backgroundColor: primaryDark, 
      minHeight: '100vh',
      color: lightText
    }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: accent }}>
              <FiBarChart2 className="me-2" />
              إدارة الفرص الاستثمارية
            </h2>
            <p className="mb-0" style={{ color: mutedText }}>
              تصفح وأدر جميع الفرص الاستثمارية المسجلة في النظام
            </p>
          </div>
          
          <Button variant="warning" className="d-flex align-items-center">
            <FiPlus className="me-2" /> إضافة فرصة جديدة
          </Button>
        </div>
        
        {/* بطاقات الإحصائيات */}
        <div className="row mb-4 g-4">
          <div className="col-md-3">
            <Card style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1" style={{ color: mutedText }}>إجمالي الفرص</p>
                    <h3 className="mb-0" style={{ color: accent }}>{stats.total}</h3>
                  </div>
                  <div 
                    className="rounded-circle p-3" 
                    style={{ backgroundColor: 'rgba(254, 218, 106, 0.1)' }}
                  >
                    <FiDollarSign size={24} color={accent} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-3">
            <Card style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1" style={{ color: mutedText }}>فرص نشطة</p>
                    <h3 className="mb-0" style={{ color: accent }}>{stats.active}</h3>
                  </div>
                  <div 
                    className="rounded-circle p-3" 
                    style={{ backgroundColor: 'rgba(254, 218, 106, 0.1)' }}
                  >
                    <FiBarChart2 size={24} color={accent} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-3">
            <Card style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1" style={{ color: mutedText }}>فرص مكتملة</p>
                    <h3 className="mb-0" style={{ color: accent }}>{stats.completed}</h3>
                  </div>
                  <div 
                    className="rounded-circle p-3" 
                    style={{ backgroundColor: 'rgba(254, 218, 106, 0.1)' }}
                  >
                    <FiCalendar size={24} color={accent} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-3">
            <Card style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1" style={{ color: mutedText }}>قيد المراجعة</p>
                    <h3 className="mb-0" style={{ color: accent }}>{stats.pending}</h3>
                  </div>
                  <div 
                    className="rounded-circle p-3" 
                    style={{ backgroundColor: 'rgba(254, 218, 106, 0.1)' }}
                  >
                    <FiFilter size={24} color={accent} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
        
        {/* أدوات البحث والتصفية */}
        <Card className="mb-4" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
              <div className="d-flex flex-column flex-lg-row gap-3">
                <div className="w-100 position-relative">
                  <FiSearch 
                    style={{ 
                      position: 'absolute', 
                      left: '15px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: mutedText 
                    }} 
                  />
                  <Form.Control
                    type="text"
                    placeholder="ابحث باسم الفرصة أو المالك أو الموقع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      backgroundColor: primaryDark, 
                      color: lightText,
                      borderColor: borderColor,
                      paddingLeft: '40px'
                    }}
                  />
                </div>
                
                <Form.Select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ 
                    backgroundColor: primaryDark, 
                    color: lightText,
                    borderColor: borderColor,
                    width: '200px'
                  }}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشطة</option>
                  <option value="completed">مكتملة</option>
                  <option value="pending">قيد المراجعة</option>
                </Form.Select>
              </div>
              
              <div>
                <Button variant="outline-secondary" className="d-flex align-items-center">
                  <FiFilter className="me-2" /> المزيد من الفلاتر
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* جدول الفرص الاستثمارية */}
        <Card className="border-0" style={{ backgroundColor: cardDark, border: `1px solid ${borderColor}` }}>
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3" style={{ color: mutedText }}>جاري تحميل الفرص الاستثمارية...</p>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-5">
                <FiSearch size={48} style={{ color: mutedText }} />
                <h5 className="mt-3" style={{ color: accent }}>لا توجد فرص تطابق معايير البحث</h5>
                <p className="text-muted">حاول تغيير كلمات البحث أو إزالة بعض الفلاتر</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover borderless style={{ color: lightText }}>
                  <thead>
                    <tr>
                      <th style={{ color: accent }}>الفرصة الاستثمارية</th>
                      <th style={{ color: accent }}>المالك</th>
                      <th style={{ color: accent }}>المبلغ المطلوب</th>
                      <th style={{ color: accent }}>نسبة التمويل</th>
                      <th style={{ color: accent }}>المستثمرون</th>
                      <th style={{ color: accent }}>الحالة</th>
                      <th style={{ color: accent }}>التاريخ</th>
                      <th style={{ color: accent }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOpportunities.map((opp) => (
                      <tr key={opp.id} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                              style={{ width: '40px', height: '40px', backgroundColor: 'rgba(254, 218, 106, 0.1)' }}
                            >
                              <FiDollarSign size={18} color={accent} />
                            </div>
                            <div>
                              <div className="fw-medium">{opp.title}</div>
                              <div className="small" style={{ color: mutedText }}>
                                <FiMapPin size={12} className="me-1" /> {opp.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2" 
                              style={{ width: '30px', height: '30px', backgroundColor: 'rgba(254, 218, 106, 0.1)' }}
                            >
                              <FiUser size={14} color={accent} />
                            </div>
                            <span>{opp.owner}</span>
                          </div>
                        </td>
                        <td className="fw-medium" style={{ color: accent }}>{opp.amount}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress w-100 me-2" style={{ height: '8px', backgroundColor: borderColor }}>
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ 
                                  width: `${getFundingPercentage(opp.amount, opp.funded)}%`,
                                  backgroundColor: accent
                                }} 
                              ></div>
                            </div>
                            <span>{getFundingPercentage(opp.amount, opp.funded)}%</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg="light" text="dark" className="fw-normal">
                            {opp.investors} مستثمر
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(opp.status)} className="fw-normal">
                            {getStatusText(opp.status)}
                          </Badge>
                        </td>
                        <td style={{ color: mutedText }}>{opp.date}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-warning" size="sm" className="d-flex align-items-center">
                              <FiEdit size={16} />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={() => confirmDelete(opp)}
                            >
                              <FiTrash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
            {/* التصفح بين الصفحات */}
            {filteredOpportunities.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ backgroundColor: primaryDark, borderColor: borderColor }}
                  />
                  
                  {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === currentPage}
                      onClick={() => handlePageChange(idx + 1)}
                      style={{ 
                        backgroundColor: idx + 1 === currentPage ? accent : primaryDark,
                        borderColor: borderColor,
                        color: idx + 1 === currentPage ? primaryDark : lightText
                      }}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  
                  <Pagination.Next 
                    disabled={currentPage === totalPages} 
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{ backgroundColor: primaryDark, borderColor: borderColor }}
                  />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* نافذة تأكيد الحذف */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        style={{ direction: 'rtl' }}
      >
        <Modal.Header 
          closeButton 
          style={{ backgroundColor: primaryDark, color: accent, borderColor: borderColor }}
        >
          <Modal.Title>تأكيد حذف الفرصة</Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ backgroundColor: cardDark, color: lightText }}>
          <div className="text-center">
            <FiTrash2 size={48} color="#ff6b6b" className="mb-3" />
            <h5 style={{ color: accent }}>هل أنت متأكد من حذف هذه الفرصة الاستثمارية؟</h5>
            <p className="mb-0">هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة بهذه الفرصة</p>
            
            {selectedOpportunity && (
              <div className="mt-4 p-3 rounded" style={{ backgroundColor: primaryDark }}>
                <p className="mb-1 fw-medium">{selectedOpportunity.title}</p>
                <p className="mb-0 small" style={{ color: mutedText }}>المالك: {selectedOpportunity.owner}</p>
              </div>
            )}
          </div>
        </Modal.Body>
        
        <Modal.Footer style={{ backgroundColor: primaryDark, borderColor: borderColor }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            style={{ borderColor: borderColor }}
          >
            إلغاء
          </Button>
          
          <Button 
            variant="danger" 
            onClick={deleteOpportunity}
          >
            <FiTrash2 className="me-2" /> حذف الفرصة
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminInvestmentPage;