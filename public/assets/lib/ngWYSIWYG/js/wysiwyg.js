'use strict';
(function (angular)
{

	angular.module('ngWYSIWYG', ['ngSanitize']);
	var template = "<div class=\"tinyeditor\">" +
		"<iframe id=\"frame\" style=\"-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100%; height: 100%;\" ng-hide=\"editMode\" wframe=\"\" ng-model=\"content\"></iframe>    </div>";
		

	angular.module('ngWYSIWYG').directive('wframe', ['$compile', '$timeout',
		function ($compile, $timeout)
		{
			//kudos http://stackoverflow.com/questions/13881834/bind-angular-cross-iframes-possible
			var linker = function (scope, $element, attrs, controllers)
			{
				var $document = $element[0].contentDocument;
				var ctrl = controllers[0];
				var dndEditorCtrl = controllers[1];
				// console.log(ctrl);
				dndEditorCtrl.iFrameLoaded('test');
				$document.open(); //damn Firefox. kudos: http://stackoverflow.com/questions/15036514/why-can-i-not-set-innerhtml-of-an-iframe-body-in-firefox
				//$document.write('<!DOCTYPE html><html><head></head><body contenteditable="true"></body></html>');
				$document.write('<!DOCTYPE html><html><head><link rel="stylesheet" href="/emaileditor/assets/css/iframeEditor.css"><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></head><body></body></html>');
				$document.close();
				//$document.designMode = 'On';
				var $body = angular.element($element[0].contentDocument.body);
				var $head = angular.element($element[0].contentDocument.head);
				//$body.attr('contenteditable', 'true');

				var jQueryUILoaded 	= false;
				var isEditMode 		= true;
				var isDNDInit 		= false;
				var isSortableInit 	= false;

				//model --> view
				ctrl.$render = function ()
				{
					// console.log('render');
					//$body.html(ctrl.$viewValue || ''); //not friendly with jQuery. snap you jQuery

					$body[0].innerHTML = ctrl.$viewValue || '';

					scope.rssData 			= scope.api.scope.rssData;
         			scope.hiddenPreviewText = scope.api.scope.hiddenPreviewText;
					scope.adData 			= scope.api.scope.adData;

					$compile($element.contents())(scope);

					if (typeof ($element[0].contentWindow.init) == "function")
					{
						//console.log('--- init');
						$element[0].contentWindow.init();
					}
					else
					{
						//console.log('--- NOT init');
					}

					var resizeTimer = null;

					$element[0].contentWindow.foo = function ()
					{
						if (resizeTimer)
						{
							$timeout.cancel(resizeTimer);
						}

						resizeTimer = $timeout(function ()
						{
							// console.log( 'resize timer');
							// console.log( $element[0].contentWindow.document.body.scrollHeight);
							// console.log( $element[0].contentWindow.document.body.offsetHeight);	

							$element.css(
							{
								height: Math.max($element[0].contentWindow.document.body.scrollHeight, $element[0].contentWindow.document.body.offsetHeight) + 20 + "px"
							});

						}, 1000/*ms*/, true /*invoke apply*/);
					}

					$element[0].contentWindow.foo();
					angular.element('#frame').ready(function () 
					{
						// console.log('frame ready');
						initSortable();
					});
				}

				scope.api.initSortable = function ()
				{
					dndEditorCtrl.iFrameLoaded('test');

					initSortable();
				};

				function initSortable() 
				{
					console.log('initSortable');

					if (!isDNDInit)
					{
						var el = angular.element('#sortable')[0];
						// console.log(el);

						var sortable = Sortable.create(el,
						{
							sort: false,
							handle: '.emailModuleHandle',
							group:
							{
								name: 'sortable-group',
								pull: 'clone',
								put: false
							},
							draggable: '.emailModule',
							ghostClass: 'emailModuleGhost',
							dragClass: 'emailModuleDrag'
						});

						var elementTrashBin = angular.element('#trash')[0];
						var sortableTrashBin = Sortable.create(elementTrashBin,
						{
							sort: false,
							// handle: '.handle',
							group: 
							{
								name: 'sortable-group',
								pull: false,
								put:  true
							}
						});
						isDNDInit = true;
					}

					var elInner = document.getElementById('frame').contentWindow.document.getElementById('modulesContainer');

					// console.log(angular.element('#frame'));
					// console.log(angular.element('#frame').contents());
					// console.log(angular.element('#frame').contents().find('div'));
					// console.log(angular.element('#frame').contents().find('div#sortable'));
					// console.log(angular.element('#frame').contents().find('#sortable'));
					// console.log(angular.element('#frame').contents().find('.emailModule'));
					// console.log(angular.element('#frame').contents().find('.sortable1'));
					// console.log(angular.element('#frame').contents().find('.dndelement'));
					// console.log(angular.element('#frame').contents().find('.clickableElement'));
					// console.log(elInner);

					var myIFrame = angular.element('#frame').contents();
					if (elInner)
					{
						var mainSortable = Sortable.create(elInner,
						{
							handle: '.emailModuleHandle',
							group:
							{
								name: 'sortable-group',
								pull: true,
								put: true
							},
							dataIdAttr	: 'data-module-id',
							draggable	: '.emailModule',
							ghostClass	: 'emailModuleGhost',
							dragClass	: 'emailModuleDrag',
							onAdd: function (/**Event*/evt)
							{
								var itemEl = evt.item;  // dragged HTMLElement
								evt.from;  // previous list
								// + indexes from onEnd
								// console.log('onAdd ('+evt.oldIndex+'/'+evt.newIndex+')');
								// console.log(evt);
								// console.log(evt.oldIndex);
								// console.log(evt.newIndex);
								// console.log('data-dropzone-id:' + elInner.getAttribute('data-dropzone-id'));
								scope.api.scope.onAddModuleToEmail(elInner.getAttribute('data-dropzone-id'), evt.item.getAttribute('data-module-id'), evt.newIndex);
							},
							onRemove: function (/**Event*/evt) 
							{
								// same properties as onUpdate
								// console.log('onRemove ('+evt.oldIndex+'/'+evt.newIndex+')');
								// console.log(evt.item);
								// console.log(evt.item.attr('id'));
						
								scope.api.scope.onRemoveModuleFromEmail(evt.item.getAttribute('id'), evt.oldIndex);
							},
							onEnd: function (/**Event*/evt)
							{		
								// console.log('-- onEnd -- ');
								// console.log(evt.oldIndex);
								// console.log(evt.newIndex);							
								// scope.api.scope.updateModulePositions(elInner.getAttribute('data-dropzone-id'), mainSortable.toArray());
								scope.api.scope.updateModulePositions(elInner.getAttribute('data-dropzone-id'), evt.oldIndex, evt.newIndex);
							}
						});
				
						for (var i = 0; i < elInner.children.length; i++)
						{
							var childrenWithSortable = angular.element(elInner.children[i]).find('.sortable1');
							if(childrenWithSortable)
							{
								for (var x = 0; x < childrenWithSortable.length; x++)
								{
									if (childrenWithSortable[x].className == 'sortable1')
									{
										initSubSortable(myIFrame, childrenWithSortable[x]);
									}
								}
							}
							// for (var x = 0; x < elInner.children[i].children.length; x++)
							// {
							// 	if (elInner.children[i].children[x].className == 'sortable1')
							// 	{
							// 		initSubSortable(myIFrame, elInner.children[i].children[x]);
							// 	}
							// }
						}

						// console.log(".clickableElement:");
						// console.log(myIFrame.find(".dndelement.clickableElement"));
					}
					else
					{
						var mySortables = angular.element('#frame').contents().find('.sortable1');
						for (var x = 0; x < mySortables.length; x++)
						{						
							initSubSortable(myIFrame, mySortables[x]);
						}
					}

					myIFrame.find(".clickableElement").click(function ()
					{
						scope.api.scope.clickOnElement(myIFrame.find(this).attr('id'));
					});

					myIFrame.find(".emailModuleSelector").click(function()
					{
						scope.api.scope.clickOnEmailModule(myIFrame.find(this).attr('id'));
					});

					myIFrame.find('a').on('click', function(e) { e.preventDefault(); });
				}
				
				function initSubSortable(myIFrame, elementContainer)
				{
					// console.log('initSubSortable(%s,%s)', myIFrame, elementContainer);
					// var subSortable = document.getElementById('subsortable');
					var sortable123 = Sortable.create(elementContainer,
						{
							draggable: ".dndelement",
							filter: ".static",
							dataIdAttr: 'id',
							dragClass: 'emailModuleDrag',
							ghostClass: 'emailSubModuleGhost',
							animation: 150,
							// Element dragging ended
							onEnd: function (/**Event*/evt)
							{
								console.log('onEnd');
								evt.oldIndex;  // element's old index within parent
								evt.newIndex;  // element's new index within parent
								// console.log(evt.oldIndex);
								// console.log(evt.newIndex);
								// var smallerIndex = Math.min(evt.oldIndex, evt.newIndex);
								// var biggerIndex  = Math.max(evt.oldIndex, evt.newIndex);
								var order = sortable123.toArray();
								// console.log(order);

								// console.log(smallerIndex);
								// console.log(biggerIndex);
								var newOrder = new Array(order.length);
								var alreadyInNewOrder = {};
								for (var i = 0; i < order.length; i++)
								{
									// console.log(order[i]);
									var element 	= myIFrame.find('#' + order[i]);
									var staticPos 	= element.attr('data-static-pos');
									// console.log(staticPos);
									if (staticPos)
									{
										newOrder[staticPos] = order[i];
										alreadyInNewOrder[order[i]] = true;
									}
								}

								for (var x = 0; x < newOrder.length; x++)
								{
									// console.log('x:' + x);
									// console.log(newOrder[x]);
									if (!newOrder[x])
									{
										var indexToSet = -1;
										for (var i = 0; i < order.length; i++)
										{
											// console.log('i:' + i)
											if (indexToSet === -1 && alreadyInNewOrder[order[i]] !== true)
											{
												indexToSet = i;
											}
										}
										if (indexToSet !== -1)
										{
											newOrder[x] = order[indexToSet];
											alreadyInNewOrder[order[indexToSet]] = true;
										}
									}
								}

								// console.log('-------------');
								// console.log(newOrder);
								sortable123.sort(newOrder);
								scope.api.scope.updateFeedPositions(newOrder);
							},
							onUpdate: function (/**Event*/evt)
							{
								// console.log('onUpdate');
								var itemEl = evt.item;  // dragged HTMLElement
								// + indexes from onEnd
							},
							onMove: function (/**Event*/evt, /**Event*/originalEvent)
							{
								// console.log('onMove');
								// console.log(evt);
								// console.log(originalEvent);
								// Example: http://jsbin.com/tuyafe/1/edit?js,output
								evt.dragged; // dragged HTMLElement
								evt.draggedRect; // TextRectangle {left, top, right и bottom}
								evt.related; // HTMLElement on which have guided
								evt.relatedRect; // TextRectangle
								originalEvent.clientY; // mouse position

								// return false; — for cancel
							},
							// Called by any change to the list (add / update / remove)
							onSort: function (/**Event*/evt)
							{
								// console.log('onSort');
								// same properties as onUpdate
							}
						});
				}

				scope.api.reinitSortable = function ()
				{
					//jQuery('iframe').trigger( "initSortable" );
					initSortable();
					dndEditorCtrl.iFrameLoaded('test');
				}

				scope.api.setMode = function (isEdit)
				{
					if (isEdit != isEditMode)
					{

						isEditMode = isEdit;

						if (isEditMode == false)
						{
							$document = $element[0].contentDocument;
							$document.open(); //damn Firefox. kudos: http://stackoverflow.com/questions/15036514/why-can-i-not-set-innerhtml-of-an-iframe-body-in-firefox
							//$document.write('<!DOCTYPE html><html><head></head><body contenteditable="true"></body></html>');
							$document.write('<!DOCTYPE html><html><head></head><body></body></html>');
							$document.close();
							//$document.designMode = 'On';
							$body = angular.element($element[0].contentDocument.body);
						}
						else
						{
							$head = angular.element($element[0].contentDocument.head); $document = $element[0].contentDocument;
							$document.open(); //damn Firefox. kudos: http://stackoverflow.com/questions/15036514/why-can-i-not-set-innerhtml-of-an-iframe-body-in-firefox
							//$document.write('<!DOCTYPE html><html><head></head><body contenteditable="true"></body></html>');
							$document.write('<!DOCTYPE html><html><head><link rel="stylesheet" href="/emaileditor/assets/css/iframeEditor.css"><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></head><body></body></html>');
							$document.close();
							//$document.designMode = 'On';
							$body = angular.element($element[0].contentDocument.body);
							$head = angular.element($element[0].contentDocument.head);
						}
					}
				}

				scope.sync = function ()
				{
					//console.log('sync');
					scope.$evalAsync(function (scope)
					{
						ctrl.$setViewValue($body.html());
					});
				}


				var getSelectionBoundaryElement = function (win, isStart)
				{
					var range, sel, container = null;
					var doc = win.document;
					if (doc.selection)
					{
						// IE branch
						range = doc.selection.createRange();
						range.collapse(isStart);
						return range.parentElement();
					}
					else if (doc.getSelection)
					{
						//firefox
						sel = doc.getSelection();
						if (sel.rangeCount > 0)
						{
							range = sel.getRangeAt(0);
							//console.log(range);
							container = range[isStart ? "startContainer" : "endContainer"];
							if (container.nodeType === 3)
							{
								container = container.parentNode;
							}
							//console.log(container);
						}
					}
					else if (win.getSelection)
					{
						// Other browsers
						sel = win.getSelection();
						if (sel.rangeCount > 0)
						{
							range = sel.getRangeAt(0);
							container = range[isStart ? "startContainer" : "endContainer"];

							// Check if the container is a text node and return its parent if so
							if (container.nodeType === 3)
							{
								container = container.parentNode;
							}
						}
					}
					return container;
				}

				var debounce = null; //we will debounce the event in case of the rapid movement. Overall, we are intereseted in the last cursor/caret position
				//view --> model
				// $body.bind('blur click keyup change paste', function ()
				// {
				// 	//lets debounce it
				// 	if (debounce)
				// 	{
				// 		$timeout.cancel(debounce);
				// 	}
				// 	debounce = $timeout(function blurkeyup()
				// 	{
				// 		ctrl.$setViewValue($body.html());
				// 		//check the caret position
				// 		//http://stackoverflow.com/questions/14546568/get-parent-element-of-caret-in-iframe-design-mode
				// 		var el = getSelectionBoundaryElement($element[0].contentWindow, true);
				// 		if (el)
				// 		{
				// 			var computedStyle = $element[0].contentWindow.getComputedStyle(el);
				// 			var elementStyle = {
				// 				'bold': (computedStyle.getPropertyValue("font-weight") == 'bold' || parseInt(computedStyle.getPropertyValue("font-weight")) >= 700),
				// 				'italic': (computedStyle.getPropertyValue("font-style") == 'italic'),
				// 				'underline': (computedStyle.getPropertyValue("text-decoration") == 'underline'),
				// 				'strikethrough': (computedStyle.getPropertyValue("text-decoration") == 'line-through'),
				// 				'font': computedStyle.getPropertyValue("font-family"),
				// 				'size': parseInt(computedStyle.getPropertyValue("font-size")),
				// 				'color': computedStyle.getPropertyValue("color"),
				// 				'sub': (computedStyle.getPropertyValue("vertical-align") == 'sub'),
				// 				'super': (computedStyle.getPropertyValue("vertical-align") == 'super'),
				// 				'background': computedStyle.getPropertyValue("background-color"),
				// 				'alignment': computedStyle.getPropertyValue("text-align")
				// 			};
				// 			//dispatch upward the through the scope chain
				// 			scope.$emit('cursor-position', elementStyle);
				// 			//console.log( JSON.stringify(elementStyle) );
				// 		}
				// 	},
				// 		100/*ms*/, true /*invoke apply*/);
				// });

				scope.range = null;
				scope.getSelection = function ()
				{
					if ($document.getSelection)
					{
						var sel = $document.getSelection();
						if (sel.getRangeAt && sel.rangeCount)
						{
							scope.range = sel.getRangeAt(0);
						}
					}
				}
				scope.restoreSelection = function ()
				{
					if (scope.range && $document.getSelection)
					{
						var sel = $document.getSelection();
						sel.removeAllRanges();
						sel.addRange(scope.range);
					}
				}

				scope.$on('execCommand', function (e, cmd)
				{
					// console.log('execCommand: ');
					// console.log(cmd);
					$element[0].contentDocument.body.focus();
					//scope.getSelection();
					var sel = $document.selection; //http://stackoverflow.com/questions/11329982/how-refocus-when-insert-image-in-contenteditable-divs-in-ie
					if (sel)
					{
						var textRange = sel.createRange();
						$document.execCommand(cmd.command, 0, cmd.arg);
						textRange.collapse(false);
						textRange.select();
					}
					else
					{
						$document.execCommand(cmd.command, 0, cmd.arg);
					}
					//scope.restoreSelection();
					$document.body.focus();
					scope.sync();
				});

				//init
				try
				{
					$document.execCommand("styleWithCSS", 0, 0);
					$document.execCommand('contentReadOnly', 0, 'false');
				}
				catch (e)
				{
					try
					{
						$document.execCommand("useCSS", 0, 1);
					}
					catch (e)
					{
					}
				}
			}
			return {
				link: linker,
				require: ['ngModel', '^^wysiwygEditor'],
				replace: true,
				/*scope: {   
					api : '@',
					rssData : '@',
					lessonClicked: '=',
				},*/
				restrict: 'AE'
			}
		}
	]);

	// kudos to http://codereview.stackexchange.com/questions/61847/draggable-resizeable-box
	angular.module("ngWYSIWYG").directive("ceResize", ['$document', function ($document)
	{
		return function ($scope, $element, $attr)
		{
			//Reference to the original
			var $mouseDown;

			// Function to manage resize up event
			var resizeUp = function ($event)
			{
				var margin = 50,
					lowest = $mouseDown.top + $mouseDown.height - margin,
					top = $event.pageY > lowest ? lowest : $event.pageY,
					height = $mouseDown.top - top + $mouseDown.height;

				$element.css({
					top: top + "px",
					height: height + "px"
				});
			};
			// Function to manage resize down event
			var resizeDown = function ($event)
			{
				var margin = 50,
					uppest = $element[0].offsetTop + margin,
					height = $event.pageY > uppest ? $event.pageY - $element[0].offsetTop : margin;

				$element.css({
					height: height + "px"
				});
			};


			var createResizer = function createResizer(className, handlers)
			{
				var newElement = angular.element('<span class="' + className + '"></span>');
				$element.append(newElement);
				newElement.on("mousedown", function ($event)
				{

					$document.on("mousemove", mousemove);
					$document.on("mouseup", mouseup);

					//Keep the original event around for up / left resizing
					$mouseDown = $event;
					$mouseDown.top = $element[0].offsetTop;
					$mouseDown.left = $element[0].offsetLeft
					$mouseDown.width = $element[0].offsetWidth;
					$mouseDown.height = $element[0].offsetHeight;

					function mousemove($event)
					{
						$event.preventDefault();
						for (var i = 0; i < handlers.length; i++)
						{
							handlers[i]($event);
						}
					}

					function mouseup()
					{
						$document.off("mousemove", mousemove);
						$document.off("mouseup", mouseup);
					}
				});
			}

			createResizer('resizer', [resizeDown, resizeDown]);
		};
	}]);

	angular.module('ngWYSIWYG').directive('colorsGrid', ['$compile', '$document',
		function ($compile, $document)
		{
			var linker = function (scope, element, attrs, ctrl)
			{
				//click away
				$document.on("click", function ()
				{
					scope.$apply(function ()
					{
						scope.show = false;
					});
				});

				element.parent().bind('click', function (e)
				{
					e.stopPropagation();
				});

				scope.colors = ['#000000', '#993300', '#333300', '#003300', '#003366', '#000080', '#333399', '#333333', '#800000', '#FF6600', '#808000', '#008000', '#008080', '#0000FF', '#666699', '#808080', '#FF0000', '#FF9900', '#99CC00', '#339966', '#33CCCC', '#3366FF', '#800080', '#999999', '#FF00FF', '#FFCC00', '#FFFF00', '#00FF00', '#00FFFF', '#00CCFF', '#993366', '#C0C0C0', '#FF99CC', '#FFCC99', '#FFFF99', '#CCFFCC', '#CCFFFF', '#99CCFF', '#CC99FF', '#FFFFFF'];
				scope.pick = function (color)
				{
					scope.onPick({ color: color });
				}
				element.ready(function ()
				{
					//real deal for IE
					function makeUnselectable(node)
					{
						if (node.nodeType == 1)
						{
							node.setAttribute("unselectable", "on");
							node.unselectable = 'on';
						}

						var child = node.firstChild;
						while (child)
						{
							makeUnselectable(child);
							child = child.nextSibling;
						}
					}
					//IE fix
					for (var i = 0; i < document.getElementsByClassName('colors-grid').length; i += 1)
					{
						makeUnselectable(document.getElementsByClassName("colors-grid")[i]);
					}
				});
			}
			return {
				link: linker,
				scope: {
					show: '=',
					onPick: '&'
				},
				restrict: 'AE',
				template: '<ul ng-show="show" class="colors-grid"><li ng-style="{\'background-color\': color}" title: "{{color}}" ng-repeat="color in colors" unselectable="on" ng-click="pick(color)"></li></ul>'
			}
		}
	]);

	angular.module('ngWYSIWYG').directive('symbolsGrid', ['$compile', '$document', '$sce',
		function ($compile, $document, $sce)
		{
			var linker = function (scope, element, attrs, ctrl)
			{
				//click away
				$document.on("click", function ()
				{
					scope.$apply(function ()
					{
						scope.show = false;
					});
				});
				element.parent().bind('click', function (e)
				{
					e.stopPropagation();
				});
				scope.symbols = ['&iexcl;', '&iquest;', '&ndash;', '&mdash;', '&raquo;', '&laquo;', '&copy;', '&divide;', '&micro;', '&para;', '&plusmn;', '&cent;', '&euro;', '&pound;', '&reg;', '&sect;', '&trade;', '&yen;', '&deg;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;', '&notin;', '&ni;', '&prod;', '&sum;', '&uarr;', '&rarr;', '&darr;', '&spades;', '&clubs;', '&hearts;', '&diams;', '&aacute;', '&agrave;', '&acirc;', '&aring;', '&atilde;', '&auml;', '&aelig;', '&ccedil;', '&eacute;', '&egrave;', '&ecirc;', '&euml;', '&iacute;', '&igrave;', '&icirc;', '&iuml;', '&ntilde;', '&oacute;', '&ograve;', '&ocirc;', '&oslash;', '&otilde;', '&ouml;', '&szlig;', '&uacute;', '&ugrave;', '&ucirc;', '&uuml;', '&yuml;'];
				scope.pick = function (symbol)
				{
					scope.onPick({ symbol: symbol });
				}
				element.ready(function ()
				{
					//real deal for IE
					function makeUnselectable(node)
					{
						if (node.nodeType == 1)
						{
							node.setAttribute("unselectable", "on");
							node.unselectable = 'on';
						}

						var child = node.firstChild;
						while (child)
						{
							makeUnselectable(child);
							child = child.nextSibling;
						}
					}
					//IE fix
					for (var i = 0; i < document.getElementsByClassName('symbols-grid').length; i += 1)
					{
						makeUnselectable(document.getElementsByClassName("symbols-grid")[i]);
					}
				});
			}
			return {
				link: linker,
				scope: {
					show: '=',
					onPick: '&'
				},
				restrict: 'AE',
				template: '<ul ng-show="show" class="symbols-grid"><li ng-repeat="symbol in symbols" unselectable="on" ng-click="pick(symbol)" ng-bind-html="symbol"></li></ul>'
			}
		}
	]);

	angular.module('ngWYSIWYG').directive('wysiwygEdit', ['$compile', '$timeout', '$q',
		function ($compile, $timeout, $q)
		{
			var linker = function (scope, $element, attrs, ctrl)
			{
				scope.editMode = false;
				scope.cursorStyle = {}; //current cursor/caret position style
				scope.fonts = ['Verdana', 'Arial', 'Arial Black', 'Arial Narrow', 'Courier New', 'Century Gothic', 'Comic Sans MS', 'Georgia', 'Impact', 'Tahoma', 'Times', 'Times New Roman', 'Webdings', 'Trebuchet MS'];
				/*
				scope.$watch('font', function(newValue) {
				if(newValue) {
					scope.execCommand( 'fontname', newValue );
					scope.font = '';
				}
				});
				*/
				scope.fontChange = function ()
				{
					scope.execCommand('fontname', scope.font);
					//scope.font = '';
				}
				scope.fontsizes = [{ key: 1, name: 'x-small' }, { key: 2, name: 'small' }, { key: 3, name: 'normal' }, { key: 4, name: 'large' }, { key: 5, name: 'x-large' }, { key: 6, name: 'xx-large' }, { key: 7, name: 'xxx-large' }];
				scope.mapFontSize = { 10: 1, 13: 2, 16: 3, 18: 4, 24: 5, 32: 6, 48: 7 };
				scope.sizeChange = function ()
				{
					scope.execCommand('fontsize', scope.fontsize);
				}
				/*
				scope.$watch('fontsize', function(newValue) {
				if(newValue) {
					scope.execCommand( 'fontsize', newValue );
					scope.fontsize = '';
				}
				});
				*/
				scope.styles = [{ name: 'Paragraph', key: '<p>' }, { name: 'Header 1', key: '<h1>' }, { name: 'Header 2', key: '<h2>' }, { name: 'Header 3', key: '<h3>' }, { name: 'Header 4', key: '<h4>' }, { name: 'Header 5', key: '<h5>' }, { name: 'Header 6', key: '<h6>' }];
				scope.styleChange = function ()
				{
					scope.execCommand('formatblock', scope.fontsize);
				}
				/*
				scope.$watch('textstyle', function(newValue) {
				if(newValue) {
					scope.execCommand( 'formatblock', newValue );
					scope.fontsize = '';
				}
				});
				*/
				scope.showFontColors = false;
				scope.setFontColor = function (color)
				{
					scope.execCommand('foreColor', color);
				}

				scope.showBgColors = false;
				scope.setBgColor = function (color)
				{
					scope.execCommand('hiliteColor', color);
				}

				scope.execCommand = function (cmd, arg)
				{
					scope.$emit('execCommand', { command: cmd, arg: arg });
				}
				scope.showSpecChars = false;

				scope.insertSpecChar = function (symbol)
				{
					scope.execCommand('insertHTML', symbol);
				}

				scope.insertLink = function ()
				{
					var val = prompt('Please enter the URL', 'http://');
					if (val) scope.execCommand('createlink', val);
				}
				/*
				* insert image button
				*/
				scope.insertImage = function ()
				{
					var val;

					if (scope.api && scope.api.insertImage && angular.isFunction(scope.api.insertImage))
					{
						val = scope.api.insertImage.apply(scope.api.scope || null);
					}
					else
					{
						val = prompt('Please enter the picture URL', 'http://');
						val = '<img src="' + val + '">'; //we convert into HTML element.
					}

					//resolve the promise if any
					$q.when(val).then(function (data)
					{
						//scope.execCommand('insertimage', val);
						scope.execCommand('insertHTML', data); //we insert image as an HTML element instead of giving the editor a direct command to insert an image with url
					});
				}

				$element.ready(function ()
				{
					function makeUnselectable(node)
					{
						if (node.nodeType == 1)
						{
							node.setAttribute("unselectable", "on");
							node.unselectable = 'on';
						}

						var child = node.firstChild;
						while (child)
						{
							makeUnselectable(child);
							child = child.nextSibling;
						}
					}

					//IE fix
					for (var i = 0; i < document.getElementsByClassName('tinyeditor-header').length; i += 1)
					{
						makeUnselectable(document.getElementsByClassName("tinyeditor-header")[i]);
					}
				});

				//catch the cursort position style
				scope.$on('cursor-position', function (event, data)
				{
					//console.log('cursor-position', data);
					scope.cursorStyle = data;
					scope.font = data.font.replace(/(')/g, ''); //''' replace single quotes
					scope.fontsize = scope.mapFontSize[data.size] ? scope.mapFontSize[data.size] : 0;
				});
			}
			return {
				link: linker,
				scope:
				{
					content: '=', //this is our content which we want to edit
					api: '=' //this is our api object
				},
				restrict: 'AE',
				replace: true,
				template: template
			}
		}
	]);

	angular.module('ngWYSIWYG').directive('wysiwygEditor', ['$compile', '$timeout', '$q', '$log',
		function ($compile, $timeout, $q, $log)
		{
			function linker(scope, element)
			{
				$log.info('wysiwygEditor link logger test');
				console.log('wysiwygEditor linker');
				// var el = element[0].querySelector('#sortable');
				// console.log(el);

				// var sortable = Sortable.create(el,
				// {
				// 	sort: false,
				// 	// handle: '.handle',
				// 	group: 
				// 	{
				// 		name: 'sortable-group',
				// 		pull: 'clone',
				// 		put:  false
				// 	}
				// });

				scope.omgIFrame = element[0].querySelector('#frame');
			}
			function DnDEditorController(scope, element)
			{
				$log.info('DnDEditorController1234');
				this.handlers =
					{
						showAnnotations: []
					};
				// $log.info('start ifrmae');
				// $log.info(scope.omgIFrame);
				// $log.info(element);
				// $log.info('end ifrmae2');
				this.myIFrame = scope.omgIFrame;
			}

			DnDEditorController.prototype.onShowAnnotations = function (handler)
			{
				this.handlers.showAnnotations.push(handler);
			}

			DnDEditorController.prototype.iFrameLoaded = function (param)
			{
				// console.log('iFrameLoaded');
				// $log.info('iFrameLoaded2');
				// console.log(param);
				// var elInner = this.myIFrame.contentWindow.document.getElementById('sortable');
				// Sortable.create(elInner, 
				// {

				// });
			}

			return {
				restrict: 'E',
				transclude: true,
				link: linker,
				controller: ['$scope', DnDEditorController],
				scope:
				{

				},
				template: '<div class="dndEditor" ng-transclude></div>'
			};
		}
	]);

})(angular);