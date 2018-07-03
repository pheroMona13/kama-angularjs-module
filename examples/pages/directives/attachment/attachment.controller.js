(function () {
    angular
        .module('test')
        .controller('AttachmentDirectiveController', AttachmentDirectiveController);

    AttachmentDirectiveController.$inject = ['$http', 'alertService', 'loadingService', 'ObjectService'];
    function AttachmentDirectiveController($http, alertService, loadingService, ObjectService) {
        var example = this;

        example.main = new ObjectService();
        example.main.model.ID = 'd1bdf873-2312-4f3a-9678-418bac96c9d7';
        example.main.save = save;
        example.main.load = load;
        example.main.attachment = {
            bindings: [{ obj: example.main, parameter: 'ID', as: 'ParentID' }]
            , autoSave: false
            , type: 2
            , uploadService: upload // should be a function that returns a promise
            , downloadService: download
            , deleteService: remove
            , saveService: save
        }

        function upload(fileData) {
            // input should be an instance of FileDate
            // should return file path on success, a falsy value on error
            loadingService.show();
            return $http.post(
                'http://localhost:26089/Attachment/Upload'
                , fileData
                , { transformRequest: angular.identity, headers: { 'Content-Type': undefined } }
            ).then(function (result) {
                loadingService.hide();
                if (result.data)
                    return result.data;
                else
                    return false;
            });
        }
        function save(model) {
            loadingService.show();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/Save'
                , data: model
            }).then(function (result) {
                loadingService.hide();
                alertService.success('فایل با موفقیت ذخیره شد');
            }).catch(function (error) {
                loadingService.hide();
                alertService.error('خطا در ذخیره‌سازی فایل');
            });
        }
        function load() {
            loadingService.show();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/List'
                , data: { ParentID: example.main.model.ID }
            }).then(function (result) {
                example.main.attachment.bindingObject = result.data.Data[0];
                loadingService.hide();
            });
        }
        function download(model) {
            loadingService.show();
            let downloadWindow = window.open();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/Get'
                , data: model
            }).then(function (result) {
                downloadWindow.location = 'http://localhost:26089/TemporaryFiles/' + result.data.Data.FileName;
                loadingService.hide();
            });
        }
        function remove(model) {
            loadingService.show();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/Delete'
                , data: model
            }).then(function () {
                loadingService.hide();
            });
        }
    }
})();