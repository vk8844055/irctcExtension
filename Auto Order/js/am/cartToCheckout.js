var coupon= false
let lastTime = new Date();

if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    AddDataClass();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        AddDataClass();
    });
}

function AddDataClass() {

	chrome.storage.local.get('lastTime',function(x)
	{
		let targetTime = '2023-11-22T15:30:00';
		addDataClass = true;
		console.log(x);
		if(x!==undefined)
		{
			if(x.lastTime!==undefined)
			{
				targetTime = x.lastTime;
				addDataClass = getTimeDifferenceWithCurrentTime(targetTime);
			}
		}
		if(addDataClass)
		{
			chrome.storage.local.set({lastTime:lastTime.toString()},function(data){});	
			chrome.runtime.sendMessage({ addDataClass:true},function(res)
			{
				//console.log(res);
			});			
		}
		
	});
}

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
		if(document.querySelectorAll("input[name='proceedToRetailCheckout']"))
		{
			if(!isClicked)
			{
				document.querySelectorAll("input[name='proceedToRetailCheckout']").click();
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
		if(document.querySelectorAll("input[name='proceedToRetailCheckout']"))
		{
			window.location.reload();	
		}
	},25000);
}

function getTimeDifferenceWithCurrentTime(targetTime) {
	const targetDate = new Date(targetTime);
	const currentDate = new Date();
	const timeDifference =  currentDate  - targetDate;
	const differenceInMilliseconds = timeDifference;// getTimeDifferenceWithCurrentTime(targetTime);
	const differenceInSeconds = differenceInMilliseconds / 1000;
	const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
	const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
	//return isNaN(differenceInHours)?  true: differenceInSeconds > 10 ;/// (1000 * 60 * 60);
	return isNaN(differenceInHours)?  true: differenceInHours > 1 ;/// (1000 * 60 * 60);
}