import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/website/home/Homepage';
import Login from './Auth/Login';
import Register from './Auth/Rejister';
import Header from './components/dashboard/header/Header';
import About from './pages/website/ِabout/about';
import Investment from './pages/website/investment/investment';
<<<<<<< HEAD
import CompleteUserProfile from './pages/website/userinfo/CompleteUserProfile';
=======
import Card from './pages/website/investment/card';
>>>>>>> 71eec35eab93d409ac80143de9ceb5c763e85700

export default function App() {
  return (
    
      <div className="App" >
        <Header />
        <Routes>
<<<<<<< HEAD
          <Route path='/' element={<HomePage />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/register' element={<Register />} ></Route>
          <Route path='/about' element={<About />} ></Route>
          <Route path='/investment' element={<Investment />} ></Route>
          <Route path='/CompleteUserProfile' element={<CompleteUserProfile />} ></Route>
=======
          <Route path='/' element={<HomePage />}Route/>
          <Route path='/login' element={<Login />} Route/>
          <Route path='/register' element={<Register />} Route/>
          <Route path='/about' element={<About />} Route/>
          <Route path='/investment' element={<Investment />}  Route/>
      <Route path='card' element={<Card/>}/>
         
>>>>>>> 71eec35eab93d409ac80143de9ceb5c763e85700

        </Routes>

      </div>
   

  );
}


