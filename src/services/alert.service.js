export default function alertService() {
    const service = {
        success: success
        , info: info
        , warning: warning
        , error: error
    };

    return service;

    function success(message, options) {
        alertCreator('success', message, options);
    }
    function info(message, options) {
        alertCreator('info', message, options);
    }
    function warning(message, options) {
        alertCreator('warning', message, options);
    }
    function error(message, options) {
        alertCreator('danger', message, options);
    }
    function alertCreator(className, message, options = {}) {
        if (!message)
            return;

        let uniqueAlertContainer = document.getElementById('kama-unique-alert-container'),
            alertContainer = document.getElementById('kama-alert-container'),
            template;

        options.unique = options.unique || false;
        options.timeout = options.timeout || 5000;

        if (!uniqueAlertContainer) {
            uniqueAlertContainer = createContainer('kama-unique-alert-container');
            document.body.appendChild(uniqueAlertContainer);
        }
        if (!alertContainer) {
            alertContainer = createContainer('kama-alert-container');
            document.body.appendChild(alertContainer);
        }

        template = htmlToElement(`
            <div class="alert alert-${className} alert-dismissible fade in" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="بستن">
                    <span aria-hidden="true">×</span>
                </button>
                ${message}
            </div>'
        `);

        if (options.unique) {
            uniqueAlertContainer.innerHTML = '';
            uniqueAlertContainer.append(template);
        }
        else
            alertContainer.append(template);

        if (options.timeout && options.timeout != -1) {
            setTimeout(() => {
                template.style.opacity = 1;
                (function fade() {
                    if ((template.style.opacity -= .1) < 0) {
                        if (template.parentNode === alertContainer)
                            alertContainer.removeChild(template);
                        else if (template.parentNode === uniqueAlertContainer)
                            uniqueAlertContainer.removeChild(template);
                    }
                    else
                        setTimeout(fade, 30);
                })();
            }, options.timeout);
        }

        function createContainer(id) {
            let container = document.createElement('div');
            container.id = id;
            container.style.width = '50vw';
            container.style.position = 'fixed';
            container.style.left = '25vw';
            container.style.top = '25px';
            container.style.textAlign = 'center';
            container.style.zIndex = '9999';

            return container;
        }
        function htmlToElement(html) {
            let template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }
}