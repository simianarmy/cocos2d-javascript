/*globals module exports resource require*/
/*jslint undef: true, strict: true, white: true, newcap: true, browser: true, indent: 4 */
"use strict";

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

module.exports = color;