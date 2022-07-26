function light_control(name, device_in, control_in, device_out, control_out) {    // Функция в которую передаем значения
	defineVirtualDevice(name, {                        // Виртуальное устройство для управления светом                           
		title: name,
		cells: {
          	TOGGLE_switch : {                         // Кнопка для вкл./выкл. света
				type : "pushbutton",
				value : false
			},
          	switch_fb : {                             // feedback
            	type : "switch",
				value : false
            },
		}
	});


    // Правило для управления светом с выключателя
	defineRule(name + "_switch_control", {
		whenChanged: device_in + "/" + control_in,             // Изменение состояния входа 
		then: function (newValue, devName, cellName) {
			if ( newValue > 0) {                                   // Если значении больше 0
				if (dev[device_out][control_out] == false) {       // Если выход в положении false
					dev[device_out][control_out] = true;           // Передать выходу значение true
                  	dev[name]["switch_fb"] = true;
				} else {                                          // Если значение меньше 1
					dev[device_out][control_out] = false;         // Передать выходу значение false
                  	dev[name]["switch_fb"] = false;
				}
			}
		}
	});

    // Правило для управления светом с веб-интерфеса wirenboard
	defineRule(name + "_switch_control_web", {
		whenChanged: name + "/TOGGLE_switch",
		then: function (newValue, devName, cellName) {
          		if (dev[device_out][control_out] == false) {
					dev[device_out][control_out] = true;
                  	dev[name]["switch_fb"] = true;
				} else {
					dev[device_out][control_out] = false;
					dev[name]["switch_fb"] = false;
				}
            }
	});

	// Правило для получения обратной связи от групп света
  	defineRule(device_out + "/" + control_out + "_fb", {
		whenChanged: device_out + "/" + control_out,
		then: function (newValue, devName, cellName) {
			if (dev[device_out][control_out] == true) {
              	dev[name]["switch_fb"] = true;
			} else {
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
light_control("room103_light_grС6", "wb-gpio", "EXT1_IN8", "wb-mdm3_146", "K3");//Освещение пом. 103 Гр.С6
light_control("room103_light_grС9", "wb-gpio", "EXT2_IN8", "wb-gpio", "EXT6_R3A2");//Освещение пом. 103 Гр.С9
light_control("room103_light_grС8", "wb-gpio", "EXT2_IN7", "wb-mdm3_146", "K2");//Освещение пом. 103 Гр.С8
light_control("room107_light_grС16", "wb-gpio", "EXT3_IN2", "wb-gpio", "EXT6_R3A8");//Освещение пом. 107 Гр.С16
light_control("room104_light_grС12_2", "wb-gpio", "EXT1_IN13", "wb-gpio", "EXT6_R3A7");//Освещение пом. 102 Гр.С12.2
light_control("room104_light_grС12_1", "wb-gpio", "EXT2_IN3", "wb-gpio", "EXT6_R3A6");//Освещение пом. 104 Гр.С12.1
light_control("room105_light_grС13", "wb-gpio", "EXT3_IN3", "wb-gpio", "EXT5_R3A6");//Освещение пом. 105 Гр. С13
light_control("room106_light_grС16", "wb-gpio", "EXT2_IN6", "wb-gpio", "EXT5_R3A7");//Освещение пом. 106 Гр. С15 
light_control("room102_light_grС4", "wb-gpio", "EXT1_IN3", "wb-gpio", "EXT5_R3A5");//Освещение пом. 102 Гр.С4



