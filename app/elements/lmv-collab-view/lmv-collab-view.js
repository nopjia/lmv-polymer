(function() {
  var _rtc;
  var _viewerDom;
  var _viewer;
  var _this;


  // RTC connection

  var Rtc = function(viewer) {
    var scope = this;

    this.join = function(sessionId) {
      scope.client = Autodesk.Viewing.Private.MessageClient.GetInstance();
      scope.presenceChannelId = window.location.host;
      if (!scope.client.isConnected()) {
        scope.client.connect(sessionId);
        console.log("WebView RTC connect to session: " + sessionId);
      }

      scope.viewtx = new Autodesk.Viewing.Extensions.Collaboration.ViewTransceiver(scope.client);
      scope.interceptor = new Autodesk.Viewing.Extensions.Collaboration.InteractionInterceptor(scope.viewtx);

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


  // RTC events

  // TODO_NOP: /nick chat?

  var onChatReceived = function(e) {
    if (e.channelId && e.channelId !== _rtc.viewtx.channelId)
      return;

    var chatMsg = e.data.msg;
    var chatterId = e.data.from;
    var chatUser = _rtc.client.getUserById(e.data.from, e.channelId);

    var userTag = "";
    if (chatterId !== _this.lastChatterId) {
      userTag = "<span class=user-msg>"+chatUser.name+"</span>";
      _this.lastChatterId = chatterId;
    }

    _this.$.chats.innerHTML += userTag + chatMsg + "<br>";
    _this.$.chats.scrollTop = _this.$.chats.scrollHeight;
  };

  var onUserListChange = function(e) {
    if (e.channelId && e.channelId !== _rtc.viewtx.channelId)
      return;
    var ci = _rtc.client.getChannelInfo(_rtc.viewtx.channelId);
    if (!ci)
      return;

    var users = ci.users;
    var htmlString = "";
    for (var i=0; i<users.length; i++) {
      htmlString += "<div class=user uid="+users[i].id+">"+users[i].name+"</div>";
    }
    _this.$.users.innerHTML = htmlString;
  };

  var onControlChange = function(e) {
    if (e.channelId && e.channelId !== _rtc.viewtx.channelId)
      return;

    var lastId = e.data.lastInControl;
    var userDoms = _this.$.users.children;
    for (var i=0; i<userDoms.length; i++) {
      if (userDoms[i].getAttribute("uid") === lastId) {
        userDoms[i].classList.add("active");
      }
      else {
        userDoms[i].classList.remove("active");
      }
    }
  };


  // Polymer

  Polymer({
    connected: false,
    username: undefined,
    lastChatterId: undefined,
    created: function() {
      _this = this;
    },
    onStart: function(e) {
      e.preventDefault();

      if (!this.username) return;

      Autodesk.Viewing.Private.setUserName(this.username);

      // grab viewer reference
      _viewerDom = document.querySelector("lmv-viewer");
      if (_viewerDom) _viewer = _viewerDom.viewer;

      // TODO_NOP: arbitrary session id for now
      var sessionId = window.location.origin + "|" + _viewerDom.url;

      _rtc = new Rtc(_viewer);
      _rtc.join(sessionId);
      _rtc.client.addEventListener("userListChange", onUserListChange);
      _rtc.client.addEventListener("chatReceived", onChatReceived);
      _rtc.viewtx.addEventListener("controlChange", onControlChange);

      this.$.users.innerHTML = "";
      this.$.chats.innerHTML = "";

      this.connected = true;
    },
    onChatSubmit: function(e) {
      e.preventDefault();
      if (!this.$.chatbox.value) return;
      _rtc.client.sendChatMessage(this.$.chatbox.value, _rtc.viewtx.channelId);
      this.$.chatbox.value = "";
    }
  });

})(); // closure