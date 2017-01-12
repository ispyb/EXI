function CredentialManager(){
	this.onLogin = new Event(this);
	this.onLogout = new Event(this);
	this.onActiveProposalChanged = new Event(this);
}

CredentialManager.prototype.addCredential = function(username, roles, token, url, exiUrl, properties){
    
    var tokenExpires =  moment().add(3, 'hour');
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

CredentialManager.prototype.credentialToObject = function(json){
    return new Credential(json.username,json.roles,	json.token,json.url,json.exiUrl,json.activeProposals,json.tokenExpires,json.properties);
};

CredentialManager.prototype.getCredentials = function(){
	var credentials = [];
	if (JSON.parse(localStorage.getItem("credentials")) != null){
		credentials = JSON.parse(localStorage.getItem("credentials"));
	}
    for (var i=0; i < credentials.length; i++){
        credentials[i] = this.credentialToObject(credentials[i]);
    }
	return credentials;
};

/** Given a beamline name it return MX or SAXS **/
CredentialManager.prototype.getTechniqueByBeamline = function(beamlineName){
	var connections = this.getConnections();
	for (var i = 0; i < connections.length; i++) {
		if (JSON.stringify(connections[i].beamlines.MX).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1){
			return "MX";
		}
		if (JSON.stringify(connections[i].beamlines.SAXS).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1){
			return "SAXS";
		}
	}
	return "UNKNOW";

};

/**
*  Returns an string with the name of all the beamlines
*
* @method getBeamlineNames
* @return 
*/
CredentialManager.prototype.getBeamlineNames = function(){   
	var connections = this.getConnections();
    var beamlines = [];
	for (var i = 0; i < connections.length; i++) {
      beamlines =_.concat(_.keys(_.keyBy(connections[i].beamlines.SAXS, "name")), _.keys(_.keyBy(connections[i].beamlines.MX, "name")))      
	}
	return beamlines;
};

/**
*  Returns an array with all the configuration for every beamline
*
* @method getBeamlines
* @return 
*/
CredentialManager.prototype.getBeamlines = function(){   
	var connections = this.getConnections();
    var beamlines = [];
	for (var i = 0; i < connections.length; i++) {
      beamlines =_.concat(connections[i].beamlines.SAXS, connections[i].beamlines.MX);     
	}
	return beamlines;
};


/**
*  Returns an array with the name of all the beamlines of the selected technique
*
* @method getBeamlinesByTechnique
* @param technique [MX, SAXS]
* @return 
*/
CredentialManager.prototype.getBeamlinesByTechnique = function(technique){
	var connections = this.getConnections();
    var beamlines = [];
	for (var i = 0; i < connections.length; i++) {        
        beamlines =_.concat(connections[i].beamlines[technique]);     
	}
	return beamlines;
};

CredentialManager.prototype.getConnections = function(){
	var credentials = this.getCredentials();
	var connectors = [];
	for (var i = 0; i < credentials.length; i++) {
		if (credentials[i].activeProposals.length > 0){
			for (var j = 0; j < credentials[i].activeProposals.length; j++) {
				connectors.push({
					username : credentials[i].username,
					url : credentials[i].url,
					exiUrl : credentials[i].exiUrl,
					token : credentials[i].token,
					beamlines : credentials[i].properties.beamlines,
					proposal : credentials[i].activeProposals[j] });
			}
		}
		else{
				connectors.push({
					username : credentials[i].username,
					url : credentials[i].url,
					exiUrl : credentials[i].exiUrl,
					token : credentials[i].token,
					beamlines : credentials[i].properties.beamlines,
					proposal : null
				});
		}
	}
	return connectors;
};

CredentialManager.prototype.getCredentialByUserName = function(username){
    var found =  _.filter(this.getCredentials(), {username : username});
    if (found.length > 0){
        return found[0];
    }
	
};

CredentialManager.prototype.logout = function(username, roles, token, url){
	localStorage.removeItem('credentials');
	this.onLogout.notify();
};

CredentialManager.prototype.setActiveProposal = function(username, proposal){
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

