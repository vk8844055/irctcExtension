
let sourceElement;
let destinationElement;
let dateElement;
let clasElement;
let jQuotaElement;
let VPAAddress = '';

var link = "https://www.irctc.co.in/nget/train-search"
var didLinkChanged = false;

if (document.readyState !== 'loading') {
    //console.log('document is already ready, just execute code here');
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        //console.log('document was not ready, place code here');
        myInitCode();
    });
}
function myInitCode() {
   //	TrainSearch();
	setInterval(function(){
		if(userAggrement.Agree && !IsInPrograss())
		{
			checkLink();		
		}
	},500);
}

function checkLink()
{
	var cLink = window.location.href;
	if(cLink != link)
	{
		didLinkChanged = true;;
	}
	else
	{
		if(didLinkChanged)
		{
			TrainSearch();
			didLinkChanged = false;
		}
	}

	if(cLink == 'https://www.irctc.co.in/nget/booking/psgninput')
	{
		if(ExeScript)
		{
			FillPassenerDetails();
		}
		StartStopBtnhandler();
	}
	if(cLink == "https://www.irctc.co.in/nget/payment/bkgPaymentOptions")
	{
		if(paymentDetails.enableUPIPayment == paymentMode.UPI)
			selectBHIM_UPI();
	if(paymentDetails.enableUPIPayment == paymentMode.IRCTC_WALLET)
		clickIrctcEWallet()
	}

	if(cLink == "https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp")
	{
		updateVPADetails();
	}
	
}


function TrainSearch()
{
	sourceElement = document.getElementsByClassName("ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted")[0];
	destinationElement = document.getElementsByClassName("ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted")[1];
	dateElement = document.getElementsByClassName("ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted")[2];
	clasElement =  document.getElementById("journeyClass");
	jQuotaElement = document.getElementById("journeyQuota");

	try
	{
		GetData();	
	}catch(err)
	{

	}
}

function storeData()
{

  if(!(sourceElement.value=='' || destinationElement.value ==''))
  {
  		travelDetails.source = sourceElement.value;
  		travelDetails.destination = destinationElement.value;
  		travelDetails.date = dateElement.value;
  		travelDetails.clas = clasElement.querySelector('input').getAttribute("aria-label");
  		travelDetails.jQuota = jQuotaElement.querySelector('input').getAttribute("aria-label");
  		//console.log(travelDetails);
	  	chrome.storage.local.set({ travelDetails: travelDetails }, function () {
	  	//console.log(travelDetails);
    	//console.log("Updated travel details saved to storage.");
  	});
	  changeTravalData();
	}
}


function GetData()
{
chrome.storage.local.get("travelDetails", function (data) {
//console.log(data)
if(data.travelDetails) {
	travelDetails = data.travelDetails;
}
  addControlToTheDocuments();
  //applyButtonStyles();
  });
}

function FillData()
{
	var clsV = clasElement.querySelector('input').getAttribute("aria-label");
	var jQV = jQuotaElement.querySelector('input').getAttribute("aria-label");
	FillDataLast();	
}
function FillDataLast(f=true){
  
  var jQV = jQuotaElement.querySelector('input').getAttribute("aria-label");
  if(jQV != travelDetails.jQuota)
  {
  setTimeout(()=>{
  updateElementValue1(jQuotaElement, travelDetails.jQuota);
	},100);
  }
  else
  {
  updateElementValue(sourceElement,travelDetails.source);
  updateElementValue(destinationElement,travelDetails.destination);
  updateElementValue(dateElement, travelDetails.date);
}
 }


async function updateElementValue1(Element,data)
{
if(Element){
	//console.log(Element);
	//console.log(Element.querySelector('div[role="button"]'));
Element.querySelector('div[role="button"]').click();	
	var listItem = Element.querySelector('li[aria-label="'+data+'"]');
					if(listItem){
						//console.log(listItem);
							listItem.click();
							FillDataLast();
					}	
return new Promise((resolve, reject) => {
        // Simulating an action with a delay
        setTimeout(() => {
      		var listItem = Element.querySelector('li[aria-label="'+data+'"]');
					if(listItem){
						//console.log(listItem);
							listItem.click();
								listItem.dispatchEvent(new Event('change'));
							FillDataLast();
					}
				//	document.querySelector('button.search_btn.train_Search[label="Find Trains"]').click();
							resolve("done");
        }, 100);
  });
}}

 function changeTravalData()
  {
  	let str = travelDetails.source+ " \n "+travelDetails.date+" \n "+travelDetails.destination+" \n "+travelDetails.jQuota+" \n " ;
  	document.getElementById("lastSavedDataId").innerText = str;
  	//console.log(str);
  }

