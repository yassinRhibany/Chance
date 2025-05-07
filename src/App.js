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




export default function App() {
  return (
    
      <div className="App" >
        <Header />
        <Routes>

          <Route path='/' element={<HomePage />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/register' element={<Register />} ></Route>
          <Route path='/about' element={<About />} ></Route>
          <Route path='/investment' element={<Investment />} ></Route>
          <Route path='/CompleteUserProfile' element={<CompleteUserProfile />} ></Route>

          <Route path='/' element={<HomePage />}Route/>
          <Route path='/login' element={<Login />} Route/>
          <Route path='/register' element={<Register />} Route/>
          <Route path='/about' element={<About />} Route/>
          <Route path='/investment' element={<Investment />}  Route/>
          <Route path='card' element={<Card/>}/>
          <Route path='/investmentrecord' element={<Investmentrecord/>}/>
         


        </Routes>

      </div>
   

  );
}


