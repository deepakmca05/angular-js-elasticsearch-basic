/* Define our application module */
var application = angular.module('SearchApp', ['elasticsearch']);

/* Define the Search Controller
 * 
 * @param $scope -- Passed in by default by AngularJS -
 *                  Used for two-way data binding
 *
 * @param esClient -- Angular will automatically know to look for a factory called "esClient" and its return value in.
 */
application.controller('SearchController', function($scope, esClient) {

    /* We set ng-change="search()" in the HTML -- this is what it points to */
    $scope.search = function() {
        /* Split the keywords on space $scope.keywords will have the value from the text field in the markup thanks to ng-model="keywords" */
        var keywords = $scope.keywords.split(' ');

        /* Create a request object for ElasticSearch */
        var request = ejs.Request();

        /* Set up the query */
        request.query(
            ejs.BoolQuery()
                .should(
                    ejs.WildcardQuery('FIRSTNAME', keywords[0]).boost(10),
                    ejs.MatchQuery('product_name', keywords).boost(2),
                    ejs.MatchQuery('product_description', $scope.keywords).boost(0.5)
                )
                .minimumNumberShouldMatch(1)
        );

        /* Perform the search */
        esClient.search({
            index: "existential",
            type: "users",
            body: request
        }).then(
            /* This will be called on success */
            function(response){
                $scope.users = response.hits.hits;
                $scope.hitCount = response.hits.total;
            },

            /* This will be called on failure */
            function(error){
                $scope.error = error.message;
            }
        );
    }
});

/**
 * A simple "factory" to create an instance of the elasticsearch client
 * EDIT NOTICE: This essential code was originally missing.
 */
application.factory('esClient', ['esFactory', function(esFactory) {
    return esFactory({
        host:localhost// Insert your esHost here,
        sniffonStart: true // Perform an initial "ping" call.
    });
}]);