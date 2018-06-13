$(document).ready(function(){
  // var $spinner = $("#indicators");
  var clickRotation = 0;
  // var clickRotation = 15 * 360/100;

  var rotationAngle=0;

  var timeIndex = 0;
  var timeString = 0;
  var colorIndex = 0;
  var colorIndexShifted = 0;
  var colorShift = 0;

  var blur = 0;

  const center = 0;
  const red = 0;
  const grn = 1;
  const blu = 2;
  var clockColors =      [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
  var rotatorColors = [["empty"],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];


  //On load get time and set colors.
  window.onload = function (){
    checkWindowSize();
    updateClock();
    updateIndicators();
    updateRotator();
  }

  //clock size based on window resize
  window.onresize = function(){ 
    $('#displaySize').stop();
    $('#displaySize').show();
    checkWindowSize();
    $('#displaySize').fadeOut(2000);
  };

  //Set clockSize t0 73% of window width or height, whichever is smaller.
  function checkWindowSize(){
  var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  $('#displaySize').text(windowWidth + 'W x ' +  windowHeight + 'H');
   
  if (windowWidth < windowHeight){
    document.documentElement.style.setProperty('--clockSize', '73vw');
  } else {
     document.documentElement.style.setProperty('--clockSize', '73vh');
  }
 }

  function delayedFn() {
    setInterval(updateClock, 1000);
  }

  //Update clock time every second (1000ms) 
  setTimeout(delayedFn(), 10000);  




  //Get system time and convert to timeIndex & colorIndex
  function updateTime() {
      var time = new Date();
      var hours = time.getHours() % 12;
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      
      timeIndex = (hours*60*60) + (minutes*60) + seconds;    //Stores unique 12hr time id based on number of seconds = (HOURS*60*60) + (MINUTES*60) + (SECONDS)
      colorIndex = Math.round(map(timeIndex,0, 43199, 0, 1529)); //Map timeIndex into available colours (0...1529)

      var hours = time.getHours().toString(); //convert to strings for padding
      var minutes = minutes.toString();
      var seconds = seconds.toString();
      if (hours.length < 2) {
        hours = '0' + hours;     //display padding
      }

      if (minutes.length < 2) {
        minutes = '0' + minutes; //display padding
      }
      if (seconds.length < 2) {
        seconds = '0' + seconds; //display padding
      }
      timeString = hours + ':' + minutes + ':' + seconds;
  }


  //Map number (num) in range 'in' to range 'out'
  function map (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }


  Draggable.create("#indicatorRotator", {
    type: "rotation",
    sticky: true,

    onClick: function(){
       // $('#indicatorRotator').fadeIn(50);
    },

    onPress: function(){
      $('#indicatorRotator').stop();    //stops any on-going previous animation to prevent jumps
      $('#displayCalculations').stop(); 
      $('#indicatorRotator').fadeTo(250,.15);
      $('#displayCalculations').fadeIn(250);
    },

    onDrag: function(){
      console.log('this.rotation: '+ this.rotation);

      var currentRotation = this.rotation

      if(currentRotation === undefined){
        currentRotation = 0;
      }
      rotationAngle = (currentRotation%360);
      if (rotationAngle<0) {
        rotationAngle = 360+rotationAngle;
      }

      colorShift = Math.round(map(rotationAngle,0, 360, 0, 1529)); //Map rotationAngle into available colours (0...1529)

      updateColourShift();
      updateInfoDisplays();
      updateCenter();
      updateIndicators();
    },


    onDragEnd: function(){
      $('#indicatorRotator').stop();          //stops any on-going previous animation to prevent jumps
      $('#indicatorRotator').fadeTo(750,0);
      $('#displayCalculations').fadeOut(1500);
    }
  });


  function updateIndicators(){
    console.log('Colour Shift' + colorShift);

    for (i = 1; i < clockColors.length; i++) {
      var tempShift = (-colorShift+Math.round(i*(1530/12)));
      if (tempShift>1529) {
          tempShift = tempShift-1530;
      } 
      if (tempShift<0) {
          tempShift = 1530+tempShift;
      } 
      console.log(i + ': ' + tempShift);
      colorIndexToRGB(clockColors, i, tempShift);
    } 


    $('#indicators .one'   ).css({'background-color': 'rgb('+clockColors[ 1][red]+','+clockColors[ 1][grn]+','+clockColors[ 1][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 1][red]+','+clockColors[ 1][grn]+','+clockColors[ 1][blu]+')'});
    $('#indicators .two'   ).css({'background-color': 'rgb('+clockColors[ 2][red]+','+clockColors[ 2][grn]+','+clockColors[ 2][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 2][red]+','+clockColors[ 2][grn]+','+clockColors[ 2][blu]+')'});
    $('#indicators .three' ).css({'background-color': 'rgb('+clockColors[ 3][red]+','+clockColors[ 3][grn]+','+clockColors[ 3][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 3][red]+','+clockColors[ 3][grn]+','+clockColors[ 3][blu]+')'});
    $('#indicators .four'  ).css({'background-color': 'rgb('+clockColors[ 4][red]+','+clockColors[ 4][grn]+','+clockColors[ 4][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 4][red]+','+clockColors[ 4][grn]+','+clockColors[ 4][blu]+')'});
    $('#indicators .five'  ).css({'background-color': 'rgb('+clockColors[ 5][red]+','+clockColors[ 5][grn]+','+clockColors[ 5][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 5][red]+','+clockColors[ 5][grn]+','+clockColors[ 5][blu]+')'});
    $('#indicators .six'   ).css({'background-color': 'rgb('+clockColors[ 6][red]+','+clockColors[ 6][grn]+','+clockColors[ 6][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 6][red]+','+clockColors[ 6][grn]+','+clockColors[ 6][blu]+')'});
    $('#indicators .seven' ).css({'background-color': 'rgb('+clockColors[ 7][red]+','+clockColors[ 7][grn]+','+clockColors[ 7][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 7][red]+','+clockColors[ 7][grn]+','+clockColors[ 7][blu]+')'});
    $('#indicators .eight' ).css({'background-color': 'rgb('+clockColors[ 8][red]+','+clockColors[ 8][grn]+','+clockColors[ 8][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 8][red]+','+clockColors[ 8][grn]+','+clockColors[ 8][blu]+')'});
    $('#indicators .nine'  ).css({'background-color': 'rgb('+clockColors[ 9][red]+','+clockColors[ 9][grn]+','+clockColors[ 9][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 9][red]+','+clockColors[ 9][grn]+','+clockColors[ 9][blu]+')'});
    $('#indicators .ten'   ).css({'background-color': 'rgb('+clockColors[10][red]+','+clockColors[10][grn]+','+clockColors[10][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[10][red]+','+clockColors[10][grn]+','+clockColors[10][blu]+')'});
    $('#indicators .eleven').css({'background-color': 'rgb('+clockColors[11][red]+','+clockColors[11][grn]+','+clockColors[11][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[11][red]+','+clockColors[11][grn]+','+clockColors[11][blu]+')'});
    $('#indicators .twelve').css({'background-color': 'rgb('+clockColors[12][red]+','+clockColors[12][grn]+','+clockColors[12][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[12][red]+','+clockColors[12][grn]+','+clockColors[12][blu]+')'});

  }

  function updateRotator(){

    for (i = 1; i < rotatorColors.length; i++) {
      var tempShift = (0+Math.round(i*(1530/12)));
      if (tempShift>1529) {
          tempShift = tempShift-1530;
      } 
      // console.log(i + ': ' + tempIndexShift);
      colorIndexToRGB(rotatorColors, i, tempShift);
    }

    $("#indicatorRotator .one").css('background-color', 'rgb('   + rotatorColors[1][red] + ','+ rotatorColors[1][grn] +  ',' + rotatorColors[1][blu] +')');
    $("#indicatorRotator .two").css('background-color', 'rgb('   + rotatorColors[2][red] + ','+ rotatorColors[2][grn] +  ',' + rotatorColors[2][blu] +')');
    $("#indicatorRotator .three").css('background-color', 'rgb(' + rotatorColors[3][red] + ','+ rotatorColors[3][grn] +  ',' + rotatorColors[3][blu] +')');
    $("#indicatorRotator .four").css('background-color', 'rgb('  + rotatorColors[4][red] + ','+ rotatorColors[4][grn] +  ',' + rotatorColors[4][blu] +')');
    $("#indicatorRotator .five").css('background-color', 'rgb('  + rotatorColors[5][red] + ','+ rotatorColors[5][grn] +  ',' + rotatorColors[5][blu] +')');
    $("#indicatorRotator .six").css('background-color', 'rgb('   + rotatorColors[6][red] + ','+ rotatorColors[6][grn] +  ',' + rotatorColors[6][blu] +')');
    $("#indicatorRotator .seven").css('background-color', 'rgb(' + rotatorColors[7][red] + ','+ rotatorColors[7][grn] +  ',' + rotatorColors[7][blu] +')');
    $("#indicatorRotator .eight").css('background-color', 'rgb(' + rotatorColors[8][red] + ','+ rotatorColors[8][grn] +  ',' + rotatorColors[8][blu] +')');
    $("#indicatorRotator .nine").css('background-color', 'rgb('  + rotatorColors[9][red] + ','+ rotatorColors[9][grn] +  ',' + rotatorColors[9][blu] +')');
    $("#indicatorRotator .ten").css('background-color', 'rgb('   + rotatorColors[10][red] + ','+ rotatorColors[10][grn] +  ',' + rotatorColors[10][blu] +')');
    $("#indicatorRotator .eleven").css('background-color', 'rgb('+ rotatorColors[11][red] + ','+ rotatorColors[11][grn] +  ',' + rotatorColors[11][blu] +')');
    $("#indicatorRotator .twelve").css('background-color', 'rgb('+ rotatorColors[12][red] + ','+ rotatorColors[12][grn] +  ',' + rotatorColors[12][blu] +')');
    }

  function colorIndexToRGB(colorArray, segment, index) {
    const maxValue = 255;

    if (index <= 255 ) { 
      colorArray[segment][red] = maxValue; 
      colorArray[segment][grn] = index; 
      colorArray[segment][blu] = 0;
      return;
      }
    
    if ((index > 255) && (index <= 510)) { 
      colorArray[segment][red] = maxValue-(index-(255)); 
      colorArray[segment][grn] = maxValue; 
      colorArray[segment][blu] =0;
      return;
      }
      
    if ((index > 510) && (index <= 765)) {
      colorArray[segment][red] =0; 
      colorArray[segment][grn] =maxValue; 
      colorArray[segment][blu] =(index-(510));
      return;
      }
      
    if ((index > 765) && (index <= 1020)) {
      colorArray[segment][red] =0; 
      colorArray[segment][grn] =maxValue-(index-(765)); 
      colorArray[segment][blu] =maxValue;
      return;
      }
      
    if ((index > 1020) && (index <= 1275)) {
      colorArray[segment][red] =(index-(1020)); 
      colorArray[segment][grn] =0; 
      colorArray[segment][blu] =maxValue;
      return;
      }
      
    if ((index > 1275) && (index <= 1530)) { 
      colorArray[segment][red] = maxValue;
      colorArray[segment][grn] =0;
      colorArray[segment][blu] = maxValue-(index-(1275));
      return;
      }
    }


  function consoleArrayDump(){
    console.log('-Array Dump---------');
    for (i = 1; i < clockColors.length; i++) {
      console.log(i + ': ' + clockColors[i]); 
      }
    console.log('center: ' + clockColors[center]);
  }

  function updateInfoDisplays(){
    $('#displayTime').text(timeString);
    $('#displayShift').text(rotationAngle.toFixed(1) + '°'); 
    $('#displayCalculations').text('Time Index:' + timeIndex + ' • Shift:' + rotationAngle.toFixed(1) + '° = ' + colorShift + ' • Color Index:' + colorIndexShifted + '  | R' + clockColors[center][red] +' G' + clockColors[center][grn] +' B' + clockColors[center][blu]);
  }

  function updateCenter(){
    colorIndexToRGB(clockColors, center,colorIndexShifted);
    $('#center').css({'background-color': 'rgb('+ clockColors[center][red] + ','+ clockColors[center][grn] +  ',' + clockColors[center][blu] +')',
                     'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+ clockColors[center][red] + ','+ clockColors[center][grn] +  ',' + clockColors[center][blu] +')'});
  }

  function updateClock(){
    updateTime();
    updateColourShift();
    updateInfoDisplays();
    updateCenter();
  }

  //Update colorIndex with colorShift value
  function updateColourShift(){
    colorIndexShifted = colorIndex - colorShift;
    if (colorIndexShifted < 0 ) {
      colorIndexShifted = 1530 + colorIndexShifted;
    }
  }

  $('.icon').click(function(){
    $('.icon-options').fadeIn(750);
    $('#cog').fadeOut(750);
    $('#hands').fadeOut(750);
    $('#hours').fadeOut(750);
    $('#minutes').fadeOut(750);
  });

  $('#close').click(function(){
    $('.icon-options').fadeOut(750);
    $('#cog').fadeIn(750);
    $('#hands').fadeIn(750);
    $('#hours').fadeIn(750);
    $('#minutes').fadeIn(750);
  });

  // $('#visibility').hover(function(){
  //   $('#visibilityAlt').toggle();
  //   $('#visibility').toggle();
  // });

  //  $('#visibilityAlt').hover(function(){
  //   $('#visibilityAlt').toggle();
  //   $('#visibility').toggle();
  // });

  // $('#lock').hover(function(){
  //   $('#lockAlt').toggle();
  //   $('#lock').toggle();
  // });

  //   $('#lockAlt').hover(function(){
  //   $('#lockAlt').toggle();
  //   $('#lock').toggle();
  // });

  $('#visibility').click(function(){
    $('#visibilityAlt').toggle();
    $('#displayTime').toggle();
    // $('#visibilityAlt').fadeIn(250);
  });

  $('#lock').click(function(){
    $('#lockAlt').toggle();
    // $('#lock').toggle();
    // $('#lockAlt').fadeIn(250);
  });


  $('#visibilityAlt').click(function(){
        $('#visibilityAlt').toggle();
        $('#displayTime').toggle();
    // $('#visibilityAlt').fadeOut(250);
  });


    $('#lockAlt').click(function(){
    $('#lockAlt').toggle();
    // $('#lockAlt').toggle();
  });



    //   $('#visibility').mouseover(function(){
    // this.src= "images/color&clock(83x83).png";
    // $(this).css('opacity','0.75');


});


