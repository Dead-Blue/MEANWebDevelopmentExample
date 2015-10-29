describe('Testing Articles controller', function() {
  var _scope, ArticlesController;

  beforeEach(function() {
    module('mean');

    jasmine.addMatchers({
      toEqualData: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            return {
              pass: angular.equals(actual, expected)
            };
          }
        };
      }
    });

    inject(function($rootScope, $controller) {
      _scope = $rootScope.$new();
      ArticlesController = $controller('ArticlesController', {
        $scope: _scope
      });
    });
  });
  it('Should have a find method that use $resource to retrive a list of articles', inject(function(Articles) {
    inject(function($httpBackend) {
      var sampleArticle = new Articles({
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });
      var sampleArticles = [sampleArticle];

      $httpBackend.expectGET('api/articles').respond(sampleArticles);
      _scope.find();
      $httpBackend.flush();

      expect(_scope.articles).toEqualData(sampleArticles);
    });
  }));

  it('Should have a findOne method that use $resource to retreive a single of article', inject(function(Articles) {
    inject (function($httpBackend, $routeParams) {
      var sampleArticle = new Articles({
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      $routeParams.articleId = 'abcdef123456789012345678';

      $httpBackend.expectGET(/api\/articles\/([0-9a-fA-F]{24})$/).respond (sampleArticle);

      _scope.findOne();
      $httpBackend.flush();

      expect(_scope.article).toEqualData(sampleArticle);
    });
  }));
});
