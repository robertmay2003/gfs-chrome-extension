window.requestAnimationFrame(() => {
  var div = document.createElement('div');
  var timeActive = document.createElement('p');
  var timeInactive = document.createElement('p');
  var totalBar = document.createElement('div');
  var activeBar = document.createElement('div');
  var inactiveBar = document.createElement('div');
  div.id = 'gfsInformationDiv';
  timeActive.id = 'gfsTimeActive';
  timeInactive.id = 'gfsTimeInactive';
  totalBar.id = 'gfsTotalBar';
  activeBar.id = 'gfsActiveBar';
  inactiveBar.id = 'gfsInactiveBar';
  // Lots o vars
  document.body.appendChild(div);

  div.addEventListener('mouseover', function(){
    interval = setInterval(function() {
      // Gets active and inactive time from background.js
      chrome.runtime.sendMessage({request: 'tabData'});

      chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.purpose === 'tabData') {
          window.data = request.data;
        }
      });
      timeActive.innerHTML = ((window.data.timeActive)/1000).toString() + " secs";
      timeInactive.innerHTML = ((window.data.timeInactive)/1000).toString() + " secs";

      // Making the bar
      var time = (window.data.timeActive)/1000 + (window.data.timeInactive)/1000;

      // Simple math to calculate percentages
      var percentageActive = (((window.data.timeActive)/1000)/time)*100;
      var percentageInactive = (((window.data.timeInactive)/1000)/time)*100;

      // We need to apply the widths to our elements
      timeActive.style.display = "block";
      timeInactive.style.display = "block";
      totalBar.style.display = "block";
      activeBar.style.display = "block";
      inactiveBar.style.display = "block";
      document.getElementById('gfsActiveBar').style.width = percentageActive.toString()+'%';
      document.getElementById('gfsInactiveBar').style.width = percentageInactive.toString()+'%';
      console.log(document.getElementById('gfsInactiveBar').style.width);
    });

  // Appending to body
    div.appendChild(timeActive);
    div.appendChild(timeInactive);
    totalBar.appendChild(activeBar);
    totalBar.appendChild(inactiveBar);
    div.appendChild(totalBar)

  }, 50);

  div.addEventListener('mouseout', function () {
            clearInterval(interval);
            timeActive.style.display = "none";
            timeInactive.style.display = "none";
            totalBar.style.display = "none";
            activeBar.style.display = "none";
            inactiveBar.style.display = "none";
  });
	// Run this code in the actual page
	// can be run manually by popup.js or automatically on page load through manifest.json
});
