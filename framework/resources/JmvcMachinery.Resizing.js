/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery").Resizing =
{
    Data:
    {
		ScreenLayout: undefined,
        TimerDelay: 40,
        TimerEvent: undefined
    },

    Timer: function()
    {
        JmvcMachinery.Resizing.Data.TimerEvent = undefined;

        JmvcMachinery.EventLog.Add({ 'Where': 'JmvcMachinery.Resizing.Timer', 'What': 'Resizing Started' });
        jQuery.Resize();

        window.setTimeout(jQuery.Resize, 15);
    },
    Resize: function()
    {
        JmvcMachinery.EventLog.Add({ 'Where': 'JmvcMachinery.Resizing.Resize (Set Resize Timer)', 'Clear Current Event': (JmvcMachinery.Resizing.Data.TimerEvent ? 'Clear' : 'Not Cleared') });

        window.clearTimeout(JmvcMachinery.Resizing.Data.TimerEvent);

        JmvcMachinery.Resizing.Data.TimerEvent = window.setTimeout(JmvcMachinery.Resizing.Timer, JmvcMachinery.Resizing.Data.TimerDelay);
    }
};

$(window).resize(function ()
{
	//Check vs last layout to insure we aren't doing IE silly work.
	var W = document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
	var H = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;

	var ScreenLayout = W + ':' + H;

	if (ScreenLayout != JmvcMachinery.Resizing.Data.ScreenLayout)
	{
		JmvcMachinery.Resizing.Data.ScreenLayout = ScreenLayout;
		JmvcMachinery.EventLog.Add({ Where: 'JmvcMachinery.Resizing', Event: 'Resize Triggered from Window Resize' });
		JmvcMachinery.Resizing.Resize();
	}
});

$.extend({
    Resize: function()
    {
        $('[Resizable=true]').Resize();
    }
});
$.fn.extend({
  /*
   * options:
   *    function (sets resize custom code on items)
   *    true ((recursive) resize these elements and all children)
   * 
   */
	Resize: function (options)
	{
		if (_.isFunction(options))
		{
			for (var i = 0; i < this.length; i++)
			{
				$(this[i]).attr('Resizable', 'true');
				if (!this[i].onResize)
					this[i].onResize = new Array();
				this[i].onResize.push(options);
			}
		}
		else
		{
			for (i = 0; i < this.length; i++)
			{
				if (this[i].onResize)
				{
					for (var x = 0; x < this[i].onResize.length; x++)
					{
						var d = new Date();
						var Start = d.getTime();

						this[i].onResizeRuntime = this[i].onResize[x];
						this[i].onResizeRuntime();
						d = new Date();
						var End = d.getTime();
						JmvcMachinery.EventLog.Add({ Where: 'JmvcMachinery.Resize', Event: 'Resize [' + this[i].className + ']', RunTime: (End - Start) + 'ms' });
					}
				}
				else
				{
					var d = new Date();
					var Start = d.getTime();
					JmvcMachinery.Layout.dock(this[i]);
					d = new Date();
					var End = d.getTime();
					JmvcMachinery.EventLog.Add({ Where: 'JmvcMachinery.Resize(Layout)', Event: 'Resize [' + this[i].className + ']', RunTime: (End - Start) + 'ms' });
				}
				if (options == true)
				{
				  this.find("[Resizable=true]:visible").Resize();
				}
			}

			//odd behavior correction that happens in FF sometimes
			$('html').scrollTop(0);
			$('html').scrollLeft(0);
		}
	}
});


//===============================
} (window, (function() {
    return;
} ())));
//===============================
