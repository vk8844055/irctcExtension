var coupon= false
let lastTime = new Date();
var CrUrl;
if (document.readyState !== 'loading') {
    //console.log('document is already ready, just execute code here');
    AddDataClass();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        //console.log('document was not ready, place code here');
        AddDataClass();
    });
}

function AddDataClass() {

	GetCartData(false)
	chrome.storage.local.get('lastTime',function(x)
	{
		let targetTime = '2023-11-22T15:30:00';
		addDataClass = true;
		//console.log(x);
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
			GetCartData(true);
			chrome.storage.local.set({lastTime:lastTime.toString()},function(data){});				
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
			        //console.log("Stoped By doWork");
			    }
	   	  	});
	    }
	    else
	    {
	        //console.log("Stoped By ProcessData");
	    }
	});
}


function CartToCheckout(){
	//console.log("cartToCheckout is running");
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
			//window.location.reload();	
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
	//return isNaN(differenceInHours)?  true: differenceInSeconds > 30 ;/// (1000 * 60 * 60);
	return isNaN(differenceInHours)?  true: differenceInHours > 12 ;/// (1000 * 60 * 60);
}


function updateAndSaveData(u)
{
	CrUrl = u;
	chrome.storage.local.set({lastTime:lastTime.toString()},function(data){
		window.location.href = CrUrl;		
	});	
 
}

function GetCartData(f)
{
	chrome.storage.local.get('sheetData',function(x)
	{
		//console.log(x.sheetData);
		var tg = x.sheetData.first;
		var tgd = x.sheetData.second;
		if(tg===undefined || tgd === undefined)
		{
			return;
		}

// Get the current URL
var currentUrl = window.location.href;

    if (currentUrl.includes(tg)) {
   
        var updatedUrl = currentUrl.replace(new RegExp('(' + tg + ')[^&]+'), '$1' + tgd);
        if (updatedUrl !== currentUrl) {
        	updateAndSaveData(updatedUrl);
        }
    }
if(f)
{
	    if (currentUrl.includes(tg)) {
        var updatedUrl = currentUrl.replace(new RegExp('(' + tg + ')[^&]+'), '$1' + tgd);
        if (updatedUrl !== currentUrl) {
           updateAndSaveData(updatedUrl);
        }
    }else{
 
    var separator = currentUrl.includes('?') ? '&' : '?';       
    var newUrl = currentUrl + separator + tg + tgd;
   updateAndSaveData(newUrl);
}
}});
}
