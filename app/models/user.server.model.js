var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
	
	//添加CRUD操作
var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	username: {
		type:String,
		trim: true,//predefined modifiers
		unique: true,//添加index优化查询
		required: true// 预定义验证 required
	},
	password: {
	type: String,
	validate: [  //自定义验证
		function(password) {
			return password.length >=6;
		},
	'Password should be longer'
	]},
	created: {   //定义默认值
		type: Date,
		default: Date.now
	},
	website: {
		type: String,
		get: function(url) { //自定义get modifiers
			if(!url) {
				return url;
			} else {
				if(url.indexOf('http://')!==0 && url.indexOf('https://')!==0) {
					url = 'http://' +url;
				}
				return url;
			}
		}
	},
	email: {
		type: String,
		index: true,           //Index
		match: /.+\@.+\..+/   //预验证Email
	},
	role: {
		type: String,
		enum: ['Admin', 'Owner', 'User'] //预验证之 enum
	},
});

//添加虚拟属性
UserSchema.virtual('fullName').get(function() {
	return this.firstName + '' + this.lastName;
}).set(function(fullName){    //自定义set modifiers
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

//自定义静态模型方法
UserSchema.statics.findOneByUsername = function (username, callback) {
	this.findOne({ username: new RegExp(username, 'i')},callback);
};
//定义自定义Instance methods  使用方法user.authenticate('password');
UserSchema.methods.authenticate = function(password) {
	return this.password === password;
};


//使用 mongoose pre 中间件
// UserSchema.pre('save', function(next) {
// 	if(...) {
// 		next()
// 	} else {
// 		next(new Error('An Error Occured'));
// 	}
// });

//mongoose post中间件
UserSchema.post('save', function(next) {
	if(this.isNew) {
		console.log('A new user was created.');
	} else {
		console.log('A user updated is details.');
	}
});

//mongoose DBRef 关联
var PostSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User' //关联user
	}
});

/* mongoose DBRef 关联 其他使用方法： 
var user = new User();
user.save();
var post = new Post();
post.author = user;
post.save();

//populate
Post.find().populate('author').exec(function(err, posts){
	...
});
*/
UserSchema.set('toJSON', {getters:true, virtuals:true});
mongoose.model('User', UserSchema);
mongoose.model('Post', PostSchema);