//steal/js jmvc_machinery/framework/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('jmvc_machinery/framework/scripts/build.html',{to: 'jmvc_machinery/framework'});
});
