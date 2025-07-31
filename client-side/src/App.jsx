import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import About from './components/About';
import News from './components/News';
import Gallery from './components/Gallery';
import Header from './components/Header';
import ContactUs from './components/Contact Us';
import OurCause from './components/Our Cause';
import Footer from './components/Footer';
import Donate from './components/Donate';
import ProgressIndicator from './components/ProgressIndicator ';
import SantimPayWizard from './components/SantimPayWizard';
import ReceiptPage from './pages/RecieptPage.jsx'
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminRegister from './components/AdminRegister';

// import NotFound from './components/NotFound';
function App() {
  return (
    <Router>
      <div>
        <Header />
        {/* <h1>Welcome to Menna Center</h1> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/news" element={<News />} /> */}
           <Route path="/gallery" element={<Gallery/>} />
            <Route path="/contact" element={<ContactUs />} />
             <Route path="/our cause" element={<OurCause />} />
             <Route path="/donate" element={<Donate/>}/>
             <Route path="/ProgressIndicator" element= {<ProgressIndicator/>}/>
               {/* <Route path="/santimpay" element={<SantimPayPage />} /> */}
             <Route path="/santimpay" element={<SantimPayWizard />} />
            <Route path="/receipt" element={<ReceiptPage />} />
              <Route path="/admin-login" element={<AdminLogin />} />
             <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-register" element={<AdminRegister />} />

        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}
export default App;
