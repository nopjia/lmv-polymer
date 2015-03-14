/*jshint -W117 */

(function () {

  var avp = Autodesk.Viewing.Private;

  function getOptionsFromQueryString() {
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

    var svfURL = avp.getParameterByName("file");
    if(!svfURL)
      svfURL = avp.getParameterByName("svf");

    // var documentId = avp.getParameterByName("document");
    // var initialItemId = avp.getParameterByName("item");
    var documentId = null;
    var initialItemId = null;

    return {
      config3d : config3d,
      documentId: documentId,
      svf: svfURL,
      initialItemId: initialItemId
    };
  }

  function initializeViewer(viewerElement, options) {

    options.config3d.screenModeDelegate = Autodesk.Viewing.ApplicationScreenModeDelegate;
    var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, options.config3d);

    var svfURL = options.svf;
    var documentId = options.documentId;

    if (svfURL && svfURL.indexOf("urn:") == -1) {
      // Load local svf file.
      options.env = "Local";
      Autodesk.Viewing.Initializer(options, function(){viewer.start();viewer.load(svfURL);});
    } else if (svfURL && svfURL.indexOf("urn:") == 0) {
      // Load remote svf file through viewing service.
      Autodesk.Viewing.Initializer(options, function(){viewer.start();viewer.load(svfURL);});
    } else if (documentId && documentId.indexOf("urn:") == -1) {
      // Load local document.
      viewer.start();
      loadDocument(viewer, documentId, options.initialItemId);
    } else {
      console.log("Nothing to load");
    }
  }

  //Used for loading models hosted inside "bubbles" in the viewing service.
  function loadDocument(viewer, documentId, initialItemId) {
    // Load the document.  Once loaded, find the item requested.
    // If not found, just find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(documentId,
      function(document, errorsandwarnings) { // onLoadCallback
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

  Polymer({
    domReady: function() {
      console.log("url:" +this.url);
      initializeViewer(
        this.$.viewer3d,
        getOptionsFromQueryString()
      );
    }
  });

})();   // closure