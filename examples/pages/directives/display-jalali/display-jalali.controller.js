(function () {
    angular
        .module('test')
        .controller('DisplayJalaliController', DisplayJalaliController);
    
    function DisplayJalaliController() {
        var example = this;
        
        example.testDate = new Date();
    }
})();