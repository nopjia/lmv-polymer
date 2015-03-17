(function () {
  var _viewerDom, _viewer;

  Polymer("lmv-ui-panel", {
    right: false,
    collapse: false,
    domReady: function() {
      _viewerDom = document.querySelector("lmv-viewer");
      if (!_viewerDom) {
        console.log("ERROR: Cannot find lmv-viewer element");
        return;
      }
      _viewer = _viewerDom.viewer;
    },
    testFunc: function(event, detail, sender) {
      console.log({event: event, detail: detail, sender: sender});
    },
    toggleShow: function() {
      this.collapse = !this.collapse;
    }
  });
})();   // closure