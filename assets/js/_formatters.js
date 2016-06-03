rivets.formatters.price = function(value){
	return formatprice(value);
}

rivets.formatters.totalmaxbidprice = function(value,bid,hasbid,initialbid){
	if(hasbid)
		return formatprice(value - parseInt(initialbid) + parseInt(bid));
	else
		return formatprice(value + parseInt(bid));
}

rivets.formatters.pricelist = function(value){
	var val = value.length * saleItem.highBid;

	return formatprice(val);
}

rivets.formatters.limitprice = function(value, spent, bid){
	var val = value - spent;

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

function formatpriceInput(amt){
	if(amt === 0) return 0;
	else if(!amt) return 0;

	var price;

	if($('#js--body').hasClass('INR')) 
		price = amt.toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');
	else 
		price = amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return price;
}


rivets.formatters.convertPrice = function(value, rate){
	var tempVal = parseFloat(value),
		tempRate = parseFloat(rate),
		convertedVal = tempVal * tempRate;
		convertedVal = convertedVal || 0;
	return "roughly <span class='USD'><span class='CCY'></span><span class='dollars'>" + formatprice(convertedVal.toFixed(0)) + "</span></span>";
}


rivets.formatters.greaterThanToFalse = function(value,comparison){
	if(parseInt(value) > comparison){
		return true;	
	} 
	else return false;
}

rivets.formatters.greaterThanToFalse_bids = function(value,credit,bids,initialbid,hasbid){
	
	if(hasbid && parseInt(value) + (bids - parseInt(initialbid)) > credit){
		if(parseInt(value) > credit) return false;
		return true;
	}
	else if(!hasbid && parseInt(value) + bids > credit){
		if(parseInt(value) > credit) return false;
		return true;	
	} 
	else return false;
}

rivets.formatters.zeroToFalse = function(value){
	if(value > 0) return false;
	else return true;
}

rivets.formatters.zeroOrEmptyToFalse = function(value){
	console.log(value);
	if(value === 0 || value === ''| isNaN(value)) return false;
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

rivets.binders.adderrorclass = function(el, value) {
	if(value) $(el).addClass('s-error');
	else $(el).removeClass('s-error');
}