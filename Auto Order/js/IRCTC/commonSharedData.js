var userAggrement =
{
    Agree:false,
    Expire:""
}

var paymentMode = { 
  	OFF:0,
    UPI: 1, 
    IRCTC_WALLET: 2
}; 

var paymentDetails = {
    enableUPIPayment:paymentMode.OFF,
    upiAddress:"123456789@ybl",
    clickOnContinue:false,
  };

var travelDetails = {
    source: "DELHI - DLI (NEW DELHI)",
    destination: "AGRA CANTT - AGC (AGRA)",
    date: "2023-07-25",
    clas: "First Class",
    jQuota:"GENERAL",
    confirmBirth:false,
    travalInsurance:true,
    autoUpgradation:false,
    trainName: "-",
  	trainCoach: "-",
  	ExecuteScripts:false,
};
userAggrementDetails();
function userAggrementDetails()
{
  chrome.storage.local.get('userAggrementExpire',function(x)
    {
        console.log(x.userAggrementExpire);
        if(x!==undefined)
        {
            if(x.userAggrementExpire!==undefined)
            {
                userAggrement.Agree = isUserAggrementExpire(x.userAggrementExpire);
                 console.log(userAggrement);
            }
        }
    });
}
function isUserAggrementExpire(targetTime) {
    const targetDate = new Date(targetTime);
    const currentDate = new Date();
    const timeDifference =  currentDate  - targetDate;
    const differenceInMilliseconds = timeDifference;// getTimeDifferenceWithCurrentTime(targetTime);
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    //return isNaN(differenceInHours)?  true: differenceInSeconds > 30 ;/// (1000 * 60 * 60);
    return isNaN(differenceInHours)?  false: differenceInHours < 24 ;/// (1000 * 60 * 60);
}
