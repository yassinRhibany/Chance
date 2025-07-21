import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Modal, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const AdminInvestments = () => {
  // States for investments data
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for filtering
  const [filter, setFilter] = useState({
    search: '',
    status: ''
  });
  
  // States for sorting
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // States for modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  // Fetch investments data from API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Investments/index');
        
        // Format the data
        const formattedInvestments = response.data.map(item => ({
          id: item.id,
          factory_name: item.opportunity?.factory_name || 'غير محدد',
          investor_name: item.user?.name || 'غير محدد',
          amount: parseFloat(item.amount) || 0,
          collected_amount: parseFloat(item.opportunity?.collected_amount) || 0,
          target_amount: parseFloat(item.opportunity?.target_amount) || 0,
          minimum_target: parseFloat(item.opportunity?.minimum_target) || 0,
          status: item.status || 'معلق',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
          payout_frequency: item.opportunity?.payout_frequency || 'غير محدد',
          start_date: item.start_date || 'غير محدد',
          descrption: item.descrption || 'لا يوجد وصف',
          percentage: item.percentage || 0
        }));
        
        setInvestments(formattedInvestments);
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter and sort investments
  const filteredAndSortedInvestments = investments
    .filter(investment => {
      // Search filter
      const matchesSearch = 
        investment.factory_name?.toLowerCase().includes(filter.search.toLowerCase()) ||
        investment.investor_name?.toLowerCase().includes(filter.search.toLowerCase());
      
      // Status filter
      const matchesStatus = filter.status ? 
        investment.status === filter.status : true;
      
      return matchesSearch && matchesStatus;
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
    setShowDetailsModal(true);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'مقبول') variant = 'success';
    else if (status === 'معلق') variant = 'warning';
    else if (status === 'مرفوض') variant = 'danger';
    
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
      </div>

      {/* Filter Section */}
      <div className="mb-4 p-3" style={{ backgroundColor: 'var(--secondary-dark)', borderRadius: '8px' }}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-group">
              <label style={{ color: 'var(--light-text)' }}>بحث</label>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="ابحث باسم المصنع أو المستثمر..."
                value={filter.search}
                onChange={handleFilterChange}
                style={{ 
                  backgroundColor: 'var(--secondary-dark)', 
                  color: 'var(--light-text)', 
                  borderColor: 'var(--accent)' 
                }}
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label style={{ color: 'var(--light-text)' }}>حالة الاستثمار</label>
              <select
                name="status"
                className="form-control"
                value={filter.status}
                onChange={handleFilterChange}
                style={{ 
                  backgroundColor: 'var(--secondary-dark)', 
                  color: 'var(--light-text)', 
                  borderColor: 'var(--accent)' 
                }}
              >
                <option value="">جميع الحالات</option>
                <option value="معلق">معلق</option>
                <option value="مقبول">مقبول</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedInvestments.length === 0 ? (
        <Alert variant="info" className="text-center">
          لا توجد استثمارات تطابق معايير البحث
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
                <th onClick={() => handleSort('collected_amount')} style={{ cursor: 'pointer' }}>
                  المبلغ المجموع {sortField === 'collected_amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  الحالة {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInvestments.map((investment) => (
                <tr key={investment.id}>
                  <td>{investment.id}</td>
                  <td>{investment.factory_name}</td>
                  <td>{investment.investor_name}</td>
                  <td>{investment.amount.toLocaleString()} ر.س</td>
                  <td>{investment.collected_amount.toLocaleString()} ر.س</td>
                  <td>{renderStatusBadge(investment.status)}</td>
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
          <Modal.Title>تفاصيل الاستثمار #{selectedInvestment?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--primary-dark)', color: 'var(--light-text)' }}>
          {selectedInvestment && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <h5>معلومات أساسية</h5>
                <p><strong>اسم المصنع:</strong> {selectedInvestment.factory_name}</p>
                <p><strong>اسم المستثمر:</strong> {selectedInvestment.investor_name}</p>
                <p><strong>حالة الاستثمار:</strong> {renderStatusBadge(selectedInvestment.status)}</p>
              </div>
              
              <div className="col-md-6 mb-3">
                <h5>تفاصيل مالية</h5>
                <p><strong>المبلغ المستثمر:</strong> {selectedInvestment.amount.toLocaleString()} ر.س</p>
                <p><strong>المبلغ المجموع:</strong> {selectedInvestment.collected_amount.toLocaleString()} ر.س</p>
                <p><strong>الهدف المالي:</strong> {selectedInvestment.target_amount.toLocaleString()} ر.س</p>
                <p><strong>الحد الأدنى للاستثمار:</strong> {selectedInvestment.minimum_target.toLocaleString()} ر.س</p>
              </div>
              
              <div className="col-md-6 mb-3">
                <h5>معلومات أخرى</h5>
                <p><strong>تكرار الدفع:</strong> {selectedInvestment.payout_frequency}</p>
                <p><strong>تاريخ البدء:</strong> {selectedInvestment.start_date}</p>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(selectedInvestment.created_at).toLocaleString()}</p>
              </div>
              
              <div className="col-12 mb-3">
                <h5>ملاحظات إضافية</h5>
                <p>{selectedInvestment.descrption}</p>
              </div>
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
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminInvestments;