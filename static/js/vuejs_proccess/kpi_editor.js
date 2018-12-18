// import Autocomplete from 'vuejs-auto-complete'

// https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
function setObj(obj, path, value) {
    var schema = obj;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;
}

function kpi_ready(kpi_id, controller_prefix, ready) {
    if (ready) {
        $('#' + controller_prefix + kpi_id).show()
    }
    else {
        $('#' + controller_prefix + kpi_id).hide()
    }
}

function filter_kpi(val, parent_id) {
    var listOfObjects = [];
    var listKey = Object.keys(val);

    listKey.forEach(function (key) {
        if (parseInt(val[key].refer_to) === parseInt(parent_id) && val[key].old_weight > 0) {
            listOfObjects.push(val[key]);
        } else if (parent_id == null || listKey.indexOf(String(parent_id)) < 0) {
            // truong hop kpi cha duoc phan cong
            if (listKey.indexOf(String(val[key].refer_to)) < 0 && val[key].old_weight > 0) {
                listOfObjects.push(val[key]);
            }
        }
    });
    return listOfObjects;
}
function getKPIParentOfViewedUser(kpi_list, excludeParentID=null){
    // This function get KPI parents of user_id (user is viewed)
    var result = {};
    var filteredKPIParent = Object.values(kpi_list).filter(function(kpi){
        return kpi.parent === null && kpi.user == COMMON.UserViewedId
    })
    filteredKPIParent.map(function(kpi){
        result[kpi.id] = kpi
    });
    // NEED REMOVE excludeParentID FROM LIST
    if (excludeParentID != null){
        delete result[excludeParentID];
    }

    console.log("PARENT KPI ===========================");
    console.log(result)
    return result;
}
// Comment because this function has a performance problem
// function getKPIParent(kpi_list,excludeParentID){
//     var result = {};
//     // KPI cha duoc phan cong
//     var listKey = Object.keys(kpi_list)
//     var listKPIList = listKey.map(function(kpi_id){
//         return kpi_list[kpi_id]
//     })
//     var filteredKPIParent = listKPIList.filter(function(elm){
//         var baseCondition = excludeParentID.indexOf(elm.id) === -1 // id must not in excluded list
//         var condition2 = (
//             elm.refer_to !== null && // refer_to is not null
//             listKPIList.map(function(elm2){
//                 return parseInt(elm2.id)
//             }).indexOf(parseInt(elm.refer_to))  === -1 // and refer_to must not be in current kpi list
//         )
//         var condition1 = (elm.refer_to === null)
//         return baseCondition && (condition1 || condition2)
//     })
//     filteredKPIParent.map(function(elm){
//         result[elm.id] = Object.assign({},elm)
//     })
//     console.log("PARENT KPI ===========================")
//     console.log(result)
//     return result
// }
function calculateParentKPIWeight(kpi_list,excludeParentID){
    var result = 0;
    var dataSource = getKPIParentOfViewedUser(kpi_list, excludeParentID) // KPI cha thi moi lay
    for(var kpi_id in dataSource){
        result += parseFloat(kpi_list[kpi_id].weight)
    }
    return result
}


function total_weight_on_level(val, parent_id) {
    var total_weight = 0;
    var listKey = Object.keys(val);
    listKey.forEach(function (key) {
        if (val[key].refer_to == parent_id) {
            total_weight += Number(val[key].weight);
        } else if (parent_id == null || parent_id == "" || listKey.indexOf(String(parent_id)) < 0) {
            // truong hop kpi cha duoc phan cong
            if (listKey.indexOf(String(val[key].refer_to)) < 0 && val[key].weight > 0) {
                // truong hop kpi cha duoc phan cong
                total_weight += Number(val[key].weight);
            }
        }
    });

    return total_weight;
}

function total_old_weight_on_level(val, parent_id) {
    var total_old_weight = 0;
    var listKey = Object.keys(val);
    listKey.forEach(function (key) {
        if (val[key].refer_to == parent_id) {
            total_old_weight += Number(val[key].old_weight);
        } else if (parent_id == null || parent_id == "" || listKey.indexOf(String(parent_id)) < 0) {
            // truong hop kpi cha duoc phan cong
            if (listKey.indexOf(String(val[key].refer_to)) < 0 && val[key].old_weight > 0) {
                // truong hop kpi cha duoc phan cong
                total_old_weight += Number(val[key].old_weight);
            }
        }
    });
    return total_old_weight;
}
// function setToolTipKPI(el, content){
//     $(el).qtip({
//         content: {
//             text: content.replace(/(?:\r\n|\r|\n)/g, '<br/>')
//         },
//         style: {
//             classes: 'qtip-green'
//         },
//     });
// }

function collapse_kpi_group(kpi_id, refer_to_id, get_kpi_refer_group, is_search_page) {

    if ($('#kpi-wrapper-' + refer_to_id).length == 0 && is_search_page != 'True') {

        if (v.toggle_states[kpi_id] == undefined) {
            $('.kpi-child-of-' + get_kpi_refer_group).hide();
        }
        $('.kpi-refer-' + get_kpi_refer_group).hide();
        $('.kpi-refer-' + get_kpi_refer_group).first().show();
    }
}

function format(number) {

    var decimalSeparator = ".";
    var thousandSeparator = ",";

    // make sure we have a string
    var result = String(number);

    // split the number in the integer and decimals, if any
    var parts = result.split(decimalSeparator);

    // reverse the string (1719 becomes 9171)
    result = parts[0].split("").reverse().join("");

    // add thousand separator each 3 characters, except at the end of the string
    result = result.replace(/(\d{3}(?!$))/g, "$1" + thousandSeparator);

    // reverse back the integer and replace the original integer
    parts[0] = result.split("").reverse().join("");

    // recombine integer with decimals
    return parts.join(decimalSeparator);

}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

Vue.config.delimiters = ['${', '}$'];
// Vue.config.unsafeDelimiters = ['${', '}$'];

//filter date format
Vue.filter('dateFormat', function (value) {
    var language_code = COMMON.LanguageCode;
    if (value) {
        if (language_code == 'en') return moment(value).format('DD/MMM/YYYY')
        if (language_code == 'vi') return moment(value).format('DD/MM/YYYY')
    }
});
Vue.filter('createdat_format', function (value) {
    return moment(value).format('H:mm:ss - DD/MM/YYYY')
});
Vue.filter('url_decode', function (str) {
    return decodeURIComponent(str)
});
Vue.filter('rounder', {
    // model -> view
    // formats the value when updating the input element.
    read: function (val) {
        try {
            return val.toFixed(0)
        }
        catch (err) {
            return val
        }
    }
});
Vue.filter('weightDisplay', function (val) {
    try {
        return (val.toFixed(1) == 'NaN') ? 0 + "%" : val.toFixed(1) + "%"
    }
    catch (err) {
        return val
    }

});
// Vue.filter('weightDisplay', {
//     // model -> view
//     // formats the value when updating the input element.
//     read: function (val) {
//         try {
//             return (val.toFixed(1) == 'NaN') ? 0 + "%" : val.toFixed(1) + "%"
//         }
//         catch (err) {
//             return val
//         }
//     },
//     // view -> model
//     // formats the value when writing to the data.
//     write: function (val, oldVal) {
//         var number = +val.replace(/[^\d.]/g, '')
//         return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
//     }
// });
Vue.filter('weightDisplay', function (val) {
    try {
        return (val.toFixed(1) == 'NaN') ? 0 + "%" : val.toFixed(2) + "%"
    }
    catch (err) {
        return val
    }

});
// Vue.filter('scoreDisplay', {
//     // model -> view
//     // formats the value when updating the input element.
//     read: function (val) {
//         try {
//             return typeof(val) == 'number' ? (val == 0 ? "0%" : (val.toFixed(2) + "%")) : "0%";
//         }
//         catch (err) {
//             return "0%";
//         }
//     },
//     // view -> model
//     // formats the value when writing to the data.
//     write: function (val, oldVal) {
//         var number = +val.replace(/[^\d.]/g, '');
//         return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
//     }
// });

Vue.filter('scoreDisplay', function (val) {
        try {
            return typeof(val) == 'number' ? (val == 0 ? "0%" : (val.toFixed(2) + "%")) : "0%";
        }
        catch (err) {
            return "0%";
        }
    }
);

Vue.filter('monthDisplay',  function (val, quarter, order) {
    try {
        var arrMonth = val.split('|');
        return (arrMonth[((quarter - 1) * 3 + order) - 1] == undefined) ? '0' : arrMonth[((quarter - 1) * 3 + order) - 1];
    }
    catch (err) {
        return val;

    }


});
//
// Vue.filter('decimalDisplay', {
//     // model -> view
//     // formats the value when updating the input element.
//     // Tuan Note:
//     // + sync number
//     // + auto automatically separate numbers when in thousands
//     // + do not let the user enter characters
//     read: function (val) {
//         return (val === 0) ? 0 : (val == null || val === '') ? '' : format(val);
//     },
//     // view -> model
//     // formats the value when writing to the data.
//     write: function (val, oldVal) {
//         if (val === '') {
//             return '';
//         }
//         else {
//             var number = val.split(",").join("");
//             number = Number(number);
//             // Toan note: ref https://stackoverflow.com/a/5963202/2599460
//             return isNaN(number) ? 0 : parseFloat(number.toFixed(4));
//         }
//     }
//
// });
Vue.filter('decimalDisplay',  function (val) {
    return (val === 0) ? 0 : (val == null || val === '') ? '' : format(val);


});



Vue.filter('filter_kpi_level', function (val) {
    var id = v.active_kpi_id;
    if (id != '' && id != undefined && parseInt(id) > 0) {
        var parent_id = val[id].refer_to;
        return filter_kpi(val, parent_id);
    }
    return val;
});

// Vue.filter('filter_total_weight', function (val) {
//     var total_weight = 0;
//     var id = v.active_kpi_id;
//     var parent_id = "";
//     if (id != '' && id != undefined && id > 0) {
//         parent_id = val[id].refer_to;
//     }
//     total_weight = total_weight_on_level(val, parent_id);
//     return total_weight;
// });
Vue.filter('filter_total_weight_exclude_delayed', function (val) {
    var total_weight = 0;
    var id = v.active_kpi_id;
    var dataSource = Object.assign({},val)
    var excludeParentID = parseFloat(id)
    total_weight = calculateParentKPIWeight(dataSource,excludeParentID);
    return total_weight;
});

Vue.filter('filter_cal_rate_weight', function (val, weight) {
    var total_weight = 0;
    var id = v.active_kpi_id;
    var dataSource = Object.assign({},val)
    var excludeParentID = parseFloat(id)
    total_weight = calculateParentKPIWeight(dataSource,excludeParentID);
    return weight * 100 / total_weight;
});

Vue.filter('filter_total_old_weight', function (val) {
    var total_old_weight = 0;
    var id = v.active_kpi_id;
    var parent_id = "";
    if (id != '' && id != undefined && id > 0) {
        parent_id = val[id].refer_to;
    }
    total_old_weight = total_old_weight_on_level(val, parent_id);
    return total_old_weight;
});

Vue.filter('filter_cal_rate_old_weight', function (val, weight) {
    var total_old_weight = 0;
    var id = v.active_kpi_id;
    var parent_id = "";
    if (id != '' && id != undefined && id > 0) {
        parent_id = val[id].refer_to;
    }
    total_old_weight = total_old_weight_on_level(val, parent_id);

    return weight * 100 / total_old_weight;
});


Vue.mixin({
    delimiters: ['${', '}$'],
    data:function(){
        // https://stackoverflow.com/questions/40896261/apply-global-variable-to-vuejs
        return {

            is_user_system: (COMMON.IsAdmin == 'True' || COMMON.IsSupperUser == 'True') ? true : false,
            user_id: COMMON.OrgUserId,

        }
    },
    watch: {
        month_1_name:function(){
            // alert(this.month_1_name)
        }
    },
    computed:{

    },
    methods: {
        can_add_or_remove_exscore: function(month){
            var is_person_have_permission = (COMMON.IsManager === 'True' || this.is_user_system === true)
            var is_month_can_do = (this.organization.monthly_review_lock === 'allow_all' || this.organization.monthly_review_lock === month);
            return (is_person_have_permission === true || is_month_can_do === true)
        },
        get_child_kpis_from_kpi_list:function(kpi_id){

            var that =  this;
            var child_kpis = [];
            Object.keys(that.kpi_list).forEach(function(key){
                if(that.kpi_list[key].refer_to == kpi_id){
                    child_kpis.push(that.kpi_list[key]);
                }
            });
            // this does not work because this.kpi_list is not array
            // child_kpis=$.grep(this.kpi_list, function(kpi, index){
            //     return kpi.refer_to == that.kpi.id;
            //
            // });
            return child_kpis;

        },
        reload_kpi:function(kpi_id, top_level=true){
            var that = this;
            var parent_kpi_id = kpi_id;

            if(top_level == true){
                parent_kpi_id=that.$root.get_top_level_parent_kpi_id(kpi_id);
            }

            jqXhr = cloudjetRequest.ajax({
                type: 'get',
                url: '/api/v2/kpi/?include_parent=1&parent_id=' + parent_kpi_id,

                success: function (kpi_data) {
                    // alert('child kpis loaded');


                    that.$root.$emit('kpi_reloaded', kpi_data);


                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                    // $('.add_kpi').show();
                }
            });

            return jqXhr;
            //delete old data  after reload
            //this.kpi_list[kpi_id]

        },
        compile: function(content, refs){
            //   // alert('inside compile');
            // var tmp = Vue.extend({
            //   template: content
            // });
            // // console.log(this.$refs[refs]);
            // // new tmp().$mount(elm);
            // new tmp().$mount(this.$refs[refs]);
            // // new tmp().$mount(this.$refs['#mymonth1div']);
            var that = this;
            var temp_data=this.$data;
            var temp_vm=new Vue({
                delimiters: ['${', '}$'],
                data: temp_data,
                template: content,
                methods: that.$options.methods,
                filters: that.$options.filters,
                computed: that.$options.computed,
                computed: that.$options.computed,

            });
            // temp_vm.$mount();
            // $(refs).html(temp_vm.$el);
            // temp_vm.$destroy()

        },

        track_component_created:function(track_obj, key){
            var that = this;

            if (! track_obj.hasOwnProperty(key)){
                track_obj[key]={
                    created: 1,

                }
            }else{
                track_obj[key].created = track_obj[key].created || 0;
                track_obj[key].created +=1;
            }
        },
        track_component_updated:function(track_obj, key){
            var that = this;

            if (! track_obj.hasOwnProperty(key)){
                track_obj[key]={
                    updated: 1,

                }
            }else{
                track_obj[key].updated = track_obj[key].updated || 0;
                track_obj[key].updated +=1;
            }

        },

        calert: function(){
            // alert('Çalışıyor');
        },
        can_edit_current_month: function (current_month, monthly_review_lock){ //check whether currrent month is allowed to edit
            return monthly_review_lock == "allow_all"?true: current_month==monthly_review_lock
        },
        get_inline_monthscores: function (monthstext, quarter, kpi) {
            // monthstext: ex: "T1|T2|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12"
            var monthstext = "T1|T2|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12";

            var month_1_text=this.monthDisplay(monthstext, quarter, 1);
            var month_2_text=this.monthDisplay(monthstext, quarter, 2);
            var month_3_text=this.monthDisplay(monthstext, quarter, 3);

            var month_1_score_text=this.scoreDisplay(kpi.month_1_score);
            var month_2_score_text=this.scoreDisplay(kpi.month_2_score);
            var month_3_score_text=this.scoreDisplay(kpi.month_3_score);

            return `${month_1_text}:${month_1_score_text} | ${month_2_text}:${month_2_score_text} | ${month_3_text}:${month_3_score_text}`


        },
        monthDisplay:function(monthstext, quarter, order){
            // // https://stackoverflow.com/a/33671045/6112615
            return this.$options.filters.monthDisplay(monthstext, quarter, order);
        },
        scoreDisplay:function(score){
            return this.$options.filters.scoreDisplay(score);
        },
        get_prefix_category: function(cat) {
            if (cat == "financial")
                return "F"
            else if (cat == "customer")
                return "C"
            else if(cat == "internal")
                return "P"
            else if(cat == "learninggrowth")
                return "L"
            else
                return "O"
        },
        kpi_ready: function (kpi_id, controller_prefix, ready) {
            kpi_ready(kpi_id, controller_prefix, ready);
        },

    }
});





