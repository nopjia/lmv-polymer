(function () {
  Polymer({
    leftbar: true,
    rightbar: false,
    rightPanelCount: 0,


    // initialize

    domReady: function() {

      // setup panels drag drop

      var onPanelDragStart = function(e) {
        e.dataTransfer.setDragImage(this, e.layerX, e.layerY);
        e.dataTransfer.setData("text/plain", e.target.header);
      };
      Array.prototype.forEach.call(this.$.main.querySelectorAll("lmv-panel"), function(elem) {
        elem.$.header.draggable = true;
        elem.addEventListener("dragstart", onPanelDragStart);
      });

      var onDrop = function(e) {
        var name = e.dataTransfer.getData("text/plain");
        var elem = this.$.main.querySelector("lmv-panel[header='"+name+"']");

        var PANEL_WIDTH = this.$.left.clientWidth;

        if (e.layerX < PANEL_WIDTH) {
          this.movePanelToRight(elem);
        }
        else if (e.layerX > this.clientWidth - PANEL_WIDTH) {
          this.movePanelToLeft(elem);
        }
      };
      this.addEventListener("drop", onDrop, true);
      this.ondragover = function(e) {
        var PANEL_WIDTH = this.$.left.clientWidth;
        if (e.layerX < PANEL_WIDTH) {    // hover right
          this.rightbar = true;
          return false;
        }
        else if (e.layerX > this.clientWidth-PANEL_WIDTH) {  // hover left
          this.leftbar = true;
          this.rightbar = !!this.rightPanelCount || false;
          return false;
        }
        else {
          this.rightbar = !!this.rightPanelCount || false;
        }
      };


      // grab viewer reference

      this.viewerDom = this.querySelector("lmv-viewer");
      if (!this.viewerDom) {
        console.log("ERROR: Cannot find lmv-viewer element");
        return;
      }
      this.viewer = this.viewerDom.viewer;
      if (!this.viewer) {
        console.log("ERROR: Cannot find viewer from lmv-viewer element");
        return;
      }


      // hook up to viewer events

      var self = this;

      // init 2D/3D nav tool
      // TODO_NOP: should this be handled by viewer?
      self.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.viewer.setDefaultNavigationTool(
          self.viewer.navigation.getIs2D() ? "pan" : "orbit"
        );
      });

      // property db loaded
      self.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
        self.docName = self.viewerDom.doc ? self.viewerDom.doc.getRootItem().children[0].name : undefined;
      });

      // geometry complete
      self.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
        // check animation
        self.hasAnimation = !!self.viewer.impl.model.myData.animations;

        // set render stats
        self.renderStats = [];
        self.renderStats.push(["Meshes",          self.viewer.impl.modelQueue().getGeometryList().geoms.length]);
        self.renderStats.push(["Fragments",       self.viewer.impl.modelQueue().getFragmentList().getCount()]);
        self.renderStats.push(["Instanced Polys", self.viewer.impl.modelQueue().getGeometryList().instancePolyCount.toLocaleString()]);
        self.renderStats.push(["Geometry Polys",  self.viewer.impl.modelQueue().getGeometryList().geomPolyCount.toLocaleString()]);
      });
    },


    // ui functions

    fullscreenChanged: function() {
      if (this.fullscreen) {
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
    },

    takeScreenshot: function() {
      window.open(this.viewer.getScreenShot(),
        "Screenshot",
        "width="+this.viewer.canvas.clientWidth+" "+
        "height="+this.viewer.canvas.clientHeight+" "+
        "scrollbars=no, resizable=yes");
    },


    // ui drag drop

    closeRight: function() {
      var self = this;
      while(self.$["right-content"].children.length > 0) {
        self.$["left-content"].appendChild(self.$["right-content"].children[0]);
      }
      self.rightbar = false;
      self.rightPanelCount = 0;
    },
    movePanelToRight: function(panel) {
      this.$["right-content"].appendChild(panel);
      this.rightPanelCount++;
    },
    movePanelToLeft: function(panel) {
      if (panel.parentNode === this.$["right-content"]) {
        this.rightPanelCount--;
        this.rightbar = !!this.rightPanelCount;
      }
      this.$["left-content"].appendChild(panel);
    }
  });
})();   // closure