$(document).ready(function(){
  // var $spinner = $("#indicators");
  var clickRotation = 0;
  // var clickRotation = 15 * 360/100;

  var rotationAngle=0;

  var timeIndex =  0;
  var timeString = 0;
  var colorIndex = 0;
  var colorIndexShifted = 0;
  var colorShift = 0;

  var blur = 0;

  const center = 0;
  const red = 0;
  const grn = 1;
  const blu = 2;
  const hrs = 0;
  const min = 1;
  const sec = 2;

  var   theTime =        [0,0,0];  //time array: HOURS,MINS,SECS
  const indicatorOrder = [12,6,1,7,2,8,3,9,4,10,5,11]; //Order of indicators in DOM
  var clockColors =      [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
  var rotatorColors =    [["empty"],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];


  //On load get time and set colors.
  window.onload = function (){
    checkWindowSize();
    updateClock();
    updateIndicators(clockColors, colorShift);
    updateIndicators(rotatorColors,0);
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

  setTimeout(function(){setInterval(updateClock, 1000)}, 8000); //Check time every 1s after initail 8s delay for animation smoothness.


  //Get system time and convert to timeIndex & colorIndex
  function updateTime() {
    var time = new Date();
    theTime = [time.getHours(),time.getMinutes(),time.getSeconds()];

    timeIndex = ((theTime[hrs]%12)*60*60) + (theTime[min]*60) + theTime[sec];    //Stores unique 12hr time id based on number of seconds = (HOURS*60*60) + (MINUTES*60) + (SECONDS)
    colorIndex = Math.round(map(timeIndex,0, 43199, 0, 1529)); //Map timeIndex into available colours (0...1529)

    var hours =   theTime[hrs].toString(); //convert to strings for padding
    var minutes = theTime[min].toString();
    var seconds = theTime[sec].toString();
    if (hours.length < 2) {
      hours = "0" + hours;     //display padding
    }
    if (minutes.length < 2) {
      minutes = "0" + minutes; //display padding
    }
    if (seconds.length < 2) {
      seconds = "0" + seconds; //display padding
    }
    timeString = hours + ":" + minutes + ":" + seconds;
  }

//-------------FUNCTION ONLY USED ON ARDUINO VERSION OF CLOCK--------------------------------------
  // function updateArduino() {   //update Adruino using AJAX
  //   var url = "/arduino/" + theTime + "," + colorShift;
  //   var xmlhttp = new XMLHttpRequest();
  //       xmlhttp.open("POST", url, true); //false is synchronous mode, asynchronous is preferred
  //       xmlhttp.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
  //       xmlhttp.send(null);
  //   console.log("Uploaded: " + theTime + "," + colorShift);
  // }
//-------------FUNCTION ONLY USED ON ARDUINO VERSION OF CLOCK--------------------------------------


  //Map number (num) in range 'in' to range 'out'
  function map (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  var draggableIndicators = Draggable.create("#indicatorRotator", {
    type: "rotation",
    sticky: true,

    onPress: function(){
      $('#indicatorRotator').stop();    //stops any on-going previous animation to prevent jumps
      $('#displayCalculations').stop(); 
      $('#indicatorRotator').fadeTo(250,.15);
      $('#displayCalculations').fadeIn(250);
    },

    onDrag: function(){
      console.log("Rotation Angle: "+ this.rotation);

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
      updateIndicators(clockColors,colorShift);
    },

    onRelease: function(){
      //----FUNCTION ONLY CALLED ON ARDUINO VERSION OF CLOCK-------
      // updateArduino();
     //----FUNCTION ONLY CALLED ON ARDUINO VERSION OF CLOCK-------
      $('#indicatorRotator').stop();          //stops any on-going previous animation to prevent jumps
      $('#indicatorRotator').fadeTo(750,0);
      $('#displayCalculations').fadeOut(1500);
    }
  });


  function updateIndicators(indicatorArray, shiftAmount){
    console.log("Color Shift: " + shiftAmount);

    for (i = 1; i < indicatorArray.length; i++) {
      var tempShift = ((-shiftAmount)+Math.round(i*(1530/12)));
      if (tempShift>1529) {
          tempShift = tempShift-1530;
      } 
      if (tempShift<0) {
          tempShift = 1530+tempShift;
      } 
      colorIndexToRGB(indicatorArray, i, tempShift);
      //console.log( '%cIndicator '+ i+ ": " + indicatorArray[i], 'background: rgb('+ indicatorArray[i]+')'); 
    } 
    
    var cssTag = '#indicators'; 

    if (indicatorArray[0] == "empty"){ //ensures correct part of HTML is selected
      cssTag = '#indicatorRotator';
    }

    $(cssTag + ' .indicator').each(function( index ) {
      $(this).css('background-color', 'rgb('+indicatorArray[(indicatorOrder[index])][red]+','+indicatorArray[(indicatorOrder[index])][grn]+','+indicatorArray[(indicatorOrder[index])][blu]+')');
    }); 

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

  function updateInfoDisplays(){
    $('#displayTime').text(timeString);
    $('#displayShift').text(rotationAngle.toFixed(1) + '°'); 
    $('#displayCalculations').text('Time Index:' + timeIndex + ' • Shift:' + rotationAngle.toFixed(1) + '° = ' + colorShift + ' • Color Index:' + colorIndexShifted + '  • R' + clockColors[center][red] +' G' + clockColors[center][grn] +' B' + clockColors[center][blu]);
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
    console.log( '%cCurrent time: '+timeString, 'background: rgb('+ clockColors[0]+')'); 
  }


  //Update colorIndex with colorShift value
  function updateColourShift(){
    colorIndexShifted = colorIndex - colorShift;
    if (colorIndexShifted < 0 ) {
      colorIndexShifted = 1530 + colorIndexShifted;
    }
  }

  $('.icon1').click(function(){
    console.log('Clicked: Settings');
    $('.icon-options').fadeIn(750);
    $('#cog').fadeOut(750);
    $('#hands').fadeOut(750);
    $('#hours').fadeOut(750);
    $('#minutes').fadeOut(750);
  });

  $('#close').click(function(){
    console.log('Clicked: Close menu');
    $('.icon-options').fadeOut(750);
    $('#cog').fadeIn(750);
    $('#hands').fadeIn(750);
    $('#hours').fadeIn(750);
    $('#minutes').fadeIn(750);
  });

  $('#icon2').click(function(){
    console.log('Clicked: Show/Hide time');
    $('#visibilityAlt').toggle();
    $('#visibility').toggle();
    $('#displayTime').toggle();
  });

  $('#lock').click(function(){
    console.log('Clicked: %cLock','color:white; background:Red'); //css in console!
    $('#lockAlt').toggle();
    $('#lock').toggle();
    draggableIndicators[0].disable();
  });

  $('#lockAlt').click(function(){
    console.log('Clicked: %cUnlock','color:white; background:Green'); //css in console!
    $('#lockAlt').toggle();
    $('#lock').toggle();
    draggableIndicators[0].enable();
  });

});


