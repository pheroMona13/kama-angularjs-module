trustAsHtml.$inject = ['$sce'];
export default function trustAsHtml($sce) {
    return $sce.trustAsHtml;
}