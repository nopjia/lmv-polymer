(function () {
  var _viewer;

  Polymer({
    domReady: function() {
      // grab viewer reference
      var viewerDom = document.querySelector("lmv-viewer");
      if (viewerDom) _viewer = viewerDom.viewer;

      var self = this;
      if (_viewer) _viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
        self.aa = _viewer.prefs.antialiasing;
        self.ssao = _viewer.prefs.ambientShadows;
        self.shadows = _viewer.prefs.groundShadow;
        self.reflections = _viewer.prefs.groundReflection;
        self.cel = _viewer.prefs.celShaded;

        var avp = Autodesk.Viewing.Private;
        self.envlist = [];
        for (var i=0; i<avp.LightPresets.length; i++) {
          self.envlist.push({
            value: i, label: avp.LightPresets[i].name
          });
        }
        self.env = _viewer.impl.currentLightPreset();

        self.exposure = _viewer.impl.renderer().getExposureBias();
        self.fov = _viewer.getFOV();
        self.ortho = false;  // TODO_NOP: this.ortho get
      });
    },

    envChanged: function() {
      _viewer.setLightPreset(this.env);
    },
    aaChanged: function() {
      _viewer.setQualityLevel(this.ssao, this.aa);
    },
    ssaoChanged: function() {
      _viewer.setQualityLevel(this.ssao, this.aa);
    },
    shadowsChanged: function() {
      _viewer.setGroundShadow(this.shadows);
    },
    reflectionsChanged: function() {
      _viewer.setGroundReflection(this.reflections);
    },
    celChanged: function() {
      _viewer.impl.toggleCelShading(this.cel);  // TODO_NOP: messes with ssao settings
    },
    exposureChanged: function() {
      _viewer.impl.setTonemapExposureBias(this.exposure, 0);
    },
    fovChanged: function() {
      _viewer.setFOV(this.fov);
    },
    orthoChanged: function() {
      if (this.ortho)
        _viewer.navigation.toOrthographic();
      else
        _viewer.navigation.toPerspective();
    },

  });
})();