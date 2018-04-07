var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema ({
	slug   : String,
	email  : String,
	avatar : String,
	name   : {
		discord : String,
		discriminator : Number
	},
	created : { type: Date, default: Date.now },
	updated : { type: Date, default: Date.now }
});

UserSchema.statics.findOrCreate = function(query, user, callback) {
    const self = this;
    
    self.findOneAndUpdate(query, user, {
    	upsert : true,
	    setDefaultsOnInsert : true
    }, function(err, result) {
        return callback(err, result);
    })
}

module.exports = mongoose.model('User', UserSchema);