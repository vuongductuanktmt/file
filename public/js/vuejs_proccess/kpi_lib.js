function getQtip() {
    Vue.directive('settooltip', function (el) {
        var text = "<div><span class='pd-bt-5'><strong>" + gettext('Measurement methods') + "</strong></span><br/>";
        var txt = $(el).children('.tooltip-content').text();
        if (txt != null || txt.length > 0) {
            txt = txt.trim();
            txt = '<span>' + txt + '</span>';
            txt = text + txt + '</div>';
        }
        $(el).qtip({
            content: {
                text: txt.replace(/(?:\r\n|\r|\n)/g, '<br/>')
            },
            style: {
                classes: 'qtip-green qtip-custom'
            },
            position: {
                my: 'bottom center',
                at: 'top center',
                target: $(el),
                adjust: {
                    x: 10
                }
            },
            show:{
                delay : 250
            }
        });
    });
}

getQtip();
$('#input-search-kpi').focusout(function () {
    setTimeout(function () {
        $("#list_kpi_suggest").hide();
        $(".arrow-up").hide();
    }, 200);
});

// function clear_history_kpi() {
//     kpi_lib.storage_kpis = [];
//     kpi_lib.storage_kpis_template = [];
//     localStorage.setItem('history_search_kpi', null);
//     $(".history-kpi").hide();
// }

$('body').on('mouseover', '.dropdown-func-cate .el-cascader-menu__item', function () {
    $(this).on('hidden.bs.tooltip', function(){
         $(this).tooltip('destroy');
    });
    $(this).tooltip({
        title: $(this).html(),
        container: 'body'
    });
    $(this).tooltip('show');
});



// alert(COMMON);
Vue.mixin({
    delimiters: ['${', '}$'],
    data: function () {
        // https://stackoverflow.com/questions/40896261/apply-global-variable-to-vuejs
        return {

            is_user_system: (COMMON.IsAdmin == 'True' || COMMON.IsSupperUser == 'True') ? true : false,
            user_id: COMMON.OrgUserId,
            EXTRA_FIELDS_KPI: COMMON.ExtraFields,
            DEPARTMENTS: COMMON.Departments,
            EXTRA_FIELDS: COMMON.ExtraFields,
            BSC_CATEGORY: COMMON.BSCCategory,
            LANGUAGE_CODE: COMMON.LanguageCode,

        }
    },
});

