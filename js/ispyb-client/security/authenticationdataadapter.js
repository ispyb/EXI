function AuthenticationDataAdapter(args){
	DataAdapter.call(this, args);
}

AuthenticationDataAdapter.prototype.get = DataAdapter.prototype.get;
AuthenticationDataAdapter.prototype.post = DataAdapter.prototype.post;
AuthenticationDataAdapter.prototype.getUrl = DataAdapter.prototype.getUrl;


AuthenticationDataAdapter.prototype.authenticate = function(user, password, url){
	var _this = this;
	
	var site = ExtISPyB.default_site;
	/** SITE **/
	if (url.indexOf("embl-hamburg") != -1){
		site = "EMBL";
	}
	if (url.indexOf("192.109.31.39") != -1){
		site = "EMBL";
	}
    if (url.indexOf("maxiv") != -1){
        site = "MAXIV";
    }
    if (url.indexOf("localhost") != -1){
            site = ExtISPyB.default_site;
    }
	this.post('/authenticate?site=' + site, 
					{
			  			login : user,
			  			password : password
					}
	);
};
