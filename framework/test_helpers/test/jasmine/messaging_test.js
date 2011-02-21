describe("Test Helpers - Message Trap", function() {
    var messageTrap;
    
    var samplePayload = {
        foo: "bar"
    };
    
    var timeout = 10000;
    
    function assertFirstMessageHasProperties(props) {
        var contents = messageTrap.get();
        
        expect(contents).toBeDefined();
        expect(contents[0]).toBeDefined();
        
        var msg = contents[0];
        
        for(i in props) {
            expect(msg[i]).toBeDefined();
            expect(msg[i])[typeof(props[i]) === "object" ? "toBe" : "toEqual"](props[i]);
        }
    }
    
    beforeEach(function() {
        messageTrap = new TestHelpers.Messaging.MessageTrap();
    });
    
    describe("Capturing Local Bus Messages", function() {
        beforeEach(function() {
            messageTrap.listenToOpenAjax();
            OpenAjax.hub.publish("TestMessage", samplePayload);
        });
        
        it("should have captured the published message", function() {
            assertFirstMessageHasProperties({
                name: "TestMessage",
                data: samplePayload,
                type: "Message",
                source: "Local"
            });
        });
    });
    
    describe("Capturing triggered jQuery events locally", function() {
        var sourceObj = {};
        
        beforeEach(function() {
            messageTrap.listenToJQuery();
        });
        
        describe("after triggering event with $.fn.trigger", function() {
            beforeEach(function() {
                $(sourceObj).trigger("custom_event", samplePayload);
            });
            
            it("should have captured the triggered event", function() {
                assertFirstMessageHasProperties({
                    name: "custom_event",
                    data: samplePayload,
                    type: "jQuery Event",
                    source: sourceObj
                });
            });
            
        });
        
        describe("after triggering event with $.fn.triggerHandler", function() {
            beforeEach(function() {
                $(sourceObj).triggerHandler("custom_event", samplePayload);
            });
            
            it("should have captured the triggered event", function() {
                assertFirstMessageHasProperties({
                    name: "custom_event",
                    data: samplePayload,
                    type: "jQuery Event",
                    source: sourceObj
                });
            });
        });
    });
    
    
    describe("Querying the trap", function() {
        var sourceObj = {};
        
        beforeEach(function() {
            messageTrap.listenToOpenAjax();
            messageTrap.listenTo(sourceObj).andTrap("custom1 custom2 custom3");
            
            OpenAjax.hub.publish("pubsub1", samplePayload);
            OpenAjax.hub.publish("pubsub2", samplePayload);
            OpenAjax.hub.publish("pubsub1", samplePayload);
            OpenAjax.hub.publish("pubsub2", samplePayload);
            
            $(sourceObj).triggerHandler("custom1", samplePayload);
            
            $(sourceObj).triggerHandler("custom2", samplePayload);
            $(sourceObj).triggerHandler("custom2", samplePayload);
            
            $(sourceObj).triggerHandler("custom3", samplePayload);
            $(sourceObj).triggerHandler("custom3", samplePayload);
            $(sourceObj).triggerHandler("custom3", samplePayload);
        });
        
        describe("Reading Messages", function() {
            describe("all", function() {
                it("should return all captured messages and events", function() {
                    var result = messageTrap.get();
                    expect(result.length).toEqual(10);
                });
            });
            
            describe("filter by message/event name", function() {
                it("should properly filter by jQuery event name", function() {
                    var result = messageTrap.get("custom3");
                    expect(result.length).toEqual(3);
                });
                
                it("should properly filter by message name", function() {
                    var result = messageTrap.get("pubsub1");
                    expect(result.length).toEqual(2);
                });
            });
            
            describe("filter with predicate", function() {
                it("should return results matching the predicate", function() {
                    var result = messageTrap.get(function(msg) { return msg.name === "custom2" || msg.type === "Message"; });
                    expect(result.length).toEqual(6);
                });
            });
            
            it("should return a full message", function() {
                var msg = messageTrap.get("custom1")[0];
                
                var props = {
                    type: "jQuery Event",
                    source: $(sourceObj),
                    name: "custom1",
                    data: samplePayload
                };
                
                for(i in props) {
                    expect(msg[i]).toBeDefined();
                    expect(msg[i]).toEqual(props[i]);
                }
            });
        });
        
        describe("Counting Messages", function() {
            describe("all", function() {
                it("should return count of all captured messages and events", function() {
                    expect(messageTrap.count()).toEqual(10);
                });
            });
            
            describe("filter by message/event name", function() {
                it("should properly filter by jQuery event name", function() {
                    expect(messageTrap.count("custom3")).toEqual(3);
                });
                
                it("should properly filter by message name", function() {
                    expect(messageTrap.count("pubsub1")).toEqual(2);
                });
            });
            
            describe("filter with predicate", function() {
                it("should return results matching the predicate", function() {
                    var result = messageTrap.count(function(msg) { return msg.name === "custom2" || msg.type === "Message"; });
                    expect(result).toEqual(6);
                });
            });
        });
    });
    
    // describe("Working with remote event sources", function() {
    //     var sourceObj;
    //     var samplePayload;
    //     
    //     beforeEach(function() {
    //         var done = false;
    //         runs(function() {
    //             S.open("//test_helpers/test/jasmine/remote_environment", function() {
    //                 done = true;
    //             });
    //         });
    //         waitsFor(function() { return done; }, "Opening Page", timeout);
    //         runs(function() {
    //             sourceObj = S.evaluate("window.sourceObj = {};");
    //             samplePayload = S.evaluate("window.samplePayload = { foo : 'bar' };");
    //         });
    //     });
    //     
    //     describe("Capturing Remote Bus Messages", function() {
    //         beforeEach(function() {
    //             runs(function() {
    //                 messageTrap.startTrappingRemoteBusMessages();
    //             });
    //             waits(100);
    //             runs(function() {
    //                 S.evaluate("OpenAjax.hub.publish('TestMessage', window.samplePayload);");
    //             });
    //         });
    // 
    //         it("should have captured the published message", function() {
    //             assertFirstMessageHasProperties({
    //                 name: "TestMessage",
    //                 data: samplePayload,
    //                 type: "Message",
    //                 source: "Remote"
    //             });
    //         });
    //     });
    // 
    //     describe("Capturing triggered jQuery events remotely", function() {
    //         beforeEach(function() {
    //             runs(function() {
    //                 messageTrap.startTrappingRemoteEvents();
    //             });
    //         });
    // 
    //         describe("after raising an event with $.fn.trigger", function() {
    //             beforeEach(function() {
    //                 S.evaluate("$(window.sourceObj).trigger('custom_event', window.samplePayload);");
    //             });
    // 
    //             it("should have captured the event", function() {
    //                 assertFirstMessageHasProperties({
    //                     name: "custom_event",
    //                     data: samplePayload,
    //                     type: "jQuery Event",
    //                     source: sourceObj
    //                 });
    //             });
    //         });
    // 
    //         describe("after raising an event with $.fn.triggerHandler", function() {
    //             beforeEach(function() {
    //                 S.evaluate("$(window.sourceObj).triggerHandler('custom_event', window.samplePayload);");
    //             });
    // 
    //             it("should have captured the event", function() {
    //                 // assertFirstMessageHasProperties({
    //                 //     name: "custom_event",
    //                 //     data: samplePayload,
    //                 //     type: "jQuery Event",
    //                 //     source: sourceObj
    //                 // });
    //                 var x = true;
    //                 expect(x).toBeTruthy();
    //             });
    //         });
    // 
    //     });
    // 
    //     describe("Capturing DOM events remotely", function() {
    //         beforeEach(function() {
    //             runs(function() {
    //                 messageTrap.listenTo(S("input[name=text1]")).andTrap("click focus");
    //             });
    //             var done = false;
    //             runs(function() {
    //                 S("input[name=text1]").click(function() {
    //                     done = true;
    //                 });
    //             });
    //             waitsFor(function() { return done; }, "Clicking", timeout);
    //             waits(100);
    //         });
    //         
    //         it("should have captured the click event", function() {
    //             expect(messageTrap.count("click")).toEqual(1);
    //         });
    //         
    //         it("should have captured a focus event", function() {
    //             expect(messageTrap.count("focus")).toEqual(1);
    //         });
    //         
    //     });
    // });
    
});
