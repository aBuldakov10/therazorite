document.addEventListener('DOMContentLoaded', () => {
  /*** Slider ***/
  const slideCaptions = document.querySelector('.main-slider__captions');

  const mainSlider = new Swiper('.js-slider', {
    watchOverflow: true,
    allowTouchMove: false,
    speed: 1200,
    effect: 'creative',
    creativeEffect: {
      prev: {
        translate: ['-55%', 0, 0],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    on: {
      slideChangeTransitionStart: function () {
        const slideTitle = this.slides[this.activeIndex].firstElementChild.getAttribute('data-title');
        const slideSubTitle = this.slides[this.activeIndex].firstElementChild.getAttribute('data-subtitle');

        slideCaptions.innerHTML = `<div class="main-slider__title main-slider__title_captured">${slideTitle}</div>
                                   <div class="main-slider__subtitle">${slideSubTitle}</div>`;
        }
    }
  });


  const firstSlideTitle = mainSlider.slides[mainSlider.activeIndex].firstElementChild.getAttribute('data-title');
  const firstSlideSubTitle = mainSlider.slides[mainSlider.activeIndex].firstElementChild.getAttribute('data-subtitle');

  slideCaptions.innerHTML = `<div class="main-slider__title main-slider__title_captured">${firstSlideTitle}</div>
                             <div class="main-slider__subtitle">${firstSlideSubTitle}</div>`;
});
