<h1 align="center"><a href="https://daniilshat.ru/" target="_blank">WirenBoard Scripts</a> 
<img src="https://github.com/blackcater/blackcater/raw/main/images/Hi.gif" height="32"/></h1>
<h3>Управление дискретным освещением</h3>

```javascript
function light_control(name, device_in, control_in, device_out, control_out) {  // Функция в которую передаем значения
    defineVirtualDevice(name, {                // Виртуальное устройство для управления светом                           
        title: name,
	cells: {
    	TOGGLE_switch : {                      // Кнопка для вкл./выкл. света
	    type : "pushbutton",
	    value : false
	    }, 
	switch_fb : {                        // feedback
            type : "switch",
	    value : false
            },
	}
 });

    // Правило для управления светом с выключателя
    defineRule(name + "_switch_control", {
        whenChanged: device_in + "/" + control_in,             // Изменение состояния входа 
        then: function (newValue, devName, cellName) {
	    if ( newValue > 0) {                                  // Если значении больше 0
	        if (dev[device_out][control_out] == false) {      // Если выход в положении false
	            dev[device_out][control_out] = true;          // Передать выходу значение true
                    dev[name]["switch_fb"] = true;
	        }else{                                        // Если значение меньше 1
		    dev[device_out][control_out] = false;     // Передать выходу значение false
                    dev[name]["switch_fb"] = false;
	       }
	   }
       }
 });

    // Правило для управления светом с веб-интерфеса wirenboard
    defineRule(name + "_switch_control_web", {
        whenChanged: name + "/TOGGLE_switch",           // Изменение состояния кнопки для вкл./выкл. света с веб-интерфейса wirenboard
	then: function (newValue, devName, cellName) {
	    if ( newValue > 0) { 
                if (dev[device_out][control_out] == false) {
		    dev[device_out][control_out] = true;
                    dev[name]["switch_fb"] = true;
		}else{
		    dev[device_out][control_out] = false;
		    dev[name]["switch_fb"] = false;
		}
           }
      }
});

    // Правило для получения обратной связи от групп света
    defineRule(device_out + "/" + control_out + "_fb", {
	whenChanged: device_out + "/" + control_out,        // Изменение состония выхода
	then: function (newValue, devName, cellName) {
	    if (dev[device_out][control_out] == true) {
                dev[name]["switch_fb"] = true;
	   }else{
            	dev[name]["switch_fb"] = false;
           }
      }
 });
}

// Передача параметров в функцию
light_control("room101_light_grС2", "wb-gpio", "EXT1_IN1", "wb-gpio", "EXT5_R3A2");//Освещение пом. 101 Гр. С2
light_control("room101_light_grС11", "wb-gpio", "EXT1_IN2", "wb-gpio", "EXT5_R3A1");//Освещение пом. 101 Гр. С1
light_control("room101_light_grС3_1", "wb-gpio", "EXT1_IN4", "wb-gpio", "EXT5_R3A3");//Освещение пом. 102 Гр. С3.1
light_control("room102_light_grС3_2", "wb-gpio", "EXT1_IN6", "wb-gpio", "EXT5_R3A4");//Освещение пом. 102 Гр.С3.2
light_control("room103_light_grС5", "wb-gpio", "EXT1_IN7", "wb-gpio", "EXT6_R3A1");//Освещение пом. 103 Гр.С5
```
<h3>Диммирование</h3>

