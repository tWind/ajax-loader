(function($) {
	$.fn.ajaxLoader = function(options) {
		var defaults = {
			viewportClass: 'tw-ajax-viewport',
			layerClass: 'tw-ajax-layer',
			controlsClass: 'tw-ajax-controls',
			buttons: '.buttons',
			enableControls: true
		}

		var $pane = this;
		var slider = {};

		slider.init = function() {
			this.settings = $.extend({}, defaults, options);

			this.ui = new Ui({
				viewportClass: this.settings.viewportClass,
				layerClass: this.settings.layerClass,
				controlsClass: this.settings.controlsClass,
				enableControls: slider.settings.enableControls
			});
			
			this.model = new Model();

			this.controller = new Controller({
				buttons: slider.settings.buttons
			});
			

		}
		slider.build = function() {
			this.ui.build($pane);
			slider.currentLayer = this.ui._layer;

			slider.controller.bindClick(function(url) {
				slider.nextLayer = slider.ui.addNextLayer(slider.currentLayer);
				slider.model.loadContent(slider.nextLayer, url);
			});


		}
		slider.load = function(f) {
			this.model.loadContent(this.ui._layer, $(slider.settings.buttons[0]).attr('href'), f);
		}
		slider.destroy = function() {
			this.ui.destroy();
			this.controller.unbindClick();
		}


		

		return slider;
		
	}
})(jQuery);

// VIEW
function Ui(options) {
	this._viewportClass = options.viewportClass;
	this._layerClass = options.layerClass;
	this._controlsClass = options.controlsClass;
	this._enableControls = options.enableControls;
	
}

Ui.prototype.build = function(target) {
	var self = this;

	this._viewport = setViewport(target);
	this._layer = setLayer(this._viewport);

	if(this._enableControls)
		this._controls = setControls(this._layer);

	function setViewport(el) {
		$(el)
			.append('<div class="' + self._viewportClass + '">');
		return $(el).children();
	}
	function setLayer(el) {
		$(el).append('<div class="' + self._layerClass + '">');
		return $(el).children();
	}
	function setControls(el) {
		$(el)
			.after('<div class="' + self._controlsClass + '">');
		var controlsLayer = $(el).next();

		$(controlsLayer).append('<div></div>' + '<div></div>');
		return $(controlsLayer).children();
	}
}
Ui.prototype.addNextLayer = function(target) {
	$(target).after('<div class="' + this._layerClass + '">');
	this._nextLayer = $(target).next();
	$(this._nextLayer).hide();

	return this._nextLayer;
}
Ui.prototype.destroy = function() {
	$(this._layer).remove();
	$(this._nextLayer).remove();
	$(this._viewport).remove();
	$(this._controls).remove();
}

// MODEL
function Model(options) {
	//this._target
}

Model.prototype.ajaxQuery = function(target, url, complete) {
	$.ajax({
	    url: url,             
	    dataType : "html",   
	    success: function (data) { 
	        $(target).append(data);
	    },
	    complete: function() {
	    	if(typeof complete == 'function') {
	    		complete();
	    	}
	    }
	});
}
Model.prototype.loadContent = function(target, url, complete) {
	Model.prototype.ajaxQuery(target, url, complete);
}
Model.prototype.changeSlides = function() {
	
}

// CONTROLLER
function Controller(options) {
	this._buttons = options.buttons;
}
Controller.prototype.bindClick = function(f) {
	console.log('binding to: ' + $(this._buttons))
	$(this._buttons).on('click', function(e) {
		e.preventDefault();
		f($(this).attr('href'));
	});
}
Controller.prototype.unbindClick = function() {
	$(this._buttons).off();
}
