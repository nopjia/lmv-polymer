(function (document) {
  "use strict";

  var app = document.querySelector("#app");
  app.addEventListener("template-bound", function() {
    console.log("Polymer Template Ready");
  });
  // app.svfURL = "data/engineraw/0.svf";
  app.docURL = "data/Displayline/output/bubble.json";
  // app.docURL = "data/gears/output/bubble.json";
  window.NOP_APP = app;

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));