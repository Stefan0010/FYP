//still have big data problems, either enhance the conversion func or handle the bigInteger type


$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),

      button_inp = $('#btn-input'),
      button_key = $('#btn-keygen'),
      button_enc = $('#btn-encrypt'),
      // button_dec = $('#btn-decrypt'),
      button_calc = $('#btn-calc'),
      button_conv = $('#btn-conv'),

      // privateExponent =  
      // modulus = prime1*prime2,
      // encryptCoef = privateExponent % 
      // decryptCoef = 
      // tao = (prime1-1)*(prime2-1),
     isClosed = false;

   button_inp.click(function() {
      
   });

   button_conv.click(function() {
    var converted = convert_text();
    $('#convert').text(converted);

  });

   button_calc.on('click',function(){
    var num = parseInt($('#convert').text()),
        tag = '#alert_modulo',
        message = '<strong>Warning!</strong> your modulo (n) is smaller than the encrypted message!',
        tag_gcd = '#alert_gcd',
        message_gcd = 'the public key value(e) must be within [3,Φn) and has a greatest common divisor of 1 with Φn!';

    //this will verify if the input for e,p,q are integers or not
    if (!verify()) {
      $('#n').val('');
      $('#Φn').val('');
      $('#d').val('');
      bootstrap_alert.fade(tag);
    }

    //calculate the following using the inputs
    $('#n').val(calc()[0]);
    $('#Φn').val(calc()[1]);
    $('#d').val(calc()[2]);

    var e = $('#e').val(),
        Φn = $('#Φn').val();
    // if the public key inputted is less than 3 or does not have gcd of 1 with the tao, alert the user
    if (gcd(e,Φn) != 1 || e < 3) {
      bootstrap_alert.warning(tag_gcd,message_gcd);
    }
    else{
      bootstrap_alert.fade(tag_gcd);
    }

    if (num > $('#n').val()) {
      $('#btn-keygen').prop('disabled',true);
      bootstrap_alert.warning(tag,message);
    }
    else{
      bootstrap_alert.fade(tag);
      $('#btn-keygen').prop('disabled',false);
    }
  });

   button_key.click(function() {
    var e =$('#e').val(),
        p =$('#p').val(),
        q =$('#q').val(),
        n =$('#n').val(),
        enc = calc()[3],
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
        dec = calc()[4],
        msg = $('#inp').val(),
        d =$('#d').val(),
        n =$('#n').val();

    $('#encrypted').text(enc);
    $('#n-out2').text(n);
    $('#d-out').text(d); 
    $('#result2').text(dec);
    $('#converted').text(msg);
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

  function convert_text(){
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

  bootstrap_alert = function() {}
  bootstrap_alert.warning = function(tag,message) {
    $(tag).show();
    $(tag).html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-hide="alert" aria-label="close" data-dismiss="alert">&times;</button>'+ message + '</div>')
  }
  bootstrap_alert.fade = function(tag) {
    $(tag).hide();
  }


  function calc() {
    var e = parseInt($('#e').val()),
        p = parseInt($('#p').val()),
        q = parseInt($('#q').val()),
        n = p*q,
        tao = (p-1)*(q-1),
        d = tao + Euclid_gcd(tao,e)[2],   
        num = parseInt($('#convert').text()),

        encryptCoef =  Math.pow(num,e) % n,
        decryptCoef =  Math.pow(encryptCoef,d) % n,
        arr = [n,tao,d,encryptCoef,decryptCoef];
    // console.log(num);
    return arr;
  }

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

  function verify() {
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

  function gcd(a,b) {
    // if b > 0 it will do a recursion w
    if (b){
      return gcd(b,a%b);
    }
    //return abs(a)
    else{
      return Math.abs(a);
    }
  }

  function Euclid_gcd(a, b) {
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

  
});