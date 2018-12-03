(function() {
  angular
    .module("test")
    .controller("DisplayJalaliController", DisplayJalaliController);

  function DisplayJalaliController() {
    var example = this;

    example.testDate = new Date();
    example.testDateString = "Mon Nov 05 2017";
  }
})();
