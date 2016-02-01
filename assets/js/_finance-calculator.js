$(function(){

	//FINANCE CALCULATOR CONTROLS
	$('.js--calc-financing').tooltipster({
		content: $($('.js--calculate-payments--content').html()),
		theme: 'ritchie-tooltips',
		interactive: true,
		trigger: "click",
		position: 'top-right',
		functionBefore: function(origin, continueTooltip){
			continueTooltip();
			loadCalculator();
		},
		functionAfter: function(origin){
			unloadCalculator();
		}
	});

});

var	finance = {
		"active" : false,
		"financeRate" : 5.00,
		"financePeriod" : 24,
		"maxFinanceRate" : 15,
		"payment" : 100,
		"ccy": ccyconversion.currentCCY,
		"price": saleItem.price
	},
	financeModal,
	calccontroller = {
		
		onInterestInput: function(e, model){
			switch(e.which) {
		    	case 9:
		    	case 13: // enter
			        cleanupInterestInput();
			        $('.js--finance-period').focus();
			        e.preventDefault();
			        return true;
			        break;

		        case 38: // up
		        	incrementInterest(0.5);
		        	cleanupInterestInput();
			       	e.preventDefault();
			       	return true;
			        break;

		        case 40: // down
		        	incrementInterest(-0.5);
		        	cleanupInterestInput();
		        	e.preventDefault();
			       	return true;
			       	break;

		        default: 

		        	if(e.which != 46 && e.which != 190 && e.which > 31 && (e.which < 48 || e.which > 57)) return false;
		        	else return true; // exit this handler for other keys
		    }
		    e.preventDefault();
		},

		onInterestBlur: function(e, model){
			var val = parseFloat($(e.currentTarget).val());
			updateInterest(val);
			cleanupInterestInput();
			finance.active = true;
		},

		onInterestIncrement: function(e, model){
			incrementInterest($(e.currentTarget).data('increment'));
			cleanupInterestInput();
			finance.active = true;
		},

		onPeriodUpdate: function(e, model){
			model.finance.financePeriod = $(e.currentTarget).val();
			model.finance.payment = financingCalculation();
			finance.active = true;
		},
		
		onToggleClick: function(e, model){
	    	//model.finance.active = !model.finance.active;
	    }

	};

	//INIT THE CORRECT PAYMENT PRICE
	finance.payment = financingCalculation();

	//INIT CLEAN INTEREST RATE INPUT DISPLAY
	cleanupInterestInput();

rivets.formatters.convertedPrice = function(value){
	var tempVal = parseFloat(value),
		convertedVal = tempVal * ccyconversion.rate;
	if(ccyconversion.active) return ccyconversion.currentCCY + " <span class='dollars'>" + formatprice(convertedVal) + "</span> per month";
	else return ccyconversion.currentCCY + " <span class='dollars'>" + formatprice(tempVal) + "</span> per month";
}

rivets.bind($('.js--calculator-output'),{finance: finance});


function loadCalculator(){
	financeModal = rivets.bind($('.js-financing-object'),{
			finance: finance,
			calccontroller : calccontroller
		});

	cleanupInterestInput();

	if(!finance.active) $('.js--toggle-calculation').removeClass('s-negative').html('TURN ON');
	else $('.js--toggle-calculation').addClass('s-negative').html('TURN OFF');
}

function unloadCalculator(){
	financeModal.unbind();
}


//HANDLE INTEREST RATE INCREMENTS (+/- Button presses)
function incrementInterest(val){
	var tempValue = parseFloat(finance.financeRate),
		increment = parseFloat(val);
	
	updateInterest(tempValue + increment);
}

//ADJUST INTEREST RATE
function updateInterest(val){
	
	if(val < 0) finance.financeRate = 0;
	
	else if(val >= finance.maxFinanceRate) finance.financeRate = finance.maxFinanceRate;
	
	else finance.financeRate = val;

	finance.payment = financingCalculation();
}

//TIDY UP DISPLAY OF INTEREST RATE
function cleanupInterestInput(){
	var val = parseFloat($('.js--finance-interest').val());
	$('.js--finance-interest').val(val.toFixed(2) + "%");
}



function financingCalculation(){
	var amt = saleItem.price,
		adjustedInterest = (finance.financeRate/100)/12,
		monthly = amt * ((adjustedInterest * Math.pow((1 + adjustedInterest),finance.financePeriod)) / (Math.pow((1 + adjustedInterest),finance.financePeriod) - 1));

	if(adjustedInterest === 0) monthly = amt/finance.financePeriod; //IF 0% FINANCING, JUST DIVIDE PRICE BY TOTAL PERIOD

	return monthly.toFixed(2);
}



