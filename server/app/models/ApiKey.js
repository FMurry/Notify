var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var keySchema = new Schema({
	email: {
		type: String,
		required: true,
		validate: {
			validator: function(v) {
				return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
			},
			message: 'Not a valid email'
		}
	},
	key: {
		type: String,
		required: true
	},
	appName: {
		type: String,
		required: true
	}
});


keySchema.methods.generateKey = function(err, cb) {
	
}


module.exports = mongoose.model('ApiKey', keySchema);
