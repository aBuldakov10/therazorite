document.addEventListener('DOMContentLoaded', () => {
  const sliderWrapper = document.querySelector('.swiper-wrapper');
  const titleCaptions = document.querySelector(
    '.main-slider__captions .main-slider__title'
  );
  const subTitleCaptions = document.querySelector(
    '.main-slider__captions .main-slider__subtitle'
  );
  const likeCaptions = document.querySelector(
    '.main-slider__captions .like__counter'
  );
  const api = 'https://private-57b4e3-grchhtml.apiary-mock.com/slides';

  // API request
  const fetchSlides = async (offset, limit) => {
    const data = await fetch(`${api}?offset=${offset}&limit=${limit}`);
    return await data.json();
  };

  /*** Fetch and init slider on load ***/
  fetchSlides(0, 3).then((slides) => {
    const createSlideItem = slides.data.map(
      ({ id, title, desc, likeCnt, imgUrl }) => {
        const li = document.createElement('div');

        li.classList.add('swiper-slide');
        li.innerHTML = `<div class="main-slider__item" data-id="${id}" data-title="${title}" data-subtitle="${desc}" data-like-count="${likeCnt}" style="background-image: url('${imgUrl}')">
                            <div class="container">
                              <div class="main-slider__title" style="display: -webkit-box; -webkit-line-clamp: 2;" title="${title}">${title}</div>
                            </div>
                        </div>`;

        return li;
      }
    );

    createSlideItem.forEach((item) => {
      sliderWrapper.append(item);
    });

    // Init slider
    mainSlider();
  });

  /*** Slider init function ***/
  function mainSlider() {
    const swiper = new Swiper('.js-slider', {
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
          const slideTitle =
            this.slides[this.activeIndex].firstElementChild.getAttribute(
              'data-title'
            );
          const slideSubTitle =
            this.slides[this.activeIndex].firstElementChild.getAttribute(
              'data-subtitle'
            );
          const slideLikeCount =
            this.slides[this.activeIndex].firstElementChild.getAttribute(
              'data-like-count'
            );

          titleCaptions.innerHTML = `<span>${slideTitle}</span>`;
          subTitleCaptions.innerHTML = slideSubTitle;
          likeCaptions.innerHTML = slideLikeCount;
        },
      },
    });

    // Set caption for first slider on load
    const firstSlideTitle =
      swiper.slides[swiper.activeIndex].firstElementChild.getAttribute(
        'data-title'
      );

    const firstSlideSubTitle =
      swiper.slides[swiper.activeIndex].firstElementChild.getAttribute(
        'data-subtitle'
      );

    const firstSlideLikeCount =
      swiper.slides[swiper.activeIndex].firstElementChild.getAttribute(
        'data-like-count'
      );

    titleCaptions.innerHTML = `<span>${firstSlideTitle}</span>`;
    subTitleCaptions.innerHTML = firstSlideSubTitle;
    likeCaptions.innerHTML = firstSlideLikeCount;
  }

  /*** Likes ***/
  // const likeBtn = document.querySelector('.js-like');
  // const popup = document.querySelector('.popup');
  // const body = document.querySelector('body');

  // likeBtn.addEventListener('click', () => {
  //   popup.classList.remove('hidden');
  // body.classList.add('no-scroll');
  // });
});
