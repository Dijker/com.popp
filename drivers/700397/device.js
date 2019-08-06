'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class P700397 extends ZwaveDevice {
	onMeshInit() {
		this.enableDebug();
		this.printNode();
		this.registerCapability('onoff', 'SWITCH_BINARY');
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_voltage', 'METER');
		this.registerCapability('measure_current', 'METER');
		
		
		
this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (report) => {
				if (report.hasOwnProperty('Properties1') &&
                    report.Properties1.hasOwnProperty('Key Attributes') &&
                    report.hasOwnProperty('Scene Number')) {

					const state = {
						scene: report.Properties1['Key Attributes'],
					};

					if (report['Scene Number'] === 1) {
						this._flowTriggerInput.trigger(this, null, state);
					} 
				}
				});

     this._flowTriggerInput = new Homey.FlowCardTriggerDevice('button_trigger').register()
            .registerRunListener((args, state) => {
                return args.device.inputFlowListener(args, state);
});

}
		
		
	}
	
	resetMeterRunListener(args, state) {
		if (this.node &&
            this.node.CommandClass &&
            this.node.CommandClass.COMMAND_CLASS_METER) {
			this.node.CommandClass.COMMAND_CLASS_METER.METER_RESET({}, (err, result) => {
				if (err) return callback(err);

				// If properly transmitted, change the setting and finish flow card
				return result === 'TRANSMIT_COMPLETE_OK';
			});
		} else return false;
	}	
	inputFlowListener(args, state) {
		return (state.scene === args.scene);
	} 

}
module.exports = P700397;
