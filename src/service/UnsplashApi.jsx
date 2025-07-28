import axios from "axios";

const BASE_URL = 'https://api.unsplash.com/search/photos';
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Yeh function place ka naam lega aur usse related photo dhoondhega
export const getPhotoByQuery = (query) => {
  const url = `${BASE_URL}?query=${query}&per_page=1&orientation=landscape&client_id=${ACCESS_KEY}`;
  return axios.get(url);
};