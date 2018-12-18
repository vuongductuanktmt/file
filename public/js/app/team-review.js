/**
 * Created by hongleviet on 12/13/15.
 */

var param = getURLParameter('team');
var user_id = getURLParameter('user_id');


var myintrojs = introJs();
function intro_if_first_visit() {
    if (getCookie('teamperformance-visit') == '1') {

        return;
    }
    else {
        setCookie('teamperformance-visit', '1', 365);

        initiate_introjs();

        myintrojs.start();
    }
}


function initiate_introjs() {
    $('#KPI').attr("data-step", "1");
    $('#KPI').attr("data-intro", gettext('View details of the KPI review'));
    $('#Final').attr("data-step", "2");
    $('#Final').attr("data-intro", gettext("Choose final review or monthly review"));
    $('#Result').attr("data-step", "3");
    $('#Result').attr("data-intro", gettext("Input default real value"));
    $('#savebtn').attr("data-step", "4");
    $('#savebtn').attr("data-intro", gettext("Save review"));
    $('#kpistatus').attr("data-step", "5");
    $('#kpistatus').attr("data-intro", gettext("Change status of KPI"));
    $('#weighting').attr("data-step", "6");
    $('#weighting').attr("data-intro", gettext("Change weighting"));
}

$(function () {

    $('#btn-inline-introjs').click(function () {
        initiate_introjs();
        myintrojs.start();
    });

});

