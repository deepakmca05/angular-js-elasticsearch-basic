angular.module('controllers', [])
    .controller('SearchCtrl', function($scope, ejsResource) {
		$scope.viewmodel = {fields: [
                      {value: 'SCV_NO', label: 'SCV_NO'}, 
                      {value: 'FIRSTNAME', label: 'FIRSTNAME'},
					  {value: 'LASTNAME', label: 'LASTNAME'},
                    ]};
		$scope.fields = $scope.viewmodel.fields[0];
        var ejs = ejsResource('http://localhost:9200');
        $scope.search = function() {
			
		
        //var oQuery = ejs.QueryStringQuery().defaultField('SCV_NO');
		var oQuery = ejs.QueryStringQuery().defaultField($scope.fields.value);
        var client = ejs.Request().indices('existential').types('users');

            $scope.results = client.query(oQuery.query($scope.queryTerm || '*')).doSearch();
        };
		

    });