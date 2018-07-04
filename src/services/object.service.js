﻿export default function ObjectService() {
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
                        case 'select':
                            this[key].update();
                            break;
                        case 'attachment':
                            if (this[key].bindingObject && Object.keys(this[key].bindingObject).length === 0)
                                this[key].reset();
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