// Короткое нажатие: левая клавиша открытие, правая - закрытие
// Долгое нажатие любой - стоп
function blind_control(name, number, device_in_up, control_in_up, device_in_dn, control_in_dn, device_out_up, control_out_up, device_out_dn, control_out_dn) {
	defineVirtualDevice(name + "_" + number, {
	  title: name + "_" + number,

	  cells: {
		// открвытие
		OPEN_switch : {
			type : "pushbutton",
			value : false
		},
        //тестфидбек
        _open_fb : { //
            type : "switch",
            value : false
        },
		// закрытие
		CLOSE_switch : {
			type : "pushbutton",
			value : false
		},
        _close_fb : { //
            type : "switch",
            value : false
        },
		// остановка
		STOP_switch : {
			type : "pushbutton",
			value : false
		},
	  }
	});

	var button_timer_delay = 1000; //ms; задержка для СТОПа
	var button_timer_id_delay = null;  //идентификатор таймера долгого нажатия
	var button_was_dimmed = 0; // было ли диммирование

	// правило связывания входа c выключателя с каналом реле (открытие)
	defineRule(name + "_" + number + "_up_btn", {
		// с каким входным каналом связываем "<устройтсво>/<канал>"
		whenChanged: device_in_up + "/" + control_in_up,
		then: function(newValue, devName, cellName) {
			// если нажали
			if (newValue == 1) {
				// установка таймера, по истечению которого подаём СТОП
				button_timer_id_delay = setTimeout(function() {
					dev[device_out_dn][control_out_dn] = false;
					dev[device_out_up][control_out_up] = false;
					button_was_dimmed = true;
					button_timer_id_delay = null;
				}, button_timer_delay);
			} else {
				if (button_was_dimmed == false) {
					dev[device_out_dn][control_out_dn] = false;
					setTimeout(function() { dev[device_out_up][control_out_up] = true; }, button_timer_delay);
				}
				// изменяем переменную СТОПа, чтобы заново можно посылать сбрасывать сигнал
				// состояние группы
				button_was_dimmed = false;
				// сбрасываем таймеры
				if (button_timer_id_delay != null)
				{
					clearTimeout(button_timer_id_delay);
					button_timer_id_delay = null;
				}
			}
		}
	});

	// правило связывания входа c выключателя с каналом реле (закрытие)
	defineRule(name + "_" + number + "_dn_btn", {
		// с каким входным каналом связываем "<устройтсво>/<канал>"
		whenChanged: device_in_dn + "/" + control_in_dn,
		then: function(newValue, devName, cellName) {
			// если нажали
			if (newValue == 1) {
				// установка таймера, по истечению которого подаём СТОП
				button_timer_id_delay = setTimeout(function() {
					dev[device_out_dn][control_out_dn] = false;
					dev[device_out_up][control_out_up] = false;
					button_was_dimmed = true;
					button_timer_id_delay = null;
				}, button_timer_delay);
			} else {
				if (button_was_dimmed == 0) {
					dev[device_out_up][control_out_up] = false;
					setTimeout(function() { dev[device_out_dn][control_out_dn] = true; }, button_timer_delay);
				}
				// изменяем переменную СТОПа, чтобы заново можно посылать сбрасывать сигнал
				// состояние группы
				button_was_dimmed = 0;
				// сбрасываем таймеры
				if (button_timer_id_delay != null)
				{
					clearTimeout(button_timer_id_delay);
					button_timer_id_delay = null;
				}
			}
		}
	});

	// правило открытия с панели/виджета
	defineRule(name + "_" + number + "_open_cmd", {
	  whenChanged: name + "_" + number + "/OPEN_switch",
		then: function(newValue, devName, cellName) {
			dev[device_out_dn][control_out_dn] = false;
            setTimeout(function() { dev[device_out_up][control_out_up] = true; }, button_timer_delay);
			dev[devName]["_open_fb"] = true;
          	if (dev[devName]["_open_fb"] == true)
            	{dev[devName]["_close_fb"] = false; }
        }
	});

	// првило выключения с панели/виджета
	defineRule(name + "_" + number + "_close_cmd", {
	  whenChanged: name + "_" + number + "/CLOSE_switch",
		then: function(newValue, devName, cellName) {
			dev[device_out_up][control_out_up] = false;
			setTimeout(function() { dev[device_out_dn][control_out_dn] = true; }, button_timer_delay);
            dev[devName]["_close_fb"] = true;
            if (dev[devName]["_close_fb"] == true)
            	{ dev[devName]["_open_fb"] = false; }
		}
	});

	// првило переключения с панели/виджета
	defineRule(name + "_" + number + "_stop_cmd", {
	  whenChanged: name + "_" + number + "/STOP_switch",
		then: function(newValue, devName, cellName) {
			dev[device_out_dn][control_out_dn] = false;
			dev[device_out_up][control_out_up] = false;
		}
	});
}

setTimeout(function() { blind_control("room_blind_left", "1", "wb-gpio", "EXT1_IN9", "wb-gpio", "EXT1_IN10", "wb-gpio", "EXT4_ON3",  "wb-gpio", "EXT4_ON4"); }, 1700);// штора кухня
setTimeout(function() { blind_control("room_blind_right", "1", "wb-gpio", "EXT2_IN9", "wb-gpio", "EXT2_IN10", "wb-gpio", "EXT4_ON1",  "wb-gpio", "EXT4_ON2"); }, 1950);// штора сапльня
