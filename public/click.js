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
  $scope.void = voidTransactions;
  $scope.reciept = reciept;
  $scope.currentUser = "";

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
    buttonApi.logIn(username)
    .success(function (passwords){

        if(passwords[0].password === password){
          $scope.loggedIn = 1;

        }
      $scope.currentUser = username;
      console.log($scope.currentUser);
      $scope.username = "";
      $scope.password = "";
    })
    .error(function(){$scope.errorMessage="Unable to login";});
  }

  function logOut(){
    $scope.current_trans = [];
    voidTransactions();
    $scope.total = 0;
    $scope.loggedIn = 0;
  }

  // Do nothing
  function sale(){
    buttonApi.sale($scope.currentUser)
    .success(function (message){
        console.log(message);
        reciept();
      voidTransactions();
    })
    .error(function(){$scope.errorMessage="Sold out";});
  }

  function voidTransactions(){
    buttonApi.void()
    .success(function (message){
      $scope.currentTrans = [];
      $scope.total = 0;
    })
    .error(function(){$scope.errorMessage="IDK what to put here";});
  }

  function reciept() {
        var result = "";
        for(var i = 0; i < $scope.currentTrans.length; i++){
          result += "Product: " + $scope.currentTrans[i].label + '\n';
            result += '\t' + "Amount: " + $scope.currentTrans[i].amount + '\n';
            result += '\t' + "Price: " + $scope.currentTrans[i].price + '\n';
      }

      result += 'Transaction Total: ' + getTotalAmount($scope.currentTrans);

      alert(result);
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
    }
  };
}
