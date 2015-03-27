(function () {

  function initializeViewer(parentDom, callback) {

    var avp = Autodesk.Viewing.Private;

    // config3d

    var config3d = {};
    var canvasConfig = avp.getParameterByName("canvasConfig");
    if (canvasConfig) {
      config3d.canvasConfig = JSON.parse(canvasConfig);
    }

    var docStructureConfig = avp.getParameterByName("docConfig");
    if (docStructureConfig) {
      config3d.docStructureConfig = JSON.parse(docStructureConfig);
    }

    var extensions = config3d.extensions || [];
    extensions.push("Autodesk.Viewing.Collaboration");
    // extensions.push("Autodesk.Viewing.RemoteControl");
    // extensions.push("Autodesk.Viewing.Section");
    // extensions.push("Autodesk.Measure");
    config3d.extensions = extensions;

    config3d.screenModeDelegate = Autodesk.Viewing.ApplicationScreenModeDelegate;

    // VIEWER INIT

    var options = {};
    // options.svf = svf;
    // options.documentId = documentId;
    // options.env = "Local";   // TODO_NOP: needed?

    var viewer = new Autodesk.Viewing.Viewer3D(parentDom, config3d);

    Autodesk.Viewing.Initializer(options, function() {
      viewer.start();
      callback(viewer);
    });

    return viewer;
  }

  Polymer("lmv-viewer", {
    ready: function() {
      console.log("url:" +this.url);
      var self = this;
      this.viewer = initializeViewer(this.shadowRoot, function() {
        if (self.svfurl)
          self.viewer.load(self.svfurl);
        else if (self.docurl)
          self.loadDocument(self.docurl);
        else
          console.log("Nothing to load");
      });

      // hardcode settings
      this.viewer.prefs.set("clickToSetCOI", false);
    },
    loadSVF: function(url) {
      this.viewer.load(url);
    },
    loadDocument: function(docId, initialItemId) {
      var self = this;
      Autodesk.Viewing.Document.load(docId,
        function(doc, errors) { // onLoadCallback
          if (errors && errors.length > 0)
            console.log(errors);
          var geometryItems = [];
          if(initialItemId) {
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {"guid":initialItemId}, true);
          }
          else if (geometryItems.length === 0) {
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {"type":"geometry", "role":"3d"}, true);
          }
          if (geometryItems.length > 0) {
            self.viewer.load(doc.getViewablePath(geometryItems[0]));
            self.doc = doc;
          }
          else {
            console.log("Did not load anything from document");
          }
        },
        function(errorCode, errorMsg, errors) { // onErrorCallback
          console.log({errorCode:errorCode, errorMsg:errorMsg, errors:errors});
        }
      );
    }
  });

})();   // closure