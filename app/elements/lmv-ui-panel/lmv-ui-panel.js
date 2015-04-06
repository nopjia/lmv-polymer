(function () {
  var _viewerDom, _viewer;
  var _this;  // NOP_NOTE: "_this" dangerous

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
      console.log("ERROR: Cannot find viewer from lmv-viewer element");
      return;
    }

    // hook viewer events to model properties
    _viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
      setModelProperties(event.dbIdArray[event.dbIdArray.length - 1]);
    });

    // init 2D/3D nav tool
    // TODO_NOP: should this be handled by viewer?
    _viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
      _viewer.setDefaultNavigationTool(
        _viewer.navigation.getIs2D() ? "pan" : "orbit"
      );
    });

    // property db loaded
    _viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
      setModelProperties();
      setModelTree();
      setDocTree();
    });

    // geometry complete
    _viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
      setRenderStats();
      _this.hasAnimation = !!_viewer.model.myData.animations;
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

  var setDocTree = function() {
    if (!_viewerDom.doc)
      return;
    _this.docTree = _viewerDom.doc.getRootItem();
    _this.docName = _this.docTree.children[0].name;
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
      if (!this.fullscreen) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        this.fullscreen = true;
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
        this.fullscreen = false;
      }
    },
    takeScreenshot: function() {
      window.open(_viewer.getScreenShot(),
        "Screenshot",
        "width="+_viewer.canvas.clientWidth+" "+
        "height="+_viewer.canvas.clientHeight+" "+
        "scrollbars=no, resizable=yes");
    }
  });
})();   // closure