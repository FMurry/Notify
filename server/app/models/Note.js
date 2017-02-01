var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
	description:{
		type: String,
		required: true
	},
	updated_at: {
		type: Date,
		default: Date.now()
	},
	created_at: {
		type: Date,
		default: Date.now()
	}
});

noteSchema.pre('save', function(next){
	var now = new Date();
	if(this.isNew){
		this.created_at = now;
		this.updated_at = now;
		next();
	}
	else{
		this.updated_at = now;
		next();
	}

});


module.exports = mongoose.model('Note', noteSchema);
