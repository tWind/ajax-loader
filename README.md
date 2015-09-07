# ajax-loader
Content loader based on AJAX

http://twind.su/plugins/ajax-loader/

Было интересно попробовать реализовать что-то с прототипным наследованием классов. Как раз подвернулся проект, в котором одновременно должен был загружаться контент в несколько каскадированных блоков на странице. Основная идея библиотеки плагина в том, что каждый функциональный блок представляет собой созданный конструктором объект, сам плагин оперирует только свойствами и методами своих объектов.

07.09.2015
- вертикальная прокрутка;
- горизонтальная прокрутка;
- понимает следующую и предыдущую кнопки в массиве ссылок, в соответствии с этим выбирает направление прокрутки;
- контроли вправо/влево;

Опции(умолчания):
viewportClass: 'tw-ajax-viewport', // String класс оболочки
layerClass: 'tw-ajax-layer', // String класс контентного слоя
controlsClass: 'tw-ajax-controls', // String класс оболочки контролей
buttons: '.buttons', // String массив ссылок, по которым будет осуществляться переход
enableControls: true, // Boolean контроли
vertical: false, // Boolean направление перемотки
selfWindow: false, // Boolean загрузка в собственное окно
loadButton: false, // Boolean ссылка для первой загрузки
currentIndex: 0, // Number индекс текущей ссылки (используется для инициализации слайдера со включенными контролями)
onLoadComplete: function() { // Function выполнится по окончании загрузки контента
	console.log('Load complete! No callback.');
}

todo:
- добавить опцию "fade";
- разбить на 3 .js файла: вызов, библиотека, плагин;
- добавить прелоадер;
- рефакторинг внутренних функций bindClick();
