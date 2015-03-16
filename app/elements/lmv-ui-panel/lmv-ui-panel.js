(function () {
  var _viewerDom, _viewer;

  Polymer("lmv-ui-panel", {
    domReady: function() {
      _viewerDom = document.querySelector("lmv-viewer");
      if (!_viewerDom) {
        console.log("ERROR: Cannot find lmv-viewer element");
        return;
      }
      _viewer = _viewerDom.viewer;
    }
  });
})();   // closure