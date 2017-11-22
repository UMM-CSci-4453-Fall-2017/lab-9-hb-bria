angular.module('buttons',[])
.controller('buttonCtrl',ButtonCtrl)
.factory('buttonApi',buttonApi)
.constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
  $scope.buttons=[]; //Initially all was still
  $scope.errorMessage='';
  $scope.isLoading=isLoading;
  $scope.refreshButtons=refreshButtons;
  $scope.buttonClick=buttonClick;
  $scope.deleteClick=deleteClick;
  $scope.currentTrans=[];
  $scope.username = "";
  $scope.password = "";
  $scope.total = 0;
  $scope.loggedIn = 0;
  $scope.logIn = logIn;
  $scope.logOut = logOut;
  $scope.test = sale;
  $scope.void = vooid;
  $scope.currentUser = "";
  $scope.startTime = null;
  $scope.stopTime = null;


  var loading = false;

  function isLoading(){
    return loading;
  }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
    .success(function(data){
      $scope.buttons=data;
      loading=false;
    })
    .error(function () {
      $scope.errorMessage="Unable to load Buttons:  Database request failed";
      loading=false;
    });
  }

  function buttonClick($event){
    if ($scope.startTime === null) {
        $scope.startTime = new Date().getTime() / 1000;
    } else {
        $scope.endTime = new Date().getTime() / 1000;
    }
    console.log($scope.startTime);
    console.log($scope.endTime);
    buttonApi.clickButton($event.target.id)
    .success(function(currentTrans){
      $scope.currentTrans = currentTrans;
      $scope.total = getTotalAmount(currentTrans);
    })
    .error(function(){$scope.errorMessage="Unable click";});
  }

  function deleteClick($event){
    buttonApi.removeButton($event.target.id)
    .success(function(currentTrans){
      $scope.currentTrans = currentTrans;
      $scope.total = getTotalAmount(currentTrans);
    })
    .error(function(){$scope.errorMessage="Unable click";});
  }

  function logIn(username, password){
    console.log("ayy lmao");
    buttonApi.logIn(username)
    .success(function (passwords){

        if(passwords[0].password === password){
          $scope.loggedIn = 1;

        }

      buttonApi.getTrans()
      .success(function (transactions){
        $scope.currentTrans = transactions;
        $scope.total = getTotalAmount(transactions);
      })
      $scope.currentUser = username;
      console.log("adfasdf");
      console.log($scope.currentUser);
      $scope.username = "";
      $scope.password = "";
    })
    .error(function(){$scope.errorMessage="IDK what to put here";});
  }

  function logOut(){
    console.log("I'm gonna log you out now")
    $scope.loggedIn = 0;
  }

  // Do nothing
  function sale(){
    console.log("gonna sell ya shit dude");
    buttonApi.sale($scope.currentUser)
    .success(function (message){
      console.log(message);
      vooid();
    })
    .error(function(){$scope.errorMessage="IDK what to put here";});
  }

  function vooid(){
    console.log("gonna delete ya shit dude");
    buttonApi.void()
    .success(function (message){
      console.log(message)
      buttonApi.getTrans()
      .success(function (transactions){
        resetTime();
        $scope.currentTrans = transactions;
        $scope.total = getTotalAmount(transactions);
      })
      .error(function(){$scope.errorMessage="IDK what to put here";});
    })
    .error(function(){$scope.errorMessage="IDK what to put here";});
  }

  function resetTime() {
    $scope.startTime = null;
    $scope.stopTime = null;
  }

  refreshButtons();  //make sure the buttons are loaded

}

function getTotalAmount(currentTrans) {
  var total = 0;
  for (var i = 0; i < currentTrans.length; i++) {
    total += currentTrans[i].price * currentTrans[i].amount;
  }
  return total.toFixed(2);
}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
      //      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    removeButton: function(invID) {
      var url = apiUrl+'/delete?id='+invID.substring(6);
      console.log(invID.substring(6));
      return $http.get(url);
    },
    logIn: function(username){
      var url = apiUrl+'/user?username=' + username;
      console.log(url);
      return $http.get(url);
    },
    sale: function(currentUser){
      var url = apiUrl+'/sale?currentUser=' + currentUser;
      console.log(url);
      return $http.get(url);
    },
    void: function(){
      var url = apiUrl + '/void';
      console.log(url);
      return $http.get(url);
    },
    getTrans: function(){
      var url = apiUrl + '/transactions';
      console.log(url);
      return $http.get(url);
    }
  };
}
