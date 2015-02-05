/**
 * @name IRCarousel: jQuery plugin Infinite Reposnive Carousel
 * @version 0.2.0 Thu, 05 Feb 2015 18:01:35 GMT
 * @author mjbp
 * @license 
 * @url https://github.com/mjbp/responsiveLoader/
 */
/*global jQuery, console, window, document */
/*jslint nomen:true */
/*!
 * @name	Infinite Slider
 * @author	Binary Vein Digital Media
 */
var IRCarousel = (function ($, w, d) {
    'use strict';
	
	var pluginName = 'IRCarousel',
        defaults = {
			delay : 6000,
            auto : true,
			minWidth: 768,
			class: 'IRCarousel'
        };
	
	function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

		this.numSlides = $(this.element).data('slides');

        this.init();
    }
	
	
	Plugin.prototype.init = function () {
		var _this = this;
		this.basePath = $(this.element).find('img').attr('src').replace(/[^\/]*$/, '');
		if ($(window).width() >= this.options.minWidth) {
			this.build();
		} else {
			$(w).on('resize', function() { 
				if ($(window).width() >= _this.options.minWidth) {
					_this.build.call(_this);
				}
			});
		}
		$(w).on('resize', function() { _this.recalculate.call(_this); });
	};
	
	Plugin.prototype.build = function () {
		var _this = this;
		if ($('.' + _this.options.class + '-mask').length > 0) { return; }
		var buttons = [{
						class : (_this.options.class + '-arrow '+ _this.options.class + '-arrow--previous'),
						label : 'Previous',
						click : function() {
							_this.move.call(_this, _this.currentSlide - 1);
						}
					},
					{
						class : (_this.options.class + '-arrow '+ _this.options.class + '-arrow--next'),
						label : 'Next',
						click : function() {
							_this.move.call(_this, _this.currentSlide + 1);
						}
					}
			],
			slideHolder = $('<div class="' + _this.options.class + '-mask">'),
			listHolder = $('<ul class="' + _this.options.class + '-slides">'),
			buttonHolder = $('<div class="' + _this.options.class + '-arrows">');
		
		for (var i = 0; i < buttons.length; i++) {
			$('<button class="' + buttons[i].class + '">')
				.on('click', buttons[i].click)
				.appendTo($(buttonHolder));
		}
		for (i = 1; i <= this.numSlides; i++) {
			$(listHolder).append($('<li><img src="' + this.basePath + i + '.jpg" alt=""></li>'));
			$(slideHolder).append($(listHolder));
		}
		
		$(this.element)
			.append($(slideHolder))
			.append($(buttonHolder));
		
		this.currentSlide = 2;
		this.animating = false;
		this.recalculate();
		
		if (!!this.options.auto) {
			this.timer = setTimeout(function() {_this.move.call(_this);}, _this.options.delay);
		}
		return this;
	};
	
	Plugin.prototype.recalculate = function () {
		var centrePoint,
            centreSecondSlide;
		this.slideWidth = ($(w).outerWidth() / 100) * 58 > this.options.minWidth ? this.options.minWidth : ($(w).outerWidth() / 100) * 58;

		$('.' + this.options.class + '-slides li').css({'width': this.slideWidth});

		centrePoint = $(w).outerWidth() / 2;
		centreSecondSlide = this.slideWidth * 1.5;

		this.startX = (centreSecondSlide - centrePoint) < 0 ? 0 : (centreSecondSlide - centrePoint) * -1;

		$('.' + this.options.class + '-slides').css({
			'width': this.slideWidth * (this.numSlides * 2),
			'left': this.startX
		});
	};
	
	Plugin.prototype.move = function (i) {
		if(!!this.animating) { return; }
		var _this = this,
			e = $('.' + _this.options.class + '-slides'),
			difference = typeof i !== 'undefined' ? i >= this.currentSlide ? i - this.currentSlide : (this.numSlides - this.currentSlide) + i : 1,
			displacement = this.slideWidth * (difference * -1);
		w.clearTimeout(this.timer);

		this.animating = true;
		
		$('.' + _this.options.class + '-slides li:nth-child(-n+' + difference + ')').clone().appendTo(e);
		_this.currentSlide = typeof i !== 'undefined' ? i : _this.currentSlide === _this.numSlides ? 1 : _this.currentSlide + 1;
		
		e.animate({
			left: "+=" + displacement
		}, 750).promise().done(function () {
			$('.' + _this.options.class +  '-slides li:nth-child(-n+' + difference + ')').remove();
			e.css({"left": _this.startX});
			_this.animating = false;
			if (_this.options.auto) {
				_this.timer = w.setTimeout(function() {_this.move.call(_this);}, _this.options.delay);
			}
		});
	};
	
	$.fn[pluginName] = function (options) {
		return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
	};
	
}(jQuery, window, document, undefined));