const input = document.querySelector(".search-input");

export const btn = document.querySelector('.go');
btn.addEventListener('click', () => {
   window.scrollTo(0, 0);
   input.value = "";
});

// export const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });