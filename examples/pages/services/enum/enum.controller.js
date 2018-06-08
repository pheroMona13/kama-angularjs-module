(function () {
    angular
        .module('test')
        .controller('EnumServiceController', EnumServiceController);

    EnumServiceController.$inject = ['enumService'];
    function EnumServiceController(enumService) {
        console.log('console.log(enumService.SampleEnum);');
        console.log(enumService.SampleEnum);

        var model = { test: 1 };
        console.log('var model = { test: 1 };\nconsole.log(enumService.SampleEnum[model.test]);');
        console.log(enumService.SampleEnum[model.test]);
    }
})();