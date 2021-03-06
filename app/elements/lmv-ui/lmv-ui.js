(function () {

  function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if(parent.lastchild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  }

  Polymer({
    showleft: true,
    showright: false,
    rightPanelCount: 0, // only for showing the x close button

    // initialize

    domReady: function() {
      var self = this;

      // setup panels drag drop

      var onPanelDragStart = function(e) {
        var rect = this.getBoundingClientRect();
        e.dataTransfer.setDragImage(this, e.clientX-rect.left, e.clientY-rect.top);
        e.dataTransfer.setData("text/plain", e.target.header);
      };
      Array.prototype.forEach.call(this.$.main.querySelectorAll("lmv-panel"), function(elem) {
        elem.$.header.draggable = true;
        elem.addEventListener("dragstart", onPanelDragStart);
      });

      var onDrop = function(e) {
        var name = e.dataTransfer.getData("text/plain");
        var panel = self.$.main.querySelector("lmv-panel[header='"+name+"']");
        var parent = this;

        // rearrange panels
        var inserted = false;
        for (var i=0; i<parent.children.length; i++) {
          var child = parent.children[i];
          if (e.clientY > child.offsetTop && e.clientY < child.offsetTop+child.offsetHeight) {
            if (e.clientY < child.offsetTop+child.offsetHeight/2)
              parent.insertBefore(panel, child);
            else
              insertAfter(panel, child);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          parent.appendChild(panel);
        }

        // update count
        self.rightPanelCount = self.$["right-content"].children.length;

        e.preventDefault();
        return false;
      };
      this.$["left-content"].addEventListener("drop", onDrop);
      this.$["right-content"].addEventListener("drop", onDrop);

      // animate right bar open/close
      this.ondragover = function() {
        this.showright = true;
      };
      this.ondragend = function() {
        this.showright = !!this.$["right-content"].children.length || false;
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

      // load progress
      this.viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT, function(event) {
        self.loadProgress = event.percent;
      });

      // init 2D/3D nav tool
      // TODO_NOP: should this be handled by viewer?
      this.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, function() {
        self.viewer.setDefaultNavigationTool(
          self.viewer.navigation.getIs2D() ? "pan" : "orbit"
        );
      });

      // property db loaded
      this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
        self.docName = self.viewerDom.doc ? self.viewerDom.doc.getRootItem().children[0].name : undefined;
      });

      // geometry complete
      this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function() {
        // set render stats
        var geomList = self.viewer.impl.modelQueue().getGeometryList();
        self.renderStats = [];
        self.renderStats.push(["Meshes",          geomList.geoms.length]);
        self.renderStats.push(["Fragments",       self.viewer.impl.modelQueue().getFragmentList().getCount()]);
        self.renderStats.push(["Instanced Polys", geomList.instancePolyCount.toLocaleString()]);
        self.renderStats.push(["Geometry Polys",  geomList.geomPolyCount.toLocaleString()]);
        self.renderStats.push(["Geometry Size",   (geomList.geomMemory/(1024*1024)).toFixed(2) + " MB"]);
        self.renderStats.push(["Load time",       (self.viewer.impl.svfloader.loadTime/1000).toFixed(2) + " s"]);
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
      self.showright = false;
      self.rightPanelCount = 0;
    }
  });
})();   // closure