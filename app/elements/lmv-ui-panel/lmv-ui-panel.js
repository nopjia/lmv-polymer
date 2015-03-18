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

    // hook viewer events to model properties
    _viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
      setModelProperties(event.dbIdArray[event.dbIdArray.length - 1]);
    });

    // geometry loaded

    _viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
      setModelProperties();
      setModelTree();
    });
  };

  var setModelProperties = function(nodeId) {
    if (!nodeId) {
      if (_viewer.model.getRoot()) {
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
    _viewer.getObjectTree(function(root) {
      _this.modelTree = root;
    });
  };

  Polymer("lmv-ui-panel", {
    right: false,
    collapse: false,
    domReady: function() {
      init(this);
    },
    testFunc: function(event, detail, sender) {
      console.log({event: event, detail: detail, sender: sender});
    },
    toggleShow: function() {
      this.collapse = !this.collapse;
    }
  });
})();   // closure