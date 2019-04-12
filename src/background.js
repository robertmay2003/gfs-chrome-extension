// Background stuff here

chrome.runtime.onInstalled.addListener(function() {

});
let global{
	count:0,
}
chrome.tabs.onUpdated.addListener(function (tabId , info) {
	if (info.status === 'complete') {
		global.count = global.count + 1;
		if (global.count === 2) {
			let d{
				date()
			}
		}


	}
});