// Inject the buttons when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
GetData();
});


function updateElementValue(Element,data,isChange = false)
{
	if(Element!==undefined && Element.value != data)
	{
		if(!isChange)
		{
			Element.value = data;
			Element.dispatchEvent(new Event('keydown'));
			Element.dispatchEvent(new Event('input'));
		}else
		{
			if(data!='')
			{
				Element.value = data;
				Element.dispatchEvent(new Event('change'));
				if(Element.value=='')
				{
						Element.value = 'E';
						Element.dispatchEvent(new Event('change'));
				}
			}		
		}
	}
}

function addControlToTheDocuments()
{
	var position = document.getElementsByClassName("form-swap col-xs-12 remove-padding")[1];
	if(!position)
		return ;

	const saveData = document.createElement("button");
  	saveData.innerText = "   Save Journey Data   ";
  	saveData.id = "saveDataId";
    saveData.addEventListener("click", function () {   
  	if(userAggrement.Agree!=true)
  	{
  		checkUserAgreement();
  		return;
  	}
  
      SetScriptStatus(false);
      storeData();
      changeTravalData();
  });

  const lastSavedData = document.createElement("button");
  lastSavedData.innerText = "FillData";
  lastSavedData.id = "lastSavedDataId";
  lastSavedData.addEventListener("mousedown", function () {
  	//console.log(userAggrement);
  	if(userAggrement.Agree!=true)
  	{
  		checkUserAgreement();
  		return;
  	}
      FillData();
      SetScriptStatus(true);
  });
  
	position.appendChild(saveData);
	position.appendChild(lastSavedData);
	changeTravalData();
}

let isPassengerDetailsFilled = false;

function FillPassenerDetails()
{
	
	chrome.storage.local.get('PassengersDetails', function (data){
		var totalPassenger = data.PassengersDetails.length;
		//console.log(data.PassengersDetails);
		var pass = data.PassengersDetails;
		
		var addPassengerControl = document.getElementsByClassName("zeroPadding pull-left ng-star-inserted")[0].children[0];
  	let passName = document.querySelectorAll("input[placeholder*='Passenger Name']");
  	while(totalPassenger > passName.length)
  	{
  		addPassengerControl.click();
  		passName = document.querySelectorAll("input[placeholder*='Passenger Name']");
  	}
  	
    var passAge = document.querySelectorAll("input[formcontrolname*='passengerAge']");
    var passGender = document.querySelectorAll("select[formcontrolname*='passengerGender']");
    var passBerthChoice = document.querySelectorAll("select[formcontrolname*='passengerBerthChoice']")
    var passfoodChoice = document.querySelectorAll("select[formcontrolname*='passengerFoodChoice']");

    var selectElement = document.querySelectorAll("[formcontrolname='passengerBerthChoice']")[0];
		const optionValues = Array.from(selectElement.options).map(option => option.value).filter(value => value !== "");
		//console.log(optionValues);

    for( var i = 0; i < totalPassenger; i++)
    {
    	updateElementValue(passName[i],pass[i].name);
    	updateElementValue(passAge[i],pass[i].age);
    	updateElementValue(passfoodChoice[i],pass[i].foodChoice,true);
    	updateElementValue(passGender[i],pass[i].gender,true);
    	
    	if(optionValues.indexOf(pass[i].berthChoice) != -1)
    	updateElementValue(passBerthChoice[i],pass[i].berthChoice,true);
    }
   
	if(document.getElementById("autoUpgradation")!=null)
	{
		document.getElementById("autoUpgradation").checked = travelDetails.autoUpgradation;
	}

	if(document.getElementById("confirmberths")!=null)	
	{
		document.getElementById("confirmberths").checked = travelDetails.confirmBirth;	
	}
	

	var ins = document.getElementsByName("travelInsuranceOpted-0");
	if(ins)
	{
		if(!travelDetails.travalInsurance)
		{
			if(ins[1] !== undefined)
			ins[1].click();
		}else
		{
			if(ins[0] !== undefined)
			ins[0].click();
		}
	}

	 isPassengerDetailsFilled = true;
	
	});
		
	if(isPassengerDetailsFilled)
	{
	
		chrome.storage.local.get('paymentDetails', function (data){
			//console.log("paymentDetails");
			//console.log(data);
		if(data !== undefined)
		{
			if(data.paymentDetails!== undefined)
			{
				paymentDetails = data.paymentDetails; 
				
				if(paymentDetails.enableUPIPayment != paymentMode.OFF)
				{
					if(paymentDetails.enableUPIPayment == paymentMode.UPI)
					{
						var UPIOption = document.getElementById("2");
						UPIOption.firstChild.firstChild.firstChild.click();
						var buttonElement = document.querySelector('.train_Search.btnDefault');
		setTimeout(function () {
			click(buttonElement);
		},100);	
					}
					if(paymentDetails.enableUPIPayment == paymentMode.IRCTC_WALLET)
					{
						var UPIOption = document.getElementById("3");
						UPIOption.firstChild.firstChild.firstChild.click();
						var buttonElement = document.querySelector('.train_Search.btnDefault');
		setTimeout(function () {
			click(buttonElement);
		},100);	
					}
			}
			}
		}
	 });


	
}
}

