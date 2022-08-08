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

// УПРАВЛЕНИЕ КЛИМАТОМ В СПАЛЬНЕ
// Переменные используемые для управления климатом в спальне
var servo_device_3 = "wb-gpio";
var servo_control_3 = "EXT2_K3";
var servo_device_4 = "wb-gpio";
var servo_control_4 = "EXT2_K4";
var thermostat_2 = "siemens_rdf302_30";   // значение переменной потребуется изменить при использовании нескольких термомтатов siemens
var default_temperature = 21;

// передача значений с датчика температуры термостата siemens на виртуальное устройство Climat_control
defineRule("climat_bedroom_rule_1", {                             
	whenChanged: thermostat_2 + "/current_temperature",
	then: function (newValue, devName, cellName) {
		dev["Climat_control"]["temperature_sensor_bedroom"] = newValue;
	}
});

// задание уставки на термостате siemens с приложения
defineRule("climat_bedroom_rule_2", {                           
	whenChanged: "Climat_control/temp_setpoint_bedroom" ,  		
	then: function (newValue, devName, cellName) {
		if (newValue >= 18 && newValue <= 28) {     	 		
			dev[thermostat_2]["setpoint"] = newValue;        
		}else{
		  	dev[thermostat_2]["setpoint"] = default_temperature;
		}
	 }
});

// открытие и перекрытие сервоприводов в зависимости от заданной уставки с термостата siemens 
defineRule("climat_bedroom_rule_3", {                          
	whenChanged: thermostat_2 + "/setpoint",                                     // изменение уставки у термостата siemens
	then: function (newValue, devName, cellName) {
		if (newValue >= 18 && newValue <= 28) {                                   // если значение уставки в пределах от 18 до 28
        	dev["Climat_control"]["temp_setpoint_fb_bedroom"] = newValue;
			if (newValue < dev["Climat_control"]["temperature_sensor_bedroom"]) {     // если значение уставки меньше значения датчика температуры
				dev[servo_device_3][servo_control_3] = true;                         // сервоприводы перекрыты
				dev[servo_device_4][servo_control_4] = true;
			}else{														// если значение уставки выше значения с датчика температуры
				dev[servo_device_3][servo_control_3] = false; 			// сервоприводы открыты
				dev[servo_device_4][servo_control_4] = false; 			
				}
		}else{													  // если же значение не в пределах от 18 до 28
			dev["Climat_control"]["temp_setpoint_fb_bedroom"] = default_temperature;  // устанавливаем стандартную температуру
		}
	 }
});

// открытие и перекрытие с ервоприводов в зависимости от показаний датчика температуры термостата siemens
defineRule("climat_bedroom_rule_4", {                            
	whenChanged: thermostat_2 + "/current_temperature",               // изменение показаний датчика температуры термостата siemens
	then: function (newValue, devName, cellName) {
		if (newValue < dev["Climat_control"]["temp_setpoint_fb_bedroom"]) {   // если значение датчика температуры меньше уставки термостата
        	dev[servo_device_3][servo_control_3] = false;                  // сервоприводы открыты
			dev[servo_device_4][servo_control_4] = false;
		}else{                                                         // если же значение датчика температуры выше уставки термостата
			dev[servo_device_3][servo_control_3] = true;         	  // сервоприводы перекрыты
			dev[servo_device_4][servo_control_4] = true;
           }
	 }
});