var Bonus = Vue.extend({
    delimiters: ['{$', '$}'],
    type: 'bonus-component',
    // template: $('div.bonus-wrapper').html(), // Fuck tap lam moi ra cho nay <3,
    template: $('#bonus-template').html(), // Fuck tap lam moi ra cho nay <3,
    props:[
        'month',
        'current_user_profile',
        'current_quarter',
        'lib_data_dict',
        'exscore_user_data',
    ],
    data: function () {
        return {
            filter_text: '',
            // current_user_profile: null, // used props instead
            user_data_dict: null,
            // lib_data_dict: null, // used props
            bonus_ready: false,
            render_lib_data_list : [],
            render_user_data_list : [],
            dictionary: {
                plus: gettext('EXTRA') + " (" + gettext("UP TO 20") + "%)",
                minus: gettext('MINUS'),
                zero: gettext('ZERO')
            },
            // month_name: '', // used computed
            // current_quarter: {},
            total_score:{}
        }
    },
    created:function(){

        // removed. Because we passed current_quarter to props and used computed for month_name
        // this.$on('fetch_current_quarter', function(current_quarter){
        //     var that = this
        //     if(that.month == 1){
        //         that.month_name = that.$parent.month_1_name.toUpperCase()
        //     }
        //     if(that.month == 2){
        //         that.month_name = that.$parent.month_2_name.toUpperCase()
        //     }
        //     if(that.month == 3){
        //         that.month_name = that.$parent.month_3_name.toUpperCase()
        //     }
        //     that.$set(that.$data, 'current_quarter',current_quarter)
        // });


        // removed. used watch instead
        // this.$on('fetch_exscore_lib', function(){
        //     var that = this
        //     // Fetch data from $parent
        //     // that.$set(that.$data, 'lib_data_dict',that.$parent.exscore_lib_data) # removed. Because passed to props
        //     // that.render_exscore_lib(); // used watch changed of lib_data_dict to render_exscore_lib
        //     // that.$emit('fetch_user_exscore_group')// used method instead
        // });


        // moved to watch of exscore_user_data
        // this.$on('fetch_exscore', function(){
        //     alert('fetch_exscore function');
        //     var that = this
        //     // Fetch data from $parent
        //     // that.$set(that.$data, 'user_data_dict',that.$parent.exscore_user_data[that.month]) // set by watch change of exscore_user_data
        //     // Process render data
        //     // that.render_exscore_user()
        //     // setTimeout(function(){
        //     //     if (that.bonus_ready == false){
        //     //         that.$set(that.$data, 'bonus_ready',true)
        //     //     }
        //     // },2000);
        //     // that.$emit('fetch_user_exscore_group')
        // });

        // removed. used props instead
        // this.$on('fetch_user_profile_from_parent', function(){
        //     var that = this
        //     // that.$set(that.$data, 'current_user_profile',that.$parent.current_user_profile) // used props instead
        // });



        // this.$on('fetch_user_exscore_group', function() {
        //     var that = this
        //     if(that.lib_data_dict != null && that.user_data_dict != null){
        //
        //         for(var key in that.user_data_dict){
        //             that.user_data_dict[key].map(function(user_exscore_elem){
        //
        //                 // Get lib index
        //                 var group_id_list = that.lib_data_dict[key].map(function(lib_exscore_elem){
        //                     return lib_exscore_elem.id
        //                 })
        //                 var group_index = group_id_list.indexOf(user_exscore_elem.exscore_lib)
        //                 // Get group
        //                 user_exscore_elem.group = that.lib_data_dict[key][group_index].group
        //             })
        //         }
        //         that.render_exscore_user()
        //     }
        // });

        // moved to methods
        // this.$on('fetch_user_id',function(){
        //     var that = this
        //     that.$set(that.$data, 'user_id',that.$parent.user_id)
        // });

    },
    events: {
        // 'fetch_current_quarter': function(current_quarter){
        //     var that = this
        //     if(that.month == 1){
        //         that.month_name = that.$parent.month_1_name.toUpperCase()
        //     }
        //     if(that.month == 2){
        //         that.month_name = that.$parent.month_2_name.toUpperCase()
        //     }
        //     if(that.month == 3){
        //         that.month_name = that.$parent.month_3_name.toUpperCase()
        //     }
        //     that.$set(that.$data, 'current_quarter',current_quarter)
        // },
        // 'fetch_exscore_lib': function(){
        //     var that = this
        //     // Fetch data from $parent
        //     that.$set(that.$data, 'lib_data_dict',that.$parent.exscore_lib_data)
        //     that.render_exscore_lib()
        //     that.$emit('fetch_user_exscore_group')
        // },
        // 'fetch_exscore': function(){
        //     alert('fetch_exscore function');
        //     var that = this
        //     // Fetch data from $parent
        //     that.$set(that.$data, 'user_data_dict',that.$parent.exscore_user_data[that.month])
        //     // Process render data
        //     that.render_exscore_user()
        //     setTimeout(function(){
        //         if (that.bonus_ready == false){
        //             that.$set(that.$data, 'bonus_ready',true)
        //         }
        //     },2000)
        //     that.$emit('fetch_user_exscore_group')
        // },
        // 'fetch_user_profile_from_parent': function(){
        //     var that = this
        //     that.$set(that.$data, 'current_user_profile',that.$parent.current_user_profile)
        // },
        // 'fetch_user_exscore_group': function() {
        //     var that = this
        //     if(that.lib_data_dict != null && that.user_data_dict != null){
        //
        //         for(var key in that.user_data_dict){
        //             that.user_data_dict[key].map(function(user_exscore_elem){
        //
        //                 // Get lib index
        //                 var group_id_list = that.lib_data_dict[key].map(function(lib_exscore_elem){
        //                     return lib_exscore_elem.id
        //                 })
        //                 var group_index = group_id_list.indexOf(user_exscore_elem.exscore_lib)
        //                 // Get group
        //                 user_exscore_elem.group = that.lib_data_dict[key][group_index].group
        //             })
        //         }
        //         that.render_exscore_user()
        //     }
        // },
        // 'fetch_user_id': function(){
        //     var that = this
        //     that.$set(that.$data, 'user_id',that.$parent.user_id)
        // }
    },
    mounted: function(){
        if(window.exscore_app === undefined){
            window.exscore_app = []
        }
        window.exscore_app.push(this)
        this.$nextTick(function () {
            // code that assumes this.$el is in-document

        });
        // this.$emit('fetch_current_user_profile') // removed, because we already fetch current user profile in main Vue instance
        // this.$emit('fetch_user_id') // no need, get user_id from mixin
    },
    watch: {

        'total_score': {
            handler: function(value, old_value){
                // https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced
                // https://stackoverflow.com/questions/40923555/vue-js-whats-the-difference-of-emit-and-dispatch
                // this.$emit('update_exscore',this.month,value)
                this.$root.$emit('update_exscore',this.month,value);
            }
        },
        'bonus_ready': {
            handler: function(newVal,oldVal){
                if(newVal == true){
                    $('div#bonus-ready').hide()
                    $('div#bonus-modal-header').show()
                }
            }
        },
        'render_user_data_list': {
            handler: function(val,oldValue){

                var that = this
                var data = that.calculate_final_score();
                that.$set(that, 'total_score',data)
            },
            deep: true
        },
        'filter_text': {
            handler: function(newVal,oldVal){
                var that = this
                that.restoreExscoreLib()
                that.searchExscoreLib()
            }
        },

        'lib_data_dict': function(newVal){
            this.render_exscore_lib(newVal);
            this.fetch_user_exscore_group();
        },
        'exscore_user_data': {
            handler: function(val){
                this.user_data_dict = this.exscore_user_data[this.month];
                this.render_exscore_user();
                this.bonus_ready = true;
                // setTimeout(function(){
                //     if (that.bonus_ready == false){
                //         that.$set(that.$data, 'bonus_ready',true)
                //     }
                // },2000);
                this.fetch_user_exscore_group();
            }
        }
    },
    computed:{
        month_name:function(){
            var name = '';
            var that = this;
            if(that.month == 1){
                // that.month_name = that.$parent.month_1_name.toUpperCase()
                name = that.month_1_name.toUpperCase();
            }
            else if(that.month == 2){
                name = that.month_2_name.toUpperCase();
            }
            if(that.month == 3){
                name = that.month_3_name.toUpperCase();
            }
            return name;
            // that.$set(that.$data, 'current_quarter',current_quarter)
        },
    },

    methods: {
        // removed because this is constant variable, set at mixin
        // we can always access user_id by this.user_id
        //
        // fetch_user_id: function(){
        //     var that = this
        //     that.$set(that.$data, 'user_id',that.$parent.user_id)
        // },

        fetch_user_exscore_group: function() {
            var that = this;
            if(that.lib_data_dict && that.user_data_dict){

                for(var key in that.user_data_dict){
                    that.user_data_dict[key].map(function(user_exscore_elem){

                        // Get lib index
                        var group_id_list = that.lib_data_dict[key].map(function(lib_exscore_elem){
                            return lib_exscore_elem.id
                        });
                        var group_index = group_id_list.indexOf(user_exscore_elem.exscore_lib)
                        // Get group
                        user_exscore_elem.group = that.lib_data_dict[key][group_index].group
                    })
                }
                that.render_exscore_user();
            }
        },


        render_exscore_user: function(){
            var that = this
            var render_data_index = 0
            // Ánh xạ sang lib_data_dict để lấy group
            for (var key in that.user_data_dict){

                var temp_dict = {
                    slug: key,
                    text: that.dictionary[key],
                    lan: gettext("Language"),
                    data: that.extract_exscore_v2(that.user_data_dict[key]),
                    sum_score: that.get_sum_exscore(that.user_data_dict[key],key)
                }
                // that.$set(that.$data, 'render_user_data_list['+(render_data_index++)+']',temp_dict)
                that.$set(that.render_user_data_list, (render_data_index++),temp_dict);
            }
        },
        render_exscore_lib: function(lib_data_dict){
            var that = this
            // Process render data
            var render_data_index = 0
            for (var key in lib_data_dict){
                var temp_dict = {
                    slug: key,
                    text: that.dictionary[key],
                    data: that.extract_exscore_v2(lib_data_dict[key]),
                }
                // that.$set(that.$data, 'render_lib_data_list['+(render_data_index++)+']',temp_dict)
                that.$set(that.render_lib_data_list, (render_data_index++) ,temp_dict);
            }
        },
        restoreExscoreLib: function(){
            var that = this;
            // that.$emit('fetch_exscore_lib')
            this.render_exscore_lib(that.lib_data_dict);
            this.fetch_user_exscore_group();
        },
        searchExscoreLib: function(){
            var that = this
            if (that.filter_text != '') {
                console.log('starting searching with ' + that.filter_text)
                // First is to restore original data
                // Now to filter
                var data = Object.assign({},that.lib_data_dict)
                for (var key in data){
                    var _data = data[key].filter(function(elem){
                        return (
                            // Search co dau
                            (
                                elem.name.toLowerCase().indexOf(that.filter_text.trim().toLowerCase()) != -1 || // co dau
                                elem.code.toLowerCase().indexOf(that.filter_text.trim().toLowerCase()) != -1
                            )
                            ||
                            // Search khong dau
                            (
                                latinize(elem.name.toLowerCase()).indexOf(that.filter_text.trim().toLowerCase()) != -1 || // co dau
                                latinize(elem.code.toLowerCase()).indexOf(that.filter_text.trim().toLowerCase()) != -1
                            )

                        )
                    })
                    data[key] = _data
                }


                that.render_exscore_lib(data)
            }
        },
        removeExscore: function(month,render_data_index,type,index_in_user_data_dict){
            var that = this;
            // Remove element in real dict
            var data = that.user_data_dict[type][index_in_user_data_dict]

            cloudjetRequest.ajax({
                type: 'DELETE',
                url: '/api/v2/exscore/' + data.id + '/',
                data: {},
                success: function(res){
                    that.user_data_dict[type].splice(index_in_user_data_dict,1) // Remove in frontend
                    // that.$emit('fetch_user_exscore')
                    that.$root.$emit('fetch_user_exscore')
                }
            })
        },
        calculate_final_score: function(){
            console.log('triggered calculate_final_score')
            var that = this;
            var zero_score = that.get_sum_exscore(that.user_data_dict['zero'],'zero')
            var minus_score = that.get_sum_exscore(that.user_data_dict['minus'],'minus')
            var plus_score = that.get_sum_exscore(that.user_data_dict['plus'],'plus')
            var data = {

                zero: zero_score > 0 ? true : false,
                score: plus_score - minus_score
            }
            return data
        },
        get_sum_exscore: function(list_data, score_type){

            var score = list_data.reduce(function(a,b){
                if(score_type=='zero') return a + 1
                return a + b.employee_points;
            },0);
            if(score_type == 'plus'){
                score = score <= 20 ? score: 20
            }
            return score;
        },
        addExscore: function(month,exscore){
            var that = this;
            var data = {
                month: that.month,
                user_id: that.user_id,
                exscore_lib_id: exscore.id,
                group: exscore.group
            }
            // Remove element in real dict
            cloudjetRequest.ajax({
                type: 'POST',
                url: '/api/v2/exscore/',
                data: JSON.stringify(data),
                contentType:'application/json',
                success: function(res){
                    that.$root.$emit('fetch_user_exscore');
                }
            })
        },
        extract_lib_exscore: function(title,sum_list){
            // Clone to new object

            var sum_list_res = jQuery.extend(true, {}, sum_list); // Cloning is required

            var that = this
            // Extract exscore with lib
            var exscore_lib_list = [{
                order: 'I',
                is_exscore: false,
                name: 'Điểm ' + title + ' chung',
                category: 'first'
            }];
            var exscore_list = [{
                order: 'II',
                is_exscore: false,
                name: 'Điểm ' + title + ' chuyên môn',
                category: 'first'
            }];
            for(var item in sum_list_res){
                sum_list_res[item].index = item;
                exscore_lib_list.push(sum_list_res[item])
            }
            // Sort into category
            exscore_lib_list = that.sort_with_group(exscore_lib_list);
            exscore_lib_list = exscore_lib_list.slice(1,exscore_lib_list.length);

            exscore_list = that.sort_with_group(exscore_list);
            exscore_list = exscore_list.slice(1,exscore_list.length);


            sum_list_res = exscore_lib_list.concat(exscore_list);
            return sum_list_res;
        },
        extract_exscore_v2: function(sum_list){
            var that = this
            var sum_list_res = jQuery.extend(true, [], sum_list); // Cloning is required
            for(var item in sum_list_res){
                sum_list_res[item].index = item;
            }
            sum_list_res = that.sort_with_group(sum_list_res);
            return sum_list_res
        },
        extract_exscore: function(title,sum_list){
            // Clone to new object

            var sum_list_res = jQuery.extend(true, {}, sum_list); // Cloning is required

            var that = this
            // Extract exscore with lib
            var exscore_lib_list = [{
                order: 'I',
                is_exscore: false,
                name: 'Điểm ' + title + ' chung',
                category: 'first'
            }];
            var exscore_list = [{
                order: 'II',
                is_exscore: false,
                name: 'Điểm ' + title + ' chuyên môn',
                category: 'first'
            }];
            for(var item in sum_list_res){
                sum_list_res[item].index = item;
                if(sum_list_res[item].exscore_lib == null){
                    exscore_list.push(sum_list_res[item])
                }else{
                    exscore_lib_list.push(sum_list_res[item])
                }
            }
            // Sort into category
            exscore_lib_list = that.sort_with_group(exscore_lib_list);
            exscore_lib_list = exscore_lib_list.slice(1,exscore_lib_list.length);

            exscore_list = that.sort_with_group(exscore_list);
            exscore_list = exscore_list.slice(1,exscore_list.length);


            sum_list_res = exscore_lib_list.concat(exscore_list);
            return sum_list_res;
        },
        sort_with_group: function(list_data){
            var that = this;
            var group_container = {};
            var _sum_list = [];
            var sum_list = [];
            // Extract exscore with category

            // Get unique group list
            var _sum_list_index = 0;
            var cloned_list_data = Object.assign([],list_data)
            cloned_list_data.map(function(elem,index,_cloned_list_data){
                // Set flag is_exscore for exscore
                elem.is_exscore = true
                if(!(elem.group in group_container) && elem.group){
                    if(typeof group_container[elem.group] == 'undefined'){
                        group_container[elem.group] = {}
                    }
                    group_container[elem.group].ready = true
                    group_container[elem.group].index = _sum_list_index
                    _sum_list[_sum_list_index] = []
                    _sum_list[_sum_list_index++].push({
                        name: elem.group,
                        is_exscore: false,
                        category: 'second'
                    });
                }
            })
            // Filter with group
            for (var group in group_container){
                var list = cloned_list_data.filter(function(elem){
                    return elem.group == group
                })
                _sum_list[group_container[group].index] = _sum_list[group_container[group].index].concat(list)
            }
            // Return rendered data
            _sum_list.map(function(elem){
                sum_list = sum_list.concat(elem)
            })

            return sum_list;
        },
        sort_with_group_to_dict: function(list_data){
            var data_container = {};
            var new_list = list_data.map(function(elem,index,array){
                var key = elem.category.replace(/\s+/g, '_');

                if(key in data_container){
                    data_container[key].push(elem);
                }
                else{
                    data_container[key]= [];
                    data_container[key].push(elem);
                }
                return elem;
            });
            return data_container;
        }
    }
});
Vue.component('bonus',Bonus);
// https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
// https://stackoverflow.com/questions/49712404/numeric-input-component-for-vue-js
// Define a new component called decimal-input
Vue.component('decimal-input', {
    props: [
        'id',
        'value',
        'inputclass',
        'title',
        'disabled',
        'datalpignore',
        'data-qtipopts',
    ],
    // props: {
    //     'id':String,
    //     'value':Number,
    //     'inputclass':String,
    //     'title':String,
    //     'disabled':[String, Boolean],
    //     'datalpignore':[String, Boolean, Number],
    //     'data-qtipopts':String
    // }
    // ,
    // template: `
    //     <input
    //     v-bind:value="value"
    //     v-on:input="$emit('input', parseFloat($event.target.value))"
    //    v-bind:class="inputclass"
    //     v-bind:title="title"
    //     v-bind:disabled="disabled"
    //     v-bind:data-lpignore="datalpignore"
    //     >
    // `,
    template: `
        <input 
            type="text" v-model="model"
            v-bind:class="inputclass" 
            v-bind:title="title"
            v-on:keypress="check_number"
            @paste.prevent
            v-bind:disabled="disabled"
            v-bind:data-lpignore="datalpignore">
    `,
    computed: {
        model:{
            get: function(){
                var val = this.value;
                // https://stackoverflow.com/a/33671045/6112615
                return this.$options.filters.decimalDisplay(val);

            },
            set: function(val){
                var newVal=val;
                if (val === '') {
                    newVal = '';
                }
                else {
                    var number = val.split(",").join("");
                    number = Number(number);
                    // Toan note: ref https://stackoverflow.com/a/5963202/2599460
                    newVal = isNaN(number) ? 0 : parseFloat(number.toFixed(4));
                }

                this.$emit('input', newVal);
            },

        }
    },
    methods: {
        check_number: function (e){
            var _number = String.fromCharCode(e.keyCode);
            if ('0123456789.'.indexOf(_number) !== -1) {
                return _number;
            }
            e.preventDefault();
            return false;
        }
    }

});



Vue.component('evidence-button', {
    delimiters: ['{$', '$}'],
    props: [
        'month',
        'kpi_id',
        'list_evidences',
        'title',
        'disabled'

    ],
    data:function(){
        return {
            // 'evidences':{},
            'evidences':this.list_evidences,
            'evidence_count': null,
        }
    },
    template: `  
        <button
        v-bind:title="title"
        v-bind:disabled="disabled"
        v-bind:class="'btn btn-default KPI_BTN_EVD ' + (evidence_count ? ' evidence-exist btn-evidences-2': ' btn-evidences-1')"
        v-on:click="showModal_e(month, kpi_id)"
        >
        <i class="fa fa-file-text-o pull-left evidences-icon"></i> {$ evidence_count $}
        </button>
    `,
    created: function(){
        // this.evidences=this.list_evidences; // co can thiet khong khi da watch ?? <=== watch chi anh huong sau khi mounted va prop thay doi
        // this.evidences=this.list_evidences; // co can thiet khong khi da assigned o data ??? <== khong can thiet
        console.log('evidence-button created');

        // if evidence-count not loaded yet --> load evidence-count /// ????
        this.evidence_count = this.count_evidence(this.month, this.kpi_id);
        if (this.evidence_count === null){
            this.get_evidence(this.month, this.kpi_id);
        }
    },
    mounted:function(){
        console.log('evidence-button mounted');

    },
    watch:{
        list_evidences:function (value, oldValue) {
            //alert('list_evidences change' );
            console.log('evidence-button list_evidences watch');
            this.evidences=Object.assign({}, value);

        },
        evidences:function (value, oldValue) {
            // alert('evidences change' );
            //this.evidences=Object.assign({}, value);
            console.log('evidence-button evidences watch');
            this.evidence_count = this.count_evidence(this.month, this.kpi_id);
        },
        evidence_count: function(){},
    },
    computed:{

    },
    methods:{
        count_evidence: function () {
            var that = this;
            if (that.evidences[this.kpi_id] == undefined || that.evidences[this.kpi_id][this.month] == undefined)
                return null;
            else
                return that.evidences[this.kpi_id][this.month]

        },
        get_evidence: function () {
            var that = this;
            // alert('get evidence')
            cloudjetRequest.ajax({
                url: '/api/v2/kpi/' + that.kpi_id + '/evidence/upload/',
                type: 'get',
                data: {
                    type: "json",
                    month: that.month,
                    kpi_id: that.kpi_id,
                    count: true,
                },
                success: function (response) {
                    var count = response[0];

                    // var evidence={ };
                    // evidence[that.kpi_id]={};
                    // evidence[that.kpi_id][that.month]= count;
                    //
                    // that.evidences = Object.assign({}, that.evidences, evidence);

                    setObj(that.evidences, that.kpi_id+ '.'+ that.month, count);
                    that.evidences = Object.assign({}, that.evidences);
                    // that.$set(that.evidences[that.kpi_id], that.month, count);

                    // emit event for parent to update evidences list
                    that.$root.$emit('update_evidence_event_callback', that.kpi_id, that.month, count);

                },
                error: function () {

                },
            })


        },
        showModal_e:function(month, kpi_id){
            // alert('click evidence button');
            this.$root.$emit('showModal_e', month, kpi_id);
        }
    }

});



Vue.component('tag-search', {
    props: ['options', 'value'],
    template: '#select2-template',
    mounted: function () {
        var vm = this;
        this.$nextTick(function () {
            // code that assumes this.$el is in-document
            $(this.$el)
            // init select2
                .select2({
                    placeholder: "Tìm theo thẻ",
                    width: '100%',
                    multiple: true,
                    ajax: {
                        url: COMMON.LinkTagSearch,
                        quietMillis: 500,
                        cache: true,
                        dataType: 'json',
                        data: function (params) {
                            var query = {
                                q: params
                            }
                            // Query parameters will be ?search=[term]&type=public
                            return query;
                        },
                        results: function (data) {
                            employee_options = data;
                            var results = $.map(data, function (obj) {
                                obj.text = obj.name // replace name with the property used for the text
                                obj.id = obj.name
                                return obj;
                            });
                            return {
                                results: data
                            };
                        }
                    }
                })
                .val(this.value)
                .trigger('change').on('change', function () {
                vm.$emit('input', this.value)
            })
        })

    },
    watch: {
        value: function (value) {
            // update value
            $(this.$el).val(value)
        },
        options: function (options) {
            // update options
            $(this.$el).empty().select2({data: options})
        }
    },
    destroyed: function () {
        $(this.$el).off().select2('destroy')
    }
});




// Vue.directive('settooltipkpi', {
//     params: ['content'],
//     paramWatchers: {
//         content: function (val, oldVal) {
//             setToolTipKPI($(this.el),this.params.content);
//         }
//     },
//     bind:function () {
//         setToolTipKPI($(this.el),this.params.content);
//     }
// });


Vue.component('kpi-editable', {
    delimiters: ["{$", "$}"],
    props: ['kpi', 'field', 'can_edit'],
    template: $('#kpi-edit-template').html(),
    // template: '#kpi-edit-template',
    // template: `
    // <div>
    // <article @click="edit_toggle()" class="field_hover over-hide" v-if="kpi" >
    // 	\${ kpi[field] }$
    // </article>
    // <div v-if="show_edit" class="field_editing">
    // 	<textarea autofocus v-model="edit_value" class="form-control area-style id-text-edit" v-on:blur="save_change()"></textarea>
    // </div>
    //
    // </div>
    //
    // `,
    data: function () {
        return {
            show_edit: false,
            edit_value: null
        }
    },
    mounted: function () {
        this.edit_value = this.kpi[this.field];
    },
    methods: {

        edit_toggle: function () {
            if (!this.can_edit) {
                return;
            }
            this.show_edit = !this.show_edit;
            if (this.show_edit) {
                setTimeout(function () {
                    $(".id-text-edit").focus();
                }, 300);
            }
        },
        save_change: function () {
            var _this = this;
            this.show_edit = false;
            if (this.edit_value == this.kpi[this.field]) {
                return;
            }
            var data = {
                id: this.kpi.id,
            }
            data[this.field] = this.edit_value;
            cloudjetRequest.ajax({
                method: "POST",
                url: '/api/kpi/',
                data: JSON.stringify(data),
                success: function (data) {
                    _this.kpi[_this.field] = data[_this.field];
                }
            })

        }
    },
});

Vue.directive('autofocus', {
    // When the bound element is inserted into the DOM...
    inserted: function (el) {
        // Focus the element
        setTimeout(function () {
            el.focus();
        }, 100);
    },
})
function findRootKPI(kpi_id,kpi_list){
    var parent_id = kpi_list[kpi_id].refer_to
    if (kpi_list[parent_id] === undefined){
        return kpi_id
    }else{
        return findRootKPI(parent_id,kpi_list)
    }
}
// mixin for compile row when load child kpi
// https://jsfiddle.net/6w77gp23/


Vue.component('kpi-config', {
    delimiters: ['{$', '$}'],
    props: [
        'kpi',
        'organization',
        'is_parent_kpi',

    ],
    data:function(){
        return {

        }
    },
    template: $('#kpi-config-template').html(),
    created: function(){

    },
    mounted:function(){


    },
    watch:{
    },
    computed:{
        can_add_child_kpi: function(){
            return (this.kpi.weight > 0 && this.kpi.can_add_child_kpi)
        },
        show_change_owner_tip:function(){
            return this.kpi.weight > 0 && !this.kpi.can_add_child_kpi && !this.is_parent_kpi
        },
        can_link_kpi:function(){
          return (this.is_parent_kpi && this.kpi.weight > 0) && (!this.kpi.parent && !this.kpi.refer_to && !this.kpi.cascaded_from )
        },
        can_unlink_kpi:function(){
            return (!this.kpi.parent && this.kpi.refer_to && this.kpi.cascaded_from)
        },

    },
    methods:{
        re_order:function (kpi_id) {
            var that = this;
            var data = {'command': 'reorder', 'id': kpi_id};
            cloudjetRequest.ajax({
                url: '/api/kpi/services/',
                type: 'post',
                data: data,
                success: function (response) {
                    location.reload();
                }
            });

        },
        remove_kpi:function(kpi_id, key, elm){
            var that = this;
            swal({
                title:  gettext("KPI deleted can not be restored"),
                text: gettext("Are you sure?"),
                type: "warning",
                showCancelButton: true,
                cancelButtonText: gettext( "Cancel"),
                confirmButtonColor: "#DD6B55",
                confirmButtonText: gettext("OK"),
                closeOnConfirm: false
            }, function () {
                var data = {
                    kpi_id: kpi_id,
                    unique_key: key
                };
                cloudjetRequest.ajax({
                    url: COMMON.LinkDeleteKpi,
                    type: 'post',
                    data: data,
                    success: function (data, statusText, jqXHR) {

                        if (jqXHR.status === 200) {

                            swal(gettext("Success"), gettext("KPI is successfully deleted"), "success");
                            that.$root.$emit('kpi_removed', kpi_id);


                        } else {
                            swal(gettext("Unsuccess"), jqXHR.responseJSON.message, "error");
                        }
                    },
                    error: function (jqXHR, settings, errorThrown) {
                        swal(gettext("Unsuccess"), jqXHR.responseJSON.message, "error");
                    }
                });

            });


        },
        calculate_kpi_anchor:function(kpi_id) {
            var that = this;
            var data = {'command': 'recalculate', 'id': kpi_id};
            cloudjetRequest.ajax({
                url: '/api/kpi/services/',
                type: 'post',
                data: data,
                success: function (response) {
                    that.reload_kpi(kpi_id)
                },
                error: function () {

                }
            });

        },
        copy_data_to_children:function (kpi_id) {
            var that = this;
            swal({
                title: gettext( "Copy all the data to sub-KPIs"),
                text: gettext( "All the data of sub-KPI will be changed. Are you sure?"),
                type: "warning",
                showCancelButton: true,
                cancelButtonText: gettext( "Cancel"),
                confirmButtonColor: "#DD6B55",
                confirmButtonText: gettext( "OK"),

                // closeOnConfirm: true, // this config will be block the page
                closeOnConfirm: false, // https://stackoverflow.com/a/32981216/6112615
            }, function () {

                var data = {'command': 'copy_data_to_children', 'id': kpi_id};
                cloudjetRequest.ajax({
                    url: '/api/kpi/services/',
                    type: 'post',
                    data: data,
                    success: function (response) {
                        // setTimeout(function () {
                        //     // This will close the alert 500ms after the callback fires.
                        //     //swal.close();
                        //     swal(gettext( "Success"), gettext( "Data is successfully copied"), "success");
                        //     that.reload_kpi(kpi_id);
                        // }, 500);
                        swal(gettext( "Success"), gettext( "Data is successfully copied"), "success");
                        that.reload_kpi(kpi_id);
                    },
                    error: function () {
                        swal(gettext( "Error"), gettext( "Please try again!"), "error");
                    }
                });

            });


        },
        toggle_weight_kpi:function (kpi_id) {
            this.$root.$emit('toggle_weight_kpi', kpi_id);


        },
        // use kpi.can_add_child_kpi instead
        // getUserById: function (kpiId) {
        //     if(kpiId == null) return null;
        //     for(var i = 0; i < this.kpi_list.length; ++i){
        //         if(this.kpi_list[i].id == kpiId)
        //             return this.kpi_list[i].user
        //     }
        //     return null;
        // },
        change_kpi_category:function(kpi_id){
            // this.$emit('change_category', kpi_id);
            this.$root.$emit('change_category', kpi_id);
        },
        get_children_kpis: function(kpi_id){
            // this.$emit('get_children_kpis', kpi_id);
            this.$root.$emit('get_children_kpis', kpi_id);
        },
        set_month_target_from_last_quarter_three_months_result:function(kpi_id){
            this.$root.$emit('set_month_target_from_last_quarter_three_months_result', kpi_id);
        },
        show_unique_code_modal: function(kpi_id){
            this.$root.$emit('show_unique_code_modal', kpi_id)
        },
        unlink_align_up_kpi: function(user, kpi_id, bsc_category, event){
            this.$root.$emit('unlink_align_up_kpi', user, kpi_id, bsc_category, event);
        },
        init_data_align_up_kpi:function(user, kpi_id, bsc_category){
            this.$root.$emit('init_data_align_up_kpi', user, kpi_id, bsc_category);
        },
        add_child_kpi: function(){
            var parent_kpi_id=this.kpi.id;
            this.$root.$emit('add_child_kpi', parent_kpi_id);
        }
    }

});

Vue.component('kpi-new', {
    delimiters: ['{$', '$}'],
    props: [
        // 'kpi',
        // 'organization',

    ],
    data:function(){
        return {

        }
    },
    template: $('#kpi-new-template').html(),
    created: function(){

    },
    mounted:function(){


    },
    watch:{
    },
    computed:{

    },
    methods:{

    }

});


Vue.component('btn-new-kpi', {
    delimiters: ['{$', '$}'],
    template: $('#btn-new-kpi-template').html(),

    methods:{
        show__add_kpi_methods_modal: function(){
            // alert('show modal add new kpi');
            // show modal new kpi
            this.$root.$emit('show__add_kpi_methods_modal');
        }
    }

});
Vue.component('new-kpi-by-category-modal', {
    delimiters: ['{$', '$}'],
    data:function(){
        return {
            category:'',
            options:[
                {
                    id: 'financial',
                    name: 'Tài chính',
                },
                {
                    id: 'customer',
                    name: 'Khách hàng',
                },
                {
                    id: 'internal',
                    name: 'Quy trình nội bộ',
                },
                {
                    id: 'learninggrowth',
                    name: 'Đào tạo & phát triển',
                },
                {
                    id: 'other',
                    name: 'Khác',
                },
            ]
        }
    },

    template: $('#new-kpi-by-category-modal-template').html(),
    mounted:function(){
        this.category='financial';

    },
    methods:{
        add_new_kpi_by_category: function(){
            var that=this;
            // show modal new kpi
            this.$root.$emit('add_new_kpi_by_category', that.category);
        },
        changeCategory: function(){
            // alert('changeCategory');
        },
    }

});
Vue.component('add-kpi-methods-modal', {
    delimiters: ['{$', '$}'],
    props:[
        'organization',
    ],

    template: $('#add-kpi-methods-modal-template').html(),
    mounted:function(){
        // alert('mounted in add-kpi-methods-modal');
        var that=this;
        $('#add-kpi-methods-modal').on('show.bs.modal', function (e) {
            // when the organization do not enable kpi lib, we should show modal new-kpi-by-category directly
            if (that.organization && !that.organization.enable_kpi_lib){
                that.show__new_kpi_by_category_modal();
                return false; // cancel show event
                // $('#add-kpi-methods-modal').modal('hide');
            }
        })
    },
    methods:{
        show__new_kpi_by_category_modal: function(){
            var that=this;
            // show modal new kpi
            this.$root.$emit('show__new_kpi_by_category_modal');
        },

        show__new_kpi_by_kpilib_modal: function(){
            this.$root.$emit('show__new_kpi_by_kpilib_modal');
        },
    }
});

// Vue.use(Autocomplete);


Vue.component('kpi-owner', {
    delimiters: ['{$', '$}'],
    props: [
        'kpi',
        'is_parent_kpi',

    ],
    data:function(){
        return {
            show_search_box:false,
        }
    },
    template: $('#kpi-owner-template').html(),
    created: function(){

    },
    mounted:function(){


    },
    watch:{
    },
    computed:{
        search_url: function () {
            return '/api/v2/searchable_peoplelist/?&limit=10&from_kpi_id=' + this.kpi.id + '&search_term='

        },
        is_able_to_change_owner: function () {
            return !this.is_parent_kpi && this.kpi.weight > 0
        }

    },
    methods:{
        formatData(results){
            // this resultsFormatter will be check before resultsProperty and default response `results`
            // https://github.com/charliekassel/vuejs-autocomplete/blob/6feca77fcfce372d27b5380670fe22aaa2a2bada/src/components/Autocomplete.vue
            if (results.data){
                return results.data.suggestions || [];
            }
            else{
                return [];
            }

        },

        formattedDisplay (result) {
            // alert('formattedDisplay');
            // return result.name + ' [' + result.groupId + ']'
            return result.value
        },
        onSelectInchargeUser (selected_item) {

            var that = this;
            // alert('USER SELECTED');
            // hide search box when an user selected
            this.show_search_box=false;

            var to_user_id=selected_item.value;
            // do not update new tobe assigned user if kpi.user not change
            if (to_user_id == this.kpi.user){
                return false;
            }

            var data={
                user: to_user_id
            };

            var jqXhr=cloudjetRequest.ajax({
                url: `/api/v2/kpi/${this.kpi.id}/assign-to/`,
                type: 'put',
                data: data,
                success: function (kpi_data) {
                    that.reload_kpi(that.kpi.id, false);
                },
                error: function (err) {
                    if (err.responseJSON) {
                        msg = err.responseJSON.message || err.responseJSON.owner_email;
                        if (msg) {
                            alert(msg);
                        }
                	}
                    that.reload_kpi(that.kpi.id, false);
                },
            });
            // this.group = group
            // access the autocomplete component methods from the parent
            // this.$refs.autocomplete.clear()
        },

        dismiss_popover: function(){
            this.show_search_box = false;
        },
        update_assigned_user_data: function(selected_item){
            var to_user=selected_item.selectedObject;
            this.$set(this.kpi, 'user', to_user.id);
            this.$set(this.kpi, 'incharge_user_email', to_user.email);
        },


    }

});



Vue.component('kpi-progressbar', {
    delimiters: ['{$', '$}'],
    props: [
        'kpi',
        'organization',
        'current_quarter',
        'month_1_name',
        'month_2_name',
        'month_3_name',
        'evidences',
        'is_parent_kpi',
        // 'is_user_system',

    ],
    data:function(){
        return {

        }
    },
    template: $('#kpi-progressbar-template').html(),
    created: function(){

    },
    mounted:function(){


    },
    watch:{

    },
    computed:{
        show_progress_bar_score: function(){
            return this.kpi.weight > 0
        },
    },
    methods:{
        triggerAdjustPerformanceThreshold(kpi_id){
            this.$root.$emit('adjust_performance_level',kpi_id)
        },
        // get_inline_monthscores: function (monthstext, quarter, kpi) {
        //     // monthstext: ex: "T1|T2|T3|T4|T5|T6|T7|T8|T9|T10|T11|T12"
        //
        //
        //     var month_1_text=this.monthDisplay(monthstext, quarter, 1);
        //     var month_2_text=this.monthDisplay(monthstext, quarter, 2);
        //     var month_3_text=this.monthDisplay(monthstext, quarter, 3);
        //
        //     var month_1_score_text=this.scoreDisplay(kpi.month_1_score);
        //     var month_2_score_text=this.scoreDisplay(kpi.month_2_score);
        //     var month_3_score_text=this.scoreDisplay(kpi.month_3_score);
        //
        //     return `${month_1_text}:${month_1_score_text} | ${month_2_text}:${month_2_score_text} | ${month_3_text}:${month_3_score_text}`
        //
        //
        // },
        // monthDisplay:function(monthstext, quarter, order){
        //     // // https://stackoverflow.com/a/33671045/6112615
        //     return this.$options.filters.monthDisplay(monthstext, quarter, order);
        // },
        // scoreDisplay:function(score){
        //     return this.$options.filters.scoreDisplay(score);
        // },
        copy_monthly_goal: function(kpi){
            this.$root.$emit('copy_monthly_goal',kpi)
        },
        percent_progressbar: function(kpi){
            return kpi.latest_score*100/this.organization.max_score;
        },
        disable_edit_target: function(kpi){
            if (this.is_user_system) return false;
            console.log("target:", kpi.id);
            return !(kpi.enable_edit && this.organization.allow_edit_monthly_target && this.organization.enable_to_edit);

        },
        get_title_tooltip: function (kpi_month_value, disable, month_number, kpi_type) {
            that = this;
            var message;
            var month_name = month_number == 1 ? that.month_1_name : month_number == 2 ? that.month_2_name : month_number == 3 ? that.month_3_name : '';
            switch (kpi_type) {
                case 1:
                    switch (month_number) {
                        case 1:
                            if ((!kpi_month_value.enable_review || !disable.enable_month_1_review))
                                if ((kpi_month_value.month_2 != null || kpi_month_value.month_3 != null) && kpi_month_value.month_1 == null) {
                                    message = gettext("You forget review the result") + ' ' + month_name;
                                } else if ((kpi_month_value.month_2 == null || kpi_month_value.month_3 == null) && kpi_month_value.month_1 == null) {
                                    message = gettext("You can not to review the result earlier than the specified time") + ' ' + month_name;
                                    if (!(!kpi_month_value.enable_review || !disable.enable_month_2_review) || !(!kpi_month_value.enable_review || !disable.enable_month_3_review)) {
                                        message = gettext("You forget review the result") + ' ' + month_name;
                                    }
                                } else if ((kpi_month_value.month_2 != null || kpi_month_value.month_3 != null) && kpi_month_value.month_1 != null) {
                                    message = gettext("Over time to review the KPI result") + ' ' + month_name;
                                }
                            break;
                        case 2:
                            if ((!kpi_month_value.enable_review || !disable.enable_month_2_review))
                                if ((kpi_month_value.month_1 != null || kpi_month_value.month_3 != null) && kpi_month_value.month_2 == null) {
                                    message = gettext("You forget review the result") + ' ' + month_name;
                                } else if ((kpi_month_value.month_1 == null || kpi_month_value.month_3 == null) && kpi_month_value.month_2 == null) {
                                    message = gettext("You can not to review the result earlier than the specified time") + ' ' + month_name;
                                    if (!(!kpi_month_value.enable_review || !disable.enable_month_3_review)) {
                                        message = gettext("You forget review the result") + ' ' + month_name;
                                    }
                                } else if ((kpi_month_value.month_1 != null || kpi_month_value.month_3 != null) && kpi_month_value.month_2 != null) {
                                    message = gettext("Over time to review the KPI result") + ' ' + month_name;
                                }
                            break;
                        case 3 :
                            if ((!kpi_month_value.enable_review || !disable.enable_month_3_review))
                                if ((kpi_month_value.month_2 != null || kpi_month_value.month_1 != null) && kpi_month_value.month_3 == null) {
                                    message = gettext("You forget review the result") + ' ' + month_name;
                                } else if ((kpi_month_value.month_2 == null || kpi_month_value.month_1 == null) && kpi_month_value.month_3 == null) {
                                    message = gettext("You can not to review the result earlier than the specified time") + ' ' + month_name;
                                } else if ((kpi_month_value.month_2 != null || kpi_month_value.month_1 != null) && kpi_month_value.month_3 != null) {
                                    message = gettext("Over time to review the KPI result") + ' ' + month_name;
                                }
                            break;
                        default:
                            message = null;
                            break;
                    }
                    break;
                case 2:
                    if (disable)
                        return gettext("You can not change the KPI Goal") + ' ' + month_name + ' ' + gettext("switch to the Latest month caculation method to change");
                    break;
                case 3:
                    if (disable)
                        return gettext("This is KPI Achievements") + ' ' + month_name + ' ' + gettext("you can only view and can not edit");
                    break;
                default:
                    break;
            }
            return message;
        },
        disable_review_kpi: function(parent_id, current_month){
            if (this.is_user_system) return false;
            var is_manager = COMMON.UserId != COMMON.UserViewedId;
            var current_month_locked = !(this.can_edit_current_month(current_month, this.organization.monthly_review_lock));
            if (is_manager){ // if current Login user is parent of user viewed
                return ( !this.organization.allow_manager_review || current_month_locked ) // manager can edit if enable_to_edit not pass
            }
            else {
                return ( !this.organization.allow_employee_review || current_month_locked ) // employee can edit(review) kpi only if not pass self_review_date
            }
        },

        check_quarter_plan: function (kpi, type) {
            var that = this;
            var quarter = "one";
            switch (that.current_quarter.quarter) {
                case 1:
                    quarter = "one";
                    break;
                case 2:
                    quarter = "two";
                    break;
                case 3:
                    quarter = "three";
                    break;
                case 4:
                    quarter = "four";
                    break;
                default:
                    break;
            }
            var quarter_plan = kpi['quarter_' + quarter + '_target'];
            var month_1_target = kpi.month_1_target ? kpi.month_1_target : 0;
            var month_2_target = kpi.month_2_target ? kpi.month_2_target : 0;
            var month_3_target = kpi.month_3_target ? kpi.month_3_target : 0;
            console.log('var actual_target = parseFloat((month_1_target + month_2_target + month_3_target).toFixed(5));'
                + typeof month_1_target + '|'
                + typeof month_2_target + '|'
                + typeof month_3_target + '|'
            )
            var actual_target = parseFloat((month_1_target + month_2_target + month_3_target).toFixed(5));
            return kpi.score_calculation_type == 'sum' && (kpi.target != quarter_plan || kpi.target != actual_target);
        },
        // moved to mixin
        // kpi_ready: function (kpi_id, controller_prefix, ready) {
        //     kpi_ready(kpi_id, controller_prefix, ready);
        // },
        update_score_and_ready: function(kpi, controller_prefix, ready){
            // this.$emit('update_score_and_ready', kpi, controller_prefix, ready);
            this.$root.$emit('update_score_and_ready_event', kpi, controller_prefix, ready);
        },
        update_month_target_and_ready: function (kpi, check_disabled, controller_prefix, ready) {
            this.$root.$emit('update_month_target_and_ready_event', kpi, check_disabled, controller_prefix, ready);

        },
        update_quarter_target_and_ready:function(kpi, controller_prefix, ready){
            this.$root.$emit('update_quarter_target_and_ready_event', kpi, controller_prefix, ready);
        },
        update_score_calculation_type_and_ready:function(kpi, controller_prefix, ready){
            this.$root.$emit('update_score_calculation_type_and_ready_event', kpi, controller_prefix, ready);
        },


        // use kpi.can_add_child_kpi instead
        // getUserById: function (kpiId) {
        //     if(kpiId == null) return null;
        //     for(var i = 0; i < this.kpi_list.length; ++i){
        //         if(this.kpi_list[i].id == kpiId)
        //             return this.kpi_list[i].user
        //     }
        //     return null;
        // },
        // change_kpi_category:function(kpi_id){
        //     this.$emit('change_category', kpi_id);
        // },
        // get_children_kpis: function(kpi_id){
        //     this.$emit('get_children_kpis', kpi_id);
        // },
        // set_month_target_from_last_quarter_three_months_result:function(kpi_id){
        //     this.$emit('set_month_target_from_last_quarter_three_months_result', kpi_id);
        // },
        // show_unique_code_modal: function(kpi_id){
        //     this.$emit('show_unique_code_modal', kpi_id)
        // },
        // unlink_align_up_kpi: function(user, kpi_id, bsc_category, event){
        //     this.$emit('unlink_align_up_kpi', user, kpi_id, bsc_category, event);
        // },
        // init_data_align_up_kpi:function(user, kpi_id, bsc_category){
        //   this.$emit('init_data_align_up_kpi', user, kpi_id, bsc_category);
        // },
    }

});

Vue.component('group-kpi', {
    delimiters: ['{$', '$}'],
    props: [
        'group',
        'kpi_list',
        'parent_kpis',
        'current_quarter',
        "organization",
        "current_quarter",
        // "group",
        "employee_performance",
        "company_params",
        "evidences",
        "month_1_name",
        "month_2_name",
        "month_3_name",


    ],
    data:function(){
        return {
            is_expand_kpis:false,
            // show_group_kpis:false,
            // show_group_heading:false,
        }
    },
    template: $('#group-kpi-template').html(),
    created: function(){
        this.track_component_created(COMMON.groups, this.group.slug);
    },
    updated: function(){
        this.track_component_updated(COMMON.groups, this.group.slug);
    },

    mounted:function(){


    },
    watch:{
    },
    computed:{

        show_group_heading: function(){
            var show = this.group.name ? true : false;
            return show
        },
        show_group_kpis: function(){
            var show = false;
            // always show kpis if no group heading
            if (this.show_group_heading == false){
                show = true;
            }else if(this.is_expand_kpis == true){ //show_group_heading == true
                show = true;

            }else{
                show = false;
            }

            return show;


        },

        btn_toggle_class:function(){
            var cls='fa fa-2x';
            if (this.show_group_kpis == true){
                cls += ' fa-caret-down';
            }else{
                cls += ' fa-caret-right';
            }
            return cls;
        },
    },
    methods:{
        toggleKPIs:function(selector) {

            this.is_expand_kpis = ! this.is_expand_kpis;
            // $('[data-group-header-slug='+selector+']').toggleClass('show-group');
            //
            //
            //
            //     if ($('[data-group-header-slug='+selector+']').hasClass('show-group')){
            //         $('[data-group-kpis='+selector+']').slideDown();
            //          $('span#show.btn-kpi-toggle-refer' + selector).hide();
            //     $('span#hide.btn-kpi-toggle-refer' + selector).show();
            //     }
            //     else{
            //         $('[data-group-kpis='+selector+']').slideUp();
            //          $('span#show.btn-kpi-toggle-refer' + selector).show();
            //     $('span#hide.btn-kpi-toggle-refer' + selector).hide();
            //     }

        },

    }

});

Vue.component('kpi-row', {
    delimiters: ['{$', '$}'],
    props: [
        'kpi',
        'kpi_list',
        'organization',
        'current_quarter',
        'month_1_name',
        'month_2_name',
        'month_3_name',
        'group',
        'employee_performance',
        'company_params',
        'evidences',
        'is_parent_kpi',

        // 'is_user_system',

    ],
    data:function(){
        return {
            is_child_kpis_loaded:false,
            internal_kpi_list: this.kpi_list,
            show_childs:false,
            temp_value: {},
            is_childs_show:false
        }
    },
    template: $('#kpi-row-template').html(),
    created: function(){
        var that = this;
        this.track_component_created(COMMON.kpis, this.kpi.id);


        // run only once
        if (this.is_child_kpis_loaded==false){

            var child_kpis = this.get_child_kpis_from_kpi_list(that.kpi.id);
            if (child_kpis.length > 0){
                this.is_child_kpis_loaded = true;
            }
        }
    },
    updated: function(){
        this.track_component_updated(COMMON.kpis, this.kpi.id);

    },
    mounted:function(){


    },
    watch:{
        kpi_list:function(){
            // alert('kpi list chane inside kpi-row component');
        },
    },
    computed:{
        child_kpis:function(){

            var child_kpis = this.get_child_kpis_from_kpi_list(this.kpi.id);
            // alert('child_kpis inside kpi-row component changed: '+ child_kpis.length);
            return child_kpis;
        },
        btn_kpi_toggle_class:function(){
            if (this.show_childs==true)
                return 'fa fa-angle-double-down';
            else return 'fa fa-angle-double-right';
        },

    },
    methods:{

        is_root_kpi: function (kpi) {

            that = this;
            if (kpi.parent == 0 || kpi.parent == undefined || kpi.parent == null) {
                return true;
            }
            else {
                return true;
            }
        },

        check_disable_edit: function (kpi) {
            // Document permission edit quarter target & kpi target
            // https://cloudjet.atlassian.net/wiki/spaces/PM/pages/454328403
            var that = this;
            // Admin allow edit
            if (this.is_user_system){
                return true;
            }

            // Disable when the organization didn't allow to edit month target
            if (!this.organization.allow_edit_monthly_target){
                return false;
            }

            // Enable when the kpi allows to edit
            if (kpi.enable_edit) {
                return true;
            }

            // Otherwise disabled
            return false
        },
        // get_child_kpis_from_kpi_list:function(){
        //
        //     var that =  this;
        //     var child_kpis = [];
        //     Object.keys(that.kpi_list).forEach(function(kpi_id){
        //         if(that.kpi_list[kpi_id].refer_to == that.kpi.id){
        //             child_kpis.push(that.kpi_list[kpi_id]);
        //         }
        //     });
        //     // this does not work because this.kpi_list is not array
        //     // child_kpis=$.grep(this.kpi_list, function(kpi, index){
        //     //     return kpi.refer_to == that.kpi.id;
        //     //
        //     // });
        //     return child_kpis;
        // },
        toggle_childs: function(){
            var that=this;
            var jqXhr=this.get_children_kpis();
            if (jqXhr === null){
                that.show_childs = ! that.show_childs;
            }else{
                jqXhr.done(function(){
                    that.show_childs = ! that.show_childs;
                });
            }
        },
        get_children_kpis:function(){
            var that = this;
            var jqXhr=null;
            // alert('get_children_kpis');

            // this.show_childs = !this.show_childs;
            if (this.is_child_kpis_loaded==true){
                // return this.child_kpis;
            }
            else{
                // get child kpis from server

                jqXhr = cloudjetRequest.ajax({
                    type: 'get',
                    url: '/api/v2/kpi/?parent_id=' + that.kpi.id,

                    success: function (data) {
                        // alert('child kpis loaded');

                        var list_child_kpis=data;
                        // list_child_kpis.forEach(function(child_kpi){
                        //     // that.internal_kpi_list[child_kpi.id]=child_kpi;
                        //     that.$set(that.internal_kpi_list, child_kpi.id, child_kpi);
                        // });
                        that.$root.$emit('update_list_child_kpis', that.kpi.id, list_child_kpis);
                        that.is_child_kpis_loaded = true;

                        // data['parent_kpi_id'] = kpi_id;
                        // data['edit'] = false;
                        // that.current_children_data=Object.assign({}, data);
                        // // self.$set(self.$data, 'current_children_data', data);
                        // that.$set(that.kpi_list[kpi_id], 'children_data', data.children_data)
                        // // that.$set(self.$data, 'kpi_list[' + kpi_id + '].children_data', Object.assign({}, data.children_data))
                        // console.log(self.current_children_data)
                        // // that.$compile(self.$el)
                        // $('#childrenKPIModal').modal();
                        // //    that.$set(that.$data, 'children_kpis', data.children);
                    },
                    error: function () {
                        alert('error');
                    },
                    complete: function (data) {
                        // $('.add_kpi').show();
                    }
                });

            }

            return jqXhr;


        },
        save_action: function (kpi, key, controller_prefix) {
            this.$root.$emit('save_action', kpi, key, controller_prefix);
            this.delete_temp(kpi, key);
        },
        /***
         * To save temp value of a kpi to temp_value object follow this structure:
         * 'temp_value': {
             *      'kpi_id1: {
             *          'key1': {
             *              'prop1': ...,
             *              'prop2: ...,
             *              ....
             *           },
             *          'key2': {
             *              'prop1': ...,
             *              'prop2: ...,
             *              ....
             *          },
             *          ....
             *      },
             *      'kpi_id2': ....
             * }
         * kpi: kpi in kpi_list
         * key: a unique key in temp_value. Example: to save all value of quarter target include:
         'quarter_one_target', 'quarter_two_target', 'quarter_three_target', 'quarter_four_target', you can use:
         'quarter_target': {
                        'quarter_one_target': ....
                        'quarter_two_target': ....
                        'quarter_three_target': ....
                        'quarter_four_target': ....
                    }.
         When you add a key, make sure that your key is different from all other keys.
         * prop: property of object specific by key. Example for key 'quarter_target' prop will be 'quarter_one_target', ....
         *
         * ***/
        tempsave_value: function (kpi, prop, key) {
            var that = this;
            kpi_id = kpi['id'];
            if (!(that.temp_value.hasOwnProperty(kpi_id))) {
                that.temp_value[kpi_id] = {};
            }
            if (!(that.temp_value[kpi_id].hasOwnProperty(key))) {
                that.temp_value[kpi_id][key] = {};
            }
            if (that.temp_value[kpi_id][key][prop]) {
                return;
            }
            else {
                if (typeof kpi[prop] == 'undefined' || kpi[prop] == "")
                    that.temp_value[kpi_id][key][prop] = null;
                else {
                    that.temp_value[kpi_id][key][prop] = kpi[prop];
                }
            }
        },
        /***
         * To delete value of the object specific by key when you perform cancel of save action
         *
         ***/
        delete_temp: function (kpi, key) {
            var that = this;
            kpi_id = kpi['id'];
            delete that.temp_value[kpi_id][key];
        },
        /***
         * To revert value from temp_value to current kpi values
         *
         ***/
        cancel_action: function (kpi, key, controller_prefix) {
            var that = this;
            kpi_id = kpi['id'];
            for (prop in that.temp_value[kpi_id][key]) {
                kpi[prop] = that.temp_value[kpi_id][key][prop];
            }
            that.delete_temp(kpi, key);
            kpi_ready(kpi['id'], controller_prefix, false);
        },
        change_group: function(kpi){
            this.$root.$emit('change_group', kpi);
        },
        update_kpi: function (kpi, show_blocking_modal, callback) {
            this.$root.$emit('update_kpi', kpi, show_blocking_modal, callback);

        }


    }

});


var v = new Vue({
    delimiters: ['${', '}$'],
    // el: '#container',
    el: '#content',
    data: {
        evidences: {},
        current_evidence: null,
        filename: '',
        action_plan_filename:'',
        month: '',
        month_name: '',
        list_evidence: [],
        list_action_plan_file:[],
        user_action_plan_permission: false,
        evidence_id: '',
        content: '',
        kpi_list: {},
        list_group: {},
        // total_weight: {},
        total_weight_by_user: {},
        toggle_states: {},
        total_weight_bygroup: {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0},
        total_kpis_bygroup: {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0},
        // total_old_weight: {},
        total_old_weight_by_user: {},
        total_old_weight_bygroup: {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0},
        total_old_kpis_bygroup: {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0},
        active_kpi_id: '',
        is_child: true,
        status_error: false,
        message_error: '',
        new_group_total: {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0},
        month_1_name: "M1",
        month_2_name: "M2",
        month_3_name: "M3",
        current_quarter: {},
        quarter_by_id: {},
        current_kpi: {},
        employee_performance: {
            email: "",
            kpi_percent: 0,
            kpi_percent_recent: 0,
            kpi_score: 0,
            kpi_score_recent: 0,
            month_1_score: 0,
            month_2_score: 0,
            month_3_score: 0,
            profile: {
                display_name: "",
                get_avatar: "/static/img/people/person.png",
                get_kpi_url: "#",
                get_subordinate_kpi_url: "#",
                title: "",
            },
            team_avg_kpi_percent: 0,
            user_id: 0,
            version: "",
        },
        total_zero_score_kpis: [],
        complete_review: '',
        search: false,
        A_CHANGE: false,
        B_CHANGE: false,
        C_CHANGE: false,
        O_CHANGE: false,
        G_CHANGE: false,
        current_user_id: COMMON.UserId,
        categories: {
            selected: '',
            category: ['financial', 'customer', 'internal', 'learninggrowth', 'other']
        },
        backup_month: [],
        // moved to mixin
        // user_id: COMMON.OrgUserId,
        current_user_profile: {},
        exscore_user_data: {},
        exscore_lib_data: {},
        exscore_score: {
            '1': {
                month_name: '',
                score: 0,
                signal: 'safe'
            },
            '2': {
                month_name: '',
                score: 0,
                signal: 'safe'
            },
            '3': {
                month_name: '',
                score: 0,
                signal: 'safe'
            },
            'current': '---'
        },
        has_perm: {'MANGER_REVIEW': false},
        company_params: {
            ceo_id: null,
            quarter_id: null,
            performance: {
                email:"",
                kpi_percent:0,
                kpi_percent_recent:0,
                kpi_score:0,
                kpi_score_recent:0,
                month_1_score:0,
                month_2_score:0,
                month_3_score:0,
                profile:{
                    display_name:"",
                    get_avatar:"/static/img/people/person.png",
                    get_kpi_url:"#",
                    get_subordinate_kpi_url:"#",
                    title:"",
                },
                team_avg_kpi_percent:0,
                user_id:0,
                version:"",
            }
        },
        quarter_list: [],
        backups_list: [],
        chosen_backup_month: null,
        backup_kpis: [],
        backup_month_name: '',
        current_backup: null,
        reason_kpi: '',
        check_submit_reason: true,
        confirm_delay_kpi: false,
        elm_kpi: null,
        manager_kpis: [],
        selected_manager_kpi: null,
        selected_kpi: null,
        translate: {
            'financial': gettext('Financial'),
            'customer': gettext('Customer'),
            'internal': gettext('Internal Process'),
            'learninggrowth': gettext('Learn & Growth'),
            'other': gettext('Others')
        },
        temp_value: {},
        cache_weight: '',
        adjusting_kpi: {},
        adjusting_chart: null,
        estimated_result_with_threshold: '',
        query: '',
        email_confirm: '',
        status_confirm: false,
        list_user_searched: [],
        list_surbodinates: [],
        list_surbodinates_user_viewed: [],
        storage_user: [],
        preview_attach_url: '',
        is_img: true,
        current_children_data: {},
        tag_list: {},
        tag_input: "",
        // is_user_system: false,
        timeout: null,
        tags: [],
        // searched_kpis: [],
        // next_url_kpi_lib: '',
        // DEPARTMENTS: COMMON.Departments,
        FUNCTIONS: [],
        extra_tags: [],
        // selected_tags: "",
        selected_kpilib: {},
        // BSC_CATEGORY: COMMON.BSCCategory,
        // EXTRA_FIELDS: COMMON.ExtraFields,
        unique_code_cache: '',
        total_edit_weight: {},
        kpi_list_cache: [],
        option_export: 'q-m',
        status_upload_evidence: true,
        status_upload_action_plan: true,
        action_plan_to_be_deleted: null,
        preview_attach_modal_type:'',
        same_user: false,
        disable_upload: false,
        //datatemp for kpilib
        visible: false,
        // end data temp for kpi lib
        organization:[],
        parent_score_auto:true,
    },
    validators: {
        numeric: { // `numeric` custom validator local registration
            message: 'Invalid numeric value',
            check: function (val) {
                return /^[-+]?[0-9]+$/.test(val)
            }
        },
    },
    computed: {
        parentKPIs: function (){
            var kpis = getKPIParentOfViewedUser(this.kpi_list);
            return kpis;
        },
        group_bsc_category_kpis: function () {
            return _.groupBy(this.parentKPIs, 'bsc_category')
        },
        total_weight_exclude_delayed: function () {
            var total = 0;
            var that = this;

            Object.values(this.parentKPIs).forEach(function (kpi) {
                if (kpi.id != that.active_kpi_id) {
                    total += parseFloat(kpi.weight) || 0;
                }
            });
            return total;
        },
        total_old_weight_kpi_parent: function () {
            var total = 0;
            var that = this;
            Object.values(this.parentKPIs).forEach(function (kpi) {
                total += parseFloat(kpi.old_weight) || 0;
            });
            return total;
        },
        total_weight_edit_kpi_parent: function () {
            var total = 0;
            Object.values(this.parentKPIs).forEach(function (kpi){
                total += parseFloat(kpi.new_weight) || 0;
            })
            return total;
        },
        adjust_min_performance: function () {
            var self = this;
            return ((self.adjusting_kpi.achievement_calculation_method_extra.bottom.target / self.adjusting_kpi['month_' + self.adjusting_kpi.adjusting_month + '_target']) * 100).toFixed(2);
        },
        filtered_kpi_level: function(){
            var  self =  this;
            var id = self.active_kpi_id;
            if (id != '' && id != undefined && parseInt(id) > 0) {
                var parent_id = self.kpi_list[id].refer_to;
                return filter_kpi(self.kpi_list, parent_id);
            }
            return self.kpi_list;
        },
        exscore_score_orderBy_key:function (){
            var that = this;
            // http://whitfin.io/sorting-object-recursively-node-jsjavascript/
            var keys = _.keys(this.exscore_score);
            // _.sortBy(this.exscore_score, 'key')
            var sortedKeys = _.sortBy(keys, function(key){
                return key;
            });

            var sortedObj = {};

            // Underscore
            _.each(keys, function(key) {
                sortedObj[key] = that.exscore_score[key];
            });
            return sortedObj;
            // return this.exscore_score;
        },
    },
    mounted: function () {

        this.get_current_quarter();
        this.get_quarter_by_id();

        this.get_current_employee_performance();

        this.loadKPIs();

        // this.$nextTick(function () {
        // code that assumes this.$el is in-document
        //readmore
        this.get_current_organization();
        // var md1 = new MobileDetect(window.navigator.userAgent);
        // if (md1.mobile()) {//if is mobile
        //     $('#company-vision').readmore({
        //         collapsedHeight: 100,
        //         moreLink: '<a href="#"> <i class="fa fa-angle-double-right"></i> ' + ("Read more") + '</a>',
        //         lessLink: '<a href="#"> <i class="fa fa-angle-double-up"></i> ' + gettext("Less") + '</a>'
        //     });
        // }
        // $('#company-mission').readmore({
        //     collapsedHeight: 200,
        //     moreLink: '<a href="#"> <i class="fa fa-angle-double-right"></i> ' + gettext("Read more") + '</a>',
        //     lessLink: '<a href="#"> <i class="fa fa-angle-double-up"></i> ' + gettext("Less") + '</a>'
        // });
        this.fetch_exscore_lib();
        this.fetch_exscore();
        this.fetch_current_user_profile();
        var p = JSON.parse(localStorage.getItem('history_search_u'));
        if (p == null) localStorage.removeItem('history_search');
        this.storage_user = (p == null) ? [] : JSON.parse(localStorage.getItem('history_search'))[p.indexOf(COMMON.UserRequestEmail)] || [];
        // this.is_user_system = (COMMON.IsAdmin == 'True' || COMMON.IsSupperUser == 'True') ? true : false;
        this.get_surbodinate();
        this.same_user = (COMMON.UserRequestID == COMMON.UserViewedId) ? true : false;  // -> hot fix, has_perm(KPI__EDITING) => actor == target cho phep nhan vien tu chinh sua kpi, nhung logic moi thi khong cho phep
        this.get_surbodinate_user_viewed();
        // });



        $('#edit-all-weight-modal').on('show.bs.modal',function () {
            $(this).focus();

        })


    },
    filters: {
        //marked: marked
        // type_ico_url: function(type){
        //     var doc_type = ['docx','pdf','xls','xlsx','doc'];
        //     var img_type = ['jpg', 'jpeg', 'bmp', 'png'];
        //
        //     var type = type.split('.');
        //     if(doc_type.indexOf(type[type.length -1 ].toLowerCase()) > -1){
        //         return COMMON.StaticUrl+'images/ico-document-format.png';
        //     }
        //     if(img_type.indexOf(type[type.length -1 ].toLowerCase()) > -1){
        //         return COMMON.StaticUrl+'images/ico-image-format.png';
        //     }
        // },
        // type_ico: function(type){
        //     var img_type = ['jpg', 'jpeg', 'bmp', 'png'];
        //
        //     var type = type.split('.');
        //     if(img_type.indexOf(type[type.length -1 ].toLowerCase()) > -1){
        //         return true;
        //     }
        //     return false;
        // },

        // comment out this, move to methods because: https://stackoverflow.com/questions/42828664/access-vue-instance-data-inside-filter-method
        // percent_progressbar: function(kpi_id){
        //     return this.kpi_list[kpi_id].latest_score*100/this.organization.max_score;
        // }
    },
    watch: {
        parentKPIs: {
            handler:function(val, oldVal){
                // alert('watch parentKPIS');
                var kpis=val;
                var groups = $.map(kpis, function(kpi, index){
                    var group = {
                        name: kpi.refer_group_name,
                        slug_no_category: kpi.kpi_refer_group ,
                        slug: kpi.bsc_category + kpi.kpi_refer_group ,
                        category: kpi.bsc_category,
                        refer_to: kpi.refer_to, // if this KPI is assigned to user
                        // id: self.kpi_list[kpi_id].group_kpi
                    };
                    return group;
                });


                // self.kpi_list[kpi_id].kpi_refer_group
                var unique_groups=$.grep(groups,function(group, index){
                    // return index == $.inArray(group, array);
                    var first_index_found=groups.findIndex(g => g.slug == group.slug);
                    return index == first_index_found;
                    // return index == $.inArray(group, array);
                });

                var unique_group_slugs=$.map(unique_groups, function(g, index){
                    return g.slug + `${g.refer_to}`;
                });
                var pre_unique_group_slugs=$.map(self.list_group, function(g, index){
                    return g.slug + `${g.refer_to}`;
                });

                /*
                * enable lại, bởi vì trường hợp sau:
                    kpi k in parentKPIs
                    tuy nhiên trong trường hợp k chỉ thay đổi 1 field nào đó không liên quan đến group (unit, score_calculation_type, ....)
                    thì không cần phải set lại group trong trường hợp này
                * */
                if(self.compareArrays(unique_group_slugs, pre_unique_group_slugs) === false){
                    unique_groups.sort(function(g1, g2){
                        var g1 = g1.category + (g1.slug_no_category == 'none'?"":g1.slug_no_category) + `${g1.refer_to}`;
                        var g2 = g2.category + (g2.slug_no_category == 'none'?"":g2.slug_no_category) + `${g2.refer_to}`;
                        return g2.localeCompare(g1);
                    });
                    self.$set(self,  'list_group', unique_groups);
                }

            }
        },



        kpi_list: {
            handler: function (val, oldVal) {
                this.calculate_total_weight();
                // this.getListGroupV2();
                // this.getListGroup();
            }
            //,deep: true <-- slow
        },
        'current_quarter': {
            handler: function (val, oldVal) {
                var that = this
                this.$children.map(function (elem, index, children_arr) {
                    elem.$emit('fetch_current_quarter', val);
                })
            }
        },
        'exscore_score.current': {
            handler: function (val, old) {
                console.log(' =====================> select value is: ' + val)
                $('#month-1').hide().parent().removeClass('active')
                $('#month-2').hide().parent().removeClass('active')
                $('#month-3').hide().parent().removeClass('active')
                $('#month-' + val).show().parent().addClass('active')
            }
        },
        'organization': {
            handler: function (newVal, oldVal) {
                // alert('organization changed');
                var that = this
                that.$emit('update_lock_exscore_review', newVal.monthly_review_lock)
                that.$set(that.company_params,  'ceo_id', newVal.ceo)
                that.get_company_performance(that.company_params)
            }
        },
        // selected_tags: {
        //     handler: function (newVal, oldVal) {
        //         this.search_kpi_library();
        //     }
        // },
        // searched_kpis: {
        //
        // }
    },
    created: function(){

        try{
            ELEMENT.locale(ELEMENT.lang[COMMON.LanguageCode]);
        }
        catch (e){
            console.log(e);
        }
        var that = this;


        // // https://vuejs.org/v2/guide/migration.html#Events
        // // The events option has been removed.
        // // Event handlers should now be registered in the created hook instead.
        this.$on('copy_monthly_goal',function(kpi){
            that.copy_monthly_goal(kpi)
        })
        // this.$on('update_score_and_ready_event', function(){alert('update_score_and_ready_event callback')}); // this work when in component we use: this.$root.$emit()
        this.$on('update_score_and_ready_event', function(kpi, controller_prefix, ready){
            that.update_score_and_ready(kpi, controller_prefix, ready);
        });
        this.$on('update_month_target_and_ready_event', function(kpi, check_disabled, controller_prefix, ready) {
            that.update_month_target_and_ready(kpi, check_disabled, controller_prefix, ready);
        });
        this.$on('update_quarter_target_and_ready_event', function(kpi, controller_prefix, ready) {
            that.update_quarter_target_and_ready(kpi, controller_prefix, ready);
        });
        this.$on('update_score_calculation_type_and_ready_event', function(kpi, controller_prefix, ready) {
            that.update_score_calculation_type_and_ready(kpi, controller_prefix, ready);
        });

        this.$on('change_category', function(kpi_id) {
            that.change_category(kpi_id);
        });
        this.$on('get_children_kpis', function(kpi_id) {
            that.get_children_v2(kpi_id);
        });
        this.$on('set_month_target_from_last_quarter_three_months_result', function(kpi_id) {
            that.set_month_target_from_last_quarter_three_months_result(kpi_id);
        });
        this.$on('show_unique_code_modal', function(kpi_id) {
            that.show_unique_code_modal(kpi_id);
        });
        this.$on('unlink_align_up_kpi', function(user_id, kpi_id, bsc_category, event) {
            that.unlink_align_up_kpi(user_id, kpi_id, bsc_category, event);
        });
        this.$on('init_data_align_up_kpi', function(user_id, kpi_id, bsc_category) {
            that.init_data_align_up_kpi(user_id, kpi_id, bsc_category);
        });
        this.$on('update_evidence_event_callback', function(kpi_id, month, count) {
            that.update_evidence_event_callback(kpi_id, month, count);
        });
        this.$on('showModal_e', function(month_number, kpi_id) {
            that.showModal_e(month_number, kpi_id);
        });

        this.$on('update_list_child_kpis', function(parent_kpi, list_children_kpis) {
            that.update_list_child_kpis(parent_kpi, list_children_kpis);
        });

        this.$on('save_action', function(kpi, key, controller_prefix) {
            that.save_action(kpi, key, controller_prefix);
        });

        this.$on('change_group', function(kpi) {
            that.change_group(kpi);
        });



        this.$on('update_lock_exscore_review', function (option) {
            var that = this;
            console.log('triggered update_lock_exscore_review')
            if (option == 'allow_all') {
                $('select#exscore-select-control').prop('disabled', false)
                // that.$set(that.$data, 'exscore_score.current', '---')
                that.$set(that.exscore_score, 'current', '---')
            } else {
                // that.$set(that.$data, 'exscore_score.current', option);
                that.$set(that.exscore_score, 'current', option);
                // $('#month-' + option).show()
                $('select#exscore-select-control').prop('disabled', true)
            }
        });
        this.$on('update_exscore', function (month, data) {
            console.log('triggered update_exscore')
            //var that = this;
            var score = data.score;
            console.log(data);
            if (data.zero || (score + that.employee_performance['month_' + month + '_score'] < 0)) {
                score = -that.employee_performance['month_' + month + '_score']
            }
            // that.$set(that.$data, 'exscore_score[' + month + '].score', score)
            that.$set(that.exscore_score[month], 'score', score);
        });
        this.$on('fetch_user_exscore', function () {
            console.log('triggered fetch_user_exscore')
            that.fetch_exscore();
        });


        this.$on('show__add_kpi_methods_modal', function () {
            // show_modal_add_kpi
            // alert('show__add_kpi_methods_modal in root');
            that.show__add_kpi_methods_modal();
        });
        this.$on('show__new_kpi_by_category_modal', function () {
            that.show__new_kpi_by_category_modal();
        });

        this.$on('show__new_kpi_by_kpilib_modal', function () {
            // show_kpilib
            that.show__new_kpi_by_kpilib_modal();
        });



        this.$on('add_new_kpi_by_category', function (category) {
            that.add_new_kpi_by_category(category);
        });
        this.$on('add_new_kpi_from_kpi_lib', function (kpi) {

            that.add_new_kpi_from_kpi_lib(kpi);
        });

        this.$on('add_child_kpi', function (parent_kpi_id) {

            that.add_child_kpi(parent_kpi_id);
        });


        this.$on('update_kpi', function (kpi, show_blocking_modal, callback) {
            that.update_kpi(kpi, show_blocking_modal, callback);
        });

        this.$root.$on("adjust_performance_level", function(kpi_id) {
            that.adjust_performance_level(kpi_id)
        })
        this.$on('kpi_reloaded', function (kpi_data) {
            that.update_data_on_kpi_reloaded(kpi_data);
        });

        this.$on('kpi_removed', function (kpi_id) {
            that.update_data_on_kpi_removed(kpi_id);
        });
        this.$on('toggle_weight_kpi', function (kpi_id) {
            that.toggle_weight_kpi(kpi_id);
        });
    },
    methods: {
        to_percent: function (val, total) {
            if (total > 0) {
                return val * 100 / total;
            }
            return "";
        },
        toggle_weight_kpi:function (kpi_id) {

            var that = this;
            var kpi=this.kpi_list[kpi_id];
            this.reason_kpi = '';
            this.check_submit_reason = false;
            this.check_reason();
            var reason = this.get_reason_delay_kpi();
            // weight = weight.replace(',', '.');
            weight = kpi.weight;
            this.active_kpi_id = kpi_id;

            this.checkChild(this.active_kpi_id); // CHECK kpi nay la kpi cha hay kpi con
            this.constructOldWeight();


            if (parseFloat(weight) !== 0.0) {
                this.kpi_list[kpi_id].old_weight = parseFloat(weight);
                $('#modalReason').modal('show');
            } else {
                var data = {'id': kpi_id, 'command': 'active_kpi', 'reason': reason};
                swal({
                    title: "Kích hoạt KPI",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Hủy",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Đồng ý",
                    closeOnConfirm: true
                }, function () {
                    cloudjetRequest.ajax({
                        url: '/api/kpi/services/',
                        type: 'post',
                        data: data,
                        success: function (data, statusText, jqXHR) {
                            if (jqXHR.status === 200) {
                                console.log(data);
                                //add performance for employee
                                that.get_current_employee_performance();
                                that.reload_kpi(kpi_id);
                            } else {
                                swal(gettext('Not successful'), gettext('Cannot delay/active this kpi'), "error");
                            }
                            // $scope.calculate_score(kpi);
                        },
                        error: function (e) {
                            //alert('Cannot delay/active this kpi!');
                            //console.log(e )
                            //swal("Không thành công", jqXHR.responseJSON.message, "error");
                            if (e.responseJSON.message != "" || e.responseJSON.message != null || e.responseJSON.message != undefined){
                                swal(gettext('Not successful'),  e.responseJSON.message, "error");
                            }
                            else{
                                swal(gettext('Not successful'), gettext('Cannot delay/active this kpi'), "error");
                            }
                        }
                    });
                });
            }

        },
        confirm_toggle_weigth_kpi:function (kpi_id) {

            var that = this;
            var kpi_id = this.active_kpi_id;
            var reason = this.get_reason_delay_kpi();
            this.status_error = false;
            var data = {'id': kpi_id, 'command': 'delay_toggle', 'reason': reason};
            cloudjetRequest.ajax({
                url: '/api/kpi/services/',
                type: 'post',
                data: data,
                success: function (data) {

                    // var root = $(v.get_root_kpi_wrapper(kpi_id));
                    // $(root).reload_kpi_anchor();
                    that.reload_kpi(kpi_id);

                    that.update_kpis(kpi_id);
                },
                error: function () {

                    that.status_error = true;
                    that.message_error = gettext('You do not have permission to delay this KPI!')
                    //alert('Cannot delay/active this kpi!');
                },
                complete: function (jqXHR) {

                }
            });
        },
        update_data_on_kpi_removed: function(kpi_id){

            var that = this;
            var parent_kpi_id = that.$root.get_top_level_parent_kpi_id(kpi_id);
            if (parent_kpi_id != kpi_id){ // child kpi
                // when child remove kpi, we should reload top-level kpi to make sure kpi score & weight update accordingly
                that.reload_kpi(parent_kpi_id);
            }
            else{
                that.$delete(that.kpi_list, kpi_id);
            }
            that.get_current_employee_performance();

        },



        remove_kpi_data: function(kpi_id){
            // alert('remove_kpi_data');
            var that = this;
            var child_kpis=that.get_child_kpis_from_kpi_list(kpi_id);
            if (child_kpis.length > 0){
                child_kpis.forEach(function(kpi){
                    that.remove_kpi_data(kpi.id)
                });
            }

            if (that.kpi_list[kpi_id]) {
                that.$delete(that.kpi_list, kpi_id);
            }


        },
        update_data_on_kpi_reloaded: function(kpi_data){

            var that = this;

            var update_kpi_data=function (kpi) {
                if (kpi.children && kpi.children.length > 0){
                    kpi.children.forEach(function(k){
                        update_kpi_data(k);
                    });

                }
                that.$set(that.kpi_list, kpi.id, kpi);
            };
            if (kpi_data){
                // alert('that.remove_kpi_data(kpi_data.id);');
                that.remove_kpi_data(kpi_data.id);


                // alert('set new data after reload kpi');
                update_kpi_data(kpi_data);
                // this.kpi_list[]
            }


        },


        // get_kpis_by_group:function(group){
        //     // {#    v-if="parentKPIs[kpi.id] !== undefined && (kpi.bsc_category + kpi.kpi_refer_group) == group.slug"#}
        //     var kpis={}
        //     Object.keys(parentKPIs).forEach(function(key, index){
        //         var kpi=parentKPIs[key];
        //         if((kpi.bsc_category + kpi.kpi_refer_group) == group.slug){
        //            kpis[key]=kpi;
        //         }
        //     });
        //     return kpis;
        //
        // },

        show__new_kpi_by_category_modal: function(){
            this.hide__add_kpi_methods_modal();
            $('#new-kpi-by-category-modal').modal('show');

        },
        show__new_kpi_by_kpilib_modal: function(){
            this.hide__add_kpi_methods_modal();
            // $('#new-kpi-by-kpilib-modal').modal('show');
            $('#modal-kpi-lib').modal('show');
        },


        show__add_kpi_methods_modal: function(){
            $('#add-kpi-methods-modal').modal('show');
        },
        hide__add_kpi_methods_modal: function(){
            $('#add-kpi-methods-modal').modal('hide');
        },
        hide__new_kpi_by_category_modal:function(){
            $('#new-kpi-by-category-modal').modal('hide');
        },

        add_child_kpi: function(parent_kpi_id){
            var that=this;
            var kpi_data={
                parent_kpi_id:parent_kpi_id
            };

            var jqXhr=this.add_kpi(false, kpi_data);
            // additional success callback function
            jqXhr.done(function(){
                that.$set(that.kpi_list[parent_kpi_id], 'has_child', true);
                that.$set(that.kpi_list[parent_kpi_id], 'children_data', {'parent_score_auto': true});
                // $('#btn-kpi-toggle'+kpi).children('i.fa').removeClass("fa-angle-double-right").addClass("fa-angle-double-down");
            });


        },
        add_new_kpi_by_category:function(category){
            var that=this;
            var kpi_data={
                'category':category
            };
            var jqXhr=this.add_kpi(false, kpi_data);
            jqXhr.done(function () {
                that.hide__new_kpi_by_category_modal();
            });
        },
        add_new_kpi_from_kpi_lib: function (k) {
            $(".btn-add-kpilib").button("loading");

            var jqXhr = this.add_kpi(true, k);
            jqXhr.complete(function () {
                $(".btn-add-kpilib").button("reset");
                swal({
                    type: 'success',
                    title: gettext('Add KPI successfully'),
                    text: k.name + gettext(' has been added successfully to the category ') + COMMON.BSCCategory[k.category] ,
                    showConfirmButton: false,
                    customClass: 'add-kpi-success',
                    timer: 3000,
                });
            });

        },


        add_kpi:function(from_kpilib=false, kpi_data){
            var that = this;

            // var level = 1;
            var data = {
                'from_kpilib':from_kpilib,
                'kpi_data': JSON.stringify(kpi_data),
                // 'parent_kpi': kpi_data,
                // 'level': level,
                // 'new_template': true
            };





            var jqXhr=cloudjetRequest.ajax({
                url: location.pathname,
                type: 'post',
                data: data,
                success: function (new_kpi_data) {

                    that.$set(that.kpi_list, new_kpi_data.id, new_kpi_data);

                },
                error: function () {
                }
            });
            return jqXhr;
        },



        update_list_child_kpis:function(parent_kpi, list_children_kpis){
            var that = this;
            // alert('update_list_child_kpis function');
            list_children_kpis.forEach(function(child_kpi){
                that.$set(that.kpi_list, child_kpi.id, child_kpi);
            });
        },
        childrenKPIs: function(kpi_id){
            if (this.kpi_list[kpi_id]){
                return this.kpi_list[kpi_id].children
            }
            return []

        },

        percent_progressbar: function(kpi_id){
            return this.kpi_list[kpi_id].latest_score*100/this.organization.max_score;
        },

        type_ico_url: function(type){
            var doc_type = ['docx','pdf','xls','xlsx','doc'];
            var img_type = ['jpg', 'jpeg', 'bmp', 'png'];

            var type = type.split('.');
            if(doc_type.indexOf(type[type.length -1 ].toLowerCase()) > -1){
                return COMMON.StaticUrl+'images/ico-document-format.png';
            }
            if(img_type.indexOf(type[type.length -1 ].toLowerCase()) > -1){
                return COMMON.StaticUrl+'images/ico-image-format.png';
            }
        },
        type_ico: function(type){
            var img_type = ['jpg', 'jpeg', 'bmp', 'png'];

            var type = type.split('.');
            if(img_type.indexOf(type[type.length -1 ].toLowerCase()) > -1){
                return true;
            }
            return false;
        },
        toggleKPIs:function(selector) {

            $('[data-group-header-slug='+selector+']').toggleClass('show-group');



            if ($('[data-group-header-slug='+selector+']').hasClass('show-group')){
                $('[data-group-kpis='+selector+']').slideDown();
                $('span#show.btn-kpi-toggle-refer' + selector).hide();
                $('span#hide.btn-kpi-toggle-refer' + selector).show();
            }
            else{
                $('[data-group-kpis='+selector+']').slideUp();
                $('span#show.btn-kpi-toggle-refer' + selector).show();
                $('span#hide.btn-kpi-toggle-refer' + selector).hide();
            }

        },
        constructOldWeight: function(){
            var self = this;
            var kpis = JSON.parse(JSON.stringify(self.kpi_list));
            for(var kpi_id in kpis){
                kpis[kpi_id].old_weight = kpis[kpi_id].weight;
            }
            self.kpi_list = kpis;
        },
        inputKPIWeight: function(val){
            var self = this;
            if (parseFloat(val) === 0){

            }
        },
        findGroupBySlug: function(slug,dataSource){
            var self = this;
            var listGroups = Object.keys(dataSource).map(function(elm){
                return dataSource[elm]
            })
            var groups = listGroups.slice().filter(function(elm){
                return elm.slug === slug
            })
            return groups;
        },
        findGroupByID: function(id,dataSource){
            var self = this;
            var listGroups = Object.keys(dataSource).map(function(elm){
                return parseInt(dataSource[elm].id)
            })
            var found = listGroups.indexOf(parseInt(id))
            return found;
        },
        getListGroup: function(){
            //debugger;
            var listGroup ={};
            var count = 0;
            var tmp = [];
            var group_in_category = []
            //console.log("==========gtx 1000============")
            //console.log(this.kpi_list)
            for (kpi in this.kpi_list) {
                if(tmp.indexOf(this.kpi_list[kpi].bsc_category) == -1) {
                    tmp.push(this.kpi_list[kpi].bsc_category)
                    group_in_category[this.kpi_list[kpi].bsc_category] = []
                }
                if (group_in_category[this.kpi_list[kpi].bsc_category].indexOf(this.kpi_list[kpi].kpi_group_id) == -1
                    && (this.kpi_list[kpi].refer_to == null || this.kpi_list[this.kpi_list[kpi].refer_to] == null)) {
                    listGroup[count] = {
                        name: this.kpi_list[kpi].refer_group_name,
                        slug: this.kpi_list[kpi].bsc_category + this.kpi_list[kpi].kpi_refer_group,
                        category: this.kpi_list[kpi].bsc_category,
                        refer_to: this.kpi_list[kpi].refer_to,
                        id: this.kpi_list[kpi].kpi_group_id
                    };

                    group_in_category[this.kpi_list[kpi].bsc_category].push(this.kpi_list[kpi].kpi_group_id);
                    count += 1;
                    //console.log(group_in_category)
                }
            }

            this.list_group = listGroup;
            // console.log("======================tttttttttt===================")
            // console.log(this.list_group)
        },




        compareArrays:function(arr1, arr2) {
            // only for array of string values. Other types was not test
            return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0
        },

        formatWeight: function (val) {
            if (typeof val == 'number') {
                return val.toFixed(2);
            }
        },


        delete_all_kpis: function () {
            var that = this;
            cloudjetRequest.ajax({
                method: "POST",
                url: '/api/kpi/services/',
                data: {
                    'command': 'delele_all_kpis',
                    'user_id': COMMON.UserViewedId,
                    'email': that.email_confirm
                },
                success: function (data) {
                    window.location.reload(true);
                },
            })
        },

        hide_modal: function (modal_id) {
            $(modal_id).modal('hide');
        },
        check_email_delete: function () {
            var email = this.email_confirm.replace(/\s/g,'');
            if (email.length == COMMON.UserViewedEmail.length && email == COMMON.UserViewedEmail ){
                this.status_confirm = false;
            }else{
                this.status_confirm = true;
            }
        },

        reset_modal_delete: function () {
            var that = this;
            that.status_confirm = true;
            that.email_confirm = '';
        },
        // search_kpi_library: function (page=null) {
        //
        // },
        fetch_kpi_tag: function (children_data_object, kpi_child_id) {
            var kpi_tag = [];
            try {
                var tag_index = children_data_object.children_weights.map(function (elm, index) {
                    return elm.kpi_id;
                }).indexOf(kpi_child_id);
                kpi_tag = children_data_object.children_weights[tag_index].relation_type;

            } catch (e) {
                console.log(e)
            }
            return Object.assign([], kpi_tag);
        },
        update_relation_type_object: function (children_data_object, kpi_id) {
            var self = this;
            var cloned_children_data_object = Object.assign({}, children_data_object);
            var cloned_relation_type = Object.assign([], self.tag_list[kpi_id]);
            var relation_index = children_data_object.children_weights.map(function (elm) {
                return elm.kpi_id;
            }).indexOf(kpi_id);
            cloned_children_data_object.children_weights[relation_index].relation_type = cloned_relation_type;
            return cloned_children_data_object;
        },
        open_tag_input: function (kpi_id) {
            var self = this;
            var elm_wrapper = $("#tag-wrapper-" + kpi_id);
            var temp_relation_type = Object.assign([], self.tag_list[kpi_id]);
            self.$set(self.$data, 'tempo_relation_type[' + kpi_id + ']', temp_relation_type);
            if (!elm_wrapper.hasClass('input')) {
                elm_wrapper.addClass('input');
                ;
                $('#tag-wrapper-' + kpi_id + ' input').focus();
                self.$set(self.$data, 'tag_' + kpi_id, true);
            }
        },
        close_tag_input: function (kpi_id) {
            var self = this;
            var elm_wrapper = $("#tag-wrapper-" + kpi_id);
            if (elm_wrapper.hasClass('input')) {
                elm_wrapper.removeClass('input');
                self.$set(self.$data, 'tag_' + kpi_id, false);
            }
            var refer_to_id = self.kpi_list[kpi_id].refer_to;
            var data = self.update_relation_type_object(self.kpi_list[kpi_id].parent_children_data, kpi_id);
            console.log(data)
            cloudjetRequest.ajax({
                method: 'post',
                url: '/api/v2/kpi/children_weights/' + refer_to_id + '/',
                data: JSON.stringify(data),
                success: function (data) {
                    self.$set(self.$data, 'kpi_list[' + kpi_id + '].parent_children_data', data);
                    self.$set(self.$data, "tag_list[" + kpi_id + ']', self.fetch_kpi_tag(data, kpi_id))
                }
            });
        },
        cancel_tag_input: function (kpi_id) {
            var self = this;
            var elm_wrapper = $("#tag-wrapper-" + kpi_id);
            if (elm_wrapper.hasClass('input')) {
                elm_wrapper.removeClass('input');
                self.$set(self.$data, 'tag_' + kpi_id, false);
            }
            self.$set(self.$data, 'tag_list[' + kpi_id + ']', self.tempo_relation_type[kpi_id])
        },
        display_tag: function (kpi_id) {
            var self = this;
            if (self.tag_list[kpi_id].length === 0) self.tag_list[kpi_id].push(self.tag_input);
            else {

            }
            self.tag_input = '';
        },
        get_children_refer_by_id: function (kpi_id) {
            var self = this;
            var kpi_index = self.current_children_data.refer_kpis.map(
                function (elem) {
                    return elem.id;
                }
            ).indexOf(kpi_id);
            return self.current_children_data.refer_kpis[kpi_index];
        },
        get_children_v2: function (kpi_id) {
            // Pace.start();
            var self = this;
            cloudjetRequest.ajax({
                type: 'get',
                url: '/api/v2/kpi/children_weights/' + kpi_id + '/',

                success: function (data) {

                    data['parent_kpi_id'] = kpi_id;
                    data['edit'] = false;
                    self.current_children_data=Object.assign({}, data);
                    // self.$set(self.$data, 'current_children_data', data);
                    self.$set(self.kpi_list[kpi_id], 'children_data', data.children_data)
                    self.parent_score_auto = data.children_data.parent_score_auto;
                    // self.$set(self.$data, 'kpi_list[' + kpi_id + '].children_data', Object.assign({}, data.children_data))
                    console.log(self.current_children_data)
                    // self.$compile(self.$el)
                    $('#childrenKPIModal').modal();
                    //    that.$set(that.$data, 'children_kpis', data.children);
                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                    $('.add_kpi').show();
                }
            });

        },
        confirm_switching_autocal: function(close_modal = true) {
            var self = this;
            //  if(self.organization.default_auto_score_parent === true){

            self.current_children_data.children_data.parent_score_auto = this.parent_score_auto;
            self.current_children_data.children_data.children_weights.map(function (elm) {
                elm.weight = parseFloat(elm.weight);
                elm.weight_temp = parseFloat(elm.weight_temp);
                return elm;
            });
            var jqXhr=cloudjetRequest.ajax({
                type: 'post',
                url: '/api/v2/kpi/children_weights/' + self.current_children_data.parent_kpi_id + '/',
                contentType: 'application/json',
                data: JSON.stringify(self.current_children_data.children_data),
                success: function (data) {
                    self.$set(self.kpi_list[self.current_children_data.parent_kpi_id], 'children_data', data);

                    console.log(data);
                    if (close_modal) {
                        $('#childrenKPIModal').modal('hide');

                        // var root = self.get_root_kpi_wrapper(self.current_children_data.parent_kpi_id);
                        // $(root).reload_kpi_anchor();
                        self.reload_kpi(self.current_children_data.parent_kpi_id);
                        self.current_children_data = {};
                    }
                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                    $('.add_kpi').show();
                }
            });
            // }
        },
        cancel_switching_autocal: function () {
            var self = this;
            self.current_children_data = {};
        },
        check_status_msg_expired: function () {
            var that = this
            var date_expired = new Date(that.organization.edit_to_date);
            var date_now = new Date();
            var cache_date = [];
            _date_expired = JSON.parse(localStorage.getItem('date_expired'));
            if (_date_expired == null || localStorage.getItem('status_msg_expired') == null) {
                cache_date.push({'day': date_expired.getDate(), 'month': date_expired.getMonth() + 1});
                localStorage.setItem('date_expired', JSON.stringify(cache_date));
                localStorage.setItem('status_msg_expired', false);
            } else if (_date_expired.length > 0 && localStorage.getItem('status_msg_expired') == 'true') {
                var _day = date_expired.getDate();
                var _month = date_expired.getMonth() + 1;
                if (date_expired.getMonth() + 1 == _date_expired[0].month && date_expired.getDate() > _date_expired[0].day) {
                    _day = date_expired.getDate();
                    _month = date_expired.getMonth() + 1;
                    localStorage.setItem('status_msg_expired', false);
                } else if (date_expired.getMonth() + 1 > _date_expired[0].month) {
                    _day = date_expired.getDate();
                    _month = date_expired.getMonth() + 1;
                    localStorage.setItem('status_msg_expired', false);
                }
                cache_date.push({'day': date_expired.getDate(), 'month': date_expired.getMonth() + 1});
                localStorage.setItem('date_expired', JSON.stringify(cache_date));
            }
        },
        get_surbodinate: function () {
            var that = this;
            cloudjetRequest.ajax({
                method: "GET",
                dataType: 'json',
                url: '/api/team/?user_id=' + COMMON.UserRequestID,
                success: function (data) {
                    that.list_surbodinates = data;
                }
            })
        },
        get_surbodinate_user_viewed: function () {
            var that = this;
            cloudjetRequest.ajax({
                method: "GET",
                dataType: 'json',
                url: '/api/team/?user_id=' + COMMON.UserViewedId,
                success: function (data) {
                    that.list_surbodinates_user_viewed = data;
                }
            })
        },
        page_employee: function (user_id, p) {
            var that = this;
            if (p != -1) {
                var _storage = [];
                var _all = [];
                var user_current = (JSON.parse(localStorage.getItem('history_search_u')) != null) ? JSON.parse(localStorage.getItem('history_search_u')) : [];
                var position = user_current.indexOf(COMMON.UserRequestEmail);
                if (position == -1) {
                    user_current.push(COMMON.UserRequestEmail);
                    localStorage.setItem('history_search_u', JSON.stringify(user_current));
                }
                _all = (JSON.parse(localStorage.getItem('history_search')) != null) ? JSON.parse(localStorage.getItem('history_search')) : [];
                _storage = (typeof _all[user_current.indexOf(COMMON.UserRequestEmail)] != 'undefined') ? _all[user_current.indexOf(COMMON.UserRequestEmail)] : [];

                // Check user_id has existed in list
                var has_user = false;
                _storage.forEach(function(e, i){
                    if(that.list_user_searched[p].user_id == e.user_id){
                        if (i>0 && has_user==false){
                            // Move item to first in array
                            var temp = _storage[0];
                            _storage[0] = e;
                            _storage[i] = temp;
                        }
                        has_user = true;
                        return;
                    }
                })
                // If user hasn't in list, push user to list
                if (has_user==false)_storage.insert(0, that.list_user_searched[p]);
                _all[user_current.indexOf(COMMON.UserRequestEmail)] = _storage
                if (_all[user_current.indexOf(COMMON.UserRequestEmail)].length > 3) _all[user_current.indexOf(COMMON.UserRequestEmail)].splice(3, 1);
                localStorage.setItem('history_search', JSON.stringify(_all));
                console.log(_all);
            }
            var url = COMMON.LinkKPIEditorEmp;
            index = url.substr(0, url.length - 1).lastIndexOf('/');
            location.href = url.substr(0, index) + "/" + user_id + "/";
        },
        search_user_limit: function () {
            var that = this;
            clearTimeout(that.timeout);
            that.timeout = setTimeout(function () {
                if (that.query.length > 1) {
                    $(".arrow-up").hide();
                    $("#list_user_suggest").hide();
                    $("#result_searched").show();
                    $("#ico-clear").show();
                    $("#ico-search").hide();
                    $("#popup-progress").hide();
                    cloudjetRequest.ajax({
                        method: "GET",
                        dataType: 'json',
                        url: COMMON.LinkSearchPeople + '?all_sublevel=1&limit=10&search_term=' + that.query,
                        success: function (data) {
                            that.list_user_searched = data.suggestions;
                            console.log(that.list_user_searched);
                            // self.quarter_period = [];
                            // self.user_profile = null;
                            if (that.list_user_searched < 1) {
                                $(".no-data").show();
                            }
                            else {
                                $(".no-data").hide();
                            }
                            $(".arrow-up").show();
                        }
                    })
                } else {
                    $("#list_user_suggest").show();
                    that.list_user_searched = [];
                    $(".no-data").hide();
                    $(".arrow-up").show();
                    $("#ico-clear").hide();
                    $("#ico-search").show()
                }
            }, 300);
        },
        get_total_children_weight: function (children_weight_object) {
            var result = 1;
            if (children_weight_object && children_weight_object.children_data.children_weights.length > 0) {
                result = children_weight_object.children_data.children_weights.reduce(function (prevVal, elm) {
                    return prevVal + parseFloat(elm.weight);
                }, 0)
            }
            return result;
        },
        toggle_adjusting_estimation: function () {
            var self = this;
            // self.$set('adjusting_kpi.enable_estimation', !self.adjusting_kpi.enable_estimation)
            self.$set(self.$data, 'adjusting_kpi.enable_estimation', !self.adjusting_kpi.enable_estimation)
            if (self.adjusting_kpi.enable_estimation === true) {
                $('#adjuster-estimation').slideDown();
            }
            else {
                $('#adjuster-estimation').slideUp();
            }
            self.update_adjusting_chart();
        },
        get_adjusting_key: function () {
            var self = this;
            if (self.adjusting_kpi.adjusting_month === 'quarter') {
                console.log('quarter')
                return 'quarter';
            }
            else {
                console.log('month_' + self.adjusting_kpi.adjusting_month)
                return 'month_' + self.adjusting_kpi.adjusting_month;
            }

        },
        // Calculate for adjusting_kpi object, calculate by month
        calculate_score_with_level: function (_result = null) {
            var self = this;
            var _month = self.adjusting_kpi.adjusting_month; // get month
            var _target = 0;
            _target = parseFloat(self.adjusting_kpi['month_' + _month + '_target']); // get target
            if (_month === 'quarter') {
                _target = parseFloat(self.adjusting_kpi['target']);
            }
            console.log(_result)
            if (_result === null) { // calculate fof default values

                _result = parseFloat(self.adjusting_kpi['month_' + _month]);
                if (_month === 'quarter') {
                    _result = parseFloat(self.adjusting_kpi['real']);

                }

            } // get result}


            var _min = 0;
            var _max = 0;
            var _max_score = parseFloat(self.organization.max_score);
            var _operator = self.adjusting_kpi.operator;

            if (_operator === '>=') {
                console.log(calculate_with_operator_greater())
                console.log(_result)
                _min = parseFloat(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].bottom); // get min target
                _max = parseFloat(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].top); // get max target
                var score = calculate_with_operator_greater();
                if (score < 0) return (0.0).toFixed(2);
                return score;

            }
            if (_operator === '<=') {
                _min = parseFloat(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].top); // get min target
                _max = parseFloat(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].bottom); // get max target
                var score = calculate_with_operator_less();
                if (score < 0) return (0.0).toFixed(2);
                return score;
            }

            function calculate_with_operator_greater() {
                var score = (0.0).toFixed(2);

                if (_result < _min) {
                    return (0.0).toFixed(2); // zero if less than min
                }
                if (_result <= _target && _result >= _min) {
                    score = ((_result / _target) * 100).toFixed(2); // follow with function in document
                    return score;
                }
                if (_result >= _target && _result < _max) {
                    score = (
                        (_result - _target) / (_max - _target) * (_max_score - 100) + 100 // follow with function in document
                    ).toFixed(2);
                    return score;
                }
                if (_result >= _max) {
                    return _max_score.toFixed(2); // max score gained if greater than max
                }
            }

            function calculate_with_operator_less() {
                var score = (0.0).toFixed(2);


                if (_result <= _min) {
                    return _max_score.toFixed(2); // max score gained if less than or equal to min
                }
                if (_result > _min && _result <= _target) {
                    score = (
                        (_result - _min) / (_target - _min) * (100 - _max_score) + _max_score // follow with function in document
                    ).toFixed(2);
                    return score;
                }
                if (_result >= _target && _result <= _max) {
                    score = (
                        (2 - _result / _target) * 100  // follow with function in document
                    ).toFixed(2);
                    return score;
                }
                if (_result > _max) {
                    return (0.0).toFixed(2); // zero if greater than max
                }
            }
        },
        fetch_chart_data: function () {
            var self = this;
            var data = [];
            if (self.adjusting_kpi.operator === '>=') {
                data = [
                    {
                        x: self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].bottom,
                        y: self.calculate_score_with_level(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].bottom)
                    }, {
                        x: self.adjusting_kpi.adjusting_month === 'quarter' ? self.adjusting_kpi['target'] : self.adjusting_kpi['month_' + self.adjusting_kpi.adjusting_month + '_target'],
                        y: 100
                    }, {
                        x: self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].top,
                        y: self.organization.max_score
                    }]
            }
            else if (self.adjusting_kpi.operator === '<=') {
                data = [
                    {
                        x: self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].top,
                        y: self.organization.max_score

                    }, {
                        x: self.adjusting_kpi.adjusting_month === 'quarter' ? self.adjusting_kpi['target'] : self.adjusting_kpi['month_' + self.adjusting_kpi.adjusting_month + '_target'],
                        y: 100
                    }, {
                        x: self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].bottom,
                        y: self.calculate_score_with_level(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()].bottom)
                    }]
            }
            return data;

        },
        resetErrorWhenShow: function() {
            $('#error-input-1').css('display','none');
            $('#error-input-2').css('display','none');
            $('#error-input-3').css('display','none');
            $('#error-input-4').css('display','none');
        },
        check_number: function(e){
            var charCode = e.which || e.keyCode; //It will work in chrome and firefox.
            var _number = String.fromCharCode(charCode);
            if (e.key !== undefined && e.charCode === 0) {
                // FireFox key Del - Supr - Up - Down - Left - Right
                return;
            }
            if ('0123456789.'.indexOf(_number) !== -1) {
                return _number;
            }
            e.preventDefault();
            return false;
        },
        update_adjusting_chart: function () {
            var self = this;
            console.log('triggered')
            console.log(self.adjusting_kpi.achievement_calculation_method_extra[self.get_adjusting_key()])
            if (self.adjusting_chart === null) {
                self.init_adjusting_chart();
            }
            var data = self.fetch_chart_data();

            self.adjusting_chart.data.datasets[1].data = data; // update performance chart
            if (self.adjusting_kpi.enable_estimation) {
                self.adjusting_chart.data.datasets[0].data = [
                    {
                        x: self.estimated_result_with_threshold,
                        y: self.calculate_score_with_level(self.estimated_result_with_threshold)
                    }
                ]; // update estimated result chart
            } else { // remove if false
                self.adjusting_chart.data.datasets[0].data = [];
            }
            self.adjusting_chart.update()
        },
        init_adjusting_chart: function () {
            var self = this;
            var element_chart = $('#performance-adjusting-chart');
            var data = self.fetch_chart_data();
            var chart = new Chart(element_chart, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: gettext('Esimated result'), // Estimated result chart, index = 0
                            data: [],
                            fill: true,
                            showLine: false,
                            lineTension: 0,
                            borderDashOffset: false,
                            backgroundColor: [
                                'rgba(182, 52, 52,1)'
                            ],
                            borderColor: [
                                'rgba(182, 52, 52,1)'
                            ],
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'red'
                        },
                        {
                            label: gettext("Performance"), // Performance chart, index = 1
                            data: data,
                            fill: true,
                            showLine: true,
                            lineTension: 0,
                            borderDashOffset: false,
                            backgroundColor: [
                                'rgba(51, 122, 183, 0.15)'
                            ],
                            borderColor: [
                                'rgba(51, 122, 183, 1.0)'
                            ],
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'red'
                        },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                                color: "rgba(51, 122, 183, 0.6)",
                            },
                            ticks: {
                                stepSize: 20,
                                beginAtZero: true,
                                display: false

                            },
                            scaleLabel: {
                                display: true,
                                labelString: gettext("Result")
                            },

                        }],
                        yAxes: [{
                            gridLines: {
                                display: false,
                                color: "rgba(51, 122, 183, 0.15)",
                            },
                            ticks: {
                                stepSize: 150,
                                beginAtZero: true,
                                display: false
                            },
                            scaleLabel: {
                                display: true,
                                labelString: gettext("Performance"),
                            }
                        }]
                    }
                }
            });
            self.adjusting_chart = chart;

        },
        confirm_adjust: function (elm) {
            var self = this;
            cloudjetRequest.ajax({
                type: 'post',
                url: '/api/kpi/services/',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: self.adjusting_kpi.id,
                    achievement_calculation_method: self.adjusting_kpi.achievement_calculation_method,
                    achievement_calculation_method_extra: self.adjusting_kpi.achievement_calculation_method_extra,
                    command: 'update_kpi_threshold'
                }),
                success: function (res) {
                    var enable_edit = self.kpi_list[self.adjusting_kpi.id].enable_edit;
                    var enable_review = self.kpi_list[self.adjusting_kpi.id].enable_review;
                    var enable_delete = self.kpi_list[self.adjusting_kpi.id].enable_delete;

                    res.enable_edit = enable_edit;
                    res.enable_review = enable_review;
                    res.enable_delete = enable_delete;
                    self.$set(self.$data, 'kpi_list[' + self.adjusting_kpi.id + ']', res);
                    self.reset_adjust();


                },
                error: function (res) {
                }
            });
        },
        reset_adjust: function () {
            var self = this;
            self.adjusting_kpi = {};
            // Reset to month 1

        },
        init_adjust: function (kpi_id) {
            var self = this;
            // Clone to temp object
            self.adjusting_kpi = Object.assign({}, self.kpi_list[kpi_id]);
            // Setup adjusting month to regenerate chart

            $.extend(true, self.adjusting_kpi, {
                adjusting_month: 1,
                enable_estimation: false,
                estimated_result: 0
            })

            if (self.adjusting_kpi.achievement_calculation_method_extra === null) {

                self.$set(self.adjusting_kpi, 'achievement_calculation_method_extra', Object.assign({}, {
                    month_1: {
                        top: '',
                        bottom: ''
                    },
                    month_2: {
                        top: '',
                        bottom: ''
                    },
                    month_3: {
                        top: '',
                        bottom: ''
                    },
                    quarter: {
                        top: '',
                        bottom: ''
                    }
                }))
            } else {
                try {
                    self.adjusting_kpi.achievement_calculation_method_extra = JSON.parse(self.adjusting_kpi.achievement_calculation_method_extra);
                } catch (err) {

                }
            }

            // Default tab will be related to achievement_calculation_method
            var default_tab = 1;
            if (self.adjusting_kpi.achievement_calculation_method === 'topbottom') {
                default_tab = 2;
            }
            $('#performance-result-based .nav-pills li:nth-child(' + default_tab + ')').tab('show');
            $('#adjusting-dashboard .nav-tabs li:nth-child(' + self.adjusting_kpi.adjusting_month + ')').tab('show') // reset tab 1
            self.update_adjusting_chart();

        },
        adjust_performance_level: function (kpi_id) {
            var self = this;
            self.init_adjust(kpi_id);
            console.log(self.adjusting_kpi)
            $('#performance-level-adjust').modal();
            self.resetErrorWhenShow();
        },
        checkInput1: function (input_1,target) {
            var id = $('.row.col-sm-12.evaluate-chart').attr('id');
            if(input_1 >= target || input_1 < 0 ) {
                if( id == '<=')
                    $('#error-input-1').css('display','');
                else
                    $('#error-input-3').css('display','');
            }
            else {
                if( id == '<=')
                    $('#error-input-1').css('display','none');
                else
                    $('#error-input-3').css('display','none');
            }
        },
        check_paste: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        },
        checkInput3: function(input_3,target) {
            var id = $('.row.col-sm-12.evaluate-chart').attr('id');
            if(input_3 <= target ) {
                if( id == '<=')
                    $('#error-input-2').css('display','');
                else
                    $('#error-input-4').css('display','');
            }
            else {
                if( id == '<=')
                    $('#error-input-2').css('display','none');
                else
                    $('#error-input-4').css('display','none');
            }
        },
        triggerClickTab: function(current_tab,e){
            var self = this
            self.$set('adjusting_kpi.adjusting_month',current_tab);
            self.update_adjusting_chart();
            self.checkConditon(e);
        },
        checkConditionInput1: function() {
            var self = this
            var current_tab = $('.row.col-sm-12.evaluate-chart').find('.tab-pane.fade.in.active');
            var target = parseFloat(current_tab.find('#input-2').val());
            var input_1 =  parseFloat(current_tab.find('#input-1').val());
            self.checkInput1(input_1,target);
            self.update_adjusting_chart()
        },
        checkConditionInput3: function() {
            var self = this
            var current_tab = $('.row.col-sm-12.evaluate-chart').find('.tab-pane.fade.in.active');
            var target = parseFloat(current_tab.find('#input-2').val());
            var input_3 = parseFloat(current_tab.find('#input-3').val());
            self.checkInput3(input_3,target);
            self.update_adjusting_chart()
        },
        checkConditon: function (e) {
            var self = this
            $('#error-input-1').css('display','none');
            $('#error-input-2').css('display','none');
            $('#error-input-3').css('display','none');
            $('#error-input-4').css('display','none');
            var id = $(e).find('a').attr('href');
            var input_1 = parseFloat($(id).find('#input-1').val());
            var target = parseFloat($(id).find('#input-2').val());
            var input_3 = parseFloat($(id).find('#input-3').val());
            self.checkInput1(input_1,target);
            self.checkInput3(input_3,target);
        },
        formatTime: function (time) {
            if (COMMON.LanguageCode == 'en'){
                return moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
            return moment(time).format('HH:mm:ss DD/MM/YYYY');
        },

        get_company_performance: function (company_params) {
            if (company_params.ceo_id == null) {
                return false
            }
            var that = this
            //var ceo_id ='';
            var quarter_id = getUrlVars()['quarter_id'];
            var url = '/api/user_kpi/' + company_params.ceo_id + '/';
            if (quarter_id) {
                url += '?quarter_id=' + quarter_id;
            }
            cloudjetRequest.ajax({
                type: 'get',
                url: url,
                contentType: 'application/json',
                success: function (res) {
                    that.$set(that.company_params, 'performance', res)
                    // that.$set(that.$data, 'company_params.performance', res)
                },
                error: function (res) {
                }
            });
        },
        fetch_current_user_profile: function () {
            var that = this;
            cloudjetRequest.ajax({
                type: 'GET',
                url: '/api/v2/profile/' + that.user_id,
                success: function (res) {
                    that.$set(that.$data,  'current_user_profile', res);
                    // migration note: current_user_profile will flow down to the child
                    // https://vuejs.org/v2/guide/components-props.html#One-Way-Data-Flow
                    // that.$broadcast('fetch_user_profile_from_parent') // passed to bonus component by props
                    that.get_backups_list();

                }
            });
        },
        fetch_exscore_lib: function () {
            var that = this;
            cloudjetRequest.ajax({
                type: 'GET',
                url: '/api/v2/exscore/lib/',
                success: function (data) {
                    // alert('fetch_exscore_lib successful!');
                    that.$set(that, 'exscore_lib_data', data);
                    that.$children.map(function (elem, index, children) {
                        elem.$emit('fetch_exscore_lib')
                    })
                }

            })
        },
        fetch_exscore: function () {
            var that = this;
            cloudjetRequest.ajax({
                type: 'GET',
                url: '/api/v2/exscore/',
                data: {
                    user_id: that.user_id,
                },
                success: function (data) {
                    that.$set(that, 'exscore_user_data', data);
                    that.$children.map(function (elem, index, children) {
                        elem.$emit('fetch_exscore')
                    })
                }
            });

        },
        get_weight_bygroup: function (group) {
            return this.total_weight_bygroup[group];
        },

        get_url_order_quarter: function (id) {
            if (window.location.href.search('/emp/') != -1) {
                if (id == that.current_quarter.id) {
                    return COMMON.LinkDashBoard + 'emp/' + that.user_id + '/';
                }
                return COMMON.LinkDashBoard + 'emp/' + that.user_id + '/' + '?quarter_id=' + id;
            } else {
                if (id == that.current_quarter.id) {
                    return COMMON.LinkDashBoard;
                }
                return COMMON.LinkDashBoard + '?quarter_id=' + id;
            }
        },
        get_time: function (date, format) {
            var dateParts = date.split("-");
            if (dateParts.length != 3)
                return null;
            var year = dateParts[0];
            var month = dateParts[1];
            var day = dateParts[2];
            var date_c = new Date(year, month, day);
            switch (format) {
                case 'm':
                    return gettext('Month') + ' ' + date_c.getMonth();
                    break;
                case 'd':
                    return gettext('Day') + ' ' + date_c.getDate();
                    break;
                case 'y':
                    return gettext('Year') + ' ' + date_c.getFullYear();
                    break;
                case 'dmy':
                    return gettext('Day') + ' ' + date_c.getDate() + ' ' + gettext('Month') + ' ' + date_c.getMonth() + ' ' + gettext('Year') + ' ' + date_c.getFullYear();
                    break;
                default:
                    return '';
                    break;
            }
        },
        calculate_total_weight_edit_by_group: function(category){
            var total = 0;
            var kpis = Object.values(this.parentKPIs).filter(function (kpi) {
                return kpi.bsc_category == category;
            })
            kpis.forEach(function (kpi) {
                total += parseFloat(kpi.new_weight) || 0;
            })
            return total;
        },
        calculate_total_weight: function () {
            var that = this;

            var calculate__total_current_weight= function(){
                that.total_weight_by_user = {};
                that.total_weight_bygroup = {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0};
                that.total_kpis_bygroup = {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0};

                var current = 0;
                Object.keys(that.parentKPIs).forEach(function (key) {
                    var kpi = that.parentKPIs[key];

                    if (that.total_weight_by_user[kpi.user] != undefined) {
                        current = parseFloat(that.total_weight_by_user[kpi.user]);
                    }

                    that.total_weight_by_user[kpi.user] = parseFloat(current) + parseFloat(kpi.weight);

                    Object.keys(that.total_weight_bygroup).forEach(function (key) {
                        if (key == kpi.group) {
                            that.total_weight_bygroup[key] += parseFloat(kpi.weight);
                            that.total_kpis_bygroup[key] += 1;
                        }
                    })

                });
            };
            var calculate__total_old_weight = function () {

                that.total_old_weight = {};
                that.total_old_weight_bygroup = {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0};
                that.total_old_kpis_bygroup = {'A': 0, 'B': 0, 'C': 0, 'O': 0, 'G': 0};

                var current = 0;
                Object.keys(that.parentKPIs).forEach(function (key) {
                    var kpi = that.parentKPIs[key];

                    if (that.total_old_weight_by_user[kpi.user] != undefined) {
                        current = parseFloat(that.total_old_weight_by_user[kpi.user]);
                    }
                    that.total_old_weight_by_user[kpi.user] = parseFloat(current) + parseFloat(kpi.old_weight);

                    Object.keys(that.total_old_weight_bygroup).forEach(function (gkey) {
                        if (gkey == kpi.group) {
                            that.total_old_weight_bygroup[gkey] += parseFloat(kpi.old_weight);
                            that.total_old_kpis_bygroup[gkey] += 1;
                        }
                    });


                });
            };

            var calculate__total_current_weight_by_category = function(){

                that.total_edit_weight = {'financial':0,'financial_ratio':0,'financial_total':0,
                    'customer':0,'customer_ratio':0,'customer_total':0,
                    'internal':0,'internal_ratio':0,'internal_total':0,
                    'learninggrowth':0,'learninggrowth_ratio':0,'learninggrowth_total':0,
                    'other':0,'other_ratio':0,'other_total':0};

                Object.keys(that.parentKPIs).forEach(function (key) {
                    var kpi = that.parentKPIs[key];


                    if (kpi.bsc_category == 'financial'){
                        var weight_percent = parseFloat(kpi.weight*100/that.total_weight_by_user[kpi.user]).toFixed(1);
                        that.total_edit_weight.financial_ratio += parseFloat(weight_percent);

                        that.total_edit_weight.financial += parseFloat(kpi.weight);
                        that.total_edit_weight.financial_total += 1;

                        return;
                    }
                    else if (kpi.bsc_category == 'customer'){
                        var weight_percent = parseFloat(kpi.weight*100/that.total_weight_by_user[kpi.user]).toFixed(1);
                        that.total_edit_weight.customer_ratio += parseFloat(weight_percent);

                        that.total_edit_weight.customer += parseFloat(kpi.weight);
                        that.total_edit_weight.customer_total += 1;

                        return;
                    }
                    else if (kpi.bsc_category == 'internal'){
                        var weight_percent = parseFloat(kpi.weight*100/that.total_weight_by_user[kpi.user]).toFixed(1);
                        that.total_edit_weight.internal_ratio += parseFloat(weight_percent);

                        that.total_edit_weight.internal += parseFloat(kpi.weight);
                        that.total_edit_weight.internal_total += 1;

                        return;
                    }
                    else if (kpi.bsc_category == 'learninggrowth'){
                        var weight_percent = parseFloat(kpi.weight*100/that.total_weight_by_user[kpi.user]).toFixed(1);
                        that.total_edit_weight.learninggrowth_ratio += parseFloat(weight_percent);

                        that.total_edit_weight.learninggrowth += parseFloat(kpi.weight);
                        that.total_edit_weight.learninggrowth_total += 1;

                        return;
                    }
                    else if (kpi.bsc_category == 'other'){
                        var weight_percent = parseFloat(kpi.weight*100/that.total_weight_by_user[kpi.user]).toFixed(1);
                        that.total_edit_weight.other_ratio += parseFloat(weight_percent);

                        that.total_edit_weight.other += parseFloat(kpi.weight);
                        that.total_edit_weight.other_total += 1;

                        return;
                    }


                });
            };

            calculate__total_current_weight();
            calculate__total_current_weight_by_category ();
            calculate__total_old_weight();

        },
        // Ko xài
        // change_weight: function(kpi){
        //     var that = this;
        //     if(kpi.weight<=0){
        //         swal({
        //             type: 'error',
        //             title: gettext("Unsuccess"),
        //             text: gettext("Please deactive this KPI before you change KPI's weight to 0"),
        //             showConfirmButton: true,
        //             timer: 5000,
        //         })
        //         that.kpi_list[kpi.id].weight = that.cache_weight;
        //         return false;
        //     }
        //     this.calculate_total_weight();
        // },
        // catch_change_weight: function(kpi_id, kpi_weight){
        //     // Push kpi changed
        //     var kpis = {'kpi_id':kpi_id, 'weight':kpi_weight};
        //     var that = this;
        //     that.cache_weight = kpi_weight;
        //     that.kpi_list_cache.push(kpis);
        // },
        resume_weight: function () {
            var that = this;
            that.status_error = false;
            console.log("Triggered resume weight")
            Object.keys(that.kpi_list).forEach(function (key) {
                that.kpi_list[key].weight = that.kpi_list[key].old_weight;
            });
            that.$set(that, 'kpi_list',Object.assign({}, that.kpi_list));
        },
        update_kpi_default_real: function (kpi, show_blocking_modal) {
            var data = {};
            data['default_real'] = kpi.default_real;
            data['kpi_id'] = kpi.id;


            cloudjetRequest.ajax({
                url: COMMON.LinkKPICommand,
                type: 'post',
                data: JSON.stringify(data),
                success: function (data) {
                    $('#kpi_reload' + kpi.id).click();
                },
                error: function () {
                    alert('Update  Error');
                }
            });


        },
        // Ko xài
        // change_weight: function(kpi){
        //     var that = this;
        //     if(kpi.weight<=0){
        //
        //         swal({
        //             type: 'error',
        //             title: gettext("Unsuccessful"),
        //             text: gettext('Please deactive this KPI before you change KPI\'s weight to 0'),
        //             showConfirmButton: true,
        //             timer: 5000
        //         });
        //
        //         that.kpi_list[kpi.id].weight = that.cache_weight;
        //         return false;
        //     }
        //     this.calculate_total_weight();
        // },

        show_unique_code_modal: function (kpi_id) {
            var kpi=this.kpi_list[kpi_id];
            var that =  this;
            if (!kpi.unique_code){
                kpi.unique_code = kpi.id + "_" + slugify(kpi.name).substring(0,10);
                that.update_kpi(kpi);

            }

            this.current_kpi = kpi;

            this.unique_code_cache = kpi.unique_code;
            $('#kpi-uniquecode').modal();
        },
        // update_group_name: function (kpi) {
        //     //$('.group-header-kpi-name' + kpi.id).text(kpi.refer_group_name);
        // },
        update_kpi: function (kpi, show_blocking_modal, callback) {
            var show_blocking_modal = (typeof show_blocking_modal !== 'undefined') ? show_blocking_modal : false;

            if (show_blocking_modal) {
                //cwaitingDialog.show('{% trans 'Loading!' %}', {dialogSize: 'sm', progressType: 'warning'});
            }
            if (kpi.weight <= 0) { // in case, user inputs 0.01
                swal({
                    type: 'error',
                    title: gettext("Unsuccessful"),
                    text: gettext('Please deactive this KPI before you change KPI\'s weight to 0'),
                    showConfirmButton: true,
                    timer: 5000,
                })
                this.kpi_list[kpi.id].weight = this.cache_weight;
                return false;
            }
            //    Pace.start();
            this.calculate_total_weight();
            var that = this;
            data = {};
            data['id'] = kpi.id;
            data['name'] = kpi.name;
            data['weight'] = kpi.weight;
            data['group'] = kpi.group;
            data['bsc_category'] = kpi.bsc_category;
            data['reviewer_email'] = kpi.reviewer_email;
            data['unique_code'] = kpi.unique_code;
//                data['refer_group_name'] = kpi.name; // do not update refer_group_name here, must be processed automatically
            cloudjetRequest.ajax({
                type: "POST",
                url: COMMON.LinkKPIAPI,
                data: JSON.stringify(data),
                success: function (data) {
                    console.log("success");
                    that.get_current_employee_performance();
                    var update_kpi = Object.assign(that.kpi_list[kpi.id], data);
                    // Trigger change when kpi updated (create new update_kpi instance to trigger get group and re-render)
                    that.$set(that.kpi_list, kpi.id, JSON.parse(JSON.stringify(update_kpi)));

                    // that.getListGroupV2()
                    //$('.group-header-kpi-name' + kpi.id).text(kpi.refer_group_name);
                    if (typeof callback == "function") {
                        callback(0);
                    }
                },
                error: function (obj) {
                    if (callback) {
                        callback(1);
                    }
                }
            });
        },
        check_is_valid: function (kpi_id) {
            that = this;
            var result = true;
            var kpi_deplay = that.kpi_list[kpi_id];
            var list_kpi_update = [];
            Object.keys(that.kpi_list).forEach(function (key) {

                if (!that.isNumber(that.kpi_list[key].weight)) {
                    result = false;
                    return;
                }

            });

            return result;
        },
        get_root_kpi_wrapper: function (kpi_id) {
            var hidden_input = $("#kpi-wrapper-" + kpi_id);
            $ancestors = $(hidden_input).parentsUntil('.kpi-group-category', '.kpi-parent-wrapper').last().find("div[id*='kpi-wrapper-']").first();
            if ($ancestors.length > 0) {
                return $($ancestors);
            } else {
                return hidden_input;
            }
        },
        get_top_level_parent_kpi_id:function(kpi_id){
            var parent_kpi=this.kpi_list[kpi_id];
            while (parent_kpi.refer_to && this.kpi_list[parent_kpi.refer_to]){
                parent_kpi=this.kpi_list[parent_kpi.refer_to];
            }
            return parent_kpi.id;

        },
        update_kpis: function (kpi_id) {
            var that = this;
            that.status_error = false;
            var kpi_deplay = that.kpi_list[kpi_id];
            var list_kpi_update = [];
            Object.keys(that.kpi_list).forEach(function (key) {
                if (that.kpi_list[key].refer_to == kpi_deplay.refer_to && that.kpi_list[key].old_weight != that.kpi_list[key].weight) {
                    list_kpi_update.push(that.kpi_list[key]);
                }
            });

            var list_data = [];
            list_kpi_update.forEach(function (kpi) {
                var data = {};
                data['id'] = kpi.id;
                data['name'] = kpi.name;
                data['weight'] = kpi.weight;
                data['group'] = kpi.group;
                data['bsc_category'] = kpi.bsc_category;
                data['reviewer_email'] = kpi.reviewer_email;
                data['unique_code'] = kpi.unique_code;
                list_data.push(data);
            });
            if (list_data.length > 0) {
                cloudjetRequest.ajax({
                    url: COMMON.LinkKPIAPI,
                    data: JSON.stringify({type: 'multi', data: list_data}),
                    type: 'POST',
                    success: function (res) {
                        that.get_current_employee_performance();
                        $ancestors = that.get_root_kpi_wrapper(kpi_id);
                        // close modal and alter message success
                        $('#modalReason').modal('hide');
                        //update new old_weight value
                        list_kpi_update.forEach(function (item) {
                            that.kpi_list[item.id].old_weight = item.weight;
                        });

                        var t = that.kpi_list;
                        that.$set(that, 'kpi_list', '');
                        that.$set(that, 'kpi_list', t);
                        setTimeout(function () {
                            swal({
                                type: 'success',
                                title: gettext("Delay KPI success"),
                                showConfirmButton: false,
                                timer: 3000
                            })
                        }, 1000)
                    },
                    error: function (a, b, c) {
                        // co loi xay ra
                        if (a.responseJSON != undefined && a.responseJSON.length > 0) {
                            that.status_error = true;
                            that.message_error = '';
                            a.responseJSON.forEach(function (kpi) {
                                that.message_error += kpi.id + " " + kpi.name + ": " + gettext('Is error') + "<br/>";
                            });
                        }
                    }
                });
            } else {
                // close modal and alter message success
                $('#modalReason').modal('hide');
                setTimeout(function () {
                    swal({
                        type: 'success',
                        title: gettext("Delay KPI success"),
                        showConfirmButton: false,
                        timer: 3000
                    })
                }, 1000);

                // $ancestors = that.get_root_kpi_wrapper(kpi_id);
                // if ($ancestors.length > 0) {
                //     $($ancestors).reload_kpi_anchor();
                // } else {
                //     $(elm).reload_kpi_anchor();
                // }
                that.reload_kpi(kpi_id);

            }
        },
        toggle_review_kpi: function(kpi){
            // alert(kpi);
            $('.reviewing'+ kpi.id ).toggleClass('hide');
        },


        showModal_e: function (month_number, kpi_id) {
            var that = this;
            console.log("KPI ID:" + kpi_id);
            var month_name = month_number == 1 ? v.month_1_name : month_number == 2 ? v.month_2_name : month_number == 3 ? v.month_3_name : '';
            this.month_name = month_name;
            this.month = month_number;
            this.disable_upload = this.check_disable_upload_evidence(this.kpi_list[kpi_id]);
            that.$set(that.$data, 'evidence_id', kpi_id);
            cloudjetRequest.ajax({
                url: '/api/v2/kpi/' + kpi_id + '/evidence/upload/',
                type: 'get',
                data: {
                    type: "json",
                    kpi_id: kpi_id,
                    month: month_number,
                },
                success: function (response) {
                    that.$set(that.$data, 'list_evidence', response);
                    console.log("stopped here");
                    if (that.list_evidence.length > 0) {
                        that.list_evidence.forEach(function (el, index) {
                            cloudjetRequest.ajax({
                                url: '/api/v2/profile/' + el.user + '/',
                                type: 'get',
                                success: function (data) {
                                    var key1 = 'avatar';
                                    var key2 = 'actor';
                                    // that.$set(that.$data, 'list_evidence[' + index + '].avatar', data.get_avatar);
                                    // that.$set(that.$data, 'list_evidence[' + index + '].avatar', data.get_avatar);
                                    that.$set(that.list_evidence[index], 'avatar', data.get_avatar);
                                    that.$set(that.list_evidence[index], 'actor', data.display_name);
                                    console.log('new evidence:' + that.list_evidence[index].avatar);

                                }
                            })
                        });
                    }
                    console.log('passed here');

                },
                error: function () {
                    alert("error");
                },
            }).done(function () {
                console.log('DONE!!!!!');
                $('#evidence-modal').modal('show');
                console.log(that.list_evidence)
                console.log("shown!")
            });

        },

        showModal_kpi_action_plan: function(){
            var that = this;
            // alert('hello guys');
            cloudjetRequest.ajax({
                url: COMMON.LinkActionPlan,
                type: 'get',
                data: {
                    type: "json",
                    // kpi_id: kpi_id,
                    // month: month_number,
                },
                success: function (response) {
                    // that.$set(that.$data, 'list_action_plan_file', response.data);
                    that.list_action_plan_file = response.data;
                    // that.$set(that.$data, 'user_action_plan_permission', response.permission);
                    that.user_action_plan_permission=response.permission;


                    // if (that.list_action_plan_file.length > 0) {
                    //     that.list_action_plan_file.forEach(function (el, index) {
                    //         cloudjetRequest.ajax({
                    //             url: '/api/v2/profile/' + el.user + '/',
                    //             type: 'get',
                    //             success: function (data) {
                    //                 var key1 = 'avatar';
                    //                 var key2 = 'actor';
                    //                 // that.$set(that.$data, 'list_action_plan_file[' + index + '].avatar', data.get_avatar);
                    //                 // that.$set(that.$data, 'list_action_plan_file[' + index + '].actor', data.display_name);
                    //                 console.log('new action plan:' + that.list_action_plan_file[index].avatar);
                    //
                    //             }
                    //         })
                    //     });
                    // }

                },
                error: function () {
                    // alert("error");
                },
            }).done(function () {
                console.log('DONE!!!!!');
                $('#kpi_action_plan-modal').modal('show');
                console.log(that.list_action_plan_file)
                console.log("shown!")
            });


            // $('#kpi_action_plan-modal').modal('show');

        },

        check_disable_upload_evidence: function (kpi) {
            if (this.month == 1 && this.organization.enable_month_1_review == true && kpi.enable_review){
                return false;
            }
            if (this.month == 2 && this.organization.enable_month_2_review == true && kpi.enable_review){
                return false;
            }
            if (this.month == 3 && this.organization.enable_month_3_review == true && kpi.enable_review){
                return false;
            }
            return true;


        },
        // moved to kpi-row component
        // check_disable_edit: function (kpi) {
        //     // Document permission edit quarter target & kpi target
        //     // https://cloudjet.atlassian.net/wiki/spaces/PM/pages/454328403
        //     var that = this;
        //     // Admin allow edit
        //     if (this.is_user_system){
        //         return true;
        //     }
        //
        //     // Disable when the organization didn't allow to edit month target
        //     if (!that.organization.allow_edit_monthly_target){
        //         return false;
        //     }
        //
        //     // Enable when the kpi allows to edit
        //     if (kpi.enable_edit) {
        //         return true;
        //     }
        //
        //     // Otherwise disabled
        //     return false
        // },


        showPreview: function (file_url) {
            if (window.location.protocol == 'https:' && file_url.match('^http://'))
                file_url = file_url.replace("http://", "https://");
            var patt1 = /\.[0-9a-z]+$/i;
            this.preview_attach_url = file_url;
            var file_ext = file_url.match(patt1);
            console.log(file_ext);

            if (['.png', '.jpg', '.bmp', '.gif', '.jpeg', '.pdf', '.odf'].indexOf(file_ext[0].toLowerCase()) < 0) {
                window.open(file_url, 'Download');
            }
            else {
                if (['.pdf', '.odf'].indexOf(file_ext[0]) >= 0) {
                    this.is_img = false;
                    this.preview_attach_url = COMMON.StaticUrl + 'ViewerJS/index.html#' + file_url;
                }
                else {
                    this.is_img = true;
                }
                this.preview_attach_modal_type='evidence';
                $('#evidence-modal').modal('hide');
                $('#preview-attach-modal').modal('show');

            }
        },


        showPreview_action_plan: function (file_url) {
            if (window.location.protocol == 'https:' && file_url.match('^http://'))
                file_url = file_url.replace("http://", "https://");
            var patt1 = /\.[0-9a-z]+$/i;
            this.preview_attach_url = file_url;
            var file_ext = file_url.match(patt1);
            console.log(file_ext);

            if (['.png', '.jpg', '.bmp', '.gif', '.jpeg', '.pdf', '.odf'].indexOf(file_ext[0]) < 0) {
                window.open(file_url, 'Download');
            }
            else {
                if (['.pdf', '.odf'].indexOf(file_ext[0]) >= 0) {
                    this.is_img = false;
                    this.preview_attach_url = COMMON.StaticUrl + 'ViewerJS/index.html#' + file_url;
                }
                else {
                    this.is_img = true;
                }
                this.preview_attach_modal_type='action_plan'
                $('#kpi_action_plan-modal').modal('hide');
                $('#preview-attach-modal').modal('show');

            }
        },
        post_kpi_action_plan:function () {
            var formData = new FormData();
            var that = this;

            formData.append('content', $("#board-upload-action-plan .action-plan-descr").val().replace("\r\n", "<br/>"));
            formData.append('attachment', $("#file-upload-action-plan-input")[0].files[0]);

            if ($("#file-upload-action-plan-input")[0].files[0]) {
                cloudjetRequest.ajax({
                    url: COMMON.LinkActionPlan,
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        console.log(response);
                        var mesage = gettext("Post action plan successfully!");
                        alert(mesage);
                        // The unshift() method adds new items to the beginning of an array, and returns the new length.
                        that.list_action_plan_file.unshift(response);
                        // that.list_action_plan_file[0].avatar = COMMON.UserAvatar;
                        that.list_action_plan_file[0].actor = COMMON.UserDisplayName;
                        // var tmp = that.evidences[that.evidence_id][that.month];
                        // that.$set(that.$data, 'evidences[' + that.evidence_id + '][' + that.month + ']', tmp + 1);
                        console.log(tmp);
                    },
                    error: function () {
                        // alert("error");
                    }
                }).done(function () {
                    // $('#save-evidence').attr('disabled', 'disabled');
                    $('#file-upload-action-plan-input').val('');
                    that.action_plan_filename = '';
                    $("#board-upload-action-plan .action-plan-descr").val('');
                    $('#kpi_action_plan-modal .form-start').show();
                });
            }
            else alert(gettext('Please select a file!'));
        },
        postEvidence: function () {
            var formData = new FormData();
            var that = this;
            console.log("KPI_ID POST:" + that.evidence_id);
            formData.append('content', $("#e-content").val().replace("\r\n", "<br/>"));
            formData.append('month', that.month);
            formData.append('attachment', $("#file-upload")[0].files[0]);
            if ($("#file-upload")[0].files[0]) {
                cloudjetRequest.ajax({
                    url: '/api/v2/kpi/' + that.evidence_id + '/evidence/upload/',
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        // The unshift() method adds new items to the beginning of an array, and returns the new length.
                        that.list_evidence.unshift(response);
                        that.list_evidence[0].avatar = COMMON.UserAvatar;
                        that.list_evidence[0].actor = COMMON.UserDisplayName;
                        var tmp = that.evidences[that.evidence_id][that.month];
                        that.$set(that.evidences[that.evidence_id], that.month, tmp + 1);
                        console.log(tmp);

                        if (that.evidences[that.evidence_id]==undefined){
                            that.evidences[that.evidence_id]={};
                        }
                        // that.evidences[kpi_id][month_number]=res;
                        that.evidences[that.evidence_id][that.month]=tmp + 1;
                        // that.$set(that.$data, 'evidences', that.evidences);
                        that.evidences = Object.assign({}, that.evidences)



                    },
                    error: function () {
                        alert("error");
                    }
                }).done(function () {
                    // $('#save-evidence').attr('disabled', 'disabled');
                    $('#file-upload').val('');
                    that.filename = '';
                    $('#e-content').val('');
                    $('.form-start').show();
                });
            }
            else alert(gettext('Please select a file!'));
        },
        show_Modal_delevi: function(index){
            var that = this;
            that.current_evidence = that.list_evidence[index];
            $('#evidence-modal').modal('hide');
            $('#confirm-delete-evidence').modal('show');
        },
        show_modal_delete_action_plan: function(index){
            var that = this;
            that.action_plan_to_be_deleted = that.list_action_plan_file[index];
            $('#kpi_action_plan-modal').modal('hide');
            $("#confirm-delete-action-plan-modal").modal('show');

        },


        deleteEvidence: function(id, kpi_id, month){
            var that = this;
            var current_evidence_count=that.evidences[kpi_id][month];
            cloudjetRequest.ajax({
                url: '/api/v2/kpi/' + kpi_id + '/evidence/upload/',
                type: 'delete',
                data: {
                    type: "json",
                    id: id,
                    month: month
                },
                success: function (response) {

                },
                error: function () {
                    // alert("error");
                    $("#confirm-delete-evidence").modal('hide');
                    $('#evidence-modal').modal('show');
                },
            }).done(function () {
                $("#confirm-delete-evidence").modal('hide');
                that.showModal_e(month,kpi_id);
                // that.get_evidence(month,kpi_id);
                setObj(that.evidences, kpi_id + '.' + month, current_evidence_count-1 );
                that.evidences=Object.assign({}, that.evidences);
            });
        },

        delete_action_plan: function(id){
            var that = this;
            cloudjetRequest.ajax({
                // url: '/api/v2/kpi/' + kpi_id + '/evidence/upload/',
                url: COMMON.LinkActionPlan,
                type: 'delete',
                data: {
                    type: "json",
                    id: id,
                },
                success: function (response) {

                },
                error: function () {
                    // alert("error");
                    $("#confirm-delete-action-plan-modal").modal('hide');
                    $('#kpi_action_plan-modal').modal('show');
                },
            }).done(function () {
                $("#confirm-delete-action-plan-modal").modal('hide');
                that.showModal_kpi_action_plan(); // fucking, this will be request to server again

            });
        },

        handleFile:function (e){
            $('.form-start').hide();
            var width = 1, that=this;
            var file = $('#file-upload')[0].files[0];
            var file_name = $('#file-upload')[0].files[0].name;
            this.filename = file_name;
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.docx|\.pdf|\.xls|\.xlsx|\.doc|\.bmp)$/i;
            if(!allowedExtensions.exec(file_name) || file.size/1024/1024 > 5) {
                that.status_upload_evidence = false;
                return false;
            }
            else{
                that.status_upload_evidence = true;
                var id = setInterval(frame, 10);
            }
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    $("#ico-circle-check").css('color','#7ed321');
                    $("#myBar").hide();
                    $("#title-loading").hide();
                    $("#e-content").show();
                    $("#btn-cancel-evi").show();
                    $("#btn-save-evi").show();

                } else {
                    width++;
                    $("#percentage").text(width+'%');
                    $("#myBar").css('width', width + '%');
                }
            }
        },

        // Done
        handleFile_action_plan:function (e){
            $('#kpi_action_plan-modal .form-start').hide();
            var width = 1;
            var file = $('#file-upload-action-plan-input')[0].files[0];
            var file_name = $('#file-upload-action-plan-input')[0].files[0].name;
            this.action_plan_filename = file_name;
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.docx|\.pdf|\.xls|\.xlsx|\.doc|\.bmp)$/i;
            if(!allowedExtensions.exec(file_name) || file.size/1024/1024 > 5) {
                that.status_upload_action_plan = false;
                return false;
            }
            else{
                that.status_upload_action_plan = true;
                var id = setInterval(frame, 10);
            }
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    $("#board-upload-action-plan .ico-circle-check").css('color','#7ed321');
                    $("#board-upload-action-plan .file-upload-progress-bar-wrapper .file-upload-progress-bar").hide();
                    $("#board-upload-action-plan .title-loading").hide();
                    $("#board-upload-action-plan .action-plan-descr").show();
                    $("#board-upload-action-plan .btn-start-over").show();
                    $("#board-upload-action-plan .btn-save-upload").show();

                } else {
                    width++;
                    $("#board-upload-action-plan .file-upload-percentage").text(width+'%');
                    $("#board-upload-action-plan .file-upload-progress-bar-wrapper .file-upload-progress-bar").css('width', width + '%');
                }
            }
        },

        get_current_quarter: function () {
            that = this;
            cloudjetRequest.ajax({
                type: 'get',
                async: false,
                url: COMMON.LinkQuarter + '?get_current_quarter=yes',
                success: function (data) {
                    that.month_1_name = data['month_1_name'];
                    that.month_2_name = data['month_2_name'];
                    that.month_3_name = data['month_3_name'];
                    // that.$set(that.$data, 'current_quarter', data['fields']);
                    // that.$set(that.current_quarter, data['fields']);
                    that.current_quarter = Object.assign({}, that.current_quarter, data['fields'])
                    // that.$set(that.$data, this.$data, 'current_quarter', data['fields']);
                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                    $('.add_kpi').show();
                }
            });
        },

        get_quarter_by_id: function () {
            that = this;
            var quarter_id = getUrlVars()['quarter_id'];
            if (quarter_id) {
                cloudjetRequest.ajax({
                    type: 'get',
                    url: COMMON.LinkQuarter + '?quarter_id=' + quarter_id,
                    success: function (data) {
                        that.$set(that.$data, 'quarter_by_id', data);
                        that.month_1_name = data['month_1_name'];
                        that.month_2_name = data['month_2_name'];
                        that.month_3_name = data['month_3_name'];
                    },
                    error: function () {
                        alert('error');
                    },
                    complete: function (data) {
                    }
                });
            } else {
                that.quarter_by_id = that.current_quarter;
            }
        },

        get_current_employee_performance: function () {
            this.get_employee_performance(COMMON.OrgUserId);
        },

        get_employee_performance: function (emp_id) {
            var that = this;
            var quarter_id = getUrlVars()['quarter_id'];
            var url = '/api/user_kpi/' + emp_id + '/';
            if (quarter_id) {
                url += '?quarter_id=' + quarter_id;
            }
            cloudjetRequest.ajax({
                type: 'get',
                url: url,
                success: function (res) {
                    // that.$set(that.$data,  'employee_performance', res);
                    that.employee_performance=res;
                    that.get_backups_list(true);
                    // console.log('jahskjfkjsdaasdh');
                    that.$children.map(function (elem, index, children_array) {
                        elem.$emit('fetch_exscore')
                    })
                },
                error: function (res) {
                }
            });
        },

        get_current_organization: function () {
            var that = this;
            cloudjetRequest.ajax({
                type: 'get',
                async: false,
                url: COMMON.LinkOrgAPI,
                success: function (data) {
                    that.$set(that.$data,  'organization', data);

                    console.log(that.organization)
                    that.check_status_msg_expired();
                },
                error: function () {
                    alert('error getting organization');
                },
                complete: function () {

                }
            });
        },
        update_current_organization: function () {
            that = this;
            console.log('update_current_organization');
            cloudjetRequest.ajax({
                url: COMMON.LinkOrgAPI,
                type: 'post',
                data: JSON.stringify(that.organization),
                success: function (data) {
                    that.$set(that.$data,  'organization', data);
                },
                error: function () {
                    alert('Update organization Error');
                }
            });
        },

        count_zero_score_kpi: function (recheck) {
            var user_id = COMMON.OrgUserId;

            var that = this;
            that.total_zero_score_kpis = [];
            var quarter_id = getUrlVars()['quarter_id'];
            var url = COMMON.LinkKPIParentAPI + '?user_id=' + user_id;
            url += (quarter_id != undefined) ? '&quarter_id=' + quarter_id : '';
            if (recheck == true) {
                url += "&recheck=true"
            }

            cloudjetRequest.ajax({
                url: url,
                type: 'post',
                success: function (results) {
                    results = results.filter(function (kpi){
                            return kpi.weight > 0;
                    });
//                         results = jQuery.grep(results, function(item){
//                            return (item.month_1_score ==0 || item.month_2_score ==0 || item.month_3_score==0 || item.latest_score==0)
//                         });
                    results.forEach(function (item) {
                        // var value_weight = $('.kpi-rating[data-id=' + item.id + ']').find('span.weighting_score>span').text();
                        // value_weight = parseFloat(value_weight.slice(1, -2));
                        // item.weight_percentage = value_weight;//use jquery to locate to weight percenatge in kpi-editor relative to kpi

                        // Update lai weight KPI
                        var value_weight = parseFloat(item.weight*100/that.total_weight_by_user[user_id]);
                        item.weight_percentage = value_weight;

                    })
                    that.$set(that.$data, 'total_zero_score_kpis', results);
                    if (recheck == true) {
                        location.reload();
                    }

                },
                error: function () {
                    alert('Load Kpis Error');
                }
            });

        },

        get_children: function (kpi_id) {
            // Pace.start();
            var self = this;
            cloudjetRequest.ajax({
                type: 'get',
                url: COMMON.LinkKPIAPI + '?kpi_id=' + kpi_id,
                success: function (data) {
                    $('#childrenKPIModal').modal();
                    self.$set(self.$data, 'current_kpi', data);
                    console.log(self.current_kpi)
                    self.$compile(self.$el)
                    //    that.$set(that.$data, 'children_kpis', data.children);
                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                    $('.add_kpi').show();
                }
            });

        },
        show_copy_kpi_modal: function (kpi_id) {
            //  not used any more
            that = this;
            $('#copy-kpi-modal').modal();


        },
        copy_kpi: function (kpi_id) {
            //  not used any more
            that = this;
            cloudjetRequest.ajax({
                type: 'get',
                url: COMMON.LinkKPIAPI + '?kpi_id=' + kpi_id,
                success: function (data) {
                    that.current_kpi=Object.assign({}, data);
                    // that.$set(that.$data, 'current_kpi', data);
                    // that.$compile(that.$el);
                    //    that.$set(that.$data, 'children_kpis', data.children);
                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                }
            });

        },
        change_category: function (kpi_id) {
            //     Pace.start();
            // alert('change_category');
            that = this;
            cloudjetRequest.ajax({
                type: 'get',
                url: COMMON.LinkKPIAPI + '?kpi_id=' + kpi_id,
                success: function (data) {
                    $('#categoryKPIModal').modal('show');
                    that.current_kpi=Object.assign({}, data);
                    // that.$set(that.$data, 'current_kpi', data);
                    // that.$compile(that.$el);
                },
                error: function () {
                    alert('error');
                },
                complete: function (data) {
                    $('.add_kpi').show();
                }
            });

        },

        change_group: function (kpi) {
            if (!kpi.enable_edit) {
                return false;
            }


            self = this;

            switch (kpi.group) {
                case "A":
                    kpi.group = "B";
                    self.kpi_list[kpi.id].group = kpi.group;
                    break;
                case "B":
                    kpi.group = "C";
                    self.kpi_list[kpi.id].group = kpi.group;
                    break;
                case "C":
                    kpi.group = "O";
                    self.kpi_list[kpi.id].group = kpi.group;
                    break;
                case "O":
                    kpi.group = "G";
                    self.kpi_list[kpi.id].group = kpi.group;
                    break;
                default:
                    kpi.group = "A";
                    self.kpi_list[kpi.id].group = kpi.group;
            }
            self.update_kpi(kpi);
        },
        update_quarter_target: function (kpi, callback = null) {
            var that = this;
            cloudjetRequest.ajax({
                type: "POST",
                url: `/api/v2/kpi/${kpi.id}/update-quarter-target/`,
                data: JSON.stringify(kpi),
                success: function (data) {
                    that.kpi_list[kpi.id] = Object.assign(that.kpi_list[kpi.id], data);

                    for (i = 1; i <= 4; i++) {
                        $('#qtip' + kpi.id + '_' + i).qtip({
                            content: {
                                text: $('#qtip' + kpi.id + '_' + i + ' input').val()
                            },
                            style: {
                                classes: 'qtip-green'
                            }
                        });
                    }

                    success_requestcenter(gettext("Update successful!"));
                },
                contentType: "application/json"
            });
            if (typeof callback === 'function') {
                callback();
            }
        },
        update_score_calculation_type: function (kpi, callback = null) {
            var that = this;
            cloudjetRequest.ajax({
                type: "POST",
                url: `/api/v2/kpi/${kpi.id}/update-score-calculation-type/`,
                data: JSON.stringify(kpi),
                success: function (data) {
                    that.kpi_list[kpi.id] = Object.assign(that.kpi_list[kpi.id], data);
                    that.get_current_employee_performance();

                    success_requestcenter(gettext("Update successful!"));
                },
                contentType: "application/json"
            });
            if (typeof callback === 'function') {
                callback();
            }
        },
        set_month_target_from_last_quarter_three_months_result: function (kpi_id, user_id, kpi_unique_key, last_quarter_id) {
            // Khang build this function
            //       Pace.start(); // Monitor ajax
            var that = this;
            var review_type = that.kpi_list[kpi_id].score_calculation_type; // Get review type
            if (review_type !== "most_recent") {
                sweetAlert(gettext("ACTION FAILED"), gettext("This feature is only use for most-recent score calculate type!"), "error");
                return false;
            }
            else {
                cloudjetRequest.ajax({
                    method: "GET",
                    url: "/api/v2/user/" + user_id + "/kpis",
                    data: {
                        unique_key: kpi_unique_key,
                        quarter_period_id: last_quarter_id
                    },
                    success: function (kpi_result_list) {
                        if (kpi_result_list.length) {
                            var kpi = kpi_result_list[0];
                            var month_1 = parseFloat(kpi['month_1']);
                            var month_2 = parseFloat(kpi['month_2']);
                            var month_3 = parseFloat(kpi['month_3']);
                            var new_target = null;
                            var kpi_object = that.kpi_list[kpi_id];// Clone to new object
                            if (isNaN(month_1) && isNaN(month_2) && isNaN(month_3)) {
                                sweetAlert(gettext("ACTION FAILED"), gettext("Score can't be updated because no score were founds!"), "error");
                                return false;
                            }
                            else {
                                var sum = ((!isNaN(month_1) ? month_1 : 0) + (!isNaN(month_2) ? month_2 : 0) + (!isNaN(month_3) ? month_3 : 0));
                                var divide = ((!isNaN(month_1) ? 1 : 0) + (!isNaN(month_2) ? 1 : 0) + (!isNaN(month_3) ? 1 : 0));
                                new_target = sum / divide;
                                kpi_object['month_1_target'] = kpi_object['month_2_target'] = kpi_object['month_3_target'] = new_target;

                                that.$set(that.$data, 'kpi_list[' + kpi_id + ']', kpi_object);
                                that.update_month_target(that.kpi_list[kpi_id]);
                                sweetAlert(gettext("ACTION COMPLETED"), gettext("The KPI is successfully updated"), "success");
                            }
                        }
                        else {
                            sweetAlert(gettext("ACTION FAILED"), gettext("Score can't be updated because no score were founds!"), "error");
                            return false;
                        }
                    },
                    error: function (err) {
                        sweetAlert(gettext("ACTION FAILED"), gettext("System Error: ") + err, "error");

                    },
                    complete: function (data) {

                    }
                });
            }

            // Ref:https://vuejs.org/v2/api/#vm-watch
        },
        update_month_target: function (kpi, check_disabled, callback = null) {
            if (!check_disabled) {
                var that = this;
                //  $('#loading-gif' + kpi.id).toggleClass('loading-gif');
                kpi.command = 'update_month_target';
                cloudjetRequest.ajax({
                    type: "POST",
                    url: COMMON.LinkKPISevices,
                    data: JSON.stringify(kpi),
                    success: function (data) {
                        //   console.log(data);
                        that.kpi_list[kpi.id] = Object.assign(that.kpi_list[kpi.id], data);

                        that.get_current_employee_performance();

                        success_requestcenter(gettext("Update successful!"));
                    },
                    error: function () {

                    },
                    contentType: "application/json"

                });

            } else {
                error_requestcenter("Error[403] " + gettext("You don't have permisson"));
            }
            if (typeof callback === 'function') {
                callback();
            }
        },
        copy_monthly_goal: function (kpi) {
            var that = this;
            swal({
                title: gettext("Quarter target will be copied to the target of each month"),
                text: gettext("Are you sure?"),
                type: "warning",
                showCancelButton: true,
                cancelButtonText: gettext("Cancel"),
                confirmButtonColor: "#DD6B55",
                confirmButtonText: gettext("OK"),
                closeOnConfirm: true
            }, function () {
                kpi.month_1_target = kpi.target;
                kpi.month_2_target = kpi.target;
                kpi.month_3_target = kpi.target;
                that.update_month_target(kpi);
            })
        },
        findRootKPI: function(kpi_id){
            return findRootKPI(kpi_id,this.kpi_list)
        },
        triggeredReloadTargetPerformance: function(child_id){
            var self = this;
            var root_id = self.findRootKPI(child_id)
            if (parseInt(child_id) !== root_id) {
                $('#kpi_reload' + root_id).click()
            }
        },
        update_score: function (kpi, update_quarter_target, callback = null) {
            //alert(kpi.id)
            //this.calculate_total_weight();
            var that = this;
            var okay_to_edit = kpi.enable_review && (!isNaN(kpi.month_1_target)) && (!isNaN(kpi.month_2_target)) && (!isNaN(kpi.month_3_target));

            if (!okay_to_edit) {
                guide_requestcenter(gettext("Not allowed to modify KPI, please check if any wrong data in KPI"));
            } else {

                if (update_quarter_target != undefined) {
                    kpi.update_quarter_target = update_quarter_target;
                }
                clearTimeout(this.update_timeout);

                //console.log('#loading-gif' + kpi.id)
//                $('#loading-gif' + kpi.id).toggleClass('loading-gif');


                // that.$set(that.kpi_list[kpi.id], 'month_1_target', kpi.month_1_target != '' ? kpi.month_1_target : kpi.get_target)
                // that.$set(that.kpi_list[kpi.id] , 'month_2_target', kpi.month_2_target != '' ? kpi.month_2_target : kpi.get_target)
                // that.$set(that.kpi_list[kpi.id], 'month_3_target', kpi.month_3_target != '' ? kpi.month_3_target : kpi.get_target)
                //
                // if (that.kpi_list[kpi.id].score_calculation_type == 'sum') {
                //     var month_1_target = kpi.month_1_target ? kpi.month_1_target : 0;
                //     var month_2_target = kpi.month_2_target ? kpi.month_2_target : 0;
                //     var month_3_target = kpi.month_3_target ? kpi.month_3_target : 0;
                //     that.$set(that.kpi_list[kpi.id], 'target', month_1_target + month_2_target + month_3_target)
                // }


                //console.log(that.kpi_list[kpi.id].month_2_target);

                this.update_timeout = setTimeout(function () {
                    cloudjetRequest.ajax({
                        type: "POST",
                        url: '/performance/kpi/update-score/',
                        data: kpi,
                        success: function (data) {
                            that.$set(that.kpi_list[kpi.id], 'month_1_score', data.kpi.month_1_score)
                            that.$set(that.kpi_list[kpi.id], 'month_2_score', data.kpi.month_2_score)
                            that.$set(that.kpi_list[kpi.id], 'month_3_score', data.kpi.month_3_score)


                            that.$set(that.kpi_list[kpi.id], 'month_1', data.kpi.month_1)
                            that.$set(that.kpi_list[kpi.id], 'month_2', data.kpi.month_2)
                            that.$set(that.kpi_list[kpi.id], 'month_3', data.kpi.month_3)
                            that.kpi_list[kpi.id].month_1_score = data.kpi.get_month_1_score;
                            that.kpi_list[kpi.id].month_2_score = data.kpi.get_month_2_score;
                            that.kpi_list[kpi.id].month_3_score = data.kpi.get_month_3_score;

                            that.$set(that.kpi_list[kpi.id], 'get_month_1_score_icon', data.kpi.get_month_1_score_icon)
                            that.$set(that.kpi_list[kpi.id], 'get_month_2_score_icon', data.kpi.get_month_2_score_icon)
                            that.$set(that.kpi_list[kpi.id], 'get_month_3_score_icon', data.kpi.get_month_3_score_icon)

                            that.kpi_list[kpi.id].get_month_1_score_icon = data.kpi.get_month_1_score_icon;
                            that.kpi_list[kpi.id].get_month_2_score_icon = data.kpi.get_month_2_score_icon;
                            that.kpi_list[kpi.id].get_month_3_score_icon = data.kpi.get_month_3_score_icon;
                            //that.$set(that.$data, 'kpi_list[' + kpi.id + ']', data.kpi);
                            //$('.kpiprogressreview-wrapper').tooltip();
                            that.$set(that.kpi_list[kpi.id], 'latest_score', data.score)
                            that.$set(that.kpi_list[kpi.id], 'real', data.real)
                            that.kpi_list[kpi.id].target = data.kpi.target;

                            that.kpi_list[kpi.id].latest_score = data.score; //JSON.parse(data);
                            that.kpi_list[kpi.id].real = data.real; //JSON.parse(data);
                            that.get_current_employee_performance();
                            that.triggeredReloadTargetPerformance(kpi.id)
                            that.reload_kpi(kpi.id)

                            success_requestcenter(gettext("Update successful!"));
                        },
                        error: function () {

                        },
                        complete: function (data) {
                        }
                    });
                }, 200);


            }
            if (typeof callback === 'function') {
                callback();
            }
            console.log(callback)

        },

        complete_review_modal: function () {
            $('#complate-review-modal').modal();
            this.count_zero_score_kpi();
        },

        edit_weight_modal: function (){
            var that = this;
            Object.values(this.parentKPIs).forEach(function (kpi) {
                that.$set(kpi, 'new_weight',kpi.weight);
            });
            $('#edit-all-weight-modal').modal();
        },
        show_kpi_msg: function (status) {
            if (status == 0) {
                swal({
                    type: 'success',
                    title: gettext("Successful"),
                    text: gettext("Change KPI's weight successful!"),
                    showConfirmButton: true,
                    timer: 2000,
                })
                $("#edit-all-weight-modal").modal('hide');
            } else {
                swal({
                    type: 'error',
                    title: gettext("Unsuccess"),
                    text: gettext("Change KPI's weight was unsuccessful!"),
                    showConfirmButton: true,
                    timer: 2000,
                })
            }
        },
        accept_edit_weight: function() {
            var that = this;
            var is_zero_kpi = _.filter(that.parentKPIs, function(kpi){
                return kpi.new_weight <= 0 && kpi.reason === '';
            })
            if (is_zero_kpi.length > 0){
                swal({
                        type: 'error',
                        title: gettext("Unsuccessful"),
                        text: gettext('Please deactive this KPI before you change KPI\'s weight to 0'),
                        showConfirmButton: true,
                        timer: 5000,
                    })
                return false;
            }
            Object.values(that.parentKPIs).forEach(function(kpi){
                if (kpi.weight != kpi.new_weight) {
                    kpi.weight = kpi.new_weight;
                    that.update_kpi(kpi, null, that.show_kpi_msg);
                }
            })
        },

        show_backup_kpi: function () {
            $('#kpiscore-backup-help').modal('hide');
            $('#backup-kpi-modal').modal();
            this.get_backups_list(true);
        },
        get_backups_list: function (showModal) {
            self = this;
            if (showModal) $('#lb-load-backups-list').show();
            cloudjetRequest.ajax({
                type: 'get',
                url: '/api/v2/user/backup_kpis/' + self.user_id + '/' + self.current_quarter.id,
                success: function (data) {
                    $('#lb-load-backups-list').hide();
                    if ($.isArray(data)) {
                        self.backups_list = data;
                        data.forEach(function (_data) {
                            // self.$set(self.$data, 'employee_performance.month_' + _data.month + '_backup', true);
                            self.$set(self.employee_performance, 'month_' + _data.month + '_backup', true);

                            if (self.backup_month.indexOf(_data.month) == -1) {
                                self.backup_month.push(_data.month);
                            }
                        })
                    }
                }
            })
        },
        post_backup_kpis: function () {
            var self = this;
            swal({
                title: gettext("Do you want backup this KPIs?"),
                type: "warning",
                showCancelButton: true,
                cancelButtonText: gettext("Cancel"),
                confirmButtonColor: "#DD6B55",
                confirmButtonText: gettext("Agree"),
                closeOnConfirm: true
            }, function () {
                if (!self.chosen_backup_month) alert(gettext("Please choose the month to backup KPI"));
                else {
                    var btn_create_backup_kpi = $('#btn-create-backup-kpi');
                    var oldLabel = btn_create_backup_kpi.text();

                    btn_create_backup_kpi.prop('disabled', true);
                    btn_create_backup_kpi.text(gettext("Backup is in progressing") + ' ...');
                    self.hide_message('msg-id');
                    cloudjetRequest.ajax({
                        type: 'post',
                        url: '/api/v2/user/backup_kpis/' + self.user_id + '/' + self.current_quarter.id,
                        data: JSON.stringify({month: self.chosen_backup_month}),
                        success: function (data) {
                            function findBackup(id) {
                                return $.grep(self.backups_list, function (item) {
                                    return item.id === id;
                                });
                            };
                            if (data.length > 0) {
                                data.forEach(function (item) {
                                    var _backup = findBackup(item.id);
                                    console.log(_backup);
                                    if (_backup.length > 0) {
                                        self.show_message('msg-id', gettext("KPI Backup is exist!"));
                                        setTimeout(function () {
                                            self.hide_message('msg-id');
                                        }, 3000);
                                    }
                                    else {
                                        self.backups_list.push(item);
                                        self.backup_month.push(item.month);
                                        self.$set(self.employee_performance, 'month_' + item.month + '_backup', true);
                                    }
                                })
                            }
                            ;

                            btn_create_backup_kpi.prop('disabled', false);
                            btn_create_backup_kpi.text(oldLabel);
                            self.update_month_backup_display(self.chosen_backup_month);
                        },
                        fail: (function () {
                            self.show_message('msg-id', gettext("Error"));
                            btn_create_backup_kpi.prop('disabled', false);
                            btn_create_backup_kpi.text(oldLabel);
                        }),
                        error: function (jqXHR, textStatus, errorThrown) {
                            self.show_message('msg-id', gettext("Error"));
                            btn_create_backup_kpi.prop('disabled', false);
                            btn_create_backup_kpi.text(oldLabel);
                        }
                    })
                }
            });
        },
        show_message: function (idStr, content) {
            $('#' + idStr).css('display', 'block').css('text-align', 'center').css('color', 'red');
            $('#' + idStr).html(content);
        },
        hide_message: function (idStr) {
            $('#' + idStr).css('display', 'none');
            $('#' + idStr).html('');
        },
        hide_backup_kpi_modal: function () {
            $('#view-backup-kpi-modal').modal('hide');
            $('#backup-kpi-modal').modal();
        },
        view_backup_kpis: function (id) {
            var self = this;
            $('#view-backup-kpi-modal').modal('show');
            $('#backup-kpi-modal').modal('hide');
            // find backup by id
            self.current_backup = self.backups_list[id];
            // console.log('fihihhihihc');

            if (self.current_backup && self.current_backup.hasOwnProperty('data')) {
                var kpis = self.current_backup.data;
                var total_weight = 0;
                self.current_backup.data.forEach(function(e){
                    total_weight += e.weight;
                })
                self.backup_month_name = self['month_' + self.current_backup.month + '_name']
                self.backup_kpis = kpis;
                self.backup_kpis.forEach(function(e, i){
                    self.backup_kpis[i].weight_percentage = parseFloat(e.weight/total_weight) * 100;
                })
            }
        },
        get_backup_month_score: function (index) {
            var self = this;
            var month = self.current_backup.month;
            var backup_kpis_month_score = parseFloat(self.backup_kpis[index]['month_' + month + '_score']);
            if ($.isNumeric(backup_kpis_month_score)){
                return backup_kpis_month_score.toFixed(2);
            } else {
                return null
            }
        },
        get_backup_month_name: function (month) {
            return self['month_' + month + '_name']
        },
        get_backup_month_target: function (index) {
            var self = this;
            var month = self.current_backup.month;
            var backup_kpis_month_target = parseFloat(self.backup_kpis[index]['month_' + month + '_target']);
            if ($.isNumeric(backup_kpis_month_target)) {
                return backup_kpis_month_target.toFixed(2);
            } else {
                return null
            }

        },
        get_backup_month_real: function (index) {
            var self = this;
            var month = self.current_backup.month;
            var backup_kpis_month = parseFloat(self.backup_kpis[index]['month_' + month]);
            if($.isNumeric(backup_kpis_month)){
                return backup_kpis_month.toFixed(2);
            }else {
                return null
            }

        },
        update_month_backup_display: function (month) {
            var self = this;
            if (month) {
                self.$set(self.employee_performance, 'month_' + month + '_backup', true);
            }
        },
        formatBackupKpis: function (val) {
            if (typeof val == 'number') {
                return val.toFixed(2) + "%";
            }
            return ""
        },
        delete_backup: function (index) {
            var self = this;
            swal({
                title: gettext('KPI Backup deleted can not be reversed'),
                text: gettext('You want to delete KPI Backup, are you sure?'),
                type: "warning",
                showCancelButton: true,
                cancelButtonText: gettext('Cancel'),
                confirmButtonColor: "#DD6B55",
                confirmButtonText: gettext('OK'),
                closeOnConfirm: false
            }, function () {
                var backup_kpi = self.backups_list[index];
                cloudjetRequest.ajax({
                    url: '/api/v2/user/backup_kpis/' + self.user_id + '/' + self.current_quarter.id,
                    type: 'delete',
                    data: JSON.stringify({month: backup_kpi.month}),
                    success: function (data, statusText, jqXHR) {
                        if (statusText === 'success') {
                            swal({
                                title: gettext('Successful'),
                                text: '<div style="padding: 5px;word-wrap: break-word;">' + gettext("KPI Backup deleted successful") + '</div>',
                                type: "success",
                                html: true,
                                confirmButtonText: gettext('OK'),
                            });
                            self.backups_list = self.backups_list.filter(function (item) {
                                return backup_kpi.month !== item.month;
                            });
                            self.backup_month.splice(self.backup_month.indexOf(backup_kpi.month), 1);
                            self.$set(self.employee_performance, 'month_' + backup_kpi.month + '_backup', false);
                            self.get_current_employee_performance();
                            self.get_backups_list(false);
                        }
                    }
                })
            });
        },
        normalize_group_weight: function (group, new_total_weight) {

            that = this;
            swal({
                title: gettext('Are you sure?'),
                text: gettext('This will set weighting score for all KPIs in group') + ' ' + group,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: gettext('No'),
                confirmButtonText: gettext('Agree'),
                closeOnConfirm: false
            }, function () {
                var avg_weighting_score = parseFloat(that.new_group_total[group]) / that.total_kpis_bygroup[group];

                Object.keys(that.kpi_list).forEach(function (kpi_id) {
                    if (that.kpi_list[kpi_id].user == that.user_id
                        && that.kpi_list[kpi_id].group == group) {
                        var kpi = that.kpi_list[kpi_id];

                        kpi.weight = avg_weighting_score;
                        that.update_kpi(kpi);
                    }
                });

                swal(gettext('Successful') + "!", "", "success");
            });
        },

        sort_kpi_group: function () {
            function getSorted(selector, attrName) {
                return $($(selector).toArray().sort(function (a, b) {
                    var aVal = a.getAttribute(attrName),
                        bVal = b.getAttribute(attrName);
                    if (aVal != null) {
                        return aVal.localeCompare(bVal);
                    }
                    else {
                        return 1;
                    }

                }));
            }

            $('.kpi-row').css('margin-left', '0');
            //var $children = $(".kpi-parent-wrapper");
            //$children.detach();
            // $children = $children.sort(sort_kpi);
            var $children = getSorted('.kpi-parent-wrapper', 'data-kpi-group');
            $children.appendTo("#kpi-group-all");
            /*hack: remove unused div*/

            var elemToBeRemoved = $("#personal-kpis").siblings()[0]
            $(elemToBeRemoved).remove()
            // create_scrolltofixed()
            // update_scrolltofixed(true)
            /* scroll to fixed enabled */

        },

        compress_view: function () {

            $('#btn-back').show();
            $('#header').remove();
            $('.not-show-when-group').remove();

            $('#report-to-user-kpis').remove();
            $('#column-left').remove();
            $('.kpi-section-heading').remove();
            $('.kpi-group-heading').remove();

        },

        sort_by_group: function (obj) {
            this.compress_view();

            $('.kpi-refer-group').click();
            $('.kpi-refer-group').remove();
            $('.group-modifier').css('display', 'inline-block');
            $('#btn-add').remove();
            $('#btn-edit-weight').remove();

            this.sort_kpi_group();
            $(obj.currentTarget).removeClass("btn-cus-white").addClass("btn-cus-add");
            //$('.kpi-parent-wrapper').appendTo('#kpi-group-all');

        },

        get_order_quarter: function () {
            var that = this;
            cloudjetRequest.ajax({
                type: 'get',
                url: '/api/quarter/?all_quarters=true',
                success: function (data) {
                    var filteredQuarterList = data.filter(function(elm){
                        return elm.status != 'DELETED'
                    })
                    that.quarter_list = filteredQuarterList;
                }
            })
        },
        we_complete_review_confirm: function () {
            this.complete_review_confirm();
            vue_support.show_rate_nps()
        },

        setCookie: function (cname, cvalue) {
            var now = new Date(); // now
            // cvalue is second
            // getTime in milisecond
            var expiredDate = now.getTime() + cvalue * 1000;
            var d = new Date();
            d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString(); // expires for cookie, we dont care it
            document.cookie = cname + "=" + expiredDate + ";" + expires + ";path=/";
        },

        getCookie: function (name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length === 2) return parts.pop().split(";").shift();
        },

        get_manager_kpis: function (user_id, bsc_category) {
            var that = this;
            cloudjetRequest.ajax({
                type: 'get',
                url: '/performance/kpi/align-up/?user_id=' + user_id + "&bsc_category=" + bsc_category,
                success: function (res) {
                    that.manager_kpis = res;
                    console.log(res);
                },
                error: function (res) {
                }
            });
        },

        init_data_align_up_kpi: function (user_id, kpi_id, bsc_category) {
            var that = this;
            $(".btn-align-up-kpi").button("reset");
            that.get_manager_kpis(user_id, bsc_category);
            that.selected_kpi = that.kpi_list[kpi_id];
            $("#id-modal-align-kpi").modal('show');
        },

        unlink_align_up_kpi: function (user_id, kpi_id, bsc_category, event) {
            var _this = this;
            if (confirm(gettext('Are you sure you want to unlink this KPI') + "?")) {
                var data = {
                    user_id: user_id,
                    aligned_kpi_id: _this.kpi_list[kpi_id].id
                }
                cloudjetRequest.ajax({
                    type: 'post',
                    url: '/performance/kpi/align-up/',
                    data: data,
                    success: function (res) {
                        var elm = event.target;
                        _this.reload_kpi(_this.kpi_list[kpi_id].id);

                        sweetAlert(gettext("ACTION COMPLETED"), gettext("The KPI is successfully unlinked"), "success");
                    },
                    error: function (res) {

                    }
                });
            }
        },

        save_align_up_kpi: function () {
            var _this = this;
            if (!_this.user_id || _this.selected_kpi.id || _this.selected_manager_kpi) {

            }

            $(".btn-align-up-kpi").button("loading");
            var data = {
                user_id: _this.user_id,
                kpi_id: _this.selected_manager_kpi,
                aligned_kpi_id: _this.selected_kpi.id
            }

            cloudjetRequest.ajax({
                type: 'post',
                url: '/performance/kpi/align-up/',
                data: data,
                success: function (res) {
                    $("#id-modal-align-kpi").modal('hide');
                    $(".btn-align-up-kpi").button("reset");
                    _this.reload_kpi(_this.selected_kpi.id);
                },
                error: function (res) {
                    $(".btn-align-up-kpi").button("reset");
                }
            });
        },

        complete_review_confirm: function () {
            that = this;
            $('#complate-review-modal').modal('hide');
            var temp = $('#btn-complete-review').html();
            $('#btn-complete-review').html(gettext('Downloading! Please wait ... '));
            cloudjetRequest.ajax({
                type: 'post',
                url: COMMON.LinkRDisAPI + "?key=confirm-kpi-quarter" + that.quarter_by_id.id,
                data: {value: new Date()},
                success: function (res) {
                    that.$set(that.$data, 'complete_review', res['value']);
                    console.log(res['value']);
                },
                error: function (res) {
                }
            });
            cloudjetRequest.ajax({
                type: 'post',
                url: COMMON.LinkNotifyAPI,
                data: {
                    user_id: COMMON.OrgUserId,
                    notification_type: 'complete_review'
                },
                success: function (res) {
                    that.$set(that.$data, 'complete_review', res['value']);
                },
                error: function (res) {
                }
            });

            // $('<form></form>').attr('action', "{% url 'SimpleExport' org_user.id %}").appendTo('body').submit().remove();

            this.capture_and_download();
        },

        capture_and_download: function(){
            that = this;
            var temp = $('#btn-complete-review').html();

            var wd = window.open("/performance/report/#/?user_id=" + COMMON.OrgUserId + "&quarter_id=" + that.quarter_by_id.id);

            $("#complate-review-modal").on("hidden.bs.modal", function () {
                html2canvas(document.body, {
                    onrendered: function (canvas) {
                        $('#btn-complete-review').html(temp);

                        var a = document.createElement('a');
                        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                        // a.download = (new Date()) + '-kpi.jpg';
                        a.download = 'KPIs ' + (new Date()) + '.jpg';
                        a.click();
                    }

                });
            });
        },

        get_reason_delay_kpi: function () {
            that = this;
            return that.reason_kpi;
        },
        // set_elm_kpi: function (elm) {
        //     that = this;
        //     that.elm_kpi = elm;
        // },
        // get_elm_kpi: function (elm) {
        //     that = this;
        //     return that.elm_kpi;
        // },
        check_reason: function (kpi_id) {
            that = this;
            if (!that.reason_kpi.replace(/\s/g, '').length) {
                that.check_submit_reason = true;
                return;
            }
            if (that.reason_kpi.length > 500) {
                alert(gettext('Reason delay KPI does not exceed 500 characters'));
                that.reason_kpi = that.reason_kpi.substring(0, 500);
                that.check_submit_reason = false;
                return;
            }

            if (kpi_id != undefined)
                that.check_submit_reason = !that.check_is_valid(kpi_id);
            else
                that.check_submit_reason = false;
            return;
        },
        get_total_weight: function (refer_to) {
            var sum = 0;
            that = this;
            if (refer_to) {
                Object.keys(that.kpi_list).forEach(function (key) {
                    if (parseInt(that.kpi_list[key].refer_to) === refer_to) {
                        sum += parseFloat(that.kpi_list[key].weight) || 0;
                    }
                });
                console.log(sum);
                return sum;
            }
            return 1;
        },
        isNumberKey: function (evt, elm) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode >= 96 && charCode <= 105) {
                // Numpad keys
                charCode -= 48;
            }

            if (!this.isNumber(String.fromCharCode(charCode))) {
                $(elm).val('');
            }
            /*
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    //return false;
                    $(elm).val('');
                }*/
            //return true;
        },
        isNumber: function (o) {
            // Validate Numeric inputs
            if (!(o == '' || !isNaN(o - 0)) || o < 0) {
                // this.check_submit_reason = true;
                return false;
            }
            // chỗ này cực kỳ vớ vẩn
            // this.check_submit_reason = false;
            // this.check_reason();
            return true;
        },

        checkChild: function (kpi_id) {
            this.is_child = !this.parentKPIs[kpi_id];
        },


        /***
         * To call functions to excute the save action
         * kpi: kpi in kpi_list
         * key: a unique key to specific which function will be call arcording to value of this key
         * controller_prefix: controller_prefix to use in kpi_ready function
         ***/
        save_action: function (kpi, key, controller_prefix) {
            var that = this;
            switch (key) {
                case 'quarter_target':
                    that.update_quarter_target(kpi);
                    break;
                case 'month_score':
                    that.update_score(kpi);
                    break;
                case 'month_target':
                    that.update_month_target(kpi, (!kpi.enable_edit && !that.organization.allow_edit_monthly_target));
                    break;
                case 'score_calculation':
                    that.update_quarter_target(kpi);
                    break;
                case 'operator':
                    that.update_score(kpi);
                    break;
                default:
                    return;
            }
            // that.delete_temp(kpi, key);
            kpi_ready(kpi['id'], controller_prefix, false);
        },

        average_3_month: function (employee_performance) {
            var count = 0;
            var total = 0;
            ['month_1_score', 'month_2_score', 'month_3_score'].forEach(function (key) {
                // if (key != 'current' && employee_performance[key] > 0) { # remove key since it was not neccessary
                if (employee_performance[key] > 0) {
                    total += employee_performance[key];
                    count += 1;
                }
            })

            if (count > 0) {
                return total / count;
            }
            return total;
        },

        loadKPIs: function() {

            var that = this;
            var quarter_id = getUrlVars()['quarter_id'];

            cloudjetRequest.ajax({
                url: '/api/v2/user/'+this.user_id+'/kpis/',
                type: 'GET',
                data: {quarter_id: quarter_id},
                success: function (data) {
                    console.log("=======>>>>--------------")
                    console.log(data)
                    var dictResult = {};
                    data.forEach(function(a){
                        dictResult[a.id] = a;
                    })
                    // that.kpi_list = dictResult;
                    // that.kpi_list = Object.assign({}, that.kpi_list, dictResult)
                    that.$set(that.$data, 'kpi_list', dictResult);
                    // that.parentKPIs = JSON.parse(JSON.stringify(dictResult));
                    console.log(that.kpi_list);
                },
                error: function (a, b, c) {

                }
            });
        },

        update_score_and_ready: function(kpi, controller_prefix, ready){
            this.update_score(kpi);
            this.kpi_ready(kpi.id, controller_prefix, ready);
        },

        update_month_target_and_ready: function (kpi, check_disabled, controller_prefix, ready) {
            this.update_month_target(kpi, check_disabled);
            this.kpi_ready(kpi.id, controller_prefix, ready);
        },
        update_quarter_target_and_ready: function(kpi, controller_prefix, ready) {
            this.update_quarter_target(kpi);
            this.kpi_ready(kpi.id, controller_prefix, ready);
        },
        update_score_calculation_type_and_ready: function (kpi, controller_prefix, ready) {
            this.update_score_calculation_type(kpi);
            this.kpi_ready(kpi.id, controller_prefix, ready);
        },

        update_evidence_event_callback: function (kpi_id, month, count){
            var that = this;
            var evidence={ };
            evidence[kpi_id]={};
            evidence[kpi_id][month]= count;

            // We don't want to reactive that.evidences here
            // because this evidence value is from component value
            // if reactive occur here, then component will be re-render, that not we want
            // that.evidences = Object.assign({}, that.evidences, evidence);
            setObj(that.evidences, kpi_id+ '.'+ month, count);


        }

    },



});

/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 */

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    return {
        /**
         * Opens our dialog
         * @param message Custom message
         * @param options Custom options:
         *                  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
         *                  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
         */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
         * Closes dialo
         */
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);



$(function () {
    $('#preview-attach-modal').on('hide.bs.modal', function () {
        if (v.$data.preview_attach_modal_type == 'action_plan'){
            $('#kpi_action_plan-modal').modal('show');
        }
        else if (v.$data.preview_attach_modal_type == 'evidence') {
            $('#evidence-modal').modal('show');
        }
        else {
            //do nothing
        }


    })
});

