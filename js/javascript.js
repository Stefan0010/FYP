$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),

      button_inp = $('#btn-input'),
      button_key = $('#btn-keygen'),
      button_enc = $('#btn-encrypt'),
      button_dec = $('#btn-decrypt'),
      button_calc = $('#btn-calc'),
      num = 9,
      msg = "m",
      // privateExponent =  
      // modulus = prime1*prime2,
      // encryptCoef = privateExponent % 
      // decryptCoef = 
      // tao = (prime1-1)*(prime2-1),
     isClosed = false;

     button_inp.click(function() {
      console.log(num);
      
     });

     button_key.click(function() {
      var e = getVar()[0],
        p = getVar()[1],
        q =getVar()[2],
        d = calc2(e,p,q)[2],
        n = calc2(e,p,q)[0],
        enc = calc(e,d,n)[0],
        dec = calc(e,d,n)[1];
      $('#out').text(msg); 
      $('#enc-out').text(enc);
      $('#encrypted').text(enc);
      $('#result2').text(dec);
        
    });

    button_calc.click(function(){
      var e = getVar()[0],
        p = getVar()[1],
        q =getVar()[2];
      $('#n').val(calc2(e,p,q)[0]);
      $('#Φn').val(calc2(e,p,q)[1]);
      $('#d').val(calc2(e,p,q)[2]);

      $('#btn-keygen').removeAttr('disabled');

      $('#n-out').text(calc2(e,p,q)[0]);
      $('#n-out2').text(calc2(e,p,q)[0]);
      $('#p-out').text(p);
      $('#q-out').text(q);
      $('#e-out').text(e); 
      $('#d-out').text(calc2(e,p,q)[2]); 
      $('#d-out2').text(calc2(e,p,q)[2]); 
      $('#converted').text(msg);

    });

    button_enc.click(function() {

      
   });

   button_dec.click(function() {
      
     });

    trigger.click(function () {
      hamburger_cross();      
    });

    // condense calc and calc2 later on
    function calc(e,d,n) {
      var encryptCoef =  Math.pow(num,e) % n,
          decryptCoef =  Math.pow(encryptCoef,d) % n,
          arr = [encryptCoef,decryptCoef];
      // console.log(prime1);
      // console.log(prime2); 
      // console.log(privateExponent);
      // console.log(modulus);
      // console.log(tao);
      return arr;
    }

    function getVar() {
      var publicExponent = parseInt($('#e').val()),
          prime1 =parseInt($('#p').val()),
          prime2 =parseInt($('#q').val()),
          arr = [publicExponent,prime1,prime2];
      return arr;
    }

    function calc2(e,p,q) {
      var n = p*q;
      var tao = (p-1)*(q-1);
      var d = tao + Euclid_gcd(tao,e)[2];
      var arr=[n,tao,d];
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