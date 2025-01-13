import React from 'react'
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/main.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateProduct from './components/CreateProduct';
import Users from './components/Users';
import Categories from './components/Categories';
import CreateCategory from './components/CreateCategory';

const App = () => {

    return (
        <BrowserRouter>
            <div className="container-fluid p-0 m-0">
                <Navbar />
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create_product" element={<CreateProduct />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/create_category" element={<CreateCategory />} />
                </Routes>
            </div >
        </BrowserRouter>
    )
}

//ReactDOM.render(<App />, document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);