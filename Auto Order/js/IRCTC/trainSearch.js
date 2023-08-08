let travelDetails = {
  source: "",
  destination: "",
  date: "",
  clas: "",
  jQuota:""
};

let sourceElement;
let destinationElement;
let dateElement;
let clasElement;
let jQuotaElement;

var boolStartStop = true;

var link = "https://www.irctc.co.in/nget/train-search"
var didLinkChanged = false;

$(document).ready(function(){

//	TrainSearch();
	setInterval(function(){
		checkLink();		
	},1000);
});

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
		if(boolStartStop)
		FillPassenerDetails();
		StartStopBtnhandler();
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
  		console.log(travelDetails);
	  	chrome.storage.sync.set({ travelDetails: travelDetails }, function () {
	  	console.log(travelDetails);
    	console.log("Updated travel details saved to storage.");
  	});
	  changeTravalData();
	}
}


function GetData()
{
chrome.storage.sync.get("travelDetails", function (data) {
console.log(data)
if(data.travelDetails) {
	travelDetails.source = data.travelDetails.source;
	travelDetails.destination = data.travelDetails.destination;
	travelDetails.date =data.travelDetails.date;
	travelDetails.clas =data.travelDetails.clas;
	travelDetails.jQuota =data.travelDetails.jQuota;
}
  addControlToTheDocuments();
  //applyButtonStyles();
  });
}

function FillData()
{
	var clsV = clasElement.querySelector('input').getAttribute("aria-label");
	var jQV = jQuotaElement.querySelector('input').getAttribute("aria-label");
	
	if(jQV != travelDetails.jQuota)
	{
		//updateElementValue1(jQuotaElement, travelDetails.jQuota).then(result => {
		if(clsV!=travelDetails.clas)
		{
			setTimeout(function(){
			updateElementValue1(clasElement, travelDetails.clas).then(result => {
			setTimeout(function(){
				FillDataLast();
			},12);	
			});
		},25);	
		}else{
				FillDataLast();
		}
			//});
	}else
	{
		FillDataLast();
	}
}
function FillDataLast(f=true){
  updateElementValue(sourceElement,travelDetails.source);
  updateElementValue(destinationElement,travelDetails.destination);
  updateElementValue(dateElement, travelDetails.date);
  var jQV = jQuotaElement.querySelector('input').getAttribute("aria-label");
  if(jQV != travelDetails.jQuota)
  {
  setTimeout(()=>{
  updateElementValue1(jQuotaElement, travelDetails.jQuota);
	},2);
  }
 }


async function updateElementValue1(Element,data)
{
if(Element){
Element.querySelector('div[role="button"]').click();		
return new Promise((resolve, reject) => {
        // Simulating an action with a delay
        setTimeout(() => {
      		var listItem = Element.querySelector('li[aria-label="'+data+'"]');
					if(listItem){
						console.log(listItem);
							listItem.click();
							resolve("done");
					}
        }, 10);
  });
}}

 function changeTravalData()
  {
  	let str = travelDetails.source+ " \n "+travelDetails.date+" \n "+travelDetails.destination+" \n ";
  	document.getElementById("lastSavedDataId").innerText = str;
  	console.log(str);
  }

// Inject the buttons when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
GetData();
});


function updateElementValue(Element,data,isChange = false)
{
	if(Element!==undefined)
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
      storeData();
      changeTravalData();
  });

  const lastSavedData = document.createElement("button");
  lastSavedData.innerText = "FillData";
  lastSavedData.id = "lastSavedDataId";
  lastSavedData.addEventListener("click", function () {
      FillData();
  });
	position.appendChild(saveData);
	position.appendChild(lastSavedData);
	changeTravalData();
}


function FillPassenerDetails()
{
	chrome.storage.sync.get('PassengersDetails', function (data){
		var totalPassenger = data.PassengersDetails.length;
		console.log(data.PassengersDetails);
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
					console.log(optionValues);

          for( var i = 0; i < totalPassenger; i++)
          {
          	updateElementValue(passName[i],pass[i].name);
          	updateElementValue(passAge[i],pass[i].age);
          	updateElementValue(passfoodChoice[i],pass[i].foodChoice,true);
          	updateElementValue(passGender[i],pass[i].gender,true);
          	
          	if(optionValues.indexOf(pass[i].berthChoice) != -1)
          	updateElementValue(passBerthChoice[i],pass[i].berthChoice,true);
          }
        });
}


var reviewLink = 'https://www.irctc.co.in/nget/booking/reviewBooking';


var boolStartStop;

function StartStopBtnhandler()
{
  
  if(document.getElementById("StartStopBtnId")!=null)
  	return;

  var DocumentPosition = document.getElementsByClassName("ui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all ng-star-inserted")[1];
  const StartStopBtn = document.createElement("button");
  StartStopBtn.innerText = "Stop Scripts";
  StartStopBtn.id = "StartStopBtnId";
  StartStopBtn.style = 'display: inline-block; width: 250px; height: 80px; background-color: #25AA6D; color: #fff; text-align: center; line-height: 40px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; text-decoration: none';
  const info = document.createElement("h3");
  info.innerText = 'Scripts is running to modify something stop scripts first'
  DocumentPosition.appendChild(StartStopBtn);
	DocumentPosition.appendChild(info);
	
  StartStopBtn.addEventListener("click", function () {
      boolStartStop = !boolStartStop;
      if(boolStartStop)
      {
      	this.innerText = "Stop Scripts";
      }	
      else
      {
		this.innerText = "Start Scripts";
      }
  });

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

