
//get location
var latitude='';
var longitude='';

navigator.geolocation.getCurrentPosition(function (pos) {
    latitude = pos.coords.latitude;
    longitude=pos.coords.longitude;
    console.log(pos);
});





//var app = angular.module('myApp', []);
var app = angular.module('myApp', ['ngAnimate']).config(['$animateProvider', function ($animateProvider) {
    // restrict animation to elements with the bi-animate css class with a regexp.
    // note: "bi-*" is our css namespace at @Bringr.
    $animateProvider.classNameFilter(/^((?!(fa-spinner)).)*$/);
   }]);



app.controller('myCtrl', function ($scope, $http) {

    var pos;
    $scope.load = function () {
        $scope.favResponse = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var item = JSON.parse(localStorage.getItem(key));
            $scope.favResponse[item['id']] = item;
        }

    }

    //keyword: send request and get return data
    $scope.submitForm = function () {
        if($scope.keyword==null) return false;
        
        $scope.bool = false;
        $scope.loading = true;

//        var position;
//        var getLocation = function (callback) {
//            navigator.geolocation.getCurrentPosition(function (pos) {
//                position = pos.coords;
//                typeof callback === 'function' && callback(position);
//            });
//        };
//
//        getLocation(function (pos) {
            var myurl = 'access_fb.php?f=all&keyword=' + $scope.keyword + '&latitude=' + latitude + '&longtitude=' + longitude;
//            alert(myurl);
            $http({
                url: myurl,
                method: "GET",
            }).then(function mySucces(response_string) {

                $scope.loading = false;
                console.log(response_string);
                $scope.userResponse = JSON.parse(response_string.data.user);
                $scope.pageResponse = JSON.parse(response_string.data.page);
                $scope.eventResponse = JSON.parse(response_string.data.event);
                $scope.placeResponse = JSON.parse(response_string.data.place);
                $scope.groupResponse = JSON.parse(response_string.data.group);


            }, function myError(response) {
                $scope.myResponse = response.statusText;
            });

//        });
    }


    //favorites
    $scope.set_fav = function (fav, type) {
        if ($scope.favResponse[fav['id']] == null) {
            $scope.add_fav(fav, type);
        } else {
            $scope.delete_fav(fav['id']);
        }
    }


    $scope.add_fav = function (fav, type) {
        fav['type'] = type;

        // Check browser support
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(JSON.stringify(fav['id']), JSON.stringify(fav));
            $scope.favResponse[fav['id']] = fav;
        }
    }

    $scope.delete_fav = function (ind) {
        localStorage.removeItem(JSON.stringify(ind));
        delete $scope.favResponse[ind];

    }

    $scope.check_fav = function () {
        if (localStorage.length == 0) return true;
        else return false;
    }

    $scope.if_checked = function (id) {
        if ($scope.favResponse[id] == null) return false;
        else return true;
    }

    //details
    $scope.ask_detail = function (current, type) {
        $scope.if_animate=true;
        $scope.back=false;
        $scope.bool = !$scope.bool;
        $scope.loading = true;
        $scope.current_item = current;
        $scope.current_type = type;
        var myurl = 'access_fb.php?f=details&id=' + current.id;

        setTimeout(function() {
            $http({
            url: myurl,
            method: "GET",
        }).then(function mySucces(detail_string) {
            $scope.loading = false;
            $scope.detailResponse = detail_string.data;
            console.log("success"+$scope.detailResponse);

        }, function myError(response) {
            console.log("fail"+response);
            $scope.detailResponse =null;
        });

        }, 1000);
        
    }



    //post
    $scope.post_to_fb = function (pic, name) {
        FB.init({
            appId: '1098733450235486',
            status: true,
            cookie: true,
        });

        FB.ui({
            app_id: '1098733450235486',
            method: 'feed',
            link: '',
            picture: pic,
            name: name,
            caption: 'FB SEARCH FROM USC CSCI571',
        }, function (response) {
            if (response && !response.error_message) {
                alert("Posted Successfully");
            } else {
                alert("Not Posted");
            }
        });
    }



    //pagination
    $scope.lastPage = function (page, response) {
        var myurl = page.previous;
        $http({
            url: myurl,
            method: "GET",
        }).then(function mySucces(new_res) {
            $scope[response] = new_res;
        });

    }

    $scope.nextPage = function (page, response) {
        var myurl = page.next;
        $http({
            url: myurl,
            method: "GET",
        }).then(function mySucces(new_res) {
            $scope[response] = new_res.data;
        });
    }

    $scope.lastPage = function (page, response) {
        var myurl = page.previous;

        $http({
            url: myurl,
            method: "GET",
        }).then(function mySucces(new_res) {
            $scope[response] = new_res.data;
        });

    }


    //clear button
    $scope.clear_input = function () {
        $scope.bool=false;
        $scope.back=false;
        $scope.loading = false;
        $scope.keyword = null;
        $scope.userResponse = null;
        $scope.pageResponse = null;
        $scope.eventResponse =null;
        $scope.placeResponse =null;
        $scope.groupResponse = null;
        $scope.detailResponse=null;
    }
    
    

});