Vue.component('card-view', {
    type: 'card-view',
    template: $('#card-view-wrap').html(),
    props: [
        'id',    //id of collection
        'title',
        'sub_title',
        'id_vtcd'
    ],
    data: function () {
        return {
            is_active: false,
        }
    },
    delimiters: ["{$", "$}"],
    methods: {
        activeWhenClick: function () {
            var self = this;
            self.is_active = true;
            setTimeout(function () {
                self.is_active = false;
            }, 200)
        },
        clickCard: function () {
            var self = this;
            self.activeWhenClick();
            self.$emit('view_detail_card', self.id, self.title);
        }
    },
    watch: {},
    filters: {},

    mounted: function () {
        window.cardView = this;
    },
});
Vue.component('card-detail', {
    type: 'card-detail',
    template: $('#card-detail-wrap').html(),
    props: [
        'id',  // id of collection
        'list_kpi',
    ],
    data: function () {
        return {
            hover_icon_person: false,
            flag_open_modal_detail: false,
            kpi_to_view_detail : {},
        }
    },
    delimiters: ["{$", "$}"],
    methods: {
        mouseOver: function () {
            var self = this;
            self.hover_icon_person = true;
        },
        mouseLeave: function () {
            var self = this;
            self.hover_icon_person = false;
        },
        set__kpi_to_view: function (k) {
            var self = this;
            //self.kpi_to_view_detail = k;
            self.kpi_to_view_detail = {"id":2,
                "objective":"Đạt được 80% độ tập trung trong công việc",
                "name":"Tăng sự tập trung trong công việc",
                "category":"financial",
                "description":"Tăng độ tập trung trong công việc thông qua việc không dùng facebook cũng như các thiết bị khác",
                "measurement_method":"Lần",
                "operator":"=",
                "tags":["Tập trung"],
                "language":"vi",
                "extra_data":{
                    "category":"financial",
                    "functions":[
                        {
                            "function_category_id":5,
                            "sub_category_id":8
                        },
                        {
                            "function_category_id":5,
                            "sub_category_id":6
                        }],
                    "unit":"Số lần"
                },
                "created_at":"2018-07-11T10:45:22.168534",
                "updated_at":"2018-07-31T10:02:10.587000",
                "function_categories":[
                    "Việc làm nhà nước › Việt nam muôn năm",
                    "Việc làm nhà nước › Làm công ăn lương"
                ],
                "unit":"Số lần",
                "functions":[{
                        "function_category_id":5,
                        "sub_category_id":8
                    },
                    {
                        "function_category_id":5,
                        "sub_category_id":6
                    }],
                "data_source":null,
                "frequency":null,
                "example":null,
                "tips":null,
                "kpi_source":null,
                "belong_vtcd": false,
                "sector": "Tất cả",
                "main_function": "Tất cả",
                "sublist" : "Có thể áp dụng từ chỉ số công ty, cấp quản lý đến nhân viên"

            };
            self.flag_open_modal_detail = true;
        },
        triggerDismissModal: function () {
            var self = this;
            self.flag_open_modal_detail = false;
            self.kpi_to_view_detail = {};
            console.log("dissmissed")
        },
    },
    watch: {},
    filters: {},

    mounted: function () {
        window.cardDetail = this;
    },
});
Vue.component('detail-kpi', {
    type: 'detail-kpi',
    template: $('#modal-kpi-detail-wrap').html(),
    props: [
        'value',
        'mode',
        'kpi',
    ],
    data: function () {
        return {
            uuid: makeid(),
            EXTRA_FIELDS_KPI: COMMON.ExtraFields,
            BSC_CATEGORY: COMMON.BSCCategory,
            kpi_to_view: {},
            flag_open_edit_kpi: false,
            user_display_name: "{{ request.user.profile.display_name }}",

            // for alert custom
            type: 'success',
            title: '',
            messages: '',
            duration: 5,
            show_mesages: false,
            have_button : false,
            text_button : '',
            href_button : '',
            no_message: false,
            // end alert

        }
    },
    delimiters: ["{$", "$}"],
    watch: {
        value: {
            handler: function (val, oldVal) {
                if (val === true) {
                    console.log("triggered modal open")
                    this.triggerOpenModal()
                } else {
                    this.triggerCloseModal()
                }
            }
        },
        kpi: {
            handler: function (val, oldVal) {
                if (val) {
                    this.kpi_to_view = val;
                } else {
                    this.kpi_to_view = {};
                }
            }
        }
    },
    methods: {
        dismissMessages: function () {
            var self = this;
            self.show_mesages = false;
        },
        add_selected_kpi: function () {
            var self = this;
            // thuc hien them kpi bang api


            // sau do neu thanh cong thi se show len thong bao

            var title = 'Thêm KPI thành công';
            var messages = 'KPI <strong>' + self.kpi.name + '</strong> đã được thêm thành công vào khía cạnh ' +
                '<strong>' + self.BSC_CATEGORY[self.kpi_to_view.category] + '</strong>' +
                ' của nhân viên ' + '<strong>' + self.user_display_name + '</strong>';
            self.callAlertCustom('success',title, messages, 5, true, 'Đến KPI editor','?', false);
            self.triggerCloseModal();
        },
         callAlertCustom: function(type, title, messages, duration, havebutton, textbutton, href ,no_message) {
            var self = this;
            self.type = type;
            self.title = title;
            self.messages = messages;
            self.duration = duration;
            self.show_mesages = true;
            self.have_button = havebutton;
            self.text_button = textbutton;
            self.no_message = no_message;
            self.href_button = href;
        },
        deleteKPI: function () {
            var self = this;
            this.$confirm('Bạn có chắc chắn xóa KPI : ' + self.kpi.name, '', {
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Đóng',
                type: 'warning',
                center: true,
                customClass: 'warning-del-card'
            }).then(() => {
                // run api del card,
                // thực hiện delete bằng api

                // sau do thanh cong se thay thong bao nay
                self.callAlertCustom('success','Đã lưu thay đổi', 'message', 2, false, 'Đến KPI editor','?',true);
                self.triggerCloseModal();

            }).catch(() => {

            });

        },
        triggerDismissModal: function () {
            var self = this;
            self.flag_open_edit_kpi = false;
            console.log("dissmissed")
        },
        editKPI: function () {
            var self = this;
            self.flag_open_edit_kpi = true;
        },
        checkModeModal: function () {
            var self = this;
            switch (self.mode) {
                case 'create':
                    self.initDataCreate();
                    break;
                case 'edit':
                    self.initDateEdit();
                    break;
                default:
                    break;
            }
        },
        triggerOpenModal: function () {
            var self = this;
            console.log("triggered modal open")
            setTimeout(function () {
                $('#modal-kpi-details-' + self.uuid).modal('show');
                $('#modal-kpi-details-' + self.uuid).appendTo('body');

            }, 250)
        },
        triggerCloseModal: function () {
            var self = this;
            setTimeout(function () {
                $('#modal-kpi-details-' + self.uuid).modal('hide');
            }, 250)
            self.$emit('dismiss')
        },
    },
    mounted: function () {
        var self = this;
        //self.checkModeModal();
        window.viewDetailKPI = self;
        initModalHidden('#modal-kpi-details-' + self.uuid, function () {
            self.triggerCloseModal()
        })
    },
});
Vue.component('edit-kpi', {
    type: 'edit-kpi',
    template: $('#modal-edit-kpi-wrap').html(),
    props: [
        'value',
        'kpi',
    ],
    data: function () {
        return {
            uuid: makeid(),
            EXTRA_FIELDS_KPI: COMMON.ExtraFields,
            BSC_CATEGORY: COMMON.BSCCategory,
            kpi_to_edit: {},

            list_category: [{
                value: 'customer',
                label: 'Khách hàng'
            }, {
                value: 'financial',
                label: 'Tài chính'
            }, {
                value: 'internal',
                label: 'Quy trình nội bộ',
            }, {
                value: 'functions',
                label: 'Chức năng'
            }, {
                value: 'learninggrowth',
                label: 'Đào tạo & phát triển'
            }, {
                value: 'other',
                label: 'Khác'
            }],
            selectedOptions: [],


            // for alert custom
            type_alert: 'success',
            title: '',
            messages: '',
            duration: 5,
            show_mesages: false,
            have_button: false,
            text_button: '',
            href_button: '',
            no_message: false,
            // end alert


        }
    },
    delimiters: ["{$", "$}"],
    watch: {
        value: {
            handler: function (val, oldVal) {
                if (val === true) {
                    console.log("triggered modal open")
                    this.triggerOpenModal()
                } else {
                    this.triggerCloseModal()
                }
            }
        },
        kpi: {
            handler: function (val, oldVal) {
                if (val) {
                    this.kpi_to_edit = val;
                    this.selectedOptions.push(this.kpi_to_edit.category);
                } else {
                    this.kpi_to_edit = {};
                }
            }
        }
    },
    methods: {
        callAlertCustom: function (type, title, messages, duration, havebutton, textbutton, href, no_message) {
            var self = this;
            self.type_alert = type;
            self.title = title;
            self.messages = messages;
            self.duration = duration;
            self.show_mesages = true;
            self.have_button = havebutton;
            self.text_button = textbutton;
            self.no_message = no_message;
            self.href_button = href;
        },
        dismissMessages: function () {
            var self = this;
            self.show_mesages = false;
        },
        save_edit: function () {
            var self = this;
            self.callAlertCustom('success', 'Đã lưu thay đổi', 'message', 2, false, 'Đến KPI editor', '?', true);
            self.triggerCloseModal();
        },
        triggerOpenModal: function () {
            var self = this;
            console.log("triggered modal open")
            setTimeout(function () {
                $('#modal-edit-kpi-' + self.uuid).modal('show');
                $('#modal-edit-kpi-' + self.uuid).appendTo('body');

            }, 250)
        },
        triggerCloseModal: function () {
            var self = this;
            setTimeout(function () {
                $('#modal-edit-kpi-' + self.uuid).modal('hide');
            }, 250)
            self.$emit('dismiss')
        },
    },
    mounted: function () {
        var self = this;
        window.editKPI = self;
        initModalHidden('#modal-edit-kpi-' + self.uuid, function () {
            self.triggerCloseModal()
        })
    },
});
Vue.component('card-new', {
    type: 'card-new',
    template: $('#card-new-wrap').html(),
    props: [],
    data: function () {
        return {
            is_active: false,
            flag_open_modal: false,

            // for alert custom
            type: 'success',
            title: '',
            messages: '',
            duration: 5,
            show_mesages: false,
            have_button: false,
            text_button: '',
            href_button: '',
            no_message: false,
            // end alert

            uuid: makeid(),
        }
    },
    delimiters: ["{$", "$}"],
    methods: {
        dismissMessages: function () {
            var self = this;
            self.show_mesages = false;
        },
        callAlertCustom: function(type, title, messages, duration, havebutton, textbutton, href ,no_message) {
            var self = this;
            self.type = type;
            self.title = title;
            self.messages = messages;
            self.duration = duration;
            self.show_mesages = true;
            self.have_button = havebutton;
            self.text_button = textbutton;
            self.no_message = no_message;
            self.href_button = href;
        },
        createNewCard: function (card) {
            var self = this;
            self.$emit('add_new_card',card);
            self.callAlertCustom('success', 'Thêm thành công', 'message', 2, false, 'Đến KPI editor', '?', true);
        },
        activeWhenClick: function () {
            var self = this;
            self.is_active = true;
            setTimeout(function () {
                self.is_active = false;
            }, 200)
        },
        clickCard: function () {
            var self = this;
            self.activeWhenClick();
            self.flag_open_modal = true;
        },
        triggerDismissModal: function () {
            var self = this;
            self.flag_open_modal = false;
            console.log("dissmissed")
        },
    },
    mounted: function () {
        window.cardNew = this;
    },
});
Vue.component('new-edit-card', {
    type: 'new-edit-card',
    template: $('#new-edit-card-wrap').html(),
    props: [
        'value',
        'mode',
        'id',   // id for card to edit
        'name', // name card to edit
    ],
    data: function () {
        return {
            uuid: makeid(),
            is_edit_task: false,    // check have edit task rightnow ?
            input_name_card: '',

            // for alert custom
            type: 'success',
            title: '',
            messages: '',
            duration: 5,
            show_mesages: false,
            have_button: false,
            text_button: '',
            href_button: '',
            no_message: false,
            // end alert
        }
    },
    delimiters: ["{$", "$}"],
    watch: {
        value: {
            handler: function (val, oldVal) {
                if (val === true) {
                    console.log("triggered modal open")
                    this.triggerOpenModal()
                } else {
                    this.triggerCloseModal()
                }
            }
        },
    },
    methods: {
        dismissMessages: function () {
            var self = this;
            self.show_mesages = false;
        },
        callAlertCustom: function(type, title, messages, duration, havebutton, textbutton, href ,no_message) {
            var self = this;
            self.type = type;
            self.title = title;
            self.messages = messages;
            self.duration = duration;
            self.show_mesages = true;
            self.have_button = havebutton;
            self.text_button = textbutton;
            self.no_message = no_message;
            self.href_button = href;
        },
        editCard: function () {
            var self = this;
            // exec run api to edit card with id and name

            // then after execute success, we have database to new card.
            var data_temp = {
                id: self.id,
                name: self.input_name_card,
            }
            self.$emit('update_edit_card', self.id, self.input_name_card);

            self.callAlertCustom('success', 'Đã lưu thay đổi', 'message', 2, false, 'Đến KPI editor', '?', true);
            self.triggerCloseModal();

        },

        createCard: function () {
            // Thuc hien api add card voi name =   input_name_card
            var self = this;
            //day la data temp khi add success card
            var data_temp = {
                id: 10,
                name: self.input_name_card,
                id_vtcd: null,
                total_kpi: 0,
                list_kpi: []
            }

            // sau khi co data . Ta se thuc hien add data nay ra ngoai su dung emit
            self.$emit('create_new_card', data_temp);
            // and then hide modal add

            self.input_name_card = '';
            self.triggerCloseModal();


        },
        checkModeModal: function () {
            var self = this;
            switch (self.mode) {
                case 'create':
                    self.initDataCreate();
                    break;
                case 'edit':
                    self.initDateEdit();
                    break;
                default:
                    break;
            }
        },
        initDataCreate: function () {
            var self = this;
            self.is_edit_task = false;
            self.input_name_card = '';
        },
        initDateEdit: function () {
            var self = this;
            self.is_edit_task = true;
            self.input_name_card = self.name;
        },
        triggerOpenModal: function () {
            var self = this;
            console.log("triggered modal open")
            setTimeout(function () {
                $('#create-new-card-' + self.uuid).modal('show');
                $('#create-new-card-' + self.uuid).appendTo('body');

            }, 250)
        },
        triggerCloseModal: function () {
            var self = this;
            setTimeout(function () {
                $('#create-new-card-' + self.uuid).modal('hide');
            }, 250)
            self.$emit('dismiss')
        },
    },
    mounted: function () {
        var self = this;
        self.checkModeModal();
        window.newCard = self;
        initModalHidden('#create-new-card-' + self.uuid, function () {
            self.triggerCloseModal()
        })
    },
});
Vue.component('add-kpi-to-card', {
    type: 'add-kpi-to-card',
    template: $('#add-kpi-to-collection').html(),
    props: [
        'value',
        'kpi',   // kpi to add card
        'collections', // list collections to show
    ],
    data: function () {
        return {
            uuid: makeid(),
            input_search_collection: '',
            list_collection_selected: [],
            name_new_collection: '',

            // for alert custom
            type: 'success',
            title: '',
            messages: '',
            duration: 5,
            show_mesages: false,
            have_button : false,
            text_button : '',
            href_button : '',
            no_message: false,
            // end alert
        }
    },
    delimiters: ["{$", "$}"],
    watch: {
        value: {
            handler: function (val, oldVal) {
                if (val === true) {
                    console.log("triggered modal open")
                    this.triggerOpenModal()
                } else {
                    this.triggerCloseModal()
                }
            }
        },
    },
    methods: {
        callAlertCustom: function(type, title, messages, duration, havebutton, textbutton, href) {
            var self = this;
            self.type = type;
            self.title = title;
            self.messages = messages;
            self.duration = duration;
            self.show_mesages = true;
            self.have_button = havebutton;
            self.text_button = textbutton;
            self.href_button = href;
        },
        dismissMessages: function () {
            var self = this;
            self.show_mesages = false;
        },
        addToCollection: function () {
            var self = this;
            // sau do neu thanh cong thi se show len thong bao

            var title = gettext('Add KPI successfully');
            var messages = 'KPI <strong>' + self.kpi.name + '</strong>' + ' đã được thêm vào <strong> Bộ KPI của </strong>';
            var collect = [];

            for(var i=0; i< self.list_collection_selected.length; i++){
                collect.push('<strong>'+self.list_collection_selected[i].name+'</strong>')
            }
            var res = collect.join(' và<strong> Bộ KPI của </strong>');
            messages += res;

            self.callAlertCustom('success', title, messages, 5, true, 'Đến Bộ sưu tập', '#', false);
            self.triggerCloseModal();

        },
        createNewCollection: function () {
            var self = this;
            // thuc hien add new collection with api. voi name colection la : name_new_collection

            var new_collection_temp = {
                id: 10,
                name: self.name_new_collection,
                id_vtcd: null,
                total_kpi: 0,
                list_kpi: []
            }
            // Sau khi thuc hien thanh cong add collection, sau do push collection nay vao array collection tren
            self.collections.unshift(new_collection_temp);
            self.list_collection_selected.push(new_collection_temp);
            // sau do reset gia tri name_new_collection
            self.name_new_collection = '';
            $('#suggest-collection-wrapper').scrollTop(0);

        },
        checkSelected: function (id) {
            var self = this;
            if (self.list_collection_selected.indexOf(id) != -1) return true;
            return false;
        },
        selectKPICollection: function (item) {
            var self = this;

            if (self.list_collection_selected.indexOf(item) != -1) {
                // Đã có lựa chọn này rồi, thực hiện loại bỏ lựa chọn này trong array
                self.list_collection_selected = self.list_collection_selected.filter(function (elm) {
                    return elm != item;
                });
            }
            else {
                // chưa có lựa chọn này. Thực hiện thêm lựa chọn này vào array
                self.list_collection_selected.push(item);
            }
            self.$forceUpdate();
        },
        triggerOpenModal: function () {
            var self = this;
            console.log("triggered modal open")
            setTimeout(function () {
                $('#add-kpi-to-collection-card-' + self.uuid).modal('show');
                $('#add-kpi-to-collection-card-' + self.uuid).appendTo('body');

            }, 250)
        },
        triggerCloseModal: function () {
            var self = this;
            setTimeout(function () {
                $('#add-kpi-to-collection-card-' + self.uuid).modal('hide');
            }, 250)
            self.input_search_collection = '';
            self.list_collection_selected = [];
            self.name_new_collection = '';
            self.$emit('dismiss')
        },
    },
    mounted: function () {
        var self = this;
        window.addKPItoCard = self;
        initModalHidden('#add-kpi-to-collection-card-' + self.uuid, function () {
            self.triggerCloseModal()
        })
    },
});
Vue.component('alert-custom', {
    type: 'alert-custom',
    template: $('#alert-success-wrap').html(),
    props: [
        'type',
        'title',
        'messages',
        'nomessages',
        'duration',
        'havebutton',
        'textbutton',
        'hrefbutton',
        'value'
    ],
    data: function () {
        return {
            uuid: makeid(),
        }
    },
    delimiters: ["{$", "$}"],
    methods: {
        showMessages: function () {
            var self = this;
            self.$message({
                dangerouslyUseHTMLString: true,
                message: $('#alert-custom-content-' + self.uuid).html(),
                iconClass: 'icon-alert-del-kpi',
                duration: self.duration * 1000,
                center: true,
                showClose: true,
                customClass: (self.nomessages == true)?'alert-success-cus-el cus-detail no-message':'alert-success-cus-el cus-detail',
            });
            self.$emit('dismiss')
        },
        timeDown: function () {
            var self = this;

        }
    },
    watch: {
        value: {
            handler: function (val, oldVal) {
                if (val === true) {
                    this.$forceUpdate();

                } else {
                    this.duration = 0;
                }
            }
        },
    },
    updated: function () {
        var self = this;
        if (self.value == true) {
            self.showMessages();
        }
    },

    mounted: function () {
        window.alertCustion = this;
    },
});
var qtipApp = Vue.extend({
    type: 'QtipApp',
    template: $('#qtip-app').html(),
    props: [
        'data_toggle',
        'message',
        'position_my_class',
        'position_at_class',
        'extra_event',
        'class_custom',
        'delay'
    ],
    data: function () {
        return {
            defaultMyPositionClass: 'bottom center',
            defaultAtPositionClass: 'top center',
            defaultEvent: 'mouseleave',
            defaultClass : 'qtip-dark',
            defaultDelay : 0,
        }
    },
    watch: {
        message: function (val) {
            this.triggeredQtip();
        },
    },
    methods: {
        hideQtip: function(){
            var self = this;
            $('#' + self.data_toggle).qtip({
                hide: {
                    event: true
                },
            });
        },
        disableQtip: function () {
            var self = this;
            $('#' + self.data_toggle).qtip({
                show: false,
            });
        },
        showQtip: function () {
            var self = this;
            $('#' + self.data_toggle).qtip({
                content: {
                    text: self.message,
                },
                style: {
                    classes: self.class_custom !== undefined ? self.class_custom + ' ' + self.defaultClass : self.defaultClass,
                },
                position: {
                    my: self.position_at_class !== undefined ? self.position_at_class : self.defaultAtPositionClass,  // Position my top left...
                    at: self.position_my_class !== undefined ? self.position_my_class : self.defaultMyPositionClass, // at the bottom right of...
                    target: $('#' + self.data_toggle) // my target
                },
                show:{
                    delay: self.delay !== undefined ? self.delay : self.defaultDelay
                },
                hide: {
                     event: self.extra_event !== undefined ? self.extra_event + ' ' + self.defaultEvent : self.defaultEvent// do not remove this if you don't know what your doing
                }
            });
        },
        triggeredQtip: function () {
            var self = this;
            var ableToShowMessage = (self.message !== undefined) && (self.message !== "")
            if (ableToShowMessage) {
                self.showQtip()
            } else {
                self.disableQtip()
            }
        }
    },
    delimiters: ["{$", "$}"],
    computed: {},
    mounted: function () {
        window.qtipApp = this;
        this.triggeredQtip();
    },
});
Vue.component('qtip-wrapper', qtipApp);


