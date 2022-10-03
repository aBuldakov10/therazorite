/*** Accordion ***/
$('.js-switch').on('click', function () {
  $(this).next().slideToggle(200);
  $(this).toggleClass('active');
});

/*** Tabs ***/
$('.js-tabs .tabs__navigation-link').on('click', function (e) {
  e.preventDefault();

  let thisAnchor = $(this).attr('href'),
      thisTarget = $(thisAnchor);

  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  $('.tabs__content-item').hide();
  thisTarget.show();
});
