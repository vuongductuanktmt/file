/**
 * Created by fountainhead on 3/9/16.
 */

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

function clear_history_user() {
    v.storage_user = [];
    var p = JSON.parse(localStorage.getItem('history_search_u'));
    var storage = JSON.parse(localStorage.getItem('history_search'));
    p.splice(p.indexOf('{{ user_request.email }}'), 1);
    storage.splice(p.indexOf('{{ user_request.email }}'), 1);
    localStorage.setItem('history_search', JSON.stringify(storage));
    localStorage.setItem('history_search_u', JSON.stringify(p));
    $(".history_user").hide();
}

function clear_search() {
    v.query = '';
    $("#ico-clear").hide();
    $("#ico-search").show()
    $(".no-data").hide();
    $("#result_searched").hide();
    setTimeout(function () {
        $("#search_user").focus();
    }, 100);
}

function toggle_auto() {
    var status = $('li.user-comment').css('display');
    //alert(status);
    if (status != 'none') {
        $('li.user-comment').hide(500);
    }
    $('li.auto-comment').show(500);
}

function toggle_user() {
    var status = $('li.auto-comment').css('display');
    //alert(status);
    if (status != 'none') {
        $('li.auto-comment').hide(500);
    }
    $('li.user-comment').show(500);
}

function toggle_all() {
    $('li.auto-comment').show(500);
    $('li.user-comment').show(500);
}

// var toggle = false;

function toggleKPI_ID() {
    function expanse() {
        $('.kpi-id').removeClass('width35');
        $('.kpi_id_header').removeClass('width35');
        $('.kpi-id-content').fadeIn();
        $('.kpi_id_toggle_raquo').fadeIn();
        $('.kpi_id_toggle_laquo').fadeOut();
    }

    function collapse() {
        $('.kpi-id').addClass('width35');
        $('.kpi_id_header').addClass('width35');
        $('.kpi-id-content').fadeOut();
        $('.kpi_id_toggle_raquo').fadeOut();
        $('.kpi_id_toggle_laquo').fadeIn();
    }

    var collapsed = $('#personal-kpis .kpi-id-content').first().is(':hidden');
    if (collapsed) {
        expanse();
    }
    else {
        collapse();
    }
}

function create_scrolltofixed() {
    // return;
    var msg_height = 0;
    console.log('create scrollToFixed');
    $('#toolbar').scrollToFixed({
        marginTop: function () {
            // msg_height = ($('#msg-expired').outerHeight() == null || localStorage.getItem('status_msg_expired') == 'true') ? 0 : $('#msg-expired').outerHeight();
            // return $("#navbar").outerHeight() + msg_height - 1;
            return $("#navbar").outerHeight() ;
        },
        preFixed: function () {
            $('#toolbar').addClass('docked');
        },
        preUnfixed: function () {
            $('#toolbar').removeClass('docked');
        },
        fixed: function () {
        },
        zIndex: 999

    });
    return;
    $('#content-nav-wrapper').scrollToFixed({
        marginTop: function () {
            msg_height = ($('#msg-expired').outerHeight() == null || localStorage.getItem('status_msg_expired') == 'true') ? 0 : $('#msg-expired').outerHeight();
            return $('#toolbar').outerHeight() + $('#navbar').outerHeight() + msg_height - 1;
        },
        preFixed: function () {
            //debugger;
            $('#content-nav-wrapper').addClass('docked');
        },
        preUnfixed: function () {
            $('#content-nav-wrapper').removeClass('docked');
        },
        fixed: function () {
        },
        zIndex: 1002

    });
    $('#kpi-row-heading').scrollToFixed({
        marginTop: function () {
            // return $('#toolbar').outerHeight() + $('#content-nav-wrapper').outerHeight();
            msg_height = ($('#msg-expired').outerHeight() == null || localStorage.getItem('status_msg_expired') == 'true') ? 0 : $('#msg-expired').outerHeight();
            return $('#toolbar').outerHeight() + $('#content-nav-wrapper').outerHeight() + $('#navbar').outerHeight() + msg_height - 1;
        },
        preFixed: function () {
            $('.kpi-table').addClass('docked');
        },
        fixed: function () {
            $('#kpi-row-heading').css('font-size', '13.5px');
        },
        postFixed: function () {
        },
        preUnfixed: function () {
            $('.kpi-table').removeClass('docked');

        },
        zIndex: 1002,

    });


}


