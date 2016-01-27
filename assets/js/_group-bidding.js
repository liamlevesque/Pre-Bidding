var group = {
		groupnumber: 0,
		length: 0,
		currentLot: 0,
		previewLot: 0,
		isOpenOffers: false,
		lotList: {}
	},
	groupController = {
		
		onActivateClick: function(e, model){
			var currentLot = $(e.currentTarget).data('lot');
				checked = $(e.currentTarget).is(':checked');

			if(!group.isOpenOffers){
				if(!checked) group.currentLot = 0;
				else{ 
					group.currentLot = currentLot;
					buildCurrentLot(currentLot - 1);
				}

				//ACTIVATE BIDDING
				controller.activateBidding(currentLot, checked);
			}
			else{
				if(checked) saleItem.openOffersList.push(currentLot);
				else for(var i=0; i<saleItem.openOffersList.length; i++) if(saleItem.openOffersList[i] === currentLot) saleItem.openOffersList.splice(i,1);
			}

			e.stopPropagation();

		},

		onPreviewClick: function(e, model){
			var targetLot = $(e.currentTarget).data('lot');
			
			if( targetLot != group.previewLot)
				buildCurrentLot(targetLot - 1);

			group.previewLot = targetLot; //DON'T REBUILD THE LOT INFO IF YOU CLICK ON THE SAME ONE AGAIN
		},

		activateOpenOffers: function(){
			notifyOpenOffers();
			group.isOpenOffers = true;
			saleItem.bidstatus = 'open-offer';
		}

	};

rivets.binders.itemsold = function(el, value){
	if(value > 0) $(el).addClass('s-sold');
	else $(el).removeClass('s-sold');

	group.currentLot = 0;
}

rivets.binders.itemactive = function(el, value){
	if($(el).data('lot') === value) $(el).addClass('s-active-lot').removeClass('s-disabled');
	else{
		$(el).removeClass('s-active-lot s-disabled');
		if(group.currentLot != 0) $(el).addClass('s-disabled');
	}
}

rivets.bind($('.js--group-area'),{
	group: group,
	groupController: groupController
});


function notifyOpenOffers(){
	$('.js--open-offer').addClass('s-visible');
	// setTimeout(function(){
	// 	$('.js--open-offer').removeClass('s-visible');
	// },5000);
}