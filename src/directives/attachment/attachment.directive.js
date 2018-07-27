kamaAttachment.$inject = ['alertService'];
export default function kamaAttachment(alertService) {
    let directive = {
        link: link
        , template: `<div class="kama-attachment">
            <input type="file" style="display: none" />
            
            <button type="button" class="btn btn-primary" ng-click="browse()" ng-if="!obj.readOnly()"><span class="glyphicon glyphicon-folder-open"></span>انتخاب فایل</button>
            <button type="button" class="btn btn-success" ng-click="upload()" ng-if="!obj.readOnly()" ng-disabled="!fileSelected || uploading"><span class="glyphicon glyphicon-cloud-upload"></span>بارگذاری</button>
            
            <span class="attachment-state" ng-if="!obj.readOnly() && !obj.bindingObject.FileName && !fileSelected">هیچ فایلی انتخاب نشده است. برای بارگذاری فایل ابتدا دکمه <span style="color: #337ab7">"انتخاب فایل"</span> و سپس دکمه <span style="color: #5cb85c">"بارگذاری"</span> را بزنید.</span>
            <span class="attachment-state" ng-if="obj.readOnly()">فایلی بارگذاری نشده است.</span>

            <a class="attachment-download" ng-click="openSelected($event)" ng-show="fileSelected" download="">[نمایش]</a>
            <span class="attachment-state" ng-show="fileSelected">
                <i class="fa fa-hourglass-end" aria-hidden="true" ng-show="uploading" title="درحال بارگذاری فایل، منتظر باشید"></i>
                <i class="fa fa-check" aria-hidden="true" ng-show="obj.successUpload" title="فایل با موفقیت بارگذاری شد"></i>
                {{obj.fileName}}
                <i class="fa fa-close" aria-hidden="true" ng-show="fileSelected" ng-click="obj.reset()" title="خالی کردن"></i>
            </span>

            <span ng-show="!fileSelected && obj.bindingObject.ID">
                <span class="attachment-link download" ng-click="obj.download()">[دانلود]</span>
                <span class="attachment-link remove" ng-click="obj.remove()" ng-if="!obj.readOnly()">[حذف فایل]</span>
                <span class="attachment-state">{{obj.bindingObject.FileName}}</span>
            </span>
        </div>

        <div class="modal fade deleteAttachmentConfirmationModal" tabindex="-1" role="dialog" aria-labelledby="deleteAttachmentConfirmationLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" id="deleteAttachmentConfirmationLabel">تایید حذف</h4>
                    </div>
                    <div class="modal-body">
                        <p>از حذف فایل اطمینان دارید؟</p>
                    </div>
                    <div class="modal-footer btn-container">
                        <button type="button" class="btn btn-danger btn-min-width" data-dismiss="modal" ng-click="obj.confirmRemove()">تایید</button>
                        <button type="button" class="btn btn-default btn-min-width" data-dismiss="modal">انصراف</button>
                    </div>
                </div>
            </div>
        </div>`
        , restrict: 'E'
        , scope: {
            obj: '=obj'
        }
    };

    return directive;

    function link(scope, element, attrs) {
        if (!scope.obj.uploadService)
            return console.error('KAMA ATTACHMENT: uploadService is undefied.');
        else if (typeof scope.obj.uploadService !== 'function')
            return console.error('KAMA ATTACHMENT: uploadService is not a function.');

        let file, tempFileName;

        scope.fileSelected = false;
        scope.uploading = false;
        scope.browse = browse;
        scope.openSelected = openSelected;
        scope.upload = upload;

        scope.obj.moduleType = 'attachment';
        scope.obj.validTypes = scope.obj.validTypes || ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
        scope.obj.readOnly = scope.obj.readOnly || function () { return false };
        scope.obj.successUpload = null;
        scope.obj.getParams = getParams;
        scope.obj.isFilled = isFilled;
        scope.obj.reset = reset;
        scope.obj.download = download;
        scope.obj.remove = remove;
        scope.obj.confirmRemove = confirmRemove;
        scope.obj.save = save;

        element.find("input[type='file']").bind('change', selectFile);

        function selectFile() {
            file = element.find("input[type='file']").get(0).files[0];
            scope.obj.fileName = file.name;
            scope.fileSelected = true; //**state
            scope.$apply();
        }
        function browse() {
            element.find("input[type='file']").trigger('click');
        }
        function openSelected(event) {
            let blob = new Blob([file]);
            let url = URL.createObjectURL(blob);
            event.currentTarget.setAttribute('download', file.name);
            event.currentTarget.setAttribute('href', url);
        }
        function upload() {
            // change this function so it return a promise
            if (scope.obj.validTypes.length && scope.obj.validTypes.indexOf(file.type) == -1)
                return alertService.error('قالب فایل انتخاب شده مجاز نیست');

            // check maximum file size
            if (scope.obj.maxFileSize && file && file.size > scope.obj.maxFileSize)
                return alertService.error('سایز فایل انتخاب شده بزرگتر از حد مجاز است');

            if (window.FormData !== undefined) {
                let fileData = new FormData();
                fileData.append(file.name, file);
                scope.uploading = true; // rename to state // **state

                scope.obj.uploadService(fileData).then((result) => {
                    scope.uploading = false; //**state
                    if (result) {
                        tempFileName = result;
                        scope.obj.successUpload = true;
                        alertService.success('فایل با موفقیت آپلود شد');
                    }
                    else
                        return $q.reject('خطا در بارگذاری فایل');
                }).catch(function (error) {
                    scope.uploading = false; //**state
                    alertService.error(error);
                });
            }
            else
                console.error('KAMA ATTACHMENT: Your browser doesn\'t support FormData which is required for uploading a file with this directive.');
        }
        function getParams() {
            var params = scope.obj.bindingObject || {};

            params.Type = scope.obj.type;
            params.FileName = scope.obj.fileName;
            for (var i = 0; i < scope.obj.bindings.length; i++) {
                params[scope.obj.bindings[i].as] = scope.obj.bindings[i].obj.model[scope.obj.bindings[i].parameter];
            }

            return { model: params, fileName: tempFileName };
        }
        function isFilled() {
            return !!(scope.obj.successUpload || scope.obj.bindingObject.ID);
        }
        function reset() {
            element.find("input[type='file']").val(null);
            scope.obj.bindingObject = {};
            scope.fileSelected = false;
        }
        function download() {
            return scope.obj.downloadService(scope.obj.bindingObject);
        }
        function remove() {
            element.find('.deleteAttachmentConfirmationModal').modal('show');
        }
        function confirmRemove() {
            return scope.obj.deleteService(scope.obj.bindingObject).then(reset);
        }
        function save() {
            return scope.obj.saveService(getParams());
        }
    }
}