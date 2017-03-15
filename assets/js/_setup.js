$(function(){

	//ON LOAD ASSIGN A RANDOM BIDDER NUMBER
	user.bidder = "v" + getRandomInt(7000, 8000);
	user.spent = 0;

	dataController.submitLotChange({lot: 0,source: user.bidder});

	
	$('.js--settings').tooltipster({
		content: $($('.js--settings-content').html()),
		theme: 'ritchie-tooltips',
		interactive: true,
		trigger: "click",
		position: 'bottom-left',
		functionBefore: function(origin, continueTooltip){
			continueTooltip();
			settings.load();
		},
		functionAfter: function(origin){
			settings.unload();
		}
	});
	
 
});

var user = {
		bidder : "v7005",
		limit: 100000, 
		spent: 0,
		bid: 0,
		bidcount: 0,
		message: '',
		audio: true,
		photos: true,
		auctioneer: 'Pat Hicks',
		cart: [], 
	},
	headerController = {

		onDismissMSGClick: function(e, model){
			$('.js--auctioneer-msg').removeClass('s-active');
			setTimeout(function(){
				model.user.message = "";
				clearMessage();
			},1000);
		},

		generateMessage: function(msg){
			user.message = msg;
		},

		addToCart: function(lot){
			user.cart.push(lot);
			user.spent += lot.soldPrice;
			user.bid -= lot.bid;

			sortList(user.cart);
		},

		alertWon: function(obj){
			if(obj.length > 0){
				wonItems.listlength = obj.length;
			}	
			else{
				wonItems.wonItem = obj;
			} 
			loadConfirmModal();
		},

		onToggleCartClick: function(){
			$('.js--cart').toggleClass('s-visible');
		},

		onCartCloseClick: function(){
			$('.js--cart').removeClass('s-visible');
		}

	};



rivets.bind($('.js--header'),{
	user: user,
	headerController: headerController
});

rivets.bind($('.js--main-body'),{
	user: user,
	headerController: headerController
});


var confirmModal,
	wonItems = {
		listlength: 0,
		wonItem: {}
	},
	confirmationController = {
		onDismissClick: function(e, model){
			$('.js--header .js-confirm-object').removeClass('s-active');
			confirmationController.destroyConfirmation();
		},

		destroyConfirmation: function(){
			setTimeout(function(){
				confirmModal.unbind();
				$('.js--header .js-confirm-object').remove();
				wonItems.listlength = 0;
				wonItems.wonItem = {};
			},500);
		}
	}


function loadConfirmModal(){
	$('.js-confirm-object').clone().appendTo('.js--header');

	confirmModal = rivets.bind($('.js--header .js-confirm-object'),{
		wonItems: wonItems,
		confirmationController: confirmationController
	});

	setTimeout(function(){
		$('.js--header .js-confirm-object').addClass('s-active');
	},100);

	setTimeout(function(){
		$('.js--header .js-confirm-object').removeClass('s-active');
		confirmationController.destroyConfirmation();
	},2000);
}



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}




var settings = {
	load: function(){
		settingsModal = rivets.bind($('.js--settings-object'),{
			user: user,
			headerController: headerController
		});
	},

	unload: function(){
		settingsModal.unbind();
	}
}


