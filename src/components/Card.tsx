import { useTranslation } from "react-i18next";

interface CardProps {
  title: string;
  image: string;
  price: number;
  onAddToCart: () => void;
  onViewDetail: () => void;
}

export default function Card({ title, image, price, onAddToCart, onViewDetail }: CardProps) {
  const { t } = useTranslation();

  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded" />
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-blue-600 font-bold">${price}</p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t("home.addToCart")}
        </button>
        <button
          onClick={onViewDetail}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          {t("home.viewDetail")}
        </button>
      </div>
    </div>
  );
}
