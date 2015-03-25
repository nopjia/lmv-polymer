(function() {
  var _rtc;
  var _viewer;

  var Rtc = function(viewer) {
    var scope = this;

    this.join = function(sessionId) {
      scope.client = Autodesk.Viewing.Private.MessageClient.GetInstance();
      scope.presenceChannelId = window.location.host;
      if (!scope.client.isConnected()) {
        scope.client.connect(sessionId);
        console.log("WebView RTC connect to session: " + sessionId);
      }

      scope.viewtx = new Autodesk.Viewing.Private.Collaboration.ViewTransceiver(scope.client);
      scope.interceptor = new Autodesk.Viewing.Private.Collaboration.InteractionInterceptor(scope.viewtx);

      viewer.toolController.registerTool(scope.interceptor);

      scope.p2p = new Autodesk.Viewing.Private.P2PClient(scope.client);
      scope.viewtx.channelId = sessionId;
      scope.viewtx.attach(viewer);
      scope.client.join(scope.viewtx.channelId);
      console.log("join channelId " + scope.viewtx.channelId);
      viewer.toolController.activateTool(scope.interceptor.getName());

      // fixme: hack.
      scope.viewtx.takeControl();
    };

    this.leave = function() {
      scope.p2p.hangup();
      scope.viewtx.detach(viewer);
      scope.client.disconnect();
    };
  };

  Polymer({
    connected: false,
    username: undefined,
    lastChatter: undefined,
    onStart: function(e) {
      e.preventDefault();

      if (!this.$.username.value) return;

      this.username = this.$.username.value;
      this.connected = true;
      console.log(this.username + " connecting to rtc...");

      // grab viewer reference
      var viewerDom = document.querySelector("lmv-viewer");
      if (viewerDom) _viewer = viewerDom.viewer;

      // _rtc = new Rtc(_viewer);
      // _rtc.join("1");
    },
    onChat: function(e) {
      e.preventDefault();

      var chatMsg = this.$.chatter.value;
      this.$.chatter.value = "";

      if (this.username !== this.lastChatter) {
        chatMsg = "<span class=user-msg>"+this.username+"</span>"+chatMsg;
        this.username = this.lastChatter;
      }

      this.$.chats.innerHTML += chatMsg + "<br>";
      this.$.chats.scrollTop = this.$.chats.scrollHeight;
    }
  });

})(); // closure