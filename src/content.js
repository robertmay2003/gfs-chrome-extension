window.requestAnimationFrame(() => {
  var div = document.createElement("div");
  div.id = "gfsInformationDiv";
  div.innerHTML = "Hello";
  document.body.appendChild(div);
	// Run this code in the actual page
	// can be run manually by popup.js or automatically on page load through manifest.json
  console.log('div:', div);
});
