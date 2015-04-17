(function () {
  Polymer({
    domReady: function() {
      // grab viewer reference
      var viewerDom = document.querySelector("lmv-viewer");
      if (viewerDom) this.viewer = viewerDom.viewer;

      var self = this;
      if (this.viewer) this.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.aa = self.viewer.prefs.antialiasing;
        self.ssao = self.viewer.prefs.ambientShadows;
        self.shadows = self.viewer.prefs.groundShadow;
        self.reflections = self.viewer.prefs.groundReflection;
        self.cel = self.viewer.prefs.celShaded;

        var avp = Autodesk.Viewing.Private;
        self.envlist = [];
        for (var i=0; i<avp.LightPresets.length; i++) {
          self.envlist.push({
            value: i, label: avp.LightPresets[i].name
          });
        }
        self.env = self.viewer.impl.currentLightPreset();

        self.exposure = self.viewer.impl.renderer().getExposureBias();
        self.fov = Math.round(self.viewer.getFOV());
        self.ortho = !self.viewer.getCamera().isPerspective;
        self.explode = 0.0;
      });
    },

    envChanged: function() {
      if (this.env !== this.viewer.impl.currentLightPreset())
        this.viewer.setLightPreset(this.env);
    },
    aaChanged: function() {
      this.viewer.setQualityLevel(this.ssao, this.aa);
    },
    ssaoChanged: function() {
      this.cel = this.cel && !this.ssao;
      this.viewer.setQualityLevel(this.ssao, this.aa);
    },
    shadowsChanged: function() {
      this.viewer.setGroundShadow(this.shadows);
    },
    reflectionsChanged: function() {
      this.viewer.setGroundReflection(this.reflections);
    },
    celChanged: function() {
      this.ssao = !this.cel;
      this.viewer.impl.toggleCelShading(this.cel);
    },
    exposureChanged: function() {
      this.viewer.impl.setTonemapExposureBias(this.exposure, 0);
    },
    fovChanged: function() {
      this.viewer.setFOV(this.fov);
    },
    orthoChanged: function() {
      if (this.ortho)
        this.viewer.navigation.toOrthographic();
      else
        this.viewer.navigation.toPerspective();
    },
    explodeChanged: function() {
      this.viewer.explode(this.explode);
    }

  });
})();