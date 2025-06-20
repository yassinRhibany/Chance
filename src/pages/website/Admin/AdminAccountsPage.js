import React, { useState, useEffect } from 'react';
import { 
  Container, Table, Form, Button, Badge, Pagination, 
  Row, Col, Spinner
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const AdminAccountsPage = () => {
  // لوحة ألوان جديدة متنوعة وجذابة
  const primaryDark = '#0f172a'; // لون خلفية داكن غني
  const secondaryDark = '#1e293b'; // لون ثانوي داكن
  const accentGold = '#fbbf24'; // لون ذهبي مميز
  const accentBlue = '#60a5fa'; // لون أزرق جذاب
  const accentTeal = '#2dd4bf'; // لون تركوازي منعش
  const lightText = '#e2e8f0'; // نص فاتح
  const lightGray = '#94a3b8'; // رمادي فاتح للتفاصيل

  // بيانات وهمية للحسابات
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // توليد بيانات وهمية عند تحميل الصفحة
  useEffect(() => {
    const mockAccounts = [
      { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', type: 'investor', registrationDate: '2023-05-15', status: 'active' },
      { id: 2, name: 'شركة الصناعات الحديثة', email: 'factory@example.com', type: 'factory_owner', registrationDate: '2023-04-20', status: 'active' },
      { id: 3, name: 'سارة عبدالله', email: 'sara@example.com', type: 'investor', registrationDate: '2023-06-10', status: 'pending' },
      { id: 4, name: 'مصنع الهدى', email: 'alhuda@example.com', type: 'factory_owner', registrationDate: '2023-03-05', status: 'active' },
      { id: 5, name: 'عمر الرشيد', email: 'omar@example.com', type: 'investor', registrationDate: '2023-07-18', status: 'suspended' },
      { id: 6, name: 'شركة التقنية المتطورة', email: 'tech@example.com', type: 'factory_owner', registrationDate: '2023-02-22', status: 'active' },
      { id: 7, name: 'ليلى أحمد', email: 'leila@example.com', type: 'investor', registrationDate: '2023-08-01', status: 'pending' },
      { id: 8, name: 'مصنع المستقبل', email: 'future@example.com', type: 'factory_owner', registrationDate: '2023-05-30', status: 'active' },
      { id: 9, name: 'فاطمة السليم', email: 'fatima@example.com', type: 'investor', registrationDate: '2023-06-25', status: 'active' },
      { id: 10, name: 'مصنع الأمل', email: 'hope@example.com', type: 'factory_owner', registrationDate: '2023-04-15', status: 'suspended' },
      { id: 11, name: 'خالد سعيد', email: 'khaled@example.com', type: 'investor', registrationDate: '2023-09-05', status: 'active' },
      { id: 12, name: 'مجموعة الصناعات الوطنية', email: 'national@example.com', type: 'factory_owner', registrationDate: '2023-01-30', status: 'pending' },
    ];
    
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);
  
  // تصفية الحسابات حسب البحث ونوع المستخدم
  useEffect(() => {
    let result = accounts;
    
    if (searchTerm) {
      result = result.filter(account => 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        account.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (userTypeFilter !== 'all') {
      result = result.filter(account => account.type === userTypeFilter);
    }
    
    setFilteredAccounts(result);
    setCurrentPage(1);
  }, [searchTerm, userTypeFilter, accounts]);
  
  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  
  // الحصول على الحسابات للصفحة الحالية
  const currentAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // تغيير الصفحة
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // تغيير نوع المستخدم
  const handleUserTypeChange = (e) => {
    setUserTypeFilter(e.target.value);
  };
  
  // تغيير حالة الحساب
  const toggleAccountStatus = (accountId) => {
    setAccounts(accounts.map(account => {
      if (account.id === accountId) {
        let newStatus;
        if (account.status === 'active') newStatus = 'suspended';
        else if (account.status === 'suspended') newStatus = 'active';
        else newStatus = account.status;
        
        return { ...account, status: newStatus };
      }
      return account;
    }));
  };
  
  // الحصول على لون البادج حسب الحالة
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'success', text: 'نشط' };
      case 'pending':
        return { bg: 'warning', text: 'قيد المراجعة' };
      case 'suspended':
        return { bg: 'danger', text: 'موقوف' };
      default:
        return { bg: 'secondary', text: status };
    }
  };
  
  // الحصول على نص نوع المستخدم
  const getUserTypeText = (type) => {
    switch (type) {
      case 'investor':
        return 'مستثمر';
      case 'factory_owner':
        return 'صاحب مصنع';
      default:
        return type;
    }
  };
  
  // الحصول على لون نوع المستخدم
  const getUserTypeColor = (type) => {
    switch (type) {
      case 'investor':
        return accentBlue;
      case 'factory_owner':
        return accentTeal;
      default:
        return lightGray;
    }
  };
  
  // الحصول على لون البطاقة حسب النوع
  const getCardColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    ];
    return colors[index % colors.length];
  };

  return (
    <Container fluid className="py-4" style={{ 
      background: 'linear-gradient(135deg, #0c0f1d 0%, #1a1f33 100%)',
      minHeight: '100vh',
      color: lightText
    }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4 py-3">
          <div>
            <h2 style={{ 
              color: accentGold,
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
            }}>
              <i className="bi bi-people-fill me-3"></i>
              إدارة حسابات المستخدمين
            </h2>
            <p className="mt-2" style={{ color: lightGray }}>
              لوحة التحكم الشاملة لإدارة جميع حسابات المستخدمين في النظام
            </p>
          </div>
          <div className="d-flex gap-2">
            <Badge bg="secondary" className="px-3 py-2" style={{ 
              background: 'rgba(30, 41, 59, 0.7)', 
              border: `1px solid ${accentGold}`,
              borderRadius: '10px'
            }}>
              المجموع: {filteredAccounts.length}
            </Badge>
            <Badge bg="primary" className="px-3 py-2" style={{ 
              background: 'rgba(30, 41, 59, 0.7)', 
              border: `1px solid ${accentBlue}`,
              borderRadius: '10px'
            }}>
              صفحة {currentPage} من {totalPages}
            </Badge>
          </div>
        </div>
        
        {/* أدوات البحث والتصفية */}
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3">
          <div className="d-flex flex-wrap gap-2">
            <Form.Select 
              value={userTypeFilter} 
              onChange={handleUserTypeChange}
              style={{ 
                background: secondaryDark,
                color: lightText,
                border: `1px solid ${accentTeal}`,
                width: '200px',
                boxShadow: '0 0 8px rgba(45, 212, 191, 0.2)'
              }}
            >
              <option value="all">جميع الحسابات</option>
              <option value="investor">المستثمرون فقط</option>
              <option value="factory_owner">أصحاب المصانع فقط</option>
            </Form.Select>
            
            <Form.Control
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                background: secondaryDark,
                color: lightText,
                border: `1px solid ${accentBlue}`,
                width: '250px',
                boxShadow: '0 0 8px rgba(96, 165, 250, 0.2)'
              }}
            />
          </div>
          
          <Button 
            variant="outline-warning"
            className="d-flex align-items-center gap-2"
            style={{
              border: `1px solid ${accentGold}`,
              color: accentGold,
              fontWeight: 'bold',
              background: 'rgba(251, 191, 36, 0.1)',
              boxShadow: '0 0 8px rgba(251, 191, 36, 0.2)'
            }}
          >
            <i className="bi bi-download"></i> تصدير البيانات
          </Button>
        </div>
        
        {/* جدول الحسابات */}
        <div style={{ 
          overflowX: 'auto',
          borderRadius: '10px',
          border: `1px solid ${secondaryDark}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}>
          <Table hover style={{ 
            margin: 0,
            color: lightText,
            background: secondaryDark
          }}>
            <thead style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
              <tr>
                <th style={{ color: accentGold, padding: '15px' }}>#</th>
                <th style={{ color: accentGold, padding: '15px' }}>الاسم</th>
                <th style={{ color: accentGold, padding: '15px' }}>البريد الإلكتروني</th>
                <th style={{ color: accentGold, padding: '15px' }}>نوع الحساب</th>
                <th style={{ color: accentGold, padding: '15px' }}>تاريخ التسجيل</th>
                <th style={{ color: accentGold, padding: '15px' }}>الحالة</th>
                <th style={{ color: accentGold, padding: '15px' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.length > 0 ? (
                currentAccounts.map((account, index) => (
                  <tr key={account.id} style={{ 
                    background: index % 2 === 0 ? 'rgba(30, 41, 59, 0.5)' : 'rgba(30, 41, 59, 0.3)',
                    borderBottom: `1px solid ${secondaryDark}`
                  }}>
                    <td style={{ padding: '15px' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td style={{ padding: '15px' }}>{account.name}</td>
                    <td style={{ padding: '15px' }}>{account.email}</td>
                    <td style={{ padding: '15px' }}>
                      <Badge 
                        style={{
                          background: 'transparent',
                          border: `1px solid ${getUserTypeColor(account.type)}`,
                          color: getUserTypeColor(account.type),
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        {getUserTypeText(account.type)}
                      </Badge>
                    </td>
                    <td style={{ padding: '15px' }}>{account.registrationDate}</td>
                    <td style={{ padding: '15px' }}>
                      <Badge 
                        style={{
                          background: 'transparent',
                          border: `1px solid ${getStatusBadge(account.status).bg === 'success' ? '#10b981' : 
                                   getStatusBadge(account.status).bg === 'warning' ? '#f59e0b' : 
                                   '#ef4444'}`,
                          color: getStatusBadge(account.status).bg === 'success' ? '#10b981' : 
                                 getStatusBadge(account.status).bg === 'warning' ? '#f59e0b' : 
                                 '#ef4444',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        {getStatusBadge(account.status).text}
                      </Badge>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div className="d-flex gap-2">
                        <Button  as ={NavLink} to={`/UserDetailsPage`}
                          variant="outline-light" 
                          size="sm"
                          className="d-flex align-items-center gap-1"
                          style={{
                            border: `1px solid ${accentBlue}`,
                            color: accentBlue,
                            background: 'rgba(96, 165, 250, 0.1)'
                          }}
                        >
                          <i className="bi bi-eye"></i> تفاصيل
                        </Button>
                        <Button 
                          variant={
                            account.status === 'suspended' ? 'outline-success' : 'outline-danger'
                          } 
                          size="sm"
                          onClick={() => toggleAccountStatus(account.id)}
                          className="d-flex align-items-center gap-1"
                          style={{
                            border: `1px solid ${account.status === 'suspended' ? '#10b981' : '#ef4444'}`,
                            color: account.status === 'suspended' ? '#10b981' : '#ef4444',
                            background: account.status === 'suspended' ? 
                              'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}
                        >
                          {account.status === 'suspended' ? (
                            <>
                              <i className="bi bi-check-circle"></i> تفعيل
                            </>
                          ) : account.status === 'active' ? (
                            <>
                              <i className="bi bi-slash-circle"></i> تعليق
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle"></i> تفعيل
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-search" style={{ fontSize: '3rem', color: accentGold }}></i>
                    <h4 className="mt-3" style={{ color: accentGold }}>
                      لا توجد حسابات تطابق معايير البحث
                    </h4>
                    <p style={{ color: lightGray }}>
                      حاول تغيير فلتر البحث أو استخدام مصطلح بحث مختلف
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        
        {/* التصفح بين الصفحات */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="custom-pagination">
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  background: secondaryDark,
                  border: `1px solid ${accentTeal}`,
                  color: lightText,
                  margin: '0 5px'
                }}
              />
              
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    background: index + 1 === currentPage ? accentGold : secondaryDark,
                    border: `1px solid ${index + 1 === currentPage ? accentGold : accentBlue}`,
                    color: index + 1 === currentPage ? primaryDark : lightText,
                    margin: '0 5px',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next 
                disabled={currentPage === totalPages} 
                onClick={() => handlePageChange(currentPage + 1)}
                style={{
                  background: secondaryDark,
                  border: `1px solid ${accentTeal}`,
                  color: lightText,
                  margin: '0 5px'
                }}
              />
            </Pagination>
          </div>
        )}
        
        {/* إحصائيات سريعة */}
        <div className="mt-5">
          <h4 style={{ 
            color: accentGold, 
            borderBottom: `2px solid ${accentGold}`, 
            paddingBottom: '15px',
            position: 'relative'
          }}>
            <i className="bi bi-bar-chart-fill me-2"></i>
            إحصائيات الحسابات
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: '0',
              width: '150px',
              height: '2px',
              background: accentTeal
            }}></div>
          </h4>
          
          <div className="row mt-4">
            <div className="col-md-4 mb-4">
              <div className="card" style={{ 
                background: getCardColor(0),
                border: `1px solid ${accentGold}`,
                borderRadius: '15px',
                boxShadow: `0 4px 15px rgba(251, 191, 36, 0.2)`,
                overflow: 'hidden'
              }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title" style={{ color: accentGold }}>المستثمرون</h5>
                      <h2 className="mb-0" style={{ color: accentBlue }}>
                        {accounts.filter(a => a.type === 'investor').length}
                      </h2>
                      <div className="mt-2" style={{ color: lightGray, fontSize: '0.9rem' }}>
                        <i className="bi bi-check-circle-fill me-1" style={{ color: '#10b981' }}></i>
                        نشطة: {accounts.filter(a => a.type === 'investor' && a.status === 'active').length}
                      </div>
                    </div>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(96, 165, 250, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-person-badge" style={{ fontSize: '1.8rem', color: accentBlue }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card" style={{ 
                background: getCardColor(1),
                border: `1px solid ${accentTeal}`,
                borderRadius: '15px',
                boxShadow: `0 4px 15px rgba(45, 212, 191, 0.2)`,
                overflow: 'hidden'
              }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title" style={{ color: accentTeal }}>أصحاب المصانع</h5>
                      <h2 className="mb-0" style={{ color: accentTeal }}>
                        {accounts.filter(a => a.type === 'factory_owner').length}
                      </h2>
                      <div className="mt-2" style={{ color: lightGray, fontSize: '0.9rem' }}>
                        <i className="bi bi-check-circle-fill me-1" style={{ color: '#10b981' }}></i>
                        نشطة: {accounts.filter(a => a.type === 'factory_owner' && a.status === 'active').length}
                      </div>
                    </div>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(45, 212, 191, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-building" style={{ fontSize: '1.8rem', color: accentTeal }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card" style={{ 
                background: getCardColor(0),
                border: `1px solid ${accentBlue}`,
                borderRadius: '15px',
                boxShadow: `0 4px 15px rgba(96, 165, 250, 0.2)`,
                overflow: 'hidden'
              }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title" style={{ color: accentBlue }}>إجمالي الحسابات</h5>
                      <h2 className="mb-0" style={{ color: accentGold }}>
                        {accounts.length}
                      </h2>
                      <div className="mt-2" style={{ color: lightGray, fontSize: '0.9rem' }}>
                        <i className="bi bi-activity me-1" style={{ color: accentTeal }}></i>
                        تم إنشاؤها في آخر 30 يوم: {accounts.filter(a => 
                          new Date(a.registrationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ).length}
                      </div>
                    </div>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(251, 191, 36, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-people-fill" style={{ fontSize: '1.8rem', color: accentGold }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card" style={{ 
                background: getCardColor(1),
                border: `1px solid #10b981`,
                borderRadius: '15px',
                boxShadow: `0 4px 15px rgba(16, 185, 129, 0.2)`,
                overflow: 'hidden'
              }}>
                <div className="card-body text-center">
                  <h5 style={{ color: '#10b981' }}>الحسابات النشطة</h5>
                  <h2 className="mb-0" style={{ color: '#10b981' }}>
                    {accounts.filter(a => a.status === 'active').length}
                  </h2>
                  <div className="mt-2" style={{ color: lightGray, fontSize: '0.9rem' }}>
                    <i className="bi bi-arrow-up-right me-1"></i>
                    {((accounts.filter(a => a.status === 'active').length / accounts.length) * 100).toFixed(1)}% من الحسابات
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card" style={{ 
                background: getCardColor(0),
                border: `1px solid #f59e0b`,
                borderRadius: '15px',
                boxShadow: `0 4px 15px rgba(245, 158, 11, 0.2)`,
                overflow: 'hidden'
              }}>
                <div className="card-body text-center">
                  <h5 style={{ color: '#f59e0b' }}>الحسابات المعلقة</h5>
                  <h2 className="mb-0" style={{ color: '#f59e0b' }}>
                    {accounts.filter(a => a.status === 'pending').length}
                  </h2>
                  <div className="mt-2" style={{ color: lightGray, fontSize: '0.9rem' }}>
                    <i className="bi bi-clock-history me-1"></i>
                    بانتظار مراجعة الأدمن
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card" style={{ 
                background: getCardColor(1),
                border: `1px solid #ef4444`,
                borderRadius: '15px',
                boxShadow: `0 4px 15px rgba(239, 68, 68, 0.2)`,
                overflow: 'hidden'
              }}>
                <div className="card-body text-center">
                  <h5 style={{ color: '#ef4444' }}>الحسابات الموقوفة</h5>
                  <h2 className="mb-0" style={{ color: '#ef4444' }}>
                    {accounts.filter(a => a.status === 'suspended').length}
                  </h2>
                  <div className="mt-2" style={{ color: lightGray, fontSize: '0.9rem' }}>
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    تم تعليقها بسبب مخالفات
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Container>
  );
};

export default AdminAccountsPage;