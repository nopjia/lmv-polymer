(function () {
  var _viewer;

  Polymer({
    loadProgress: 0,

    domReady: function() {
      // grab viewer reference
      var viewerDom = document.querySelector("lmv-viewer");
      if (viewerDom) _viewer = viewerDom.viewer;
      if (!_viewer) return;

      var self = this;
      _viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, function(event) {
        self.loadProgress = event.percent;
      });
      _viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
        self.hasAnimation = !!_viewer.model.myData.animations;
      });
    }
  });
})();