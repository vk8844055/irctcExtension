
const paymentMode = Object.freeze({ 
  	OFF:0,
    UPI: 1, 
    IRCTC_WALLET: 2
}); 


let paymentDetails = {
    enableUPIPayment:paymentMode.OFF,
    upiAddress:"123456789@ybl",
    clickOnContinue:false,
  };
GetPaymentsDetails();

if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    myInitCode();
} else {
    	document.addEventListener('DOMContentLoaded', function () {
    	console.log('document was not ready, place code here');
  	  myInitCode();
    });
}

function myInitCode() {
   //	TrainSearch();
	setInterval(function(){
		if(!IsInPrograss())
		{
			updateVPADetails();	
		}
	},1000);
}

function GetPaymentsDetails()
{
	chrome.storage.sync.get('paymentDetails', function (data)
	{
		console.log("paymentDetails");
		console.log(data);
		if(data !== undefined)
		{
			if(data.paymentDetails!== undefined)
			{
				paymentDetails = data.paymentDetails;
			}
		}
	});
}


let isVPAClick = false;
// Usage: Set the desired value
function updateVPADetails()
{

	if(paymentDetails.enableUPIPayment==paymentMode.UPI)
	{
		setVpaValueAndTriggerEvents(paymentDetails.upiAddress);
		setTimeout(function(){
			if(!isVPAClick)
			{
				document.getElementById("upi-sbmt").click();
				isVPAClick = true;
			}
			
		},500);
	}
}
//setVpaValueAndTriggerEvents("your desired value");

function setVpaValueAndTriggerEvents(newValue) {
  var vpaInputElement = document.getElementById("vpaCheck");

  if (vpaInputElement) {
    vpaInputElement.value = newValue;

    // Trigger the input event (simulating user typing)
    var inputEvent = new Event("input", { bubbles: true });
    vpaInputElement.dispatchEvent(inputEvent);

    // Trigger the keyup event (simulating key release)
    var keyupEvent = new Event("keyup", { bubbles: true });
    vpaInputElement.dispatchEvent(keyupEvent);

    // Trigger the keydown event (simulating key press)
    var keydownEvent = new Event("keydown", { bubbles: true });
    vpaInputElement.dispatchEvent(keydownEvent);

    // Trigger the focusout event (simulating focus out)
    var focusoutEvent = new Event("focusout", { bubbles: true });
    vpaInputElement.dispatchEvent(focusoutEvent);

    // Additional events can be triggered as needed

    console.log("Value set and events triggered");
  } else {
    console.log("Input element not found");
  }
}

function IsInPrograss()
{
	if(document.getElementById("loaderP"))
	{
		return true;
	}
	return false;
}
