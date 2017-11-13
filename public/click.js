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
    $scope.errorMessage='';
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

  function logIn(){
    console.log("ayy lmao");
    buttonApi.logIn($scope.username, $scope.password)
    .success(function (valid){
      if(valid[0].isValid){
        console.log("It worked! you're logged in");
        $scope.loggedIn = 1;
      }else{
        console.log("You don't exist brah");
      }
    })
    .error(function(){$scope.errorMessage="IDK what to put here";});
  }

  function logOut(){
    console.log("I'm gonna log you out now")
    $scope.loggedIn = 0;
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
    logIn: function(username, password){
      var url = apiUrl+'/user?username=' + username +'&password=' + password;
      console.log(url);
      return $http.get(url);
    }
  };
}
