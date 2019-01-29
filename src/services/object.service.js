export default function ObjectService() {
    return ObjectCreator;

    function ObjectCreator() {
        this.state = 'view';
        this.model = {};
        this.disabled = false;
        this.update = update;
        this.resetAttachments = resetAttachments;

        function update() {
            for (let key in this) {
                if (typeof (this[key]) === 'object' && this[key].moduleType) {
                    switch (this[key].moduleType) {
                        case 'multi-select':
                        case 'select':
                            this[key].update();
                            break;
                    }
                }
            }
        }
        function resetAttachments() {
            for (let key in this) {
                if (this[key].moduleType === 'attachment')
                    this[key].reset();
            }
        }
    }
}