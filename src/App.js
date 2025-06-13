import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/website/home/Homepage';
import Login from './Auth/Login';
import Register from './Auth/Rejister';
import Header from './components/dashboard/header/Header';
import About from './pages/website/ِabout/about';
import Investment from './pages/website/investment/investment';

import CompleteUserProfile from './pages/website/userinfo/CompleteUserProfile';

import Card from './pages/website/investment/card';

import Investmentrecord from './pages/website/investment/investmentrecord';
import Sidebar from './components/dashboard/sidebar/Sidebar';
import { SidebarProvider } from './Context/SidebarContext';
import Wallet from './pages/Payment/payment';
import FactoryRegistration from './pages/website/FactoryOwner/FactoryRegistration';
import FinancialTransactions from './pages/website/userinfo/FinancialTransactions ';
import UnauthorizedPage from './pages/website/Unauthorized/Unauthorized'
import { AdminRoute, InvestorRoute, FactoryOwnerRoute } from './Auth/ProtectedRoute';
import { AuthProvider } from './Context/AuthContext'; // أضفنا هذا الاستيراد


export default function App() {

  return (
    <AuthProvider>
      <SidebarProvider>
        <div className='App  app-container'>
          <Header />
          <div className='content-wrappe' style={{ display: 'flex', minHeight: '100vh' }} >
            <Sidebar />
            {/* المحتوى الرئيسي */}


            <div className="main-content" style={{ flex: 1 }}>


             <Routes>
                {/* مسارات عامة */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />

                {/* مسارات المدير */}
                {/* <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                </Route> */}

                {/* مسارات المستثمر */}
                <Route element={<InvestorRoute />}>
                  <Route path="/investor/investment" element={<Investment />} />
                  <Route path="/investor/profile" element={<CompleteUserProfile />} />
                  <Route path="/investor/wallet" element={<Wallet />} />
                  <Route path="/investor/record" element={<Investmentrecord />} />
                  <Route path="/investor/transactions" element={<FinancialTransactions />} />
                </Route>

                {/* مسارات صاحب المصنع */}
                <Route element={<FactoryOwnerRoute />}>
                  <Route path="/factory/registration" element={<FactoryRegistration />} />
                  <Route path="/factory/profile" element={<CompleteUserProfile />} />
                  <Route path="/factory/wallet" element={<Wallet />} />
                </Route>
              </Routes>
              
              {/* <Routes>
                <Route path='/' element={<HomePage />} ></Route>
                <Route path='/login' element={<Login />} ></Route> 
                <Route path='/register' element={<Register />} ></Route>
                <Route path='/about' element={<About />} ></Route>
                <Route path='/investment' element={<Investment />} ></Route>
                <Route path='/CompleteUserProfile' element={<CompleteUserProfile />} ></Route>
                <Route path='/Walet' element={<Wallet />} ></Route>
                <Route path='card' element={<Card />} />
                <Route path='/investmentrecord' element={<Investmentrecord />} />
                <Route path='/FactoryRegistration' element={<FactoryRegistration />} />
                <Route path='/FinancialTransactions' element={<FinancialTransactions />} />
              </Routes> */}



            </div>
          </div>

        </div>
      </SidebarProvider>
    </AuthProvider>


  );
}


