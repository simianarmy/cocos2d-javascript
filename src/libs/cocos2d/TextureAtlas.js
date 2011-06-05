/*globals module exports resource require BObject BArray FLIP_Y_AXIS*/
/*jslint undef: true, strict: true, white: true, newcap: true, browser: true, indent: 4 */
"use strict";

var util = require('util'),
    Texture2D = require('./Texture2D').Texture2D;


/* QUAD STRUCTURE
 quad = {
     drawRect: <rect>, // Where the quad is drawn to
     textureRect: <rect>  // The slice of the texture to draw in drawRect
 }
*/

var TextureAtlas = BObject.extend(/** @lends cocos.TextureAtlas# */{
    quads: null,
    imgElement: null,
    texture: null,
    bufferCanvas: null,
    bufferContext: null,
    
    /**
     * A single texture that can represent lots of smaller images
     *
     * @memberOf cocos
     * @constructs
     * @extends BObject
     *
     * @opt {String} file The file path of the image to use as a texture
     * @opt {Texture2D|HTMLImageElement} [data] Image data to read from
     * @opt {CanvasElement} [canvas] A canvas to use as a texture
     */
    init: function (opts) {
        var file = opts.file,
            data = opts.data,
            texture = opts.texture,
            canvas = opts.canvas;
        
        if (canvas) {
            // If we've been given a canvas element, use it when drawing
            this.imgElement = canvas;
        } else {
            texture = Texture2D.create({texture: texture, file: file, data: data});
            this.set('texture', texture);
            this.imgElement = texture.get('imgElement');
        }

        this.quads = [];
    },
        
    initImagePixelBuffer: function() {
        // Create canvas and context buffers one time
        if (!this.bufferCanvas) {
            this.bufferCanvas = document.createElement('canvas');
            // Set canvas dimensions to image dimensions 
            this.bufferCanvas.width = this.imgElement.width;
            this.bufferCanvas.height = this.imgElement.height;
        }
        // Create the offscreen buffer
        if (!this.bufferContext) {
            this.bufferContext = this.bufferCanvas.getContext('2d');
        }
    },
    
    /**
     * Sets the texture's global color by compositing the color over the texture
     * Using technique described here:
     * http://stackoverflow.com/questions/2688961/how-do-i-tint-an-image-with-html5-canvas
     *
     * @setter color
     * @type ColorRGB
     */
    set_color: function(color) {
        // Initialize offscreen buffers
        this.initImagePixelBuffer();
        
        this.bufferContext.clearRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
        
        // fill offscreen buffer with the tint color
        this.bufferContext.fillStyle = color.toString();
        this.bufferContext.fillRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);

        // destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
        this.bufferContext.globalCompositeOperation = "destination-atop";
        this.bufferContext.drawImage(this.imgElement, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
    },
    
    insertQuad: function (opts) {
        var quad = opts.quad,
            index = opts.index || 0;

        this.quads.splice(index, 0, quad);
    },
    removeQuad: function (opts) {
        var index = opts.index;

        this.quads.splice(index, 1);
    },


    drawQuads: function (ctx) {
        util.each(this.quads, util.callback(this, function (quad) {
            if (!quad) {
                return;
            }

            this.drawQuad(ctx, quad);
        }));
    },

    drawQuad: function (ctx, quad) {
        var sx = quad.textureRect.origin.x,
            sy = quad.textureRect.origin.y,
            sw = quad.textureRect.size.width, 
            sh = quad.textureRect.size.height;

        var dx = quad.drawRect.origin.x,
            dy = quad.drawRect.origin.y,
            dw = quad.drawRect.size.width, 
            dh = quad.drawRect.size.height;


        var scaleX = 1;
        var scaleY = 1;

        if (FLIP_Y_AXIS) {
            dy -= dh;
            dh *= -1;
        }

            
        if (dw < 0) {
            dw *= -1;
            scaleX = -1;
        }
            
        if (dh < 0) {
            dh *= -1;
            scaleY = -1;
        }

        ctx.scale(scaleX, scaleY);
    
        var img = this.get('imgElement');
        ctx.drawImage(img, 
            sx, sy, // Draw slice from x,y
            sw, sh, // Draw slice size
            dx, dy, // Draw at 0, 0
            dw, dh  // Draw size
        );
        // to tint the image, draw it first
        // then set the global alpha to the amount that you want to tint it, 
        // and draw the offscreen color buffer directly on top of it.
        if (this.bufferContext) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(this.bufferCanvas, 
                sx, sy, // Draw slice from x,y
                sw, sh, // Draw slice size
                dx, dy, // Draw at 0, 0
                dw, dh  // Draw size
            );
        }
        ctx.scale(1, 1);
    }
});

exports.TextureAtlas = TextureAtlas;
