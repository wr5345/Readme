<h1 align="center"><color: green>Примеры</a> 
<img src="https://i.gifer.com/origin/a4/a47ee1bccc3a67197f87cbf02e00eae4_w200.gif" height="40"/></h1>

+ [Управление дискретным освещением](#Parag1)
+ [Управление диммируемым освещением](#Parag2)
+ [Управление шторами](#Parag3)
+ [Управление климатом с использованием термостата](#Parag4)
+ [Создание сценария управления освещением - MasterOff](#Parag5)
+ [Контроль протечек](#Parag6)
+ [Управление конветором отопления](#Parag7)

##### <a name="Parag1"></a>
<h2>Управление дискретным освещением  <Img src="https://cdn-icons-png.flaticon.com/512/3305/3305969.png" Width="20" Height="20"></h2>

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
##### <a name="Parag2"></a>
<h2>Диммирование  <Img src="https://cdn-icons.flaticon.com/png/512/3098/premium/3098547.png?token=exp=1658844769~hmac=fd22b4190601f16f72bb2066a48bd624" Width="28" Height="28"></h2>
	
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
##### <a name="Parag3"></a>
<h3>Управление шторами     <Img src="https://cdn-icons.flaticon.com/png/512/1834/premium/1834833.png?token=exp=1658844671~hmac=a1c2f275903a0e595c183b1c8d40f4aa" Width="21" Height="21"></h3>

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
##### <a name="Parag4"></a>
<h3>Управление климатом с использованием термостата     <Img src="https://cdn-icons.flaticon.com/png/512/1165/premium/1165059.png?token=exp=1658844120~hmac=f583ab46c361853ff6a9f6fda049fcc8" Width="21" Height="21"></h3>

```javascript

// Виртуальное устройство для управления климатом
defineVirtualDevice("Climat_control", {
    title: "Climat_control",
    cells: {
    "temp_setpoint_bedroom" : { 	// уставка температуры для спальни
        type : "range",
	max: 28,
        min: 18,
	value : 25
     },
    "temp_setpoint_fb_bedroom" : {        // setpoint_fb от Siemens'a
	type : "range",
	max: 28,
        min: 18,
	value : 25
     },
    "temperature_sensor_bedroom" : { // значение датчика температуры в спальне
	type : "range",
	max: 28,
        min: 18,
	value : 25
     },
   }
});

// Переменные используемые для управления климатом 
var servo_device_1 = "wb-gpio";
var servo_control_1 = "EXT2_K3";
var servo_device_2 = "wb-gpio";
var servo_control_2 = "EXT2_K4";
var thermostat_1 = "siemens_rdf302_30";   // значение переменной потребуется изменить при использовании нескольких термомтатов siemens
var default_temperature = 21;

// передача значений с датчика температуры термостата siemens на виртуальное устройство Climat_control
defineRule("climat_bedroom_rule_1", {                             
    whenChanged: thermostat_1 + "/current_temperature",
    then: function (newValue, devName, cellName) {
	dev["Climat_control"]["temperature_sensor_bedroom"] = newValue;
     }
});

// задание уставки на термостате siemens с приложения
defineRule("climat_bedroom_rule_2", {                           
    whenChanged: "Climat_control/temp_setpoint_bedroom" ,  		
    then: function (newValue, devName, cellName) {
	if (newValue >= 18 && newValue <= 28) {     	 		
	    dev[thermostat_1]["setpoint"] = newValue;        
	}else{
	    dev[thermostat_1]["setpoint"] = default_temperature;
      }
    }
});

// открытие и перекрытие сервоприводов в зависимости от заданной уставки с термостата siemens 
defineRule("climat_bedroom_rule_3", {                          
    whenChanged: thermostat_1 + "/setpoint",            // изменение уставки у термостата siemens
    then: function (newValue, devName, cellName) {
        if (newValue >= 18 && newValue <= 28) {                      // если значение уставки в пределах от 18 до 28
            dev["Climat_control"]["temp_setpoint_fb_bedroom"] = newValue;
	    if (newValue < dev["Climat_control"]["temperature_sensor_bedroom"]) {     // если значение уставки меньше значения датчика температуры
		dev[servo_device_1][servo_control_1] = true;                         // сервоприводы перекрыты
		dev[servo_device_2][servo_control_2] = true;
	    }else{				                             // если значение уставки выше значения с датчика температуры
		dev[servo_device_1][servo_control_1] = false; 			// сервоприводы открыты
		dev[servo_device_2][servo_control_2] = false; 			
				}
        }else{													  // если же значение не в пределах от 18 до 28
	   dev["Climat_control"]["temp_setpoint_fb_bedroom"] = default_temperature;  // устанавливаем стандартную температуру
	 }
     }
});

// открытие и перекрытие с ервоприводов в зависимости от показаний датчика температуры термостата siemens
defineRule("climat_bedroom_rule_4", {                            
    whenChanged: thermostat_1 + "/current_temperature",               // изменение показаний датчика температуры термостата siemens
    then: function (newValue, devName, cellName) {
        if (newValue < dev["Climat_control"]["temp_setpoint_fb_bedroom"]) {   // если значение датчика температуры меньше уставки термостата
            dev[servo_device_1][servo_control_1] = false;                  // сервоприводы открыты
	    dev[servo_device_2][servo_control_2] = false;
	}else{                                                         // если же значение датчика температуры выше уставки термостата
	    dev[servo_device_1][servo_control_1] = true;         	  // сервоприводы перекрыты
	    dev[servo_device_2][servo_control_2] = true;
          }
      }
});

```
##### <a name="Parag5"></a>
<h3>Сцена MasterOff     <Img src="https://cdn-icons-png.flaticon.com/512/422/422287.png" Width="20" Height="20"></h3>

```javascript

// Виртуальное устройство для управления сценой master_Off(выключить все)
defineVirtualDevice("master_off_control", {
  title: "master_off_control", 
  cells: {
    master_off_ON_switch : {
        type : "pushbutton",
        value : false
    },
  }
});

// Правило управления сценой с клавиши
defineRule("master_off_control_button", {
  whenChanged: "wb-gpio/EXT3_IN1",
  then: function (newValue, devName, cellName) {
    	Master_OFF()           // Вызов функции
  }
});

// Правило управления сценой с виджета на веб-интерфейсе wirenboard
defineRule("master_off_control_on_switch_cmd", { 
  whenChanged: "master_off_control/master_off_ON_switch", 
  then: function (newValue, devName, cellName) {
        Master_OFF()		// Вызов функции
  }
});

 // Передаем параметры в функцию
function Master_OFF(){                                   
	dev["wb-gpio"]["EXT5_R3A1"] = false;                 // Значение с выхода устройства
	dev["wb-gpio"]["EXT5_R3A2"] = false;
	dev["wb-gpio"]["EXT5_R3A3"] = false;
	dev["wb-gpio"]["EXT5_R3A4"] = false;
	dev["wb-gpio"]["EXT5_R3A5"] = false;
	dev["wb-gpio"]["EXT5_R3A6"] = false;
	dev["wb-gpio"]["EXT5_R3A7"] = false;
	dev["wb-gpio"]["EXT5_R3A8"] = false;
	dev["wb-gpio"]["EXT6_R3A1"] = false;
	dev["wb-gpio"]["EXT6_R3A2"] = false;
	dev["wb-gpio"]["EXT6_R3A3"] = false;
	dev["wb-gpio"]["EXT6_R3A4"] = false;
	dev["wb-gpio"]["EXT6_R3A5"] = false;
	dev["wb-gpio"]["EXT6_R3A6"] = false;
	dev["wb-gpio"]["EXT6_R3A7"] = false;
	dev["wb-gpio"]["EXT6_R3A8"] = false;
        dev["wb-gpio"]["EXT6_R3A2"] = false;
  

    setTimeout(function() { dev["wb-mdm3_129"]["channel1"] = 0; }, 2000);       // Значения , которые передаются с задержкой
    setTimeout(function() { dev["wb-mdm3_129"]["channel2"] = 0; }, 4000);
    setTimeout(function() { dev["wb-mdm3_129"]["channel3"] = 0; }, 6000);
	
    setTimeout(function() { dev["wb-mdm3_146"]["channel1"] = 0; }, 8000);
    setTimeout(function() { dev["wb-mdm3_146"]["channel2"] = 0; }, 10000);
    setTimeout(function() { dev["wb-mdm3_146"]["channel3"] = 0; }, 12000);	  
 }

```
	
##### <a name="Parag6"></a>
<h3> Контроль протечек       <Img src="https://cdn-icons-png.flaticon.com/512/1585/1585889.png" Width="20" Height="20"></h3>

```javascript

//Виртуальное устройство
defineVirtualDevice("water_control1", {
  title: "water_control1",
  cells: {
    OPEN : {
        type : "pushbutton",
        value : false
    },
    CLOSE : {
        type : "pushbutton",
        value : false
    },
	button_alarm : {
        type : "switch",
        value : false
    },
  }
});

// При нажатии "открыть клапан"
defineRule("water_open", {
  whenChanged: "water_control1/OPEN",
  then: function (newValue, devName, cellName) {
  	if ( newValue == 1 ) {
	    dev["wb-mwac_10"]["K1"] = false;
  	    dev["wb-mwac_10"]["Alarm"] = false;
            dev["water_control1"]["CLOSE"] = false;
            dev["water_control1"]["button_alarm"] = false;			
        }
     }    
});

// При нажатии "зыкрыть клапан"
defineRule("water_close", {
  whenChanged: "water_control1/CLOSE",
  then: function (newValue, devName, cellName) {
	if (newValue == 1) {
	    dev["wb-mwac_10"]["K1"] = true;	
            dev["water_control1"]["OPEN"] = false;       	
        }
    }    
});

//Закрытие кранов и включение Alarm при сработке датчика протечки 1
defineRule("Alarm_10", {
  whenChanged: "wb-mwac_10/F1",
  then: function (newValue, devName, cellName) {
	if (newValue == 1) {
	    dev["wb-mwac_10"]["K1"] = true;
	    dev["wb-mwac_10"]["Alarm"] = true;			
        }
    }    
});

//Закрытие кранов и включение Alarm при сработке датчика протечки 2
defineRule("Alarm_10_f2", {
  whenChanged: "wb-mwac_10/F2",
  then: function (newValue, devName, cellName) {
	if (newValue == 1) {
	    dev["wb-mwac_10"]["K1"] = true;
	    dev["wb-mwac_10"]["Alarm"] = true;		
        }
    }    
});

//Закрытие кранов и включение Alarm при сработке датчика протечки 3
defineRule("Alarm_10_f3", {
  whenChanged: "wb-mwac_10/F3",
  then: function (newValue, devName, cellName) {
	if (newValue == 1) {
	    dev["wb-mwac_10"]["K1"] = true;
	    dev["wb-mwac_10"]["Alarm"] = true;		
        }
    }    
});

```

##### <a name="Parag7"></a>
<h3> Управление конвектором отопления  <Img src="https://cdn-icons-png.flaticon.com/512/5105/5105284.png" Width="20" Height="20"></h3>

```javascript

// Виртуальное устройство для управления конвекторами
defineVirtualDevice("Climat_control", {
    title: "Climat_control",
    cells: {
    "temp_setpoint_bedroom" : { 	// уставка температуры для спальни
        type : "range",
	max: 28,
        min: 18,
	value : 25
     },
    "temp_setpoint_fb_bedroom" : {        // setpoint_fb 
	type : "range",
	max: 28,
        min: 18,
	value : 25
     },
    "temperature_sensor_bedroom" : { // значение датчика температуры в спальне
	type : "range",
	max: 28,
        min: 18,
	value : 25
     },
   }
});

var default_temperature = 21;

// открытие и перекрытие сервоприводов в зависимости от заданной уставки виртуального устройства
defineRule("climat_bedroom_rule_1", {                          
    whenChanged: "Climat_control/temp_setpoint_bedroom",            // изменение уставки у виртуального устройства
    then: function (newValue, devName, cellName) {
        if (newValue >= 18 && newValue <= 28) {                      // если значение уставки в пределах от 18 до 28
            dev["Climat_control"]["temp_setpoint_fb_bedroom"] = newValue;
	        if (newValue < dev["Climat_control"]["temperature_sensor_bedroom"]) {     // если значение уставки меньше значения датчика температуры
		     dev["wb-gpio"]["EXT2_K1"] = true;                         // сервоприводы перекрыты
		     dev["wb-gpio"]["EXT2_K2"] = true;
	       }else{				                             // если значение уставки выше значения с датчика температуры
		     dev["wb-gpio"]["EXT2_K1"] = false; 			// сервоприводы открыты
		     dev["wb-gpio"]["EXT2_K2"] = false; 			
				          }
       }else{													  // если же значение не в пределах от 18 до 28
	   dev["Climat_control"]["temp_setpoint_fb_bedroom"] = default_temperature;  // устанавливаем стандартную температуру
	}
    }
});

// открытие и перекрытие сервоприводов в зависимости от показаний датчика температуры 
defineRule("climat_bedroom_rule_2", {                            
    whenChanged: "Climat_control/temperature_sensor_bedroom",               // изменение показаний датчика температуры 
    then: function (newValue, devName, cellName) {
        if (newValue < dev["Climat_control"]["temp_setpoint_fb_bedroom"]) {   // если значение датчика температуры меньше уставки 
            dev["wb-gpio"]["EXT2_K1"] = false;                  // сервоприводы открыты
	    dev["wb-gpio"]["EXT2_K2"] = false;
       }else{                                                         // если же значение датчика температуры выше уставки 
	    dev["wb-gpio"]["EXT2_K1"] = true;         	  // сервоприводы перекрыты
	    dev["wb-gpio"]["EXT2_K2"] = true;
         }
      }
});
