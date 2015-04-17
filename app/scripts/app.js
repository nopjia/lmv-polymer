(function (document) {
  "use strict";

  var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  var app = document.querySelector("#app");
  app.addEventListener("template-bound", function() {
    console.log("Polymer Template Ready");
  });

  app.url = "http://lmv.rocks/data/engineraw/0.svf";
  // app.url = "data/Displayline/output/bubble.json";
  // app.url = "data/gears/output/bubble.json";
  // app.url = "http://lmv.rocks/data/rally/1/RallyFighter2.svf";
  // app.url = "http://lmv.rocks/data/aventador/aventador.svf";
  // app.url = "http://lmv.rocks/data/racecar/Design.svf";
  // app.url = "http://lmv.rocks/data/house/Residential%20Exterior.obj.svf";
  // app.url = "http://lmv.rocks/data/tractor4/0.svf";
  // app.url = "http://lmv.rocks/data/gears/output/bubble.json";
  // app.url = "urn:dXJuOmFkc2suczM6ZGVyaXZlZC5maWxlOlZpZXdpbmdTZXJ2aWNlVGVzdEFwcC91c2Vycy9NaWNoYWVsX0hhbmAvQVZFTlRBRE9SIExQNzAwLmYzZA";

  app.url = getParameterByName("url") || app.url;

  window.NOP_APP = app;

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
