import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/website/home/Homepage';
import Login from './Auth/Login';
import Register from './Auth/Rejister';
import Header from './components/dashboard/header/Header';
import About from './pages/website/ِabout/about';
import Investment from './pages/website/investor/investment';

import CompleteUserProfile from './pages/website/userinfo/CompleteUserProfile';

import Card from './pages/website/investor/card';

import Investmentrecord from './pages/website/investor/investmentrecord';
import Sidebar from './components/dashboard/sidebar/Sidebar';
import { SidebarProvider } from './Context/SidebarContext';
import Wallet from './pages/Payment/payment';
import FactoryRegistration from './pages/website/FactoryOwner/FactoryRegistration';
import FinancialTransactions from './pages/website/userinfo/FinancialTransactions ';
import UnauthorizedPage from './pages/website/Unauthorized/Unauthorized'
import {InvestorLayout} from './Auth/ProtectRouts/InvestorLayout'
import {FactoryLayout} from './Auth/ProtectRouts/FactoryLayout'
import {AdminLayout} from './Auth/ProtectRouts/AdminLayout'
import { AuthProvider } from './Context/AuthContext'; // أضفنا هذا الاستيراد

import AdminAccountsPage from './pages/website/Admin/AdminAccountsPage';
import UserDetailsPage from './pages/website/Admin/UserDetailsPage';
import AdminInvestmentPage from './pages/website/Admin/AdminInvestmentPage';
import AdminFactories from './pages/website/Admin/AdminFactoryes';


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
                <Route element={<AdminLayout />}>
                 <Route path='/Admin/AdminAccountsPage' element={<AdminAccountsPage/>}/>
                 <Route path="UserDetailsPage" element={<UserDetailsPage />} />
                 <Route path="/Admin/AdminInvestmentPage" element={<AdminInvestmentPage />} />
                 <Route path="/Admin/AdminFactories" element={<AdminFactories />} />
                </Route>

                {/* مسارات المستثمر */}
                <Route element={<InvestorLayout />}>
                  <Route path="/investor/investment" element={<Investment />} />
                  <Route path="/investor/profile" element={<CompleteUserProfile />} />
                  <Route path="/investor/wallet" element={<Wallet />} />
                  <Route path="/investor/record" element={<Investmentrecord />} />
                  <Route path="/investor/Card" element={<Card />} />

                  <Route path="/investor/transactions" element={<FinancialTransactions />} />
                </Route>


                {/* مسارات صاحب المصنع */}
                <Route element={<FactoryLayout />}>
                  <Route path="/factory/registration" element={<FactoryRegistration />} />
                  <Route path="/factory/profile" element={<CompleteUserProfile />} />
                  <Route path="/factory/wallet" element={<Wallet />} />
                </Route>



              </Routes>
            </div>
          </div>

        </div>
      </SidebarProvider>
    </AuthProvider>


  );
}


