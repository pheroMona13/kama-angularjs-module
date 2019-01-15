kamaAttachment.$inject = ["alertService"];
export default function kamaAttachment(alertService) {
  let directive = {
    link: link,
    template: require("./attachment.directive.html"),
    restrict: "E",
    scope: {
      obj: "=obj"
    }
  };

  return directive;

  function link(scope, element, attrs) {
    let file, tempFileName;

    scope.fileSelected = false;
    scope.uploading = false;
    scope.browse = browse;
    scope.openSelected = openSelected;
    scope.upload = upload;

    scope.obj.moduleType = "attachment";
    scope.obj.getParams = getParams;
    scope.obj.isFilled = isFilled;
    scope.obj.reset = reset;
    scope.obj.download = download;
    scope.obj.remove = remove;
    scope.obj.confirmRemove = confirmRemove;
    scope.obj.save = save;

    scope.obj.successUpload = null;
    scope.obj.validTypes = scope.obj.validTypes || [
      "application/vnd.ms-excel",
      "application/msexcel",
      "application/x-msexcel",
      "application/x-ms-excel",
      "application/x-excel",
      "application/x-dos_ms_excel",
      "application/xls",
      "application/x-xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/x-7z-compressed",
      "application/x-rar-compressed",
      "image/jpeg",
      "image/x-citrix-jpeg",
      "image/png",
      "image/x-citrix-png",
      "image/x-png",
      "image/tiff",
      "image/gif",
      "image/bmp",
      "image/svg+xml"
    ];
    if (scope.obj.readOnly === true || scope.obj.readOnly === false)
      scope.obj.readOnly = function() {
        return scope.obj.readOnly;
      };
    else
      scope.obj.readOnly =
        scope.obj.readOnly ||
        function() {
          return false;
        };

    element.find("input[type='file']").bind("change", selectFile);

    function selectFile() {
      file = element.find("input[type='file']").get(0).files[0];
      scope.obj.fileName = file.name;
      scope.fileSelected = true; //**state
      scope.$apply();
    }
    function browse() {
      element.find("input[type='file']").trigger("click");
    }
    function openSelected(event) {
      let blob = new Blob([file]);
      let url = URL.createObjectURL(blob);
      event.currentTarget.setAttribute("download", file.name);
      event.currentTarget.setAttribute("href", url);
    }
    function upload() {
      // change this function so it return a promise
      if (
        scope.obj.validTypes.length &&
        scope.obj.validTypes.indexOf(file.type) === -1
      )
        return alertService.error("قالب فایل انتخاب شده مجاز نیست");

      // check maximum file size
      if (scope.obj.maxFileSize && file && file.size > scope.obj.maxFileSize)
        return alertService.error("سایز فایل انتخاب شده بزرگتر از حد مجاز است");

      if (window.FormData !== undefined) {
        let fileData = new FormData();
        fileData.append(file.name, file);
        scope.uploading = true; // rename to state // **state

        scope.obj
          .uploadService(fileData)
          .then(result => {
            scope.uploading = false; //**state
            if (result) tempFileName = result;
            else return $q.reject("خطا در بارگذاری فایل");
          })
          .then(() => {
            if (scope.obj.autoSave)
              return save().then(() => {
                /* 
                  successUpload must reset after save
                  create separate states?
                */
                // scope.obj.successUpload = true;
                alertService.success("فایل با موفقیت آپلود و ذخیره شد");
              });
            else {
              scope.obj.successUpload = true;
              alertService.success("فایل با موفقیت آپلود شد");
            }
          })
          .catch((error) => {
            scope.uploading = false; //**state
            alertService.error(error);
          });
      } else
        console.error(
          "KAMA ATTACHMENT: Your browser doesn't support FormData which is required for uploading a file with this directive."
        );
    }
    function getParams() {
      let params = scope.obj.bindingObject || {};

      params.Type = scope.obj.type;
      params.FileName = scope.obj.fileName;
      for (let i = 0; i < scope.obj.bindings.length; i++) {
        params[scope.obj.bindings[i].as] =
          scope.obj.bindings[i].obj.model[scope.obj.bindings[i].parameter];
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
      scope.obj.successUpload = null;
    }
    function download() {
      return scope.obj.downloadService(scope.obj.bindingObject);
    }
    function remove() {
      if (!scope.obj.insideModal)
        element.find(".delete-attachment-confirmation-modal").modal("show");
      else if (confirm("از حذف فایل اطمینان دارید؟")) confirmRemove();
    }
    function confirmRemove() {
      return scope.obj.deleteService(scope.obj.bindingObject).then(reset);
    }
    function save() {
      return scope.obj.saveService(getParams());
    }
  }
}
