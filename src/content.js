window.requestAnimationFrame(() => {
  var div = document.createElement('div');
  div.id = 'gfsInformationDiv';
  document.body.appendChild(div);
	// Run this code in the actual page
	// can be run manually by popup.js or automatically on page load through manifest.json
  console.log('div:', div);
});

chrome.runtime.sendMessage({request: 'tabData'});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.purpose === 'tabData') {
    console.log(request.data);
  }
});
