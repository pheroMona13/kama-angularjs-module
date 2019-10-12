(function() {
  angular.module("test").controller("InputController", InputController);

  function InputController() {
    var example = this;

    example.date = new Date();
    example.nationalCode = "0018237193";
    example.legalNationalCode = "18928380120";
    example.inputChanged = inputChanged;

    function inputChanged(value) {
      alert(value);
    }
  }
})();
