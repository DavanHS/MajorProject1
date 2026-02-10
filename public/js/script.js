// console.log("hi");

// (() => {
//     'use strict'

//     const forms = document.querySelectorAll('.needs-validation')

//     Array.from(forms).forEach(form => {
//       form.addEventListener('submit', event => {
//         if (!form.checkValidity()) {
//           event.preventDefault()
//           event.stopPropagation()
//         }

//         form.classList.add('was-validated')
//       }, false)
//     })
//   })()
// window.addEventListener("click", (event) => {
//   console.log("page is fully loaded");
// });

// let ele = docu

// document.getElementById("listing-container").addEventListener("scroll", (event) => {
  //     console.log("hi");
  // })
window.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollTop > 100) {
      backToTopBtn.style.display = "inline-block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});