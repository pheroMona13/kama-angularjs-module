(function () {
    angular
        .module('test')
        .controller('FormatViewController', FormatViewController);
    
    function FormatViewController() {
        var example = this;
        
        example.date = new Date();
        example.money = 290000;
        example.time = 290;
    }
})();