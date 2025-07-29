import { useEffect, useState, useRef } from "react";
import { getProducts } from "../services/api";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useDebounce } from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>("all");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useRef<Toast>(null);
  const { t } = useTranslation();

  const categories = [
    { label: "All", value: "all" },
    { label: "Dog", value: "dog" },
    { label: "Cat", value: "cat" },
    { label: "Bird", value: "bird" },
    { label: "Other", value: "other" },
  ];

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    toast.current?.show({
      severity: "success",
      summary: t("home.addedMsg"),
      life: 1500,
    });
  };

  const goToDetail = (id: number) => {
    navigate(`/product/${id}`);
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      filterCategory === "all" || !filterCategory ? true : p.category === filterCategory;
    const matchSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold mb-4">{t("home.title")}</h2>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <Dropdown
          value={filterCategory}
          options={categories}
          onChange={(e) => setFilterCategory(e.value)}
          placeholder={t("home.filter")}
          className="w-48"
        />
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("home.search")}
          className="w-64"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>{t("home.noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <Card
              key={p.id}
              title={p.title}
              image={p.image}
              price={p.price}
              onAddToCart={() => handleAddToCart(p)}
              onViewDetail={() => goToDetail(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
