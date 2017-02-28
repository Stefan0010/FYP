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
      button_euclid = $('#btn-Euclidcalc'); 

      //rabbin miller demo purposes
      count_bef = -1,
      isClosed = false,
      MRMessage = [],
      EuclidMessage="",
      d_flag = true,
      flag_sub_test = true;

  sessionStorage.setItem('flag',d_flag);
  sessionStorage.setItem('flag_sub',flag_sub_test);
  sessionStorage.setItem('count',count_bef);
  sessionStorage.setItem('message',JSON.stringify(MRMessage));
  sessionStorage.setItem('euclid',EuclidMessage);


   button_inp.click(function() {
    $('#result').hide();  
    bootstrap_alert.explanation();

    var ciphertext = split_cipher($('#inputMessage').val(),parseInt($('#inputLength').val()));
    var numof9 = parseInt($('#input9').val());
    var round = RSA.Miller_Rabin.confidence(numof9);
    var primes = bigInt(RSA.Miller_Rabin.Prime($('#inputRange').val(),round));
    var e = RSA.gcd(primes[0],primes[1]);
    var calc = RSA.calc(e,primes[0],primes[1],ciphertext[0]);
    var enc = '';
    var dec ='';
    var convert = RSA.convert_text(ciphertext[0]);
    var tag_out = '#alert_general';
    var message = 'please select higher range/lower splitter length as n is lower than the converted splitted ciphertext!';

    sessionStorage.setItem('p',bigInt(primes[0]).toString());
    sessionStorage.setItem('q',bigInt(primes[1]).toString());
    sessionStorage.setItem('e',e);
    sessionStorage.setItem('Φn',calc[1]);
    sessionStorage.setItem('num9',numof9);

    if(bigInt(calc[0]).lesser(bigInt(RSA.convert_text(ciphertext[0]).toString())) == true){
      bootstrap_alert.warning(tag_out,message);
      $('#result').hide();
      $('#splitter').hide();
    }
    else {
      bootstrap_alert.fade(tag_out);
      $('#splitter').show();
    }

    $('#e').text(e);
    $('#p').text(primes[0]);
    $('#q').text(primes[1]);
    $('#n').text(calc[0]);
    $('#Φn').text(calc[1]);
    $('#d').text(calc[2]);
    $('#cipher').text(ciphertext[0]);
    $('#converted').text(convert);
    $('#encrypted').text(calc[3]);
    $('#decrypted').text(calc[4]);

    for (var i = 0; i<ciphertext.length;i++){
      enc += RSA.calc(e,primes[0],primes[1],ciphertext[i])[3].toString();
      dec += RSA.calc(e,primes[0],primes[1],ciphertext[i])[4].toString();
    }

    $('#encryptedf').text(enc);
    $('#decryptedf').text(dec);    
   });

   button_exp.click(function() {
    $('#result').show();
   })

    // sync the input from rsa to calc html
    if (document.getElementById("p_calc") != null && document.getElementById("q_calc") != null) {
      document.getElementById("p_calc").value = (sessionStorage.getItem('p'));  
      document.getElementById("q_calc").value = (sessionStorage.getItem('q'));
      document.getElementById("num9").value = (sessionStorage.getItem('num9'));
    }

    // sync the input from rsa to calc_euclid html
    if (document.getElementById("e_calc") != null && document.getElementById("Φn_calc") != null) {
      document.getElementById("e_calc").value = (sessionStorage.getItem('e'));  
      document.getElementById("Φn_calc").value = (sessionStorage.getItem('Φn'));
    }

    button_MRcalc.on('click',function(){
      $('#btn-show').prop('disabled',false);
      $('#collapse').collapse('hide');
      $('#collapse1').collapse('hide');
      $('#collapse2').collapse('hide');
      $('#collapse3').collapse('hide');

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
      RSA.Miller_Rabin.MultiRounds(q,round);
      var para_q ='';
      var message_q = JSON.parse(sessionStorage.getItem('message'));
      var index =0;
      while(typeof message_q[index] !='undefined' && message_q[index].length>0 ){
        if(index >= message_q.length) break;  
        var para_q = para_q + message_q[index];
        index++;
    }
    //fix the regex later
    var res = para_q.replace(/[\b*p\b*]/,'q');
    $('#step_q').html('<pre>'+res+'</pre>');
     });
    
  // give restriction as well for the input, especially e w.r.t tao
  // add gcd steps? later on
   button_euclid.on('click',function() {
      $('#btn-show').prop('disabled',false);
      $('#collapse').collapse('hide');
      $('#collapse1').collapse('hide');
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
      var temp = Φn.plus(d[1]);
      var message = sessionStorage.getItem('euclid');
      message +="From the EED above, we can conclude that x = " + d[1].toString() +", which is in fact d= "+ temp.toString() +" before modded by " + Φn.toString() +".\n\n" +
      "The basic idea is to use the successive remainders of the GCD calculation to substitute the initial integers\n" +
      "back into the final equation (the one which equals 1) which gives the desired linear combination.";
      $('#step_euclid').html('<pre>'+message+"<pre>");
    });

  $('#inputRange').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        inputLength =$('#inputLength').val(),
        regex_range = /^(\d)*-(\d)*$/,
        tag_out = '#alert_range',
        message = 'Please input an integer!';
    
    if(isNaN(inputRange) || regex_range.exec(inputRange) == null){
      bootstrap_alert.warning(tag_out,message);
      button_inp.prop('disabled',true);
    }
    else {
      bootstrap_alert.fade(tag_out);
      button_inp.prop('disabled',false);
    }

    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0 || inputLength.length === 0){
      button_inp.prop('disabled',true);
    }
    // else{
    //   button_inp.prop('disabled',false);
    // }
  })
  $('#inputRange').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        inputLength =$('#inputLength').val(),
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
    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0 || inputLength.length === 0){
      button_inp.prop('disabled',true);
    }
    // else{
    //   button_inp.prop('disabled',false);
    // }
  })

  $('#input9').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        inputLength =$('#inputLength').val(),
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

    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0 || inputLength.length === 0){
      button_inp.prop('disabled',true);
    }
    // else{
    //   button_inp.prop('disabled',false);
    // }
  })
  
  $('#inputMessage').keyup(function() {
    var inputRange =$('#inputRange').val(),
        input9 =$('#input9').val(),
        inputMessage =$('#inputMessage').val(),
        inputLength =$('#inputLength').val(),
        regex = /\D/,
        tag_out = '#alert_confidence',
        message = 'Please input an integer!';
    if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0 || inputLength.length === 0){
      button_inp.prop('disabled',true);
    }
    else{
      button_inp.prop('disabled',false);
    }
  })

  $('#inputLength').keyup(function() {
      var inputRange =$('#inputRange').val(),
          input9 =$('#input9').val(),
          inputMessage =$('#inputMessage').val(),
          inputLength =$('#inputLength').val(),
          regex = /\D/,
          tag_out = '#alert_splitter',
          message = 'Please input an integer!';
      

      if(isNaN(inputLength) || regex.exec(inputLength) !== null){
        bootstrap_alert.warning(tag_out,message);
        button_inp.prop('disabled',true);
      }
      else if (parseInt(inputLength) > inputMessage.length){
        message="cannot exceed length of the message!";
        bootstrap_alert.warning(tag_out,message);
        button_inp.prop('disabled',true);
      }
      else {
        bootstrap_alert.fade(tag_out);
        button_inp.prop('disabled',false);
      }
      if(inputRange.length ===0 || input9.length === 0 || inputMessage.length === 0 || inputLength.length === 0){
        button_inp.prop('disabled',true);
      }
      // else{
      //   button_inp.prop('disabled',false);
      // }
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
    var temp = (parseFloat(per) * 100).toFixed(num-2);
    per = temp.toString() +'%';
    return per;
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
    var split = parseInt($('#inputLength').val());
    var arr = split_cipher(cipher,split);
    var numof9 = $('#input9').val();
    var round = RSA.Miller_Rabin.confidence(numof9);
    var degree = convertconf(numof9);
    sessionStorage.setItem('degree',degree);
    var message ="With the Plaintext\n(" + cipher +"),\nit will be splitted into several Ciphertexts,each with length of "+ split + ".\n";
    message += "Thus, the Plaintext would be splitted into:\n";
    for (var i = 0; i<arr.length;i++) {
      message += arr[i] + ";\n" ;
    }
    message +="\n";
    message +="Since the number of 9 for the confidence is "+ numof9 +",This means that it will be tested for "+round+" rounds,\n";
    message +="For the 2 modulos(p and q) to be at least "+ degree +" that it is a prime.\n";
    message +="\n==================================================================================================================\n";
    message +="Help section";
    message +="\n==================================================================================================================\n";
    message +="The details below will explain about how the program calculate public and private key pair\n for the first splitted ciphertext.\n";
    message +="by clicking next, it will generate public key exponent(e), modulo p and q, \nn, tao(n), and private key epxonent(d) based on parameter inputted before.\n\n";
    message +="Some informations regarding the generated variables:\n";
    message +="<Strong>e will already have 1 as the greatest common divisor with tao(n),\n</Strong>";
    message +="<Strong>p and q will already be prime numbers with certain confidence based on the parameter,\n</Strong>";
    message +="<Strong>d is already a multiplicative inverse of e,\n</Strong>";
    message +="<Strong>n will already be bigger than any particular converted Ciphertext.\n</Strong>";
    $('#splitted').html('<div class="panel-body" id="splitted"><pre>'+ message +'</pre></div>');
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
    for (var i=0;i<smallPrimes.length;i++){
      if(bigInt.gcd(bigInt(smallPrimes[i]),tao).equals(1)) break;
    }
    return smallPrimes[i];
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

  //reinforce conversion
  RSA.convert_text=function(m) {
    var enc="",
        str="";
    str = m.toString();
    for (var i =0;i< m.length;i++){
      var block = m.charCodeAt(i);
      enc = enc + block;  
    }
    return enc;
  }

  //reinforce verify since we use bigInt
  // RSA.verify = function() {
  //   var range =  $('#inputRange').val(),
  //       numof9 =  $('#input9').val(),
  //       length =  $('#inputLength').val(),
  //       regex_range = /^(\d)*-(\d)*$/,
  //       regex = /\D/,
  //       tag_out = '#alert_integer',
  //       message = 'Please input an integer!';
  //   if(isNaN(length) || regex.exec(length) !== null){
  //     tag_out = '#alert_splitter';
  //     boostrap_alert.warning(tag_out,message);
  //   }
  //   else


  //   if ( isNaN(e)|| isNaN(p) || isNaN(q) || regex.exec(e) !== null || regex.exec(p) !== null || regex.exec(q) !== null) {
  //     bootstrap_alert.warning(tag_out,message);
  //     return false;
  //   }
  //   else {
  //     bootstrap_alert.fade(tag_out);
  //     return true;
  //   }

  // }
  
  
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
  RSA.Miller_Rabin.Prime = function(range,round){
    var arr = range.split('-');

    while(true){
      var length = Math.floor(Math.random() * (parseInt(arr[1])-parseInt(arr[0])) + parseInt(arr[0]));
      var rand ='';
      for (var i = 0; i<length;i++) rand +='9';
      var big = bigInt2str(bigIntconv(rand),2);
      var p = randTruePrime(big.length);
      var q = randTruePrime(big.length);
      RSA.clean();
      var mes_p = RSA.Miller_Rabin.MultiRounds(strconv(p),round);
      RSA.clean();
      var mes_q = RSA.Miller_Rabin.MultiRounds(strconv(q),round);
      if(mes_p == true && mes_q == true) break;
    }
    return [strconv(p),strconv(q)];
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
   if ( equalsInt(res,1) ) return 1;
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
    var res,res2, a,s = n.toString().replace(/\s/g,'');
    // var b = int2bigInt(0,1,1); 
    // var big =bigInt2str(bigIntconv(n),2);
     //get the random true prime by using conversion of string to base 2
    var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];
    message.push('p will be tested for '+rounds.toString()+' rounds with a small base primes : [2;3;5..109;113]\n');
    // message.push('In addition; p will also be tested with random true prime ranging from 113 to n to strengthen the probability that p is a prime number\n');
     for (var k=0;k<rounds;k++) {
      a = smallPrimes[k];
      message.push('=============================================================\n');
      message.push('for a equals to : '+ a+'\n');
      if (s == ''+a) {
        message.push("since p (" + s + ") is equal to " + a + " (true prime)\n");
        message.push('p is a probable prime number with 100% confidence');
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
          message.push('since x is neither equals to 1 nor n-1 -> p is a composite number');
          sessionStorage.setItem('message',JSON.stringify(message));
          return false;
     }
    }
    var degree = sessionStorage.getItem('degree');
    message.push('p is a probable prime number with ' + degree + ' confidence');
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
  if (isZero(x)) {
    return zero;
  }
  //  y = (x*x)%n
  var y = expand(x,n.length); squareMod_(y,n);
  if (equalsInt(y,1) && !equalsInt(x,1) && !equals(x, addInt(n,-1)) ) return zero; 
  //y = (y*a)%n -> y=(x*x*a)%number
  if (i[0]%2==1) multMod_(y,a,n);
  return y;
 }
});
