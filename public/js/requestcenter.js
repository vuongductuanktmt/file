/**
 * Created by khangtd on 08/03/2017.
 * Edit by DucTuan @@
 * Fixed bugs by Toanalien 09/05/2017
 * REF: http://api.jquery.com/jquery.ajax/
 */

// include jsi18n
//$.getScript('/jsi18n/');
// It's time to init

// Global configuration for RequestCenter
var REDIRECT_PREFIX = '?next=';
var LOGIN_URL = '/login/';


var message_request = '';
var show_notification = true;
// This request center to manage objects which handling request/response.
var RequestCenter = (function () {
    var spawned = 0; // Private attribute
    var stopped = 0; // Private attribute
    // Define methods, attributes for request instance.
    // Also private method
    var RequestInstance = (function () {
        return function abcd(center, beforeSendTrigger, successTrigger, errorTrigger, completeTrigger) {
            this.id = 0;
            this.ajax = null;
            // Override event of ajax param.
            this.beforeSendTrigger = beforeSendTrigger;
            this.errorTrigger = errorTrigger;
            this.completeTrigger = completeTrigger;
            this.successTrigger = successTrigger;
            this.getCenter = function () {
                return center;
            };
        }
    })();
    // Instance list
    var instance_list = []; // store object
    var spawned_list = [];  // store object's ID
    var stopped_list = [];  // store object's ID
    var completed_list = []; // store object's ID
    // Define request center
    return function (onSpawnedTrigger, onStoppedTrigger, onCompletedTrigger) {
        // Trigger of RequestCenter Object.
        this.onSpawnedTrigger = onSpawnedTrigger;
        this.onStoppedTrigger = onStoppedTrigger;
        this.onCompletedTrigger = onCompletedTrigger;
        // Define method, attributes for request center.
        this.getInstanceNum = function () {
            return instance_list.length;
        };
        this.getSpawnedNum = function () {
            return spawned_list.length;
        };
        this.getStoppedNum = function () {
            return stopped_list.length;
        };
        this.getCompletedNum = function () {
            return completed_list.length;
        };
        this.addStopped = function (instance_id) {
            stopped_list.push(instance_id); // Must be fired before trigger onStop
            // // Condition to trigger onStop function
            if (this.getStoppedNum() == this.getSpawnedNum() && typeof this.onStoppedTrigger == "function") {
                this.onStoppedTrigger();
            }
            // // Condition to trigger onStop function
            // if (typeof this.onStoppedTrigger == "function") {
            //     this.onStoppedTrigger();
            // }

        };
        this.addCompleted = function (instance_id) {
            completed_list.push(instance_id); // Must be fired before trigger onComplete
            // Condition to trigger onStop function
            if (this.getCompletedNum() == this.getSpawnedNum() && typeof this.onCompletedTrigger == "function") {
                this.onCompletedTrigger();
            }
            // // Condition to trigger onStop function
            // if (typeof this.onStoppedTrigger == "function") {
            //     this.onStoppedTrigger();
            // }
        };
        this.addSpawned = function (instance_id) {
            console.log('Total request spawned: ' + this.getSpawnedNum())

            // // // Condition to trigger onStart function
            // if (this.getSpawnedNum() == this.getStoppedNum() && typeof this.onSpawnedTrigger == "function") {
            //     this.onSpawnedTrigger();
            // }
            if (typeof this.onSpawnedTrigger == "function") {
                this.onSpawnedTrigger();
            }
            spawned_list.push(instance_id); // Must be fired after trigger onSpawned
        };
        this.createInstance = function (beforeSendTrigger, successTrigger, errorTrigger, completeTrigger) {
            var instance = new RequestInstance(this, beforeSendTrigger, successTrigger, errorTrigger, completeTrigger);
            instance.id = instance.getCenter().getInstanceNum();
            instance_list.push(instance);// Auto pushing instance into
            instance.ajax = function (ajax_params) {
                if (ajax_params == null) ajax_params = {};
                var beforeSend = function (args, ajax_before_send) {
                    if (typeof instance.beforeSendTrigger == "function") {
                        args = instance.beforeSendTrigger(...args
                    )
                        ;
                    }
                    //console.log("error arguments===============");
                    //console.log(args);
                    instance.getCenter().addSpawned(instance.id);
                    if (typeof ajax_before_send == "function") return ajax_before_send(...args
                )
                    ;
                };
                var success = function (args, ajax_success, argsTrigger) {
                    if (typeof instance.successTrigger == "function") {
                        args = instance.successTrigger(...args
                    )
                        ; // Data need to be overwritten because of legacy api pattern
                    }
                    instance.getCenter().addStopped(instance.id);
                    if (typeof ajax_success == "function") return ajax_success(...args
                )
                    ;
                };
                var error = function (args, ajax_error, argsTrigger) {
                    if (typeof instance.errorTrigger == "function") {
                        instance.errorTrigger(...args
                    )
                        ;
                    }
                    //console.log("error arguments===============");
                    //console.log(args);
                    instance.getCenter().addStopped(instance.id);
                    if (typeof ajax_error == "function") return ajax_error(...args
                )
                    ;
                };
                var complete = function (args, ajax_complete) {
                    if (typeof instance.completeTrigger == "function") {
                        instance.completeTrigger(...args
                    )
                        ;
                    }
                    instance.getCenter().addCompleted(instance.id);
                    if (typeof ajax_complete == "function") return ajax_complete(...args
                )
                    ;
                };
                // Clone to new ajax params
                var ajax_params_cloned = Object.assign({}, ajax_params);
                ajax_params_cloned.beforeSend = function (...args
            )
                {
                    return beforeSend(args, ajax_params.beforeSend != null ? ajax_params.beforeSend : "");
                }
                ;
                ajax_params_cloned.success = function (...args
            )
                {
                    return success(args, ajax_params.success != null ? ajax_params.success : "");
                }
                ;
                ajax_params_cloned.error = function (...args
            )
                {
                    return error(args, ajax_params.error != null ? ajax_params.error : "");
                }
                ;
                ajax_params_cloned.complete = function (...args
            )
                {
                    return complete(args, ajax_params.complete != null ? ajax_params.complete : "");
                }
                ;
                return $.ajax(ajax_params_cloned);
            };
            return instance;
        };
        this.getInstanceByID = function (index) {
            if (instance_list.length > index) return instance_list[index];
            return null;
        };
        this.deleteInstanceByID = function (index) {
            if (instance_list.length > index) return instance_list.splice(index, 1);
            return null;
        };
    }
})();


