//js jmvc_machinery/framework/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('jmvc_machinery/framework/framework.html');
});
