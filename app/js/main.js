document.addEventListener('DOMContentLoaded', () => {
  /*** Slider ***/
  const slideCaptions = document.querySelector('.main-slider__captions .container');

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

        slideCaptions.innerHTML = `<div class="main-slider__title main-slider__title_captured" style="display: -webkit-box; -webkit-line-clamp: 2;" title="${slideTitle}">
                                      <span>${slideTitle}</span>
                                   </div>
                                   <div class="main-slider__subtitle" style="display: -webkit-box; -webkit-line-clamp: 4;">${slideSubTitle}</div>`;
        }
    }
  });


  const firstSlideTitle = mainSlider.slides[mainSlider.activeIndex].firstElementChild.getAttribute('data-title');
  const firstSlideSubTitle = mainSlider.slides[mainSlider.activeIndex].firstElementChild.getAttribute('data-subtitle');

  slideCaptions.innerHTML = `<div class="main-slider__title main-slider__title_captured" style="display: -webkit-box; -webkit-line-clamp: 2;" title="${firstSlideTitle}">
                                <span>${firstSlideTitle}</span>
                             </div>
                             <div class="main-slider__subtitle" style="display: -webkit-box; -webkit-line-clamp: 4;">${firstSlideSubTitle}</div>`;
});
