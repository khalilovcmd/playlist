angular.module('playListApp', []);

angular
    .module('playListApp')
    .controller('homeController',
        function($scope, $window) {

            $scope.names = [];
            $scope.title = "tarek's playground";

            $scope.login = function() {
                var url = 'https://www.facebook.com/dialog/oauth?client_id=1472447112996814&redirect_uri=http://playlist.khalilovcmd.c9users.io/&scope=public_profile,user_posts';
                $window.location.href = url;
            }

        })
    .controller('waitingController',
        function($scope, $http, $window) {

            $scope.names = [];
            $scope.title = "tarek's playground";

            var polling =
                setInterval(function() {
                    $http.get("http://playlist.khalilovcmd.c9users.io/progress/")
                        .then(function(response) {
                            if (response.data) {
                                $scope.videos = JSON.parse(response.data);
                                clearInterval(polling);
                            }
                        });
                }, 5000);

        })
    .controller('playlistController',
        function($scope, $http, $window) {

        });