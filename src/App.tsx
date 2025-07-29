import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
// import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
