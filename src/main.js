import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more-btn");

let currentQuery = "";
let totalHits = 0;
let loadedImages = 0;

hideLoader();
hideLoadMoreButton();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = form.elements["search-text"].value.trim();
  if (!query) {
    iziToast.error({
      message: "Please enter a search term!",
      position: "topRight",
    });
    return;
  }

  clearGallery();
  showLoader();

  currentQuery = query;
  loadedImages = 0;

  try {
    const data = await getImagesByQuery(query, true);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.warning({
        message:
          "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;

    if (loadedImages < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    }
  } catch (error) {
    iziToast.error({
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
    console.error("Submit error:", error);
  } finally {
    hideLoader();
    form.reset();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery);
    createGallery(data.hits);
    loadedImages += data.hits.length;
    
    const firstGalleryItem = document.querySelector(".gallery-item");
    if (firstGalleryItem) {
      const cardHeight = firstGalleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }

    if (loadedImages >= totalHits) {
      loadMoreBtn.style.display = "none";
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    }
  } catch (error) {
    iziToast.error({
      message: "Failed to load more images.",
      position: "topRight",
    });
    console.error("Load more error:", error);
  } finally {
    hideLoader();
  }
});