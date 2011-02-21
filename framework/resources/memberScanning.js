jQuery.scanMembers = function(theTarget) {
	if(! theTarget) throw "You must pass a target!";
	var filters = [];
	
	function addFilter(filterFunction) {
		filters.push(filterFunction);
	}
	
	return {
		target: theTarget, 
		own: function() {
			var theTarget = this.target;
			return this.where(function(key, value) {
				return theTarget.hasOwnProperty(key);
			});
		},
		select: function(mapFunction) {
			// NOTE: Select must take a key/value function, and it is not chainable.
			var filterResults = this.results();
			var selectResults = [];
			
			$.each(filterResults, function(key, value) {
				var selectedValue = mapFunction(key, value);
				selectResults.push(selectedValue);
			});
			
			return selectResults;
		},
		where: function(predicate) {
			addFilter(predicate);
			return this;
		},
		count: function() {
			return this.select(function() { return 0; }).length;
		},
		keys: function() {
			return this.select(function(k) { return k;});
		},
		results: function() {
			var returnValue = {};
			
			$.each(this.target, function(key, value) {
				var keyFulfillsQuery = true;
				
				$.each(filters, function(index, theFilter) {
					if(! theFilter(key, value)) {
						keyFulfillsQuery = false;
						return false; 
					}
				});

				if(keyFulfillsQuery) returnValue[key] = value;
			});

			return returnValue;
		}
	};
};
	

