import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/website/home/Homepage';
import Login from './Auth/Login';
import Register from './Auth/Rejister';
import Header from './components/dashboard/header/Header';
import About from './pages/website/ِabout/about';

export default function App() {
  return (
    
      <div className="App" >
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/register' element={<Register />} ></Route>
          <Route path='/about' element={<About />} ></Route>

        </Routes>

      </div>
   

  );
}


