var jsdom = require("jsdom");
var domify = require("component-domify");

global.document = jsdom.jsdom();
global.window = global.document.parentWindow;

var css = require("..");

global.self = global.window;

describe(".css()", function() {

  it("sets/gets a value", function() {

    var span = domify('<span>Hello World</span>');

    expect(css(span, "display", "none")).toBe("none");

    expect(span.style.display).toBe("none");
    expect(css(span, "display")).toBe("none");

  });

  it("sets/gets a camel-cased property value", function() {

    var span = domify('<span>Hello World</span>');

    expect(css(span, "font-weight", "18px")).toBe("18px");

    expect(span.style.fontWeight).toBe("18px");
    expect(css(span, "font-weight")).toBe("18px");

  });

  it("removes a value", function() {

    var span = domify('<span>Hello World</span>');

    expect(css(span, "display", "none")).toBe("none");
    css(span, "display", null);
    expect(css(span, "display")).toBeFalsy();

    expect(css(span, "display", "none")).toBe("none");
    css(span, "display", undefined);
    expect(css(span, "display")).toBeFalsy();

  });

  it("removes a camel-cased property value", function() {

    var span = domify('<span>Hello World</span>');

    expect(css(span, "font-weight", "18px")).toBe("18px");
    css(span, "font-weight", null);
    expect(css(span, "font-weight")).toBeFalsy();

    expect(css(span, "font-weight", "18px")).toBe("18px");
    css(span, "font-weight", undefined);
    expect(css(span, "font-weight")).toBeFalsy();

  });

  describe("with an object as value", function() {

    it("sets/gets a value", function() {

      var span = domify('<span>Hello World</span>');

      expect(css(span, { display: "none" })).toEqual({ display: "none" });

      expect(span.style.display).toBe("none");
      expect(css(span, "display")).toBe("none");

    });

  });

});
