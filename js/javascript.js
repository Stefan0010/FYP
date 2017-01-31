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

     button_calc.click(function(){
      var num = $('#convert').text();
        $('#n').val(calc()[0]);
        $('#Φn').val(calc()[1]);
        $('#d').val(calc()[2]);
        $('#btn-keygen').removeAttr('disabled');

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
      console.log(num);
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