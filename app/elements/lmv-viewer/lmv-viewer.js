(function () {

  var avp = Autodesk.Viewing.Private;

  function initializeViewer(parentDom, svf, documentId) {

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
    extensions.push("Autodesk.Viewing.Section");
    extensions.push("Autodesk.Viewing.Collaboration");
    extensions.push("Autodesk.Viewing.RemoteControl");
    extensions.push("Autodesk.Measure");
    config3d.extensions = extensions;

    config3d.screenModeDelegate = Autodesk.Viewing.ApplicationScreenModeDelegate;

    // VIEWER INIT

    var viewer = new Autodesk.Viewing.Viewer3D(parentDom, config3d);

    // LOAD FILE

    var options = {};
    options.svf = svf;
    options.documentId = documentId;

    if (svf && svf.indexOf("urn:") === -1) {
      // Load local svf file.
      options.env = "Local";
      Autodesk.Viewing.Initializer(options, function(){viewer.start();viewer.load(svf);});
    }
    else if (svf && svf.indexOf("urn:") === 0) {
      // Load remote svf file through viewing service.
      Autodesk.Viewing.Initializer(options, function(){viewer.start();viewer.load(svf);});
    }
    else if (documentId && documentId.indexOf("urn:") === -1) {
      // Load local document.
      viewer.start();
      loadDocument(viewer, documentId);
    }
    else {
      console.log("Nothing to load");
    }

    return viewer;
  }

  //Used for loading models hosted inside "bubbles" in the viewing service.
  function loadDocument(viewer, documentId, initialItemId) {
    // Load the document.  Once loaded, find the item requested.
    // If not found, just find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(documentId,
      function(document, errors) { // onLoadCallback
        if (errors)
          console.log(errors);

        var geometryItems = [];

        if(initialItemId) {
          geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {"guid":initialItemId}, true);
        }

        if(geometryItems.length === 0) {
          geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {"type":"geometry", "role":"3d"}, true);
        }

        if(geometryItems.length > 0) {
          viewer.load(document.getViewablePath(geometryItems[0]));
        }
      },
      function(errorCode, errorMsg, errors ) { // onErrorCallback
        console.log(errorCode);
        console.log(errorMsg);
        console.log(errors);
      }
    );
  }

  Polymer("lmv-viewer", {
    ready: function() {
      console.log("url:" +this.url);
      this.viewer = initializeViewer(this.$.wrapper, this.url);
      this.fire("viewerReady", this.viewer);
    }
  });

})();   // closure