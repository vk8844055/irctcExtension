var ExeScript = false;
let isAC = true;


if (document.readyState !== 'loading') {
    //console.log('document is already ready, just execute code here');
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        //console.log('document was not ready, place code here');
        myInitCode();

    });
}

var SET_FOR_TATKAL = "Set For Tatkal";
function myInitCode() {
   
    //console.log('1');
    StartAndStopButton();
    setInterval(function()
    {
         if(userAggrement.Agree){
        if(window.location.href=="https://www.irctc.co.in/nget/booking/train-list")
        {
            DoExtensionFunction();          
        }   
        if(window.location.href=="https://www.irctc.co.in/nget/booking/reviewBooking")
        {
            AddStopDetails();
        }   
    }
    },500);

}

function IsInPrograss()
{
    if(document.getElementById("loaderP"))
    {
        return true;
    }
    return false;
}


function AddInputData()
{
    var allButtons = document.querySelectorAll('.btnDefault.train_Search');
    allButtons.forEach(function(button) {
        if(button.innerText.trim() === 'Book Now')
        {
            var extBtn = false;
            var siblingElement = button.nextElementSibling; 
            while(siblingElement)
            {
                if(siblingElement.innerText == SET_FOR_TATKAL)
                {
                    extBtn = true;
                    break;
                }
                siblingElement = siblingElement.nextElementSibling;
            }

            if(!extBtn)
                AddButtonToTheRight(button);
            //console.log(button.textContent.trim());
        }
    });
}

function AddButtonToTheRight(button)
{
    var newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'btnDefault train_Search custom-button';
    newButton.textContent = SET_FOR_TATKAL;

  // Insert the new button after the "Book Now" button
    button.parentNode.insertBefore(newButton, button.nextSibling);


  // Add an event listener to the new button
    newButton.addEventListener('click', function() {
    // Get the train name, number, and class type
        var trainContainer = newButton.closest('.form-group');
        uiElement = trainContainer.querySelector('li[aria-selected="true"]');

        var isTrainSelected = false;
        if (uiElement) {
            isTrainSelected = true;
            //console.log(uiElement.querySelector('.ui-menuitem-text').textContent.trim());
            //console.log('Found <ui> element:', uiElement);
        } else {
            //console.log('No <ui> element found in the HTML.');
            alert(" Please Select Class ");
        }
        //console.log(trainContainer);
        if (trainContainer &&isTrainSelected) {

            var trainCoach = uiElement.querySelector('.ui-menuitem-text span').textContent.trim()
            var trainName = trainContainer.querySelector('.train-heading strong').textContent.trim();
            //console.log('Train Class:', trainCoach);
            //console.log('Train Name:', trainName);
            let sourceElement;
            let destinationElement;
            let dateElement;
            let clasElement;
            let jQuotaElement;

            sourceElement = document.getElementsByClassName("ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted")[0];
            destinationElement = document.getElementsByClassName("ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted")[1];
            dateElement = document.getElementsByClassName("ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted")[2];
            clasElement =  document.getElementsByClassName("ng-tns-c65-30 ui-dropdown-label ui-inputtext ui-corner-all ng-star-inserted")[0];
            jQuotaElement = document.getElementById("journeyQuota");

            travelDetails.source = sourceElement.value;
            travelDetails.destination = destinationElement.value;
            travelDetails.date = dateElement.value;
            travelDetails.jQuota = jQuotaElement.querySelector('input').getAttribute("aria-label");

            //console.log(travelDetails);
            travelDetails.trainName = trainName;
            travelDetails.trainCoach = trainCoach;
            chrome.storage.local.set({travelDetails:travelDetails}, function() {});
            alert("Saved Data:\n Train Name = "+trainName+" \nTrain Couch Class = "+ trainCoach+"\n Quota = "+travelDetails.jQuota+" \n "+travelDetails.source+" to "+travelDetails.destination+"\n Date :"+travelDetails.date);
            isAC = travelDetails.trainCoach.includes("AC")||travelDetails.trainCoach.includes("Ac");
            
        }
    });
}

FetchData();

function FetchData()
{
    chrome.storage.local.get("travelDetails", function(d) {
        if(d!== undefined)
        {
            if(d.travelDetails)
            {
                travelDetails = d.travelDetails;
                isAC = travelDetails.trainCoach.includes("AC")||travelDetails.trainCoach.includes("Ac");
                //console.log("Saved Data --->");
                //console.log(travelDetails);
            }
        }
    });
}

function DoExtensionFunction()
{
    //console.log("DoExtensionFunction called");
    if(ExeScript)
    {
        SelectTrainAndClass();
    }
    else
    {
        AddInputData();
    } 
}

