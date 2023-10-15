// 40006443-846b79f7a1daab8015f139807

import axios from "axios";
import throttle  from "lodash.throttle";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { btn } from "./helpers/scroll";

const lightbox = new SimpleLightbox('.gallery a');
const API_KEY = "40006443-846b79f7a1daab8015f139807";
const BASE_URL = "https://pixabay.com/api/";
let query = "";
let page = 1;

const refs = {
    form: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
    loadMore: document.querySelector(".load-more"),
    lastPage: document.querySelector(".last-page"),
    btn: document.querySelector(".go"),
}

refs.form.addEventListener("input", throttle(handleInput, 500));
refs.form.addEventListener("submit", handleSearch);
refs.loadMore.addEventListener("click", onLoad);

function handleInput(evt) {
query = evt.target.value;
}

function handleSearch(evt) {
  evt.preventDefault();
    page = 1;
    refs.gallery.innerHTML = "";
    refs.lastPage.hidden = true;
    refs.loadMore.hidden = true;
    refs.btn.hidden = true;
    Notiflix.Loading.circle("Loading...");

    getPhoto(query)
    .then(({data: {hits, totalHits}}) => {
        if (hits.length === 0 || query.trim() === "") {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        refs.gallery.innerHTML = "";
        Notiflix.Loading.remove();
        } else {
            makeCardMarkup(hits);
            const totalPages = Math.ceil(totalHits/40);
            if (page === totalPages) {
              refs.loadMore.hidden = true;
              refs.lastPage.hidden= false;
            } else {
            refs.loadMore.hidden = false;
            }
            Notiflix.Loading.remove();
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
}
    )
    .catch(error =>
        console.log(error));
}

function onLoad() {
  page += 1;
  refs.loadMore.hidden = true;
  Notiflix.Loading.circle("Loading...");

  getPhoto(query)
    .then(({data: {hits, totalHits}}) => {
            makeCardMarkup(hits);
            const totalPages = Math.ceil(totalHits/40);
            if (page === totalPages) {
              refs.loadMore.hidden = true;
              refs.lastPage.hidden = false;
            } else {
            refs.loadMore.hidden = false;
            }
            Notiflix.Loading.remove();
        }
      )
    .catch(error =>
        console.log(error));
}

async function getPhoto(query) {
    const params = new URLSearchParams({
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: 40,
    })
    const response = await axios.get(`${BASE_URL}?${params}`);
    console.log(response);
return response;
}

function makeCardMarkup(arr) {
    const markup = arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
        <div class="photo-container">
        <a class="gallery__link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    </div>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`
}).join("");

refs.gallery.insertAdjacentHTML("beforeend", markup);

lightbox.refresh();
refs.btn.hidden = false;
btn;
}