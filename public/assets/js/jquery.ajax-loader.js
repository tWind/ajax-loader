(function($) {
	$.fn.ajaxLoader = function(options) {
		var defaults = {
			viewportClass: 'tw-ajax-viewport',
			layerClass: 'tw-ajax-layer',
			controlsClass: 'tw-ajax-controls',
			buttons: '.buttons',
			enableControls: true,
			vertical: false,
			selfWindow: false,
			loadButton: false,
			onLoadComplete: function() {
				console.log('Load complete! No callback.');
			}
		}

		var $pane = this;
		var slider = {};

		slider.init = function() {
			slider.settings = $.extend({}, defaults, options);

			this.viewport = new Block(slider.settings.viewportClass, $pane);
			
			this.currentLayer = new Block(slider.settings.layerClass, slider.viewport._window);
			this.nextLayer = new Block(slider.settings.layerClass, slider.viewport._window);
			this.button = new Button(slider.settings.buttons);

			slider.build();
		}

		slider.build = function() {
			slider._currentIndex = slider.button._clickedIndex;
			// переменная для хранения значения, на которое будет сдвигаться слой
			// выбор первоначальной загрузки контента: либо загружается контент по первой ссылке 
			// из массива кнопок, либо, если определена отдельная кнопка, то ссылка берется из неё
			var loadLink;
			
			if(!slider.settings.loadButton)
				loadLink = slider.button._links[0];
			else
				loadLink = $(slider.settings.loadButton).attr('href');

			slider.currentLayer.loadContent(loadLink, function() {

				$(slider.viewport._window).height(slider.currentLayer._height());

				if(typeof slider.settings.onLoadComplete == 'function') 
					slider.settings.onLoadComplete();						
			});
			

			slider.button.bindClick(function(href) {
				if(slider.settings.vertical) {
					slider.moveValue = slider.viewport._height();
					if(slider.button._clickedIndex > slider._currentIndex) {
						slider.nextLayer.applyPosition('top', slider.moveValue);
						slider.nextLayer._moveDir = 'top';
						slider.currentLayer._moveDir = 'top';
					}
					else {
						slider.nextLayer.applyPosition('top', -slider.moveValue);
						slider.nextLayer._moveDir = 'bottom';
						slider.currentLayer._moveDir = 'bottom';
					}
				}
				slider.prevLayer = slider.currentLayer;
				
				slider.nextLayer.loadContent(href, function() {
					slider.prevLayer.move(slider.moveValue, function() {
						slider.prevLayer.destroy();
						if(typeof slider.settings.onLoadComplete == 'function')
							slider.settings.onLoadComplete();
					});
					slider.nextLayer.move(0);
					slider.currentLayer = slider.nextLayer;
					slider.nextLayer = new Block(slider.settings.layerClass, slider.viewport._window);
				});
				slider._currentIndex = slider.button._clickedIndex;
			});
			
			if(slider.settings.enableControls) {

				this.controls = new Controls(slider.settings.controlsClass, $pane, slider.settings.links, slider.settings.currentIndex);
				
				slider.controls.bindClick(function(index) {
					slider.setMode(index);
					// setting current index according to clicked controls button
					if(index == 0) {
						if(slider.controls.currentIndex > 0)
							slider.controls.currentIndex -= 1;
						else 
							slider.controls.currentIndex = slider.controls._links.length -1;
					} else {
						if(slider.controls.currentIndex < slider.controls._links.length -1)
							slider.controls.currentIndex += 1;
						else 
							slider.controls.currentIndex = 0;
					}
					
					slider.prevLayer = slider.currentLayer;
					
					slider.nextLayer.loadContent(slider.controls._links[slider.controls.currentIndex], function() {
						slider.prevLayer.move(slider.moveValue, function() {
							console.log(slider.moveValue);
							slider.prevLayer.destroy();
							if(typeof slider.settings.onLoadComplete == 'function')
								slider.settings.onLoadComplete();
						});
						slider.nextLayer.move(0);
						slider.currentLayer = slider.nextLayer;
						slider.nextLayer = new Block(slider.settings.layerClass, slider.viewport._window);
					});
				});
			}
			
		}
		slider.setControlsMode = function(index) {
			// setting direction
			// @todo: вынести в функцию для использования и с кнопок, и с контролей
			if(slider.settings.vertical) {
				slider.moveValue = slider.viewport._height();
				if(index == 0) {
					slider.nextLayer.applyPosition('top', slider.moveValue);
					slider.nextLayer._moveDir = 'top';
					slider.currentLayer._moveDir = 'top';
				} else {
					slider.nextLayer.applyPosition('top', -slider.moveValue);
					slider.nextLayer._moveDir = 'bottom';
					slider.currentLayer._moveDir = 'bottom';							
				}
			} else {
				slider.moveValue = slider.viewport._width();
				if(index == 0) {
					slider.nextLayer.applyPosition('left', slider.moveValue);
					slider.nextLayer._moveDir = 'left';
					slider.currentLayer._moveDir = 'left';
				} else {
					slider.nextLayer.applyPosition('left', -slider.moveValue);
					slider.nextLayer._moveDir = 'right';
					slider.currentLayer._moveDir = 'right';							
				}
			}
		}
		slider.destroy = function() {
			slider.button.unbindClick();
			slider.controls.unbindClick();
			$(slider.viewport._window).remove();
			
			delete slider.viewport;
			delete slider.currentLayer;
			delete slider.nextLayer;
			delete slider.button;
			delete slider.controls;
		}

		return slider;
	}
})(jQuery);

