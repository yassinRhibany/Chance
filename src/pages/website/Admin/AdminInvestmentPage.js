import React, { useState, useEffect } from 'react';
import { 
  Container, Card, Table, Form, Button, Badge, 
  Spinner, Alert, Modal, Pagination 
} from 'react-bootstrap';
import { 
  FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, 
  FiDollarSign, FiCalendar, FiMapPin, FiUser, FiBarChart2 
} from 'react-icons/fi';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';

const AdminInvestmentPage = () => {
  // ألوان التصميم
  const primaryDark = '#1D1E22';
  const cardDark = '#25262B';
  const accent = '#FEDA6A';
  const lightText = '#E0E1E6';
  const mutedText = '#8E8F94';
  const borderColor = '#3A3B40';
  
  // حالات التطبيق
  const { factoryId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [factoryLoading, setFactoryLoading] = useState(true);
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
  const [factoryInfo, setFactoryInfo] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  // جلب بيانات المصنع والفرص الاستثمارية
  useEffect(() => {
    if (!factoryId || factoryId === 'undefined') {
      navigate('/admin/factories');
      return;
    }

    if (!user?.token) {
      setError('يجب تسجيل الدخول أولاً');
      setMessage('يجب تسجيل الدخول للوصول إلى هذه الصفحة');
      setMessageColor('#DC3545');
      setShowMessage(true);
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setFactoryLoading(true);
        
        // جلب معلومات المصنع
        const factoryResponse = await axios.get(
          `http://127.0.0.1:8000/api/factories/${factoryId}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Accept': 'application/json'
            }
          }
        );
        
     
        setFactoryInfo(factoryResponse.data);
        setFactoryLoading(false);

        // جلب الفرص الاستثمارية للمصنع
        const opportunitiesResponse = await axios.get(
          `http://127.0.0.1:8000/api/InvestmentOpprtunities/getFactoryOpportunities/${factoryId}`,
          
        );

        if (opportunitiesResponse.data && Array.isArray(opportunitiesResponse.data)) {
          const formattedOpportunities = opportunitiesResponse.data.map(opp => ({
            id: opp.id,
            title: opp.name || 'بدون عنوان',
            owner: factoryResponse.data.name || 'غير معروف',
            amount: `${opp.required_amount?.toLocaleString() || '0'} ريال`,
            funded: `${opp.funded_amount?.toLocaleString() || '0'} ريال`,
            status: getStatusFromAPI(opp.status),
            location: factoryResponse.data.address || 'غير محدد',
            date: opp.created_at ? new Date(opp.created_at).toISOString().split('T')[0] : 'غير محدد',
            investors: opp.investors_count || 0,
            factory_id: factoryId,
            description: opp.description || '',
            risk_level: opp.risk_level || 'medium',
            duration: opp.duration || 'غير محدد'
          }));
          
          // حساب الإحصائيات
          const total = formattedOpportunities.length;
          const active = formattedOpportunities.filter(o => o.status === 'active').length;
          const completed = formattedOpportunities.filter(o => o.status === 'completed').length;
          const pending = formattedOpportunities.filter(o => o.status === 'pending').length;
          
          setStats({ total, active, completed, pending });
          setOpportunities(formattedOpportunities);
          setFilteredOpportunities(formattedOpportunities);
        } else {
          setError('تنسيق البيانات غير صحيح من الخادم');
          setMessage('هيكل البيانات غير متوقع من السيرفر');
          setMessageColor('#DC3545');
          setShowMessage(true);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('فشل في جلب البيانات من الخادم');
        setMessage('حدث خطأ أثناء جلب البيانات');
        setMessageColor('#DC3545');
        setShowMessage(true);
        
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else if (err.response?.status === 404) {
          setMessage('المصنع المطلوب غير موجود');
          setMessageColor('#DC3545');
          setShowMessage(true);
          navigate('/admin/factories');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [factoryId, user, navigate, logout]);

  // تحويل حالة API إلى حالة التطبيق
  const getStatusFromAPI = (apiStatus) => {
    switch (apiStatus) {
      case 'active':
      case 'مفعل':
      case 'نشط':
        return 'active';
      case 'completed':
      case 'مكتمل':
      case 'منتهي':
        return 'completed';
      case 'pending':
      case 'قيد الانتظار':
      case 'قيد المراجعة':
        return 'pending';
      case 'rejected':
      case 'مرفوض':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  // تطبيق الفلاتر والبحث
  useEffect(() => {
    let result = opportunities;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(opp => 
        opp.title.toLowerCase().includes(term) || 
        opp.owner.toLowerCase().includes(term) ||
        opp.location.toLowerCase().includes(term) ||
        (opp.description && opp.description.toLowerCase().includes(term))
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
  
  const deleteOpportunity = async () => {
    if (!selectedOpportunity || !factoryId) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/InvestmentOpprtunities/${selectedOpportunity.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      setOpportunities(opportunities.filter(o => o.id !== selectedOpportunity.id));
      setShowDeleteModal(false);
      setSelectedOpportunity(null);
      
      setMessage('تم حذف الفرصة الاستثمارية بنجاح');
      setMessageColor('#28A745');
      setShowMessage(true);
      
      // تحديث الإحصائيات
      const total = opportunities.length - 1;
      let active = stats.active;
      let completed = stats.completed;
      let pending = stats.pending;
      
      if (selectedOpportunity.status === 'active') active--;
      else if (selectedOpportunity.status === 'completed') completed--;
      else if (selectedOpportunity.status === 'pending') pending--;
      
      setStats({ total, active, completed, pending });
    } catch (err) {
      console.error('Error deleting opportunity:', err);
      setMessage('فشل في حذف الفرصة الاستثمارية');
      setMessageColor('#DC3545');
      setShowMessage(true);
      
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else if (err.response?.status === 404) {
        setMessage('الفرصة غير موجودة أو تم حذفها بالفعل');
        setMessageColor('#DC3545');
        setShowMessage(true);
      }
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
      case 'rejected':
        return 'danger';
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
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };
  
  // حساب نسبة التمويل
  const getFundingPercentage = (amount, funded) => {
    const amountNum = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
    const fundedNum = parseInt(funded.replace(/[^0-9]/g, '')) || 0;
    return amountNum > 0 ? Math.round((fundedNum / amountNum) * 100) : 0;
  };

  // إضافة فرصة جديدة
  const handleAddOpportunity = () => {
    navigate(`/admin/factories/${factoryId}/opportunities/new`);
  };

  // تعديل فرصة موجودة
  const handleEditOpportunity = (opportunityId) => {
    navigate(`/admin/factories/${factoryId}/opportunities/${opportunityId}/edit`);
  };

  // عرض تفاصيل الفرصة
  const handleViewDetails = (opportunityId) => {
    navigate(`/admin/factories/${factoryId}/opportunities/${opportunityId}`);
  };

  // العودة إلى صفحة المصانع
  const handleBackToFactories = () => {
    navigate('/admin/factories');
  };

  return (
    <Container fluid className="py-4" style={{ 
      backgroundColor: primaryDark, 
      minHeight: '100vh',
      color: lightText
    }}>
      {/* رسالة التنبيه */}
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
          <Alert 
            variant={messageColor === '#DC3545' ? 'danger' : 'success'}
            onClose={() => setShowMessage(false)}
            dismissible
            style={{ 
              backgroundColor: messageColor === '#DC3545' ? '#2D1E22' : '#1E2D24',
              borderColor: borderColor
            }}
          >
            {message}
          </Alert>
        </div>
      )}

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Button 
              variant="outline-secondary" 
              onClick={handleBackToFactories}
              className="mb-3"
              style={{ borderColor: borderColor, color: lightText }}
            >
              العودة إلى قائمة المصانع
            </Button>
            
            <h2 className="fw-bold mb-1" style={{ color: accent }}>
              <FiBarChart2 className="me-2" />
              إدارة الفرص الاستثمارية
            </h2>
            {factoryLoading ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" style={{ color: accent }} />
                <span style={{ color: mutedText }}>جاري تحميل بيانات المصنع...</span>
              </div>
            ) : factoryInfo ? (
              <div>
                <p className="mb-0" style={{ color: mutedText }}>
                  لمصنع: <span style={{ color: accent }}>{factoryInfo.name}</span> - {factoryInfo.address}
                </p>
                <p className="mb-0 small" style={{ color: mutedText }}>
                  التصنيف: {factoryInfo.category?.name || 'غير محدد'}
                </p>
              </div>
            ) : (
              <p className="mb-0 text-danger">لا توجد بيانات للمصنع</p>
            )}
          </div>
          
          <Button 
            variant="warning" 
            className="d-flex align-items-center"
            onClick={handleAddOpportunity}
            style={{
              backgroundColor: accent,
              color: primaryDark,
              border: 'none',
              fontWeight: '600'
            }}
          >
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
                  <option value="rejected">مرفوضة</option>
                </Form.Select>
              </div>
              
              <div>
                <Button 
                  variant="outline-secondary" 
                  className="d-flex align-items-center"
                  style={{ borderColor: borderColor, color: lightText }}
                >
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
            ) : error ? (
              <div className="text-center py-5">
                <Alert variant="danger" style={{ backgroundColor: primaryDark }}>
                  {error}
                </Alert>
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
                      <tr 
                        key={opp.id} 
                        style={{ borderBottom: `1px solid ${borderColor}`, cursor: 'pointer' }}
                        onClick={() => handleViewDetails(opp.id)}
                      >
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
                              {opp.duration && (
                                <div className="small" style={{ color: mutedText }}>
                                  <FiCalendar size={12} className="me-1" /> {opp.duration}
                                </div>
                              )}
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
                            <Button 
                              variant="outline-warning" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOpportunity(opp.id);
                              }}
                              style={{ borderColor: accent, color: accent }}
                            >
                              <FiEdit size={16} />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="d-flex align-items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(opp);
                              }}
                              style={{ borderColor: '#dc3545', color: '#dc3545' }}
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
                    style={{ 
                      backgroundColor: primaryDark, 
                      borderColor: borderColor,
                      color: lightText
                    }}
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
                    style={{ 
                      backgroundColor: primaryDark, 
                      borderColor: borderColor,
                      color: lightText
                    }}
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
          style={{ 
            backgroundColor: primaryDark, 
            color: accent, 
            borderColor: borderColor 
          }}
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
                <p className="mb-0 small" style={{ color: mutedText }}>المبلغ: {selectedOpportunity.amount}</p>
                <p className="mb-0 small" style={{ color: mutedText }}>الحالة: {getStatusText(selectedOpportunity.status)}</p>
              </div>
            )}
          </div>
        </Modal.Body>
        
        <Modal.Footer style={{ backgroundColor: primaryDark, borderColor: borderColor }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            style={{ 
              borderColor: borderColor,
              color: lightText
            }}
          >
            إلغاء
          </Button>
          
          <Button 
            variant="danger" 
            onClick={deleteOpportunity}
            style={{ fontWeight: '600' }}
          >
            <FiTrash2 className="me-2" /> حذف الفرصة
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminInvestmentPage;