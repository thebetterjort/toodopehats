var jsdom = require('jsdom');
var query = require('..');

global.document = jsdom.jsdom();
global.window = global.document.parentWindow;

var isArray = Array.isArray;

var html = "";
html += '<ul>';
html += ' <li id="id1">Hello</li>';
html += ' <li id="id2">World</li>';
html += ' <li id="id3">|<ul><li>a</li><li>b</li></ul>|</li>';
html += '</ul>';

describe("query()", function() {

  beforeEach(function() {
    document.body.innerHTML = html;
  });

  afterEach(function() {
    document.body.innerHTML = "";
  });

  it("selects one by default", function() {

    expect(query("li").textContent).toBe("Hello");

  });

  describe(".one()", function() {

    it("selects the first compatible element", function() {

      expect(query.one("li").textContent).toBe("Hello");

    });

    it("selects the first compatible element inside a scope", function() {

      var scope = document.getElementById("id3");
      expect(query.one("li", scope).textContent).toBe("a");

    });

    it("accepts an element as parameter", function() {

      var element = document.getElementById("id2");
      expect(query.one(element).textContent).toBe("World");

    });

    it("accepts an NodeList as parameter and returns the first one", function() {

      var elements = document.getElementsByTagName("li");
      expect(query.one(elements).textContent).toBe("Hello");

    });

  });

  describe(".all()", function() {

    it("selects all compatible elements", function() {

      var selected = query.all("li");
      expect(isArray(selected)).toBe(true);
      expect(mergeTextContent(selected)).toBe("HelloWorld|ab|ab");

    });

    it("selects all compatible elements inside a scope", function() {

      var scope = document.getElementById("id3");
      var selected = query.all("li", scope);

      expect(isArray(selected)).toBe(true);
      expect(mergeTextContent(selected)).toBe("ab");

    });

    it("accepts an element as parameter", function() {

      var element = document.getElementById("id2");
      var selected = query.all(element);

      expect(isArray(selected)).toBe(true);
      expect(mergeTextContent(selected)).toBe("World");

    });

    it("accepts an NodeList as parameter and cast it into an array of dome elements", function() {

      var elements = document.getElementsByTagName("li");
      var selected = query.all(elements);

      expect(isArray(selected)).toBe(true);
      expect(mergeTextContent(selected)).toBe("HelloWorld|ab|ab");

    });

  });

  describe(".engine()", function() {

    it("sets the query selector engine", function() {

      query.engine({
        one: function() { return "one"; },
        all: function() { return ["all"]; }
      });

      expect(query.one()).toBe(undefined);
      expect(query.all()).toEqual([]);

      expect(query.one("li")).toBe("one");
      expect(query.all("li")).toEqual(["all"]);

    });

  });

});

function mergeTextContent(list) {
  var text = "";
  for (var i = 0, len = list.length; i < len; i++) {
    text += list[i].textContent;
  }
  return text;
}
