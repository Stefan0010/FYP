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
    // sessionStorage.setItem('euclid',EuclidMessage);
    // // RSA.calc('17','5','11','5-');

    // RSA.calc('5','787','863','5-');
    // console.log(sessionStorage.getItem('euclid')); 
    // sessionStorage.setItem('euclid',EuclidMessage); 
    // console.log(strconv(int2bigInt(3,1,1)));
    bootstrap_alert.explanation();
    
    // console.log(bigInt(97115).modPow(5,'13227769'));
    // console.log(bigInt('12689855').modPow('10576397','13227769'));
    // console.log(bigInt(12689855).modPow(10576397,13227769));
   });

   button_exp.click(function() {
    var ciphertext = split_cipher($('#inputMessage').val(),parseInt($('#inputLength').val()));
    var numof9 = parseInt($('#input9').val());
    var round = RSA.Miller_Rabin.confidence(numof9);
    var primes = RSA.Miller_Rabin.Prime($('#inputRange').val(),round);
    var e = RSA.gcd(primes[0],primes[1]);
    var calc = RSA.calc(e,primes[0],primes[1],ciphertext[0]);
    var enc = '';
    var dec ='';

    sessionStorage.setItem('p',primes[0]);
    sessionStorage.setItem('q',primes[1]);
    sessionStorage.setItem('e',e);
    sessionStorage.setItem('Φn',calc[1]);
    sessionStorage.setItem('num9',numof9);
    $('#e').text(e);
    $('#p').text(primes[0]);
    $('#q').text(primes[1]);
    $('#n').text(calc[0]);
    $('#Φn').text(calc[1]);
    $('#d').text(calc[2]);
    $('#cipher').text(ciphertext[0]);
    $('#encrypted').text(calc[3]);
    $('#decrypted').text(calc[4]);

    for (var i = 0; i<ciphertext.length;i++){
      enc += RSA.calc(e,primes[0],primes[1],ciphertext[i])[3];
      dec += RSA.calc(e,primes[0],primes[1],ciphertext[i])[4];
    }

    $('#encryptedf').text(enc);
    $('#decryptedf').text(dec);
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
      $('#collapse').collapse('hide');
      $('#collapse1').collapse('hide');
      var e =$('#e_calc').val();
      var Φn =$('#Φn_calc').val();
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
                    "The value of y does not actually matter, since it will get eliminated modulo φ((n) regardless of its value.\n\n" +
                    "Thus, for e= "+e+" ,and Φn= "+Φn+" :\n";
      sessionStorage.setItem('euclid',message);
      var d = RSA.Euclid_gcd(bigIntconv(Φn),bigIntconv(e));
      var temp = bigIntconv(Φn);
      if(negative(d[1])) {
      d[1] = twos_complement(bigInt2str(d[1],2));
      sub_(temp,d[1]);
      d[1] ='-' + strconv(d[1]);
    }
    else {
      add_(temp,d[1]);
      d[1] = strconv(d[1]);
    }
      var message = sessionStorage.getItem('euclid');
      message +="From the EED above, we can conclude that x = " + d[1] +", which is in fact d= "+ strconv(temp) +" before modded by " + Φn +".\n\n" +
      "The basic idea is to use the successive remainders of the GCD calculation to substitute the initial integers\n" +
      "back into the final equation (the one which equals 1) which gives the desired linear combination.";
      $('#step_euclid').html('<pre>'+message+"<pre>");
    });































   button_conv.click(function() {
    var converted = RSA.convert_text();
    $('#convert').text(converted);
  });


   
   button_calc.on('click',function(){
    var num = $('#convert').text(),
        tag = '#alert_modulo',
        message = '<strong>Warning!</strong> your modulus (n) is smaller than the encrypted message!',
        tag_gcd = '#alert_gcd',
        message_gcd = 'the public key value(e) must be within [3,Φn) and has a greatest common divisor of 1 with Φn!',
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



  $('#e').keyup(function() {
    var e =$('#e').val(),
        p =$('#p').val(),
        q =$('#q').val();
    if(e.length ===0 || p.length === 0 || q.length === 0){
      $('#btn-calc').prop('disabled',true);
    }
    else{
      $('#btn-calc').prop('disabled',false);
    }
  })

  $('#p').keyup(function() {
    var e =$('#e').val(),
        p =$('#p').val(),
        q =$('#q').val();
    sessionStorage.setItem('p',p);
    if(e.length ===0 || p.length === 0 || q.length === 0){
      $('#btn-calc').prop('disabled',true);
    }
    else{
      $('#btn-calc').prop('disabled',false);
    }
  })

  $('#q').keyup(function() {
    var e =$('#e').val(),
        p =$('#p').val(),
        q =$('#q').val();
    sessionStorage.setItem('q',q);
    if(e.length ===0 || p.length === 0 || q.length === 0){
      $('#btn-calc').prop('disabled',true);
    }
    else{
      $('#btn-calc').prop('disabled',false);
    }
  })

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
    // console.log(a);
    // console.log(result);
    // console.log(bigInt2str(twos,2));
    // console.log(strconv(twos));
    add_(twos,one);
    
    return twos;

  }

  function convertconf(num) {
    var per = '0.';
    for (var i =0;i<num;i++){
      per +=9;
    }
    console.log(per);
    var temp = (parseFloat(per) * 100).toFixed(num-2);
    console.log(temp);
    per = temp.toString() +'%';
    console.log(per);
    return per
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
    var message ="with the Plaintext(" + cipher +"),\nit will be splitted into several Ciphertexts,\neach with length of "+ split + ".\n";
    message += "Thus, the Plaintext would be splitted into:\n";
    for (var i = 0; i<arr.length;i++) {
      message += arr[i] + " " ;
    }
    message +="\n";
    message +="Since the number of 9 for the confidence is "+ numof9 +",\nThis means that it will be tested for "+round+" rounds,\n";
    message +="For the 2 modulos(p and q) to be at least "+ degree +" that it is a prime";
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

  // function Power(x,n) {
  //   if (equalsInt(n,1)) return x;
  //   else if(modInt(n,2) == 0){
  //     var y = dup(x);
  //     var even = dup(n);divInt_(even,2);
  //     return Power(mult(x,y),even);
  //   }
  //   else if(modInt(n,2) != 0 && greater(n,int2bigInt(2,1,1))) {
  //     var y = dup(x);
  //     var odd = dup(n);sub_(odd,int2bigInt(1,1,1));divInt_(odd,2);
  //     return Power(mult(x,y),odd);
  //   }
  // }

  RSA = function() {}

  RSA.gcd = function(p,q){
    var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];
    var p_big= bigIntconv(p);
    var q_big = bigIntconv(q);
    var tao = mult(addInt(p_big,-1),addInt(q_big,-1));
    for (var i=0;i<smallPrimes.length;i++){
      if(equalsInt(GCD(int2bigInt(smallPrimes[i],1,1),tao),1)) break;
    }
    return smallPrimes[i];

  }

  RSA.calc = function(e,p,q,cipher) {
    var e_big = int2bigInt(e,1,1);
    var p_big = bigIntconv(p);
    var q_big = bigIntconv(q);
    var num = bigIntconv(RSA.convert_text(cipher));
    var n = mult(p_big,q_big),
        tao = mult(addInt(p_big,-1),addInt(q_big,-1)),
        d = dup(tao),
        x = RSA.Euclid_gcd(d,e_big)[1] ;
    if(negative(x)) {
      x = twos_complement(bigInt2str(x,2));
      sub_(d,x);
    }
    else add_(d,x);
    // console.log(negative(x));
    //for extended gcd
    // console.log(negative(x));
    // (negative(x)  == true) ? add_(d,x) : sub_(d,x);
    
    // add_(d,x);
    // console.log(strconv(multMod(e_big,d,n)));
    var encryptCoef =  powMod(num,e_big,n),
        decryptCoef =  powMod(encryptCoef,d,n),
        arr = [strconv(n),strconv(tao),strconv(d),strconv(encryptCoef),strconv(decryptCoef)];
    // var test = dup() 
    // var pow = Power(num,e_big);
    // console.log(strconv(multMod(e_big,d,tao)));
    // console.log(strconv(n));
    // console.log(strconv(tao));
    // console.log(strconv(d));
    // console.log(strconv(encryptCoef));
    // console.log(strconv(decryptCoef));
    // console.log(strconv(mod(pow,n)));
    // var enc = mod(pow,n);
    // var dec = Power(enc,d);
    // var dec2 = mod(dec,n);
    // console.log(strconv(dec2));
    return arr;
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
  RSA.verify = function() {
    var e =  $('#e').val(),
        p =  $('#p').val(),
        q =  $('#q').val(),
        regex = /(\D)/,
        tag_out = '#alert_integer',
        message = 'Please input an integer!';
    if ( isNaN(e)|| isNaN(p) || isNaN(q) || regex.exec(e) !== null || regex.exec(p) !== null || regex.exec(q) !== null) {
      bootstrap_alert.warning(tag_out,message);
      return false;
    }
    else {
      bootstrap_alert.fade(tag_out);
      return true;
    }

  }

  // RSA.Inverse = function(e,tao) {
  //   return inverseMod(e,tao);
  // }

  RSA.Euclid_gcd = function(a,b) {
    

    var zero = int2bigInt(0,1,1),
        one = int2bigInt(1,1,1);
    if(equalsInt(b,0) == true) return [one,zero,a];
    else{
      
      temp = RSA.Euclid_gcd(b,mod(a,b));
      var q = new Array(a.length),
      r = new Array(a.length);
      x = temp[0];
      y = temp[1];
      d = temp[2];
      divide_(a,b,q,r);
      sub_(x,mult(y,q));
      var message = sessionStorage.getItem('euclid');
      if(negative(x)) {
        var temp_x = twos_complement(bigInt2str(x,2));
        temp_x ='-' + strconv(temp_x);
      }
      else{
        var temp_x = dup(x);
        temp_x = strconv(temp_x);
      }
      if(negative(y)) {
        temp_y = twos_complement(bigInt2str(y,2));
        temp_y ='-' + strconv(temp_y);
        }
      else {
        var temp_y = dup(y);
        temp_y =strconv(temp_y);
      }
      message +=strconv(b) + " * (" + temp_x + ") + "+strconv(a) + " * ("+temp_y+") = " +strconv(d)+'\n' ;
      sessionStorage.setItem('euclid',message);
      // console.log('a = ' +strconv(a));
      // console.log('b = ' +strconv(b));
      // console.log(strconv(x));
      // // console.log(bigInt2str(y,2));
      // console.log(strconv(y));
      // // console.log(bigInt2str(x,2));
      // console.log(strconv(d));    
      return [y,x,d];
    }
  }
//   RSA.Euclid_gcd = function(a,b) {
//     var  x = int2bigInt(0,1,1),
//       y = int2bigInt(1,1,1),
//       u = int2bigInt(1,1,1),
//       v = int2bigInt(0,1,1),

//       signX = (greater(x,a)) ? -(y) : y,
//       signY = (greater(x,b)) ? -(y) : y,

//       //to have the same length as input
//       q = dup(a),
//       r = dup(a),
//       m = dup(a),
//       n = dup(a);

//     while (!equalsInt(a,0)) {
//       divide_(b,a,q,r);
//       m =dup(x);sub_(m, (mult(q,u)));

//       //n = y -q*v
//       n =dup(y);sub_(n, (mult(q,v)));
//       b = dup(a);
//       a = dup(r);
//       x = dup(u);
//       y = dup(v);
//       u = dup(m);
//       v = dup(n);
//     }
//     return [b,x,y];
//     // return [b, mult(signX,x), mult(signY,y)];
// }
  
  RSA.clean = function() {
    //reset value before doing another MR

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

      //testing against random true prime ABOVE 113
      // if (s > smallPrimes[rounds-1]) {
      //   var rand = randTruePrime(big.length);
      //   b = mod(rand,bigIntconv(n));
      //   //generate random true prime that is below input
      //   while(greater(bigIntconv(smallPrimes[rounds-1]),b)){
      //     rand = randTruePrime(big.length);
      //     b = mod(rand,bigIntconv(n));
      //   }
      //   message.push('for a equals to : '+ strconv(b)+'\n');
      //   if (s ==''+ strconv(b)) {
      //     message.push("since p (" +strconv(n) + ") is equal to " + strconv(b) + " (true prime)\n");
      //     message.push('p is a probable prime number with 99.9% confidence');
      //     sessionStorage.setItem('message',JSON.stringify(message));
      //     return true;
      //   }
      //   res2 = RSA.Miller_Rabin.OneRound(s,b);
      //   RSA.clean();  
      //   if (res2.toString().indexOf('i')>0){
      //     message = res2;
      //     sessionStorage.setItem('message',JSON.stringify(message));
      //     return res2;
      //   }
      //   if (res==0||res2==0 ) {
      //     message.push('since x is neither equals to 1 nor n-1 -> p is a composite number'); 
      //     sessionStorage.setItem('message',JSON.stringify(message));
      //     return false;
      // }
      // else{
        
      //   }
      // }
     }
    }
    var degree = sessionStorage.getItem('degree');
    message.push('p is a probable prime number with ' + degree + ' confidence');
    sessionStorage.setItem('message',JSON.stringify(message));
    return true;
  }

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
