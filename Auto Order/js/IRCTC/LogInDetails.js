console.log("LogIn scripts is running");
let User= {
  userName: "",
  userPassword: ""
};

let userNameElement;
let oldUserNameElement;
let userPassword;
let logInBtn;
let callOnce = true;
let firstRun = true;

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
  window.observer = new MutationObserver(HandelLogInDetails); 
        var SetConfig = {attributes: true,childList: true,characterData: true,subtree: true}; 
        observer.observe(window.document, SetConfig);
        capchaHandler();
}

        
function HandelLogInDetails() {
    setTimeout(function(){
    userNameElement =  document.querySelectorAll("[placeholder='User Name']")[0];
    userPassword = document.querySelectorAll("[placeholder='Password']")[0];;
    logInBtn =  getSingInButton();;

    if(oldUserNameElement != userNameElement || firstRun)
    if(userNameElement&&userPassword&&logInBtn&&callOnce){
    //callOnce = false;
    chrome.storage.local.get('userDetails', function(data) {
        if(data.userDetails!==undefined)
        {
            updateElementValue(userNameElement,data.userDetails.userName);
            updateElementValue(userPassword,data.userDetails.userPassword);
        }
       });
    logInBtn.addEventListener("click", function () {
        User.userPassword = userPassword.value;
        User.userName = userNameElement.value;
         chrome.storage.local.set({userDetails:User}, function() {});
  });    
firstRun = false;
}
oldUserNameElement = userNameElement;
},300);
}



function updateElementValue(Element,data)
{
    console.log('----------------');
    console.log(Element);
    console.log(Element.value);
    if(data !== undefined){
        Element.value = data;
        Element.dispatchEvent(new Event('keydown'));
        Element.dispatchEvent(new Event('input'));
    }
    else
    {
        console.log("data is undefined");
    }
    console.log(Element.value);
}

function getSingInButton()
{
const buttons = document.getElementsByTagName('button');
for (let button of buttons) {
  if (button.innerText === 'SIGN IN') {
    return button;
  }
}
}


function capchaHandler()
{
var captLast={src:''};
setInterval(function(){    
    var capt =  document.getElementsByClassName("captcha-img");
    if(capt.length>0)
    {
        if(captLast.src!=capt[0].src)
        {
            sendMessageToBackgroundScript(capt[0].src,'abc');
            captLast=capt[0];
            console.log('------>>');
        }    
    }
},1000);
}

function sendMessageToBackgroundScript(a,b) {
    const message = {cap: a,text:b};
  chrome.runtime.sendMessage(message, response => {
    console.log('Response from background script:', response);
  });
}