// Utils functions
function config_requestcenter() {
    show_notification = true;
    $("#request-center-progress").css({
        "background-color": "#ffd176",
        "color": "#6e6e6e",
        "border": "1px solid #ffb14d"
    });
    $("#request-center-progress").text(gettext("Loading..."));
}

function success_requestcenter(message, status_code=200) {
    // var id = initRequestCenterStatusDisplay(Math.floor(Math.random() * 101))

    $("#request-center-progress").css({
        "background-color": "#5cb85c",
        "color": "#fff",
        "border": "1px solid #468746"
    });
    $("#request-center-progress").hide();
    $("#request-center-progress").text(message);
    $("#request-center-progress").show();
    setTimeout(function () {
        config_requestcenter()

    }, 4000)
}

function error_requestcenter(message) {
    // var id = initRequestCenterStatusDisplay(Math.floor(Math.random() * 101))

    $("#request-center-progress").css({
        "background-color": "#d9534f",
        "color": "#fff",
        "border": "1px solid #b74743"
    });
    $("#request-center-progress").hide();
    $("#request-center-progress").text(message);
    $("#request-center-progress").show();
    // $("#request-center-progress").fadeOut(3000);
    setTimeout(function () {
        config_requestcenter()

    }, 5000)

}

function guide_requestcenter(message) {

    $("#request-center-progress").css({
        "background-color": "#337ab7",
        "color": "#fff",
        "border": "1px solid #2c6699"
    });
    $("#request-center-progress").hide();
    $("#request-center-progress").text(message);
    $("#request-center-progress").show();
    // $("#request-center-progress").fadeOut(3000);
    setTimeout(function () {
        config_requestcenter()

    }, 1000)

}

function requestcenterHideNotification() {
    $("#request-center-progress").hide();
    show_notification = false;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}


// This is for the progress display
function initRequestCenterDisplay() {
    // Note: requestcenter for progress is very different about requestcenter for status of one by one request
    console.log('requestcenter is created in dom')
    var fragment = create('<div id="popup-progress"><div id="requestcenter-wrapper"><span id="request-center-progress">' + gettext("Loading...") + '</span></div></div>');
// You can use native DOM methods to insert the fragment:
    document.body.insertBefore(fragment, document.body.childNodes[0]);
    // document.body.insertBefore('<div id="popup"><span id="request-center">Loading...</span></div>', document.body.firstChild)
    $("#popup-progress").css({
        "position": "fixed",
        "width": "100%",
        "z-index": "10000",
    });
    $("#requestcenter-wrapper").css({
        "width": "30%",
        "display": "block",
        "margin": "0 auto",
        "text-align": "center"
    });
    $("#request-center-progress").css({
        "position": "relative",
        "border-top": "none",
        "border-radius": "3px",
        "line-height": "100%",
        "display": "none",
        "background": "#f0ad4e",
        "text-align": "center",
        "font-weight": "bold",
        "padding": "2px 10px",
        "background-color": "#ffd176",
        "color": "#6e6e6e",
        "border": "1px solid #ffb14d"
    });
    $(document).ajaxError(function () {

    });
}

