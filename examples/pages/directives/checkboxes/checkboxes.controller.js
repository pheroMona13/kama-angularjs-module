(function() {
  angular
    .module("test")
    .controller("CheckboxesController", CheckboxesController);

  CheckboxesController.$inject = ["toolsService"];
  function CheckboxesController(toolsService) {
    var example = this;

    example.list = [
      { ID: 1, Name: "sample one" },
      { ID: 2, Name: "sample two", ParentID: 1 },
      { ID: 3, Name: "sample three", ParentID: 1 },
      { ID: 4, Name: "sample four", ParentID: 2 }
    ];
    example.tree = toolsService.getTreeObject(
      angular.copy(example.list),
      "ID",
      "ParentID"
    );
  }
})();
