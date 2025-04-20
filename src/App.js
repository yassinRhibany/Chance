
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/website/Homepage';
import Login from './Auth/Login';
import Register from './Auth/Rejister';

export default  function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>} ></Route> 
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/register' element={<Register/>} ></Route>

       
      </Routes>
     
    </div>
  );
}


