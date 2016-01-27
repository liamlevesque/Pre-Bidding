rivets.formatters.price = function(value){

	var price;

	if(!value) return null;
	
	if($('#js--body').hasClass('INR')) 
		price = value.toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1<span class="divider"></span>');
	else 
		price = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="divider"></span>');
	
	return price;
}

rivets.formatters.pricelist = function(value){
	
	var price,
		val = value.length * saleItem.price;

	if(!value) return null;
	
	if($('#js--body').hasClass('INR')) 
		price = val.toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1<span class="divider"></span>');
	else 
		price = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="divider"></span>');
	
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
	if(!value) return "Turn On";
	else return "Turn Off";
}





/********************************
GENERIC BINDERS USED THROUGHOUT
********************************/

rivets.binders.addclass = function(el, value) {
	if(value) $(el).addClass('s-active');
	else $(el).removeClass('s-active');
}