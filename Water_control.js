//Script для контроля протечек

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

