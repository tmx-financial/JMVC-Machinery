/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery").Layout =
{
    data:
    {
        ScrollBarWidth: 0,
        ScrollBarHeight: 0
    },
    style: function(el)
    {
        var Ret = undefined;

        if (window.getComputedStyle)
        Ret = window.getComputedStyle(el, null);
        else
        Ret = el.currentStyle;

        return Ret;
    },
    element: function(El)
    {
        try
        {
            var Ret = new Object();

            var currFloat = '';

            //odd Bug with margins
            if (JmvcMachinery.Browser.Chrome || JmvcMachinery.Browser.Safari)
            {
                currFloat = El.style.cssFloat;
                El.style.cssFloat = 'left';
            }

            var eStyle = JmvcMachinery.Layout.style(El);

            var border =
            {
                top: eStyle.borderTopWidth.replace('px', '') - 0,
                right: eStyle.borderRightWidth.replace('px', '') - 0,
                bottom: eStyle.borderBottomWidth.replace('px', '') - 0,
                left: eStyle.borderLeftWidth.replace('px', '') - 0,
                width: 0,
                height: 0
            };

            border.width = border.right + border.left;
            border.height = border.top + border.bottom;

            var padding =
            {
                top: eStyle.paddingTop.replace('px', '') - 0,
                right: eStyle.paddingRight.replace('px', '') - 0,
                bottom: eStyle.paddingBottom.replace('px', '') - 0,
                left: eStyle.paddingLeft.replace('px', '') - 0,
                width: 0,
                height: 0
            };

            padding.width = padding.right + padding.left;
            padding.height = padding.top + padding.bottom;

            var margin =
            {
                top: eStyle.marginTop.replace('px', '') - 0,
                right: eStyle.marginRight.replace('px', '') - 0,
                bottom: eStyle.marginBottom.replace('px', '') - 0,
                left: eStyle.marginLeft.replace('px', '') - 0,
                width: 0,
                height: 0
            };

            margin.width = margin.right + margin.left;
            margin.height = margin.top + margin.bottom;

            for (var i in border)
            if (isNaN(border[i])) border[i] = 0;
            for (var i in padding)
            if (isNaN(padding[i])) padding[i] = 0;
            for (var i in margin)
            if (isNaN(margin[i])) margin[i] = 0;

            var clientWidth = El.clientWidth;
            var clientHeight = El.clientHeight;

            if (clientWidth <= padding.width)
            {
                clientWidth = $(El).width() - padding.width - border.width;
            }
            if (clientHeight <= padding.height)
            {
                clientHeight = $(El).height() - padding.height - border.height;
            }

            Ret.width =
            {
                inner: clientWidth - padding.width,
                outer: El.offsetWidth + margin.width
            };

            Ret.height =
            {
                inner: clientHeight - padding.height,
                outer: El.offsetHeight + margin.height
            };
            Ret.border = border;
            Ret.padding = padding;
            Ret.margin = margin;

            //odd Bug with margins
            if (JmvcMachinery.Browser.Chrome || JmvcMachinery.Browser.Safari)
            {
                El.style.cssFloat = currFloat;
            }

            return Ret;
        }
        catch(Err)
        {
            return undefined;
        }
    },
    position: function(El)
    {
        var T = L = 0;
        var wEl = El;

        if (wEl && wEl.offsetParent)
        {
            do
            {
                if (JmvcMachinery.Layout.style(wEl).position == 'absolute')
                  break;
                
                L += wEl.offsetLeft;
                T += wEl.offsetTop;
            }
            while (wEl = wEl.offsetParent);
        }

        return {
            top: T,
            left: L
        };
    },
    scrollBars: function()
    {
        function _ScrollBarWidth()
        {
            if (JmvcMachinery.Layout.data.ScrollBarWidth != 0)
            return JmvcMachinery.Layout.data.ScrollBarWidth;

            var inner = document.createElement('p');
            inner.style.width = '100%';
            inner.style.height = '200px';

            var outer = document.createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.style.width = '200px';
            outer.style.height = '150px';
            outer.style.overflow = 'hidden';
            outer.appendChild(inner);

            document.body.appendChild(outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 == w2) w2 = outer.clientWidth;

            document.body.removeChild(outer);

            JmvcMachinery.Layout.data.ScrollBarWidth = (w1 - w2);
            return JmvcMachinery.Layout.data.ScrollBarWidth;
        };
        function _ScrollBarHeight()
        {
            if (JmvcMachinery.Layout.data.ScrollBarHeight != 0)
            return JmvcMachinery.Layout.data.ScrollBarHeight;

            var inner = document.createElement('p');
            inner.style.height = '100%';
            inner.style.width = '200px';

            var outer = document.createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.style.height = '200px';
            outer.style.width = '150px';
            outer.style.overflow = 'hidden';
            outer.appendChild(inner);

            document.body.appendChild(outer);
            var h1 = inner.offsetHeight;
            outer.style.overflow = 'scroll';
            var h2 = inner.offsetHeight;
            if (h1 == h2) h2 = outer.clientHeight;

            document.body.removeChild(outer);

            JmvcMachinery.Layout.data.ScrollBarHeight = (h1 - h2);
            return JmvcMachinery.Layout.data.ScrollBarHeight;
        };

        return { width: _ScrollBarWidth(), height: _ScrollBarHeight() };
    },
    screen: function()
    {

        var sX = sY = W = H = sW = sH = sbW = sbH = 0;

        W = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        sX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        sY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        sW = document.body.scrollWidth || document.documentElement.scrollWidth || window.scrollMaxX;
        sH = document.body.scrollHeight || document.documentElement.scrollHeight || window.scrollMaxY;

        var rtn =
        {
            width:
            {
                inner: W,
                outer: W
            },
            height:
            {
                inner: H,
                outer: H
            },
            scroll:
            {
                width: sW,
                height: sH,
                left: sX,
                top: sY
            }
        };
        
        return rtn;
    },
    layout: function(El, data)
    {
        var LayoutData =
        {
            width: 'ignore',
            widthMin: 0,
            widthMax: 0,
            height: 'ignore',
            heightMin: 0,
            heightMax: 0
        };

        if (data)
        {
            if (_.isString(data))
            El.setAttribute('Layout', data);
            else
            {
                jQuery.extend(LayoutData, data);
                var aData = new Array();
                aData.push('width:');
                aData.push(LayoutData.width);
                aData.push(LayoutData.widthMin);
                aData.push(LayoutData.widthMax);
                aData.push(';');
                aData.push('height:');
                aData.push(LayoutData.height);
                aData.push(LayoutData.heightMin);
                aData.push(LayoutData.heightMax);
                aData.push(';');

                El.setAttribute('Layout', aData.join(' '));
            }
            return;
        }

        var sLayout = El.getAttribute('Layout');
        sLayout = (!sLayout ? '': sLayout.toLowerCase());

        var regExp = new RegExp(/(width|height)\:[\s]*(fixed|fill|smooth|wrap|ignore|[\d]*)\s*([\d]+)?(?:(?:[\s]+)([\d]+)(?:[\;]?))?/mig);
        var result = new Array();
        var match;
        do
        {
            match = regExp.exec(sLayout);
        }
        while (match && result.push(match));

        var LD = {};
        for (var z = 0; z < result.length; z++)
        {
            var section = result[z][1].substr(0, 1).toLowerCase();
            switch (section)
            {
            case 'w':
                LD.width = result[z][2];
                LD.widthMin = result[z][3];
                LD.widthMax = result[z][4];
                break;
            case 'h':
                LD.height = result[z][2];
                LD.heightMin = result[z][3];
                LD.heightMax = result[z][4];
                break;
            }
        }

        jQuery.extend(LayoutData, LD);

        if (_.isNumeric(LayoutData.width))
        LayoutData.width = _.readNumber(LayoutData.width);
        LayoutData.widthMin = _.readNumber(LayoutData.widthMin);
        LayoutData.widthMax = _.readNumber(LayoutData.widthMax);
        if (_.isNumeric(LayoutData.height))
        LayoutData.height = _.readNumber(LayoutData.height);
        LayoutData.heightMin = _.readNumber(LayoutData.heightMin);
        LayoutData.heightMax = _.readNumber(LayoutData.heightMax);

        return LayoutData;
    },
    Absolutes:
    {
        /*
       * options
       *  element: the absolutely positioned element to position
       *  vertical: (center (default), top, bottom)
       *  horizontal: (center (default), left, right)
       *  vOffset: #   the amount to move the element after placement
       *  hOffset: #   the amount to move the element after placement
       *  vAnchor: (top (default), bottom, center)  the point on the element to position from
       *  hAnchor: (left (default), right, center)  the point on the element to position from
       *  parent: (optional) element to orientate the placement of the absolute item with
       *  placementID: optional string to store the placement of the item to reproduce the placement
       */
        position: function(options)
        {
            var wOptions =
            {
                vertical: 'center',
                horizontal: 'center',
                vOffset: 0,
                hOffset: 0
            };

            jQuery.extend(wOptions, options);
            
            wOptions.vertical = wOptions.vertical.toLowerCase();
            wOptions.horizontal = wOptions.horizontal.toLowerCase();
            
            var pLayout;
            var pPosition;
            if (_.isHTMLElement(wOptions.parent))
            {
              pLayout = JmvcMachinery.Layout.element(wOptions.parent);
              pPosition = JmvcMachinery.Layout.position(wOptions.parent);
            }
            else
            {
              pLayout = JmvcMachinery.Layout.screen();
              pPosition = JmvcMachinery.Layout.position();
            }

            eLayout = JmvcMachinery.Layout.element(wOptions.element);
            
            function _position(wOptions)
            {
              var t = l = 0;
              
              switch (wOptions.vertical)
              {
                case 'top':
                {
                  t = pPosition.top;
                  break;
                }
                case 'bottom':
                {
                  t = pPosition.top + pLayout.height.outer;
                  break;
                }
                default:  /*center*/
                {
                  t = Math.floor((pPosition.top + pLayout.height.outer) / 2);
                }
              }
              
              switch (wOptions.horizontal)
              {
                case 'left':
                {
                  l = pPosition.left;
                  break;
                }
                case 'right':
                {
                  l = pPosition.left + pLayout.width.outer;
                  break;
                }
                default:  /*center*/
                {
                  l = Math.floor((pPosition.left + pLayout.width.outer) / 2);
                }
              }
              
              switch (wOptions.vAnchor)
              {
                case 'bottom':
                {
                  t = t - eLayout.height.outer;
                  break;
                }
                case 'center':
                {
                  t = t - Math.floor(eLayout.height.outer / 2);
                  break;
                }
                default:  /*top*/
                {
                  /* no change to t */
                }
              }
              switch (wOptions.hAnchor)
              {
                case 'right':
                {
                  l = l - eLayout.height.outer;
                  break;
                }
                case 'center':
                {
                  l = l - Math.floor(eLayout.width.outer / 2);
                  break;
                }
                default:  /*left*/
                {
                  /* no change to l */
                }
              }
              
              wOptions.element.style.top = t + 'px';
              wOptions.element.style.left = l + 'px';
            }
            
            _position(wOptions);
            
            /* check visibility */
        },
        hide: function(El)
        {
          
        }
    },
    dock: function(El)
    {
        var c = El;
        if (_.isString(c))
        c = document.getElementById(c);

        if (!c) return;

        function _myChildren(parent)
        {
            var children = new Array();

            for (var i = 0; i < parent.childNodes.length; i++)
            {
                if (_.isHTMLElement(parent.childNodes[i]) && parent.childNodes[i].parentNode === parent)
                {
                    var cStyle = JmvcMachinery.Layout.style(parent.childNodes[i]);
                    if (cStyle.display != 'none' && cStyle.position != 'absolute' && cStyle.position != 'relative' && cStyle.position != 'fixed' && cStyle.display != 'none')
                    children.push(parent.childNodes[i]);
                }
            }
            for (var i = 0; i < children.length; i++)
            {
                children[i].LayoutData = JmvcMachinery.Layout.layout(children[i]);
                children[i].LayoutData.Layout = JmvcMachinery.Layout.element(children[i]);
            }
            
            return children;
        }

        function _SmoothWrap(parent)
        {
          $(parent).Resize(true);
          
          var pWidth = 0;
          var pHeight = 0;
          var pWidthSmooth = 0;
          var pHeightSmooth = 0;
          
          var children = _myChildren(parent);
          
          for (var i = 0; i < children.length; i++)
          {
            var child = children[i];
            if (parent.LayoutData.width == 'wrap')
              pWidth = pWidth + child.LayoutData.Layout.width.outer;
            if (parent.LayoutData.height == 'wrap')
              pHeight = pHeight + child.LayoutData.Layout.height.outer;
            if (parent.LayoutData.width == 'smooth' && child.LayoutData.Layout.width.outer > pWidthSmooth)
              pWidthSmooth = child.LayoutData.Layout.width.outer;
            if (cLayout.height == 'smooth' && child.LayoutData.Layout.height.outer > pHeightSmooth)
              pHeightSmooth = child.LayoutData.Layout.height.outer;
          }
          if (pWidthSmooth || pHeightSmooth)
          {
            for (i = 0; i < children.length; i++)
            {
              var child = children[i];
              if (pWidthSmooth)
              {
                child.style.width = (pWidthSmooth - (child.LayoutData.Layout.border.width + child.LayoutData.Layout.padding.width  + child.LayoutData.Layout.margin.width)) + 'px';
                pWidth = pWidthSmooth;
              }
              if (pHeightSmooth)
              {
                child.style.height = (pHeightSmooth - (child.LayoutData.Layout.border.height + child.LayoutData.Layout.padding.height  + child.LayoutData.Layout.margin.height)) + 'px';
                pHeight = pHeightSmooth;
              }
            }
          }
          if (pWidth)
          {
            parent.style.width = (pWidth + (parent.LayoutData.Layout.border.width + parent.LayoutData.Layout.padding.width  + parent.LayoutData.Layout.margin.width)) + 'px';
          }
          if (pHeight)
          {
            parent.style.height = (pHeight + (parent.LayoutData.Layout.border.height + parent.LayoutData.Layout.padding.height  + parent.LayoutData.Layout.margin.height)) + 'px';
          }
        }

        function _dock(nWidth, nHeight)
        {
          /*
            JmvcMachinery.EventLog.Add({
                where: 'JmvcMachinery.Layout.dock._dock',
                what: (El.id || El.className || 'undefined Element'),
                nWidth: nWidth,
                nHeight: nHeight
            });
          */
          
            var children = _myChildren(c);

            //Smooth Wrap
            for (var i = 0; i < children.length; i++)
            {
                var child = children[i];

                if (child.LayoutData.width == 'smooth' || child.LayoutData.width == 'wrap' || child.LayoutData.height == 'smooth' || child.LayoutData.height == 'wrap')
                {
                  _SmoothWrap(child);
                  if (child.LayoutData.width == 'smooth' || child.LayoutData.width == 'wrap')
                    nWidth -= child.LayoutData.Layout.width.outer;
                  if (child.LayoutData.height == 'smooth' || child.LayoutData.height == 'wrap')
                    nHeight -= child.LayoutData.Layout.height.outer;
                }
            }
            
            //Fixed
            for (i = 0; i < children.length; i++)
            {
                var child = children[i];

                if (child.LayoutData.width == 'fixed')
                nWidth -= child.LayoutData.Layout.width.outer;

                if (child.LayoutData.height == 'fixed')
                nHeight -= child.LayoutData.Layout.height.outer;
            }

            //Fill
            for (i = 0; i < children.length; i++)
            {
                var child = children[i];

                if (child.LayoutData.width == 'fill')
                {
                    var childWidth = nWidth - (child.LayoutData.Layout.padding.width + child.LayoutData.Layout.border.width + child.LayoutData.Layout.margin.width);

                    if (childWidth < child.LayoutData.widthMin)
                    childWidth = child.LayoutData.widthMin;

                    if (child.LayoutData.widthMax && childWidth > child.LayoutData.widthMax)
                    childWidth = child.LayoutData.widthMax;

                    child.style.width = childWidth + 'px';
                }
                if (child.LayoutData.height == 'fill')
                {
                    var childHeight = nHeight - (child.LayoutData.Layout.padding.height + child.LayoutData.Layout.border.height + child.LayoutData.Layout.margin.height);

                    if (childHeight < child.LayoutData.heightMin)
                    childHeight = child.LayoutData.heightMin;

                    if (child.LayoutData.heightMax && childHeight > child.LayoutData.heightMax)
                    childHeight = child.LayoutData.heightMax;

                    child.style.height = childHeight + 'px';
                }
            }

            //Weighted Split
            var wSplitChildren = new Array();
            var hSplitChildren = new Array();
            for (i = 0; i < children.length; i++)
            {
                if (_.isNumeric(children[i].LayoutData.width))
                wSplitChildren.push(children[i]);
                if (_.isNumeric(children[i].LayoutData.height))
                hSplitChildren.push(children[i]);
            }

            if (wSplitChildren.length)
            {
              /*
                JmvcMachinery.EventLog.Add({
                    where: 'JmvcMachinery.Layout.dock._dock wSplitChildren',
                    what: (El.id || El.className || 'undefined Element'),
                    nWidth: nWidth,
                    childrenCount: wSplitChildren.length
                });
              */
                var tWidth = nWidth;
                var wHappy = false;

                while (!wHappy)
                {
                    var weightedWidth = 0;
                    for (i = 0; i < wSplitChildren.length; i++)
                    {
                        if (!wSplitChildren[i].LayoutData.widthComplete)
                        {
                            weightedWidth = weightedWidth + wSplitChildren[i].LayoutData.width;
                        }
                    }
                    for (i = 0; i < wSplitChildren.length; i++)
                    {
                        var child = wSplitChildren[i];
                        if (!child.LayoutData.widthComplete)
                        {
                            var Proposed = Math.floor((tWidth * (child.LayoutData.width / weightedWidth)));

                            if (Proposed < child.LayoutData.widthMin)
                            {
                                child.LayoutData.widthFinal = child.LayoutData.widthMin;
                                child.LayoutData.widthComplete = 'MinMax';
                                child.LayoutData.widthHappy = false;
                            }
                            if (child.LayoutData.widthMax && Proposed > child.LayoutData.widthMax)
                            {
                                child.LayoutData.widthFinal = child.LayoutData.widthMax;
                                child.LayoutData.widthComplete = 'MinMax';
                                child.LayoutData.widthHappy = false;
                            }
                            if (!child.LayoutData.widthComplete)
                            {
                                child.LayoutData.widthFinal = Proposed;
                                child.LayoutData.widthHappy = true;
                            }
                        }
                    }
                    wHappy = true;
                    for (i = 0; i < wSplitChildren.length; i++)
                    if (!wSplitChildren[i].LayoutData.widthHappy)
                    {
                        wHappy = false;
                        break;
                    }
                    for (i = 0; i < wSplitChildren.length; i++)
                    {
                        var child = wSplitChildren[i];
                        if (child.LayoutData.widthComplete == 'MinMax')
                        {
                            tWidth = tWidth - child.LayoutData.widthFinal;
                            child.LayoutData.widthComplete = true;
                            child.LayoutData.widthHappy = true;
                        }
                    }
                }
                for (i = 0; i < wSplitChildren.length; i++)
                {
                    var finalWidth = wSplitChildren[i].LayoutData.widthFinal - (wSplitChildren[i].LayoutData.Layout.padding.width + wSplitChildren[i].LayoutData.Layout.border.width + wSplitChildren[i].LayoutData.Layout.margin.width);
                    if (finalWidth < 0) {
                        finalWidth = 0;
                    }
                    wSplitChildren[i].LayoutData.widthFinal = finalWidth;
                    wSplitChildren[i].style.width = finalWidth + 'px';
                }
            }
            if (hSplitChildren.length)
            {
                var tHeight = nHeight;
                var hHappy = false;

                while (!hHappy)
                {
                    var weightedHeight = 0;
                    for (i = 0; i < hSplitChildren.length; i++)
                    {
                        if (!hSplitChildren[i].LayoutData.heightComplete)
                        {
                            weightedHeight = weightedHeight + hSplitChildren[i].LayoutData.height;
                        }
                    }
                    for (i = 0; i < hSplitChildren.length; i++)
                    {
                        var child = hSplitChildren[i];
                        if (!child.LayoutData.heightComplete)
                        {
                            var Proposed = Math.floor((tHeight * (child.LayoutData.height / weightedHeight)));

                            if (Proposed < child.LayoutData.heightMin)
                            {
                                child.LayoutData.heightFinal = child.LayoutData.heightMin;
                                child.LayoutData.heightComplete = 'MinMax';
                                child.LayoutData.heightHappy = false;
                            }
                            if (child.LayoutData.heightMax && Proposed > child.LayoutData.heightMax)
                            {
                                child.LayoutData.heightFinal = child.LayoutData.heightMax;
                                child.LayoutData.heightComplete = 'MinMax';
                                child.LayoutData.heightHappy = false;
                            }
                            if (!child.LayoutData.heightComplete)
                            {
                                child.LayoutData.heightFinal = Proposed;
                                child.LayoutData.heightHappy = true;
                            }
                        }
                    }
                    hHappy = true;
                    for (i = 0; i < hSplitChildren.length; i++)
                    if (!hSplitChildren[i].LayoutData.heightHappy)
                    {
                        hHappy = false;
                        break;
                    }
                    for (i = 0; i < hSplitChildren.length; i++)
                    {
                        var child = hSplitChildren[i];
                        if (child.LayoutData.heightComplete == 'MinMax')
                        {
                            tHeight = tHeight - child.LayoutData.heightFinal;
                            child.LayoutData.heightComplete = true;
                            child.LayoutData.heightHappy = true;
                        }
                    }
                }
                for (i = 0; i < hSplitChildren.length; i++)
                {
                    hSplitChildren[i].LayoutData.heightFinal = hSplitChildren[i].LayoutData.heightFinal - (hSplitChildren[i].LayoutData.Layout.padding.height + hSplitChildren[i].LayoutData.Layout.border.height + hSplitChildren[i].LayoutData.Layout.margin.height);
                    hSplitChildren[i].style.height = hSplitChildren[i].LayoutData.heightFinal + 'px';
                }
            }
        }
        
        var cOverFlow =
        {
            OF: c.style.overflow,
            X: c.style.overflowX,
            Y: c.style.overflowY
        };

        c.style.overflow = 'hidden';
        c.style.overflowX = 'hidden';
        c.style.overflowY = 'hidden';

        var cLayout = JmvcMachinery.Layout.element(c);

        var Screen = JmvcMachinery.Layout.screen();
        var scrollBars = JmvcMachinery.Layout.scrollBars();
        
        if (_.isHTMLBody(c))
        {
            var bodyWidth = Screen.width.inner - (cLayout.padding.width + cLayout.border.width + cLayout.margin.width);
            var bodyHeight = Screen.height.inner - (cLayout.padding.height + cLayout.border.height + cLayout.margin.height);

            c.style.width = bodyWidth + 'px';
            c.style.height = bodyHeight + 'px';

            cLayout = JmvcMachinery.Layout.element(c);
        }

        var nWidth = cLayout.width.inner;
        var nHeight = cLayout.height.inner;

        _dock(nWidth, nHeight);

        if (JmvcMachinery.Browser.FireFox || JmvcMachinery.Browser.Opera)
        {
            if (c.scrollWidth > (c.clientWidth + cLayout.border.width))
            nHeight -= scrollBars.height;
            if (c.scrollHeight > (c.clientHeight + cLayout.border.height))
            nWidth -= scrollBars.width;
        }
        else
        {
            if (c.scrollWidth > c.clientWidth)
            nHeight -= scrollBars.height;
            if (c.scrollHeight > c.clientHeight)
            nWidth -= scrollBars.width;
        }

        //try again if scrollbars are needed
        if (nWidth != cLayout.width.inner || nHeight != cLayout.height.inner)
        _dock(nWidth, nHeight);

        c.style.overflow = cOverFlow.OF;
        c.style.overflowX = cOverFlow.X;
        c.style.overflowY = cOverFlow.Y;
    }
};

