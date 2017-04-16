//TODO ASAP fix the miller rabin explanation
//preserve THE HTML STATE
//use pager instead of button on rsa?
//min for range
//change how it gets the data in bootstrap alert asap

//DONE constraint in d page
// confidence in miller rabin page
// some text enchancements
// get length dynamically
//make the 3rd party lib locally
//add random number~~
//------
//say total random prime, then list some of them
//implement the prime random 1 at a time, not both of them
//create explanation for normal also !!!
//FIXED BUG

//NEED TO BE TESTED
//create CRT - done, not tested
//init value  

//BUG:
// INPUT 1-2 2 AW
// range << text???
// wrong range still can generate? --> if you mess with the first input, then mess with another but correct, it would enable generate -- fix logic
$(document).ready(function () {

  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
      button_inp = $('#btn-input'),

      button_exp = $('#btn-exp'),
      button_key = $('#btn-keygen'),
      button_enc = $('#btn-encrypt'),
      // button_dec = $('#btn-decrypt'),
      button_calc = $('#btn-calc'),
      button_conv = $('#btn-conv'),
      button_MRcalc = $('#btn-MRcalc'),
      button_show=$('#btn-show'),
      button_CRT = $('#btn-CRT'),
      button_rand = $('#btn-CRTR'),
      button_euclid = $('#btn-Euclidcalc'); 

      //rabbin miller demo purposes
      count_bef = -1,
      isClosed = false,
      MRMessage = [],
      EuclidMessage="",
      d_flag = true,
      flag_sub_test = true,
      modify_flag = false;

  sessionStorage.setItem('modify',modify_flag);
  sessionStorage.setItem('flag',d_flag);
  sessionStorage.setItem('flag_sub',flag_sub_test);
  sessionStorage.setItem('count',count_bef);
  sessionStorage.setItem('message',JSON.stringify(MRMessage));
  sessionStorage.setItem('euclid',EuclidMessage);

  //to enable generate when come back from other html
  if($('#inputRange').length != 0 && $('#input9').length != 0 && $('#inputMessage').length != 0){
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val();

    if(inputRange.length !==0 || input9.length !== 0|| inputMessage.length !== 0 ){
      button_inp.prop('disabled',false);
    }
  }

   button_inp.click(function() {
    // localStorage.setItem('flag_exp',true);
     
    var flag = bootstrap_alert.explanation();
    if (flag == false){
      $('#splitter').hide();
      $('#result').hide(); 
      return false;
    }
    else {
      $('#splitter').show();
      bootstrap_alert.fade('#alert_general  ');
    } 
    var length = sessionStorage.getItem('length');
    var ciphertext = split_cipher($('#inputMessage').val(),parseInt(length));
    var numof9 = parseInt($('#input9').val());
    var round = RSA.Miller_Rabin.confidence(numof9);
    var prime1 = sessionStorage.getItem('prime1');
    var prime2 = sessionStorage.getItem('prime2');
    var e = RSA.gcd(prime1,prime2);
    var calc = RSA.calc(e[0],prime1,prime2,ciphertext[0]);
    var enc = '';
    var dec ='';
    var convert = RSA.convert_text(ciphertext[0]);

    RSA.CRT(bigInt(prime1),bigInt(prime2),bigInt(calc[2]),bigInt(calc[3]));

    sessionStorage.setItem('e',e[0]);
    sessionStorage.setItem('Φn',calc[1].toString());
    sessionStorage.setItem('num9',numof9);
    sessionStorage.setItem('cipher',ciphertext[0]);
    $('#e').text(e[0]);
    var msg = '';
    for (i=0;i<e.length;i++){
      msg += '<li id =e'+i+'><a>'+e[i]+'</a></li>\n';
    }
    console.log(msg);
    $('#e_drop').html(msg);

    $('#p').html("<a href='./calculation.HTML' class='link'>" + prime1.toString()+'</a>');
    $('#q').html("<a href='./calculation.HTML' class='link'>" + prime2.toString()+'</a>');
    $('#n').text(calc[0]);
    $('#Φn').text(calc[1]);
    $('#d').html("<a href='./calculation_euclid.HTML' class='link'>" +calc[2]+'</a>');
    $('#cipher').text(ciphertext[0]);
    $('#converted').text(convert);
    $('#encrypted').text(calc[3]);
    $('#decrypted').text(calc[4]);

    for (var i = 0; i<ciphertext.length;i++){
      enc += RSA.calc(e[0],prime1,prime2,ciphertext[i])[3].toString();
      dec += RSA.calc(e[0],prime1,prime2,ciphertext[i])[4].toString();
    }

    $('#encryptedf').text(enc);
    $('#decryptedf').text(dec);
    // return true;    
   });

   button_exp.click(function() {
    // localStorage.setItem('flag_res',true);
    $('#CRT').show();
    bootstrap_alert.CRT();
    $('#Norm').show();
    bootstrap_alert.norm();
    $('#result').show();
    // return true; 
   })

    // sync the input from rsa to calc html
    if (document.getElementById("p_calc") != null && document.getElementById("num9") != null) {
      if(sessionStorage.getItem('prime1') != null && sessionStorage.getItem('num9') != null){
        document.getElementById("p_calc").value = (sessionStorage.getItem('prime1')).toString();  
        document.getElementById("num9").value = (sessionStorage.getItem('num9'));
      }
    }

    // sync the input from rsa to calc_euclid html
    if (document.getElementById("e_calc") != null && document.getElementById("Φn_calc") != null) {
      if(sessionStorage.getItem('e') != null && sessionStorage.getItem('Φn') != null){
        document.getElementById("e_calc").value = (sessionStorage.getItem('e'));  
        document.getElementById("Φn_calc").value = (sessionStorage.getItem('Φn'));
      }
    }

    button_MRcalc.on('click',function(){
       $('#collapse').show();
      // $('#btn-show').prop('disabled',false);
      // $('#collapse').collapse('hide');
      // $('#collapse1').collapse('hide');
      // $('#collapse2').collapse('hide');
      // $('#collapse3').collapse('hide');

      var p =$('#p_calc').val();
      var q =$('#q_calc').val();
      var numof9 = $('#num9').val();
      var round = RSA.Miller_Rabin.confidence(numof9);
      var degree = convertconf(numof9);
      RSA.clean();
      RSA.Miller_Rabin.MultiRounds(p,round);
      var para ='';
      var message = JSON.parse(sessionStorage.getItem('message'));
      // console.log(message[0]);
      var index =0;
      while(typeof message[index] !='undefined' && message[index].length>0 ){
        if(index >= message.length) break;  
        var para = para + message[index];
        index++;
    }
      $('#step_p').html('<pre>'+para +'</pre>');

      //for q
      RSA.clean();
     });
    
  // give restriction as well for the input, especially e w.r.t tao
  // add gcd steps? later on
   button_euclid.on('click',function() {
      
      // $('#btn-show').prop('disabled',false);
      // $('#collapse').collapse('hide');
      // $('#collapse1').collapse('hide');
      var e =bigInt($('#e_calc').val());
      var Φn =bigInt($('#Φn_calc').val());
      
      sessionStorage.setItem('euclid',EuclidMessage);
      var message = "The Extended Euclidean algorithm(EED) is essentially the Euclidean algorithm (for GCD's) ran backwards.\n" +
                    "The goal by using EED is to find private key exponent(d) such that e*d ≡ 1(modφ(n)).\n\n" +
                    "Recall that EED calculates x and y such that ax+by=gcd(a,b).\n" +
                    "For a=e and b=φ(n) ===>gcd(e,φ(n))=1 by definition (a and b need to be coprime for the inverse to exist in the first place).\n" +
                    "Then you have:\n" +
                    "ex + φ(n)y = 1\n" +
                    "Take modulo φ(n):\n" +
                    "ex ≡ 1(modφ(n))\n" +
                    "And it's easy to see that in this case, x=d. \n" +
                    "The toString() of y does not actually matter, since it will get eliminated modulo φ((n) regardless of its toString().\n\n" +
                    "Thus, for e= "+e.toString()+" ,and Φn= "+Φn.toString()+" :(GCD steps first, then EED)\n";
      sessionStorage.setItem('euclid',message);
      
      var d = RSA.Euclid_gcd(Φn,e);
      if (d[2] != 1) {
         $('#collapse').hide();
        bootstrap_alert.warning('#alert_euclid','the GCD for Φn and e is not 1, can\'t find the inverse!!');
      }
      else if(e<3 || bigInt(e).greater(bigInt(Φn)) == true){
         $('#collapse').hide();
        bootstrap_alert.warning('#alert_euclid','e must be bigger than 3, and lower than Φn!!');
      }
      else {
        bootstrap_alert.fade('#alert_euclid');
        $('#collapse').show();
      }
      var temp = Φn.plus(d[1]);
      var message = sessionStorage.getItem('euclid');
      message +="From the EED above, we can conclude that x = " + d[1].toString() +", which is in fact d= "+ temp.toString() +" before modded by " + Φn.toString() +".\n\n" +
      "The basic idea is to use the successive remainders of the GCD calculation to substitute the initial integers\n" +
      "back into the final equation (the one which equals 1) which gives the desired linear combination.";
      $('#step_euclid').html('<pre>'+message+"<pre>");
    });
  
  $('#CRTPager').on('click',function() {
    $('#CRT').show();
    bootstrap_alert.CRT();
  });

  $('#NormPager').on('click',function() {
    $('#Norm').show();
    bootstrap_alert.norm();
  });

  // $('#inputRange').keyup(function() {
  //   var inputRange =$('#inputRange').val(),
  //       input9 =$('#input9').val(),
  //       inputMessage =$('#inputMessage').val(),
  //       regex_range = /^(\d)*-(\d)*$/,
  //       tag_out = '#alert_range',
  //       message = 'Please input an integer!';
    
  //   if(isNaN(inputRange) || regex_range.exec(inputRange) == null){
  //     bootstrap_alert.warning(tag_out,message);
  //     button_inp.prop('disabled',true);
  //   }
  //   else {
  //     bootstrap_alert.fade(tag_out);
  //     button_inp.prop('disabled',false);
  //   }

  //   if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0 ){
  //     button_inp.prop('disabled',true);
  //   }
  //   // else{
  //   //   button_inp.prop('disabled',false);
  //   // }
  // })
  $('#inputRange').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        regex_range = /^(\d)+-(\d)+$/,
        tag_out = '#alert_range',
        message = 'Please input an integer!';

    if(regex_range.exec(inputRange) == null){
      message ='please input the correct format(number-number)!';
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else if(parseInt(inputRange.split('-')[0]) > parseInt(inputRange.split('-')[1]) || parseInt(inputRange.split('-')[0]) > 20 || parseInt(inputRange.split('-')[1]) > 20){
      message ='cannot exceed 20 digits and please input lower range to higher range!';
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else {
      bootstrap_alert.fade(tag_out);
      button_inp.prop('disabled',false);
    }
    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0){
      button_inp.prop('disabled',true);
    }
  })

  $('#input9').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        regex = /\D/,
        tag_out = '#alert_confidence',
        message = 'Please input an integer!';

    if(isNaN(input9) || regex.exec(input9) !== null){
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else if (parseInt(input9) > 17){
      message="cannot exceed 17!";
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else {
      bootstrap_alert.fade(tag_out);
      button_inp.prop('disabled',false);
    }

    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0){
      button_inp.prop('disabled',true);
    }
  })
  
  $('#inputMessage').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        regex = /\D/,
        tag_out = '#alert_confidence',
        message = 'Please input an integer!';
    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0){
      button_inp.prop('disabled',true);
    }
    else{
      button_inp.prop('disabled',false);
    }
  })
  $('#splitted').on('click','a.link', function (e) {
      // e.preventDefault();
      //Get the id of parent container of anchor tag here
      // alert(this.parentNode.id);
      var tag = this.parentNode.id;
      var reg = /div[0-9]+/;
      console.log(tag);
      console.log(reg);
      console.log(reg.test(tag));

      if (reg.test(tag)==true){
      var primerand = ($('#'+tag).text()).trim();
      sessionStorage.setItem('prime1',primerand);
      }
      else{
      var ciphernum = ($('#'+tag).text()).trim();
      sessionStorage.setItem('ciphernum',ciphernum);
      bootstrap_alert.modal();
      }

    })

    $('#p').on('click','a.link', function (e) {
      var primerand = ($('#p').text()).trim();
      sessionStorage.setItem('prime1',primerand);
    })

    $('#q').on('click','a.link', function (e) {
      var primerand = ($('#q').text()).trim();
      sessionStorage.setItem('prime1',primerand);
    })

    $("#btn-msg").on('click', function(e) {
      var msg = document.getElementById("cipher").value;
      var length = sessionStorage.getItem('length');
      if (msg.length > parseInt(length) ) {
        $('#btn-msg').attr("data-toggle","modal");
        console.log('z');
        var msg = "Please input a plaintext that has length within 1 to " + length + "\n";
        $('#messages').html('<p>' + msg + '</p>');
      }
      else {
        var modify_flag = true;
        sessionStorage.setItem('modify',modify_flag);
        $('#btn-msg').removeAttr("data-toggle");
        console.log(msg); 
        var numof9 = parseInt($('#input9').val());
        var round = RSA.Miller_Rabin.confidence(numof9);
        var prime1 = sessionStorage.getItem('prime1');
        var prime2 = sessionStorage.getItem('prime2');
        var e =  $('#e').text();
        var calc = RSA.calc(e,prime1,prime2,msg);
        var enc = '';
        var dec ='';
        var convert = RSA.convert_text(msg);

        RSA.CRT(bigInt(prime1),bigInt(prime2),bigInt(calc[2]),bigInt(calc[3]));

        sessionStorage.setItem('e',e);
        sessionStorage.setItem('Φn',calc[1].toString());
        sessionStorage.setItem('num9',numof9);
        sessionStorage.setItem('cipher',cipher);
        $('#p').html("<a href='./calculation.HTML' class='link'>" + prime1.toString()+'</a>');
        $('#q').html("<a href='./calculation.HTML' class='link'>" + prime2.toString()+'</a>');
        $('#n').text(calc[0]);
        $('#Φn').text(calc[1]);
        $('#d').html("<a href='./calculation_euclid.HTML' class='link'>" +calc[2]+'</a>');
        $('#converted').text(convert);
        $('#encrypted').text(calc[3]);
        $('#decrypted').text(calc[4]);
        $('#encryptedf').text(calc[3]);
        $('#decryptedf').text(calc[4]);
        bootstrap_alert.CRT();
        bootstrap_alert.norm();
      }
    })


    $('#dropdown').on('click','li',function(){
      var tag = this.id;
      $('#e').text($('#'+tag).text());
      var msg = document.getElementById("cipher").value;
      var numof9 = parseInt($('#input9').val());
      var round = RSA.Miller_Rabin.confidence(numof9);
      var prime1 = sessionStorage.getItem('prime1');
      var prime2 = sessionStorage.getItem('prime2');
      var e =  $('#e').text();
      var calc = RSA.calc(e,prime1,prime2,msg);
      var enc = '';
      var dec ='';
      var convert = RSA.convert_text(msg);


      RSA.CRT(bigInt(prime1),bigInt(prime2),bigInt(calc[2]),bigInt(calc[3]));

      sessionStorage.setItem('e',e);
      sessionStorage.setItem('Φn',calc[1].toString());
      sessionStorage.setItem('num9',numof9);
      sessionStorage.setItem('cipher',cipher);
      $('#e').text(e);
      $('#p').html("<a href='./calculation.HTML' class='link'>" + prime1.toString()+'</a>');
      $('#q').html("<a href='./calculation.HTML' class='link'>" + prime2.toString()+'</a>');
      $('#n').text(calc[0]);
      $('#Φn').text(calc[1]);
      $('#d').html("<a href='./calculation_euclid.HTML' class='link'>" +calc[2]+'</a>');
      $('#converted').text(convert);
      $('#encrypted').text(calc[3]);
      $('#decrypted').text(calc[4]);
      var flag = sessionStorage.getItem('modify');
      if (flag == true){
        var ciphertext = split_cipher($('#inputMessage').val(),parseInt(length));    
        for (var i = 0; i<ciphertext.length;i++){
          enc += RSA.calc(e[0],prime1,prime2,ciphertext[i])[3].toString();
          dec += RSA.calc(e[0],prime1,prime2,ciphertext[i])[4].toString();
        }
      }
      else{
        enc = calc[3];
        dec =calc[4];
      }
      $('#encryptedf').text(enc);
      $('#decryptedf').text(dec);
      bootstrap_alert.CRT();
      bootstrap_alert.norm();
    })
  
  //MR calculation checks for textarea
  $('#num9').keyup(function() {
    var input9 = document.getElementById("num9").value,
        inputRange = document.getElementById("p_calc").value,
        regex = /\D/,
        tag_out = '#alert_confMR',
        message = 'Please input an integer!',
        button_inp = $('#btn-MRcalc');

    if(isNaN(input9) || regex.exec(input9) !== null){
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else if (parseInt(input9) > 17){
      message="cannot exceed 17!";
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else {
      bootstrap_alert.fade(tag_out);
      button_inp.prop('disabled',false);
    }

    if(inputRange.length ===0 || input9.length === 0){
      bootstrap_alert.warning(tag_out,message);
    button_inp.prop('disabled',true);
    }
  })

  $('#p_calc').keyup(function() {
    var input9 = document.getElementById("num9").value,
        inputRange = document.getElementById("p_calc").value,
        regex = /\D/,
        tag_out = '#alert_confMR',
        message = 'Please input an integer!',
        button_inp = $('#btn-MRcalc');

    if(isNaN(inputRange) || regex.exec(inputRange) !== null){
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else {
      bootstrap_alert.fade(tag_out);
      button_inp.prop('disabled',false);
    }

    if(inputRange.length ===0 || input9.length === 0){
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
  })



































   button_calc.on('click',function(){
    var num = $('#convert').text(),
        tag = '#alert_modulo',
        message = '<strong>Warning!</strong> your modulus (n) is smaller than the encrypted message!',
        tag_gcd = '#alert_gcd',
        message_gcd = 'the public key toString()(e) must be within [3,Φn) and has a greatest common divisor of 1 with Φn!',
        tag_miller_p = '#alert_miller_p',
        message_miller_p = '<strong>Warning!</strong> your modulo (p) is a composite number',
        tag_miller_q = '#alert_miller_q',
        message_miller_q = '<strong>Warning!</strong> your modulo (q) is a composite number',
        flag_gcd,flag_MR_p,flag_MR_q,flag_modulo = false;

    //this will verify if the input for e,p,q are integers or not
    if (!RSA.verify()) {
      $('#n').val('');
      $('#Φn').val('');
      $('#d').val('');
      bootstrap_alert.fade(tag);
    }

    //calculate the following using the inputs
    $('#n').val(RSA.calc()[0]);
    $('#Φn').val(RSA.calc()[1]);
    $('#d').val(RSA.calc()[2]);
    var e = $('#e').val(),
        n = $('#n').val(),
        Φn = $('#Φn').val(),
        p =$('#p').val(),
        q =$('#q').val(),
        e_big = bigIntconv(e),
        Φn_big = bigIntconv(Φn),
        p_big = bigIntconv(p),
        q_big = bigIntconv(q);
    // if the public key inputted is less than 3 or does not have gcd of 1 with the tao, alert the user

    if (!equalsInt(GCD(e_big,Φn_big),1) || greater(int2bigInt(3,1,1),e)) {
      flag_gcd = false;
      bootstrap_alert.warning(tag_gcd,message_gcd);
    }
    else{
      flag_gcd = true;
      bootstrap_alert.fade(tag_gcd);
    }

    // if the modulo(n) number is lesser than the encrypted, alert the user
    if (greater(bigIntconv(num),bigIntconv(n))) {
      flag_modulo = false;
      
      bootstrap_alert.warning(tag,message);
    }
    else{
      flag_modulo = true;
      bootstrap_alert.fade(tag);
      $('#btn-keygen').prop('disabled',false);
    }

    // rabin-miller
    var MR_p = RSA.Miller_Rabin.MultiRounds(p,30);
    var MR_q = RSA.Miller_Rabin.MultiRounds(q,30);
    if (MR_p !==true) {
      flag_MR_p = false;
      if(isNaN(MR_p)) {
        message_miller_p = MR_p;
      }
      bootstrap_alert.warning(tag_miller_p,message_miller_p);
    }
    else{
      flag_MR_p = true;
      message_miller_p = 'your modulo(p) is a probable prime with 99.9% confidence';
      bootstrap_alert.success(tag_miller_p,message_miller_p);
    }

    if (MR_q!==true) {
      flag_MR_q = false;
      if(MR_q.length > 5 ) {
        message_miller_q = MR_q;
      }
      bootstrap_alert.warning(tag_miller_q,message_miller_q);
    }
    else{
      flag_MR_q= true;
      message_miller_q = 'your modulo(p) is a probable prime with 99.9% confidence';
      bootstrap_alert.success(tag_miller_q,message_miller_q);
    }

    // for disabling/enabling the next button
    if (flag_gcd == false || flag_MR_p == false || flag_MR_q == false || flag_modulo == false) $('#btn-keygen').prop('disabled',true);
    else $('#btn-keygen').prop('disabled',false);
  });

   button_key.click(function() {
    var e =$('#e').val(),
        p =$('#p').val(),
        q =$('#q').val(),
        n =$('#n').val(),
        enc = RSA.calc()[3],
        msg = $('#inp').val();
    $('#e-out').text(e);
    $('#p-out').text(p);
    $('#q-out').text(q);
    $('#n-out').text(n);
    $('#out').text($('#convert').text()); 
    $('#enc-out').text(enc);
      
  });

   button_enc.click(function() {
    var enc = $('#enc-out').text(),
        dec = RSA.calc()[4],
        msg = $('#inp').val(),
        d =$('#d').val(),
        n =$('#n').val();

    $('#encrypted').text(enc);
    $('#n-out2').text(n);
    $('#d-out').text(d); 
    $('#result2').text(dec);
    $('#converted').text(msg);
   });

   //for MR demo button

  


  
  trigger.click(function () {
    hamburger_cross();      
  });

  // function isNumeric(num){
  //   return !isNaN(num);
  // }

  function hamburger_cross() {

    if (isClosed == true) {          
      overlay.hide();
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
      isClosed = false;
    } else {   
      overlay.show();
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
      isClosed = true;
    }
}
$('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
  
  //to convert twos complement of negative bigInt into positive
  //return bigInt type
  function twos_complement(a) {
    var result = "";
    for ( var i = 0; i < a.length ; i++) {
      if(a.charAt(i) == '0') {
        result +=1;
      }
      else{
        result +=0;
      }
    }
    var twos = str2bigInt(result,2,result.length);
    var one = int2bigInt(1,1,1);
    add_(twos,one);
    
    return twos;

  }

  function convertconf(num) {
    var per = '0.';
    for (var i =0;i<num;i++){
      per +=9;
    }
    if (num<2) num = 2;
    var temp = (parseFloat(per) * 100).toFixed(num-2);
    per = temp.toString() +'%';
    return per;
  }

  // function getLength(n,msg) {
  //   // console.log('hai starting');
  //   var flag = false;
  //   if (!bigInt.isInstance(n)) var p =bigInt(n);
  //   else var p = n;
  //   for(var i=1;i<msg.length;i++){
  //     var split = split_cipher(msg,i);
  //     var enc = RSA.convert_text(split[0]);
  //     if(p.lesser(bigInt(enc))){
  //       console.log('aa');
  //       flag = true;
  //       break;
  //     }
  //   }
  //   if (flag == false){
  //     var tag = '#alert_general';
  //     var message = 'range for prime inputted are less than the range for the converted message! Please select the new range';
  //     bootstrap_alert.warning(tag,message);
  //     return false;
  //   }
  //   var cand = i-1;
  //   var j = 0;
  //   while(cand > 0){
  //     if (j < split.length){
  //       var split = split_cipher(msg,cand);
  //       var enc = RSA.convert_text(split[j]);
  //       var bool = p.lesser(bigInt(enc));
  //       // console.log(p.toString());
  //       // console.log(enc);
  //       if (bool==true) {
  //         cand -=1;
  //         j = -1;
  //       }
  //       j++;
  //     }
  //     else break;
  //   }
  //   return true;
  //   sessionStorage.setItem('length',cand);
  // }
  // if (j < split.length){

  function getLength(n,msg) {
    if (!bigInt.isInstance(n)) var p =bigInt(n);
    else var p = n;
    for(var i=1;i<msg.length;i++){
      var split = split_cipher(msg,i);
      var enc = RSA.convert_text(split[0]);
      if(p.lesser(bigInt(enc))){
        
        break;
      }
    }
    var cand = i-1;
    var j =0;
    var temp = split;
    while(cand > 0){
      if (j < temp.length){
        var split = split_cipher(msg,cand);
        var enc = RSA.convert_text(split[j]);
        var bool = p.lesser(bigInt(enc));
        if (bool==true) {
          cand -=1;
          j = 0;
        }
        j++;
      }
      else break;
    }
    if (cand <= 0){
      var tag = '#alert_general';
      var message = 'range for prime inputted are less than the range for the converted message! Please select the new range';
      bootstrap_alert.warning(tag,message);
      return false;
    }
    sessionStorage.setItem('length',cand);
    return true;
  }

  bootstrap_alert = function() {}
  bootstrap_alert.warning = function(tag,message) {
    $(tag).show();
    $(tag).html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-hide="alert" aria-label="close" data-dismiss="alert">&times;</button>'+ message + '</div>')
  }
  bootstrap_alert.success = function(tag,message){
    $(tag).show();
    $(tag).html('<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-hide="alert" aria-label="close" data-dismiss="alert">&times;</button>'+ message + '</div>')
  }
  bootstrap_alert.fade = function(tag) {
    $(tag).hide();
  }

  bootstrap_alert.explanation = function() {
    var cipher = $('#inputMessage').val();
    // var split = parseInt($('#inputLength').val());
    var numof9 = $('#input9').val();
    var round = RSA.Miller_Rabin.confidence(numof9);
    var primes = bigInt(RSA.Miller_Rabin.Prime($('#inputRange').val(),round));
    sessionStorage.setItem('prime1',primes[0]);
    sessionStorage.setItem('prime2',primes[1]);
    var n =bigInt(primes[0].toString()).multiply(primes[1].toString());
    var flag = getLength(n,cipher);
    if (flag == false) return false;
    var split = sessionStorage.getItem('length');
    var arr = split_cipher(cipher,parseInt(split));
    
    var numof9 = $('#input9').val();
    var degree = convertconf(numof9);
    var count = sessionStorage.getItem('prime_count');
    sessionStorage.setItem('degree',degree);
    var message ="With the Plaintext (" + cipher +"),\nit will be splitted into several Ciphertexts,each with length of "+ split + ".\n";
    message +="it is "+ split + " because based on the prime number range that is provided and the ciphertext,\n"+ split+" is the minimum number to make sure that modulo n is still bigger than the ciphertext.\n";
    message +="In addition, the modulo is tested against each length candidate by splitting the ciphertext using the candidate.\n";
    message +="if all of the ciphertexts are smaller than modulo n, then it will increase the value of candidate by 1 \nuntil the next candidate produces ciphertexts that are bigger than n.\n";
    message += "Thus, the Plaintext would be splitted into:\n";
    for (var i = 0; i<arr.length;i++) {
      message += arr[i] + ";" + "<div data-toggle='modal' data-target='#exp_modal' id=modal"+i+"><a href='#' class='link'>"+ RSA.convert_text(arr[i]) +"</a></div>";
    }
    message +="\n";
    message +="Since the number of 9 for the confidence is "+ numof9 +",This means that it will be tested for "+round+" rounds,\n";
    message +="For the 2 big prime numbers to be at least "+ degree +" that it is a prime.\n";
    message +="the number of rounds is obtained by using the following formula: \n";
    message +="1 - (1/4)^j >= desired percentage\n";
    message +="where j is the number of rounds, and desired percentage is the confidence levels.\n";
    message +="with desired percentage equals to " + degree +" , we can get j = " + round + ".\n"; 
    message +="From the parameter inputted above, the total random number that are tested are: " + count + ".\nFor the demo purposes, only the max. of 10 numbers are displayed.\nThese are the random numbers that are failed to pass the Miller-Rabin algorithm test:\n";
    var res =sessionStorage.getItem('failrandom');

    res = res.split(',');
    var length = res.length;
    for (var i = 0 ; i<res.length;i++){
      message += "<div id='div"+i+"'>";
      message += "<a href='./calculation.html' class='link'>"+res[i] + '</a>';
      message +="</div>";
    }
    message +="\n==================================================================================================================\n";
    message +="Help section";
    message +="\n==================================================================================================================\n";
    message +="The details below will explain about how the program calculate public and private key pair\nfor the first splitted ciphertext.\n";
    message +="Clicking next will generate public key exponent(e),two big prime numbers, n, tao(n), and private key exponent(d)\nbased on parameter inputted before.\n\n";
    message +="Some informations regarding the generated variables:\n";
    message +="<Strong>e will already have 1 as the greatest common divisor with tao(n),\n</Strong>";
    message +="<Strong>p and q will already be prime numbers with certain confidence based on the parameter,\n</Strong>";
    message +="<Strong>d is already a multiplicative inverse of e,\n</Strong>";
    message +="<Strong>n will already be bigger than any particular converted Ciphertext.\n</Strong>";
    $('#splitted').html('<div class="panel-body" id="splitted"><pre>'+ message +'</pre></div>');
    return true;
  }

  bootstrap_alert.CRT = function() {
    var p = $('#p').text();
    var q = $('#q').text();
    var d = $('#d').text();
    var enc = $('#encrypted').text();
    var arr = RSA.CRT(bigInt(p),bigInt(q),bigInt(d),bigInt(enc));
    var message = "Using normal RSA procedure (using (encrypted cipher)^d mod n) to decrypt directly \n are pretty difficult to calculate when the number is really big.\n";
    message +="By using Chinese Remainder Theorem, the exponent and modulus value can be broken down to be much smaller and more manageable.\n";
    message +="The example below demonstrates how CRT gives alternating in RSA calculation by breaking it down into 2 smaller parts.\n";
    message +="dP = d mod (p-1) = "+ d + " mod " + bigInt(bigInt(p).minus(1)).toString() + " = " + arr[0] +"\n" ;
    message +="dQ = d mod (q-1) = "+ d + " mod " + bigInt(bigInt(q).minus(1)).toString() + " = " + arr[1] +"\n" ;
    message +="qInv = (q)^-1 mod (p) = ("+ q + ")^-1 mod " + p + " = " + arr[2] +"\n" ;
    message +="m1 = (encrypt)^dP mod (p) = ( "+ enc + " )^"+arr[0]+" mod " + p + " = " + arr[3] +"\n" ;
    message +="m2 = (encrypt)^dQ mod (q) = ( "+ enc + " )^"+arr[1]+" mod " + q + " = " + arr[4] +"\n" ;
    message +="h = qInv*(m1-m2 + p) mod (p) = "+ arr[3] + "*( "+arr[3]+ " - "+ arr[4] + " + " + p +") mod " + p + " = " + arr[5] +"\n" ;
    message +="m = m2 +h*q = "+ arr[4] +" + " + arr[5] +" * " + q + " = " + arr[6] + "\n";
    message +="This gives the same result as the normal RSA decryption method, and its easier to compute with this method rather than the usual way.\n";
    $('#CRT_exp').html('<div class="panel-body" id="CRT_exp"><pre>'+ message +'</pre></div>');
  }

  bootstrap_alert.norm = function() {
    var p = $('#p').text();
    var q = $('#q').text();
    var d = $('#d').text();
    var enc = $('#encrypted').text();
    var e = $('#e').text();
    var n = $('#n').text();
    var tao =$('#Φn').text();
    var cipher = document.getElementById("cipher").value;
    var convert = $('#converted').text();
    var dec= $('#decrypted').text();
    var message ="The RSA algorithm involves four steps: key generation, key distribution, encryption and decryption.\n";
    message +="The keys for the RSA algorithm are generated the following way:\n";
    message +="After getting 2 big prime numbers from the range specified ("+p+" , "+q+") using Miller Rabin Primality test,\nwe then can calculate n = p*q = "+n +" .\n";
    message +="Next, Φ(n) can be computed by : (p-1)*(q-1) = "+tao+" .\n";
    message +="Then, with the choosen e = "+e+",where e and  Φ(n) are coprime,\nd can be computed as d is the multiplicative inverse of e modulo( Φ(n)).\n";
    message +="d = "+d+" . With these, we have generated public key pair(n,e) and private key pair(d,n).\n";
    message +="With c = m^e(mod n) as the encryption formula, where m is the message("+convert+"),\nand c is the encrypted text, the value of c is = "+enc+" .\n";
    message +="One can decipher the message from c by using c^d(mod n) formula,\nin this case the decrypted value would be: "+dec+" .\n";
    message +="the recovered message can be converted back to text, which would be = "+cipher+".\n";
    $('#norm_exp').html('<div class="panel-body" id="norm_exp"><pre>'+ message +'</pre></div>');
  }

  bootstrap_alert.modal = function(){
    var cipher = $('#inputMessage').val();
    // var split = parseInt($('#inputLength').val());
    var numof9 = $('#input9').val();
    var round = RSA.Miller_Rabin.confidence(numof9);
    var primes = bigInt(RSA.Miller_Rabin.Prime($('#inputRange').val(),round));
    sessionStorage.setItem('prime1',primes[0]);
    sessionStorage.setItem('prime2',primes[1]);
    var n =bigInt(primes[0].toString()).multiply(primes[1].toString());
    var split = sessionStorage.getItem('length');
    var arr = split_cipher(cipher,parseInt(split));
    
    var numof9 = $('#input9').val();
    var degree = convertconf(numof9);
    var count = sessionStorage.getItem('prime_count');
    sessionStorage.setItem('degree',degree);
    var ciphernum = sessionStorage.getItem('ciphernum');

    var message = "The conversion is done by converting each character using ASCII number,\nand concatenate them together to form a big integer number.\n\n";
    message += "There is a padding 0s for the ASCII number however, to make sure that\nthe message can be recovered back later on without any confusion.\n\n";
    message += "An example for the padding would be a word 'cd'. In ASCII, 'c' is 67 and 'd' is 68.\nThe program then add 0 in front of the number, so it becomes 067 and 068 respectively.\n\n";
    message += "After doing the RSA calculation, the program will get 67068 as a decrypted number\n(notice that 0 in front is gone because of int calculation).\n\n";
    message +="Then, it would slice the string with length =3 each, except for the first part\nwith length = 3-(encrypted.length - decrypted.length)(because the padding is gone for the first char)\n\n";
    message +="With the padding scheme, the conversion from number back to the original message will be 100% accurate.\n\n";
    message +="=======================================================================================================\n";
    message += "As it has been explained before, the length is obtained by comparing modulo n and the ciphertexts.\n\n";
    message += "In this case, n = "+ n + " is bigger than "+ciphernum+"\n";
    $('#explanation').html('<div class="modal-body" id="explanation"><pre>'+ message +'</pre></div>');
}

  function bigIntconv(num){
    return str2bigInt(num.toString(),10,num.length);
  }

  function strconv(bigInt){
    return bigInt2str(bigInt,10);
  }

  function split_cipher(cipher,split){
    var chunks = [];

    for (var i = 0, charsLength = cipher.length; i < charsLength; i += split) {
      chunks.push(cipher.substring(i, i + split));
    }
    return chunks;
  }

  RSA = function() {}

  //changed
 RSA.gcd = function(p,q){
    var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];
    var p_big= bigInt(p);
    var q_big = bigInt(q);
    var tao = (p_big.minus(1)).multiply(q_big.minus(1));
    var count = 0;
    var arr = [];
    for (var i=0;i<smallPrimes.length;i++){
      if (count == 5) break;
      if(bigInt.gcd(bigInt(smallPrimes[i]),tao).equals(1)) {
        arr[count] = smallPrimes[i];
        count++;
      }
    }
    return arr;
  }

  RSA.calc = function(e,p,q,cipher) {
    var e_big = bigInt(e.toString());
    var p_big = bigInt(p.toString());
    var q_big = bigInt(q.toString());
    var num = bigInt(RSA.convert_text(cipher).toString());
    var n = p_big.multiply(q_big);
    var tao = (p_big.minus(1)).multiply(q_big.minus(1));
    var x = RSA.Euclid_gcd(tao,e_big)[1];
    var d = tao.plus(x);
    var encryptCoef = num.modPow(e_big,n);
    var decryptCoef = encryptCoef.modPow(d,n);
    var arr = [n.toString(),tao.toString(),d.toString(),encryptCoef.toString(),decryptCoef.toString()];
    return arr;
  }

  RSA.Euclid_gcd = function(a,b) {
    var zero = bigInt.zero,
        one = bigInt.one;
    if(b.equals(zero) == true) return [one,zero,a];
    else{
      var message = sessionStorage.getItem('euclid');
      message += a.toString() +" = " +b + " * " +a.divmod(b).quotient.toString()+ " + "+a.divmod(b).remainder.toString() + "\n";
      sessionStorage.setItem('euclid',message);
      temp = RSA.Euclid_gcd(b,a.mod(b));
      var x = temp[0];
      var y = temp[1];
      var d = temp[2];
      var q = a.divmod(b).quotient;
      x = x.minus(y.multiply(q));
      var message = sessionStorage.getItem('euclid');
      message +=b.toString() + " * (" + x.toString() + ") + "+a.toString() + " * ("+y.toString()+") = " +d.toString()+'\n' ;
      sessionStorage.setItem('euclid',message);   
      return [y,x,d];
    }
  }

  RSA.CRT = function(i_p,i_q,d,encrypt) {
    if(bigInt(i_p).gt(bigInt(i_q))) {
      p=i_p;
      q=i_q;
    }
    else{
      p=i_q;
      q=i_p;
    }
    
    var dP = d.mod(p.minus(1));
    var dQ = d.mod(q.minus(1));
    var qInv = q.modInv(p);
    var m1 = encrypt.modPow(dP,p);
    var m2 = encrypt.modPow(dQ,q);
    var h = (qInv.multiply(m1.minus(m2).plus(p))).mod(p);
    var m = m2.plus(h.multiply(q));
    return [dP.toString(),dQ.toString(),qInv.toString(),m1.toString(),m2.toString(),h.toString(),m.toString()];
  }

  String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

  //reinforce conversion
  RSA.convert_text=function(m) {
    var enc="",
        str="";
    str = m.toString();
    for (var i =0;i< m.length;i++){
      var block = m.charCodeAt(i);
        block = block.toString().paddingLeft("000");
            console.log(block);
      enc = enc + block;  
    }
    return enc;
  }

  
  RSA.clean = function() {
    //reset toString() before doing another MR
    sessionStorage.setItem('flag_sub',flag_sub_test);
    sessionStorage.setItem('count',count_bef);
  }

  RSA.Miller_Rabin = function() {}

  RSA.Miller_Rabin.confidence = function(num) {
    var percentage = '0.';
    for(var i = 0;i < num; i++) percentage +='9';
    for(var j = 0;j<30;j++) {
      if((1-parseFloat(percentage)) >= Math.pow(4,(-j))) break;
    }  
    return j;
  }

  //using old bigInt.js
  // RSA.Miller_Rabin.Prime = function(range,round){
  //   var arr = range.split('-');

  //   // if (arr[0] < )
  //   var i =0;
  //   var res =[];
  //   while(true){
  //     var length = Math.floor(Math.random() * (parseInt(arr[1])-parseInt(arr[0])) + parseInt(arr[0]));
  //     var p = Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  //     var q = Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));

  //     if( bigInt(p).equals(bigInt(q)) == true) continue;

  //     else if(bigInt(p).isDivisibleBy(2) || bigInt(p).isDivisibleBy(5) || bigInt(q).isDivisibleBy(2) || bigInt(q).isDivisibleBy(5)) continue;
  //     // if(bigInt(p).isProbablePrime() == true && bigInt(q).isProbablePrime() == true)
  //     else{
  //     // var rand ='';
  //     // for (var i = 0; i<length;i++) rand +='9';
  //     // var big = bigInt2str(bigIntconv(rand),2);
  //     // var p = randProbPrime(big.length);
  //     // var q = randProbPrime(big.length);
  //       // console.log(p.toString());
  //       // console.log(q.toString());
  //       if (i<10){
  //         var message = bigInt(p).toString() + '&' + bigInt(q).toString();
  //         res[i] = message;
  //         i++;
  //       }
  //       RSA.clean();
  //       var mes_p = RSA.Miller_Rabin.MultiRounds(p.toString(),round);
  //       RSA.clean();
  //       var mes_q = RSA.Miller_Rabin.MultiRounds(q.toString(),round);
  //       if(mes_p == true && mes_q == true ) break;
  //     }
  //   }
  //   sessionStorage.setItem('failrandom',res);
  //   return [p.toString(),q.toString()];
  // }

  RSA.Miller_Rabin.Prime = function(range,round){
    var arr = range.split('-');

    var i =0;
    var res =[];
    var count = 0;
    var q_flag = false;
    while(true){
      var length = Math.floor(Math.random() * (parseInt(arr[1])-parseInt(arr[0])) + parseInt(arr[0]));
      var rand = Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));

      if(bigInt(rand).isDivisibleBy(2) || bigInt(rand).isDivisibleBy(5) || bigInt(rand).lesser(2)) continue;

      else{
        count++;
        RSA.clean();
        var rand_flag = RSA.Miller_Rabin.MultiRounds(rand.toString(),round);
        if(rand_flag == true && q_flag == false) {
          var p = rand;
          q_flag = true;
        }
        else if(rand_flag == true && q_flag == true) {
          if( bigInt(p).equals(bigInt(rand)) == true) continue;
          else{
            var q = rand;
            break;
          }
        }

        else{
          if (i<10){
          var message = rand.toString();
          res[i] = message;
          i++;
          }
        }
      }
    }
    sessionStorage.setItem('prime_count',count);
    sessionStorage.setItem('failrandom',res);
    return [p.toString(),q.toString()];
  }

  RSA.Miller_Rabin.Prescreen = function(s) {
    var s = s.toString().replace(/\s/g,''), len=s.length;
    var f=parseFloat(s), lastDigit=parseInt(s.charAt(len-1),10);
   
    if (s=='' )         return 'Empty input [expected a large odd n]'
    if (isNaN(f) )      return 'Invalid input [expected a large odd n, got NaN]'
    if (!isFinite(f) )  return 'Invalid input'
    if ( f < 2 )        return 'Neither prime nor composite [expected a large odd n, got n less than 2]'
    if ( f % 1 )        return 'Neither prime nor composite [expected a large odd n, got a non-integer n]'
    if (s.match(/\D/) ) return 'Invalid input [expected a large odd n, digits only]' // e.g. '1e12'
    if (s=='2')         return 'Prime [expected a large odd n, got a small prime 2]'
    if (lastDigit%2==0) return 'Composite [expected a large odd n, got an even composite n]'
    return s;
  }

  RSA.Miller_Rabin.OneRound = function( n,a) {
   // miller_rabin(n,a) performs one round of the Miller-Rabin test
   // n is a positive integer to be tested (can be a number or a string)
   // a is the base for the Miller-Rabin test

   var s = RSA.Miller_Rabin.Prescreen(n.toString()); if (s.indexOf('i')>0) return s;
   var res, len=s.length;
   var mr_base = str2bigInt(a.toString(),10,len);
   var mr_cand = str2bigInt(s,10,len);
   var mr_temp = addInt(mr_cand,-1);

   res = RSA.Miller_Rabin.calc(mr_base, mr_temp, mr_cand);
   if ( equalsInt(res,1) ){
    // console.log('ee');
    return 1;
  }
   return 0;
}

  RSA.Miller_Rabin.MultiRounds = function(n,rounds) {
   // isPrimeMR tests if n is prime using the given number of rounds of the Miller-Rabin test with small prime bases: 2, 3, 5, etc. 
   // up to first 30 rounds of small prime bases

    //reset message content for different MR
    sessionStorage.setItem('message',JSON.stringify(MRMessage));

    //reset head messages
    sessionStorage.setItem('flag',d_flag);
    var message = JSON.parse(sessionStorage.getItem('message'));
    var res,a,s = n.toString().replace(/\s/g,'');
    // var b = int2bigInt(0,1,1); 
    // var big =bigInt2str(bigIntconv(n),2);
     //get the random true prime by using conversion of string to base 2
    var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];
    var numof9 = $('#num9').val();
    message.push('the candidate will be tested for '+rounds.toString()+' rounds with a small base primes : [2;3;5..109;113]\n');
    // message.push('In addition; p will also be tested with random true prime ranging from 113 to n to strengthen the probability that p is a prime number\n');
     for (var k=0;k<rounds;k++) {
      a = smallPrimes[k];
      message.push('=============================================================\n');
      message.push('Rabin Miller test for round #'+(k+1) +' : a = '+ a+'\n');
      if (s == ''+a) {
        message.push("since p (" + s + ") is equal to " + a + " (true prime)\n");
        message.push(n +' is a prime number');
        sessionStorage.setItem('message',JSON.stringify(message));
        return true;
      }
      sessionStorage.setItem('message',JSON.stringify(message));
      res = RSA.Miller_Rabin.OneRound(s,a);
      message = JSON.parse(sessionStorage.getItem('message'));
      RSA.clean();
      if (res.toString().indexOf('i')>0) {
        message = res;
        sessionStorage.setItem('message',JSON.stringify(message));
        return res;
      }
      if (res==0) {
          console.log('cc');
          message.push('since x is neither equals to 1 nor n-1 -> p is a composite number');
          sessionStorage.setItem('message',JSON.stringify(message));
          return false;
     }
    }
    var numof9 = $('#num9').val();
    degree = convertconf(numof9);

    message.push(n+' is a prime number with ' + numof9+ ' 9s of confidence');
    sessionStorage.setItem('message',JSON.stringify(message));
    return true;
  }

//using old bigInt.js
RSA.Miller_Rabin.calc = function(a,i,n) {
  // takes BigInt a, i, n
  var one  = int2bigInt(1,1,1);
  var zero = int2bigInt(0,1,1);
  var two = int2bigInt(2,1,1);
  var count = sessionStorage.getItem('count');

  if (isZero(i)) return one;
  
  count++;
  sessionStorage.setItem('count',count);
  //demo
  if (equalsInt(mod(i,two),1)) {
    var message = JSON.parse(sessionStorage.getItem('message'));
    var flag_init = sessionStorage.getItem('flag');
    // console.log(flag_init); 
    var count = sessionStorage.getItem('count');
    var d = strconv(dup(i));
    //since flag init would return as string not boolean
    if (flag_init == 'true') {
      flag_init = false;
      sessionStorage.setItem('flag',flag_init);
      message.push('to determine if p is a prime-> n-1 ('+ strconv(addInt(n,-1)) + ') is written as 2^s*d -> with s equals to '+count+' and d equals to '+ d +'\n');
      sessionStorage.setItem('message',JSON.stringify(message));
    }
    var flag_sub = sessionStorage.getItem('flag_sub');
    if(flag_sub == 'true') {
      var flag_temp = true;
      flag_sub = false;
      sessionStorage.setItem('flag_sub',flag_sub);
      message.push('1. x = a^d mod n\n');
      message.push('x = '+strconv(a)+'^'+d+' mod '+strconv(n)+'\n');
      var x_test = powMod(a,d,n);
      message.push('x = '+strconv(x_test)+'\n');
      if (equalsInt(x_test ,1) || equals(x_test,addInt(n,- 1)) ){
        message.push("x is equals to 1/n-1 -> choose another number for a\n");
        flag_temp = false;
      }

      if(flag_temp){
        message.push('x will be tested for '+count+' times\n');
        for (var k = count; k--;) {
          message.push('2. x = x * x % n \n');  
          message.push('x = '+strconv(x_test)+'*'+strconv(x_test)+' mod '+strconv(n)+'\n');
          y_test = dup(x_test);
          multMod_(x_test,y_test,n);
          message.push('x= '+strconv(x_test)+'\n');
          if (equals(x_test,addInt(n,- 1))) {
            message.push('since x is equal to n-1(' + strconv(addInt(n,-1))  +'); choose another number for a\n');
            break;
          }
          else if(equalsInt(x_test ,1)) {
            message.push("x is equals to 1 -> therefore p is a composite number\n");
            break;
          }
          // else{
          //   message.push('since x is equal to neither 1 nor n-1; choose another number for a\n');
          // }
        }
      }
      sessionStorage.setItem('message',JSON.stringify(message));
    }
  }
  //  j = floor(i/2)
  var j = dup(i); divInt_(j,2);
  var x= RSA.Miller_Rabin.calc(a, j, n);
  // console.log('x = ' + strconv(x));
  if (isZero(x)) {
    // console.log('bb');
    return zero;
  }
  //  y = (x*x)%n
  var y = expand(x,n.length); squareMod_(y,n);
  // console.log('y = ' +strconv(y)) ;
  if (equalsInt(y,1) && !equalsInt(x,1) && !equals(x, addInt(n,-1)) ){
    // console.log('aa');
    return zero;
  }  
  //y = (y*a)%n -> y=(x*x*a)%number
  if (i[0]%2==1) multMod_(y,a,n);
  // console.log('y aft = ' +strconv(y)) ;
  // console.log(strconv(y));
  return y;
 }
});
