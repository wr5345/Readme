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
        } else {
          if (button_was_dimmed == 0) {
            dev[device_out][control_out] = 100;
          }
          // изменяем переменную диммирования (чтобы заново можно было диммировать и по первому короткому изменять 
          // состояние группы
          button_was_dimmed = 0;
          // сбрасываем таймеры
		  if (button_timer_id_delay != null)
		  {
			  clearTimeout(button_timer_id_delay);
			  button_timer_id_delay = null;
		  }
          if (button_timer_id_interval != null)
		  {
			  clearTimeout(button_timer_id_interval);
			  button_timer_id_interval = null;
		  }
        }
    }
});

// правило связывания входа c выключателя с каналом реле (диммирование вниз)
defineRule(name + "_" + "_dn_btn", {
  	// с каким входным каналом связываем "<устройтсво>/<канал>"
    whenChanged: device_in_dn + "/" + control_in_dn, 
    then: function(newValue, devName, cellName) {
		// если нажали
        if ((newValue == 1) && (dev[device_in_up][control_in_up] == 0)) {
          	// установка таймера, по истечению которого начинаем диммировать (вызывается каждые button_timer_delay "ms)
          	button_timer_id_delay = setTimeout(function() {
                // установка повторяемого таймера при диммировании (вызывается каждые button_timer_interval "ms)
                button_timer_id_interval = setTimeout(function down_dim() {
                  if (dev[device_out][control_out] > 9) {
                    dev[device_out][control_out] = dev[device_out][control_out] - 10;
                  } else  {
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
        } else {
          if (button_was_dimmed == 0) {
            dev[device_out][control_out] = 0;
          }
          // изменяем переменную диммирования (чтобы заново можно было диммировать и по первому короткому изменять 
          // состояние группы
          button_was_dimmed = 0;
          // сбрасываем таймеры
		  if (button_timer_id_delay != null)
		  {
			  clearTimeout(button_timer_id_delay);
			  button_timer_id_delay = null;
		  }
          if (button_timer_id_interval != null)
		  {
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
        } else {
          dev[device_out][control_out] = 100;
        }
    }
});
}

setTimeout(function() { dim_control("room106_dim_C14_v18_1__v18_2", "wb-gpio", "EXT2_DR5", "wb-gpio", "EXT2_DR6", "wb-mdm3_129", "channel2"); }, 50000);
