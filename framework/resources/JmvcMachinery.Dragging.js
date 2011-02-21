/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    /*
Start (Data, event) : function called when dragging Starts
Move (Diff, Data, event): function called while moving
End (Data, event) : function called when dragging ends

DragElement : HTML Element that is drug if different than the Dragging Element this is common in Header/Body dialog settings.  Dragging mapped on header but effects Body

Style : {Splitter, Resizer, Mover}

Resizer :
{
minHeight : Size MinMax Values
maxHeight
minWidth
maxWidth
}

Splitter :
{
minTop : Size MinMax Values
maxTop
minBottom
maxBottom
minLeft
maxLeft
minRight
maxRight
Top : Elements that the Splitter Adjusts
Bottom
Left
Right
}
*/

    GLOBAL.namespace("JmvcMachinery").Dragging = {
        Data: {
            DocumentEventsAttached: false,
            Element: undefined
        },
        Start: function(e) {
            var jThis = $(e.currentTarget);
            var curPos = {
                X: e.pageX,
                Y: e.pageY
            };

            JmvcMachinery.Events.Cancel(e);

            var Data = jThis.data('DraggingData');

            var El = Data.DragElement;
            if (El) {
                JmvcMachinery.Dragging.Data.Element = Data;

                JmvcMachinery.Dragging.Data.Element.Cords = new Object();

                JmvcMachinery.Dragging.Data.Element.Cords.Start = curPos;
                JmvcMachinery.Dragging.Data.Element.Cords.Current = curPos;
                JmvcMachinery.Dragging.Data.Element.Cords.Layout = JmvcMachinery.Layout.layout(El);
            }
        },
        End: function(e) {
            if (!JmvcMachinery.Dragging.Data.Element) return;

            if (JmvcMachinery.Dragging.Data.Element.End) JmvcMachinery.Dragging.Data.Element.End(JmvcMachinery.Dragging.Data.Element, e);

            JmvcMachinery.Dragging.Data.Element = undefined;
        },
        Move: function(e) {
            if (!JmvcMachinery.Dragging.Data.Element) return;

            var jThis = $(e.currentTarget);
            var curPos = {
                X: e.pageX,
                Y: e.pageY
            };

            //Check if Drug off Screen
            var bCancel = false;

            var sLayout = JmvcMachinery.Layout.screen();

            if (curPos.X < 0 || curPos.Y < 0 || curPos.X > sLayout.scroll.width || curPos.Y > sLayout.scroll.height) {
                JmvcMachinery.Dragging.End(e);
                bCancel = true;
            } else {

                var Diff = {
                    X: curPos.X - JmvcMachinery.Dragging.Data.Element.Cords.Current.X,
                    Y: curPos.Y - JmvcMachinery.Dragging.Data.Element.Cords.Current.Y
                };

                if (JmvcMachinery.Dragging.Data.Element.Move) JmvcMachinery.Dragging.Data.Element.Move(Diff, JmvcMachinery.Dragging.Data.Element, e);

                if (JmvcMachinery.Dragging.Data.Element.Style && JmvcMachinery.Dragging.Data.Element.Style.toLowerCase() == 'mover') {
                    var jDragElement = $(JmvcMachinery.Dragging.Data.Element.DragElement);

                    if (jDragElement.css('position')) {
                        var Pos = jDragElement.position();
                        if (jDragElement.css('position').toLowerCase() == 'absolute') Pos = jDragElement.offset();

                        jDragElement.css('top', (Pos.top + Diff.Y));
                        jDragElement.css('left', (Pos.left + Diff.X));
                    }
                }

                if (JmvcMachinery.Dragging.Data.Element.Style && JmvcMachinery.Dragging.Data.Element.Style.toLowerCase() == 'splitter') if (JmvcMachinery.Dragging.Data.Element.Splitter) {
                    if (JmvcMachinery.Dragging.Data.Element.Splitter.Left && Diff.X != 0) for (var i = 0; i < JmvcMachinery.Dragging.Data.Element.Splitter.Left.length; i++) {
                        var jSplit = $(JmvcMachinery.Dragging.Data.Element.Splitter.Left[i]);
                        jSplit.each(function() {
                            var jThis = $(this);
                            var nSize = jThis.width() + Diff.X;
                            if (nSize < JmvcMachinery.Dragging.Data.Element.Splitter.minLeft) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.minLeft;
                                bCancel = true;
                            }
                            if (nSize > JmvcMachinery.Dragging.Data.Element.Splitter.maxLeft) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.maxLeft;
                                bCancel = true;
                            }
                            jThis.width(nSize);
                        });
                    }
                    if (JmvcMachinery.Dragging.Data.Element.Splitter.Right && Diff.X != 0) for (i = 0; i < JmvcMachinery.Dragging.Data.Element.Splitter.Right.length; i++) {
                        jSplit = $(JmvcMachinery.Dragging.Data.Element.Splitter.Right[i]);
                        jSplit.each(function() {
                            var jThis = $(this);
                            var nSize = jThis.width() - Diff.X;
                            if (nSize < JmvcMachinery.Dragging.Data.Element.Splitter.minRight) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.minRight;
                                bCancel = true;
                            }
                            if (nSize > JmvcMachinery.Dragging.Data.Element.Splitter.maxRight) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.maxRight;
                                bCancel = true;
                            }

                            jThis.width(nSize);
                        });
                    }
                    if (JmvcMachinery.Dragging.Data.Element.Splitter.Top && Diff.Y != 0) for (i = 0; i < JmvcMachinery.Dragging.Data.Element.Splitter.Top.length; i++) {
                        jSplit = $(JmvcMachinery.Dragging.Data.Element.Splitter.Top[i]);
                        jSplit.each(function() {
                            var jThis = $(this);
                            var nSize = jThis.height() + Diff.Y;
                            if (nSize < JmvcMachinery.Dragging.Data.Element.Splitter.minTop) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.minTop;
                                bCancel = true;
                            }

                            if (nSize < JmvcMachinery.Dragging.Data.Element.Splitter.maxTop) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.maxTop;
                                bCancel = true;
                            }

                            jThis.height(nSize);
                        });
                    }
                    if (JmvcMachinery.Dragging.Data.Element.Splitter.Bottom && Diff.Y != 0) for (i = 0; i < JmvcMachinery.Dragging.Data.Element.Splitter.Bottom.length; i++) {
                        jSplit = $(JmvcMachinery.Dragging.Data.Element.Splitter.Bottom[i]);
                        jSplit.each(function() {
                            var jThis = $(this);
                            var nSize = jThis.height() - Diff.Y;
                            if (nSize < JmvcMachinery.Dragging.Data.Element.Splitter.minBottom) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.minBottom;
                                bCancel = true;
                            }

                            if (nSize < JmvcMachinery.Dragging.Data.Element.Splitter.minBottom) {
                                nSize = JmvcMachinery.Dragging.Data.Element.Splitter.maxBottom;
                                bCancel = true;
                            }

                            jThis.height(nSize);
                        });
                    }
                }

                if (JmvcMachinery.Dragging.Data.Element.Style && JmvcMachinery.Dragging.Data.Element.Style.toLowerCase() == 'resizer') {
                    var jDragElement = $(JmvcMachinery.Dragging.Data.Element.DragElement);
                    var nSize = {
                        height: jDragElement.height() + Diff.Y,
                        width: jDragElement.width() + Diff.X
                    };

                    if (nSize.height < JmvcMachinery.Dragging.Data.Element.Resizer.minHeight) {
                        nSize.height = JmvcMachinery.Dragging.Data.Element.Resizer.minHeight;
                        bCancel = true;
                    }
                    if (nSize.height > JmvcMachinery.Dragging.Data.Element.Resizer.maxHeight) {
                        nSize.height = JmvcMachinery.Dragging.Data.Element.Resizer.maxHeight;
                        bCancel = true;
                    }
                    if (nSize.width < JmvcMachinery.Dragging.Data.Element.Resizer.minWidth) {
                        nSize.width = JmvcMachinery.Dragging.Data.Element.Resizer.minWidth;
                        bCancel = true;
                    }
                    if (nSize.width > JmvcMachinery.Dragging.Data.Element.Resizer.maxWidth) {
                        nSize.width = JmvcMachinery.Dragging.Data.Element.Resizer.maxWidth;
                        bCancel = true;
                    }

                    jDragElement.width(nSize.width);
                    jDragElement.height(nSize.height);
                }
            }

            if (JmvcMachinery.Dragging.Data.Element && JmvcMachinery.Dragging.Data.Element.Cords) JmvcMachinery.Dragging.Data.Element.Cords.Current = curPos;

            if (bCancel) JmvcMachinery.Dragging.End(e);
        }
    };

    $.fn.extend({
        Dragging: function(Data) {
            var jThis = $(this);

            if (!Data) Data = new Object();
            if (!Data.DragElement) Data.DragElement = jThis[0];

            if (Data.Style && Data.Style.toLowerCase() == 'splitter') {
                if (!Data.Splitter) Data.Splitter = new Object();

                var SplitterSizing = ['minTop', 'minBottom', 'minLeft', 'minRight'];
                for (var i = 0; i < SplitterSizing.length; i++)
                Data.Splitter[SplitterSizing[i]] = Data.Splitter[SplitterSizing[i]] || 0;
                SplitterSizing = ['maxTop', 'maxBottom', 'maxLeft', 'maxRight'];
                for (i = 0; i < SplitterSizing.length; i++)
                Data.Splitter[SplitterSizing[i]] = Data.Splitter[SplitterSizing[i]] || 2000;

                var SplitterElements = ['Top', 'Bottom', 'Left', 'Right'];
                for (i = 0; i < SplitterElements.length; i++)
                Data.Splitter[SplitterElements[i]] = Data.Splitter[SplitterElements[i]] || new Array();
            }
            if (Data.Style && Data.Style.toLowerCase() == 'resizer') {
                if (!Data.Resizer) Data.Resizer = new Object();

                var Params = ['minWidth', 'minHeight'];
                for (var i = 0; i < Params.length; i++)
                Data.Resizer[Params[i]] = Data.Resizer[Params[i]] || 50;
                Params = ['maxWidth', 'maxHeight'];
                for (var i = 0; i < Params.length; i++)
                Data.Resizer[Params[i]] = Data.Resizer[Params[i]] || 2000;
            }

            jThis.data('DraggingData', Data);

            if (!JmvcMachinery.Dragging.Data.DocumentEventsAttached) {
                $(document).mousemove(function(event) {
                    JmvcMachinery.Dragging.Move(event);
                });
                $(document).mouseup(function(event) {
                    JmvcMachinery.Dragging.End(event);
                });
                JmvcMachinery.Dragging.Data.DocumentEventsAttached = true;
            }

            //JmvcMachinery.Events.Add(jThis[0], 'mousedown', JmvcMachinery.Dragging.Start);
            jThis.mousedown(function(event) {
                JmvcMachinery.Dragging.Start(event);
            });
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
