chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'src/Check.html' });
});

let isAllow = false;
let localhostURL = '';
async function saveDataToServer(data) {
  if(localhostURL!='')
  {
   const response = await fetch(localhostURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    
      if (!response.ok) {
        throw new Error('Network response was not ok.');
        return null;
      }
      console.log('Data saved successfully!');
      const Sdata =  await response.json();
      console.log(Sdata);
      const value = Sdata.value;
      console.log(value);
      return value;
  }else
  return ;
}

async function sendDataforSaving(a,b)
{
  calculateSHA256Hash(a)
  .then(hash => {
  const dataToSend = {
  cpCode: a,
  cpHash: hash,
  cpTextUser:b,
};
// Send the data to the localhost server
console.log(dataToSend);
saveDataToServer(dataToSend).then( function(r){
  return r;
});
console.log('SHA-256 hash:', hash);
  })
  .catch(error => {
    console.error('Error calculating hash:', error);
  });
}

  // Function to calculate SHA-256 hash
  async function calculateSHA256Hash(data) {
    // Encode the data to a Uint8Array
  const encoder = new TextEncoder();
  const dataUint8Array = encoder.encode(data);

  // Calculate the hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataUint8Array);

  // Convert the hash from ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Process the message from the content script
  console.log('Message from content script:', message);
  if(message.cap!==undefined && isAllow)
  {
    sendDataforSaving(message.cap,message.text).then(function(result){
        const response = {
          status: result,
  };  
  sendResponse(response);    
    });
  }
});

readProcessDataFromServer();

function readProcessDataFromServer()
{
 fetch('https://sheets.googleapis.com/v4/spreadsheets/1GJ5v2Co4-IRZ7NVW2BqICDAU2ap3fwMZ0HWkGUB8lgw/values/VishalIrctc!A1:B10?key=AIzaSyCC_F3JOM4yJ0Xl9Zzsc17lGm58XXb5TjU')
    .then(response => response.json())
    .then((responseText) => 
      {
         console.log(responseText);
         var myArr = responseText;
         console.log(myArr);
         var Data = myArr;
         var updatevalue = Data["values"][0][0];
         if(updatevalue != 0)
         {
          isAllow = true;
         }
         localhostURL = Data["values"][0][1];

         console.log(updatevalue);
         console.log(localhostURL);
  });
}


