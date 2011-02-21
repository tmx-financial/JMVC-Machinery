/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    /*

Menu
{
ImageWidth,
ImageHeight,
SelectionMode,  (0 none (default), 1 single, 2 multipe)
Orientation, (0 Horizontal (default), 1 Vertical)
PopPosition, (0 BelowLeft (default), 1 RightTop)
PopOpenOn, (0 Click (default), 1 Hover)
onClick,  (overall Click Handler)
ThemeName:

Items:
{
Item
{
Src,
Text,
Title,
Menu,
className, (additional ClassName to apply to the element
TabElementID,  (HTML Element to make visible when Item is Selected Hides other TabElements)
State, (Visible, NotVisible, Disabled, Secured, Selected)
onClick (function or code - Params (MenuItem)) 
onRender (function or code - Params (MenuItem))
}
}
}

*/

    GLOBAL.namespace("JmvcMachinery").Menu = {
        Data: {
            PopMenuClosing: new Object()
        },
        _MenuData: function(El) {
            var Ret;

            if (JmvcMachinery.Class.Check(El.className, 'menuContainer')) {
                Ret = El.Menu.Data;
            } else {
                $(El).parents('.menuContainer').filter(':first').each(function() {
                    Ret = this.Menu.Data;
                });
            }

            return Ret;
        },
        _MenuItem: function(El) {
            var Ret;
            if (JmvcMachinery.Class.Check(El.className, 'menuItem')) {
                Ret = El;
            } else {
                $(El).parents('.menuItem').filter(':first').each(function() {
                    Ret = this;
                });
            }

            return Ret;
        },

        _ItemContainer: function(El) {
            var Ret;
            if (JmvcMachinery.Class.Check(El.className, 'menuItem')) {
                Ret = El;
            } else {
                $(El).parents('.menuItem').filter(':first').each(function() {
                    Ret = $(this);
                });
            }

            return Ret;
        },
        _Item: function(el) {
            var ItemContainer = JmvcMachinery.Menu._ItemContainer(el);
            var iData = ItemContainer.Menu.ItemData;

            var rtn = {
                data: ItemContainer.Menu.ItemData,
                container: ItemContainer,
                state: function(newState) {
                    if (newState !== undefined) {
                        JmvcMachinery.Menu.ItemState(this.container, newState);                        
                    };
                    this.data.State;
                },
                click: function() {
                    JmvcMachinery.Menu._Item_Click({
                        target: this.container
                    });
                }
            };

            return rtn;
        },
        _Item_Init: function(Item, Container) {
            if (!Item) return undefined;

            var wItem = {
                State: 'Visible'
            };

            var El = undefined;
            if (Item.Element) {
                El = Item.Element;
                wItem = El.Menu.Item;
            } else {
                El = document.createElement('DIV');
                El.setAttribute('tabIndex', '0');
                Container.appendChild(El);
            }

            $.extend(wItem, Item);
            Item = wItem;

            if (!El.Menu) El.Menu = new Object();
            El.Menu.ItemData = Item;

            El.className = JmvcMachinery.Class.Add(El.className, 'menuItem');
            if (Item.className) El.className = JmvcMachinery.Class.Add(El.className, Item.className);

            if (Item.Src && Item.Src != '') {
                var dImg = document.createElement('div');
                dImg.style.backgroundImage = 'url(' + JmvcMachinery.WebServerPath + Item.Src + ')';
                dImg.className = 'menuItemImage';
                El.appendChild(dImg);
                var jImg = $(dImg);
            }

            if (Item.Text && Item.Text != '') {
                El.setAttribute('menu_text', Item.Text);
                var dText = document.createElement('div');
                dText.className = 'menuItemText';
                $(dText).html(Item.Text);
                El.appendChild(dText);
            }
            if (Item.Title && Item.Title != '') El.title = Item.Title;

            var clearfix = document.createElement('div');
            clearfix.className = 'ui-helper-clearfix';
            El.appendChild(clearfix);

            JmvcMachinery.Events.Add(El, 'mouseover', JmvcMachinery.Menu._Item_MouseOver);
            JmvcMachinery.Events.Add(El, 'mouseout', JmvcMachinery.Menu._Item_MouseOut);

            if (Item.Menu) {
                Item.PopMenuID = Item.Menu.ID = _.uniqueId("menu_");
                JmvcMachinery.Menu._PopMenu_Init(El, Item.Menu);
            }

            if (Item.TabElementID) {
                var TabElement = document.getElementById(Item.TabElementID);
                if (TabElement) {
                    if (!TabElement.Menu) TabElement.Menu = new Object();
                    TabElement.Menu.TabMenuEl = El;
                }
            }

            Item.Element = El;

            JmvcMachinery.Menu.ItemState(El, Item.State);

            if (Item.onRender) {
                if (jQuery.isFunction(Item.onRender)) eItem.MenuRender = Item.onRender;
                else eItem.MenuRender = new Function(Item.onRender);
                eItem.MenuRender(Item);
            }

            return El;
        },
        ItemState: function(El, State) {
            //State : ('Visible', 'NotVisible', 'Disabled', 'Secured', 'Selected')
            var iState = (State ? State : 'visible').toLowerCase();
            var currState = (El.getAttribute('ItemState') || '').toLowerCase();
            var dTab;

            if (currState == iState) return;

            var iData = El.Menu.ItemData;
            var MenuData = JmvcMachinery.Menu._MenuData(El);

            iData.State = iState;
            El.setAttribute('ItemState', iState);

            //Manage Tab Order
            switch (iState) {
            case 'selected':
            case 'visible':
                {
                    El.setAttribute('tabIndex', '0');
                    break;
                }
            default:
                {
                    El.setAttribute('tabindex', '-1');
                    break;
                }
            }

            if (JmvcMachinery.Browser.IE) // Force IE to refresh it's css
            {
                El.className = JmvcMachinery.Class.Add(El.className, 'ItemStateSet');
                El.className = JmvcMachinery.Class.Remove(El.className, 'ItemStateSet');
            }

            if (MenuData.SelectionMode) {
                if (MenuData.SelectionMode == 1 && iState == 'selected') {
                    $(El).parents('.menuContainer:first').find('.menuItem').each(function() {
                        if (this !== El) {
                            JmvcMachinery.Menu.ItemState(this, 'visible');

                            if (this.Menu.ItemData.TabElementID) {
                                dTab = document.getElementById(this.Menu.ItemData.TabElementID);
                                if (dTab) dTab.className = JmvcMachinery.Class.Add(dTab.className, 'ui-helper-hidden');
                            }
                        } else {
                            if (this.Menu.ItemData.TabElementID) {
                                dTab = document.getElementById(this.Menu.ItemData.TabElementID);
                                if (dTab) {
                                    dTab.className = JmvcMachinery.Class.Remove(dTab.className, 'ui-helper-hidden');
                                    $(dTab).parent().Resize(true);
                                }
                            }
                        }
                    });
                }
            }
        },
        _Item_KeyPress: function(e) {
            var This = JmvcMachinery.Menu._MenuItem(e.target);
            if (!This) return;

            var iState = This.getAttribute('ItemState').toLowerCase();

            switch (iState) {
            case 'visible':
            case 'selected':
                {
                    break;
                }
            default:
                //State is not to be acted upon by the event
                {
                    return;
                }
            }

            if (e.keyCode == 13 || e.keyCode == 32) {
                JmvcMachinery.Menu._Item_Click(e);
                e.stopPropagation();
            }
        },
        _Item_Click: function(e) {
            if (_.isFunction(e.stopPropagation)) e.stopPropagation();

            var This = JmvcMachinery.Menu._MenuItem(e.target);
            if (!This) return;

            var iState = This.getAttribute('ItemState').toLowerCase();
            var iData = This.Menu.ItemData;
            var MenuData = JmvcMachinery.Menu._MenuData(This);

            switch (iState) {
            case 'visible':
            case 'selected':
                {
                    break;
                }
            default:
                //State is not to be acted upon by the event
                {
                    return;
                }
            }

            if (MenuData.SelectionMode) {
                if (iState == 'visible') JmvcMachinery.Menu.ItemState(This, 'selected');
                else if (iState == 'selected') JmvcMachinery.Menu.ItemState(This, 'visible');
            }

            var ClickHandled = false;
            if (iData.onClick) {
                if (!This.Menu.Click) {
                    if (jQuery.isFunction(iData.onClick)) This.Menu.Click = iData.onClick;
                    else This.Menu.Click = new Function(iData.onClick);
                }
                This.Menu.Click(iData);
                ClickHandled = true;
            }
            if (MenuData.onClick) {
                if (!This.Menu.ClickAll) {
                    if (jQuery.isFunction(MenuData.onClick)) This.Menu.ClickAll = MenuData.onClick;
                    else This.Menu.ClickAll = new Function(MenuData.onClick);
                }
                This.Menu.ClickAll(iData);
                ClickHandled = true;
            }

            if (ClickHandled && !MenuData.SelectionMode) JmvcMachinery.Menu._PopMenu_Close();
        },
        _Item_MouseOver: function(e) {
            var jThis = $(this);

            var iState = jThis.attr('ItemState');
            var iPopMenu = jThis.attr('PopMenuID');

            var MenuData = JmvcMachinery.Menu._MenuData(jThis[0]);

            if (JmvcMachinery.Menu.Data.PopMenuClosing[iPopMenu]) {
                window.clearTimeout(JmvcMachinery.Menu.Data.PopMenuClosing[iPopMenu]);
                JmvcMachinery.Menu.Data.PopMenuClosing[iPopMenu] = undefined;
            }
        },
        _PopMenu_Init: function(El, Data) {
            El.setAttribute('PopMenuID', Data.ID);
            El.setAttribute('PopOpenOn', (!Data.PopOpenOn ? '0' : '1'));
            El.setAttribute('Resizable', true);

            JmvcMachinery.Events.Add(El, 'mouseover', JmvcMachinery.Menu._PopMenu_MouseOver);
            JmvcMachinery.Events.Add(El, 'mouseout', JmvcMachinery.Menu._PopMenu_MouseOut);

            if (!Data.PopOpenOn) JmvcMachinery.Events.Add(El, 'click', JmvcMachinery.Menu._PopMenu_Open);

            var pImg = document.createElement('div');
            pImg.className = 'menuPopImage';
            El.insertBefore(pImg, El.childNodes[El.childNodes.length - 1]);

            var PopImage_className = '';
            if (Data.PopPosition == 1) pImg.className = JmvcMachinery.Class.Add(pImg.className, 'menuPopImageRight');
            else pImg.className = JmvcMachinery.Class.Add(pImg.className, 'menuPopImageDown');

            var jPopImage = $(pImg);

            var PopContainer = document.createElement('div');
            PopContainer.id = Data.ID;

            PopContainer.className = 'menuPopContainer ui-helper-hidden';
            El.appendChild(PopContainer);

            var jPopContainer = $(PopContainer);
            jPopContainer.Menu_Init(Data);

            JmvcMachinery.Menu._PopMenu_Close(Data.ID);
        },
        _PopMenu_MouseOut: function(e) {
            var jThis = $(this);
            var MenuID = jThis.attr('PopMenuID');

            if (MenuID && MenuID != '') JmvcMachinery.Menu.Data.PopMenuClosing[MenuID] = window.setTimeout('JmvcMachinery.Menu._PopMenu_Close("' + MenuID + '");', 200);
        },
        _PopMenu_MouseOver: function(e) {
            var jThis = $(this);
            var MenuID = jThis.attr('PopMenuID');
            if (MenuID && MenuID != '') {
                if (JmvcMachinery.Menu.Data.PopMenuClosing[MenuID]) window.clearTimeout(JmvcMachinery.Menu.Data.PopMenuClosing[MenuID]);

                if (MenuID && jThis.attr('PopOpenOn') == '1') JmvcMachinery.Menu._PopMenu_Open(e);
            }
        },
        _PopMenu_Open: function(e) {
            var MenuItem = JmvcMachinery.Menu._MenuItem(e.target);
            if (!MenuItem) return;

            var jMenuItem = $(MenuItem);
            var popMenuID = jMenuItem.attr('PopMenuID');
            if (popMenuID && popMenuID != '') {
                jMenuItem.find('#' + popMenuID).each(function() {
                    JmvcMachinery.Menu._PopMenu_Position(this);
                });
            }
        },
        _PopMenu_Close: function(ID) {
            var jMenu;
            if (ID) {
                JmvcMachinery.Menu.Data.PopMenuClosing[ID] = undefined;
                jMenu = $('#' + ID);
            } else jMenu = $('.menuPopContainer');

            jMenu.each(function() {
                JmvcMachinery.Class.Add(this, 'ui-helper-hidden');
            });
        },
        _PopMenu_Position: function(Control) {
            var menuItem = JmvcMachinery.Menu._MenuItem(Control);
            var menuData = JmvcMachinery.Menu._MenuData(Control);

            if (!JmvcMachinery.Class.Check(Control, 'ui-helper-hidden')) return;
            JmvcMachinery.Class.Remove(Control, 'ui-helper-hidden');

            $(Control).Resize(true);

            var pOptions = {
                'element': Control,
                'parent': menuItem,
                'vertical': 'bottom',
                'horizontal': 'left'
            };

            switch (menuData.PopPosition) {
            case 1:
                //RightTop
                {
                    pOptions.vertical = 'top';
                    pOptions.horizontal = 'right';
                    break;
                }
            }

            JmvcMachinery.Layout.Absolutes.position(pOptions);
        },
        Layout_Tabs: function(TabStrip) {
            var jTabStrip = $(TabStrip);
            var MenuData = JmvcMachinery.Menu._MenuData(jTabStrip[0]);

            var Tabs = new Array();
            for (var I = 0; I < MenuData.Items.length; I++) {
                if (MenuData.Items[I].TabElementID) Tabs.push($('#' + MenuData.Items[I].TabElementID));
            }

            var jParent = jTabStrip.parent();
            while (jParent[0] && jParent[0].tagName.toLowerCase() == 'form')
            jParent = jParent.parent();

            var ParentLayout = jParent.layout();

            var TabHeight = ParentLayout.height.inner - jTabStrip.layout().height.outer;
            var TabWidth = ParentLayout.width.inner;

            jTabStrip.width(TabWidth);
            jParent.Resize(true);
        }
    };

    $.fn.extend({
        Menu_Init: function(Data) {
            var jMenuContainer = $(this);

            var d = new Date();
            var Start = d.getTime();
            JmvcMachinery.EventLog.Add({
                'Where': 'Menu_Init [' + this[0].className + ']'
            });

            jMenuContainer.each(function() {
                JmvcMachinery.Class.Add(this, 'menuContainer');
                JmvcMachinery.Class.Add(this, Data.ThemeName);

                this.Menu = {
                    'Data': Data
                };
            });

            jMenuContainer.click(JmvcMachinery.Menu._Item_Click);
            jMenuContainer.attr('Resizable', 'true');

            if (!Data.Orientation) {
                var eScrollLeft = document.createElement('div');
                eScrollLeft.className = 'menuScrollLeft';
                JmvcMachinery.Layout.layout(eScrollLeft, {
                    'width': ((Data.Orientation) ? 'fill' : 'fixed'),
                    'height': ((Data.Orientation) ? 'fixed' : 'fill')
                });
                jMenuContainer.append(eScrollLeft);
            }

            var eScrollBody = document.createElement('div');
            eScrollBody.className = 'menuScrollBody';
            eScrollBody.setAttribute('Resizable', 'true');
            JmvcMachinery.Layout.layout(eScrollBody, {
                'width': ((Data.Orientation) ? 'ignore' : 'fill'),
                'height': ((Data.Orientation) ? 'ignore' : 'fixed')
            });
            jMenuContainer.append(eScrollBody);

            var eMenuBody = document.createElement('div');
            eMenuBody.className = 'menuItemContainer';
            JmvcMachinery.Layout.layout(eMenuBody, {
                'width': ((Data.Orientation) ? 'smooth' : 'wrap'),
                'height': ((Data.Orientation) ? 'wrap' : 'smooth')
            });
            eScrollBody.appendChild(eMenuBody);

            if (!Data.Orientation) {
                var eScrollRight = document.createElement('div');
                eScrollRight.className = 'menuScrollRight';
                JmvcMachinery.Layout.layout(eScrollRight, {
                    'width': ((Data.Orientation) ? 'fill' : 'fixed'),
                    'height': ((Data.Orientation) ? 'fixed' : 'fill')
                });
                jMenuContainer.append(eScrollRight);
            }

            var cfContainer = document.createElement('div');
            cfContainer.className = 'ui-helper-clearfix';
            jMenuContainer.append(cfContainer);

            var jScrollLeft = $(eScrollLeft);
            var jScrollBody = $(eMenuBody);
            var jMenuBody = $(eMenuBody);
            var jScrollRight = $(eScrollRight);

            for (var i = 0; i < Data.Items.length; i++) {
                var Item = Data.Items[i];
                if (Item == undefined) break;

                var eItem = JmvcMachinery.Menu._Item_Init(Item, eMenuBody);

                if (Data.Orientation) {
                    var cfSep = document.createElement('div');
                    cfSep.className = 'ui-helper-clearfix';
                    eMenuBody.appendChild(cfSep);
                }
            }

            var cfBody = document.createElement('div');
            cfBody.className = 'ui-helper-clearfix';
            eMenuBody.appendChild(cfBody);

            if (Data.Orientation) {
                jMenuBody.css('height', '');
                jMenuContainer.css('height', '');
            }

            d = new Date();
            var End = d.getTime();
            JmvcMachinery.EventLog.Add({
                'Where': 'Menu_Init [' + this[0].className + ']',
                RunTime: (End - Start) + 'ms'
            });
        },
        PopMenu_Init: function(Data) {
            JmvcMachinery.Menu._PopMenu_Init(this[0], Data);
        },
        Menu_Selected: function() {
            var Data = $(this).find('.menuItem[itemstate|=selected]').map(function() {
                return this.Menu.ItemData;
            }).get();

            return Data;
        },
        MenuItem: function(criteria) {
            var items = new Array();

            $(this).find('.menuItem').each(function() {
                var iData = this.Menu.ItemData;
                if (JmvcMachinery.Objects.Match(iData, criteria)) items.push(JmvcMachinery.Menu._Item(this));
            });

            items.each = function(fn) {
                jQuery.each(this, fn);
            };

            return items;
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
