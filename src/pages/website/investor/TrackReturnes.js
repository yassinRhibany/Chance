import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, ProgressBar, 
  Button, Badge, Form, InputGroup, Spinner, Alert
} from 'react-bootstrap';
import { 
  FaMoneyBillWave, FaCalendarAlt, FaSearch, 
  FaFilter, FaFilePdf, FaSync, FaArrowUp,
  FaInfoCircle, FaCoins, FaChartLine, FaBuilding
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const TrackReturnes = () => {
  const { user } = useAuth();
  const token = user?.token || null;
  
  // State for investments and filters
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [timeFilter, setTimeFilter] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Statistics state
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    projectedReturns: 0,
    activeInvestments: 0,
    lastReturn: 0
  });

  // Fetch returns data from API
  const fetchReturnsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/api/Returns/getUserReturns',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );console.log(response);

      // Check if response.data exists and is an array
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error('بيانات العوائد غير متوفرة أو غير صالحة');
      }

      const formattedInvestments = response.data.data.map(item => ({
        id: item.id?.toString() || 'غير محدد',
        factory: item.factory_name || 'غير محدد',
        category: item.category || 'أخرى',
        shares: item.shares || 0,
        investedAmount: parseFloat(item.invested_amount) || 0,
        date: item.investment_date || 'غير محدد',
        status: getStatusText(item.status),
        returns: Array.isArray(item.returns) ? item.returns.map(ret => ({
          date: ret.return_date,
          amount: parseFloat(ret.amount) || 0
        })) : [],
        projectedReturns: parseFloat(item.projected_returns) || 0
      }));

      setInvestments(formattedInvestments);
      setFilteredInvestments(formattedInvestments);
      calculateStats(formattedInvestments);
    } catch (err) {
      console.error('Error fetching returns data:', err);
      setError(err.response?.data?.message || err.message || 'حدث خطأ في جلب بيانات العوائد');
      setInvestments([]);
      setFilteredInvestments([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert status to Arabic text
  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'pending': return 'معلق';
      default: return status || 'غير محدد';
    }
  };

  // Calculate statistics
  const calculateStats = (investmentsData) => {
    if (!investmentsData || investmentsData.length === 0) {
      setStats({
        totalInvested: 0,
        totalReturns: 0,
        projectedReturns: 0,
        activeInvestments: 0,
        lastReturn: 0
      });
      return;
    }

    const totalInvested = investmentsData.reduce((sum, inv) => sum + (inv.investedAmount || 0), 0);
    const totalReturns = investmentsData.reduce((sum, inv) => 
      sum + (inv.returns?.reduce((retSum, ret) => retSum + (ret.amount || 0), 0) || 0), 0);
    const projectedReturns = investmentsData.reduce((sum, inv) => sum + (inv.projectedReturns || 0), 0);
    const activeInvestments = investmentsData.filter(inv => inv.status === 'نشط').length;
    
    const allReturns = investmentsData.flatMap(inv => inv.returns || []);
    const lastReturn = allReturns.length > 0 
      ? allReturns.sort((a, b) => new Date(b.date) - new Date(a.date))[0].amount
      : 0;
    
    setStats({
      totalInvested,
      totalReturns,
      projectedReturns,
      activeInvestments,
      lastReturn
    });
  };

  // Format currency (SYP)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'غير محدد') return 'غير محدد';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ar-SA', options);
    } catch {
      return dateString;
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'نشط': return 'success';
      case 'مكتمل': return 'primary';
      case 'معلق': return 'warning';
      default: return 'secondary';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'أثاث': '#795548',
      'بلاستيك': '#ff9800',
      'ورق وطباعة': '#3f51b5',
      'أغذية ومشروبات': '#4caf50',
      'إلكترونيات': '#9c27b0',
      'أخرى': '#9e9e9e'
    };
    return colors[category] || '#9e9e9e';
  };

  // Calculate total returns for an investment
  const getTotalReturns = (investment) => {
    if (!investment.returns) return 0;
    return investment.returns.reduce((sum, ret) => sum + (ret.amount || 0), 0);
  };

  // Calculate return percentage
  const getReturnPercentage = (investment) => {
    const totalReturns = getTotalReturns(investment);
    const investedAmount = investment.investedAmount || 1; // Avoid division by zero
    return (totalReturns / investedAmount) * 100;
  };

  // Refresh data
  const refreshData = () => {
    fetchReturnsData();
  };

  // Apply filters
  useEffect(() => {
    let result = investments;
    
    if (searchTerm) {
      result = result.filter(inv => 
        (inv.factory?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (inv.id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'الكل') {
      result = result.filter(inv => inv.status === statusFilter);
    }
    
    if (timeFilter === 'السنة الحالية') {
      const currentYear = new Date().getFullYear();
      result = result.filter(inv => {
        try {
          return new Date(inv.date).getFullYear() === currentYear;
        } catch {
          return false;
        }
      });
    } else if (timeFilter === 'السنة الماضية') {
      const lastYear = new Date().getFullYear() - 1;
      result = result.filter(inv => {
        try {
          return new Date(inv.date).getFullYear() === lastYear;
        } catch {
          return false;
        }
      });
    }
    
    setFilteredInvestments(result);
    calculateStats(result);
  }, [searchTerm, statusFilter, timeFilter, investments]);

  // Initial data fetch
  useEffect(() => {
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      setIsLoading(false);
      return;
    }
    fetchReturnsData();
  }, [token]);

  // Loading state
  if (isLoading && investments.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#121212', 
        color: '#e0e0e0',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Spinner animation="border" variant="primary" />
        <span className="mt-3">جاري تحميل البيانات...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#121212', 
        color: '#e0e0e0',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Alert variant="danger" className="text-center" style={{ maxWidth: '500px' }}>
          <FaInfoCircle className="mb-2" size={24} />
          <h5>حدث خطأ</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={refreshData}>
              <FaSync className="me-2" /> إعادة المحاولة
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // ... [rest of the JSX remains exactly the same as in your original code]
  // The only changes were made to the data handling and error handling parts above

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: '#e0e0e0',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      {/* Rest of your JSX remains unchanged */}
      {/* ... */}
    </div>
  );
};

export default TrackReturnes;