//still have big data problems, either enhance the conversion func or handle the bigInteger type

//incorporate BigInt.js to later calc as well ===>>> ASAP!!!

$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),

      button_inp = $('#btn-input'),
      button_key = $('#btn-keygen'),
      button_enc = $('#btn-encrypt'),
      // button_dec = $('#btn-decrypt'),
      button_calc = $('#btn-calc'),
      button_conv = $('#btn-conv'),
      button_MRcalc = $('#btn-MRcalc'),
      button_show=$('#btn-show'),
      count_bef,count_aft = -1;
      MRMessage = [];
     isClosed = false;
  sessionStorage.setItem('count1',count_bef);
  sessionStorage.setItem('count2',count_aft);
  sessionStorage.setItem('message',MRMessage);

   button_inp.click(function() {
    // for (var j =0; j < 30; j++){
      // var i = Math.floor((Math.random() * 10000)+1);
      // var i =
      // var i = str2bigInt('3637',10,4);
      // console.log(i);
      // console.log(bigInt2str(i,2).length);
      // console.log(randTruePrime(bigInt2str(i,2).length));
      // console.log(RSA.Miller_Rabin.MultiRounds('1234567890123456789012345671471248971958139723109480128094812094810821',1));
    // }
   });

   button_conv.click(function() {
    var converted = RSA.convert_text();
    $('#convert').text(converted);

  });

   button_calc.on('click',function(){
    var num = parseInt($('#convert').text()),
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
        Φn = $('#Φn').val(),
        p =$('#p').val(),
        q =$('#q').val();
    // if the public key inputted is less than 3 or does not have gcd of 1 with the tao, alert the user
    if (RSA.gcd(e,Φn) != 1 || e < 3) {
      flag_gcd = false;
      bootstrap_alert.warning(tag_gcd,message_gcd);
    }
    else{
      flag_gcd = true;
      bootstrap_alert.fade(tag_gcd);
    }

    // if the modulo(n) number is lesser than the encrypted, alert the user
    if (num > $('#n').val()) {
      flag_modulo = false;
      
      bootstrap_alert.warning(tag,message);
    }
    else{
      flag_modulo = true;
      bootstrap_alert.fade(tag);
      $('#btn-keygen').prop('disabled',false);
    }

    // rabin-miller
    var MR_p = RSA.Miller_Rabin.MultiRounds(p.toString(),30);
    var MR_q = RSA.Miller_Rabin.MultiRounds(q.toString(),30);
    if (MR_p !==true) {
      flag_MR_p = false;
      if(MR_p.length > 5 ) {
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
    $('#out').text(msg); 
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

   button_MRcalc.on('click',function(){
    $('#collapse').collapse('hide');
    $('#collapse1').collapse('hide');
    $('#collapse2').collapse('hide');
    $('#collapse3').collapse('hide');
    var p =parseInt($('#p_calc').val());
    var q =parseInt($('#q_calc').val());
    RSA.Miller_Rabin.calc_demo(p,5);
    var para ='';
    var message = (sessionStorage.getItem('message')).split(',');
    console.log(message);
    var index =0;
    while(typeof message[index] !='undefined' && message[index].length>0 ){
      if(index >= message.length) break;  
      var para = para + message[index];
      index++;
  }
    $('#step_p').html('<pre>'+para +'</pre>');

    //for q
    RSA.Miller_Rabin.calc_demo(q,5);
    var para ='';
    var message = (sessionStorage.getItem('message')).split(',');
    var index =0;
    while(typeof message[index] !='undefined' && message[index].length>0 ){
      if(index >= message.length) break;  
      var para = para + message[index];
      index++;
  }
  var res = para.replace('p','q');
    $('#step_q').html('<pre>'+res+'</pre>');


   });


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

// sync the input from rsa to calc html
if (document.getElementById("p_calc") != null && document.getElementById("p_calc") != null) {
  document.getElementById("p_calc").value = (sessionStorage.getItem('p'));  
  document.getElementById("q_calc").value = (sessionStorage.getItem('q'));
}

  trigger.click(function () {
    hamburger_cross();      
  });

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

  RSA = function() {}
  RSA.calc = function() {
    var e = parseInt($('#e').val()),
        p = parseInt($('#p').val()),
        q = parseInt($('#q').val()),
        n = p*q,
        tao = (p-1)*(q-1),
        d = tao + RSA.Euclid_gcd(tao,e)[2],   
        num = parseInt($('#convert').text()),

        encryptCoef =  Math.pow(num,e) % n,
        decryptCoef =  Math.pow(encryptCoef,d) % n,
        arr = [n,tao,d,encryptCoef,decryptCoef];
    // console.log(num);
    return arr;
  }
  RSA.convert_text=function() {
    var enc="",
        m = $('#inp').val(),
        str="";
    str = m.toString();
    for (var i =0;i< m.length;i++){
      var block = m.charCodeAt(i);
      enc = enc + block;
    }
    return enc;
  }
  RSA.verify = function() {
    var e =  parseInt($('#e').val()),
        p =  parseInt($('#p').val()),
        q =  parseInt($('#q').val()),
        tag_out = '#alert_integer',
        message = 'Please input an integer!';
    if (e !== parseInt(e,10)|| p !== parseInt(p,10) ||q !== parseInt(q,10)) {
      bootstrap_alert.warning(tag_out,message);
      return false;
    }
    else {
      bootstrap_alert.fade(tag_out);
      return true;
    }

  }
  RSA.gcd = function(a,b) {
    // if b > 0 it will do a recursion w
    if (b){
      return RSA.gcd(b,a%b);
    }
    //return abs(a)
    else{
      return Math.abs(a);
    }
  }
  RSA.Euclid_gcd = function(a,b) {
    a = +a;
    b = +b;
    if (a !== a || b !== b) {
      return [NaN, NaN, NaN];
    }
    
    if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) {
      return [Infinity, Infinity, Infinity];
    }
    // Checks if a or b are decimals
    if ((a % 1 !== 0) || (b % 1 !== 0)) {
      return false;
    }
    var signX = (a < 0) ? -1 : 1,
      signY = (b < 0) ? -1 : 1,
      x = 0,
      y = 1,
      u = 1,
      v = 0,
      q, r, m, n;
    a = Math.abs(a);
    b = Math.abs(b);

    while (a !== 0) {
      q = Math.floor(b / a);
      r = b % a;
      m = x - u * q;
      n = y - v * q;
      b = a;
      a = r;
      x = u;
      y = v;
      u = m;
      v = n;
    }
    return [b, signX * x, signY * y];
  }
  RSA.Miller_Rabin = function() {}

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

     var res,res2, a,b,s = n.toString().replace(/\s/g,''); 
     var big =bigInt2str(str2bigInt(n.toString(),10,n.length),2);
     //get the random true prime by using conversion of string to base 2
     var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];
     for (var k=0;k<rounds;k++) {
      a = smallPrimes[k];
      if (s == ''+a) return true;
      res = RSA.Miller_Rabin.OneRound(s,a);
      if (res.toString().indexOf('i')>0) return res;
      //testing against random true prime ABOVE 113
      if (s > smallPrimes[rounds-1]) {
        var rand = randTruePrime(big.length);
        //generate random true prime that is below input
        b = parseInt(bigInt2str(rand,10)) % n;
        if (s== ''+ b) return true;
        if( b > smallPrimes[rounds-1]) res2 = RSA.Miller_Rabin.OneRound(s,b);
        if (res2.toString().indexOf('i')>0) return res2;
        if (res==0||res2==0 ) return false;
      }
      else{
        if (res==0) return false;
      }
     }
     return true;
  }

RSA.Miller_Rabin.calc = function(a,i,n) {
  // takes BigInt a, i, n
  var one  = int2bigInt(1,1,1);
  var zero = int2bigInt(0,1,1);
  var count1 = sessionStorage.getItem('count1');
  var count2 = sessionStorage.getItem('count2');
  // var x_arr = JSON.parse(sessionStorage.x_arr) || [];
  // var y_arr = JSON.parse(sessionStorage.y_arr) || [];
  if (isZero(i)) return one;

  //  j = floor(i/2)
  var j = dup(i); divInt_(j,2);
  count1++;
  console.log(j);
  sessionStorage.setItem('count1',count_bef);
  var x= RSA.Miller_Rabin.calc(a, j, n);
  count2++;
  sessionStorage.setItem('count2',count_aft);
  // x_arr.push(x);
  // sessionStorage.x_arr = JSON.stringify(x_arr);    
  if (isZero(x)) return zero;
 
  //  y = (x*x)%n
  var y = expand(x,n.length); squareMod_(y,n);
  if (equalsInt(y,1) && !equalsInt(x,1) && !equals(x, addInt(n,-1)) ){
    // y_arr.push(y);
    // sessionStorage.y_arr = JSON.stringify(y_arr); 
    return zero; 
  }
  //y = (y*a)%n -> y=(x*x*a)%number
  if (i[0]%2==1) multMod_(y,a,n);
  // y_arr.push(y);
  // sessionStorage.y_arr = JSON.stringify(y_arr); 
  return y;
 }

RSA.Miller_Rabin.calc_demo = function(n,k) {
  //for step details purpose
  // var message2 = sessionStorage.getItem('message');
  var message = [];
  if (n === 2 || n === 3){
    message.push("since p is either 2/3 then p is a prime number.\n");
    sessionStorage.setItem('message',message);
    return true;
  }
  if (n % 2 === 0 || n < 2){
    message.push("since p is even or p is less than 2 then p is a composite number.\n");
    sessionStorage.setItem('message',message);
    return false;
 }
  // Write (n - 1) as 2^s * d
  var s = 0, d = n - 1;
  while (d % 2 === 0) {
    d /= 2;
    ++s;
  }
  var j = -1;
  message.push('to determine if p is a prime-> n-1 ('+ (n - 1) + ') is written as 2^s*d -> with s equals to '+s+' and d equals to '+d+'\n');
  message.push('p will be tested for '+k+' rounds with a small base primes : [2;3;5;etc]\n');

  WitnessLoop: do {
    j++;
    // A base between 2 and n - 2
    
    var smallPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113];
    if(j <= 30) var a = smallPrimes[j];
    else{
      message.push('cannot test higher than 30 rounds');
      break;
    }
    if (a> n-2) break;

    message.push('for a equals to : '+ a+'\n');
    var x = Math.pow(a, d) % n;
    message.push('1. x = a^d mod n\n');
    message.push('x = '+a+'^'+d+' mod '+n+'\n');
    message.push('x = '+x+'\n');
    console.log(x);
    if (x === 1 || x === n - 1){
      message.push("x is equals to 1/n-1 -> choose another number\n");
      continue;
    }
    message.push('2. x = x * x % n \n');
    message.push('x will be tested for '+s+' times\n');
    for (var i = s; i--;) {
      x = x * x % n;
      message.push('x = '+x+'*'+x+' mod '+n+'\n');
      message.push('x= '+x+'\n');
      if (x === 1){
        message.push("x is equals to 1 -> therefore p is a composite number\n");
        sessionStorage.setItem('message',message);
        return false;
      }
      if (x === n - 1)
        continue WitnessLoop;
    }
    message.push('since x is neither equals to 1 nor n-1 -> p is a composite number');
    sessionStorage.setItem('message',message);
    return false;
  } while (--k);
  message.push('p is a probable prime number with 99.9% confidence');
  sessionStorage.setItem('message',message);
  return true;
}
});