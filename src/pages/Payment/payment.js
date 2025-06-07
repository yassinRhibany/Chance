import { useState, useEffect } from 'react';
import { 
  Wallet2, 
  CashStack, 
  ArrowUpRight, 
  ArrowDownLeft,
  ClockHistory
} from 'react-bootstrap-icons';

export default function WalletCard () {
  const [balance, setBalance] = useState(12500);
  const [transactions, setTransactions] = useState([]);

  // محاكاة جلب البيانات
  useEffect(() => {
    setTransactions([
      { id: 1, type: 'deposit', amount: 5000, date: '2023-05-15', description: 'إيداع عبر STC Pay' },
      { id: 2, type: 'withdraw', amount: 2000, date: '2023-05-10', description: 'سحب إلى البنك الأهلي' },
      { id: 3, type: 'deposit', amount: 3000, date: '2023-05-05', description: 'تحويل من محمد أحمد' }
    ]);
  }, []);

  return (
    <div className="wallet-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* بطاقة الرصيد الرئيسية */}
      <div 
        className="balance-card p-4 mb-4 rounded-4 shadow"
        style={{
          background: 'linear-gradient(135deg, #1D1E22 0%, #2A2C33 100%)',
          border: '1px solid #393F4D',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: '#D4D4DC' }}>
            <Wallet2 className="me-2" />
            رصيد المحفظة
          </h5>
          <span className="badge rounded-pill" style={{ backgroundColor: '#FEDA6A', color: '#1D1E22' }}>
            فعال
          </span>
        </div>
        
        <h2 className="mb-4" style={{ color: '#FEDA6A' }}>
          {balance.toLocaleString()} <small style={{ fontSize: '1rem', color: '#D4D4DC' }}>ر.س</small>
        </h2>
        
        <div className="d-flex gap-3">
          <button 
            className="btn btn-accent py-2 px-3 rounded-3 d-flex align-items-center"
            style={{
              backgroundColor: '#FEDA6A',
              color: '#1D1E22',
              border: 'none',
              fontWeight: '600'
            }}
          >
            <ArrowDownLeft className="me-2" />
            إيداع
          </button>
          
          <button 
            className="btn btn-outline-accent py-2 px-3 rounded-3 d-flex align-items-center"
            style={{
              borderColor: '#FEDA6A',
              color: '#FEDA6A',
              backgroundColor: 'transparent'
            }}
          >
            <ArrowUpRight className="me-2" />
            سحب
          </button>
        </div>
        
        {/* عناصر زخرفية */}
        <div 
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(254, 218, 106, 0.1)'
          }}
        ></div>
      </div>
      
      {/* قائمة الحركات */}
      <div className="transactions-list">
        <h6 className="mb-3 d-flex align-items-center" style={{ color: '#D4D4DC' }}>
          <ClockHistory className="me-2" />
          آخر الحركات
        </h6>
        
        {transactions.map(transaction => (
          <div 
            key={transaction.id}
            className="transaction-item p-3 mb-3 rounded-3 d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: '#393F4D',
              transition: 'all 0.3s ease'
            }}
          >
            <div className="d-flex align-items-center">
              <div 
                className="icon-wrapper me-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: transaction.type === 'deposit' 
                    ? 'rgba(40, 167, 69, 0.2)' 
                    : 'rgba(220, 53, 69, 0.2)'
                }}
              >
                {transaction.type === 'deposit' ? 
                  <ArrowDownLeft color="#28a745" /> : 
                  <ArrowUpRight color="#dc3545" />
                }
              </div>
              <div>
                <p className="mb-0" style={{ color: '#D4D4DC' }}>{transaction.description}</p>
                <small style={{ color: '#6c757d' }}>{transaction.date}</small>
              </div>
            </div>
            <div 
              style={{ 
                color: transaction.type === 'deposit' ? '#28a745' : '#dc3545',
                fontWeight: '600'
              }}
            >
              {transaction.type === 'deposit' ? '+' : '-'}
              {transaction.amount.toLocaleString()} ر.س
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

