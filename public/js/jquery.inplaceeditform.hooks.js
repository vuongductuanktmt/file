
$.extend($.inplaceeditform.inplaceManager, {
    enable: function () {
        $(".inplaceedit").inplaceeditform($.inplaceeditform.inplaceManager.options).enable();
    },
    disable: function () {
        $(".inplaceedit").inplaceeditform($.inplaceeditform.inplaceManager.options).disable();
    }
});

$.inplaceeditform.extend({
    autoSaveCallBack: function () {
            var self = $.inplaceeditform;
            var form = this.tag.parents(self.formSelector);
            var newValue = self.methods.getValue(form);
            if (newValue !== this.oldValue) {
                //duan customize
                if(typeof ($(form).data('delay')) != typeof undefined) {

                    clearTimeout(($(form).data('timeout_id')));

                    var that = this;
                    $(form).data('timeout_id', setTimeout(function () {
                        that.tag.parents(self.formSelector).find(".apply").get(0).click();
                    }, $(form).data('delay')));
                }else {
                    console.log('callback');
                    //this.tag.parents(self.formSelector).find(".apply").click();
                    this.tag.parents(self.formSelector).find(".apply").get(0).click();
                }
            } else {
                //this.tag.parents(self.formSelector).find(".cancel").click();
                this.tag.parents(self.formSelector).find(".cancel").get(0).click();
            }
        }
});
