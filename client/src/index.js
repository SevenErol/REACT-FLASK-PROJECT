import React from 'react'
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateProduct from './components/CreateProduct';

const App = () => {

    return (
        <BrowserRouter>
            <div className="container">
                <Navbar />
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create_product" element={<CreateProduct />} />
                </Routes>
            </div >
        </BrowserRouter>
    )
}

//ReactDOM.render(<App />, document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);