import axios from "axios";

const API = "https://fakestoreapi.com"; // API public

export const getProducts = () => axios.get(`${API}/products`);
export const getProductById = (id: string) => axios.get(`${API}/products/${id}`);
