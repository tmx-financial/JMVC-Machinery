/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("Model Bound Controller", function() {

    function setModelValue(attribute, value){
        if (_(value).isBoolean()) {
            S.evaluate("window.model.attr('" + attribute + "', " + value + ")");
        }else{
            S.evaluate("window.model.attr('" + attribute + "', '" + value + "')");
        }
    }

    beforeEach(function() {
        S.sync.open("//jmvc_machinery/framework/test/jasmine/model_bound_controller.html");
    });

    it("should have opened the page", function() {
        S.sync.expect.exists("#fodder");
    });

    describe("normal model binding", function() {
      it("should bind values", function() {
        setModelValue("testButtonLabel", "hello");
        S.sync.expect.value("testButtonLabel", "hello");
      });
    });

    describe("bound button helper", function() {
        describe("simple case", function() {
            it("should draw a button", function() {
              S.sync.expect.exists("button[name=simpleTestButton]");
            });
            it("should render the label", function() {
              S.sync.expect.text("button[name=simpleTestButton]", "I'm a simple test button!");
            });
        });
    });

    describe("bound attributes", function() {
        it("should change enabled", function() {
            S.sync.expect.attr("button[name=boundTestButton]", "disabled");
            setModelValue("testButtonEnabled", true);
        });
        it("should change the label", function() {
          setModelValue("testButtonLabel", "This is the new label value");
          // S.close();
        });
    });



});
