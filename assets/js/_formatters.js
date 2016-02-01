rivets.formatters.price = function(value){
	return formatprice(value);
}

rivets.formatters.pricelist = function(value){
	var val = value.length * saleItem.highBid;

	return formatprice(val);
}

rivets.formatters.limitprice = function(value, spent, bid){
	var val = value - (spent + bid);

	return formatprice(val);
}


function formatprice(amt){
	if(amt === 0) return 0;
	else if(!amt) return null;

	var price;

	if($('#js--body').hasClass('INR')) 
		price = amt.toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1<span class="divider"></span>');
	else 
		price = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="divider"></span>');

	return price;
}


rivets.formatters.zeroToFalse = function(value){
	if(value > 0) return false;
	else return true;
}

rivets.formatters.lotPhotoDirectory = function(value){
	return 'assets/js/data/'+value;
} 

rivets.formatters.activeToButtonText = function(value){
	if(!value) return "Off";
	else return "On";
}

rivets.formatters.booltotext = function(value, text){
	if(value) return text + " On";
	else return text + " Off";
}

rivets.formatters.lengthtoquantity = function(value){
	
	return value.length;
}

rivets.formatters.bidderoryou = function(value){
	if(value === user.bidder) return 'You!'
	return value;
}





/********************************
GENERIC BINDERS USED THROUGHOUT
********************************/

rivets.binders.addclass = function(el, value) {
	if(value) $(el).addClass('s-active');
	else $(el).removeClass('s-active');
}