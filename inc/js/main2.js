
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
	
	/****** checkOut object *******/
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

	/****** creating products ******/
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

	/********** 		events 			***********/
	// displays the number of item added to the cart 
	// and also updates the number of the item added to the cart
	$('.addToCart').on('click', function(){
		// declaring variable to hold count for each item
		var $counter;
		// holds the current span element
		var $item = $(this).siblings("h1").children("span");
		$item.css("display", "inline-block");
		
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
		$('.products').each(function(i, el) {
    		$(this).children("h1").children('span').text('0');
    		$(this).children("h1").children('span').css("display", "none");
		});

		// clear basket or cart
		itemInBasket = [];
		
		// removes the close 'x' element
		$('.products h1').children('a.close').remove();
		
		// animation to scroll to top
		$('html, body').animate({
                        scrollTop: $("body").offset().top
                }, 800);
                
		// clears the invoice div and displays a message
		$('#invoice')
			.html("<h2 style='margin-top: 80px;'>Please add items to the cart and press checkout. Thank you </h2>"
				+ "<p><u>Note:</u> You can add same item multiple times by clicking add to cart button multiple times.</p>");
	});

	// calculates total amount and displays it in the browser
	$('#checkout').on('click', function(){
		
		//finds all products or items
		for (var i=0; i < listOfProducts.length; i++) {
			// gets products name from its object
			var $temp = listOfProducts[i].productName;
			// gets the counter value from dom
			var $tempCount = $('.'+ $temp.toLowerCase()).children("h1").children('span');

			//console.log(listOfProducts[i]);
			//tracks the items in the cart or basket
			trackBasketItem( listOfProducts[i], parseInt($tempCount.text()) );
		}
	 	
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
        }, 1000);
	});
	
	/*** allows user to remove or add any quantity for the selected products **/
  // creating object for namespacing
  // to check if the element is span or textbox
  var stateCheck = {textbox: false};

  // using delegation to target class
  $('.products').on('click', '.enter-amount', function(){
  		if (!stateCheck.textbox) {
            var input = $('<input type="text" />').attr({
                'class': 'enter-amount',
                'style': 'color: black; width: 70px;',
                'value': $(this).text()
            });
            
            // removes old close 'x' 
            $(this).siblings('.close').remove();
            
            // replace span element with input text
            $(this).replaceWith(input);
            
           // focuses and selects text/value in the textbox
            input.focus();
            input.select();
            
            // sets check to true or 
            // indicates the element is now changed to input text from span element
            stateCheck.textbox = true;
        }
  });

  // changes the quantity to the amount entered when out of focus from the textbox
  $('.products').on('blur', 'input.enter-amount', function() {
  	// validation check if number is entered
  	// assigns default value 0, if no number is entered
  	if ( !$(this).val() )
        	$(this).val('0');

  	// checks if the element is input text
  	if (stateCheck.textbox) {
            var span = $('<span />').attr({
                'class': 'label label-success enter-amount'
            });
           
            var anchorTag = $("<a>&times;</a>").attr({
            	'class': 'close',
            	'style': 'position: absolute; margin-left: -15px; font-size: 70%;',
            	'data-dismiss': 'alert',
            	'aria-label': 'close'
            });
            // replace input text with the new span element
            $(this).replaceWith($(span).html($(this).val()), anchorTag);

            // indicates the element is now span
            stateCheck.textbox = false;
        }
  });

  // adding a tag to remove product from basket
  $('.products').on('click', 'a.close', function(){
  		// sets the quantity to 0
  		$( this ).siblings('span').text('0');
  		//console.log($( this ).siblings('span'));
  }); 
  
  /******* validation (only allows numbers and enter key) *****/
   //event triggered when key is pressed in textbox
  $(".products").on('keydown', 'input.enter-amount', function (e) {
    
    var keycode = (e.keyCode ? e.keyCode : e.which);
     	// if enter key is pressed
    if(keycode == '13' ){

    	// validation check if number is entered
  		// assigns default value 0, if no number is entered
    	if ( !$(this).val() )
        	$(this).val('0');
        
    	$( this ).blur();  
    }
     //if the letter is not digit then sho error msg
    if (keycode != 8 && keycode != 0 && keycode != 13 && (keycode < 48 || keycode > 57)) {
        //display error message
        $(this).attr({
                'data-toggle': 'tooltip',
                'data-placement': 'top',
                'title' : 'Numerical Digits Only'
            });
        $(this).tooltip('show');
        return false;
    }
   });

  } // shoppingGrocery function ends here

  // start shopping
  shoppingGrocery();

});



