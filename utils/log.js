const chalk = require('chalk');

const error = chalk.red;
const warning = chalk.keyword('orange');
const info = chalk.magenta;
const success = chalk.green;
const app = chalk.cyan('brandiose~');

module.exports = {
	error: function(...message) {
		this.custom(error('ERROR'), message);
	},
	warn: function(...message) {
		this.custom(warning('WARN'), message);
	},
	info: function(...message) {
		this.custom(info('INFO'), message);
	},
	success: function(...message) {
		this.custom(success('SUCCESS'), message);
	},
	custom: function(type, ...message) {
		console.log(app, ' [' + type + '] ', message[0]);
	}
};
