function CredentialManager() {
  this.onLogin = new Event(this);
  this.onLogout = new Event(this);
  this.onActiveProposalChanged = new Event(this);
}

CredentialManager.prototype.addCredential = function (username, roles, token, url, exiUrl, properties) {
  var tokenExpires = moment().add(3, "hour");
  var credential = new Credential(username, roles, token, url, exiUrl, [], tokenExpires, properties);
  /** Writing to ExtLocalStorage * */
  if (localStorage.getItem("credentials") == null) {
    localStorage.setItem("credentials", "[]");
  }
  var credentials = this.getCredentials();
  credentials.push(credential);
  localStorage.setItem("credentials", JSON.stringify(credentials));
  this.onLogin.notify(credential);
};

CredentialManager.prototype.credentialToObject = function (json) {
  return new Credential(
    json.username,
    json.roles,
    json.token,
    json.url,
    json.exiUrl,
    json.activeProposals,
    json.tokenExpires,
    json.properties
  );
};

CredentialManager.prototype.getCredentials = function () {
  var credentials = [];
  if (JSON.parse(localStorage.getItem("credentials")) != null) {
    credentials = JSON.parse(localStorage.getItem("credentials"));
  }
  for (var i = 0; i < credentials.length; i++) {
    credentials[i] = this.credentialToObject(credentials[i]);
  }
  return credentials;
};

/** Given a beamline name it return MX or SAXS **/
CredentialManager.prototype.getTechniqueByBeamline = function (beamlineName) {
  var connections = this.getConnections();
  for (var i = 0; i < connections.length; i++) {
    if (JSON.stringify(connections[i].beamlines.MX).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1) {
      return "MX";
    }
    if (JSON.stringify(connections[i].beamlines.SAXS).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1) {
      return "SAXS";
    }
    if (JSON.stringify(connections[i].beamlines.EM).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1) {
      return "EM";
    }
  }
  return "UNKNOWN";
};

/**
 *  Returns an string with the name of all the beamlines
 *
 * @method getBeamlineNames
 * @return
 */
CredentialManager.prototype.getBeamlineNames = function () {
  var connections = this.getConnections();
  var beamlines = [];
  for (var i = 0; i < connections.length; i++) {
    for (var technique in connections[i].beamlines) {
      beamlines = _.concat(beamlines, _.keys(_.keyBy(connections[i].beamlines[technique], "name")));
    }
    //beamlines =_.concat(_.keys(_.keyBy(connections[i].beamlines.SAXS, "name")), _.keys(_.keyBy(connections[i].beamlines.MX, "name")));
    //beamlines =_.concat(beamlines, _.keys(_.keyBy(connections[i].beamlines.EM, "name")));
  }
  return beamlines;
};

/**
 *  Returns an array with all the configuration for every beamline
 *
 * @method getBeamlines
 * @return
 */
CredentialManager.prototype.getBeamlines = function () {
  var connections = this.getConnections();
  var beamlines = [];
  for (var i = 0; i < connections.length; i++) {
    beamlines = _.filter(_.concat(connections[i].beamlines.SAXS, connections[i].beamlines.MX, connections[i].beamlines.EM), function (o) {
      return o != null;
    });
  }
  return beamlines;
};

/**
 *  Returns the default sample changer
 *
 * @method getDefaultSampleChanger
 * @return
 */
CredentialManager.prototype.getDefaultSampleChanger = function () {
  var connections = this.getConnections();
  var sc = connections[0].defaultSampleChanger;
  return sc;
};

/**
*  Returns the site name
*
* @method getSiteName
* @return
*/
CredentialManager.prototype.getSiteName = function(){
debugger;
	var connections = this.getConnections();
	var siteName = ExtISPyB.default_site;
	if (connections != null && connections.length > 0){
	    siteName = connections[0].site;
	}
	return siteName;
};

/**
 *  Returns an array with the name of all the beamlines of the selected technique
 *
 * @method getBeamlinesByTechnique
 * @param technique [MX, SAXS]
 * @return
 */
CredentialManager.prototype.getBeamlinesByTechnique = function (technique) {
  var connections = this.getConnections();
  var beamlines = [];
  for (var i = 0; i < connections.length; i++) {
    beamlines = _.concat(connections[i].beamlines[technique]);
  }
  return beamlines;
};

CredentialManager.prototype.hasActiveProposal = function(){
	var credentials = this.getCredentials();
	var result = false;
    for (var i = 0; i < credentials.length; i++) {
        if (credentials[i].activeProposals.length > 0){
            for (var j = 0; j < credentials[i].activeProposals.length; j++) {
                if (credentials[i].activeProposals[j] != credentials[i].username){
                    result = true;
                }
            }
        }
	}
	return result;
};


CredentialManager.prototype.isUserAllowedAddProtein = function () {
  var connectors = this.getConnections();
  var result = false;
  var cred = this.getCredentials()[0];
  for (var i = 0; i < connectors.length; i++) {
    for (var j = 0; j < connectors[i].allow_add_proteins_roles.length; j++) {
      if (cred.hasRole(connectors[i].allow_add_proteins_roles[j])) {
        result = true;
      }
    }
  }

  return result;
};

CredentialManager.prototype.getConnections = function () {
  var credentials = this.getCredentials();
  var connectors = [];
  for (var i = 0; i < credentials.length; i++) {
    if (credentials[i].activeProposals.length > 0) {
      for (var j = 0; j < credentials[i].activeProposals.length; j++) {
        connectors.push({
          username: credentials[i].username,
          url: credentials[i].url,
          exiUrl: credentials[i].exiUrl,
          token: credentials[i].token,
          site: credentials[i].properties.siteName,
          defaultSampleChanger: credentials[i].properties.defaultSampleChanger,
          beamlines: credentials[i].properties.beamlines,
          allow_add_proteins_roles: credentials[i].properties.allow_add_proteins_roles,
          proposal: credentials[i].activeProposals[j],
        });
      }
    } else {
      connectors.push({
        username: credentials[i].username,
        url: credentials[i].url,
        exiUrl: credentials[i].exiUrl,
        token: credentials[i].token,
        site: credentials[i].properties.siteName,
        defaultSampleChanger: credentials[i].properties.defaultSampleChanger,
        beamlines: credentials[i].properties.beamlines,
        allow_add_proteins_roles: credentials[i].properties.allow_add_proteins_roles,
        proposal: null,
      });
    }
  }
  return connectors;
};

CredentialManager.prototype.getCredentialByUserName = function (username) {
  var found = _.filter(this.getCredentials(), { username: username });
  if (found.length > 0) {
    return found[0];
  }
};

CredentialManager.prototype.logout = function (username, roles, token, url) {
  localStorage.removeItem("credentials");
  this.onLogout.notify();
};


CredentialManager.prototype.getActiveProposal = function(){
	var credentials = this.getCredentials();
	return credentials[0].activeProposals;
};


CredentialManager.prototype.setActiveProposal = function (username, proposal) {
  var credentials = this.getCredentials();
  for (var i = 0; i < credentials.length; i++) {
    if (credentials[i].username.toLowerCase() == username.toLowerCase()) {
      credentials[i].activeProposals = [proposal];
      localStorage.setItem("credentials", JSON.stringify(credentials));
      localStorage.removeItem("sessions");
      this.onActiveProposalChanged.notify();
    }
  }
};