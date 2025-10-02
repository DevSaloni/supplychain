import React from 'react'
import { BrowserRouter ,Routes,Route } from 'react-router-dom'
import Home from "./pages/Home";
import ManufactureDashboard from './pages/ManufactureDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import ProductSearch from './pages/ProductSearch';
import About from "./pages/About";
import ViewFullHistory from './pages/ViewFullHistory';
import ContactPage from './pages/ContactPage';

import Navbar from './component/Navbar';
import Footer from './component/Footer';

import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <ToastContainer position="top-right" autoClose={8000} />

    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard/manufacture' element={<ManufactureDashboard/>}/>
        <Route path='/dashboard/transporter' element={<TransporterDashboard/>}/>
        <Route path='/dashboard/retailer' element={<RetailerDashboard/>}/>
        <Route path='/product-search' element={<ProductSearch/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<ContactPage/>}/>

        <Route path='/product-detail' element={<ViewFullHistory/>}/>
        

    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App;   