function initRequestCenterObject() {
    /* TODO: move this block of code into requestcenter.js */
    var requestcenter = new RequestCenter(
        function () {
            if (show_notification) {
                $('span#request-center-progress').show();// Trigger request center onStart
                // initRequestCenterDisplay();
                console.log('triggered requestcenter')
            }
        },
        function () {
            // Hong note: 1000 is too fast ; changed to 5000
            // Tuan but i think 3000ms because 5000ms too slow
            // config_requestcenter()
            // $('span#request-center').show()
                $('span#request-center-progress').fadeOut(4000, config_requestcenter);// Trigger request center onStop
        }
    );
    // function (beforeSendTrigger, successTrigger, errorTrigger, completeTrigger)
    var cloudjetRequest = requestcenter.createInstance(
        null, // Trigger before send
        function (...args)
    {//successTrigger
        var _args = args.slice()
        if (_args[0] !== undefined) { // If response is no content, data will be undefined
            if (_args[0].data !== undefined && _args[0].status !== undefined && _args[0].message !== undefined && _args[0].version !== undefined) {
                success_requestcenter(_args[0].message, _args[2].status)

                _args[0] = _args[0].data;

            }
            console.log(_args)
        }
        return _args;
    }
,

    function (jqXHR, textStatus, errorThrown) {//errorTrigger
        var message_prefix = '';
        //console.log(arguments);
        //
        // // get arguments
        // var _args = [];
        // for(var i = 0; i<arguments.length;i++){
        //     _args.push(arguments[i]);
        // }
        //console.log(_args);

        /*
        Scenario is here: If the jqXHR.status equal to 401, then redirect to login page with the url /login
        */


        // document.write('<script type="text/javascript" src="'+ incFile+ '"></script>');
        if (jqXHR.status === 0) {
            message_request = gettext("Error Connection.");
        } else if (jqXHR.status == 400) {
            message_request = gettext("Server request failed.");
            //message_prefix = "Error[400]";
        } else if (jqXHR.status == 401) {
            message_request = gettext("You haven't logged in into the system. Redirecting to login page.");
            setTimeout(function () {
                window.location = LOGIN_URL + REDIRECT_PREFIX + window.location.pathname;
            }, 2000)
            //message_prefix = "Error[401]";
        } else if (jqXHR.status == 403) {
            message_request = gettext("You don't have permission.");
            //message_prefix = "Error[403]";
        } else if (jqXHR.status == 404) {
            message_request = gettext("Can not find your content which you input.");
            //message_prefix = "Error[404]";
        } else if (jqXHR.status == 500) {
            message_request = gettext("Server Error.");
            //message_prefix = "Error[500]";
        } else if (textStatus === 'parsererror') {
            message_request = gettext("Json Syntax Error.");
        } else if (textStatus === 'timeout') {
            message_request = gettext("Timeout");
        } else if (textStatus === 'abort') {
            message_request = gettext("Request canceled.");
        } else {
            message_request = gettext("Undefined error.");
        }
        // console.log(jqXHR);
        try {
            var response_from_server = JSON.parse(jqXHR.responseText);
        } catch (err) {
            var response_from_server = undefined
        }
        if (response_from_server !== undefined && response_from_server.message !== undefined) {
            message_request = message_prefix + " " + gettext(response_from_server.message);
        } else {
            message_request = message_prefix + " " + message_request;
        }
        error_requestcenter(message_request);
        // return _args;
    }

, /* Trigger error */
    null
    /* trigger completed*/
)
    ;
    window.cloudjetRequest = cloudjetRequest;
}

function initRequestCenterTracker() {
    var elemRequestCenter = $("body");
    if (elemRequestCenter.length == 0) {
        setTimeout(initRequestCenterTracker, 50);
        console.log('triggered Tracker')
    }
    else {
        initRequestCenterDisplay();
    }
}

// moved to bottom file to allow above scripts initiate first, to save small time while loading jsi18n
var js_loaded = false;
var jqxhr_jsi18n = jQuery.ajax({
    url: '/jsi18n/',
    dataType: 'script',
    cache: true,
    async: false,
});

jqxhr_jsi18n.success(function () {
    initRequestCenterTracker();
    initRequestCenterObject();
    js_loaded = true;
    console.log(js_loaded)
});


