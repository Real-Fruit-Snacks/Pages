/**
 * Simple Security Module Test
 */

const Security = {
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return '';
        }
        const div = document.createElement('div');
        div.textContent = unsafe;
        return div.innerHTML;
    }
};

export { Security };