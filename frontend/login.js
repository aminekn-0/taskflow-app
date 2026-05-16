// API Configuration
const API_URL = '/api';  // Nginx proxy will handle routing to backend

// Axios-like fetch wrapper
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

// Check if user is already logged in
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const result = await api.get('/auth/verify-token');
        if (result.success) {
            // Store user info
            localStorage.setItem('user', JSON.stringify(result.user));
            return true;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return false;
}

// Redirect to home if logged in
async function redirectIfLoggedIn() {
    const isLoggedIn = await checkAuth();
    if (isLoggedIn) {
        window.location.href = '/home.html';
    }
}

(function () {
    // DOM elements - Login
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const rememberCheckbox = document.getElementById('rememberCheckbox');

    // DOM elements - Signup
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsCheckbox');

    // Containers
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const switchPromptLogin = document.getElementById('switchPromptLogin');
    const switchPromptSignup = document.getElementById('switchPromptSignup');

    const demoInfoDiv = document.getElementById('demoInfo');

    // Helper function to show feedback
    function showFeedbackMessage(message, isError = false) {
        const originalText = demoInfoDiv.innerHTML;
        const feedbackSpan = document.createElement('span');
        feedbackSpan.style.fontWeight = '500';
        if (isError) {
            feedbackSpan.style.color = '#c7254e';
            feedbackSpan.style.backgroundColor = '#fff5f7';
        } else {
            feedbackSpan.style.color = '#2c6e2f';
            feedbackSpan.style.backgroundColor = '#eef9ef';
        }
        demoInfoDiv.innerHTML = '';
        demoInfoDiv.appendChild(feedbackSpan);
        feedbackSpan.innerHTML = message;
        demoInfoDiv.style.padding = '0.5rem 0.8rem';
        setTimeout(() => {
            if (demoInfoDiv.innerHTML.includes(message)) {
                demoInfoDiv.innerHTML = originalText;
                demoInfoDiv.style.padding = '0.5rem';
            }
        }, 3000);
    }

    // Show loading state
    function setLoading(button, isLoading, originalText) {
        if (isLoading) {
            button.disabled = true;
            button.textContent = 'Loading...';
        } else {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    // SWITCH TO SIGNUP
    function showSignup() {
        loginContainer.classList.remove('active');
        loginFormContainer.classList.remove('active');
        switchPromptLogin.style.display = 'none';

        signupContainer.classList.add('active');
        signupFormContainer.classList.add('active');
        switchPromptSignup.style.display = 'block';

        signupForm.reset();
    }

    // SWITCH TO LOGIN
    function showLogin() {
        signupContainer.classList.remove('active');
        signupFormContainer.classList.remove('active');
        switchPromptSignup.style.display = 'none';

        loginContainer.classList.add('active');
        loginFormContainer.classList.add('active');
        switchPromptLogin.style.display = 'block';

        loginForm.reset();
    }

    // Handle Login
    async function handleLogin(event) {
        event.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPasswordInput.value;
        const remember = rememberCheckbox.checked;
        const submitBtn = document.getElementById('loginSubmitBtn');
        const originalText = submitBtn.textContent;

        if (!email) {
            showFeedbackMessage('⚠️ Please enter your email', true);
            loginEmail.focus();
            return;
        }
        if (!password) {
            showFeedbackMessage('⚠️ Please enter your password', true);
            loginPasswordInput.focus();
            return;
        }

        setLoading(submitBtn, true, originalText);

        try {
            const result = await api.post('/auth/login', { email, password });

            if (result.success) {
                // Store token
                if (remember) {
                    localStorage.setItem('token', result.token);
                } else {
                    sessionStorage.setItem('token', result.token);
                }

                // Store user info
                localStorage.setItem('user', JSON.stringify(result.user));

                showFeedbackMessage(`✨ Welcome back, ${result.user.fullName}! Redirecting...`, false);

                // Redirect to home page after short delay
                setTimeout(() => {
                    window.location.href = '/home.html';
                }, 1500);
            }
        } catch (error) {
            showFeedbackMessage(`❌ Login failed: ${error.message}`, true);
            setLoading(submitBtn, false, originalText);
        }
    }

    // Handle Signup
    async function handleSignup(event) {
        event.preventDefault();

        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const confirm = confirmPassword.value;
        const terms = termsCheckbox.checked;
        const submitBtn = document.getElementById('signupSubmitBtn');
        const originalText = submitBtn.textContent;

        if (!name) {
            showFeedbackMessage('⚠️ Please enter your full name', true);
            signupName.focus();
            return;
        }
        if (!email) {
            showFeedbackMessage('⚠️ Please enter your email address', true);
            signupEmail.focus();
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showFeedbackMessage('⚠️ Please enter a valid email address', true);
            signupEmail.focus();
            return;
        }
        if (!password) {
            showFeedbackMessage('⚠️ Please create a password', true);
            signupPassword.focus();
            return;
        }
        if (password.length < 8) {
            showFeedbackMessage('⚠️ Password must be at least 8 characters', true);
            signupPassword.focus();
            return;
        }
        if (password !== confirm) {
            showFeedbackMessage('⚠️ Passwords do not match', true);
            confirmPassword.focus();
            return;
        }
        if (!terms) {
            showFeedbackMessage('⚠️ Please agree to the Terms of Service', true);
            return;
        }

        setLoading(submitBtn, true, originalText);

        try {
            const result = await api.post('/auth/register', {
                fullName: name,
                email,
                password,
            });

            if (result.success) {
                showFeedbackMessage(`🎉 Welcome, ${name}! Account created successfully! Redirecting to login...`, false);

                // Clear form and switch to login after 2 seconds
                setTimeout(() => {
                    showLogin();
                    setLoading(submitBtn, false, originalText);
                    showFeedbackMessage(`✨ Account created! Please sign in.`, false);
                }, 2000);
            }
        } catch (error) {
            showFeedbackMessage(`❌ Signup failed: ${error.message}`, true);
            setLoading(submitBtn, false, originalText);
        }
    }

    // Show/Hide Password for Login
    const showLoginPasswordCheckbox = document.getElementById('showLoginPassword');
    if (showLoginPasswordCheckbox && loginPasswordInput) {
        showLoginPasswordCheckbox.addEventListener('change', function () {
            const type = this.checked ? 'text' : 'password';
            loginPasswordInput.type = type;

            const icon = this.nextElementSibling.querySelector('i');
            if (this.checked) {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Show/Hide Password for Signup
    const showSignupPasswordCheckbox = document.getElementById('showSignupPassword');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupConfirmInput = document.getElementById('confirmPassword');

    if (showSignupPasswordCheckbox && signupPasswordInput) {
        showSignupPasswordCheckbox.addEventListener('change', function () {
            const type = this.checked ? 'text' : 'password';
            signupPasswordInput.type = type;
            if (signupConfirmInput) {
                signupConfirmInput.type = type;
            }

            const icon = this.nextElementSibling.querySelector('i');
            if (this.checked) {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Handle Forgot Password
    function handleForgotPassword(e) {
        e.preventDefault();
        const email = loginEmail.value.trim();
        if (email && email.includes('@')) {
            showFeedbackMessage(`📧 Reset link would be sent to ${email}`, false);
        } else {
            showFeedbackMessage(`🔐 Please enter your email address first`, true);
            loginEmail.focus();
        }
    }

    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', handleForgotPassword);
    }

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Switch buttons
    const switchToSignupLink = document.getElementById('switchToSignupLink');
    const switchToLoginLink = document.getElementById('switchToLoginLink');
    const goToSignupBtn = document.getElementById('goToSignupBtn');
    const goToLoginBtn = document.getElementById('goToLoginBtn');

    if (switchToSignupLink) switchToSignupLink.addEventListener('click', showSignup);
    if (switchToLoginLink) switchToLoginLink.addEventListener('click', showLogin);
    if (goToSignupBtn) goToSignupBtn.addEventListener('click', showSignup);
    if (goToLoginBtn) goToLoginBtn.addEventListener('click', showLogin);

    // Terms & Privacy links (demo)
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');

    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showFeedbackMessage(`📜 Terms of Service would open here`, false);
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showFeedbackMessage(`🔒 Privacy Policy would open here`, false);
        });
    }

    // Check if already logged in
    redirectIfLoggedIn();
})();