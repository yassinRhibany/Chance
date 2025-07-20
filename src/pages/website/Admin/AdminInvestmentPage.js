import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const AdminInvestments = () => {
  // States for investments data
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for filtering and sorting
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // States for modal and selected investment
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  
  // States for status update
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Fetch investments data from API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Investments/index');
        setInvestments(response.data.data || []);
        console.log(response);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب البيانات');
        setLoading(false);
      }
    };
    
    
    fetchInvestments();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort investments
  const filteredAndSortedInvestments = investments
    .filter(investment => {
      if (!filter) return true;
      return (
        investment.factory_name?.toLowerCase().includes(filter.toLowerCase()) ||
        investment.investor_name?.toLowerCase().includes(filter.toLowerCase()) ||
        investment.status?.toLowerCase().includes(filter.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle investment details view
  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setNewStatus(investment.status);
    setShowDetailsModal(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedInvestment || !newStatus) return;
    
    setUpdatingStatus(true);
    setStatusUpdateError(null);
    
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/Investments/update/${selectedInvestment.id}`,
        { status: newStatus }
      );
      
      // Update local state
      setInvestments(investments.map(inv => 
        inv.id === selectedInvestment.id ? { ...inv, status: newStatus } : inv
      ));
      
      setSelectedInvestment({ ...selectedInvestment, status: newStatus });
      setUpdatingStatus(false);
    } catch (err) {
      setStatusUpdateError(err.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة');
      setUpdatingStatus(false);
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'مكتمل') variant = 'success';
    else if (status === 'معلق') variant = 'warning';
    else if (status === 'ملغى') variant = 'danger';
    else if (status === 'قيد التنفيذ') variant = 'primary';
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status" style={{ color: 'var(--accent)' }}>
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: 'var(--primary-dark)', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'var(--light-text)' }}>إدارة الاستثمارات</h2>
        
        <Form.Group className="mb-3" style={{ width: '300px' }}>
          <Form.Control
            type="text"
            placeholder="ابحث باسم المصنع أو المستثمر أو الحالة..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              backgroundColor: 'var(--secondary-dark)', 
              color: 'var(--light-text)', 
              borderColor: 'var(--accent)' 
            }}
          />
        </Form.Group>
      </div>

      {filteredAndSortedInvestments.length === 0 ? (
        <Alert variant="info" className="text-center">
          لا توجد استثمارات لعرضها
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover variant="dark" style={{ color: 'var(--light-text)' }}>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                  # {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('factory_name')} style={{ cursor: 'pointer' }}>
                  المصنع {sortField === 'factory_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('investor_name')} style={{ cursor: 'pointer' }}>
                  المستثمر {sortField === 'investor_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                  المبلغ {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('profit_percentage')} style={{ cursor: 'pointer' }}>
                  نسبة الربح {sortField === 'profit_percentage' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  الحالة {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>
                  تاريخ الإضافة {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInvestments.map((investment) => (
                <tr key={investment.id}>
                  <td>{investment.id}</td>
                  <td>{investment.factory_name || 'غير محدد'}</td>
                  <td>{investment.investor_name || 'غير محدد'}</td>
                  <td>{investment.amount?.toLocaleString() || '0'} ر.س</td>
                  <td>{investment.profit_percentage || '0'}%</td>
                  <td>{renderStatusBadge(investment.status || 'غير محدد')}</td>
                  <td>{new Date(investment.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleViewDetails(investment)}
                      style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                    >
                      التفاصيل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Investment Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: 'var(--secondary-dark)', color: 'var(--light-text)' }}>
          <Modal.Title>تفاصيل الاستثمار</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--primary-dark)', color: 'var(--light-text)' }}>
          {selectedInvestment && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <h5>معلومات المصنع</h5>
                <p><strong>اسم المصنع:</strong> {selectedInvestment.factory_name || 'غير محدد'}</p>
                <p><strong>صاحب المصنع:</strong> {selectedInvestment.factory_owner || 'غير محدد'}</p>
                <p><strong>موقع المصنع:</strong> {selectedInvestment.factory_location || 'غير محدد'}</p>
              </div>
              
              <div className="col-md-6 mb-3">
                <h5>معلومات المستثمر</h5>
                <p><strong>اسم المستثمر:</strong> {selectedInvestment.investor_name || 'غير محدد'}</p>
                <p><strong>البريد الإلكتروني:</strong> {selectedInvestment.investor_email || 'غير محدد'}</p>
                <p><strong>رقم الهاتف:</strong> {selectedInvestment.investor_phone || 'غير محدد'}</p>
              </div>
              
              <div className="col-md-6 mb-3">
                <h5>تفاصيل الاستثمار</h5>
                <p><strong>المبلغ المستثمر:</strong> {selectedInvestment.amount?.toLocaleString() || '0'} ر.س</p>
                <p><strong>نسبة الربح:</strong> {selectedInvestment.profit_percentage || '0'}%</p>
                <p><strong>تكرار الدفع:</strong> {selectedInvestment.payout_frequency || 'غير محدد'}</p>
                <p><strong>تاريخ البدء:</strong> {selectedInvestment.start_date || 'غير محدد'}</p>
              </div>
              
              <div className="col-md-6 mb-3">
                <h5>حالة الاستثمار</h5>
                <Form.Group className="mb-3">
                  <Form.Label>تغيير الحالة</Form.Label>
                  <Form.Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ 
                      backgroundColor: 'var(--secondary-dark)', 
                      color: 'var(--light-text)', 
                      borderColor: 'var(--accent)' 
                    }}
                  >
                    <option value="معلق">معلق</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                    <option value="ملغى">ملغى</option>
                  </Form.Select>
                </Form.Group>
                
                <p><strong>تاريخ الإنشاء:</strong> {new Date(selectedInvestment.created_at).toLocaleString()}</p>
                <p><strong>آخر تحديث:</strong> {new Date(selectedInvestment.updated_at).toLocaleString()}</p>
              </div>
              
              {selectedInvestment.descrption && (
                <div className="col-12 mb-3">
                  <h5>ملاحظات إضافية</h5>
                  <p>{selectedInvestment.descrption}</p>
                </div>
              )}
              
              {statusUpdateError && (
                <div className="col-12">
                  <Alert variant="danger">{statusUpdateError}</Alert>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--secondary-dark)' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDetailsModal(false)}
            style={{ backgroundColor: 'var(--secondary-dark)', borderColor: 'var(--accent)', color: 'var(--light-text)' }}
          >
            إغلاق
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStatusUpdate}
            disabled={updatingStatus || newStatus === selectedInvestment?.status}
            style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--primary-dark)' }}
          >
            {updatingStatus ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">جاري التحديث...</span>
              </>
            ) : 'حفظ التغييرات'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminInvestments;