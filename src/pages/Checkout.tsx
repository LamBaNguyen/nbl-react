import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { motion } from "framer-motion";
import CustomConfirmDialog from "../components/CustomConfirmDialog";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);

  const instantProduct = location.state?.instantProduct;
  const productsToCheckout = instantProduct ? [instantProduct] : cart;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [confirmVisible, setConfirmVisible] = useState(false);

  const total = productsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    toast.current?.show({
      severity: "success",
      summary: t("checkout.success"),
      life: 2000,
    });
    if (!instantProduct) {
      clearCart();
    }
    navigate("/thank-you");
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please fill in all required fields!",
        life: 2000,
      });
      return;
    }
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      toast.current?.show({
        severity: "warn",
        summary: t("checkout.validation"),
        detail: t("checkout.invalidEmail"),
        life: 2000,
      });
      return;
    }

    // Kiểm tra số điện thoại ( 9–11 số)
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.current?.show({
        severity: "warn",
        summary: t("checkout.validation"),
        detail: t("checkout.invalidPhone"),
        life: 2000,
      });
      return;
    }

    setConfirmVisible(true);
  };

  return (
    <motion.div
      className="p-4 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Toast ref={toast} />

      {/* ConfirmDialog với footer tùy chỉnh */}
      <CustomConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        header={t("checkoutConfirm.title")}
        message={t("checkoutConfirm.message")}
        onAccept={placeOrder}
        acceptLabel={t("checkoutConfirm.yes")}
        rejectLabel={t("checkoutConfirm.no")}
      />

      <h2 className="text-2xl font-bold mb-6">{t("checkout.title")}</h2>
      {productsToCheckout.length === 0 ? (
        <p>{t("cart.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: FORM */}
          <div className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              {t("checkout.customerInfo")}
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder={t("checkout.name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder={t("checkout.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="tel"
                placeholder={t("checkout.phone")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <textarea
                placeholder={t("checkout.address")}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {t("checkout.placeOrder")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full mt-2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              {t("checkout.back")}
            </button>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              {t("checkout.summary")}
            </h3>
            <ul className="divide-y divide-gray-300 mb-4">
              {productsToCheckout.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg">
              <span>{t("checkout.total")}:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
