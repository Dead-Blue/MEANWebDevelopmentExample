var mainApplicaltionModuleName = 'mean';

var mainApplicationModule = angular.module(mainApplicaltionModuleName, []);
angular.element(document).ready(function() {
	angular.bootstrap(document, [mainApplicaltionModuleName]);
})