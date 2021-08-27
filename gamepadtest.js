
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
    
    /*
    var buttons = d.getElementsByClassName("button");
    for (var i = 0; i < controller.buttons.length; i++) {
      var b = buttons[i];
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
      var pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      b.className = "button";
      if (pressed) {
        b.className += " pressed";
      }
      if (touched) {
        b.className += " touched";
      }
    }

    var axes = d.getElementsByClassName("axis");
    */
    
    if (print.innerText != controller.id) {
      
      var emojiQuery = 'https://whatemoji.org/wp-content/uploads/2020/07/';
      var dir = '';
      
      for (var i = 0; i < controller.axes.length; i++) {
        /*var a = axes[i];
        a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
        a.setAttribute("value", controller.axes[i]);*/

        if (i == 3) {

          if (controller.axes[i] < -0.5) {
            dir = 'Up';
            print.innerText = '';
          }

          if (controller.axes[i] > 0.5) {
            dir = 'Down';
            print.innerText = '';
          }

        }

        if (i == 2) {

          if (controller.axes[i] < -0.5) {
            dir = 'Left';
            print.innerText = '';
          }

          if (controller.axes[i] > 0.5) {
            dir = 'Right';
            print.innerText = '';
          }

        }
        
        if (dir != '') {
          
          print.style.backgroundImage = 'url("' + emojiQuery + dir + '-Arrow-Emoji.png")';
          
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
var vibrateButton;

window.onload = () => {
  
  document.body.classList.add('loaded');
  
  startHeader = document.querySelector('#start');
  statusHeader = document.querySelector('.status');
  print = document.querySelector('.print');
  vibrateButton = document.querySelector('.vibrate');
  
  if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
  } else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
  }
  
  vibrateButton.addEventListener('click', () => {

    if (controllers[0]) {

      var gamepad = controllers[0];
      if (gamepad.vibrationActuator) {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
            duration: 1000,
            strongMagnitude: 1.0,
            weakMagnitude: 1.0
        });
      }

    }

  });
  
}
