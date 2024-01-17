
if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        myInitCode();
    });
}
;
function myInitCode() {
   
    document.getElementById("agree1").addEventListener("click", function(){
        var userAggrementExpire = new Date();
        chrome.storage.local.set({userAggrementExpire:userAggrementExpire.toString()},function(data){}); 
        window.open("https://www.irctc.co.in/nget/train-search");
    });
    document.getElementById("agree2").addEventListener("click", function(){
        var userAggrementExpire = new Date();
        chrome.storage.local.set({userAggrementExpire:userAggrementExpire.toString()},function(data){}); 
        window.open("https://www.irctc.co.in/nget/train-search");
    });
}