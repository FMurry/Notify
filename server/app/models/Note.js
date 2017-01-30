var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var noteSchema = new Schema({
	description:{
		type: String,
		required: true
	},
	updated_at: {
		type: Date,
		required: true
	},
	created_at: {
		type: String,
		required: true
	}
});

noteSchema.pre('save', function(next){
	var now = new Date();
	if(this.isNew){
		this.created_at = now;
		this.updated_at = now;
	}
	else{
		this.updated_at = now;
	}

});


module.exports = mongoose.model('Note', noteSchema);
