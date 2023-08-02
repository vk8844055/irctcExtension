chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'src/Check.html' });
});

// background.js
// Define the URL where you want to save the data on localhost

const localhostURL = 'http://localhost:3000/getCaptchaData';

async function saveDataToServer(data) {
  fetch(localhostURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      console.log('Data saved successfully!');
      return response.data;
    })
    .catch(error => {
      console.log('Error saving data:', error);
    });
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
  if(message.cap!==undefined)
  {
    sendDataforSaving(message.cap,message.text).then(function(result){
        const response = {
    status: result,
  };
  
  sendResponse(response);    
    });
  }
});

async function getCapchaText(imageData)
{
Tesseract.recognize(imageData) 
    .progress(function(p) { 
    }) 
    .then(function(result) {      
      console.log(results);
      var captcha = result.text; 
      console.log(captcha);
      return captcha;      
  });
}
