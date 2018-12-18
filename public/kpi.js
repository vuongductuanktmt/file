function approve_kpi(kpi_id, status) {
  //  alert(status);

    $.post('/api/approve_kpi/' + kpi_id + "/" + status + "/").success(function (data) {
        $('#approve_kpi_' + kpi_id).html(data);

    })
}