steal.plugins('jquery/model').then(function($) {

    var modelInstanceIdCounter = 0;

    $.Model.prototype.getTransientInstanceId = function() {
        if ( typeof this.__transientInstanceId == "undefined" ) {
            ++modelInstanceIdCounter;
            this.__transientInstanceId = modelInstanceIdCounter;
        }
        return this.__transientInstanceId;
    };

    // observeAll is like calling 'bind', except it takes care of binding to both 'foo' and 'error.foo' for you.
    $.Model.prototype.observeAll = function(attributeName, observingFunction) {
        if(! attributeName) throw new Error("You must provide an attribute name to observe.");
        if(! this.Class.attributes.hasOwnProperty(attributeName)) throw new Error("This model does not contain an attribute named " + attributeName);
        if(! _.isFunction(observingFunction)) throw new Error("The second parameter must be the observing function");

        this.bind(attributeName, observingFunction);
        this.bind("error." + attributeName, observingFunction);
    };

    $.Model.attachSchema = function() {
        var shortName = this.shortName,
            fullName = this.fullName,
            expectedSchemaFilename = shortName + "Schema.js",
            tempVarName = "__TEMPVAR_" + shortName + "_" + "rawSchema",
            schema_properties;

        if(this.schema_properties) {
            if (_(this.schema_properties).isArray()) {
                schema_properties = loadSchemaFromUniverse(this.schema_properties);
            } else {
                schema_properties = this.schema_properties;
               _(schema_properties).each(function(field){
                    JmvcMachinery.Format.mixInFormatter(field);
                });
            }

            this._setSchema({
                type: "object",
                description: fullName,
                properties: schema_properties
            });
        }else{
            steal({
                path: expectedSchemaFilename,
                process: function(rawText) {
                    return $.Model._genCodeToResolveRefs(tempVarName, fullName, rawText);
                }
            });
        }

        function loadSchemaFromUniverse(properties){
            var target = {};
            _(properties).each(function(name){
                target[name] = JmvcMachinery.Framework.Characteristics.attributeUniverse().getSchema(name);
            });
            return target;
        }
    };

    $.Model._genCodeToResolveRefs = function(tempVarName, modelName, rawText) {
        var sb = ["var " + tempVarName + " = " + rawText + "();"];
        sb.push(modelName + "._setSchema(" + tempVarName + ");");

        var outputString = sb.join('\n');

        return outputString;
    };

    $.Model.prototype._privateInstanceMembers = function() {
        var thisModelInstance = this;
        if(! this instanceof $.Model) throw new Error("privateInstanceMembers is meant to be called against a receiver of a Model (in other words, the 'this' pointer must be a model instance).");

        if(! thisModelInstance.__privates) {
            thisModelInstance.__privates = {};
        }

        return thisModelInstance.__privates;
    };

    $.Model._setSchema = function(schema) {
        var thisModelKlass = this;
        if (!schema) throw "You must pass a value for schema.";
        if (this.schema) throw "You cannot set schema once it has already been set!";
        _.each(schema.properties, function(propertySpec, propertyName) {
            if (!propertySpec.hasOwnProperty('type')) {
                throw new Error(_("This spec is invalid. The property named '%s' has no 'type' attribute.").sprintf(propertyName));
            }
        });

        this.attributes = {};
        var self = this;

        _.each(schema.properties, function(propertySpec, propertyName) {
            self.attributes[propertyName] = propertySpec.type;
        });

        this.schema = schema;

        hijackUpdatePropertyToPreventSettingOfPropertiesNotInSchema(this);

        generateValidationsBasedOnSchema(this, schema);

        function _changeSchemaFor(attributeName, changeSpec) {
            if(! attributeName) throw new Error("You must pass in an attribute name.");
            if(! this.Class.attributes.hasOwnProperty(attributeName)) throw new Error("This model does not contain an attribute named " + attributeName);
            if(! changeSpec) throw new Error("You must pass in a changeSpec.");
            var allowedTerms = ["options", "title", "readOnly", "maxLength", "minLength", "minimum", "maximum", "required"];
            var illegalTerms = _.filter(_.keys(changeSpec), function(term) { return ! _.contains(allowedTerms, term); } );
            if(illegalTerms.length !== 0) throw new Error("You used the following illegal terms in your changeSpec: " + illegalTerms.join(", "));

            var overridesForThisAttribute = this._privateInstanceMembers()._schemaOverrides[attributeName];
            if(! overridesForThisAttribute) overridesForThisAttribute = this._privateInstanceMembers()._schemaOverrides[attributeName] = {};

            _.extend(overridesForThisAttribute, changeSpec);
            $(this).triggerHandler("schema." + attributeName);
        }

        this.prototype.getSchemaFor = function(attributeName) {
            if(! attributeName) throw new Error("You must pass an attribute name");
            if(! thisModelKlass.attributes.hasOwnProperty(attributeName)) throw new Error("This model does not have an attribute named " + attributeName);

            var result = thisModelKlass.schema.properties[attributeName];

            var overrides;

            if(this._privateInstanceMembers()._schemaOverrides) {
                overrides = this._privateInstanceMembers()._schemaOverrides[attributeName];
            }

            if(overrides) result = $.extend({}, result, overrides);
            return result;
        };

        var proxiedInit = this.prototype.init;

        this.prototype.init = function() {
            this._privateInstanceMembers()._schemaOverrides = {};
            this._privateInstanceMembers()._changeSchemaFor = _.bind(_changeSchemaFor, this);

            if(proxiedInit) {
                proxiedInit.apply(this, arguments);
            }
        };

    };
    $.Model.produceDerivedAttribute = function(attrName, schema, options) {
        var that = this;

        if(that.attributes[attrName] !== undefined) {
            throw new Error("Failed to produce derived attribute '" + attrName + "' because an attribute with that name is already defined.");
        }

        if(! (schema && schema.type)) throw new Error("No valid schema found for " + attrName);
        schema.readOnly = true; // derived attributes are always readonly.

        if(!options.dependsOnAttributes) {
            throw new Error("Failed to produce derived attribute '" + attrName + "' because no 'dependsOnAttributes' option was provided. A derived attribute must have dependencies on existing attributes.");
        }

        if(!options.getter) {
            throw new Error("Failed to produce derived attribute '" + attrName + "' because no 'getter' option was provided. A derived attribute must have a getter.");
        }

        _(options.dependsOnAttributes).each(function(dependency) {
            if(that.attributes[dependency] === undefined) {
                throw new Error("Unable to produce derived attribute " + attrName + " because one of its dependencies is missing: " + dependency);
            }
        });

        //add the derived attribute to attributes and schema.properties
        this.attributes[attrName] = schema.type;
        this.schema.properties[attrName] = schema;

        // Create a setter for the derived attr that throws an exception.
        var setterName = "set" + $.String.capitalize(attrName);
        this.prototype[setterName] = function() {
            throw new Error("The '" + attrName + "' attribute is a derived attribute and cannot be set directly.");
        };

        // Make a getter that calls their getter, but with a special "proxy" that only gives them access to what they stated they depend on.
        var getterName = "get" + $.String.capitalize(attrName);
        this.prototype[getterName] = function() {
            var getterContext = {}, thisModel = this;
            _.each(options.dependsOnAttributes, function(attrIDependOn) {
                var nameOfProxyAttr = attrIDependOn;
                if( (options.proxyAliasesForDependsOnAttributes) && (options.proxyAliasesForDependsOnAttributes.hasOwnProperty(attrIDependOn))) {
                    nameOfProxyAttr = derivedAttrDef.proxyAliasesForDependsOnAttributes[attrIDependOn];
                }

                getterContext[nameOfProxyAttr] = thisModel.attr(attrIDependOn);
            });

            getterContext._privateInstanceMembers = function() { return thisModel._privateInstanceMembers(); };
            getterContext.getTransientInstanceId = function() { return thisModel.getTransientInstanceId(); };

            return options.getter.call(getterContext);
        };

        // // Each derived attribute depends on one or more other attributes. So maintain the linkage needed to bind to those change
        // // events and fire derived attribute change events.
        // _.each(options.dependsOnAttributes, function(attrIDependOn) {
        //     var eventsToFire = derivedAttributeChangeTriggers[attrIDependOn] = (derivedAttributeChangeTriggers[attrIDependOn] || []);
        //     eventsToFire.push(derivedAttrName);
        // });

        var proxiedInit = this.prototype.init;

        this.prototype.init = function() {

            var currInst = this;

            _.each(options.dependsOnAttributes, function(attrIDependOn) {
                currInst.observeAll(attrIDependOn, function(evtName, val) {
                    $(currInst).triggerHandler(attrName);
                });
            });

            if(proxiedInit) {
                proxiedInit.apply(this, arguments);
            }
        };
    };

    function hijackUpdatePropertyToPreventSettingOfPropertiesNotInSchema(modelKlass) {
        if (!modelKlass) throw "You must pass in a modelKlass";
        if (!modelKlass.prototype) throw "This must not be a valid modelKlass because it does not have a prototype property.";
        var oldUpdatePropertyFunc = modelKlass.prototype._updateProperty;
        modelKlass.prototype._updateProperty = function(property, value, old, success, errorCallback) {
            var model = this;
            if ((!modelKlass.attributes[property]) && (!modelKlass.associations[property])) {
                throw "This model is a schema-backed model, and the schema does not define a property called '" + property + "' Nor are there any associations by that name. Therefore it is invalid to attempt to set that property.";
            }

            if(model.getSchemaFor(property).readOnly) {
                var allowTheUpdate = false;
                allowTheUpdate = (modelKlass.attributesWithPrivateSetters && _.contains(modelKlass.attributesWithPrivateSetters, property));

                if(! allowTheUpdate) {
                    throw new Error("The attribute named '" + property + "' is readonly at this time. Therefore it is illegal to attempt to set it.");
                }
            }

            var result = oldUpdatePropertyFunc.apply(this, arguments);
            queueUpFiringOfModelFinishedChangingEvent(this);
            return result;
        };
    }

    function queueUpFiringOfModelFinishedChangingEvent(modelInstance) {
        if(modelInstance._initializing) return;

        setTimeout(function() {
            $(modelInstance).triggerHandler("modelFinishedChanging", modelInstance);
        }, 1);
    }

    function generateValidationsBasedOnSchema(modelKlass, schema) {
        if (!modelKlass) throw "You must pass a model class!";

        _.each(schema.properties, function(propertySpec, propertyName) {
            modelKlass.validate(propertyName, function() {
                var validationMessages = JmvcMachinery.Validation.Validate(this.attr(propertyName), propertyName, propertySpec, this.Class.shortName + "_" + this.id);
                if(! validationMessages) return undefined;
                if(validationMessages.length === 0) return undefined;

                return validationMessages;
            });
        });
    }
});
