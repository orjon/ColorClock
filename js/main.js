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
    updateIndicatorColors();
    updateRotatorColors();
  }

  //clock size based on window resize
  window.onresize = function(){ 
    $('#displaySize').show();
    checkWindowSize();
    $('#displaySize').fadeOut(2000);
  };

  //Set clockSize based on screen width or height, whichever is smaller.
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

  //Update clock time every second (1000ms) 
  setInterval(updateClock, 1000);  


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
      $('#indicatorRotator').css('opacity','0.5');
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
      updateIndicatorColors();
    },


    onDragEnd: function(){
      $('#indicatorRotator').css('opacity','0.000001');
      // $('#indicatorRotator').fadeOut(500);
      $('#displayCalculations').fadeOut(2000);
    }
  });


  function updateIndicatorColors(){
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

    $('#positionOne'   ).css({'background-color': 'rgb('+clockColors[ 1][red]+','+clockColors[ 1][grn]+','+clockColors[ 1][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 1][red]+','+clockColors[ 1][grn]+','+clockColors[ 1][blu]+')'});
    $('#positionTwo'   ).css({'background-color': 'rgb('+clockColors[ 2][red]+','+clockColors[ 2][grn]+','+clockColors[ 2][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 2][red]+','+clockColors[ 2][grn]+','+clockColors[ 2][blu]+')'});
    $('#positionThree' ).css({'background-color': 'rgb('+clockColors[ 3][red]+','+clockColors[ 3][grn]+','+clockColors[ 3][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 3][red]+','+clockColors[ 3][grn]+','+clockColors[ 3][blu]+')'});
    $('#positionFour'  ).css({'background-color': 'rgb('+clockColors[ 4][red]+','+clockColors[ 4][grn]+','+clockColors[ 4][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 4][red]+','+clockColors[ 4][grn]+','+clockColors[ 4][blu]+')'});
    $('#positionFive'  ).css({'background-color': 'rgb('+clockColors[ 5][red]+','+clockColors[ 5][grn]+','+clockColors[ 5][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 5][red]+','+clockColors[ 5][grn]+','+clockColors[ 5][blu]+')'});
    $('#positionSix'   ).css({'background-color': 'rgb('+clockColors[ 6][red]+','+clockColors[ 6][grn]+','+clockColors[ 6][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 6][red]+','+clockColors[ 6][grn]+','+clockColors[ 6][blu]+')'});
    $('#positionSeven' ).css({'background-color': 'rgb('+clockColors[ 7][red]+','+clockColors[ 7][grn]+','+clockColors[ 7][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 7][red]+','+clockColors[ 7][grn]+','+clockColors[ 7][blu]+')'});
    $('#positionEight' ).css({'background-color': 'rgb('+clockColors[ 8][red]+','+clockColors[ 8][grn]+','+clockColors[ 8][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 8][red]+','+clockColors[ 8][grn]+','+clockColors[ 8][blu]+')'});
    $('#positionNine'  ).css({'background-color': 'rgb('+clockColors[ 9][red]+','+clockColors[ 9][grn]+','+clockColors[ 9][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[ 9][red]+','+clockColors[ 9][grn]+','+clockColors[ 9][blu]+')'});
    $('#positionTen'   ).css({'background-color': 'rgb('+clockColors[10][red]+','+clockColors[10][grn]+','+clockColors[10][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[10][red]+','+clockColors[10][grn]+','+clockColors[10][blu]+')'});
    $('#positionEleven').css({'background-color': 'rgb('+clockColors[11][red]+','+clockColors[11][grn]+','+clockColors[11][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[11][red]+','+clockColors[11][grn]+','+clockColors[11][blu]+')'});
    $('#positionTwelve').css({'background-color': 'rgb('+clockColors[12][red]+','+clockColors[12][grn]+','+clockColors[12][blu]+')',
          'box-shadow': '0 0 '+blur+'px '+blur+'px rgb('+clockColors[12][red]+','+clockColors[12][grn]+','+clockColors[12][blu]+')'});
  }

  function updateRotatorColors(){

    for (i = 1; i < rotatorColors.length; i++) {
      var tempShift = (colorShift+Math.round(i*(1530/12)));
      if (tempShift>1529) {
          tempShift = tempShift-1530;
      } 
      // console.log(i + ': ' + tempIndexShift);
      colorIndexToRGB(rotatorColors, i, tempShift);
    }

    $("#one").css('background-color', 'rgb('   + rotatorColors[1][red] + ','+ rotatorColors[1][grn] +  ',' + rotatorColors[1][blu] +')');
    $("#two").css('background-color', 'rgb('   + rotatorColors[2][red] + ','+ rotatorColors[2][grn] +  ',' + rotatorColors[2][blu] +')');
    $("#three").css('background-color', 'rgb(' + rotatorColors[3][red] + ','+ rotatorColors[3][grn] +  ',' + rotatorColors[3][blu] +')');
    $("#four").css('background-color', 'rgb('  + rotatorColors[4][red] + ','+ rotatorColors[4][grn] +  ',' + rotatorColors[4][blu] +')');
    $("#five").css('background-color', 'rgb('  + rotatorColors[5][red] + ','+ rotatorColors[5][grn] +  ',' + rotatorColors[5][blu] +')');
    $("#six").css('background-color', 'rgb('   + rotatorColors[6][red] + ','+ rotatorColors[6][grn] +  ',' + rotatorColors[6][blu] +')');
    $("#seven").css('background-color', 'rgb(' + rotatorColors[7][red] + ','+ rotatorColors[7][grn] +  ',' + rotatorColors[7][blu] +')');
    $("#eight").css('background-color', 'rgb(' + rotatorColors[8][red] + ','+ rotatorColors[8][grn] +  ',' + rotatorColors[8][blu] +')');
    $("#nine").css('background-color', 'rgb('  + rotatorColors[9][red] + ','+ rotatorColors[9][grn] +  ',' + rotatorColors[9][blu] +')');
    $("#ten").css('background-color', 'rgb('   + rotatorColors[10][red] + ','+ rotatorColors[10][grn] +  ',' + rotatorColors[10][blu] +')');
    $("#eleven").css('background-color', 'rgb('+ rotatorColors[11][red] + ','+ rotatorColors[11][grn] +  ',' + rotatorColors[11][blu] +')');
    $("#twelve").css('background-color', 'rgb('+ rotatorColors[12][red] + ','+ rotatorColors[12][grn] +  ',' + rotatorColors[12][blu] +')');
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

  // $("*").toggle(function(){
  //   $('#displayTime').fadeIn(100);
  // }, function() {
  //   $('#displayTime').fadeOut(1000);
  // });

// $("*").toggle(function(){
//     $('#displayTime').show();
//   }, function() {
//     $('#displayTime').hide();
//   });

// $( "td" ).toggle(
//   function() {
//     $( this ).addClass( "selected" );
//   }, function() {
//     $( this ).removeClass( "selected" );
//   }
// );






//---------------------------------------------------

// $("*").mousedown(function(e){
//     $('#displayTime').fadeOut(0);
//     $('#displayTime').fadeIn(250);
// });

// $("*").mouseup(function(e){
//     $('#displayTime').fadeOut(3000);
// });

  // $("*").click(function(){
  //   $('#displayTime').fadeToggle(250);
  // });






});


