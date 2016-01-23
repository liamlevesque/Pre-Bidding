var lotInfo = {
    currentLot: null
  };

rivets.binders.currentlot = function(e, value){
  buildCurrentLot(value);
}

rivets.bind($('.js--lot-info'),{
  lotInfo: lotInfo
}); 


//BUILD THE DISPLAY FOR THE CURRENT LOT INFO
function buildCurrentLot(index){
  var currentLot = lotTable.lotList[index],
    template2 = $('#currentlot').html();

    if(!currentLot) return;

  var rendered = Mustache.render(template2, currentLot);
  $('.js--lot-info').html(rendered);  

  var mySwiper = new Swiper ('.swiper-container', {
      direction: 'horizontal',
      loop: true,
      pagination: '.swiper-pagination',
      paginationClickable: 'true',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      autoHeight: true
    })
}