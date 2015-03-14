(function (document) {
  "use strict";

  var app = document.querySelector("#app");
  app.addEventListener("template-bound", function() {
    console.log("Polymer Template Ready");
  });
  app.title = "LMV Polymer";
  app.fileURL = "data/engineraw/0.svf";
  window.NOP_APP = app;

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
