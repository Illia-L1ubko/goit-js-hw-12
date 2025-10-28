import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "52593892-e60586d66f6e8b7acef69d169";

let page = 1;
const per_page = 15;

export async function getImagesByQuery(query, isNewSearch = false) {
  if (isNewSearch) {
    page = 1;
  }

  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page,
    page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    page += 1;
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}