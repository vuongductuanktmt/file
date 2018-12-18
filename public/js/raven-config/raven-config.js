//setting for vuejs ( version > 2 )
Raven.config('https://7185f039caab4657984eba351856dc1f@sentry.io/1216709',{
        environment: 'VueJs',
        whitelistUrls: [/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?([A-Za-z0-9.-]*\.)?cloudjetkpi\.com/,],
    })
    .addPlugin(Raven.Plugins.Vue)
    .install();

//setting for javascript
Raven.config('https://7185f039caab4657984eba351856dc1f@sentry.io/1216709').install();

$(document).ajaxError(function( event, request, settings ) {
  Raven.captureException(new Error(JSON.stringify(request)));
});
