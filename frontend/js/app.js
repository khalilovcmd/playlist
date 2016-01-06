angular.module('playListApp', []);

angular
    .module('playListApp')
    .controller('appCtrl',
        function($scope, $window) {

            $scope.names = [];
            $scope.title = "tarek's playground";

            $scope.login = function() {
                var url = 'https://www.facebook.com/dialog/oauth?client_id=1472447112996814&redirect_uri=http://playlist.khalilovcmd.c9users.io/&scope=public_profile,user_posts';
                $window.location.href = url;
            }
            
        });