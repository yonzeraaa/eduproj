document.addEventListener('DOMContentLoaded', function() {
      const loginContainer = document.getElementById('login-container');
      const registerContainer = document.getElementById('register-container');
      const forgotPasswordContainer = document.getElementById('forgot-password-container');
      const showRegisterLink = document.getElementById('show-register');
      const showLoginLink = document.getElementById('show-login');
      const showForgotPasswordLink = document.getElementById('show-forgot-password');
      const loginForm = document.getElementById('login-form');
      const registerForm = document.getElementById('register-form');
      const forgotPasswordForm = document.getElementById('forgot-password-form');

      // Show login container initially
      loginContainer.style.display = 'block';

      function toggleContainers(showLogin, showRegister, showForgotPassword) {
        loginContainer.style.display = showLogin ? 'block' : 'none';
        registerContainer.style.display = showRegister ? 'block' : 'none';
        forgotPasswordContainer.style.display = showForgotPassword ? 'block' : 'none';
      }

      showRegisterLink.addEventListener('click', function(event) {
        event.preventDefault();
        toggleContainers(false, true, false);
      });

      showLoginLink.addEventListener('click', function(event) {
        event.preventDefault();
        toggleContainers(true, false, false);
      });

      showForgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        toggleContainers(false, false, true);

        const backToLoginLink = document.getElementById('back-to-login');
        backToLoginLink.addEventListener('click', function(event) {
          event.preventDefault();
          toggleContainers(true, false, false);
        });
      });

      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember').checked;

        fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
            remember: remember,
          }),
        })
        .then(response => {
          if (response.redirected) {
            window.location.href = response.url;
          } else if (!response.ok) {
            return response.text().then(text => {
              throw new Error(text);
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Erro ao fazer login: ' + error.message);
        });
      });

      registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const phone = document.getElementById('register-phone').value;

        if (password !== confirmPassword) {
          alert('As senhas não coincidem.');
          return;
        }

        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
            phone: phone
          }),
        })
        .then(response => {
          if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            toggleContainers(true, false, false);
          } else {
            return response.text().then(text => {
              throw new Error(text);
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Erro no cadastro: ' + error.message);
        });
      });

      forgotPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('forgot-email').value;
        alert('Instruções de recuperação de senha enviadas para: ' + email);
      });
    });
