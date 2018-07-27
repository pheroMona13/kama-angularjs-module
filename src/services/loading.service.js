export default function loadingService() {
    let service = {
        show: show
        , hide: hide
    };

    // create loading view
    let loadingContainer = document.createElement('div')
        , loadingView = `
        <div id="loading-service" style="display: none">
            <div class="showbox">
                <div class="loader">
                    <svg class="circular" viewBox="25 25 50 50">
                        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                    </svg>
                </div>
            </div>
        </div>`;
    loadingContainer.innerHTML = loadingView;
    document.body.appendChild(loadingContainer);

    return service;
    
    function show() {
        $('#loading-service').show();
    }
    function hide(timeout) {
        if (timeout === undefined)
            timeout = 200;

        if (timeout)
            setTimeout(function () { $('#loading-service').hide() }, timeout);
        else
            $('#loading-service').hide();
    }
}