var app =require('../../server/js');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');

var user, article;

describe('Article Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displatName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		
		uesr.save(function() {
			article = new Article({
				title: 'Article Title',
				content: 'Article Content',
				user: user
			});
			
			done();
		});
	});
	
	describe('Testing the save method', function() {
		it('Should be able to save without problems', function() {
			article.save(function(err) {
				should.not.exist(err);
			});
		});
		
		it('Should not be able to save an article withour a title', function() {
			article = '';
			article.save(function(err) {
				should.exist(err);
			});
		});
	});
	
	afterEach(function(done) {
		Article.remove(function() {
			User.remove(function() {
				done();
			});
		});
	});
});
