Vue.filter('dateFormatLocale', function (value, lang_code='vi') {
    if (value) {
        if (lang_code == 'en') return moment(value).format('MM/DD/YYYY')
        if (lang_code == 'vi') return moment(value).format('DD/MM/YYYY')
    }
});