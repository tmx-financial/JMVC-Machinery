/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("SchemaAttachmentMachinery", function() {
    
    describe("WhenASchemaIsAttached", function() {
        var testSchema;

        beforeEach(function() {
            $.Model.extend('ModelForSpecs', {});

            testSchema =
            {
                "description": "Schema for test model",
                "type": "object",
                "properties": {
                    "firstName": {
                        "title": "First Name",
                        "type": "string",
                        "maxLength": 30
                    },
                    "zipCode": {
                        "title": "Zip Code",
                        "type": "string",
                        "format": "postal-code"
                    }
                }
            };
        });

        it("should be finding our test artifacts so we can proceed with the tests", function() {
            expect(ModelForSpecs).toBeDefined();
            ModelForSpecs._setSchema(testSchema);
            expect(ModelForSpecs.schema).toBeDefined();
        });

        it("should throw if you try to set the schema and it has already been set", function() {
            ModelForSpecs._setSchema(testSchema);
            
            expect(function() {
                ModelForSpecs._setSchema({});
            }).toThrow();
            
        });

        it("should throw if any of the schema properties do not have a type attrbute",
        function() {
            var schemaWhereZipCodeIsMissingTypeAttribute = $.extend({}, testSchema);
            delete schemaWhereZipCodeIsMissingTypeAttribute.properties.zipCode['type'];
            
            expect(schemaWhereZipCodeIsMissingTypeAttribute.properties.zipCode.type).not.toBeDefined();

            expect(function() {
                ModelForSpecs._setSchema(schemaWhereZipCodeIsMissingTypeAttribute);
            }).toThrow();
        });

        it("should automatically define a JMVC model attribute for each property described in the schema",
        function() {
            ModelForSpecs._setSchema(testSchema);
            
            _(["firstName", "zipCode"]).each(function(p) {
                expect(ModelForSpecs.attributes[p]).toBeDefined();
            });

            $.each(testSchema.properties, function(pname, pspec) {
                expect(ModelForSpecs.attributes[pname]).toBeDefined();
                expect(ModelForSpecs.attributes[pname]).toEqual(pspec.type);
            });
        });

        it("should modify the behavior of the model instances such that you cannot set an attribute that was not in the schema",
        function() {
            ModelForSpecs._setSchema(testSchema);
            var newInstance = new ModelForSpecs();
            
            expect(newInstance).toBeDefined();
            expect(newInstance.Class.schema).toEqual(testSchema);
            
            expect(function() {
                newInstance.attr("NeverHeardOfThisAttribute", 42);
            }).toThrow();
        });

        it("should create getSchemaFor and _privateInstanceMembers()._changeSchemaFor methods",
        function() {
            ModelForSpecs._setSchema(testSchema);
            var newInstance = new ModelForSpecs();
            
            expect(newInstance).toBeDefined();
            expect(newInstance.getSchemaFor).toBeDefined();
            expect(newInstance._privateInstanceMembers()._changeSchemaFor).toBeDefined();
        });
    });

    describe("model's transient instance ids",
    function() {
        it("should give a unique instance id to every model instance",
        function() {
            var aModel = new ModelForSpecs();

            var x = aModel.getTransientInstanceId();
            var y = new ModelForSpecs().getTransientInstanceId();

            var xAgain = aModel.getTransientInstanceId();

            expect(x).toBeDefined();
            expect(y).toBeDefined();
            expect(xAgain).toBeDefined();
            
            expect(x).toBe(x);
            expect(y).toBe(y);
            expect(x).toBe(xAgain);
            
        });
    });
});