```javascript


//Короткое нажатие левой клавиши - вкл, прав - выкл
//Долгое нажатие левой клавиши - диммирование вверх, прав - диммирование вниз
function dim_control(name, device_in_up, control_in_up, device_in_dn, control_in_dn, device_out, control_out) {
var button_timer_delay = 1000; //ms; задержка начала диммирования (долгое нажатие)
var button_timer_interval = 1000; //ms; задержка изменения диммирования (время между 2 шагами диммирования)
var button_timer_id_delay = null;  //идентификатор таймера долгого нажатия
var button_timer_id_interval = null;  //идентификатор таймера шагов диммирования
var button_was_dimmed = 0; // было ли диммирование

// правило связывания входа c выключателя с каналом реле (диммирование вверх)
defineRule(name + "_" + "_up_btn", {
    // с каким входным каналом связываем "<устройтсво>/<канал>"
    whenChanged: device_in_up + "/" + control_in_up, 
    then: function(newValue, devName, cellName) {
	// если нажали
        if ((newValue == 1) && (dev[device_in_dn][control_in_dn] == 0)) {
          // установка таймера, по истечению которого начинаем диммировать (вызывается каждые button_timer_delay "ms)
          button_timer_id_delay = setTimeout(function() {
          // установка повторяемого таймера при диммировании (вызывается каждые button_timer_interval "ms)
              button_timer_id_interval = setTimeout(function up_dim() {
                  if (dev[device_out][control_out] < 91) {
                     dev[device_out][control_out] = dev[device_out][control_out] + 10;
                  } else {
                    dev[device_out][control_out] = 100;
                  }
                  // изменяем переменную диммирования (чтобы при отпускании кнопки не изменить состоянии группы)
                  button_was_dimmed = 1;
		  button_timer_id_interval = null;
		  if (dev[device_out][control_out] < 99)
		      button_timer_id_interval = setTimeout(up_dim, button_timer_interval);
                }, button_timer_interval);
		button_timer_id_delay = null;
            }, button_timer_delay);
        }else{
            if (button_was_dimmed == 0) {
                dev[device_out][control_out] = 100;
             }
            // изменяем переменную диммирования (чтобы заново можно было диммировать и по первому короткому изменять 
            // состояние группы
            button_was_dimmed = 0;
            // сбрасываем таймеры
            if (button_timer_id_delay != null) {	  
                clearTimeout(button_timer_id_delay);
	        button_timer_id_delay = null;
	     }
            if (button_timer_id_interval != null) {		  
	        clearTimeout(button_timer_id_interval);
	        button_timer_id_interval = null;
	   }
        }
    }
});

// правило связывания входа c выключателя с каналом реле (диммирование вниз)
defineRule(name + "_" + "_dn_btn", {
    whenChanged: device_in_dn + "/" + control_in_dn,   // с каким входным каналом связываем "<устройтсво>/<канал>"
    then: function(newValue, devName, cellName) {      // если нажали
        if ((newValue == 1) && (dev[device_in_up][control_in_up] == 0)) {
            // установка таймера, по истечению которого начинаем диммировать (вызывается каждые button_timer_delay "ms)
            button_timer_id_delay = setTimeout(function() {
            // установка повторяемого таймера при диммировании (вызывается каждые button_timer_interval "ms)
            button_timer_id_interval = setTimeout(function down_dim() {
                if (dev[device_out][control_out] > 9) {
                    dev[device_out][control_out] = dev[device_out][control_out] - 10;
              }else{
                    dev[device_out][control_out] = 0;
                  }
                  // изменяем переменную диммирования (чтобы при отпускании кнопки не изменить состоянии группы)
                  button_was_dimmed = 1;
		  button_timer_id_interval = null;
		if (dev[device_out][control_out] > 0)
		    button_timer_id_interval = setTimeout(down_dim, button_timer_interval);
                }, button_timer_interval);
		  button_timer_id_delay = null;
            }, button_timer_delay);
       }else{
       	  if (button_was_dimmed == 0) {
              dev[device_out][control_out] = 0;
           }
          // изменяем переменную диммирования (чтобы заново можно было диммировать и по первому короткому изменять 
          // состояние группы
          button_was_dimmed = 0;
          // сбрасываем таймеры
           if (button_timer_id_delay != null){
	       clearTimeout(button_timer_id_delay);
	       button_timer_id_delay = null;
	   }
           if (button_timer_id_interval != null) {		  
	       clearTimeout(button_timer_id_interval);
	       button_timer_id_interval = null;
            }
        }
    }
});

// првило переключения с панели/виджета
defineRule(name + "_" + "_toggle_cmd", {
  whenChanged: name + "_" + "/TOGGLE_switch", 
  then: function(newValue, devName, cellName) {
      if (dev[device_out][control_out] > 0) {
          dev[device_out][control_out] = 0;
     }else{
          dev[device_out][control_out] = 100;
       }
    }
});
}

setTimeout(function() { dim_control("room106_dim", "wb-gpio", "EXT2_DR5", "wb-gpio", "EXT2_DR6", "wb-mdm3_129", "channel2"); }, 50000);

```

<h3>Управление шторами</h3>

