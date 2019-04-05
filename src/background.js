// Background stuff here

chrome.runtime.onInstalled.addListener(function() {

});

chrome.tabs.onUpdated.addListener(function (tabId , info) {
	if (info.status === 'complete') {
		console.log(`Gruh: ${tabId}`);
	}
});