function Block(className, target) {
	this._className = className;
	this._window = this.create(target);
}
Block.prototype._pos = 0;
Block.prototype._moveDir = '';
Block.prototype._height = function() {
	return getHeight($(this._window));
}
Block.prototype._width = function() {
	return getWidth($(this._window));
}
Block.prototype.applyPosition = function(dir, val) {
	var propList = {};
	propList[dir] = val;
	$(this._window).css(propList);
}
Block.prototype.create = function(target) {
	return $('<div class="' + this._className + '">').appendTo(target);
}
Block.prototype.loadContent = function(url, complete) {
	var self = this;
	$.ajax({
	    url: url,             
	    dataType : "html",   
	    success: function (data) { 
	        $(self._window).append(data);
	    },
	    complete: function() {
	    	if(typeof complete == 'function') {
	    		complete();
	    	}
	    }
	});
}
Block.prototype.move = function(val, complete) {
	// Нужен объект, чтобы передать параметры методу анимации
	var moveParam = {};
	var dir = this._moveDir;

	switch(dir) {
		case 'top': 
			moveParam['top'] = -val;
			break;
		case 'bottom':
			moveParam['top'] = val;
			break;
		case 'left':
			moveParam['left'] = -val;
			break;
		case 'right':
			moveParam['left'] = val;
			break;
	}

	$(this._window).animate(moveParam, 600, function() {
		if(typeof complete == 'function')
			complete();
	})
}
Block.prototype._show = function() {
	$(this._window).fadeIn(600);
}
Block.prototype._hide = function() {
	var self = this;
	$(this._window).fadeOut(300, function() {
		self.destroy();
	});
}
// очистка слоя с вызовом callback-функции по завершении
Block.prototype.clear = function(callback) {
	$(this._window).children().remove();
	if(typeof callback == 'function')
		callback();
}
Block.prototype.destroy = function() {
	$(this._window).remove();
}

function Button(el, f) {
	this._buttons = el;
	this._links = this.getLinks(this._buttons);
	this._func = f || function() { console.log('no function binded!') };
}

Button.prototype._clickedIndex = 0;

Button.prototype.getLinks = function(array) {
	var arr = [];

	for(var i = 0; i < array.length; i++ )
		arr.push($(array[i]).attr('href'));
	return arr;
}

// привязка клика к кнопке для загрузки контента
// to do: переписать так, чтобы не было привязки функции к определенному атрибуту 
// и была возможность привязывать клик к контролям одной функцией
Button.prototype.bindClick = function(f) {
	var action;
	var self = this;
	typeof f == 'function' ? action = f : action = this._func;

	$(this._buttons).on('click', function(e) {
		e.preventDefault();

		$(self._buttons).removeClass('active');
		$(this).addClass('active');

		Button.prototype._clickedIndex = $(self._buttons).index($(this));

		action($(this).attr('href'));		
	});	
}
Button.prototype.unbindClick = function() {
	$(this._buttons).off();
}

function Controls(className, target, links, currentIndex) {
	this._className = className;

	this._wrapper = this.createWrapper(target);
	this._links = this.getLinks(links);
	this._left = this.createButton('left');
	this._right = this.createButton('right');
	this._buttons = $(this._wrapper).children();

	this.currentIndex = currentIndex;
}

Controls.prototype.createWrapper = function(target) {
	var wrapperTemplate = '<div class="' + this._className + '">';
	return $(wrapperTemplate).appendTo(target);
}
Controls.prototype.createButton = function(className) {
	if(className) 
		return $('<div class="'+ className + '">' + className + '</div>').appendTo($(this._wrapper));
}
Controls.prototype.getLinks = function(arr) {
	var linksArray = [];
	for(var i = 0; i < arr.length; i++) 
		linksArray.push($(arr[i]).attr('href'));
	return linksArray;	
}

Controls.prototype.bindClick = function(f) {
	var self = this;

	$(this._buttons).on('click', function() {
		if(typeof f == 'function')
			f($(self._buttons).index(this), self._links[self.currentIndex]);
	})
		
}
Controls.prototype.unbindClick = function() {
	$(this._buttons).off();
}

function getHeight(el) {
	return Math.max($(el).height(), $(el).outerHeight());
}
function getWidth(el) {
	return Math.max($(el).width(), $(el).outerWidth());
}