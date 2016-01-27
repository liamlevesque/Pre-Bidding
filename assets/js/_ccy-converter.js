$(function(){

	//CCY CONVERTER CONTROLS
	$('.js--convert-ccy').tooltipster({
		content: $($('.js--convert-ccy--content').html()),
		theme: 'ritchie-tooltips',
		interactive: true,
		trigger: "click",
		position: 'top-right',
		functionBefore: function(origin, continueTooltip){
			continueTooltip();
			loadCCYConverter();
		},
		functionAfter: function(origin){
			unloadCCYConverter();
		}
	});

});

var ccys = {
		"CAD":"1",
		"USD":"0.7",
		"EUR":"0.6",
		"GBP":"0.5",
		"CNY":"4.5",
		"SGD":"0.9",
		"NZD":"1.1",
		"AUD":"1",
		"MXN":"12.5",
		"PLN":"2.8",
		"JPY":"79.5",
		"INR":"46.5",
		"AED":"2.5",
		"ZAR":"11.5"
	},
	ccyModal,
	
	ccyconversion = {
		'active' : false,
		'currentCCY' : 'CAD',
		'rate' : 1,
		'conversion' : saleItem.price,
		'price': saleItem.price
	},
	
	ccycontroller = {
		
		onCCYChange: function(e, model) {			
			model.ccyconversion.currentCCY = $(e.currentTarget).val();
			ccycontroller.update(model.ccyconversion);
	    },

	    onToggleClick: function(e, model){
	    	model.ccyconversion.active = !model.ccyconversion.active;
	    	ccycontroller.update(model.ccyconversion);
	    },
	    
	    update: function(data) {
	    	data.rate = ccys[data.currentCCY];
			data.conversion = data.rate * saleItem.price;
			
			finance.ccy = data.currentCCY;
	    }
	};

rivets.formatters.priceWithCCY = function(value){
	var val = parseFloat(value); 
		val = val * ccyconversion.rate;
	return "roughly " + ccyconversion.currentCCY + " " + val.toFixed(2);
}

rivets.bind($('.js--converter-output'),{
	ccyconversion: ccyconversion,
	ccycontroller: ccycontroller
});

function loadCCYConverter(){
	ccyModal = rivets.bind($('.js-ccy-object'),{
		ccyconversion: ccyconversion,
		ccycontroller: ccycontroller
	});

	//$('.js--ccy-selector').val(ccyconversion.currentCCY);
}

function unloadCCYConverter(){
	ccyModal.unbind();
}

// function updateCCYConversion(){
// 	// if(ccyconversion.active) $('.js--convert-ccy').html(ccyconversion.currentCCY + ' ' + saleItem.price);
// 	// else $('.js--convert-ccy').html('Convert Currency');

// 	ccyconversion.rate = ccys[ccyconversion.currentCCY];
// 	ccyconversion.conversion = ccyconversion.rate * saleItem.price;
// }