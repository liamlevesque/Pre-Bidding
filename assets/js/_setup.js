$(function(){

	//ON LOAD ASSIGN A RANDOM BIDDER NUMBER
	user.bidder = "v" + getRandomInt(7000, 8000);


});

var user = {
		bidder : "v7005"
	};

rivets.bind($('.js--header'),{
	user: user
});


/*********************
	INTERCOM
*********************/
var intercom = Intercom.getInstance();

intercom.on('newbid', function(data) {
	//IF I WAS THE HIGH BIDDER AND THE NEW BIDDER ISN'T ME, SHOW OUTBID NOTIFICATION
	if(saleItem.bidder === user.bidder && data.bidder != user.bidder) outBid();
	
    //IF I'M BIDDING AND I'M IN ANOTHER STATE (WAITING, ETC)
    if(saleItem.bidstatus != 'disabled' && user.bidder != data.bidder) saleItem.bidstatus = 'active';
	
	saleItem.bidder = data.bidder;
	saleItem.highBid = data.highBid;
	saleItem.price = data.price;

	controller.updatePrice();
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}