// Background stuff here
function updateTabData(data, callback) {
	chrome.storage.local.set({tabData: data}, callback());
}

function getTabData(data, callback) {
	chrome.storage.local.get(['tabData'], callback());
}

chrome.runtime.onInstalled.addListener(function() {
	
});

chrome.tabs.onUpdated.addListener(function (tabId , info) {
	if (info.status === 'complete') {

	}
});