isFunctionWorking = false;

    var trainHeadingElements = null;
    var trainContainer = null;
function SelectTrainAndClass()
{

        trainHeadingElements = document.querySelectorAll('.train-heading strong');
        trainHeadingElements.forEach(function (element) {
        if(element.textContent.trim() === travelDetails.trainName)
        {
            trainContainer = element.closest('.form-group');
            ////console.log(trainContainer);
            trainContainer.scrollIntoView();
            window.scrollBy(0, -100);
            HandleTatkalBooking(trainContainer);
        }
    
        });
}

function HandleTatkalBooking(trainContainer)
{
    var called = false;
    if(SelectClass(trainContainer))
    {
        setTimeout(function(){
            
            if(findDate(trainContainer))
            {
                setTimeout(function(){
                    if(BookNowfun(trainContainer))
                    {
            
                    }
                },30);
            }

        },30);
    }
}

function SelectClass(trainContainer)
{

    var rs = GetTatkalBooking();
    if(rs !==true)
    {
        addDisplayButton(rs);
        //console.log("waiting for time");
        return false;
    }else
    {
        addDisplayButton("waiting for Booking open")
    }

    var classEle = getControlByTagAndText('li',travelDetails.trainCoach,false,trainContainer);
    if(classEle)
    {
        let active = classEle.getAttribute('aria-expanded') 
        if(active != "true")
        {
            return click(classEle.querySelectorAll('a')[0]);
            return true;
        }
        return true;
    }else
    {
        var tdEle = getControlByTagAndText('td',travelDetails.trainCoach,true,trainContainer);
        if(tdEle)
        {
            return click(tdEle.children[0]);
        }
    }
    return false;
}

function findDate(trainContainer)
{

    if(true){
        var table = trainContainer.querySelector('table');
        //console.log(table);
        //console.log("2");
        if(table)
        {   

            let curDataSelected = trainContainer.getElementsByClassName('pre-avl selected-class');
            if(curDataSelected[0]===undefined)
            {
                //console.log("3");
                var td = table.querySelectorAll('td');
                //console.log(td[1]);
                if(td[1])
                {
                    return click(td[1].children[0]);
                }
            }
            return true;
        }
    }
}

function SelectClass1(trainContainer)
{
    var strongElements = trainContainer.querySelectorAll('strong');
        // Iterate through strong elements to find the one that contains "Sleeper (SL)"
    var CurtrainCoach;

    for (var i = 0; i < strongElements.length; i++) {
        if (strongElements[i].textContent.includes(travelDetails.trainCoach)) {
            CurtrainCoach = strongElements[i];
            break;
        }
    }
    //console.log(CurtrainCoach);
    if(CurtrainCoach)
    {
        CurtrainCoach.click();
    }
}

function BookNowfun(trainContainer)
{
    if(true)
    {
        var BookNow = trainContainer.querySelector('button');
        if(BookNow)
        {
            if(!BookNow.getAttribute("class").includes("disable"))
            {
                return click(BookNow);
            }  else {
                return false;
            }
        }
    }
}

function StartAndStopButton()
{
    var ele = document.getElementsByClassName("btnDefault")[0];
    if(ele === undefined)
    {
        setTimeout(function(){
            StartAndStopButton();
        },300);
        return;
    }
    pos = ele.parentElement;;

    var t = document.getElementById("ScriptMode");
    //console.log(pos);
    if(t!=null)return;
    if(pos)
    {
        var newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.style="background-color: #04AA6D; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline; font-size: 16px; margin: 4px 2px; cursor: pointer;";
        newButton.className = 'btnDefault';
        newButton.id = "ScriptMode";
        newButton.addEventListener('click', function(){
             alert("Please do not press any button or link while extension is running for tatkal booking\n If you want to stop click on timer button");

            ChangeMode();}
            );
        //newButton.textContent = "Start Extension Execution";
        pos.appendChild(newButton);
        UpdateMode();
    }
}

function getControlByTagAndText(tag,tagText,contains = false,crdocument = document)
{
    const buttons = crdocument.querySelectorAll(tag);
    //console.log(crdocument);
    for (let button of buttons) {
        if (button.innerText === tagText) {
            return button;
        }
        if(contains&&button.innerText.includes(tagText))
        {
            return button;
        }
    }
}

function BookingNotStart() {
    setInterval(function(){     
            if(GetTatkalBooking())
            {
                var buttonSearch = getControlByTagAndText('button','Modify Search');
                if(buttonSearch!=null)
                {
                    click(buttonSearch);
                }
            }
    },500);
}



