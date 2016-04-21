
$(function() {
	function shoppingGrocery() {
	// initiating variable to count items 
	// and also to assign a unique product ID for the items
	var count = 100;

	// function to increment count for products
	var countProduct = function (){
		return ++count;
	};

	// holds list of products available in the shop
	var listOfProducts = [];

	// holds checkOut basket items
	var itemInBasket = [];

	// creating object constructor to hold products
	var products = function(productName, price){
		this.productId = countProduct();
		this.productName = productName;
		this.price = price;
		listOfProducts.push(this);
	}

	// method to add product to the shopping basket
	products.prototype.addToBasket = function(){
		itemInBasket.push(this);
	}

	// checkOut object holds functions to calculate discount 
	// and total amount
	var checkOut = {
		checkDiscount: function(){
			// variables to hold number of items 
			var butterCounter = 0;
			var milkCounter = 0;
			var breadCounter = 0;

			// variable to track total discount
			var discount = 0;

			// loops through basket or cart to count total number of
			// each items in that basket
			for (var i = 0; i < itemInBasket.length; i++){
                                if (!itemInBasket[i])
                                        continue;
                                if (itemInBasket[i].productName == "Butter") 
                                        butterCounter = butterCounter + 1;
                                
                                else if (itemInBasket[i].productName == "Milk") 
                                        milkCounter = milkCounter + 1;
    
                                else if (itemInBasket[i].productName == "Bread") 
                                        breadCounter = breadCounter + 1;
                                
                        }

			//console.log(butterCounter);
			//console.log(milkCounter);
			//console.log(breadCounter);

			// discount logic
			while ((butterCounter >=2 && breadCounter >= 1) || 
					milkCounter >= 4) { 

				if(butterCounter >= 2 && breadCounter >= 1){
					console.log('Bread is 50% discounted');
					discount += (50/100) * listOfProducts[2].price;
					butterCounter -= 2;
					breadCounter--;  
				}

				if(milkCounter >= 4){
					discount += listOfProducts[1].price;
					milkCounter -= 4;
					console.log('4th milk free');
				}
			}

			// returns the total discounted amount
			return discount.toFixed(2);
		},
		// calculate total cost including discount
		calculateCost: function(){
			var amount = 0;
			var total = 0;
			var discountedAmount = this.checkDiscount();
			for (var i=0; i < itemInBasket.length; i++) {
                		if (!itemInBasket[i] )
                        	continue;
                		amount = amount + itemInBasket[i].price;
            		}
			total = amount - discountedAmount;
			console.log(total.toFixed(2));
			console.log(discountedAmount);
			
			return total.toFixed(2);

		}
	}

	// creating products
	var butter = new products("Butter", 0.80);
	var milk = new products("Milk", 1.15);
	var bread = new products("Bread", 1.00);


	// adds all the items in the basket
	// in summary, it adds all the items in the basket
	function trackBasketItem(objectName, count) {

		for (var i = 0; i < count; i++) {
			objectName.addToBasket();
		}	

		console.log(itemInBasket);
	}

	// this lists all the products available
	// for testing purposes
	for (var items in listOfProducts)
		console.log(listOfProducts[items].productId, listOfProducts[items].productName , listOfProducts[items].price);

	// to display the total and discounted amount in the browser
	function invoice(amount, discount){
		console.log ("amounts are" , amount, discount);
		var $amount = (Number(amount)+Number(discount));
		var $amount = "<p class='discountedAmount'>Amount before discount: " + 
			"<span class='discount'> £" + $amount.toFixed(2) + "</span>" + "</p>";
		var $totalAmount = "<p class='totalAmount'>Total Amount: " + 
			"<span class='amount'> £" + amount + "</span>" + "</p>";
		var $discount = "<p class='totalAmount'>Discount: " + 
			"<span class='amount'> £" + discount + "</span>" + "</p>";
		$('#invoice').html($totalAmount + $discount + $amount);
	}

	//dom interactions
	// displays the number of item added to the cart 
	// and also updates the number of the item added to the cart
	$('.addToCart').on('click', function(){
		// declaring variable to hold count for each item
		var $counter;
		// holds the current span element
		var $item = $(this).siblings("h1").children("span");
		
		// checks if span contents value
		if ( $item.text() ){
			$counter = parseInt($item.text()) + 1;
		} else {
			$counter = 1;
		}
		// adds the new value to the span element
		$item.text($counter);
		

	});

	// resets the cart or basket
	$('#reset').on('click', function(){
		$('.butter').children("h1").children('span').text('');
		$('.bread').children("h1").children('span').text('');
		$('.milk').children("h1").children('span').text('');
		// clear basket or cart
		itemInBasket = [];
	});

	// calculates total amount and displays it in the browser
	$('#checkout').on('click', function(){
		//finds all products or items
		var $butterItem = $('.butter').children("h1").children('span');
		var $breadItem = $('.bread').children("h1").children('span');
		var $milkItem = $('.milk').children("h1").children('span');
		
	 	trackBasketItem(butter, parseInt($butterItem.text()) );
	 	trackBasketItem(bread, parseInt($breadItem.text()) );
	 	trackBasketItem(milk, parseInt($milkItem.text()) );
	 	
	 	//checking out
	 	var totalAmount = checkOut.calculateCost();
	 	var discount = checkOut.checkDiscount();
	 	// invoice
	 	invoice(totalAmount, discount);
	 	// clear basket/cart
		itemInBasket = [];
		
		//scroll to invoice div
		// better for smaller screen
                $('html, body').animate({
                        scrollTop: $("#invoice").offset().top
                }, 2000);
	});

	}

	// start shopping
	shoppingGrocery();

});



