
var opentok = new opentok.OpenTok(46465442, db64a8d6c002d17bf3387ec0c112ce4ff649c57c);
var sessionId;
opentok.createSession({mediaMode:"routed"}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {
    sessionId = session.sessionId;
    console.log("Session ID: " + sessionId);
  }
});
var opentok = new opentok.OpenTok(46465442,  db64a8d6c002d17bf3387ec0c112ce4ff649c57c);
var sessionId;
opentok.createSession({mediaMode:"relayed"}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {
    sessionId = session.sessionId;
    console.log("Session ID: " + sessionId);
  }
});
var opentok = new OpenTok(46465442, db64a8d6c002d17bf3387ec0c112ce4ff649c57c);

//Generate a basic session. Or you could use an existing session ID.
var sessionId;
opentok.createSession({}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {
    sessionId = session.sessionId;
    console.log("Session ID: " + sessionId);
  }
});

var token = opentok.generateToken(sessionId);
var opentok = new OpenTok(46465442, db64a8d6c002d17bf3387ec0c112ce4ff649c57c);

//Generate a basic session. Or you could use an existing session ID.
var sessionId;
var token
opentok.createSession({}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {
    sessionId = session.sessionId;
    console.log("Session ID: " + sessionId);}});