
var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.requestAnimationFrame;

function connecthandler(e) {
  startHeader.classList = 'connected';
  statusHeader.innerText = 'Controller connected';
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  print.innerText = gamepad.id;
    
  /*
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i = 0; i < gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  var a = document.createElement("div");
  a.className = "axes";
  for (i = 0; i < gamepad.axes.length; i++) {
    e = document.createElement("meter");
    e.className = "axis";
    //e.id = "a" + i;
    e.setAttribute("min", "-1");
    e.setAttribute("max", "1");
    e.setAttribute("value", "0");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);
  document.getElementById("start").style.display = "none";
  */
  
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
  statusHeader.innerText = 'Controller disconnected';
  startHeader.classList = 'disconnected';
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  print.innerText = '';
  print.style.background = '';
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    
    var emoji = '';
    
    //var buttons = d.getElementsByClassName("button");
    for (var i = 0; i < controller.buttons.length; i++) {
      //var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      var touched = false;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }
        val = val.value;
      }
      //var pct = Math.round(val * 100) + "%";
      //b.style.backgroundSize = pct + " " + pct;
      //b.className = "button";
      
      var abxy = ['a', 'b', 'x', 'y'];
      
      // if button is not start button
      if (i != 9) {

        if (pressed) {
          
          // if button is in ABXY range
          if (i >= 0 && i > 4) {
            
            console.log(i);
            
            // show corresponding letter
            print.innerText = abxy[i];
            
          } else if (i > 5 && i < 8) { // if button is a pressable button
            
            emoji = 'Pistol';
            print.innerText = '';
            
          } else {
            
            emoji = 'Backhand-Index-Pointing-Up';
            print.innerText = '';
            
          }
          
        } else if (touched) {
          
          emoji = 'Index-Pointing-Up';
          print.innerText = '';
          
        }
        
      } else { // if button is start button
        
        // if not logging in
        if (print.innerText != controller.id) {
          
          // show emoji
          emoji = 'Play-Button';
          
        }  
        
      }
      
    }
    
    
    //var axes = d.getElementsByClassName("axis");
    for (var i = 0; i < controller.axes.length; i++) {
      /*var a = axes[i];
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i]);*/

      if (i == 3 || i == 1) {

        if (controller.axes[i] < -0.5) {
          emoji = 'Up-Arrow';
          print.innerText = '';
        }

        if (controller.axes[i] > 0.5) {
          emoji = 'Down-Arrow';
          print.innerText = '';
        }

      }

      if (i == 2 || i == 0) {

        if (controller.axes[i] < -0.5) {
          emoji = 'Left-Arrow';
          print.innerText = '';
        }

        if (controller.axes[i] > 0.5) {
          emoji = 'Right-Arrow';
          print.innerText = '';
        }

      }

      if (print.innerText != controller.id) {

        var emojiQuery = 'https://whatemoji.org/wp-content/uploads/2020/07/';

        if (emoji != '') {

          print.style.backgroundImage = 'url("' + emojiQuery + emoji + '-Emoji.png")';

        } else {

          print.style.backgroundImage = '';

        }
        
      }

    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

var startHeader;
var statusHeader;
var print;
var rumbleButtons;

var vibrationPresets = {
  
  weak: {
    duration: 250,
    strongMagnitude: 0,
    weakMagnitude: 0.07
  },
  
  stronger: {
    duration: 500,
    strongMagnitude: 0,
    weakMagnitude: 0.14
  },
  
  godlike: {
    duration: 1000,
    strongMagnitude: 1,
    weakMagnitude: 1
  },
  
}

window.onload = () => {
  
  document.body.classList.add('loaded');
  
  startHeader = document.querySelector('#start');
  statusHeader = document.querySelector('.status');
  print = document.querySelector('.print');
  rumbleButtons = document.querySelectorAll('.rumble');
  
  if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
  } else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
  }
  
  rumbleButtons.forEach(button => {
    
    button.addEventListener('click', async () => {
      
      // if controller is connected
      if (controllers[0]) {
        
        var vibrationEffect;
        
        // load a vibration preset
        if (button.classList.contains('godlike')) {
          
          vibrationEffect = vibrationPresets.godlike;
          
        } else if (button.classList.contains('double')) {
          
          vibrationEffect = vibrationPresets.stronger;
          
        } else {
          
          vibrationEffect = vibrationPresets.weak;
          
        }
        
        // play vibration effect
        var gamepad = controllers[0];
        if (gamepad.vibrationActuator) {
          button.classList.add('rumbling');
          await gamepad.vibrationActuator.playEffect('dual-rumble', vibrationEffect);
          button.classList.remove('rumbling');
        }
        
      }

    });

  });
  
}