function post_comment(unique_key, obj_id) {
    var content = $('#kpicommenttext' + unique_key).val();
    content = content.trim();
    if (content.length == 0) {
        $("#error-msg").show();
        $("#error-msg").text('*' + gettext("This field cannot be empty."));
        $("#kpicommenttext" + unique_key).css('border', '1px solid red');
    }
    else {
        var obj = $("#kpi-" + unique_key).val();
        var file_url = $("#uploaded-" + unique_key).val();
        if (content.length < 2 && (obj != '' && file_url != '')) {
            return;
        }
        var data = {
            comment: $('#kpicommenttext' + unique_key).val(),
            obj_id: obj,
            file_url: file_url
        };
        cloudjetRequest.ajax({
            url: '/performance/kpicomment/' + unique_key + '/?editor=1&id=' + obj_id,
            type: 'post',
            data: data,
            success: function (response) {
                $(response).insertAfter($('#kpicomment' + unique_key + ' > li:last-child'));
                $('.modal-body').animate({scrollTop: $('#contain-comment').get(0).scrollHeight});

                // nếu người comment không phải là người nhận kpi đó, thì comment sẽ nằm bên trái.
                if (v.current_user_id != v.kpi_list[obj_id].user) {
                    var change_host = $('#kpicomment' + unique_key + ' > li:last-child');
                    change_host.find('.col-md-2').removeClass('comment-avatar-right').addClass('comment-avatar-left');
                    change_host.find('.col-md-10').removeClass('pull-right');
                    change_host.find('.comment-infor').removeClass('text-right');
                    change_host.find('.col-md-10').children('div').removeClass('comment-content-frame-right tri-right right-top')
                        .addClass('comment-content-frame-left tri-right left-top');
                    //swap
                    var name_display = change_host.find('#name_display');
                    change_host.find('#icon_display').insertAfter(name_display);
                }

                //Chèn code vào comment hover
                $(response).insertAfter($('#contain-comment-hover-' + unique_key).find('ul > li:last-child'));
                if (v.current_user_id != v.kpi_list[obj_id].user) {
                    // insert new comment to the left,
                    var change_hover = $('#contain-comment-hover-' + unique_key).find('ul > li:last-child');
                    var name = change_hover.find('#name_display').text();
                    var content = change_hover.find('.comment-content-frame-right').children('p').text();
                    var avatar = change_hover.find('.col-md-2').children('img').attr('src');

                    var get_code_insert = $('#insert_comment_hover_left');
                    get_code_insert.find('img').attr('src', avatar);
                    get_code_insert.find('#name_user').text(name);
                    get_code_insert.find('#content_comment').text(content);
                    var code_insert = get_code_insert.html();
                    change_hover.remove();
                    $(code_insert).insertAfter($('#contain-comment-hover-' + unique_key).find('ul > li:last-child'));

                }
                else {
                    // insert new comment to the right,
                    var change_hover = $('#contain-comment-hover-' + unique_key).find('ul > li:last-child');
                    var name = change_hover.find('#name_display').text();
                    var content = change_hover.find('.comment-content-frame-right').children('p').text();
                    var avatar = change_hover.find('.col-md-2').children('img').attr('src');
                    var get_code_insert = $('#insert_comment_hover_right');
                    get_code_insert.find('img').attr('src', avatar);
                    get_code_insert.find('#name_user').text(name);
                    get_code_insert.find('#content_comment').text(content);
                    var code_insert = get_code_insert.html();
                    change_hover.remove();
                    $(code_insert).insertAfter($('#contain-comment-hover-' + unique_key).find('ul > li:last-child'));
                }
            },
            error: function () {

            }
        });
        $('#kpicommenttext' + unique_key).val('');
    }
}


function approve_kpi(kpi_id, status) {
    //  alert(status);
    cloudjetRequest.ajax({
        url: '/api/approve_kpi/' + kpi_id + "/" + status + "/",
        type: 'post',
        success: function (data) {
            $('#approve_kpi_' + kpi_id).html(data);
        }
    });

}

