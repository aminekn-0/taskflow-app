// API Configuration
const API_URL = 'http://127.0.0.1:5000/api';

// API wrapper
const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    },
};

// Check auth
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const result = await api.get('/auth/verify-token');
        return result.success;
    } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
    }
}

// redirect if logged in
async function redirectIfLoggedIn() {
    const isLoggedIn = await checkAuth();
    if (isLoggedIn) {
        window.location.href = '/home.html';
    }
}

(function () {

    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');

    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    const rememberCheckbox = document.getElementById('rememberCheckbox');

    const demoInfoDiv = document.getElementById('demoInfo');

    function showFeedbackMessage(message, isError = false) {
        demoInfoDiv.innerText = message;
        demoInfoDiv.style.color = isError ? 'red' : 'green';

        setTimeout(() => {
            demoInfoDiv.innerText = '';
        }, 3000);
    }

    function setLoading(btn, loading) {
        btn.disabled = loading;
        btn.textContent = loading ? 'Loading...' : btn.dataset.original;
    }

    // LOGIN
    async function handleLogin(e) {
        e.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPasswordInput.value;

        const submitBtn = document.getElementById('loginSubmitBtn');
        submitBtn.dataset.original = submitBtn.textContent;

        if (!email || !password) {
            showFeedbackMessage('Fill all fields', true);
            return;
        }

        setLoading(submitBtn, true);

        try {
            const result = await api.post('/auth/login', {
                email,
                password
            });

            if (result.success) {

                // ✅ FIX IMPORTANT
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                showFeedbackMessage(`Welcome ${result.user.fullName}`);

                setTimeout(() => {
                    window.location.href = '/home.html';
                }, 1000);
            }

        } catch (err) {
            showFeedbackMessage(err.message, true);
        }

        setLoading(submitBtn, false);
    }

    // SIGNUP
    async function handleSignup(e) {
        e.preventDefault();

        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const confirm = confirmPassword.value;

        const submitBtn = document.getElementById('signupSubmitBtn');
        submitBtn.dataset.original = submitBtn.textContent;

        if (!name || !email || !password) {
            showFeedbackMessage('Fill all fields', true);
            return;
        }

        if (password !== confirm) {
            showFeedbackMessage('Passwords do not match', true);
            return;
        }

        setLoading(submitBtn, true);

        try {
            const result = await api.post('/auth/register', {
                fullName: name,
                email,
                password
            });

            if (result.success) {
                showFeedbackMessage('Account created! Please login');

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        } catch (err) {
            showFeedbackMessage(err.message, true);
        }

        setLoading(submitBtn, false);
    }

    // events
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    redirectIfLoggedIn();
    // Switch between login and signup
const goToSignupBtn = document.getElementById('goToSignupBtn');
const goToLoginBtn = document.getElementById('goToLoginBtn');
const switchToSignupLink = document.getElementById('switchToSignupLink');
const switchToLoginLink = document.getElementById('switchToLoginLink');

function showSignup() {
    document.getElementById('loginFormContainer').classList.remove('active');
    document.getElementById('signupFormContainer').classList.add('active');
    document.getElementById('loginContainer').classList.remove('active');
    document.getElementById('signupContainer').classList.add('active');
    document.getElementById('switchPromptLogin').style.display = 'none';
    document.getElementById('switchPromptSignup').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupFormContainer').classList.remove('active');
    document.getElementById('loginFormContainer').classList.add('active');
    document.getElementById('signupContainer').classList.remove('active');
    document.getElementById('loginContainer').classList.add('active');
    document.getElementById('switchPromptSignup').style.display = 'none';
    document.getElementById('switchPromptLogin').style.display = 'block';
}

goToSignupBtn.addEventListener('click', showSignup);
goToLoginBtn.addEventListener('click', showLogin);
switchToSignupLink.addEventListener('click', showSignup);
switchToLoginLink.addEventListener('click', showLogin);

})();