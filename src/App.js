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
import { Container } from 'react-bootstrap';
import Wallet from './pages/Payment/payment';
import FactoryRegistration from './pages/website/FactoryOwner/FactoryRegistration';
import FinancialTransactions from './pages/website/userinfo/FinancialTransactions ';



export default function App() {

  return (
    <SidebarProvider>
      <div className='App  app-container'>
        <Header />
        <div className='content-wrappe' style={{ display: 'flex', minHeight: '100vh' }} >
          <Sidebar />
          {/* المحتوى الرئيسي */}
          
    
          <div className="main-content" style={{ flex: 1 }}>
        {/* <Container > */}
       
              <Routes>

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
                <Route path='/FinancialTransactions' element={<FinancialTransactions/>} />
              

              </Routes>
      
   {/* </Container> */}

          </div>
        </div>

      </div>
    </SidebarProvider>


  );
}


