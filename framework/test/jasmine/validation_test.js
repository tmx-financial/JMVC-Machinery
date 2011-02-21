/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("JmvcMachinery.Validation Tests", function() {
    describe("Validation Tests", function() {
      it("should run tests", function() {
        expect(true).toBeTruthy();
      });
    });

    describe("Validation Test Maximum and Equal", function() {
      it("should run tests", function() {
        var name="LoanAmount";
        var title="Loan Amount";
        var schema = {
            title: title, type: 'number',maximum:'10',minimum:'1'
        };
        var result = JmvcMachinery.Validation.Validate('10',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'MaxValue';
        });
        expect(result.length).toEqual(0);
      });
    });

    describe("Validation Test Out bound to Maximum", function() {
      it("should run tests", function() {
        var name="LoanAmount";
        var title="Loan Amount";
        var schema = {
            title: title, type: 'number',maximum:'10',minimum:'1'
        };

        var result = JmvcMachinery.Validation.Validate('11',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'MaxValue';
        });
        expect(result.length).toEqual(1);
      });
    });
    describe("Validation Test Minimum and Equal", function() {
      it("should run tests", function() {
        var name="LoanAmount";
        var title="Loan Amount";
        var schema = {
            title: title, type: 'number',maximum:'10',minimum:'1'
        };
        var result = JmvcMachinery.Validation.Validate('1',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'MinValue';
        });
        expect(result.length).toEqual(0);
      });
    });

    describe("Validation Test Minimum", function() {
      it("should run tests", function() {
        var name="LoanAmount";
        var title="Loan Amount";
        var schema = {
            title: title, type: 'number',maximum:'10',minimum:'1'
        };
        var result = JmvcMachinery.Validation.Validate('0',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'MinValue';
        });
        expect(result.length).toEqual(1);
      });
    });

    describe("Validation Test Email", function() {
      it("should run tests", function() {
        var name="Email";
        var title="User's Email";
        var schema = {
            title: title, type: 'string',format: 'email'
        };
        var result = JmvcMachinery.Validation.Validate('nikhil@titlemax.biz123123',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'PatternValue';
        });
        expect(result.length).toEqual(1);
      });
    });

    describe("Validation Test Email", function() {
      it("should run tests", function() {
        var name="Email";
        var title="User's Email";
        var schema = {
            title: title, type: 'string',pattern: 'email'
        };
        var result = JmvcMachinery.Validation.Validate('nikhil@titlemax.biz',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'PatternValue';
        });
        expect(result.length).toEqual(0);
      });
    });

    describe("Validation Test Phone", function() {
      it("should run tests", function() {
        var name="Phone";
        var title="User's Phone";
        var schema = {
            title: title, type: 'string',pattern: 'phone'
        };
        var result = JmvcMachinery.Validation.Validate('7324229922',name,schema,'schemaid');
        result = $(result).select(function(msg){
          return msg.rule == 'PatternValue';
        });
        expect(result.length).toEqual(0);
      });
    });

    describe("Validation Test Phone", function() {
      it("should run tests", function() {
        var name="Phone";
        var title="User's Phone";
        var schema = {
            title: title, type: 'string',pattern: 'phone'
        };
        var result = JmvcMachinery.Validation.Validate('(732) 422-9922',name,schema,'schemaid');
            result = $(result).select(function(msg){
          return msg.rule == 'PatternValue';
        });
        expect(result.length).toEqual(1);
      });
    });
});