$.fn.extend({
    Fit_Horizontal: function()
    {

        var Children = this.children();
        if (Children.length == 0) return;

        var wWidth = 0;

        Children.each(function()
        {
            var jThis = $(this);
            var Pos = jThis.css('position');
            if (Pos != 'absolute' && Pos != 'relative')
            wWidth += jThis.outerWidth(true);
        });

        this.width(wWidth);
    },
    Fit_Vertical: function()
    {
        var Children = this.children();

        var cOuter = cWidth = wWidth = wHeight = 0;

        Children.each(function()
        {
            var jThis = $(this);
            var Pos = jThis.css('position');
            if (Pos != 'absolute' && Pos != 'relative')
            {
                cWidth = jThis.outerWidth(true);
                wWidth = (cWidth > wWidth ? cWidth: wWidth);
                wHeight += jThis.outerHeight(true);
            }
        });

        Children.each(function()
        {
            var jThis = $(this);
            var Pos = jThis.css('position');
            if (Pos != 'absolute' && Pos != 'relative')
            jThis.setOuterWidth(wWidth);
        });

        this.width(wWidth);
        this.height(wHeight);
    },

    layout: function()
    {
        return JmvcMachinery.Layout.element(this[0]);
    },
    setOuterWidth: function(outerWidth)
    {
        //odd Chrome Bug with margins
        var currFloat = '';
        if (JmvcMachinery.Browser.Chrome)
        {
            var currFloat = this[0].style.cssFloat;
            this[0].style.cssFloat = 'left';
        }

        //parseInt on the css width is a work around for IE.
        //Could not use this.width(), it gave the wrong value if borders exist.
        var cssWidth = this.css('width');
        var parsedWidth = undefined;
        if (cssWidth)
        {
            parsedWidth = parseInt(cssWidth.replace('px', ''));
        }
        parsedWidth = isNaN(parsedWidth) ? this.width() : parsedWidth;
        var widthDiff = this.outerWidth(true) - parsedWidth;
        var innerWidth = outerWidth - widthDiff;
        var newWidth = innerWidth >= 0 ? innerWidth: 0;
        if (parsedWidth != newWidth)
        this.css("width", newWidth + "px");

        //Undo Chrome bug
        if (JmvcMachinery.Browser.Chrome)
        {
            this[0].style.cssFloat = currFloat;
        }

        return newWidth;
    },
    setOuterHeight: function(outerHeight)
    {
        //odd Chrome Bug with margins
        var currFloat = '';
        if (JmvcMachinery.Browser.Chrome)
        {
            var currFloat = this[0].style.cssFloat;
            this[0].style.cssFloat = 'left';
        }

        var cssHeight = this.css('height');
        var parsedHeight = undefined;
        if (cssHeight)
        {
            parsedHeight = parseInt(cssHeight.replace('px', ''));
        }
        parsedHeight = isNaN(parsedHeight) ? this.height() : parsedHeight;
        var heightDiff = this.outerHeight(true) - parsedHeight;
        var innerHeight = outerHeight - heightDiff;
        var newHeight = innerHeight >= 0 ? innerHeight: 0;
        if (parsedHeight != newHeight)
        this.css("height", newHeight + "px");

        //Undo Chrome bug
        if (JmvcMachinery.Browser.Chrome)
        {
            this[0].style.cssFloat = currFloat;
        }

        return newHeight;
    },
    getEqualColumnWidths: function(columns)
    {
        var width = parseInt(this.css('width').replace('px', ''));
        width = isNaN(width) ? this.width() : width;
        return Math.floor(width / columns);
    }

});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
