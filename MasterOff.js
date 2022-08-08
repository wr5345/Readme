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

