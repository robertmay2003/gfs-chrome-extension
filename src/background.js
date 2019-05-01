// Background stuff here
function updateTabData(data, callback = ()=>{}) {
	// DEV: - console.log('New data:', data);
	chrome.storage.local.set({gfsTabData: data}, callback());
}

function getTabData(callback) {
	chrome.storage.local.get(['gfsTabData'], (result)=>{callback(result)});
}

function recordLastActiveTab(tabData) {
	// Record active time for last active tab
	if (tabData.lastActiveTab) {
		let lastTab = tabData.tabs[tabData.lastActiveTab];

		lastTab.active = false;
		lastTab.timeOpen = (new Date().getTime() - lastTab.created);
		lastTab.timeActive = (lastTab.timeOpen - lastTab.timeInactive);
		lastTab.lastUpdated = (new Date().getTime());
		lastTab.lastTimeCalculation = (new Date().getTime());
	}
}

function registerAllTabs() {
	chrome.tabs.query({}, (tabs) => {
		getTabData(function (result) {
			let tabData = result.gfsTabData;
			for (let i = 0; i < tabs.length; i++) {
				let tab = tabs[i];

				let tabData = result.gfsTabData;

				/* Manipulate here */
				tabData.tabs[tab.id] = {
					active: false,
					id: tab.id,
					created: (new Date().getTime()),
					lastActive: (new Date().getTime()),
					lastTimeCalculation: (new Date().getTime()),
					timeActive: 0,
					timeInactive: 0,
					timeOpen: 0
				};
			}

			/* Once manipulation finished */
			updateTabData(tabData);
		})
	})
}

function updateAllTabData(callback) {
	getTabData( function (result) {
		let tabData = result.gfsTabData;

		/* Manipulate here */

		// Set active tab
		for (let tabId in tabData.tabs) {
			tabData.lastActiveTab = tabId;
			let tab = tabData.tabs[tabId];

			tab.timeInactive += tab.active ? 0 : (new Date().getTime() - tab.lastTimeCalculation);
			tab.timeOpen = (new Date().getTime() - tab.created);
			tab.timeActive = (tab.timeOpen - tab.timeInactive);
			tab.lastTimeCalculation = new Date().getTime();
		}

		/* Once manipulation finished */
		updateTabData(tabData);
		callback()
	})
}

function onTabUpdate(tabId , info) {
	// DEV: - console.log(`At: ${new Date().getTime()}`);
	if (info.status === 'complete') {
		getTabData( function(result) {
			let tabData = result.gfsTabData;
			// DEV: - console.log(`${tabData.lastActiveTab} -> ${tabId}`);

			/* Manipulate here */

			// Record active time for last active tab
			recordLastActiveTab(tabData);

			// Set active tab
			if (tabData.lastActiveTab !== tabId) {
				let tab = tabData.tabs[tabId];

				if (!tab) {
					console.log(tabData, tabId);
					return;
				}

				tab.timeInactive += (new Date().getTime() - tab.lastTimeCalculation);
				tab.timeOpen = (new Date().getTime() - tab.created);
				tab.timeActive = (tab.timeOpen - tab.timeInactive);
				tab.lastUpdated = (new Date().getTime());
				tab.lastTimeCalculation = (new Date().getTime());

				tabData.tabs[tabId].active = true;
			}

			// DEV: - console.log(tabData);
			tabData.lastActiveTab = tabId;
			/* Once manipulation finished */
			updateTabData(tabData);
		})
	}
}

function onTabSelect(activeInfo) {
	onTabUpdate(activeInfo.tabId, {status:'complete'});
}

chrome.runtime.onInstalled.addListener(function() {
	updateTabData({tabs: {}});
	registerAllTabs();

	chrome.storage.local.set({gfsBlockedSites: []})

	// DEV: - console.log('Installed Successfully');
});

chrome.tabs.onCreated.addListener(function(tab) {
	getTabData( function (result) {
		let tabData = result.gfsTabData;

		/* Manipulate here */
		// Record last active tab
		recordLastActiveTab(tabData);

		tabData.tabs[tab.id] = {
			active: true,
			id: tab.id,
			created: (new Date().getTime()),
			lastActive: (new Date().getTime()),
			lastTimeCalculation: (new Date().getTime()),
			timeActive: 0,
			timeInactive: 0,
			timeOpen: 0
		};

		/* Once manipulation finished */
		updateTabData(tabData);
	})
});

chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.tabs.onActivated.addListener(onTabSelect);

chrome.tabs.onRemoved.addListener(function(tabId, info) {
	getTabData(function (result) {
		let tabData = result.gfsTabData;

		/* Manipulate here */

		// remove from tabData
		tabData.tabs[tabId] = null;

		/* Once manipulation finished */
		updateTabData(tabData);
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	updateAllTabData(()=>{
		getTabData((result)=>{
			var data = result.gfsTabData.tabs[sender.tab.id];
			chrome.tabs.sendMessage(sender.tab.id, {purpose: "tabData", data: data});
		})
	})
});
