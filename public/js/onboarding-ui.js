$(document).ready(function(){
   $('.img-introduce').css('width', $(document).width());
   $('.img-introduce').css('height', $(document).height());
});

$(document).ready(function(){
   $('#next-01').click(function(){
       $('#img-introduce-01').css('display', 'none');
       $('#img-introduce-02').css('display', 'block');
   });
   $('#back-02').click(function(){
       $('#img-introduce-01').css('display', 'block');
       $('#img-introduce-02').css('display', 'none');
   });
   $('#next-02').click(function(){
       $('#img-introduce-02').css('display', 'none');
       $('#img-introduce-03').css('display', 'block');
   });
   $('#back-03').click(function(){
       $('#img-introduce-02').css('display', 'block');
       $('#img-introduce-03').css('display', 'none');
   });
   $('#next-03').click(function(){
       $('#img-introduce-03').css('display', 'none');
       $('#img-introduce-04').css('display', 'block');
   });
   $('#back-04').click(function(){
       $('#img-introduce-03').css('display', 'block');
       $('#img-introduce-04').css('display', 'none');
   });
   $('#next-04').click(function(){
       $('#img-introduce-04').css('display', 'none');
       $('#img-introduce-05').css('display', 'block');
   });
   $('#back-05').click(function(){
       $('#img-introduce-04').css('display', 'block');
       $('#img-introduce-05').css('display', 'none');
   });
   $('#next-05').click(function(){
       $('#img-introduce-05').css('display', 'none');
       $('#img-introduce-06').css('display', 'block');
   });
   $('#back-06').click(function(){
       $('#img-introduce-05').css('display', 'block');
       $('#img-introduce-06').css('display', 'none');
   });
   $('#next-06').click(function(){
       $('#img-introduce-06').css('display', 'none');
       $('#img-introduce-07').css('display', 'block');
   });
   $('#back-07').click(function(){
       $('#img-introduce-06').css('display', 'block');
       $('#img-introduce-07').css('display', 'none');
   });
   $('#next-08').click(function(){
       $('#img-introduce-08').css('display', 'none');
       $('#img-introduce-09').css('display', 'block');
   });
   $('#back-09').click(function(){
       $('#img-introduce-08').css('display', 'block');
       $('#img-introduce-09').css('display', 'none');
   });
   $('#next-09').click(function(){
       $('#img-introduce-09').css('display', 'none');
       $('#img-introduce-10').css('display', 'block');
   });
   $('#back-10').click(function(){
       $('#img-introduce-09').css('display', 'block');
       $('#img-introduce-10').css('display', 'none');
   });
});

$(document).ready(function(){
   $('#onboarding-tess-button').click(function (){
       if($('#ob-chesk-box label.tr input:checked').length===2 && $('#ob-chesk-box label.fl input:checked').length===0){
           $('#ob-tr-noti').css('display', 'block');
           $('#ob-fl-noti').css('display', 'none');
           $('#onboarding-tess-fn').css('display', 'block');
           $('#onboarding-tess-button').css('display', 'none');
       }
       else{
           $('#ob-fl-noti').css('display', 'block');
           $('#ob-tr-noti').css('display', 'none');
       }
   });
});
