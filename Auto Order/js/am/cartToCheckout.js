var coupon= false

$(document).ready(function(){
	//DoExtensionFunction();
});


function DoExtensionFunction()
{
	chrome.storage.local.get('processData',function(d)
	{
	    if(d.processData)
	    {
	 	  	chrome.storage.local.get('doWork',function(d){
	 	  		if(d.doWork)
	 	  		{
					CartToCheckout();
	 	  		}
	 	  		else 
	 	  		{
			        console.log("Stoped By doWork");
			    }
	   	  	});
	    }
	    else
	    {
	        console.log("Stoped By ProcessData");
	    }
	});
}


function CartToCheckout(){
	console.log("cartToCheckout is running");
	var isClicked = false;
	var it = 0;
	setInterval(function()
	{
		var couponData = document.getElementsByClassName("a-size-small a-link-normal sc-action-link");
		if(!coupon)
		{
			if(couponData)
			{
				for(var i = 0; i < couponData.length; i++)
				{
					couponData[i].click();
				}
				coupon = true;
			}
			else{
				coupon = true;
			}
		}

if(coupon){
		if($("input[name='proceedToRetailCheckout']"))
		{
			if(!isClicked)
			{
				$("input[name='proceedToRetailCheckout']").click();
				isClicked = true;
			}
			it++;
			if(it>200)
			{
				isClicked = false;	
				it = 0;
			}
		}

}
	},200);

	setTimeout(function(){
		if($("input[name='proceedToRetailCheckout']"))
		{
			window.location.reload();	
		}
	},25000);
}

//proceedToRetailCheckout