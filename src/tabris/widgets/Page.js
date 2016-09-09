import {omit, drop, pick, extend} from "../util";
import Widget from "../Widget";

var Page = Widget.extend({
  _type: "tabris.Page",

  _properties: {
    image: {
      type: "image",
      access: {
        set: function(name, image) {
          this._image = image;
          this._nativeSet("image", image);
        },
        get: function() {
          return this._image;
        }
      }
    },
    title: {type: "string", default: ""},
    topLevel: "boolean",
    control: "proxy",
    parent: "proxy",
    style: "any"
  }

});

var pageProperty = {
  access: {
    set: function(name, value) {this._page.set(name, value);},
    get: function(name) {return this._page.get(name);}
  }
};

var pageProperties = {
  title: pageProperty,
  image: pageProperty,
  style: pageProperty,
  topLevel: pageProperty,
  layoutData: {access: {set: function() {}, get: function() {}}}
};

export default Widget.extend({
  _name: "Page",

  _type: "tabris.Composite",

  _supportsChildren: true,

  _properties: pageProperties,

  _create: function(properties) {
    this._super("_create", [omit(properties, Object.keys(pageProperties))].concat(drop(arguments)));
    this._nativeSet("layoutData", {left: 0, right: 0, top: 0, bottom: 0});
    this._nativeSet("parent", tabris.ui._shell.cid);
    this._page = new Page(extend(pick(properties, Object.keys(pageProperties)), {
      parent: tabris.ui,
      control: this
    }));
    this._page.widget = this;
    this._parent = tabris.ui;
    tabris.ui._addChild(this);
    this.on("dispose", function() {
      tabris.ui._pageClosed(this);
      this._page.dispose();
    });
    this._isTopLevel = !!properties.topLevel;
    return this;
  },

  open: function() {
    tabris.ui._pageOpened(this);
    return this;
  },

  close: function() {
    this.dispose();
  }

});
