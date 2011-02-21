/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery").Themes =
{
    CurrentTheme: 'ThemeBlue',
    Change: function(ThemeName)
    {
        var nowTheme = JmvcMachinery.Themes.CurrentTheme;
        JmvcMachinery.Themes.CurrentTheme = ThemeName;
        JmvcMachinery.LocalStore.Save('JmvcMachineryTheme', ThemeName);
        
        $('body, .appArea').each(function()
        {
            var jThis = $(this);
            jThis.removeClass(nowTheme);
            jThis.addClass(ThemeName);
        });
    },

	Init: function()
	{
	    var currTheme = JmvcMachinery.LocalStore.Get('JmvcMachineryTheme');
	    currTheme = (!currTheme ? JmvcMachinery.Themes.CurrentTheme : currTheme);
	    JmvcMachinery.Themes.Change(currTheme);
	}
};

//===============================
} (window, (function() {
    return;
} ())));
//===============================
