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
    // extensions.push("Autodesk.Viewing.FusionOrbit");
    // extensions.push("Autodesk.Section");
    // extensions.push("Autodesk.Measure");
    config3d.extensions = extensions;

    config3d.screenModeDelegate = Autodesk.Viewing.ApplicationScreenModeDelegate;

    // VIEWER INIT

    var options = {};
    // options.svf = svf;
    // options.documentId = documentId;
    // options.env = "Local";   // TODO_NOP: how?
    options.shouldInitializeAuth = true;

    var viewer = new Autodesk.Viewing.Viewer3D(parentDom, config3d);

    Autodesk.Viewing.Initializer(options, function() {
      viewer.start();
      callback(viewer);
    });

    return viewer;
  }

  Polymer("lmv-viewer", {
    url: undefined,     // url to load
    svfUrl: undefined,  // url of svf loaded in viewer, to check if already loaded
    initialized: false,

    ready: function() {
      var self = this;
      this.viewer = initializeViewer(this.shadowRoot, function() {
        self.initialized = true;
        if (self.url)
          self.loadUrl(self.url);
        else
          console.log("No URL given");
      });

      // hardcode settings
      this.viewer.prefs.set("clickToSetCOI", false);
    },

    urlChanged: function() {
      this.loadUrl(this.url);
    },

    /**
     * Load URL, handles both svf and bubble.json document
     * Performs http request to check Content-Type
     */
    loadUrl: function(url) {
      if (!this.initialized) {
        console.log("Viewer not yet initialized. URL will load once it is.");
        return;
      }

      if (url.indexOf("urn:") === 0) {
        this.loadDocument(url);
        return;
      }

      var self = this;
      var req = new XMLHttpRequest();
      req.onerror = function() {
        console.log("Error: request error on " + url);
        return;
      };
      req.onload = function() {
        if (this.status !== 200)
          return this.onerror();

        var contentType = this.getResponseHeader("Content-Type");
        if (contentType === "application/json") {
          console.log("Load URL: JSON document");
          self.loadDocument(url);
        }
        else {
          console.log("Load URL: non-document format");
          self.loadModel(url);
        }
        self.url = url;
      };
      req.open("HEAD", url, true);
      req.send();
    },

    /**
     * Load SVF file. Wrapper around Viewer3D.loadModel() with additional checking and states
     */
    loadModel: function(url, sharedDbPath) {
      if (url === this.svfUrl) {
        console.log("Already loaded: " + url);
        return;
      }
      this.viewer.loadModel(url, undefined, sharedDbPath);
      this.svfUrl = url;
      console.log("Load model: " + url);
    },

    /**
     * Load bubble.json document
     */
    loadDocument: function(url, initialItemId) {
      var self = this;
      Autodesk.Viewing.Document.load(url,
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
            var url = doc.getViewablePath(geometryItems[0]);
            self.loadModel(url);
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