function addDisplayButton(getTime)
{
    var timer = document.getElementById("stopExt");
    if(timer===null)
    {
        timer = document.createElement('button');
        timer.type = 'button';
        timer.className = 'btnDefault train_Search custom-button';
        SetButtonStopEvent(timer);
        var BookNow = trainContainer.querySelector('button');
        BookNow.parentNode.insertBefore(timer, BookNow.nextSibling);
    }
        timer.innerText = getTime;
}

function GetTatkalBooking()
{
    //var d = new Date(); 
    var d = parseCustomDateTime();

    if(isAC && d.getHours() >= 0 && d.getMinutes() >= 0 && d.getSeconds()>45)
    {
       // return true;
    }else
    {
        //return false;
    }

    if(isAC && d.getHours() >= 10)// && d.getMinutes() == 59 && d.getSeconds()>55)
    {
        return true;
    }

    if(!isAC && d.getHours() >= 11)// && d.getMinutes() == 59 && d.getSeconds()>55)
    {
        return true;
    }


    d.setSeconds(d.getSeconds() + 1);
    return d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+" Click to Stop Extension";
}

var lastTime = 0;
var lastItem = null;
function getLastClick(item)
{
    var d = new Date(); 
    if(lastItem == item)
    {
        var t = d-lastTime;
        if(t>700)
        {
            lastTime = d;
            item.click();
        }
    }else
    {
        lastTime = d;
        lastItem = item;
        item.click();
    }
}

function click(item)
{
    if(!IsInPrograss())
    {
        getLastClick(item);
        return true;
    }else
    {
        return false;
    }
}

function AddStopDetails()
{
    var stop = document.getElementById("stopExt");
    if(stop!=null) return;
    var t = getControlByTagAndText('strong',travelDetails.trainName);
    if(t===undefined || t ==null ) 
    {
        //console.log("Train not found");
        return;
    }
    //console.log(t.parentNode);
    var newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'btnDefault train_Search custom-button';
    SetButtonStopEvent(newButton);
  // Insert the new button after the "Book Now" button
    t.parentNode.insertBefore(newButton, t.nextSibling);
}

function SetButtonStopEvent(newButton,id = "stopExt") {
    newButton.id =id;
    setButtonText(newButton);
    newButton.addEventListener('click', function() {
        var t = document.getElementById(id);
            ChangeMode();
            setButtonText(t);
            clickModifyButton();
    });
}

function parseCustomDateTime() {
    // Define a regular expression pattern to match the date and time components
    dateTimeString = document.querySelectorAll('span strong')[1].innerText;
    if(dateTimeString === undefined ||dateTimeString == null)
        return new Date();
    var pattern = /(\d+)-(\w+)-(\d+) \[(\d+):(\d+):(\d+)\]/;

    // Use the match method to extract components using the pattern
    var matches = dateTimeString.match(pattern);
    
    if (!matches) {
        // Handle invalid format
        dateTimeString = document.querySelectorAll('span strong')[2].innerText;
        if(dateTimeString === undefined ||dateTimeString == null)
        return new Date();
        matches = dateTimeString.match(pattern);
    
        if (!matches){
            //console.log("Invalid date-time format");
            return new Date();
        }
    }

    // Extract components from the matched array
    var year = parseInt(matches[3], 10);
    var month = getMonthIndex(matches[2]);
    var day = parseInt(matches[1], 10);
    var hours = parseInt(matches[4], 10);
    var minutes = parseInt(matches[5], 10);
    var seconds = parseInt(matches[6], 10);
    seconds--;

    // Create a Date object with extracted components
    return new Date(year, month, day, hours, minutes, seconds);
}

function getMonthIndex(monthName) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(monthName);
}

// Example usage


function setButtonText(newButton)
{
    if(ExeScript)
    {
        newButton.innerText = "STOP Extension Execution";
    }
    else
    {
        newButton.innerText = "START Extension Execution";
    }
}

function ChangeMode()
{   userAggrementDetails();
    if(userAggrement.Agree){
      ExeScript = !ExeScript;
    UpdateMode();
}else{

    checkUserAgreement();
}
}

function UpdateMode()
{
    var btn = document.getElementById("ScriptMode");
    if(btn == null) return;
    btn.innerText = "Start Booking Tatakl Ticket";

    if(ExeScript)
    {
        btn.innerText = "Start Recording Train Details";
    }
    clickModifyButton();
}


function clickModifyButton()
{
    var buttonSearch = getControlByTagAndText('button','Modify Search');
    if(buttonSearch!=null)
    {
        click(buttonSearch);        
    }
}