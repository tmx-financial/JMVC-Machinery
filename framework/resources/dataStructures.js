(function(GLOBAL) {
    var stringSet = function() {
        var list = {};

        var result = {
            addRange: function(arrayOfStringsToAdd) {
                _.each(arrayOfStringsToAdd, function(s) {
                    result.add(s);
                });
            },
            add: function(string) {
                assertOk(string);
                list[string] = string; // always safe to add and string will always be unique.
            },
            items: function() {
                return _.keys(list);
            },
            length: function() {
                return _.keys(list).length;
            }
        };

        function assertOk(string) {
            if(! _.isString(string)){
                throw new Error("The value you pass must be a string.");
            }
        }

        return result;
    };

    GLOBAL.namespace("JmvcMachinery").stringSet = stringSet;

    var mapToArray = function(keyPredicate, valuePredicate) {
        var trueFunc = function() { return true; };

        if(keyPredicate === undefined) keyPredicate = trueFunc;
        if(valuePredicate === undefined) valuePredicate = trueFunc;

        var map = {};

        var result = {
            add: function(key, valueArray) {
                assertKeyOk(key);
                if(! _.isArray(valueArray)) throw new Error("The valueArray param must be an array.");

                var theList = _(getListForKey(key));
                _.each(valueArray, function(item, index) {
                    assertValueOk(item);
                    theList.push(item);
                });
            },
            getMap: function() {
                return map;
            }
        };

        function getListForKey(key) {
            if(! map.hasOwnProperty(key)) {
                map[key] = [];
            }

            return map[key];
        }

        function assertKeyOk(key) {
            if(! keyPredicate(key)) throw new Error("The key you passed is invalid.");
        }

        function assertValueOk(value) {
            if(! valuePredicate(value)) throw new Error("The value you passed is invalid.");
        }

        return result;
    };

    GLOBAL.namespace("JmvcMachinery").mapToArray = mapToArray;

    var mapToStringSet = function() {
        var map = {};

        var result = {
            add: function(key, stringsToAddToSet) {
                     var stringSet = map[key];
                     if(! stringSet) map[key] = stringSet = JmvcMachinery.stringSet();
                     stringSet.addRange(stringsToAddToSet);
                 },
            getMap: function() {
                        return map;
                    }
        };

        result.getInternalData = result.getMap;
        return result;
    };

    GLOBAL.namespace("JmvcMachinery").mapToStringSet = mapToStringSet;

    var customMapToStringSet = function(spec) {

        var dataStructure = mapToStringSet();
        var map = dataStructure.getMap();
        var result = {};

        if(spec.hasOwnProperty("getKeys")) {
            result[spec.getKeys] = function() { return _.keys(dataStructure.getMap()); };
        }

        if(spec.hasOwnProperty("getListByKey")) {
            result[spec.getListByKey] = function(keyName) { return dataStructure.getMap()[keyName].items(); };
        }

        if(spec.hasOwnProperty("associateManyKeysWithOneValue")) {
            result[spec.associateManyKeysWithOneValue] = function(arrayOfKeys, theValue) {

                if(! arrayOfKeys) throw new Error("Missing argument");
                if(! theValue) throw new Error("Missing argument");
                _.each(arrayOfKeys, function(k) {
                    var valueList = map[k] = (map[k] || stringSet());
                    valueList.add(theValue);
                });
            };
        }

        if(spec.hasOwnProperty("associateOneKeyWithManyValues")) {
            result[spec.associateOneKeyWithManyValues] = function(theKey, arrayOfValues) {
                var valueList = map[theKey] = (map[theKey] || stringSet());
                _.each(arrayOfValues, function(v) {
                    valueList.add(v);
                });
            };
        }

        if(spec.hasOwnProperty("getUnderlyingDataStructure")) {
            result[spec.getUnderlyingDataStructure] = function() {
                return dataStructure;
            };
        }

        return result;
    };

    GLOBAL.namespace("JmvcMachinery").customMapToStringSet = customMapToStringSet;

    var customMapToArray = function(spec) {
        var dataStructure = mapToArray(spec.keyPredicate, spec.valuePredicate);
        var map = dataStructure.getMap();

        var result = {};
        if(spec.hasOwnProperty("getKeys")) {
            result[spec.getKeys] = function() { return _.keys(dataStructure.getMap()); };
        }

        if(spec.hasOwnProperty("getListByKey")) {
            result[spec.getListByKey] = function(keyName) { return dataStructure.getMap()[keyName]; };
        }

        if(spec.hasOwnProperty("associateManyKeysWithOneValue")) {
            result[spec.associateManyKeysWithOneValue] = function(arrayOfKeys, theValue) {
                if(! arrayOfKeys) throw new Error("Missing argument");
                if(! theValue) throw new Error("Missing argument");
                _.each(arrayOfKeys, function(k) {
                    var valueList = map[k] = (map[k] || []);
                    valueList.add(theValue);
                });
            };
        }

        if(spec.hasOwnProperty("associateOneKeyWithManyValues")) {
            result[spec.associateOneKeyWithManyValues] = function(theKey, arrayOfValues) {
                var valueList = map[theKey] = (map[theKey] || [] );
                _.each(arrayOfValues, function(v) {
                    valueList.add(v);
                });
            };
        }

        if(spec.hasOwnProperty("associateOneKeyToOneValue")) {
            result[spec.associateOneKeyToOneValue] = function(key, value) {
                var valueList = map[key] = (map[key] || [] );
                valueList.push(value);
            };
        }

        if(spec.hasOwnProperty("getUnderlyingDataStructure")) {
            result[spec.getUnderlyingDataStructure] = function() {
                return dataStructure;
            };
        }

        return result;
    };

    GLOBAL.namespace("JmvcMachinery").customMapToArray = customMapToArray;

}(window));

