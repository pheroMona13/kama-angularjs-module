(function () {
    angular
        .module('test')
        .controller('AttachmentDirectiveController', AttachmentDirectiveController);

    AttachmentDirectiveController.$inject = ['$http', 'alertService', 'loadingService'];
    function AttachmentDirectiveController($http, alertService, loadingService) {
        var example = this;

        example.tab = 1;
        example.ID = 'd1bdf873-2312-4f3a-9678-418bac96c9d7';
        example.save = save;
        example.load = load;
        example.attachment = {
            bindings: [{ model: example, parameter: 'ID', as: 'ParentID' }]
            , autoSave: false
            , type: 2
            , uploadService: upload // should be a function that returns a promise
            , downloadService: download
            , deleteService: remove
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
        function save() {
            loadingService.show();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/Save'
                , data: example.attachment.getParams()
            }).then(function (result) {
                loadingService.hide();
                alertService.success('فایل با موفقیت ذخیره شد');
                example.attachment.bindingObject = result.data.Data;
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
                , data: { ParentID: example.ID }
            }).then(function (result) {
                example.attachment.bindingObject = result.data.Data[0];
                loadingService.hide();
            });
        }
        function download() {
            loadingService.show();
            let downloadWindow = window.open();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/Get'
                , data: { ID: example.attachment.bindingObject.ID }
            }).then(function (result) {
                downloadWindow.location = 'http://localhost:26089/TemporaryFiles/' + result.data.Data.FileName;
                loadingService.hide();
            });
        }
        function remove() {
            loadingService.show();
            return $http({
                method: 'POST'
                , url: 'http://localhost:26089/Attachment/Delete'
                , data: { ID: example.attachment.bindingObject.ID }
            }).then(function () {
                example.attachment.reset();
                loadingService.hide();
            });
        }
    }
})();