$(function () {
    $.fn.scrollToFixed.kpi_table_height = $('.kpi-table').height(); //add custom property
    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    };


    $('#button-menu').click(function () {
        $('#kpi-scroller').scroll();
    });


    $(document).ready(function () {
        create_scrolltofixed();
    });


    $(document).on('click', ".kpi-table .kpi-comment [data-el='comment-icon']", function () {
        // alert('kpi-comment click');
        $(this).parent().qtip('hide');
        var remote_url = $(this).attr('data-href');
        $('#kpicoment-modal .modal-content').html('<div class="panel-body">Loading comment and KPI history...</div>');
        //            $('#kpicoment-modal').modal('show');
        cloudjetRequest.ajax({
            url: remote_url,
            type: 'get',
            success: function (data) {
                $('#kpicoment-modal .modal-content').html(data);
                //              alert( "Load was performed." );
            }
        });

    });


    $('#modal-quarter-selections').on('show.bs.modal', function (e) {
        // do something...
        console.log('show modal');
        $('#btn-view-kpi-history').data('current-target', $(e.relatedTarget).closest('.kpi-row').siblings('.qtip-kpi-history'));
        $('#btn-view-kpi-history').data('kpi_unique_key', $(e.relatedTarget).attr('data-kpi-unique-key'));
    });

    // $('#btn-view-kpi-history').click(function () {
    //     //show qtip with kpi history content
    //     var kpi_unique_key = $(this).data('kpi_unique_key');
    //     var kpi_id = 0;
    //     var quarter = $('#kpi-history-quarter').val();
    //     var quarter_name = $('#kpi-history-quarter option:selected').text();
    //
    //     var load_params = 'target_org=' + KPI_EDITOR.target_org_id + '&follow_page=0&load_child=0&reload=1&level=1&has_child_loaded=0&kpi_wrapper=1';
    //     load_params += '&kpi_unique_key=' + kpi_unique_key;
    //     load_params += '&quarter=' + quarter;
    //     var load_url = '/performance/kpi-editor/kpi/0/?' + load_params;
    //
    //     var elm = $(this).data('current-target');
    //     $(elm).qtip({
    //         content: {
    //             title: 'KPI History | Quarter: ' + quarter_name,
    //             text: function (event, api) {
    //                 cloudjetRequest.ajax({
    //                     url: load_url // Use href attribute as URL
    //                 })
    //                     .then(function (content) {
    //                         // Set the tooltip content upon successful retrieval
    //                         api.set('content.text', content);
    //
    //                     }, function (xhr, status, error) {
    //                         // Upon failure... set the tooltip content to error
    //                         api.set('content.text', status + ': ' + error);
    //                     });
    //
    //                 return "Loading KPI History..."; // Set some initial text
    //             },
    //             button: 'Close',
    //         },
    //         style: {
    //             classes: 'qtip-wiki qtip-history',
    //         },
    //         hide: {
    //             event: false
    //         },
    //         show: {
    //             event: false
    //         },
    //         position: {
    //             my: 'bottom center',  // Position my top left...
    //             at: 'top center', // at the bottom right of...
    //             container: $(elm)
    //         }
    //     });
    //
    //     $(elm).qtip('show');
    //
    // });

    // kpi-rating
    $('div.kpi-table').on('change',
        'input[name$=\'-rating\']',
        function () {
            //update kpi-archivable-score
            var container = $(this).closest('div.kpi-rating');
            var kpi_id = $(container).attr('data-id');
            var archivable_score = $(this).val()
            cloudjetRequest.ajax({
                url: "/api/kpi_archivable_score/",
                type: 'post',
                data: 'kpi_id=' + kpi_id + '&archivable_score=' + archivable_score,
                success: function () {
                    $(container).find('.kpi-archivable-score-value').html(archivable_score);
                },
                error: function () {
                    console.log('update kpi archivable_score failed!');
                }
            });

        });
    //# end kpi-rating

    //language options
    $('.selectpicker').selectpicker({width: '60px'});
    $('.selectpicker').change(function () {
        $('#lang-form').submit();
    });
    //# end language options



    $("#search_user").focus(function () {
        if (v.query.length == 0) {
            $("#list_user_suggest").show();
            $(".arrow-up").show();
        } else if (v.list_user_searched.length == 0) {
            $(".no-data").show();
            $(".arrow-up").show();
        }
        else {
            $("#result_searched").show();
        }
    });
    $("#search_user").focusout(function () {
        setTimeout(function () {
            $("#list_user_suggest").hide();
            $(".no-data").hide();
            $(".arrow-up").hide();
            $("#result_searched").hide();
        }, 200);
        setTimeout(function () {
            $("#popup-progress").show();
        }, 1000)
    });


});

/*kpi_editor_toolbar_top.html*/

$(function() {
    // v.get_surbodinate();
    // v.get_surbodinate_user_viewed();

});

function regex_number(e) {
    // alert(String.fromCharCode(e.keyCode));
    // var reg = /(\d+(\.\d+)?)/;
    if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 110 || e.keyCode == 190) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
        return;
    }
    if ((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57)) {
        return;
    }
    else {
        e.preventDefault();
    }
}


function show_modal_export_kpi() {
    $('#modal-export-kpi').modal();
    $('#modal-export-kpi').appendTo('body')
}

/* end kpi_editor_toolbar_top.html*/