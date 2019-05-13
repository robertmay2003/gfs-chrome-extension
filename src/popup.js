// JS to run in your popup
function urlDomain(url) {
  console.log('url: ' + url);
  let a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function loadData(sites) {
  let siteList = $('#siteList');
  siteList.empty();

  for (let i = 0; i < sites.length; i++) {
    let li = $('<li/>')
      .addClass('blockedSiteLi')
      .text(sites[i])
      .appendTo(siteList);

    console.log(sites[i]);
  }
}

function blockSite(){
  let input = document.getElementById('inputWebsite');
  let val = urlDomain(input.value);

  chrome.storage.local.get(['gfsBlockedSites'], (result)=>{
    let blockedSites = result.gfsBlockedSites || [];
    blockedSites.push(val);

    loadData(blockedSites);

    chrome.storage.local.set({gfsBlockedSites: blockedSites})
  })
}

window.requestAnimationFrame(()=>{
  chrome.storage.local.get(['gfsBlockedSites'], (result)=>{
    loadData(result.gfsBlockedSites || []);
  });

  $('#inputButton').click(blockSite);
});

