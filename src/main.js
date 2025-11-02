import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  smoothScroll,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more-btn");

let currentQuery = "";
let totalHits = 0;
let loadedImages = 0;


function notify(type, message) {
  iziToast[type]({
    message,
    position: "topRight",
    timeout: 3000,
  });
}

hideLoader();
hideLoadMoreButton();


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = form.elements["search-text"].value.trim();
  if (!query) {
    notify("error", "Please enter a search term!");
    return;
  }

  clearGallery();
  showLoader();
  hideLoadMoreButton();

  currentQuery = query;
  loadedImages = 0;

  try {
    const data = await getImagesByQuery(query, true);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      notify("error", "Sorry, there are no images matching your search query. Please try again!");
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;

    if (loadedImages < totalHits) {
      showLoadMoreButton();
    } else {
      notify("info", "We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    notify("error", "Something went wrong. Please try again later.");
    console.error("Submit error:", error);
  } finally {
    hideLoader();
    form.reset();
  }
});


loadMoreBtn.addEventListener("click", async () => {
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery);
    createGallery(data.hits);
    loadedImages += data.hits.length;

    smoothScroll();

    if (loadedImages >= totalHits) {
      notify("info", "We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    notify("error", "Failed to load more images.");
    console.error("Load more error:", error);
  } finally {
    hideLoader();
  }
});