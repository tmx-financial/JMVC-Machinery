/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

steal.characteristics = steal.applier(function( i ) {
	if ( i.match(/^\/\//) ) {
		i = steal.root.join(i.substr(2));
		return i;
	}
	return 'characteristics/' + i;
});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
