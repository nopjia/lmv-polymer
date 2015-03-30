(function (document) {
  "use strict";

  var getParameterByName = function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  var app = document.querySelector("#app");
  app.addEventListener("template-bound", function() {
    console.log("Polymer Template Ready");
  });

  app.svfURL = getParameterByName("svf");
  app.docURL = getParameterByName("doc");

  if (!app.svfURL && !app.docURL) {
    app.svfURL = "data/engineraw/0.svf";
    // app.docURL = "data/Displayline/output/bubble.json";
    // app.docURL = "data/gears/output/bubble.json";
  }

  window.NOP_APP = app;

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));