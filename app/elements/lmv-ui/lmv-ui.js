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

        if (e.layerX > this.clientWidth - PANEL_WIDTH) {
          if (elem.parentNode === this.$["right-content"])
            this.rightPanelCount--;
          this.$["left-content"].appendChild(elem);
          this.rightbar = !!this.rightPanelCount;
        }
        else if (e.layerX < PANEL_WIDTH) {
          this.$["right-content"].appendChild(elem);
          this.rightPanelCount++;
        }
      };
      this.addEventListener("drop", onDrop, true);
      this.ondragover = function(e) {
        var PANEL_WIDTH = this.$.left.clientWidth;
        if (e.layerX < PANEL_WIDTH) {
          this.rightbar = true;
          return false;
        }
        else if (e.layerX > this.clientWidth - PANEL_WIDTH) {
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

      // hook viewer events to model properties
      self.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
        self.setModelProperties(event.dbIdArray[event.dbIdArray.length - 1]);
      });

      // init 2D/3D nav tool
      // TODO_NOP: should this be handled by viewer?
      self.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.viewer.setDefaultNavigationTool(
          self.viewer.navigation.getIs2D() ? "pan" : "orbit"
        );
      });

      // property db loaded
      self.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
        self.setModelProperties();
        self.setModelTree();
        self.setDocTree();
      });

      // geometry complete
      self.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
        self.setRenderStats();
        self.hasAnimation = !!self.viewer.model.myData.animations;
      });
    },

    // setup functions

    setModelProperties: function(nodeId) {
      if (!nodeId) {
        if (this.viewer.model.myData.instanceTree) {
          nodeId = this.viewer.model.getRootId();
        }
        else {
          this.modelProperties = undefined;
          return;
        }
      }
      var self = this;
      this.viewer.getProperties(nodeId, function(result) {
        self.modelProperties = result.properties;
      });
    },

    setModelTree: function() {
      this.modelTree = this.viewer.model.myData.instanceTree;
    },

    setDocTree: function() {
      if (!this.viewerDom.doc)
        return;
      this.docTree = this.viewerDom.doc.getRootItem();
      this.docName = this.docTree.children[0].name;
    },

    setRenderStats: function() {
      var modelData = this.viewer.impl.model.myData;
      this.renderStats = [];
      this.renderStats.push(["Meshes", modelData.meshCount]);
      this.renderStats.push(["Instanced Polys", modelData.instancePolyCount.toLocaleString()]);
      this.renderStats.push(["Geometry Polys", modelData.geomPolyCount.toLocaleString()]);
      this.renderStats.push(["Geometry Size", (modelData.geomMemory / (1024*1024)).toFixed(2) + " MB"]);
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

    closeRight: function() {
      var self = this;
      Array.prototype.forEach.call(this.$["right-content"].children, function(elem) {
        self.$["left-content"].appendChild(elem);
      });
      self.rightbar = false;
      self.rightPanelCount = 0;
    }
  });
})();   // closure