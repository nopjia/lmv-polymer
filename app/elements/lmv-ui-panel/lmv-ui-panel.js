(function () {
  var _this;
  var _viewerDom, _viewer;

  var init = function(self) {
    _this = self;

    // viewer setup

    _viewerDom = document.querySelector("lmv-viewer");
    if (!_viewerDom) {
      console.log("ERROR: Cannot find lmv-viewer element");
      return;
    }
    _viewer = _viewerDom.viewer;
    if (!_viewer) {
      console.log("ERROR: Cannot find lmv-viewer element");
      return;
    }

    // hook viewer events to model properties
    _viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
      setModelProperties(event.dbIdArray[event.dbIdArray.length - 1]);
    });

    // property db loaded
    _viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
      setModelProperties();
      setModelTree();
    });

    // geometry complete
    _viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
      setRenderStats();
    });
  };

  var setModelProperties = function(nodeId) {
    if (!nodeId) {
      if (_viewer.model.myData.instanceTree) {
        nodeId = _viewer.model.getRootId();
      }
      else {
        _this.modelProperties = undefined;
        return;
      }
    }
    _viewer.getProperties(nodeId, function(result) {
      _this.modelProperties = result.properties;
    });
  };

  var setModelTree = function() {
    _this.modelTree = _viewer.model.myData.instanceTree;
  };

  var setRenderStats = function() {
    var modelData = _viewer.impl.model.myData;
    _this.renderStats = [];
    _this.renderStats.push(["Meshes", modelData.meshCount]);
    _this.renderStats.push(["Instanced Polys", modelData.instancePolyCount.toLocaleString()]);
    _this.renderStats.push(["Geometry Polys", modelData.geomPolyCount.toLocaleString()]);
    _this.renderStats.push(["Geometry Size", (modelData.geomMemory / (1024*1024)).toFixed(2) + " MB"]);
  };

  Polymer("lmv-ui-panel", {
    publish: {
      right: { value:false, reflect:true },
      collapse: { value:false, reflect:true },
    },
    domReady: function() {
      init(this);
    },
    testFunc: function(event, detail, sender) {
      console.log({event: event, detail: detail, sender: sender});
    },
    toggleShow: function() {
      this.collapse = !this.collapse;
    },
    toggleFullScreen: function() {
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  });
})();   // closure