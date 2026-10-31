(function () {
  if (window.__presenceActive) return;
  window.__presenceActive = true;

  var SID_KEY = 'ibank_session_id';

  function getSessionId() {
    try {
      var sid = sessionStorage.getItem(SID_KEY);
      if (sid) return sid;
    } catch (e) {}
    var sid = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    try { sessionStorage.setItem(SID_KEY, sid); } catch (e) {}
    return sid;
  }

  function getCurrentPage() {
    var path = location.pathname.replace(/^\/+/, '').replace(/\.html$/, '');
    if (!path || path === '/') return 'home';
    return path;
  }

  var sessionId = getSessionId();

  function sendPresence() {
    try {
      var payload = JSON.stringify({
        session_id: sessionId,
        current_page: getCurrentPage()
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/presence', new Blob([payload], { type: 'application/json' }));
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/presence', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(payload);
      }
    } catch (e) {}
  }

  sendPresence();
  setInterval(sendPresence, 10000);
})();
