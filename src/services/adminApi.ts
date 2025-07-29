import axios from "axios";
const API = "http://localhost:3000/pets";

export const getPets = () => axios.get(API);
export const addPet = (pet: any) => axios.post(API, pet);
export const updatePet = (id: number, pet: any) => axios.put(`${API}/${id}`, pet);
export const deletePet = (id: number) => axios.delete(`${API}/${id}`);