module.controller('PeopleListCtrl', ['$scope', '$http', '$filter', '$sce', '$timeout', function ($scope, $http, $filter, $sce, $timeout) {
    $scope.toggle_weight = function (kpi) {
        if (kpi.temp_weight > 0) {
            kpi.weight = kpi.temp_weight;
            kpi.temp_weight = 0;
        }
        else {
            if (!kpi.weight > 0) {
                kpi.weight = 10;
            }
            kpi.temp_weight = kpi.weight;
            kpi.weight = 0;

        }
        var data = {'id': kpi.id, 'command': 'delay_toggle'};
        $http.post('/api/kpi/services/', data).success(function (response) {

            $scope.calculate_score(kpi);
        })
    };



    $scope.allow_delay = false;
    $http.get('/api/organization/').success(function (response) {
        //  ;

        $scope.allow_delay = response.allow_delay_kpi;
        $scope.child_allow_delay = response.allow_delay_kpi;
    });

    $scope.profile = null;

    $scope.get_profile = function () {
        $http.get('/api/profile/').success(function (response) {
            //  ;

            $scope.profile = response;


        });

    };
    $scope.update_profile = function () {

        console.log('post');
        //$.post( '/api/profile/', {'a':3},
        //        function (){
        //
        //        },"json");

        var transform = function (data) {
            return (data);
        };

        $http.post('/api/profile/',
            JSON.stringify($scope.profile),
            {
                headers: {'Content-Type': 'application/json'},
                transformRequest: transform //override
            }
        ).success(function (response) {

            //	$scope.profile = response;


        });
        // not working for application/json because of $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';


    };
    $scope.get_profile();

    $scope.change_score_calculation_type = function (kpi) {


        switch (kpi.score_calculation_type) {
            case 'sum':
                kpi.score_calculation_type = 'average';
                break;
            case 'average':
                //kpi.score_calculation_type = 'sum';
                kpi.score_calculation_type = 'most_recent';
                break;
            case 'most_recent':
                kpi.score_calculation_type = '';
                break;
            default :
                kpi.score_calculation_type = 'sum';
                break;
        }

        $scope.calculate_score(kpi);
    };


    $http.get('/api/quarter/?get_current_quarter=yes').success(
        function (data) {

            if (data.fields.quarter == 1) {
                $scope.month_1 = "January";
                $scope.month_2 = "February";
                $scope.month_3 = "March";
            }


            if (data.fields.quarter == 2) {
                $scope.month_1 = "April";
                $scope.month_2 = "May";
                $scope.month_3 = "June";
            }


            if (data.fields.quarter == 3) {
                $scope.month_1 = "July";
                $scope.month_2 = "August";
                $scope.month_3 = "September";
            }


            if (data.fields.quarter == 4) {
                $scope.month_1 = "October";
                $scope.month_2 = "November";
                $scope.month_3 = "December";
            }


        });


    $scope.team = param != null ? '&team=' + param : "";
    $scope.user_id = user_id != null ? '&user_id=' + user_id : "";
    $scope.team_url = '/performance/team-performance/?json_data=true' + $scope.team + $scope.user_id + "&" + makeid();


    $http.get($scope.team_url).success(
        function (data) {
            $scope.people = data[0];
            $scope.descriptions = data[1];
            $scope.filteredPeople = data[0];
            $scope.filteredPeople[$scope.currentPerson];
            $scope.changePerson($scope.currentPerson);
            $scope.enable_competency = data[2].enable_competency
            $scope.quarter_period = data[2].quarter_period
            $scope.enable_bsc = data[2].enable_bsc;
            $scope.can_edit = data[2].can_edit;
            $scope.expired_review = data[2].expired_review
            $('#loading').hide();

            $timeout(function () {
                angular.element('.tabitem2')[0].click();

              intro_if_first_visit();
            }, 2000);


            if (data[2].next_page) {
                $scope.load_next_data(data[2].next_page);
            }
            $scope.update_progress();
            $scope.get_invitation();


        }).error(function (data, status, headers, config) {
        $('#loading').hide();
        $('#ballsWaveG').fadeOut();
        alert(gettext("Load data failed!"));
    });

    $scope.currentPerson = 0;
    $scope.filteredPeople = [];
    $scope.person = null;
    $scope.descriptions = [];
    $scope.choice = 2;
    $scope.self = true;
    $scope.share_to_manager = share_to_manager;
    $scope.share_to_all = share_to_all;
    $scope.short_term_career = "";
    $scope.short_term_development = "";
    $scope.long_term_career = "";
    $scope.long_term_development = "";
    $scope.cell_description = "";
    $scope.init_pos = parseInt($('.profile_title').offset().left + 271 + 40);
    $scope.selected_kpi = "";
    $scope.colors = ['', 'cyan', 'darkblue', 'green', 'organe', 'purple', 'red', 'yellow'];
    $scope.current = true;
    $scope.goals_lib = goal_lib;
    $scope.goals = null;
    $scope.enable_competency = true;
    $scope.enable_bsc = true;
    $scope.align_kpis = [];
    $scope.selected_kpi = null;
    $scope.hide_assigned_kpi = true;
    $scope.transfer_kpi = null;
    $scope.chart_type = '0';

    $scope.bsc_category_list = [
        {value: '', text: "-----"},
        {value: 'financial', text: gettext('Financial')},
        {value: 'customer', text: gettext('Customer')},
        {value: 'internal', text: gettext('Internal Process')},
        {value: 'learninggrowth', text: gettext('Learning & Growth')}
    ];
    $scope.quarter_period = null;

    $scope.load_next_data = function (page) {
        $('#loading').show();
        $('#ballsWaveG').fadeIn();
        $http.get('/performance/team-performance/?json_data=true&page=' + page + $scope.team + $scope.user_id + "&" + makeid()).success(
            function (respond) {
                list_data = respond[0];
                for (i in list_data) {
                    $scope.people.push(list_data[i]);

                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $('#loading').hide();
                $('#ballsWaveG').fadeOut();

                if (respond[2].next_page) {
                    $scope.load_next_data(respond[2].next_page);
                }
            }).error(function (data, status, headers, config) {
            alert("Load data failed!")
        });

    };

    $scope.load_next_data_quarter = function (page, quarter) {
        $('#loading').show();
        $('#ballsWaveG').fadeIn();
        $http.get('/performance/team-performance/?json_data=true&page=' + page + $scope.team + $scope.user_id + "&quarter=" + quarter + "&" + makeid()).success(
            function (respond) {
                list_data = respond[0];
                for (i in list_data) {
                    $scope.people.push(list_data[i]);

                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $('#loading').hide();
                $('#ballsWaveG').fadeOut();

                if (respond[2].next_page) {
                    $scope.load_next_data_quarter(respond[2].next_page, quarter);
                }
            }).error(function (data, status, headers, config) {
            alert("Load data failed!")
        });
    };

    $scope.load_data_quarter = function (quarter) {
        $scope.people = null;
        $scope.descriptions = null;
        $scope.filteredPeople = null;
        $scope.person = null;
        $('#loading').show();
        $http.get('/performance/team-performance/?json_data=true' + $scope.team + $scope.user_id + "&quarter=" + quarter + "&" + makeid()).success(
            function (data) {
                $scope.current = data[2].current;
                $scope.enable_competency = data[2].enable_competency;
                $scope.quarter_period = data[2].quarter_period;
                $scope.people = data[0];
                $scope.descriptions = data[1];
                $scope.filteredPeople = data[0];
                $scope.filteredPeople[$scope.currentPerson];
                $scope.changePerson($scope.currentPerson);
                $('#loading').hide();

                if (data[2].next_page) {
                    $scope.load_next_data_quarter(data[2].next_page, quarter);
                }
                $scope.update_progress();
                $scope.get_invitation();

                // $('.tabitem2')[0].click();


            }).error(function (data, status, headers, config) {
            $('#loading').hide();
            $('#ballsWaveG').fadeOut();
            alert("Load data failed!");
        });
    };

    $scope.get_invitation = function () {

        //TODO: remove
        $http.get('/performance/invitation-data/').success(function (data) {
            $scope.names = data;
            $scope.init_invitation();
        });
    };

    $scope.changePerson = function (index) {
        $scope.currentPerson = index;
        $scope.person = $scope.filteredPeople[$scope.currentPerson];
        if (!$scope.person) {
            return;
        }
        if (!$scope.person.short_term_career) {
            $scope.short_term_career = gettext("In what role do you want to be within the next 12 months?");
        } else {
            $scope.short_term_career = $scope.person.short_term_career;
        }

        if (!$scope.person.short_term_development) {
            $scope.short_term_development = gettext("How are your development activities helping you to achieve your short term career ambitions?\n\nWhat is your development path to achieve your career objective; please define your development activities and the expected outcomes of these activities.");
        } else {
            $scope.short_term_development = $scope.person.short_term_development;
        }

        if (!$scope.person.long_term_career) {
            $scope.long_term_career = gettext("In what role do you want to be in 5 years?");
        } else {
            $scope.long_term_career = $scope.person.long_term_career;
        }

        if (!$scope.person.long_term_development) {
            $scope.long_term_development = gettext("How are your development activities helping you to achieve your long term career ambitions?\n\nWhat is your development path to achieve your career objective; please define your development activities and the expected outcomes of these activities.");
        } else {
            $scope.long_term_development = $scope.person.long_term_development;
        }
        $scope.draw_person();
        // $scope.update_approval_box();
        $('.show-performance-score').show();
        if ($scope.current) {
            var percent = $scope.person_progress($scope.person, true);
            $scope.update_review(percent, $scope.person.user_id);
        }
        $scope.draw_performance_chart();
    };

    // $scope.update_approval_box = function () {
    //     if (!$scope.person) {
    //         return;
    //     }
    //     $.get("/performance/kpi_approval/get/?uid=" + $scope.person.user_id, function (result) {
    //         if (result.manager_status == 'OK') {
    //             $('#manager_approval_box').hide();
    //             $('.user-approved').show();
    //         } else {
    //             $('.user-approved').hide();
    //             $('#manager_approval_box').show();
    //         }
    //     });
    // };

    $scope.person_icon = function (p) {
        if (p.is_active) {
            return "person-m.png";
        }
        return "inactive-person-m.png";
    };

    $scope.update_status = function () {
        if (($scope.person.is_active && $scope.person.status == "active") ||
            (!$scope.person.is_active && $scope.person.status == "inactive")) {
            return;
        }

        var data = {
            user_id: $scope.person.user_id,
            active: $scope.person.status
        };
        $("#id_saved").hide();
        $("#id_saving").show();
        $http.post('/performance/people/', data).success(function (response) {
            $scope.person.is_active = response.active;

            $("#id_saving").hide();
            $("#id_saved").show();
        }).error(function (data, status, headers, config) {
            $("#id_saved").hide();
            $("#id_saving").hide();
            if ($scope.person.status == "active") {
                $scope.person.status = "inactive"
            } else {
                $scope.person.status = "active"
            }
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");

        });

    };

    $scope.draw_person = function () {
        if (!$scope.enable_competency) {
            return;
        }
        var x_score = $scope.person.competency_final_score;
        var y_score = $scope.person.kpi_final_score;
        x_score = _x(x_score);
        y_score = _y(y_score);
        drawKite(_x($scope.person.min_score_competency),
            _x($scope.person.max_score_competency),
            _y($scope.person.min_score_kpi),
            _y($scope.person.max_score_kpi),
            x_score, y_score);
        active_person = drawPerson(x_score, y_score, $scope.person.brief_name);
        $scope.popover_person(active_person);
        $scope.draw_arrow();
    };

    $scope.draw_arrow = function () {
        if (!$scope.enable_competency) {
            return;
        }
        clearArrow();
        history_scores = $scope.person.history_scores
        var length = history_scores.length;
        if (length == 0) {
            return;
        }
        var from_x_score, from_y_score, to_x_score, to_y_score;
        for (i = 0; i < length - 1; i++) {
            from_x_score = _x(history_scores[i].competency_score);
            from_y_score = _y(history_scores[i].kpi_score);
            to_x_score = _x(history_scores[i + 1].competency_score);
            to_y_score = _y(history_scores[i + 1].kpi_score);
            arrow = drawArrow(from_x_score, from_y_score, to_x_score, to_y_score, false,
                history_scores[i].due_date,
                history_scores[i + 1].due_date);
        }

        from_x_score = _x(history_scores[length - 1].competency_score);
        from_y_score = _y(history_scores[length - 1].kpi_score);
        to_x_score = _x($scope.person.competency_final_score);
        to_y_score = _y($scope.person.kpi_final_score);
        arrow = drawArrow(from_x_score, from_y_score, to_x_score, to_y_score, true,
            history_scores[length - 1].due_date, "Hiện tại"
        );
    };

    $scope.popover_person = function (person) {
        if (!$scope.enable_competency) {
            return;
        }
        content = "<div class='analysis-popup'><p><strong>Name:</strong> " + $scope.person.name + "</p>" +
            "<p><strong>" + gettext("Position on Grid") + ":</strong> " + $scope.get_position_on_grid(true) + " </p>" +
            "<p><strong>" + gettext("Trend") + ":</strong> " + gettext("No History") + "</p><br>";

        if ($scope.person.strength_competency != '') {
            content += "<p>- <strong>" + gettext("Potential Strengths") + ":</strong> " + $scope.person.strength_competency + "</p>";
        }
        if ($scope.person.strength_kpi != '') {
            content += "<p>- <strong>" + gettext("Performance Strengths") + ":</strong> " + $scope.person.strength_kpi + "</p>";
        }
        if ($scope.person.weak_competency != '') {
            content += "<p>- <strong>" + gettext("Potential Weaknesses") + ":</strong> " + $scope.person.weak_competency + "</p>";
        }
        if ($scope.person.weak_kpi != '') {
            content += "<p>- <strong>" + gettext("Performance Weaknesses") + ":</strong> " + $scope.person.weak_kpi + "</p>";
        }

        content += "<br><p>" + gettext("Factor set: ") + $scope.person.job_title_name + "</p>" +
            "<p style='float: right;padding:10px 0'><input type='button' class='mango_bt' onclick='show_analysis_modal()' style='margin-right: 10px' value='More'> " +
            "<input type='button' class='mango_bt' value='Cancel' onclick=\"$('#perons-position').popover('hide')\"></p></div>";

        $("#perons-position").popover({
            html: true,
            title: $scope.person.name + "<i class='icon-remove close_btn' style='cursor: pointer' onclick=\"$('#perons-position').popover('hide')\" title=\"{% trans 'Close' %}\"></i>",
            content: content
        });

        active_person.click(show_popover);
    };

    $scope.get_class = function () {
        var cls = $scope.get_position_on_grid(false).toLowerCase();
        return cls.replace('/', '-');
    };

    $scope.view_doc = function (note) {
        if (note.file_url) {
            var url = "http://docs.google.com/viewer?embedded=true&url=" + note.file_url;
            var left = (window.screen.width - 900) / 2;
            window.open(url, "mywindow", 'menubar=1,resizable=1,scrollbars=1,width=900,height=550,top=100' + ",left=" + left);
        }
    };


    $scope.add_basic_competency = function (id) {
        $.get('/performance/competency_lib_copy/?id=' + id.toString(), function (response) {
            alert('Successful!');
        });
    }

    $scope.post_comment = function (child) {
        var content = $('#kpicommenttext' + child.unique_key).val();
        content = content.trim();
        var obj = $("#kpi-" + child.unique_key).val();
        if (content.length < 2 && obj == '') {
            return;
        }
        var data = {
            comment: $('#kpicommenttext' + child.unique_key).val(),
            obj_id: obj
        };
        $.post('/performance/kpicomment/' + child.unique_key + '/', data, function (response) {
            if (typeof response == "object") {
                child.notes.push(response);
                child.total_notes += 1;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $("#kpi-" + child.unique_key).val("");
                $("#uploaded-" + child.unique_key).val("");

                var control = $("#file-" + child.unique_key);
                control.replaceWith(control = control.clone(true));
                $("#file-" + child.unique_key).show();
                $("#confile-" + child.unique_key).show();
            }
        });
        
        $("#kpi-" + child.unique_key).val("");
        $('#kpicommenttext' + child.unique_key).val('');
        $("#uploaded-file-" + child.unique_key).html("");
    }

    $scope.get_position_on_grid = function (trans) {
        if (!$scope.person) {
            return '';
        }
        var x = $scope.person.competency_final_score;
        var y = $scope.person.kpi_final_score;
        var pos = "";
        if (x < 33.3 && y <= 33.3) {
            $scope.cell_description = $scope.descriptions.under_performing;
            pos = "Under-Performing";
        } else if (x < 33.3 * 2 && y <= 33.3) {
            $scope.cell_description = $scope.descriptions.under_contributing;
            pos = "Under-Contributing";
        } else if (x <= 100 && y < 33.3) {
            $scope.cell_description = $scope.descriptions.latent;
            pos = "Latent";
        } else if (x <= 33.3 && y <= 66.6) {
            $scope.cell_description = $scope.descriptions.processing;
            pos = "Processing";
        } else if (x <= 33.3 * 2 && y <= 66.6) {
            $scope.cell_description = $scope.descriptions.contributing;
            pos = "Contributing";
        } else if (x <= 100 && y <= 66.6) {
            $scope.cell_description = $scope.descriptions.promising;
            pos = "Promising";
        } else if (x <= 33.3 && y <= 100) {
            $scope.cell_description = $scope.descriptions.performing;
            pos = "Performing/Delivering";
        } else if (x <= 33.3 * 2 && y <= 100) {
            $scope.cell_description = $scope.descriptions.achieving;
            pos = "Achieving";
        } else if (x <= 100 && y <= 100) {
            $scope.cell_description = $scope.descriptions.starring;
            pos = "Starring";
        }
        if (trans) {
            return gettext(pos);
        }
        return pos;
    };

    $scope.load_kpi = function (id, parent_id) {
        $("#id_parent").html("");
        $("#id_parent").append("<option value=''> --- </option>");
        $("#id_name").val("");
        $("#id_description").val("");
        $("#id_description").enable(true);
        $("#id_obj_id").val("");
        var index = -1;
        $("#id_type").val("kpi");
        $("#id-modal-title").html("Update KPI");
        if (!id && !parent_id) {
            $("#id-modal-title").html(gettext("Add KPI"));
        }
        $("#id_name").autocomplete('disable');
        for (i in $scope.person.kpis) {
            kpi = $scope.person.kpis[i];
            if (id != kpi.id) {
                $("#id_parent").append("<option value='" + kpi.id + "'>" + kpi.name + "</option");
            }

            if (id == kpi.id && !parent_id) {
                $("#id_name").val(kpi.name);
                $("#id_description").val(kpi.description);
                $("#id_description").enable(true);
                $("#id_obj_id").val(kpi.id);
            }
            if (kpi.id == parent_id) {
                index = i;
            }
        }

        if (parent_id) {
            for (i in $scope.person.kpis[index].children) {
                kpi = $scope.person.kpis[index].children[i];
                if (id == kpi.id) {
                    $("#id_name").val(kpi.name);
                    $("#id_description").val("");
                    $("#id_description").enable(false);
                    $("#id_obj_id").val(kpi.id);
                }
            }
            $("#id_parent").val(parent_id);
        }
        $("#id_person_id").val($scope.person.user_id);
        $scope.bind_update(id, parent_id);
    };

    $scope.bind_update = function (id, parent_id) {
        $("#id_save_change").unbind('click');
        $("#id_save_change").click(function () {
            var data = {
                parent: $("#id_parent").val(),
                obj_id: $("#id_obj_id").val(),
                person_id: $("#id_person_id").val(),
                type: $("#id_type").val(),
                name: $('#id_name').val(),
                description: $('#id_description').val()
            };
            $("#id_saving").show();
            $http.post('/performance/team-performance/', data).success(function (data) {
                $("#kpi-modal").modal('hide');
                if (data == "changed") {
                    window.location.reload();
                } else if (typeof data == "object") {
                    if ($("#id_type").val() == "kpi") {
                        if (data.parent == null) {
                            $scope.person.kpis.push(data.obj);
                        } else {
                            var objs = $scope.get_kpi(data.parent);
                            if (objs.length == 1) {
                                objs[0].children.push(data.obj);
                            }
                        }
                    } else if ($("#id_type").val() == "comp") {
                        if (data.parent == null) {
                            $scope.person.competencies.push(data.obj);
                        } else {
                            var objs = $scope.get_competency(data.parent);
                            if (objs.length == 1) {
                                objs[0].children.push(data.obj);
                            }
                        }
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                } else if (data == "ok") {
                    if ($("#id_type").val() == "kpi") {
                        var kpi = $scope.get_kpi(id, parent_id);
                        if (kpi) {
                            kpi[0].name = $('#id_name').val();
                            kpi[0].description = $('#id_description').val();
                        }
                    } else if ($("#id_type").val() == "comp") {
                        var comp = $scope.get_competency(id, parent_id);
                        if (comp) {
                            comp[0].name = $('#id_name').val();
                            comp[0].description = $('#id_description').val();
                        }
                    }
                } else if (data == 'failed') {
                    alert("Lỗi lưu data");
                } else {
                    alert(data);
                }
                $("#id_saving").hide();
            }).error(function (data, status, headers, config) {
                $("#id_saving").hide();
                alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
            });
        });
    };

    $scope.change_department = function () {
        if ($scope.department) {
            $scope.goals = $filter('filter')($scope.goals_lib, function (item) {
                if (item['department'] == $scope.department.department) {
                    return true;
                }
                return false;
            });
        } else {
            $scope.goals = $scope.goals_lib;
        }

        $('.typeahead').autocomplete('setOptions', {lookup: $scope.goals});
    }

    $scope.init_smart_kpi = function (id, parent_id) {
        $scope.bsc_category = null;
        $("#id_parent_kpi").html("");
        $("#id_parent_kpi").append("<option value=''> --- </option>");
        $("#goal-form #textarea-specific").val("");
        $("#goal-form #id-operator").val("");
        $("#goal-form #id-target").val("");
        $("#goal-form #id-unit").val("");
        $("#goal-form #id-deadline").val("");
        $("#goal-form #id_kpi_id").val("");
        var index = -1;
        $("#id_type").val("kpi");

        var order_kpis = $filter('orderBy')($scope.person.kpis, ['category_order', 'ordering', 'id']);
        for (i in order_kpis) {
            kpi = order_kpis[i];
            if (id != kpi.id) {
                $("#id_parent_kpi").append("<option value='" + kpi.id + "'>" + $scope.show_category(kpi) + ' ' + kpi.name + "</option");
            }

            if (id == kpi.id && !parent_id) {
                $("#goal-form #textarea-specific").val(kpi.name);
                $("#goal-form #id_kpi_id").val(kpi.id);
                $("#goal-form #id-operator").val(kpi.operator);
                $("#goal-form #id-target").val(kpi.target);
                $("#goal-form #id-unit").val(kpi.unit);
                $("#goal-form #id-deadline").val(kpi.deadline);
                $scope.bsc_category = kpi.category;
            }
            if (kpi.id == parent_id) {
                index = i;
            }
        }

        if (parent_id) {
            for (i in order_kpis[index].children) {
                kpi = order_kpis[index].children[i];
                if (id == kpi.id) {
                    $("#goal-form #textarea-specific").val(kpi.name);
                    $("#goal-form #id_kpi_id").val(kpi.id);
                    $("#goal-form #id-operator").val(kpi.operator);
                    $("#goal-form #id-target").val(kpi.target);
                    $("#goal-form #id-unit").val(kpi.unit);
                    $("#goal-form #id-deadline").val(kpi.deadline);
                }
            }
            $("#id_parent_kpi").val(parent_id);
        }
        $scope.obj_id = id;
        $scope.parent_id = parent_id;
        $("#id_parent_kpi").select2();
        $('#btn-specific').click();
    };

    $scope.get_cateogry_order = function (category) {
        if (category == "financial") {
            return 1;
        } else if (category == "customer") {
            return 2;
        } else if (category == "internal") {
            return 3;
        } else if (category == "learninggrowth") {
            return 4;
        } else {
            return 5;
        }
    };

    $scope.update_kpi_wizard = function () {
        $('.errors').html("");
        var data = {
            parent: $("#id_parent_kpi").val(),
            obj_id: $("#id_kpi_id").val(),
            person_id: $("#id_person_id_kpi").val(),
            type: 'kpi',
            name: $('#goal-form #textarea-specific').val(),
            operator: $('#goal-form #id-operator').val(),
            target: $('#goal-form #id-target').val(),
            unit: $('#goal-form #id-unit').val(),
            deadline: $('#goal-form #id-deadline').val(),
            category: $scope.bsc_category
        };
        $("#id_kpi_saving").show();
        $http.post('/performance/own-performance/', data).success(function (data) {
            if (data == "changed") {
                $("#kpi-wizard").modal('hide');
                window.location.reload();
            } else if (typeof data == "object" && data['status'] == 'ok') {
                $("#kpi-wizard").modal('hide');
                if (data.parent == null) {
                    $scope.person.kpis.push(data.obj);
                } else {
                    var objs = $scope.get_kpi(data.parent);
                    if (objs.length == 1) {
                        objs[0].children.push(data.obj);
                    }
                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            } else if (data == "ok") {
                $("#kpi-wizard").modal('hide');
                var kpi = $scope.get_kpi($scope.obj_id, $scope.parent_id);
                if (kpi) {
                    kpi[0].name = $('#goal-form #textarea-specific').val();
                    kpi[0].description = $('#goal-form #id_description').val();
                    kpi[0].name = $('#goal-form #textarea-specific').val();
                    kpi[0].operator = $('#goal-form #id-operator').val();
                    kpi[0].target = $('#goal-form #id-target').val();
                    kpi[0].unit = $('#goal-form #id-unit').val();
                    kpi[0].deadline = $('#goal-form #id-deadline').val();
                    kpi[0].category = $scope.bsc_category;
                    kpi[0].category_order = $scope.get_cateogry_order($scope.bsc_category);
                }

            } else if (typeof data == "object") {
                focus = null;
                if (data['specific']) {
                    $('.specific-error').html(data['specific']);
                    focus = "specific";
                }
                if (data['category']) {
                    $('.category-error').html(data['category']);
                    focus = "specific";
                }
                if (data['operator']) {
                    $('.measurable-error').html(data['operator']);
                    if (!focus) {
                        focus = "measurable";
                    }
                }
                if (data['target']) {
                    $('.measurable-error').html(data['target']);
                    if (!focus) {
                        focus = "measurable";
                    }
                }
                if (data['unit']) {
                    $('.measurable-error').html(data['unit']);
                    if (!focus) {
                        focus = "measurable";
                    }
                }
                if (data['deadline']) {
                    $('.deadline-error').html(data['deadline']);
                    if (!focus) {
                        focus = 'time-bound';
                    }
                }
                if (focus) {
                    $('#goal-form #myTab a[href="#' + focus + '"]').tab('show')
                }
            } else {
                $("#kpi-wizard").modal('hide');
                alert(data);
            }
            $("#id_kpi_saving").hide();
        }).error(function (data, status, headers, config) {
            $("#id_kpi_saving").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.add_child_competency = function (comp) {
        $scope.load_competency();
        $("#id_parent").val(comp.id).trigger("change");
    };


    $scope.load_competency = function (id, parent_id) {
        $("#id_parent").html("");
        $("#id_parent").append("<option value=''> --- </option");
        $("#id_name").val("");
        $("#id_description").val("");
        $("#id_obj_id").val("");
        var index = -1;
        $("#id_type").val("comp");
        $("#id-modal-title").html("Update Competency");
        if (!id && !parent_id) {
            $("#id-modal-title").html(gettext("Add Competency"));
        }

        url = "/performance/competencies/autocomplete/";
        $("#id_name").autocomplete({
            serviceUrl: url,
            onSelect: function (suggestion) {
                $("#id_name").val(suggestion.data);
            }
        });

        for (i in $scope.person.competencies) {
            comp = $scope.person.competencies[i];
            if (id != comp.id) {
                $("#id_parent").append("<option value='" + comp.id + "'>" + comp.name + "</option>");
            }

            if (id == comp.id && !parent_id) {
                $("#id_name").val(comp.name);
                $("#id_description").val(comp.description);
                $("#id_description").enable(true);
                $("#id_obj_id").val(comp.id);
            }
            if (comp.id == parent_id) {
                index = i;
            }
        }

        if (parent_id) {
            for (i in $scope.person.competencies[index].children) {
                comp = $scope.person.competencies[index].children[i];
                if (id == comp.id) {
                    $("#id_name").val(comp.name);
                    $("#id_description").val("");
                    $("#id_description").enable(false);
                    $("#id_obj_id").val(comp.id);
                }
            }
            $("#id_parent").val(parent_id);
        }
        $("#id_person_id").val($scope.person.user_id);
        $scope.bind_update(id, parent_id);
    };

    $scope.update_share = function () {
        $("#waiting").show();
        var data = {
            share_to_manager: $scope.share_to_manager,
            share_to_all: $scope.share_to_all
        };
        $http.post('/performance/team-performance/', data).success(function (data) {
            console.log(data);
            $("#waiting").hide();
            for (i in $scope.people) {
                $scope.people[i].share_to_self = $scope.share_to_all;
            }
        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.update_share_for_self = function (p) {
        $("#waiting").show();

        var count = 0;
        for (i in $scope.people) {
            if ($scope.people[i].share_to_self) count += 1;
        }
        share_to_all = true;
        if ($scope.people.length != count) share_to_all = false;
        $scope.share_to_all = share_to_all;
        var data = {
            share_to_self: p.share_to_self,
            user_id: p.user_id,
            share_to_all: share_to_all
        };
        $http.post('/performance/team-performance/', data).success(function (data) {
            console.log(data);
            $("#waiting").hide();
        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.scale_unit = 3.8;

    $scope.position = function (score, k, extra) {
        if (isNaN(score)) {
            return {};
        } else {
            if (score > 0) {
                return {left: (score * $scope.scale_unit + extra) + "px"};
            } else {
                return {};
            }
        }
    };

    $scope.show_person = function () {
        if (!$scope.person) {
            return {};
        }
        var x_score = $scope.person.competency_final_score;
        var y_score = $scope.person.kpi_final_score;
        x_score = x_score * 540 / 100;
        y_score = 520 - y_score * 520 / 100;
        return {
            left: x_score + "px",
            top: y_score + "px"
        };
    };

    $scope.search = function () {
        $scope.filteredPeople = $filter('filter')(
            $scope.people,
            function (item) {
                if ($scope.query == "") {
                    return true;
                }
                if (item.job_title_name == $scope.query) {
                    return true;
                }
                return false;
            });
        $scope.changePerson(0);
    };

    $scope.get_kpi = function (id, parent_id) {
        if (parent_id) {
            var parent = $filter('filter')($scope.person.kpis, function (item) {
                if (item['id'] == parseInt(parent_id)) {
                    return true;
                }
                return false;
            });
            return $filter('filter')(parent[0].children, function (item) {
                if (item['id'] == parseInt(id)) {
                    return true;
                }
                return false;
            });
        } else {
            return $filter('filter')($scope.person.kpis, function (item) {
                if (item['id'] == parseInt(id)) {
                    return true;
                }
                return false;
            });
        }
    };

    $scope.get_competency = function (id, parent_id) {
        if (parent_id) {
            var parent = $filter('filter')($scope.person.competencies, function (item) {
                if (item['id'] == parseInt(parent_id)) {
                    return true;
                }
                return false;
            });
            return $filter('filter')(parent[0].children, function (item) {
                if (item['id'] == parseInt(id)) {
                    return true;
                }
                return false;
            });
        } else {
            return $filter('filter')($scope.person.competencies, function (item) {
                if (item['id'] == parseInt(id)) {
                    return true;
                }
                return false;
            });
        }
    };

    $scope.check_score = function (objs) {
        for (i in objs.children) {
            if (objs.children[i].score > 0) {
                return true;
            }
        }
        return false;
    };

    $scope.reset_score = function (objs) {
        for (i in objs.children) {
            objs.children[i].score = 0;
        }
        return false;
    };

    $scope.kpi_category = function (kpi) {

    };

    $scope.update_kpi = function (id, value, old_value, obj, parent_id) {
        var reset = 0;
        if (id && !parent_id) {
            kpi = $scope.get_kpi(id)[0];
            if ($scope.check_score(kpi)) {
                if (!confirm("Moving this person here will clear the answers recorded in this person's Questionaire, or Individual Goals for this factor.Are you sure you want to clear these answers?")) {
                    $(obj).css('left', old_value);
                    return;
                }
                $scope.reset_score(kpi);
                reset = 1;
            }
        } else if (id && parent_id) {
            kpi = $scope.get_kpi(id, parent_id)[0];
            if ($scope.enable_bsc && (!kpi.self_confirmed || !kpi.manager_confirmed)) {
                if (!kpi.manager_confirmed) {
                    $(obj).css('left', old_value);
                    alert("Vui lòng xác nhận KPI trước khi đánh giá.");
                    return;
                } else if (!kpi.self_confirmed) {
                    $(obj).css('left', old_value);
                    alert("Nhân viên của bạn chưa xác nhận KPI này. Vui lòng nhắc nhở nhân viên xác nhận KPI trước khi đánh giá.");
                    return;
                }
            }
        }

        $("#waiting").show();
        $('#ballsWaveG').fadeIn();
        var data = {
            kpi_id: id,
            value: value,
            person: $scope.person.user_id,
            reset: reset
        };
        $http.post('/performance/team-performance/update/?kpi=1', data).success(function (data) {
            //console.log(data);
            var old_score = 0;
            if (typeof data == 'object') {
                if (parent_id && data.score >= 0) {
                    kpi = $scope.get_kpi(parent_id);
                    old_score = kpi[0].score;
                    kpi[0].score = data.score;
                }

                result = $scope.get_kpi(id, parent_id);
                if (result.length == 1) {
                    old_score = result[0].score;
                    result[0].score = value;
                }
                $scope.person.kpi_final_score = data.final_score;
                $scope.person.min_score_kpi = data.min_score;
                $scope.person.max_score_kpi = data.max_score;
                $scope.person.strength_kpi = data.strength_kpi;
                $scope.person.weak_kpi = data.weak_kpi;
                $scope.draw_person();
            } else {
                $(obj).css('left', old_value);
            }
            $scope.update_progress();
            var percent = $scope.person_progress($scope.person, true);
            old_score = old_score == null ? 0 : old_score;
            if ((old_score == 0 && value > 0) || value == 0) {
                $scope.update_review(percent, $scope.person.user_id);
            }
            $("#waiting").hide();
            $('#ballsWaveG').fadeOut();
        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            $('#ballsWaveG').fadeOut();
            $(obj).css('left', old_value);
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.update_comp = function (id, value, old_value, obj, parent_id) {
        var reset = 0;
        if (id && !parent_id) {
            comp = $scope.get_competency(id)[0];
            if ($scope.check_score(comp)) {
                if (!confirm("Moving this person here will clear the answers recorded in this person's Questionaire, or Individual Goals for this factor.Are you sure you want to clear these answers?")) {
                    $(obj).css('left', old_value);
                    return;
                }
                $scope.reset_score(comp);
                reset = 1;
            }
        }

        $("#waiting").show();
        $('#ballsWaveG').fadeIn();
        var data = {
            comp_id: id,
            value: value,
            person: $scope.person.user_id,
            reset: reset
        };
        $http.post('/performance/team-performance/update/?comp=1', data).success(function (data) {
            var old_score = 0;
            if (typeof data == 'object') {
                if (parent_id && data.score >= 0) {
                    comp = $scope.get_competency(parent_id);
                    old_score = comp[0].score;
                    comp[0].score = data.score;
                }
                result = $scope.get_competency(id, parent_id);
                if (result.length == 1) {
                    old_score = result[0].score;
                    result[0].score = value;
                }

                $scope.person.competency_final_score = data.final_score;
                $scope.person.min_score_competency = data.min_score;
                $scope.person.max_score_competency = data.max_score;
                $scope.person.strength_competency = data.strength_competency;
                $scope.person.weak_competency = data.weak_competency;
                $scope.draw_person();
            } else {
                $(obj).css('left', old_value);
            }
            // console.log(data);
            $scope.update_progress();
            var percent = $scope.person_progress($scope.person, true);
            old_score = old_score == null ? 0 : old_score;
            if ((old_score == 0 && value > 0) || value == 0) {
                $scope.update_review(percent, $scope.person.user_id);
            }
            $("#waiting").hide();
            $('#ballsWaveG').fadeOut();
        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            $('#ballsWaveG').fadeOut();
            $(obj).css('left', old_value);
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.delete_kpi = function (user_id, kpi, is_child, parent) {
        if (!confirm(gettext('Do you want to delete KPI') + "\" " + kpi.name + "\" "+ gettext('are you sure?'))) {
            return;
        }
        var data = {
            kpi_id: kpi.id,
            user_id: user_id
        };
        $("#waiting").show();
        $http.post('/performance/kpi/delete/', data).success(function (data) {
            if (data != "ok") {
                $("#waiting").hide();
                alert(data);
                return;
            }
            if (!is_child) {
                var index = $scope.person.kpis.indexOf(kpi);
                if (index != -1) {
                    $scope.person.kpis.splice(index, 1);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            } else {
                var index = parent.children.indexOf(kpi);
                if (index != -1) {
                    parent.children.splice(index, 1);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }
            console.log(data);
            $("#waiting").hide();

        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            alert(gettext("Delete KPI error. Try again"));
        });
    };

    $scope.delete_competency = function (user_id, competency, is_child, parent) {
        if (!confirm(gettext('Do you want to delete KPI') + "\"" + competency.name + "\""+ gettext('are you sure?'))) {
            return;
        }
        var data = {
            competency_id: competency.id,
            user_id: user_id
        };
        $("#waiting").show();
        $http.post('/performance/competency/delete/', data).success(function (data) {
            if (data != "ok") {
                $("#waiting").hide();
                alert(data);
                return;
            }
            if (!is_child) {
                var index = $scope.person.competencies.indexOf(competency);
                if (index != -1) {
                    $scope.person.competencies.splice(index, 1);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            } else {
                var index = parent.children.indexOf(competency);
                if (index != -1) {
                    parent.children.splice(index, 1);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }
            $("#waiting").hide();
        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            alert(gettext("Delete competency error. Try again"));
        });
    };

    $scope.get_round_progress = function (p) {
        return Math.round($scope.person_progress(p, true));
    };

    $scope.person_progress = function (p, per) {
        var count_kpis = 0;
        for (i in p.kpis) {
            if (p.kpis[i].weight > 0) {
                count_kpis += 1;
            }
        }

        var total = count_kpis + p.competencies.length;
        var count = 0;
        for (i in p.kpis) {
            kpi = p.kpis[i];
            if (kpi['score'] > 0 && kpi.weight > 0) count++;

        }
        for (i in p.competencies) {
            comp = p.competencies[i];
            if (comp['score'] > 0) count++;
        }

        var percent = 0;
        if (total > 0) percent = count / total * 100;

        if (per) return percent;
        return count;
    };

    $scope.total_progress = function () {
        if (!$scope.person) {
            return;
        }

        var total = $scope.get_total_job();
        var count = 0;
        for (i in $scope.people) {
            p = $scope.people[i];
            count += $scope.person_progress(p);
        }
        var percent = 0;
        if (total > 0) percent = count / total * 100;
        return Math.round(percent);
    };

    $scope.update_progress = function () {
        if (!$scope.person) {
            return;
        }
        var percent = $scope.total_progress();
        $('.progress .bar').css('width', percent + "%");
        $("#id-bar-myteam").css('width', percent + "%");
        $scope.update_self_review_progress();
        $scope.update_360_review_progress();
    };

    $scope.get_total_job = function () {
        var total = 0;
        for (i in $scope.people) {
            p = $scope.people[i];
            total += p.kpis.length + p.competencies.length;
        }
        return total;
    };

    $scope.update_review = function (percent, user_id) {
        var data = {
            percent: percent,
            user_id: user_id
        };
        $http.post('/performance/team-performance/update/?review=1', data).success(function (data) {
            console.log(data);


        });
    };

    $scope.invite_review = function () {
        var reviewee_id = $("#id_reviewee").val();
        cloudjetRequest.ajax({
            type: 'POST',
            data: {
                reviewee: reviewee_id,
                name: $('#popup-modal-body-360 #id_name').val(),
                email: $('#popup-modal-body-360 #id_email').val(),
                review_type: $('#popup-modal-body-360 #id_review_type').val(),
                content: $('#popup-modal-body-360 #id_content').val()
            },
            url: "/performance/invite-review/",
            beforeSend: function () {
                $("#send_invitation").show();
                $("#btn-send-invitation").enable(false);
            },
            success: function (data) {
                if (typeof data == 'object') {
                    $('#inviteModal').modal('hide');
                    for (i in $scope.people) {
                        p = $scope.people[i];
                        if (p.user_id == parseInt(reviewee_id)) {
                            p.reviews.push(data);
                            $scope.$apply();
                            break;
                        }
                    }
                } else {
                    $('#inner-invitation').html(data);
                }
                $("#send_invitation").hide();
                $("#btn-send-invitation").enable(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#send_invitation").hide();
                $("#btn-send-invitation").enable(true);
            }
        });
    };

    $scope.show_invitation_form = function (p) {
        $('#inviteModal .modal-title span').text(p.name);
        $('#reset-invitation-form').click();
        $("#id_reviewee").val(p.user_id);
        $('#inner-invitation .errorlist').remove();
        $('#inviteModal').modal();
    };

    $scope.init_invitation = function () {
        $('#popup-modal-body-360 #id_name').typeahead({
            source: function (query, process) {
                names = [];
                map = {};

                $.each($scope.names, function (i, obj) {
                    map[obj.name] = obj;
                    names.push(obj.name);
                });

                process(names);
            },
            updater: function (item) {
                var obj = map[item];
                $('#popup-modal-body-360 #id_email').val(obj.email);
                return obj.name;
            }
        });
    };

    $scope.update_self_review_progress = function () {
        var total_percent = 0;
        for (i in $scope.people) {
            p = $scope.people[i];
            total_percent += p.self_percent_finished;
        }
        var percent = 0;
        if ($scope.people.length > 0) {
            percent = total_percent / ($scope.people.length * 100) * 100;
        }
        $('#id-bar-self').css('width', percent + "%");
    };

    $scope.update_360_review_progress = function () {
        var count = 0;
        var total_count = 0;
        for (i in $scope.people) {
            p = $scope.people[i];
            total_count += p.reviews.length;
            for (j in p.reviews) {
                if (p.reviews[j].is_complete) {
                    count += 1;
                }
            }
        }
        var percent = 0;
        if (total_count > 0) {
            percent = count / total_count * 100;
        }
        $('#id-bar-360').css('width', percent + "%");
    };

    $scope.copy_kpi_to = function (user_id, kpi, child) {
        $('#id_kpi_from').val(kpi.id);
        $('#id_type').val('kpi');
        $("#copy-kpi-modal #id-modal-title").html(gettext("Copy KPI"));

        $(".copy-all span").html(gettext("Copy all KPIs of the current employee for this employee."));
        $scope.copy_all = null;
        $scope.employee_to = null;
        $("#id_employee_to").select2("val", "");
        if (child) {
            $('.parent-for-child').show();
            $(".parent-for-child label").html(gettext("Main KPI:"));
            $(".copy-all").hide();
        } else {
            $('.parent-for-child').hide();
            $scope.selected_kpi = null;
            $(".copy-all").show();
        }

        $scope.get_user_list(user_id);
        $("#copy-kpi-modal").modal('show');
        $("#copy-status").hide();
    };

    $scope.get_user_list = function (user_id) {
        var data = {
            user_id: user_id
        };
        $('#employee-loading').show();
        $scope.employee_choices = null;
        $http.post('/performance/people/json/', data).success(function (data) {
            if (typeof data == "object") {
                $scope.employee_choices = data;
            }
            $('#employee-loading').hide();
        });
    };

    $scope.load_kpi_by_user = function () {
        $("#copy-status").hide();
        var data = {
            user_id: $scope.employee_to
        };
        $('#kpi-loading').show();

        var type = $('#id_type').val();
        if (type == 'kpi') {
            url = '/performance/get-current-kpis/';
        } else if (type == 'comp') {
            url = '/performance/get-current-competencies/';
        } else {
            return;
        }

        $scope.current_kpis = null;
        $http.post(url, data).success(function (data) {
            if (typeof data == "object") {
                $scope.current_kpis = data;
            }
            $('#kpi-loading').hide();
        });
    };

    $scope.process_copy = function () {
        $("#id_copy_btn").enable(false);
        if (!$scope.employee_to) {
            alert('Vui lòng chọn nhân viên!');
            $("#id_copy_btn").enable(true);
            return;
        }
        var data = {
            user_id: $scope.employee_to,
            obj_id: $('#id_kpi_from').val(),
            parent_id: $scope.selected_kpi,
            copy_all: $scope.copy_all
        };
        var type = $('#id_type').val();
        if (type == 'kpi') {
            url = '/performance/copy-kpi/';
        } else if (type == 'comp') {
            url = '/performance/copy-competency/';
        } else {
            return;
        }
        $http.post(url, data).success(function (data) {
            if (data == "ok") {
                $("#copy-status").html(gettext("Copy succeed. Please refresh your browser."));
                $("#copy-status").show();
                $("#id_copy_btn").enable(true);
            } else {
                $("#copy-status").html(data);
                $("#copy-status").show();
                $("#id_copy_btn").enable(true);
            }

        }).error(function (data, status, headers) {
            $("#copy-status").html(gettext("Copy failed."));
            $("#copy-status").show();
            $("#id_copy_btn").enable(true);
        });
    };

    $scope.copy_competency_to = function (user_id, comp, child) {
        $('#id_kpi_from').val(comp.id);
        $('#id_type').val('comp');
        $("#copy-kpi-modal #id-modal-title").html(gettext("Copy competency"));

        $(".copy-all span").html(gettext("Copy all competencies of the current employee for this employee."));
        $scope.copy_all = null;

        $scope.employee_to = null;
        $("#id_employee_to").select2("val", "");
        if (child) {
            $('.parent-for-child').show();
            $(".parent-for-child label").html(gettext("Main competency:"));
            $(".copy-all").hide();
        } else {
            $('.parent-for-child').hide();
            $(".copy-all").show();
        }

        $scope.current_kpis = null;
        $scope.get_user_list(user_id);
        $("#copy-kpi-modal").modal('show');
        $("#copy-status").hide();
    };

    $scope.final_list_score_360 = function (kpi) {
        var len = 0;
        if (kpi.children.length > 0) {
            len = kpi.children[0].list_score_360.length;
        }
        var list_score = [], child = null, avg_score;

        for (var i = 0; i < len; i++) {
            score = 0;
            count = 0;
            avg_score = 0;
            for (j in kpi.children) {
                child = kpi.children[j];
                if (child.list_score_360[i]) {
                    score += child.list_score_360[i];
                    count += 1;
                }
            }

            if (count > 0) {
                avg_score = score / count;
            }
            list_score.push(avg_score);
        }
        return list_score;
    };

    $scope.remove_360_invitation = function (person, review) {
        if (confirm(gettext("Do you want to delete this 360 review invitation?"))) {
            var data = {
                review_id: review.id,
                user_id: person.user_id
            };

            $http.post('/performance/invitation/remove/', data).success(function (data) {
                if (data == 'ok') {
                    var index = -1;
                    for (i in person.reviews) {
                        if (person.reviews[i].id == review.id) {
                            index = parseInt(i);
                            break;
                        }
                    }
                    if (index != -1) {
                        person.reviews.splice(index, 1);
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
            });
        }
    };

    $scope.check_email_reminder = function () {
        var self_reminders = $("input:checkbox:checked.remind_self_review");
        var r360_reminders = $("input:checkbox:checked.remind_review");
        if (self_reminders.length > 0 || r360_reminders.length > 0) {
            $("#btn-send-reminder").enable(true);
        } else {
            $("#btn-send-reminder").enable(false);
        }
    };

    $scope.has_self_reminder = function () {
        return $("input:checkbox:checked.remind_self_review").length > 0;
    };

    $scope.has_360_reminder = function () {
        return $("input:checkbox:checked.remind_review").length > 0;
    };

    $scope.has_self_and_360_reminder = function () {
        return $("input:checkbox:checked.remind_self_review").length > 0 && $("input:checkbox:checked.remind_review").length > 0;
        ;
    };

    $scope.self_reminder_list = function () {
        var result = [];
        $("input:checkbox:checked.remind_self_review").each(function () {
            result.push($(this).attr('data-name'));
        });
        return result;
    };

    $scope.r360_reminder_list = function () {
        var result = [];
        $("input:checkbox:checked.remind_review").each(function () {
            result.push($(this).attr('data-name'));
        });
        return result;
    };

    $scope.send_reminders = function () {
        var user_id_list = [];
        var review_id_list = [];

        $("input:checkbox:checked.remind_self_review").each(function () {
            user_id_list.push($(this).attr('data-user'));
        });

        $("input:checkbox:checked.remind_review").each(function () {
            review_id_list.push($(this).attr('data-pk'));
        });

        if (review_id_list.length == 0 && user_id_list.length == 0) {
            return;
        }

        var data = {
            user_id_list: user_id_list.join(","),
            review_id_list: review_id_list.join(","),
            message: $scope.msg_reminder
        };
        $("#btn-send-reminders").enable(false);
        $(".reminder-status").html("Sending ...");
        $http.post('/performance/review/reminder/', data).success(function (data) {
            $(".reminder-status").html("Email reminders sent");
            $("#btn-send-reminders").enable(true);
            setTimeout(function () {
                $("#reminder-modal").modal("hide");
            }, 1500);
        }).error(function (data, status, headers) {
            $(".reminder-status").html("Send email reminders failed.");
            $("#btn-send-reminders").enable(true);
        });
    };

    $scope.init_people_data = function () {
        if ($scope.person) {
            $("#duplicate-status").hide();
            $("#duplicate-status").html('');
            $scope.get_user_list($scope.person.user_id);
        }

        $("#id_people_choice").select2({
            placeholder: gettext("Select employee")
        })
        $("#id_people_choice").select2('data', null);
        $scope.delete_all_kpis = false;
    }

    $scope.duplicate_people = function () {
        function show_success_status(){
            $(".duplicate-action").enable(true);
            $("#duplicate-status").html(gettext("Copy succeed. Please refresh your browser."));
            $("#duplicate-status").show()
        }
        function show_failed_status(){
            $(".duplicate-action").enable(true);
            $("#duplicate-status").html(gettext("Copy failed."));
            $("#duplicate-status").show();
        }
        function show_pending_status(){
            $("#duplicate-status").html(gettext("Processing..., Please wait until this task complete!"))
            $("#duplicate-status").show();
        }
        function process_server_status(response){
            if(response=='ok'){
                show_success_status();
                $(".duplicate-action").enable(true);
                $("#duplicate-status").html(gettext("Copy succeed. Please refresh your browser."));
                $("#duplicate-status").show()
            }
            else if(response=='other'){
                show_failed_status();
            }else {
                show_pending_status();
                var cache_key=response;
                $timeout(function () {
                     $http.get('/performance/kpis-competencies/duplicate/?cache_key='+cache_key).success(function(res){
                        // alert('timeout process');
                        process_server_status(res)
                    });
                }, 2000);

            }
        }

        if (!$scope.person) {
            return;
        }

        list_user = $("#id_people_choice").val();
        if (!list_user) {
            alert(gettext('Please select an employee!'));
            return;
        }
        var data = {
            user_id: $scope.person.user_id,
            list_user: list_user,
            delete_all_kpis: $scope.delete_all_kpis
        };

        $(".duplicate-action").enable(false);
        $http.post('/performance/kpis-competencies/duplicate/', data).success(function (response) {
            process_server_status(response);

        }).error(function (data, status, headers) {
            show_failed_status();

        });

    }

    $scope.export_to_excel = function () {
        if ($scope.person && $scope.person.user_id) {
            $("#id_user_export").val($scope.person.user_id);
            $("#id_quarter_period_export").val($scope.quarter_period);
            $("#id_report").submit();
        }
    }

    $scope.show_score = function (kpi) {
        return show_percent(kpi.score);
    };

    $scope.calculate_score = function (kpi) {
        if (kpi.target !== '' || kpi.target != null) {
            if (isNaN(kpi.target)) {
                alert("Target KPI must be a number");
                return;
            }
        }
        if (!isNaN(kpi.real) && kpi.real !== '' && kpi.real !== null && (kpi.target === '' || kpi.target == null)) {
            alert("KPI chưa xét mục tiêu. Vui lòng nhập mục tiêu cho KPI \"" + kpi.name + "\".");
        }

        if (!isNaN(kpi.real) && kpi.real !== '' && kpi.real !== null && (kpi.operator == '' || kpi.operator == null)) {
            alert("KPI chưa chọn phép toán tính điểm. Vui lòng chọn phép toán tính điểm cho KPI \"" + kpi.name + "\".");
        }

        if (kpi.real && kpi.assigned_to) {
            alert("KPI đã được phân công nên bạn cần đánh gía tại trang đánh giá của nhân viên.");
            return;
        }


        if (kpi.operator && !isEmpty(kpi.target) && ( !isEmpty(kpi.real) || kpi.review_type == 'monthly' ) && !isNaN(kpi.target) && !isNaN(kpi.real))// tại sao cái này?  && kpi.assigned_to == null)
        {
            var score = 0, target, real;
            target = parseFloat(kpi.target);
            real = calculate_real(kpi);
            kpi.real = real;

           // score = kpi_score_calculator(kpi.operator, target, real);
            //if (score > 100) {
            //    score = 100;
            //}
            $scope.update_score_kpi(kpi, null);
        } else if (!isEmpty(kpi.target) && !isNaN(kpi.target)) {
            $scope.update_score_kpi(kpi, null);
        }
    };

    $scope.update_score_kpi = function (kpi, score) {
        //var data = {
        //	kpi_id: kpi.id,
        //	operator: kpi.operator,
        //	target: kpi.target,
        //	unit: kpi.unit,
        //	real: kpi.real,
        //	score: score
        //};
        kpi.kpi_id = kpi.id;
        kpi.score = score;
        var data = kpi;
        $("#waiting").show();
        $("#id_saving_kpi_" + kpi.id).show();
        $('#id_saved_kpi_' + kpi.id).hide();
        $('#ballsWaveG').fadeIn();
        $http.post('/performance/kpi/update-score/', data).success(function (response) {


            if (response.score != null) {
                kpi.score = response.score;
                parent = $scope.get_kpi(response.parent_id);
                if (parent.length > 0) {
                    parent[0].score = response.parent_score;
                    parent[0].self_score = response.parent_score;
                }
                $scope.person.kpi_final_score = response.final_score;
            }
            //update review
            if ($scope.current) {
                var percent = $scope.person_progress($scope.person, true);
                $scope.update_review(percent, $scope.person.user_id);
            }

            $("#waiting").hide();
            $("#id_saving_kpi_" + kpi.id).hide();
            $('#id_saved_kpi_' + kpi.id).show();
            $('#ballsWaveG').fadeOut();
        }).error(function (data, status, headers, config) {
            $("#id_saving_kpi_" + kpi.id).hide();
            $('#id_saved_kpi_' + kpi.id).hide();
            $("#waiting").hide();
            $('#ballsWaveG').fadeOut();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.total_weight = function () {
        if (!$scope.person) {
            return;
        }
        var total = 0;
        for (i in $scope.person.kpis) {
            total += $scope.person.kpis[i].weight;
        }
        return total;
    }

    $scope.weight_percent = function (kpi) {
        var total = $scope.total_weight();
        return $scope.convert_percent(kpi.weight, total);
    }

    $scope.convert_percent = function (weight, total) {
        if (total > 0) {
            return (weight / total * 100).toFixed(1);
        }
        return 0;
    }

    $scope.update_role = function () {
        $("#waiting").show();
        var data = {
            profile_id: $scope.person.profile,
            user_id: $scope.person.user_id
        };
        $http.post('/performance/update-role/', data).success(function (data) {
            $("#waiting").hide();
        }).error(function (data, status, headers, config) {
            $("#waiting").hide();
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    };

    $scope.add_child_kpi = function (kpi) {
        $scope.init_smart_kpi();
        $("#id_parent_kpi").val(kpi.id).trigger("change");
        $scope.bsc_category = kpi.category;
    };

    $scope.assigned_to = function (user_id, kpi) {
        if (!$scope.current) {
            return;
        }
        var data = {
            user_id: user_id
        };
        $('#assign-employee-loading').show();
        $scope.current_kpi = kpi;
        $("#assigned-to-modal").modal('show');
        if (kpi.assigned_to) {
            $scope.assign_employee_to = kpi.assigned_to.user_id;
        }
        $scope.assign_employees = [];
        $http.post('/performance/subordinate/users/', data).success(function (data) {
            if (typeof data == "object") {
                $scope.assign_employees = data;
            }
            $('#assign-employee-loading').hide();
        });
    }

    $scope.assign_kpi_my_team = function (user_id, kpi) {
        if (confirm("KPI \"" + kpi.name + "\" "+gettext("will be assigned to the subordinate members of this group. Are you sure?"))) {
            $http.post('/performance/assign-kpi-for-team-member/', {
                user_id: user_id,
                kpi_id: kpi.id
            }).success(function (data) {
                if (typeof data == "object") {
                    kpi.children = [];
                    kpi.children = data;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            }).error(function (data, status, headers, config) {
                alert(gettext("KPI assignment failed."))
            });
        }
    }

    $scope.save_assign = function (kpi) {
        if (!$scope.current) {
            return;
        }
        if (!$scope.assign_employee_to) {
            alert(gettext("You have not selected an employee."))
        } else {
            $("#id_assign_btn").enable(false);

            parent = false;
            if (kpi.hasOwnProperty('children')) {
                parent = true;
            }
            data = {
                user_id: $scope.assign_employee_to,
                kpi_id: kpi.id,
                parent: parent
            };
            $http.post("/performance/assign/kpi/", data).success(function (response) {
                if (typeof response == 'object') {
                    if (parent) {
                        kpi.children.push(response);
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    } else {
                        kpi.assigned_to = response;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
                $("#assigned-to-modal").modal('hide');
                $("#id_assign_btn").enable(true);
            }).error(function (data, status, headers) {
                $("#id_assign_btn").enable(true);
                alert(gettext("Error saving data"));
            });
        }
    }

    $scope.add_member = function () {
        var data = $("#id-form-member").serializeArray();
        $("#id-form-member #id_saving").show();
        $("#id_btn_add_member").enable(false);
        $http.post('/performance/member/new/', data).success(function (response) {
            $("#id-form-member #id_saving").hide();
            $("#id_btn_add_member").enable(true);
            if (typeof response == "object") {
                $("#member-modal").modal('hide');
                $scope.people.push(response);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            } else {
                $("#id-form-member .items li:not(:last-child)").remove();
                $("#id-form-member .items li:last").before(response);
            }
        }).error(function (data, status, headers, config) {
            $("#id-form-member #id_saving").hide();
            $("#id_btn_add_member").enable(true);
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    }

    $scope.align_up_kpi = function (user_id, kpi) {
        $('#align-up-loading').show();
        $scope.current_kpi = kpi;
        $scope.selected_kpi = null;
        $("#align-up-modal").modal('show');
        if (kpi.cascaded_from) {
            $scope.selected_kpi = kpi.cascaded_from.toString();
        }
        $scope.align_kpis = [];
        $http.get('/performance/kpi/align-up/?user_id=' + user_id).success(function (data) {
            if (typeof data == "object") {
                $scope.align_kpis = data;
            }
            $('#align-up-loading').hide();
        });
    }

    $scope.save_align_up_kpi = function (kpi, user_id) {
        $("#align-up-modal #copy-status").hide();
        $("#id_align_up_btn").enable(false);
        var data = {
            kpi_id: $scope.selected_kpi,
            aligned_kpi_id: kpi.id,
            user_id: user_id
        };
        if ($('#consultant-align-by-id').is(':checked') && $('#align_to_kpi_id').val() !== '') {
            data.kpi_id = $('#align_to_kpi_id').val();
        }

        $http.post('/performance/kpi/align-up/', data).success(function (response) {
            $("#id_align_up_btn").enable(true);
            if (typeof response == "object") {
                $("#align-up-modal").modal('hide');
                kpi.cascaded_from = response.cascaded_from;
                kpi.category = response.category;
                kpi.ordering = response.ordering;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            } else {
                $("#align-up-modal #copy-status").html(data);
                $("#align-up-modal #copy-status").show()
            }
        }).error(function (data, status, headers, config) {
            $("#id_align_up_btn").enable(true);
            alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
        });
    }

    $scope.first_char = function (txt) {
        if (txt != null && txt != "" && txt[0]) {
            if (txt[0] == 'i') {
                return "P";
            } else {
                return txt[0].toUpperCase();
            }
        }
        return ".."
    }

    $scope.show_category = function (kpi) {
        if (kpi.category != null && kpi.category != "" && kpi.category[0]) {
            return "[" + $scope.first_char(kpi.category) + "]";
        }
        return "";
    }
    $scope.confirm_kpi = function (kpi, mode) {
        $("#kc" + kpi.id).enable(false);
        $http.post("/performance/kpi/confirm/", {kpi_id: kpi.id, mode: mode}).success(function (response) {
            if (response == "ok") {
                kpi.manager_confirmed = true;
            } else {
                alert(response);
            }
            $("#kc" + kpi.id).enable(true);
        }).error(function (data, status, headers) {
            $("#kc" + kpi.id).enable(true);
            alert("Lỗi lưu data");
        });
    }

    $scope.count_kpi_not_confirm = function (kpi) {
        if (kpi.children.length == 0) {
            if (kpi.manager_confirmed) return 0;
            else return 1;
        } else {
            var count = 0;
            for (i in kpi.children) {
                if (!kpi.children[i].manager_confirmed && kpi.children[i].weight > 0) count++;
            }
            return count;
        }
    };

    $scope.total_kpi_not_confirm = function (person) {
        var count = 0;
        for (i in person.kpis) {
            count += $scope.count_kpi_not_confirm(person.kpis[i]);
        }
        return count;
    };

    $scope.remove_assigned_to = function (kpi) {
        if (confirm("Are you sure?")) {
            var data = {
                kpi_id: kpi.id,
                user_id: $scope.person.user_id,
                assigned_to: kpi.assigned_to.user_id
            };

            $http.post("/performance/kpi/remove-assigned-to/", data).success(function (response) {
                if (response == "ok") {
                    kpi.assigned_to = null;
                }
            }).error(function (data, status, headers) {
                alert("Lỗi lưu data");
            });
        }
    };

    $scope.load_comments = function (kpi) {
        $("#loader-" + kpi.id).show();
        $http.post("/performance/kpi/comments/load/", {kpi_id: kpi.id}).success(function (response) {
            if (typeof response == "object") {
                kpi.notes = response.results;
                kpi.total_notes = response.results.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $("#loader-" + kpi.id).hide();
            }
        }).error(function (data, status, headers) {
            $("#loader-" + kpi.id).hide();
            alert("Lỗi load data");
        });
    };

    $scope.init_transfer_kpi = function (kpi, user_id) {
        $scope.transfer_kpi = kpi;
        $scope.selected_user = null;
        $('#transfer-status').hide();
        $("#transfer-modal").modal('show');
        $("#transfer-loading").show();
        $scope.transfer_users = [];
        $http.get('/performance/move-kpi/?user_id=' + user_id).success(function (data) {
            if (typeof data == "object") {
                $scope.transfer_users = data;
                if (data.length > 0) {
                    $scope.selected_user = data[0].user_id;
                }
            }
            $('#transfer-loading').hide();
        }).error(function (data, status, headers) {
            $("#transfer-loading").hide();
        });
    };

    $scope.transfer_kpi_to = function (from_user_id) {
        if (!$scope.selected_user) {
            alert("Please select a member.");
        }
        $("#id_transfer_btn").enable(false);
        var data = {
            from_user_id: from_user_id,
            to_user_id: $scope.selected_user,
            kpi_id: $scope.transfer_kpi.id
        }
        $.post('/performance/move-kpi/', data, function (res) {
            var index = $scope.person.kpis.indexOf($scope.transfer_kpi);
            if (index != -1) {
                $scope.person.kpis.splice(index, 1);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $('#transfer-status').html("KPI has transfered successful.");
                $('#transfer-status').show();
            }
            $("#id_transfer_btn").enable(true);
        }).fail(function () {
            $("#id_transfer_btn").enable(true);
            alert("Unable transfer this KPI. Please try again.");
        });
    };

    $scope.count_hidden_kpi = function (kpi) {
        var count = 0;
        for (i in kpi.children) {
            if (kpi.children[i].assigned_to) {
                count += 1;
            }
        }
        if (count > 0) {
            return interpolate(gettext("Show %s assigned KPIs were hidden"), [count]);
        }
        return '';
    }

    $scope.show_kpi = function () {
        $scope.hide_assigned_kpi = false;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.to_percent = function (score) {
        return score_to_percent(score) + "%";
    };

    $scope.draw_performance_chart = function () {
        history_scores = $scope.person.history_scores;
        data = [];
        for (i in history_scores) {
            his = history_scores[i];
            his_date = new Date(his.due_date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            score = score_to_percent(his.kpi_score);
            data.push([{v: his_date, f: his.quarter_name}, {v: parseFloat(score), f: score + "%"}]);
        }
        try {
            $scope.drawChart(data);
        } catch (e) {
        }
    }

    $scope.drawChart = function (list_row) {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('date', gettext('Review Periods'));
        dataTable.addColumn('number', gettext('Performance Score'));

        dataTable.addRows(list_row);

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(dataTable, 0);
        formatter.format(dataTable, 1); // Apply formatter to second column

        var options = {
            width: 661,
            height: 561,
            pointSize: 5,
            vAxis: {
                title: gettext('Performance Score'),
                minValue: 0
            },
            hAxis: {
                title: gettext('Review Periods')
            }
        };

        var chart = new google.charts.Line(document.getElementById('performance-chart'));

        var dataView = new google.visualization.DataView(dataTable);
        dataView.setColumns([{
            calc: function (data, row) {
                return data.getFormattedValue(row, 0);
            }, type: 'string'
        }, 1]);

        chart.draw(dataView, options);
    };

    $scope.update_chart_type = function (ctype) {
        $scope.chart_type = ctype;
    };
    $scope.hide_score = function () {
        $('.show-performance-score').hide();
    };

    $scope.count_kpi_no_review = function (kpi) {
        if (kpi.children.length == 0) {
            //if ((kpi.score == 0 || kpi.score == null) && kpi.weight > 0) {
            if ((kpi.score == null) && kpi.weight > 0) {
                return 1 + ngettext(" KPI is not rated", " KPIs are not rated", 1);
            }
            return '';
        } else {
            count = 0;
            for (i in kpi.children) {
                //if ((kpi.children[i].score == 0 || kpi.children[i].score === null) && kpi.children[i].weight > 0) {
                if (( kpi.children[i].score === null) && kpi.children[i].weight > 0) {
                    count += 1;
                }
            }
            if (count > 0) {
                return count + ngettext(" KPI is not rated", " KPIs are not rated", count);
            }
            return '';
        }
    };

    $scope.show_tooltip = function (kpi) {
        console.log(kpi.unit);
    }

    $scope.toggle_show_kpi = function (kpi, status) {
        if (status) {
            kpi.showing = true;
        } else {
            kpi.showing = false;
        }
    }

    $scope.load_src_iframe = function (person) {
        if (person) {
            return $sce.trustAsResourceUrl("/performance/kpi/import/" + person.user_id + "/");
        }
        return null;
    }

    $scope.update_plan = function (person, type) {
        var data = {
            id: person.profile
        };
        if (type == 1) {
            data['short_term_career'] = $scope.short_term_career;
        } else if (type == 2) {
            data['short_term_development'] = $scope.short_term_development;
        } else if (type == 3) {
            data['long_term_career'] = $scope.long_term_career;
        } else if (type == 4) {
            data['long_term_development'] = $scope.long_term_development;
        } else {
            return;
        }
        $("#waiting").show();
        cloudjetRequest.ajax({
            type: 'POST',
            data: data,
            url: "/performance/update-plan/",
            beforeSend: function () {
                $("#waiting").show();
            },
            success: function (data) {
                $("#waiting").hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#waiting").hide();
                alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
            }
        });
    }

    $scope.update_note = function (value, id, user_id, type) {
        var data = {
            id: id,
            user_id: user_id
        };
        if (type == 1) {
            data['manager_note'] = value;
        } else if (type == 2) {
            data['self_note'] = value;
        } else if (type == 3) {
            data['evidence_manager'] = value;
        } else if (type == 4) {
            data['evidence_self'] = value;
        }
        cloudjetRequest.ajax({
            type: 'POST',
            data: data,
            url: "/performance/team-performance/update/",
            beforeSend: function () {
                $("#waiting").show();
            },
            success: function (data) {
                $("#waiting").hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#waiting").hide();
                alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
            }
        });
    }

    $scope.looad_data_modal = function (person) {
        $('#kpi_log_modal_body').load('/performance/kpi_log/' + person.user_id + '/');
    }

    $scope.update_goal = function (value, id, user_id, type) {
        var data = {
            id: id,
            user_id: user_id
        };
        if (type == 1) {
            data['current_goal'] = value;
        } else if (type == 2) {
            data['future_goal'] = value;
        }
        cloudjetRequest.ajax({
            type: 'POST',
            data: data,
            url: "/performance/team-performance/update/",
            beforeSend: function () {
                $("#waiting").show();
            },
            success: function (data) {
                $("#waiting").hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#waiting").hide();
                alert("Quá trình cập nhật bị lỗi. Hãy thử lại");
            }
        });
    }
}]);