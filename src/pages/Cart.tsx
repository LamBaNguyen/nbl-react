import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: number) => {
    removeFromCart(id);
    toast.current?.show({
      severity: "info",
      summary: t("cart.removed"),
      life: 1500,
    });
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-4">{t("cart.title")}</h2>
      {cart.length === 0 ? (
        <p>{t("cart.empty")}</p>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="w-16 h-16" />
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p>${item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-300 px-2 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-gray-300 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                {t("common.delete") || "Remove"}
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center font-bold text-lg">
            <span>{t("cart.total")}:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/")}
            >
              {t("cart.continue")}
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/checkout")}
            >
              {t("cart.checkout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