```javascript

// Короткое нажатие: левая клавиша открытие, правая - закрытие
// Долгое нажатие любой - стоп
function blind_control(name, device_in_up, control_in_up, device_in_dn, control_in_dn, device_out, control_out_on, control_out_dir) {
    defineVirtualDevice(name, {
        title: name,
	cells: {
	OPEN_switch : {                // открытие
	    type : "pushbutton",
	    value : false
	},
	CLOSE_switch : {              // закрытие
	    type : "pushbutton",
	    value : false  
	},
	STOP_switch : {               // остановка
	    type : "pushbutton",
	    value : false
	},
      }
  });
	
    var button_timer_delay = 1000;     // задержка для стопа (ms)
    var button_timer_id_delay = null;  // идентификатор таймера долгого нажатия
    var button_was_hold = 0; 		   // было ли удержание выключателся

    // правило связывания входа c выключателя с каналом реле (открытие)
    defineRule(name + "/open_switch", {
        whenChanged: device_in_up + "/" + control_in_up,    // с каким входным каналом связываем "<устройтсво>/<канал>"
        then: function(newValue, devName, cellName) {
	    if (newValue > 0) {				// если нажали
		button_timer_id_delay = setTimeout(function() {				// установка таймера, по истечению которого подаём стоп
		dev[device_out][control_out_on] = false;
		button_was_hold = true;
		button_timer_id_delay = null;
		}, button_timer_delay);
	   }else{
		if (button_was_hold == 0) {                
		    setTimeout(function() { 
		    dev[device_out][control_out_dir] = false;
		    dev[device_out][control_out_on] = true; }, button_timer_delay);
		 }
		// изменяем переменную стопа, чтобы заново можно было посылать и сбрасывать сигнал
		button_was_hold = false;     // состояние группы
		// сбрасываем таймеры
		if (button_timer_id_delay != null) {					
		    clearTimeout(button_timer_id_delay);
		     button_timer_id_delay = null;
	       }
	   }
	}
    });
	
    // правило связывания входа выключателя с каналом реле (закрытие)
    defineRule(name + "/close_switch", {
        whenChanged: device_in_dn + "/" + control_in_dn,  // с каким входным каналом связываем "<устройтсво>/<канал>"
	then: function(newValue, devName, cellName) {
	    if (newValue > 0) {				// если нажали
		button_timer_id_delay = setTimeout(function() {   // установка таймера, по истечению которого подаём стоп
		dev[device_out][control_out_on] = false;
		button_was_hold = true;
		button_timer_id_delay = null;
		}, button_timer_delay);
	    }else{
		if (button_was_hold == 0) {					
		    setTimeout(function() { 
		    dev[device_out][control_out_dir] = true;
		    dev[device_out][control_out_on] = true; }, button_timer_delay);
		 }
		// изменяем переменную стопа, чтобы заново можно посылать сбрасывать сигнал
		button_was_hold = 0;    // состояние группы					
		// сбрасываем таймеры
		if (button_timer_id_delay != null) {					
		    clearTimeout(button_timer_id_delay);
		    button_timer_id_delay = null;
		}
	   }
	}
    });	
	
     // правило открытия с панели/виджета
     defineRule(name + "/open_widget", {
         whenChanged: name + "/OPEN_switch",
	 then: function(newValue, devName, cellName) {
	     setTimeout(function() { 
                  dev[device_out][control_out_dir] = false;
		  dev[device_out][control_out_on] = true; }, button_timer_delay);
         }
     });
	
     // првило закрытие с панели/виджета
    defineRule(name + "/close_widget", {
        whenChanged: name + "/CLOSE_switch",
	then: function(newValue, devName, cellName) {
	    setTimeout(function() { 
	       dev[device_out][control_out_dir] = true;
	       dev[device_out][control_out_on] = true; }, button_timer_delay);
         }
     });
	
     // првило стоп с панели/виджета
     defineRule(name + "/stop_widget", {
         whenChanged: name + "/STOP_switch",
	 then: function(newValue, devName, cellName) {
		dev[device_out][control_out_on] = false;
	    }
     });
}

setTimeout(function() { blind_control("living_room_blind", "wb-gpio", "EXT1_IN13", "wb-gpio", "EXT1_IN14", "wb-mio-gpio_125", "ON1", "DIR1"); }, 100); 
setTimeout(function() { blind_control("bedroom_blind", "wb-gpio", "EXT1_IN9", "wb-gpio", "EXT1_IN10", "wb-mio-gpio_125", "ON2", "DIR2"); }, 100); 

```
