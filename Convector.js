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
