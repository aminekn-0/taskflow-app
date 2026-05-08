(function () {
    // DOM elements - Login
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const showLoginPasswordCheckbox = document.getElementById('showLoginPassword');
    const loginPasswordInput = document.getElementById('password');
    
    // DOM elements - Signup
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const showSignupPasswordCheckbox = document.getElementById('showSignupPassword');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupConfirmInput = document.getElementById('confirmPassword');
    
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
        feedbackSpan.innerHTML = message + ' ⚡';
        demoInfoDiv.style.padding = '0.5rem 0.8rem';
        setTimeout(() => {
            if (demoInfoDiv.innerHTML.includes(message)) {
                demoInfoDiv.innerHTML = originalText;
                demoInfoDiv.style.padding = '0.5rem';
            }
        }, 2800);
    }

    // SWITCH TO SIGNUP
    function showSignup() {
        // Hide login containers
        loginContainer.classList.remove('active');
        loginFormContainer.classList.remove('active');
        switchPromptLogin.style.display = 'none';

        // Show signup containers
        signupContainer.classList.add('active');
        signupFormContainer.classList.add('active');
        switchPromptSignup.style.display = 'block';

        // Reset signup form
        signupForm.reset();
    }

    // SWITCH TO LOGIN
    function showLogin() {
        // Hide signup containers
        signupContainer.classList.remove('active');
        signupFormContainer.classList.remove('active');
        switchPromptSignup.style.display = 'none';

        // Show login containers
        loginContainer.classList.add('active');
        loginFormContainer.classList.add('active');
        switchPromptLogin.style.display = 'block';

        // Reset login form
        loginForm.reset();
    }

    // Handle Login
    function handleLogin(event) {
        event.preventDefault();
        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value;

        if (!usernameVal) {
            showFeedbackMessage('⚠️ Please enter your username', true);
            usernameInput.focus();
            return;
        }
        if (!passwordVal) {
            showFeedbackMessage('⚠️ Please enter your password', true);
            passwordInput.focus();
            return;
        }

        const rememberStatus = rememberCheckbox.checked ? 'enabled' : 'disabled';
        showFeedbackMessage(`✨ Welcome back, ${usernameVal}! Login successful (remember me: ${rememberStatus})`, false);
        // console.log(`[demo] login: user=${usernameVal}`);
    }

    // Show/Hide Password for Login
    
    if (showLoginPasswordCheckbox && loginPasswordInput) {
        showLoginPasswordCheckbox.addEventListener('change', function () {
            const type = this.checked ? 'text' : 'password';
            loginPasswordInput.type = type;

            // Change eye icon
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
        const userEmail = usernameInput.value.trim();
        if (userEmail && userEmail.includes('@')) {
            showFeedbackMessage(`📧 Reset link sent to ${userEmail} (demo)`, false);
        } else if (userEmail) {
            showFeedbackMessage(`📬 If ${userEmail} is registered, you'll receive recovery instructions`, false);
        } else {
            showFeedbackMessage(`🔐 Please enter your username/email first to reset password`, true);
            usernameInput.focus();
        }
    }

    // Handle Signup
    function handleSignup(event) {
        event.preventDefault();

        const nameVal = signupName.value.trim();
        const emailVal = signupEmail.value.trim();
        const passwordVal = signupPassword.value;
        const confirmVal = confirmPassword.value;

        if (!nameVal) {
            showFeedbackMessage('⚠️ Please enter your full name', true);
            signupName.focus();
            return;
        }
        if (!emailVal) {
            showFeedbackMessage('⚠️ Please enter your email address', true);
            signupEmail.focus();
            return;
        }
        if (!emailVal.includes('@') || !emailVal.includes('.')) {
            showFeedbackMessage('⚠️ Please enter a valid email address', true);
            signupEmail.focus();
            return;
        }
        if (!passwordVal) {
            showFeedbackMessage('⚠️ Please create a password', true);
            signupPassword.focus();
            return;
        }
        if (passwordVal.length < 8) {
            showFeedbackMessage('⚠️ Password must be at least 8 characters', true);
            signupPassword.focus();
            return;
        }
        if (passwordVal !== confirmVal) {
            showFeedbackMessage('⚠️ Passwords do not match', true);
            confirmPassword.focus();
            return;
        }
        if (!termsCheckbox.checked) {
            showFeedbackMessage('⚠️ Please agree to the Terms of Service', true);
            return;
        }

        showFeedbackMessage(`🎉 Welcome, ${nameVal}! Your account has been created successfully.`, false);
        // console.log(`[demo] signup: name=${nameVal}, email=${emailVal}`);

        // auto switch to login after 2 seconds
        setTimeout(() => {
            showLogin();
            showFeedbackMessage(`✨ Account created! Please sign in.`, false);
        }, 2000);
    }
    
        // Show/Hide Password for Signup
    if (showSignupPasswordCheckbox && signupPasswordInput) {
        showSignupPasswordCheckbox.addEventListener('change', function () {
            const type = this.checked ? 'text' : 'password';
            signupPasswordInput.type = type;
            if (signupConfirmInput) {
                signupConfirmInput.type = type;
            }

            // Change eye icon
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

    // Event Listeners - Login
    loginForm.addEventListener('submit', handleLogin);
    forgotLink.addEventListener('click', handleForgotPassword);

    // Event Listeners - Signup
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
            showFeedbackMessage(`📜 Terms of Service would open here (demo)`, false);
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showFeedbackMessage(`🔒 Privacy Policy would open here (demo)`, false);
        });
    }
})();