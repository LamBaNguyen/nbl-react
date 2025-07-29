import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart, removeFromCart } = useCart();
  const { t, i18n } = useTranslation();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">{t("navbar.home")}</Link>
        </h1>
        <div className="flex items-center gap-6">
          <Link to="/admin" className="hover:underline">{t("navbar.admin")}</Link>

          {/* Cart Icon + Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <button className="relative">
              {t("navbar.cart")}
              {totalItems > 0 && (
                <span className="bg-red-500 px-2 py-0.5 rounded-full text-sm absolute -top-2 -right-3">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Dropdown with animation */}
            <AnimatePresence>
              {showCartPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white text-black rounded shadow-lg p-3 z-10"
                >
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500">{t("cart.empty")}</p>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-200 max-h-56 overflow-y-auto">
                        {cart.map((item) => (
                          <li key={item.id} className="py-2 flex justify-between items-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="ml-2 flex-1">
                              <p className="font-bold text-sm">{item.title}</p>
                              <p className="text-xs">${item.price} x {item.quantity}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between font-bold mt-3">
                        <span>{t("cart.total")}:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => navigate("/cart")}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                      >
                        {t("navbar.goToCart")}
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Switcher */}
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="text-black rounded px-2"
            defaultValue={i18n.language}
          >
            <option value="en">EN</option>
            <option value="vi">VI</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
