var allConversions = [
		{
			"currency": "USD",
			"rate": 1.5
		},
		{
			"currency": "JPY",
			"rate": 120
		}
	],
	allOtherRings = [
		{
			"number": "TAL",
			"status": "In Progress",
			"lot": "5000",
			"TAL":true,
			"startTime" : "09:00",
			"displayOrder" : 99
		},
		{
			"number": "2",
			"status": "In Progress",
			"lot": "945",
			"TAL":false,
			"startTime" : "09:00",
			"displayOrder" : 1
		},
		{
			"number": "3",
			"status": null,
			"lot": "945",
			"TAL":false,
			"startTime" : "09:00",
			"displayOrder" : 2
		}
		

	],
	sampleAuctioneerMessage = "Title In transit. Item must remain in yard until received.";




var vrampObject = {
		"auctionCCY": "CAD",
		"conversions": [
			],
		"price" : 10000000,
		"highBid" : 'Internet, SK, CAN',
		"bidder" : '10005',
		"isgroup":false,
		"auctioneerMessage": null,
		"choiceGroup": [
			{
				"lot":"2741",
				"status": null
			},
			{
				"lot":"2742",
				"status": "sold"
			},
			{
				"lot":"2743",
				"status": null
			},
			{
				"lot":"2743A",
				"status": null
			}

		],
		"otherRings": [
			
		]
	},

	vrampController = {

		toggleConversions: function(e,model){
			
			if(vrampObject.conversions.length == allConversions.length){
				vrampObject.conversions = [];
				return;
			}
			
			vrampObject.conversions.push(allConversions[vrampObject.conversions.length]);
			
		},

		showMessage: function(e,model){

			vrampObject.auctioneerMessage = vrampObject.auctioneerMessage ? null : sampleAuctioneerMessage;
		},

		toggleOtherRings: function(e,model){
			if(vrampObject.otherRings.length == allOtherRings.length){
				vrampObject.otherRings = [];
				$(".js--vramp-bidding").removeClass('s-other-rings_all s-other-rings_single');
				return;
			}
			
			vrampObject.otherRings.push(allOtherRings[vrampObject.otherRings.length]);
			vrampObject.otherRings.sort(function (a, b) {
			  if (a.displayOrder > b.displayOrder) return 1;
			  if (a.displayOrder < b.displayOrder) return -1;
			  return 0;
			});

			//TOGGLE WHICH BIT OF THE OTHER RINGS AREA IS VISIBLE
			if(vrampObject.otherRings.length === 1) $(".js--vramp-bidding").addClass('s-other-rings_single');
			else $(".js--vramp-bidding").addClass('s-other-rings_all');
		}

	};


rivets.formatters.convertedVrampPrice = function(value, rate, ccy){
	var tempVal = parseFloat(value),
		tempRate = parseFloat(rate),
		convertedVal = tempVal * tempRate;
		convertedVal = convertedVal || 0;
	return formatprice(convertedVal.toFixed(0));
}

rivets.binders.addccyclass = function(el, value){
	$(el).addClass(value);
}

rivets.bind($('.js--vramp-bidding'),{
	vrampObject: vrampObject,
	vrampController: vrampController
});
