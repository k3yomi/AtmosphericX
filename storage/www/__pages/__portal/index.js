window.addEventListener('DOMContentLoaded', () => {
    const utils = new Utils();
    const forms = ['login-form', 'signup-form'];
    forms.forEach(id => {
        const formContainer = document.getElementById(id);
        const link = formContainer.querySelector('.extra-links a');
        const form = formContainer.querySelector('form');
        const otherFormId = id === 'login-form' ? 'signup-form' : 'login-form';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            formContainer.style.display = 'none';
            document.getElementById(otherFormId).style.display = 'block';
        });
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input');
            const endpoint = id === 'login-form' ? '/api/login' : '/api/signup';
            let data = {};
            if (id === 'login-form') {
                data.username = inputs[0].value;
                data.password = CryptoJS.SHA256(inputs[1].value).toString();
            }
            if (id === 'signup-form') {
                data.username = inputs[0].value;
                data.password = CryptoJS.SHA256(inputs[1].value).toString();
                data.confirmPassword = CryptoJS.SHA256(inputs[2].value).toString();
                if (data.password !== data.confirmPassword) {
                    return utils.notify('error', 'Passwords do not match. Please try again.');
                }
            }
            try { 
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) {
                    return utils.notify('error', result.message || 'An error occurred. Please try again.');
                }
                utils.notify('success', result.message || 'Operation successful!');
                setTimeout(() => { window.location.reload(); }, 1500);
            } catch { 
                utils.notify('error', 'An error occurred. Please try again.');  
            }
        })
    });
});