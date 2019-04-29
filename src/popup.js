// JS to run in your popup
function urlDomain(url) {
  let a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function loadData(sites) {
  let siteList = $('#siteList')
  siteList.empty();

  for (let i = 0; i < sites.length; i++) {
    let li = $('<li/>')
      .addClass('blockedSiteLi')
      .html(sites[i])
      .appendTo(siteList)
  }
}

function blockTab(){
  let input = document.getElementById('inputButton');
  let val = urlDomain(input.value);

  chrome.storage.local.get(['blockedSites'], (result)=>{
    let blockedSites = result.blockedSites || [];
    blockedSites.push(val);

    loadData(blockedSites);

    chrome.storage.local.set({blockedSites: blockedSites})
  })
}

window.requestAnimationFrame(()=>{
  chrome.storage.local.get(['blockedSites'], (result)=>{
    loadData(result.blockedSites);
  })
})

