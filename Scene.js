// Script управления сценариями

// Виртуальное устройство
defineVirtualDevice("Global_scenes_control", {
  title: "Global_scenes_control",

  cells: {
    guest_scene_switch : {        // сцена "У нас гости"
        type : "pushbutton",
        value : false
    },
    morning_scene_switch : {      // сцена "Доброе утро"
        type : "pushbutton",
        value : false
    },
    sleep_scene_switch : {      // сцена "Я пошел спать"
        type : "pushbutton",
        value : false
    },
  }
});

defineRule("scene_1", {
  whenChanged: "Global_scenes_control/guest_scene_switch",       // нажатие кнопки на вертуальном устройстве
  then: function (newValue, devName, cellName) {
    guest_scene()        // вызов функции сцены "У нас гости"
  }
});

defineRule("scene_2", {
  whenChanged: "Global_scenes_control/morning_scene_switch",	// нажатие кнопки на вертуальном устройстве
  then: function (newValue, devName, cellName) {
    morning_scene_day()		// вызов функции сцены "Доброе утро"
  }
});

defineRule("scene_3", {
  whenChanged: "Global_scenes_control/sleep_scene_switch",	// нажатие кнопки на вертуальном устройстве
  then: function (newValue, devName, cellName) {
    sleep_scene_off()	// вызов функции сцены "Я пошел спать"
  }
});

// функция для сцены "У нас гости"
function guest_scene(){
  dev["wb-mdm3_28"]["chanal_3"] = 200; 		// диммируемый свет (предел яркости 255)
  dev["wb-mdm3_146"]["chanal_2"] = 150; 	// диммируемый свет (предел яркости 255)
  dev["wb-gpio"]["EXT6_R3A2"] = true;  		// дискретное освещение
  dev["wb-gpio"]["EXT5_R3A4"] = true;  		// дискретное освещение
  dev["wb-gpio"]["EXT5_R3A5"] = true;  		// дискретное освещение 
}

// функция для сцены "Доброе утро"
function morning_scene_day(){
   dev["wb-mdm3_28"]["chanal_2"] = true; 		// диммируемый свет (предел яркости 255)
   dev["wb-mdm3_146"]["chanal_2"] = true; 		// диммируемый свет (предел яркости 255)
   dev["wb-mdm3_28"]["chanal_3"] = true; 		// диммируемый свет (предел яркости 255)
   dev["wb-gpio"]["EXT6_R3A1"] = true; 			// дискретное освещение
   dev["room_blind_left_1"]["OPEN_switch"] = true; 		// Шторы открываются гостиная
   dev["room_blind_right_1"]["OPEN_switch"] = true;		// Шторы открываются спальня
}

// функция для сцены "Я пошел спать"
function sleep_scene_off(){  
	dev["wb-gpio"]["EXT5_R3A1"] = false;  //отключение групп света
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
	dev["wb-gpio"]["EXT6_R3A8"] = false;
  dev["wb-gpio"]["EXT6_R3A2"] = false;  
	
  setTimeout(function() { dev["wb-mdm3_146"]["Channel 1"] = 0; }, 200);  // постепенное отключение групп света с задержкой
  setTimeout(function() { dev["wb-mdm3_146"]["Channel 2"] = 0; }, 400);
  setTimeout(function() { dev["wb-mdm3_146"]["Channel 3"] = 0; }, 600);
  setTimeout(function() { dev["wb-mdm3_28"]["Channel 1"] = 0; }, 800);
  setTimeout(function() { dev["wb-mdm3_28"]["Channel 2"] = 0; }, 1000);
  setTimeout(function() { dev["wb-mdm3_28"]["Channel 3"] = 0; }, 1200);
  setTimeout(function() { dev["wb-mdm3_146"]["Channel 3"] = 0; }, 8000);
  setTimeout(function() { dev["wb-gpio"]["EXT6_R3A5"] = false;; }, 16000);
  setTimeout(function() { dev["wb-gpio"]["EXT6_R3A6"] = false;; }, 24000);
  setTimeout(function() { dev["wb-gpio"]["EXT6_R3A7"] = false;; }, 24000);
  dev["room_blind_left_1"]["CLOSE_switch"] = false; 		// Шторы закрываются гостиная
  dev["room_blind_right_1"]["CLOSE_switch"] = false;		// Шторы закрываются спальня
	   
}