var reviewLink = 'https://www.irctc.co.in/nget/booking/reviewBooking';

function StartStopBtnhandler()
{
  
  if(document.getElementById("stopExt")!=null)
  	return;

  var DocumentPosition = document.getElementsByClassName("ui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all ng-star-inserted")[1];
  const StartStopBtn = document.createElement("button");
  
  StartStopBtn.style = 'display: inline-block; width: 250px; height: 80px; background-color: #25AA6D; color: #fff; text-align: center; line-height: 40px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; text-decoration: none';
  const info = document.createElement("h3");
  info.innerText = 'Scripts is running to modify something stop scripts first'
  DocumentPosition.appendChild(StartStopBtn);
	DocumentPosition.appendChild(info);
	SetButtonStopEvent(StartStopBtn);

}
function findPostion()
{
	setTimeout(function(){
		var position = document.getElementById("journeyQuota");
		if(position ===undefined)
		{
			findPostion();
		}else
		{
			if(position.parentElement.parentElement.parentNode === undefined)
			{
				findPostion();	
			}else
			{
				TrainSearch();
			}
		}
	},500);
}

findPostion();


// Custom function to find an element containing specific text
function findElementByTextContent(selector, text) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].textContent.includes(text)) {
      return elements[i];
    }
  }
  return null;
}

var nextClickAfter = 0;
function selectBHIM_UPI()
{
	nextClickAfter = nextClickAfter-1;
	// Use the custom function to find and click on the BHIM/UPI element
	//var bhimUpiElement = findElementByTextContent('.bank-type span.col-pad', 'BHIM/ UPI/ USSD');
	if (nextClickAfter <=0 ) {
	  nextClickAfter = 7;
	  setTimeout(function(){
	  	var payButton = findElementByTextContent('.btn', 'Pay & Book');
	  	payButton.click();
	  },150);

	} else {
	  //console.log("BHIM/UPI element not found");
	}
}

  function clickIrctcEWallet() {
        // Find the element with the text content 'IRCTC eWallet'
        var irctcEWalletOption = findElementByTextContent1('.bank-type', 'IRCTC eWallet');

        // Simulate a click event on the IRCTC eWallet option
        if (irctcEWalletOption) {
            irctcEWalletOption.click();
            selectBHIM_UPI();
        }
    }

    // Function to find an element with specific text content
    function findElementByTextContent1(selector, text) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent.trim() === text) {
                return elements[i];
            }
        }
        return null;
    }

let isVPAClick = false;
// Usage: Set the desired value
function updateVPADetails()
{
	if(paymentDetails.enableUPIPayment)
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


function setVpaValueAndTriggerEvents(newValue) {
  var vpaInputElement = document.getElementById("vpaCheck");

 
  if (vpaInputElement && vpaInputElement.value != newValue ) {
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

    //console.log("Value set and events triggered");
  } else {
    //console.log("Input element not found");
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


function SetScriptStatus(f)
{
	travelDetails.ExecuteScripts = f;
	if(f)
	{
		StartAndStopButton();
	}
}

function checkUserAgreement()
{
		alert("Click on the Agree trem of use");
		window.open("https://www.tricks4you.in/2023/12/tatkal-booking.html");
}
