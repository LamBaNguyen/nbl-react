import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getProductById } from "../services/api";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  images?: string[]; // Nếu có nhiều ảnh
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      getProductById(id).then((res) => {
        setProduct(res.data);
        setSelectedImage(res.data.image);
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      toast.current?.show({
        severity: "success",
        summary: t("home.addedMsg"),
        detail: `${product?.title} ${t("home.addedMsg")}`,
        life: 2000,
      });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/checkout", {
      state: {
        instantProduct: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      },
    });
  };

  if (!product)
    return (
      <div className="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Toast ref={toast} />
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← {t("common.back")}
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT: IMAGE GALLERY */}
        <div className="flex-1">
          <div className="border rounded-lg p-2">
            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="w-full h-96 object-contain rounded"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                    selectedImage === img ? "border-blue-500" : ""
                  }`}
                  alt={`Thumbnail ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: INFO */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-2xl text-red-600 font-bold my-3">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-6">
            {t("product.description")}: {product.description || "N/A"}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded text-lg"
            >
              {t("product.addToCart")}
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
