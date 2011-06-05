/*globals module exports resource require*/
/*jslint undef: true, strict: true, white: true, newcap: true, browser: true, indent: 4 */
"use strict";

var util = require('util');

/* 
 * @namespace 
 */
var color = {
   
   /**
    * @class ColorRGBA
    * RGBA color composed of R,G,B values [0-255] and alpha [0-255]
    */
    ColorRGBA: function(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    },
    
    rgba: function(r, g, b, a) {
        return new color.ColorRGBA(r, g, b, a);
    },
    
    rgb: function(r, g, b) {
        return new color.rgba(r, g, b, 0);
    }
};

color.ColorRGBA.prototype.toString = function() {
    return "rgba(" + Math.floor(this.r) + ", " + Math.floor(this.g) + ", " + Math.floor(this.b) + ", " + this.a + ")";
};

module.exports = color;