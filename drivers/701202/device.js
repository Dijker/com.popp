'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P701202 extends ZwaveDevice {
onMeshInit() {
  	    //this.enableDebug();
		//this.printNode();
		this._moldAlarmOnTrigger = this.getDriver().moldAlarmOnTrigger;
		this._moldAlarmOffTrigger = this.getDriver().moldAlarmOffTrigger;
		this._dewPointTrigger = this.getDriver().dewPointTrigger;
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
	this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
	this.registerCapability('measure_dewpoint', 'SENSOR_MULTILEVEL', {
                get: 'SENSOR_MULTILEVEL_GET',
                getParser: () => ({
                  'Sensor Type': 'Dew point (version 2)',
                  Properties1: {
                    Scale: 0,
                  },
                }),
                report: 'SENSOR_MULTILEVEL_REPORT',
                reportParser: report => {
                  if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Type'] === 'Dew point (version 2)' || report['Sensor Type'] === 'Dew point (version 2) ') {
					  
					  const token = {
				dewpoint: report['Sensor Value (Parsed)'],
			};

			   this._dewPointTrigger.trigger(this, token, this.device_data);
					  
                   return report['Sensor Value (Parsed)'];
                  }
                  return null;
                }
              });
    this.registerCapability('alarm_generic.mold', 'SENSOR_BINARY', {
                report: 'SENSOR_BINARY_REPORT',
                reportParser: report => {
                  if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value') && report['Sensor Type'] === 'General') {
                     if(report['Sensor Value'] == "detected an event")
					 {
					this._moldAlarmOnTrigger.trigger(this, null, null);
					return true;
					 }
					 else if(report['Sensor Value'] == "idle")
					 {
					this._moldAlarmOffTrigger.trigger(this, null, null); 
					return false;
					 }
					 return null;
                  }
                  return null;
                }
              });
    this.registerCapability('measure_battery', 'BATTERY');
	


	
	
    }
  }
  module.exports = P701202;