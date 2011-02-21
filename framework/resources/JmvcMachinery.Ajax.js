(function($) {
    var proxiedAjax = $.ajax;
    $.ajax = function(options) {
        var proxiedBeforeSendHandler = options.beforeSend;
        var proxiedSuccessHandler = options.success;
        var proxiedErrorHandler = options.error;

        var extendedoptions = $.extend(options, {
            beforeSend: function(xhr) {
                
                xhr.setRequestHeader('Pragma', 'javascript-mvc-client');
                
                if(proxiedBeforeSendHandler) {
                    proxiedBeforeSendHandler(xhr);
                }
            },
            success: function(data, textStatus, xhr) {
                var handled = false;
                
                if (!handled && data && data.errorTitle && data.errorMessages) {
                    if(proxiedErrorHandler) {
                        proxiedErrorHandler(xhr, data.errorTitle, data.errorMessages);
                    }
                    handled = true;
                }

                if (!handled && data && data.object) {
                    if (proxiedSuccessHandler) {
                        proxiedSuccessHandler(data.object, 'success', xhr);
                    }
                    handled = true;
                }
                
                if(!handled) {
                    if (proxiedSuccessHandler) {
                        proxiedSuccessHandler(data, 'success', xhr);
                    }
                    handled = true;
                }
            },
            error : function(xhr, status, error) {
                $.blockUI({ message: '<h1>Unexpected Exception!\nThe server responded with HTTP ' + xhr.status + ': ' + xhr.statusText + '</h1>' });
            }
        });
        
        return proxiedAjax(extendedoptions);
    };
})(jQuery);