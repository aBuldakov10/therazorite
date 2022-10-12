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
  let offset = 0;
  let limit = 3;

  // API request
  const fetchSlides = async (offset, limit) => {
    const data = await fetch(`${api}?offset=${offset}&limit=${limit}`);
    return await data.json();
  };

  /*** Fetch and init slider on load ***/
  fetchSlides(offset, limit).then(({ data }) => {
    const createSlideItem = data.map(({ id, title, desc, likeCnt, imgUrl }) => {
      const li = document.createElement('div');

      const isImg = () => {
        if (imgUrl) {
          return imgUrl;
        } else {
          return '/img/error.svg';
        }
      };

      li.classList.add('swiper-slide');
      li.innerHTML = `<div class="main-slider__item" data-id="${id}" data-title="${title}" data-subtitle="${desc}" data-like-count="${likeCnt}" style="background-image: url('${isImg()}')">
                            <div class="container">
                              <div class="main-slider__title" style="display: -webkit-box; -webkit-line-clamp: 2;" title="${title}">${title}</div>
                            </div>
                        </div>`;

      return li;
    });

    createSlideItem.forEach((item) => {
      sliderWrapper.append(item);
    });

    // Init slider
    new Swiper('.js-slider', {
      on: {
        init: function () {
          // Set caption for first slider on load
          const firstSlideTitle =
            this.slides[this.activeIndex].firstElementChild.getAttribute(
              'data-title'
            );

          const firstSlideSubTitle =
            this.slides[this.activeIndex].firstElementChild.getAttribute(
              'data-subtitle'
            );

          const firstSlideLikeCount =
            this.slides[this.activeIndex].firstElementChild.getAttribute(
              'data-like-count'
            );

          titleCaptions.innerHTML = `<span>${firstSlideTitle}</span>`;
          titleCaptions.setAttribute('title', `${firstSlideTitle}`);
          subTitleCaptions.innerHTML = firstSlideSubTitle;
          likeCaptions.innerHTML = firstSlideLikeCount;
        },
      },
    });

    // Increase counter slides
    offset = offset + 3;
  });

  /*** Append slides ***/
  const lastSliderBtn = document.querySelector('.swiper-button-next');

  lastSliderBtn.addEventListener('click', function () {
    const isLastBtn = this.classList.contains('swiper-button-disabled');

    if (isLastBtn) {
      fetchNextSlides();
    }
  });

  /*** Fetch next 3 slides function ***/
  function fetchNextSlides() {
    fetchSlides(offset, limit).then(({ countAll, data }) => {
      if (offset <= countAll) {
        const createSlideItem = data.map(
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
          swiper.appendSlide(item);
        });

        swiper.slideNext();

        // Increase counter slides
        offset = offset + 3;
      }
    });
  }

  /*** Slider init ***/
  const swiper = new Swiper('.js-slider', {
    watchOverflow: true,
    allowTouchMove: false,
    speed: 1200,
    effect: 'creative',
    creativeEffect: {
      prev: {
        translate: ['-55%', 0, -1],
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
        titleCaptions.setAttribute('title', `${slideTitle}`);
        subTitleCaptions.innerHTML = slideSubTitle;
        likeCaptions.innerHTML = slideLikeCount;
      },
    },
  });

  /*** Likes ***/
  // const likeBtn = document.querySelector('.js-like');
  // const popup = document.querySelector('.popup');
  // const body = document.querySelector('body');

  // likeBtn.addEventListener('click', () => {
  //   popup.classList.remove('hidden');
  // body.classList.add('no-scroll');
  // });
});