// var kpi_lib = new Vue({
Vue.component('kpilib', {
    delimiters: ['{$', '$}'],
    // el: '#content-modal-kpi-lib',
    template: $('#content-modal-kpi-lib').html(),
    props:[
        // 'organization',
    ],
    data: function(){
        return {
            // kpilib ver 2
            activeTab: 'kpi-lib', // have 2 option: kpi-lib, kpi-collection
            flag_open_modal: false, // flag to open modal edit card
            flag_add_kpi_to_card: false, // flag to open modal add kpi to card collection
            is_card_detail: false, // check xem có card nào đang xem detail hay không. mặc định chưa có
            card_detail_id: null,
            card_detail_list_kpi: [],
            card_detail_name: '',
            kpi_to_add_card : {},

            list_collection: [{
                id: 1,
                name: 'UX designer',
                id_vtcd: 1,
                total_kpi: 5,
                list_kpi: []

            }, {
                id: 2,
                name: 'Graphic Designer',
                id_vtcd: 2,
                total_kpi: 5,
                list_kpi: []

            }, {
                id: 3,
                name: 'Customer Service',
                id_vtcd: 3,
                total_kpi: 5,
                list_kpi: []

            },{
                id: 4,
                name: 'Tôi tạo tùy ý',
                id_vtcd: null,
                total_kpi: 5,
                list_kpi: []

            }],
            //end kpilib ver 2


            // EXTRA_FIELDS_KPI: [],

            show_icon_carret: false,
            resultSearch_infor: false,
            isLoading: false,
            currentPage: 1,
            pageSize: 25,
            pageCount: 5,
            status_kpi_lib: 'all',
            total_page: 0,
            storage_kpis: [],
            storage_kpis_template: [],
            data_kpi_editor: null,
            query_kpilib_modal: '',
            searched_kpis_lib: [],
            query_search_kpi_lib: '',
            selectedOptions: [],
            language_search: '',
            selectedOptionToShow: '',
            selectedParentOption: '',
            child_cate_to_show: [],
            options: [],
            kpi_to_view: {},
            info_search: gettext("All KPIs"),
            type_find: [{
                value: 'all',
                label: gettext('All')
            }, {
                value: 'name',
                label: gettext('KPI name')
            }, {
                value: 'measurement_method',
                label: gettext('Measurement methods')
            }, {
                value: 'objective',
                label: gettext('Target')
            }],
            // value_type_search: '',
            value_type_search: [],
            sort_type: '',



            selected_tags: "",
            next_url_kpi_lib: '',
            //searched_kpis: [], // same: searched_kpis_lib


        }
    },

    watch: {
        selected_tags: {
            handler: function (newVal, oldVal) {
                this.search_kpi_library();
            }
        },



        selectedOptions: {
            handler: function (val, oldVal) {
                if (val.length) {
                    this.resultSearch_infor = true;
                    this.status_kpi_lib = 'search_category'
                }
                this.get_option_to_show(val);
                this.get_parent_option_to_display();
                this.create_info_search();
            },
        },
        language_search: {
            handler: function (val, oldVal) {
                this.get_functions_by_language(val);
                this.status_kpi_lib = 'search';
                if (!val) {
                    if (!this.check_field_search()) {
                        this.status_kpi_lib = 'all';
                        // v.get_data_kpilib(null);
                        this.get_data_kpilib(null);
                    } else {
                        this.update_query_search()
                    }
                } else {
                    this.update_query_search()
                }
            }
        },
        sort_type: {
            handler: function (val, oldVal) {
                this.status_kpi_lib = 'sort';
                this.update_query_search()
            }
        },
        value_type_search: {
            handler: function (val, oldVal) {
                if (this.query_kpilib_modal.trim())
                    this.update_query_search()
            }
        },
        total_page: {
            handler: function (val, oldVal) {
                this.create_info_search()
            }
        },
        status_kpi_lib: {
            handler: function (val, oldVal) {
                this.create_info_search()
            }
        },
        storage_kpis: {
            handler: function (val, oldVal) {
                localStorage.setItem('history_search_kpi', JSON.stringify(val));
            }
        }
    },
    updated: function () {
        this.check_icon_carret_show();
        getQtip();
    },
    created: function () {
        this.storage_kpis = JSON.parse(localStorage.getItem('history_search_kpi')) || [];
        this.storage_kpis_template = this.storage_kpis;
    },
    mounted: function () {
        var that = this;
        this.addClassGoogleAnalytic();
        // get_data_kpilib for each time the modal show
        $('#modal-kpi-lib').on('show.bs.modal', function (e) {
            // alert('#modal-kpi-lib show');
            that.get_data_kpilib();
        })
    },
    methods: {
        search_kpi_input_focus:function(){
            $("#list_kpi_suggest").show();
            $(".arrow-up").show();
        },
        get_data_kpilib: function(page=1){
            //get all kpi in kpilib when query_kpilib: ' ',
            var self = this;
            var url = '/api/v2/kpilib/';
            if(page && page != 1 && self.next_url_kpi_lib){
                url = updateQueryStringParameter(self.next_url_kpi_lib,'page', page);
            }
            // self.searched_kpis = [];
            // self.searched_kpis_lib=[];
            cloudjetRequest.ajax({
                method: "GET",
                url: url,
                success: function (data) {
                    // self.searched_kpis = data.results;
                    self.searched_kpis_lib = data.results;
                    self.next_url_kpi_lib = data.next;
                    if(page==1){
                        // kpi_lib.count_search = data.count;
                        self.count_search = data.count;
                    }

                    //if(self.organization.enable_kpi_lib == true){
                     //   kpi_lib.isLoading = false;
                    //}

                    self.isLoading = false

                    // kpi_lib.total_page = data.count;
                    self.total_page = data.count;
                }
            });
            if(page==1){
                this.init_data_for_kpilib();
            }
        },

        init_data_for_kpilib: function(){
            var self = this;
            self.init_kpi_lib();

        },
        search_kpi_library: function (page=null) {
            var self = this;
            var url = `/api/v2/kpilib/search/?${self.query_search_kpi_lib}`;
            if(page != 1 && self.next_url_kpi_lib){
                url = updateQueryStringParameter(self.next_url_kpi_lib, 'page', page)
            }
            //self.searched_kpis = [];
            cloudjetRequest.ajax({
                method: "GET",
                url: url,
                success: function (data) {
                    //self.searched_kpis = data.results;
                    // self.$nextTick(function(){
                    //     self.searched_kpis_lib = data.results;
                    // });
                    self.searched_kpis_lib = data.results;
                    self.next_url_kpi_lib = data.next;
                    //if(self.organization.enable_kpi_lib == true)
                      //  kpi_lib.isLoading = false;
                    //kpi_lib.total_page = data.count;

                    self.isLoading = false;
                    self.total_page = data.count;
                }
            });
        },
          clear_history_kpi: function() {
            this.storage_kpis = [];
            this.storage_kpis_template = [];
            localStorage.setItem('history_search_kpi', null);
            $(".history-kpi").hide();
        },



        get_functions_by_language: function (lang) {
            var _this = this;
            cloudjetRequest.ajax({
                method: "GET",
                url: `/api/v2/kpilib/functions/?lang=${lang}`,
                success: function (res) {
                    _this.options = _this.format_functions(res);
                    if ($.isArray(_this.selectedOptions)) {
                        // selectedOptions has a array [1,3]. First item is id function and second item is id sub function
                        _this.$set(_this, 'selectedOptions', _this.selectedOptions.slice(0));
                    }
                }
            });
        },
        format_functions: function (functions) {
            options = [];
            functions.forEach(function(item){
                var category = {};
                category.label=`${item.name} (${item.count})`;
                category.value=item.id;
                category.children=[];
                if(item.childs.length){
                    item.childs.forEach(function(child){
                        var sub_category = {};
                        sub_category.label = `${child.name} (${child.count})`;
                        sub_category.value = child.id;
                        category.children.push(sub_category);
                    })
                }
                options.push(category)
            });
            return options
        },
        // Function for kpi collection
        add_kpi_to_collection: function(kpi){
            var self = this;
            self.flag_add_kpi_to_card = true;
            self.kpi_to_add_card = kpi;
        },
        addClassGoogleAnalytic: function () {
            if (!$('#tab-kpi-lib .cascader-func-cate .el-cascader__label').hasClass('LIB_DDL_CATEGORY')){
                $('#tab-kpi-lib .cascader-func-cate .el-cascader__label').addClass('LIB_DDL_CATEGORY')
            }
            if (!$('#input-search-kpi').hasClass('LIB_INPUT_SEARCH')){
                $('#input-search-kpi').addClass('LIB_INPUT_SEARCH')
            }
            if (!$('#input-type-search').hasClass('LIB_DDL_TYPE_SEARCH')){
                $('#input-type-search').addClass('LIB_DDL_TYPE_SEARCH')
            }
            if (!$('#kpi-lib-pagination .btn-prev .el-icon-arrow-left').hasClass('LIB_LINK_PREVIOUS_PAGE')){
                $('#kpi-lib-pagination .btn-prev .el-icon-arrow-left').addClass('LIB_LINK_PREVIOUS_PAGE')
            }
            if (!$('#kpi-lib-pagination .btn-next .el-icon-arrow-right').hasClass('LIB_LINK_NEXT_PAGE')){
                $('#kpi-lib-pagination .btn-next .el-icon-arrow-right').addClass('LIB_LINK_NEXT_PAGE')
            }
            if (!$('#kpi-lib-pagination .el-pager .number').hasClass('LIB_LINK_CHOOSE_PAGE')){

                $('#kpi-lib-pagination .el-pager .number').addClass('LIB_LINK_CHOOSE_PAGE')
            }
            if (!$('#kpi-lib-modal-wrapper .modal-footer .el-pagination__jump .el-input__inner').hasClass('LIB_INP_TO_PAGE')){
                $('#kpi-lib-modal-wrapper .modal-footer .el-pagination__jump .el-input__inner').addClass('LIB_INP_TO_PAGE')
            }
        },
        deleteCard: function(){
            var self = this;
            this.$confirm('Bạn có chắc chắn xóa '+ self.card_detail_name , '', {
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Đóng',
                type: 'warning',
                center: true,
                customClass: 'warning-del-card'
                }).then(function(){
                    // run api del card,

                    //then delete current
                    var data_temp = self.list_collection.filter(function (elm) {
                        return elm.id != self.card_detail_id;
                    });
                    self.list_collection = data_temp;
                    // then callback to list_card
                    self.clickBackCollection();

                });
        },
        triggerDismissModal: function () {
            var self = this;
            self.flag_open_modal = false;
            console.log("dissmissed")
        },
        triggerDismissModalAddKPI: function (){
            var self = this;
            self.flag_add_kpi_to_card = false;
            console.log("dissmissed")
        },
        updateEditCard: function(id, name){
            // update in list_card
            var self = this;
            var _index = null;
            self.list_collection.filter(function(elm,index){
                if( elm.id === id) _index = index;
            })
            self.list_collection[_index].name = name;

            // update in current_view_card
            self.card_detail_name = name;

        },
        openEditCard: function(){
            var self = this;
            self.flag_open_modal = true;
        },
        addNewCard: function(card){
            var self = this;
            self.list_collection.push(card);
        },
        clickBackCollection: function(){
            var self = this;
            self.card_detail_id = null;
            self.card_detail_list_kpi = [];
            self.card_detail_name = '';
            self.is_card_detail = false;

        },
        clickViewCard: function (id,name) {
            // run api to get list kpi for collection vtcd
            // now I set datatemp for list_kpi for a collection

            var self = this;
            var data_temp = [{
                id: 1,
                name: '% quản lý có kế hoạch phát triển khả năng lãnh đạo/ tổng số vị trí quản lý',
                tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                belong_vtcd: true,
            }, {
                id: 2,
                name: 'Chỉ số ngày vắng mặt của nhân viên',
                tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hà',
                belong_vtcd: true,
            }, {
                id: 3,
                name: 'Chỉ số ngày vắng mặt của nhân viên',
                tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                belong_vtcd: true,
            },
                {
                    id: 4,
                    name: 'Tỷ lệ trả lời khiếu nại khách hàng trong khoảng thời gian chuẩn',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    belong_vtcd: true,
                },
                {
                    id: 5,
                    name: 'Tỷ lệ nghỉ việc bắt buộc',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                    belong_vtcd: false,
                }, {
                    id: 6,
                    name: '% quản lý có kế hoạch phát triển khả năng lãnh đạo/ tổng số vị trí quản lý',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                    belong_vtcd: true,
                }, {
                    id: 7,
                    name: 'Chỉ số ngày vắng mặt của nhân viên',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là ',
                    belong_vtcd: true,
                }, {
                    id: 8,
                    name: 'Chỉ số ngày vắng mặt của nhân viên',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                    belong_vtcd: true,
                },
                {
                    id: 9,
                    name: 'Tỷ lệ trả lời khiếu nại khách hàng trong khoảng thời gian chuẩn',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    belong_vtcd: true,
                },
                {
                    id: 10,
                    name: 'Tỷ lệ nghỉ việc bắt buộc',
                    tag_item: 'Kế toán > Lập kế hoạch và báo cáo',
                    measurement_method: 'Đây là số lần nhân viên của bạn bị ốm hoặc không xuất hiện (Lưu ý: đây không phải là các kỳ nghỉ có thông báo trước hoặc hình thức nghỉ có trả lương) Những nhân viên vắng mặt thường không hài lòng với nơi họ làm việc. Thước đo này sẽ hữu ích nhất cho các tổ chức có hoạt động có thể bị ảnh hưởng đáng kể do tình hình nghỉ việc của nhân viên.',
                    belong_vtcd: false,
                }];
            //self.list_collection[id].list_kpi = data_temp; save to list_kpi in local to avoid reload when have database
            self.card_detail_id = id;
            self.card_detail_name = name;
            self.card_detail_list_kpi = data_temp;
            self.is_card_detail = true;
            // then show to card_detail

        },


        change_tab: function (value) {
            var self = this;
            self.activeTab = value;
        },
        create_info_search: function () {
            switch (this.status_kpi_lib) {
                case 'all':
                    this.info_search = gettext("All KPIs");
                    break;
                case 'search_category':
                    this.info_search = gettext("KPI belongs to ") + this.selectedOptionToShow;
                    break;
                case 'sort':
                    break;
                case 'search':
                    this.info_search = gettext("Found") + ` <b>${this.total_page}</b> ` + gettext("results");
                    break;
            }
        },
        init_kpi_lib: function() {
            this.options = this.format_functions(this.DEPARTMENTS);
            $("#option-choose-lang ul li:first").tab('show');
            this.query_search_kpi_lib = '';
            this.language_search = this.LANGUAGE_CODE;
            this.value_type_search = [];
            this.sort_type = '';
            this.query_kpilib_modal = '';
            // this.searched_kpis_lib = [];
            this.selectedOptions = [];
            this.child_cate_to_show = [];
            this.resultSearch_infor = false;
            this.status_kpi_lib = 'all';
            this.selectedOptionToShow = '';
            this.info_search = gettext("All KPIs");
            setTimeout(function () {
                $('#tab-kpi-lib .cascader-func-cate .el-cascader__label').text('');
            }, 100);
        },
        handleCurrentChange: function (val) {
            if (this.status_kpi_lib == 'all') {
                // v.get_data_kpilib(val);
                this.get_data_kpilib(val);
            } else {
                // v.search_kpi_library(val);
                this.search_kpi_library(val);
            }
            this.addClassGoogleAnalytic()
        },
        handle_click_search_history: function (history) {
            this.status_kpi_lib = 'search';
            this.query_kpilib_modal = history;
            this.update_query_search();
        },
        filter_history: function () {
            that = this;
            this.storage_kpis_template = this.storage_kpis.filter(function (item) {
                return item.indexOf(that.query_kpilib_modal) != -1;
            });
        },
        check_field_search: function () {
            return this.query_kpilib_modal || this.selectedOptions.length || this.language_search;
        },
        update_query_search: function () {
            this.isLoading = true;
            this.currentPage = 1;
            this.searched = true;
            // v.next_url_kpi_lib = '';
            this.next_url_kpi_lib = '';
            this.query_search_kpi_lib = $.param({
                extend_type: this.value_type_search.length ? this.value_type_search[0] : 'all',
                extend_value: this.query_kpilib_modal,
                sub_category: this.selectedOptions.length ? this.selectedOptions[1] : '',
                lang: this.language_search,
                sort: this.sort_type
            });
            if (this.query_search_kpi_lib.split('=&').length - 1 == 4 && !this.sort_type) {
                // v.get_data_kpilib();
                this.get_data_kpilib();
                this.status_kpi_lib == 'all'
            } else {
                // v.search_kpi_library();
                this.search_kpi_library();
                this.resultSearch_infor = true;
                if (this.storage_kpis.indexOf(this.query_kpilib_modal) == -1 && this.query_kpilib_modal.trim()) this.storage_kpis.push(this.query_kpilib_modal);
            }
        },
        selected_sub_menu: function (sub_id) {
            this.selectedOptions[1] = sub_id;
            this.status_kpi_lib = 'search_category';
            this.get_parent_option_to_display();
            this.create_info_search();
            this.update_query_search();
        },
        check_icon_carret_show: function () {
            if ($('#show-child-cate .list-inline').height() > 28) {
                this.show_icon_carret = true;
            }
            else {
                this.show_icon_carret = false;

            }
        },
        handleChange: function(value) {
            console.log(value)
        },
        set__kpi_to_view: function (k) {
            this.kpi_to_view = k;
            $('#modal-kpi-lib-details').modal('show');
            $('#modal-kpi-lib-details').appendTo('body');
        },
        add_selected_kpilib: function (k) {
            this.$root.$emit('add_new_kpi_from_kpi_lib', k);
            // v.add_selected_kpilib(k);
        },
        get_option_to_show: function (selected) {

            this.child_cate_to_show = this.options.filter(function (item) {
                return item.value == selected[0]
            })
            this.child_cate_to_show = this.child_cate_to_show.length ? this.child_cate_to_show[0].children : [];
        },
        get_parent_option_to_display: function () {
            var self = this;
            this.options.forEach(function (item) {
                if (item.value == self.selectedOptions[0]) {
                    self.selectedParentOption = item.label;
                    item.children.forEach(function (_item) {
                        if (_item.value == self.selectedOptions[1]) {
                            self.selectedOptionToShow = _item.label.replace(_item.label.match(/\(\d+\)/), '');
                        }
                    })
                }
            });
            setTimeout(function () {
                $('#tab-kpi-lib .cascader-func-cate .el-cascader__label').text(self.selectedParentOption);
            }, 0);
        },
        setLocalStorage: function () {
            var text = this.query_kpilib_modal;
            if (this.query_kpilib_modal.length > 0) {
                var local_store = (JSON.parse(localStorage.getItem('history_search_kpi')) != null) ? JSON.parse(localStorage.getItem('history_search_kpi')) : [];
                local_store.push(text);
                localStorage.setItem('history_search_kpi', JSON.stringify(local_store));
                this.storage_kpis = JSON.parse(localStorage.getItem('history_search_kpi'));
            }
        }
    }
});



