
function showSnackbar(message, isSuccess = false) {
    const snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = `<i class="bi ${isSuccess ? 'bi-check-circle' : 'bi-exclamation-triangle'}"></i>${message}`;
    if (isSuccess) {
        snackbar.classList.add("success");
    } else {
        snackbar.classList.remove("success");
    }
    snackbar.classList.add("show");
    setTimeout(() => {
        snackbar.classList.remove("show");
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            await login(username, password);
            showSnackbar('Login realizado com sucesso!', true);


            setTimeout(() => {
                window.location.href = 'tela_listar.html';
            }, 1000);

        } catch (error) {
            showSnackbar(error.message);
        }

    });
});

//<----------------------------------------->
// Autenticação da API
//<----------------------------------------->
async function login(username, password) {
    try {
        const response = await fetch('http://localhost:9856/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Falha na autenticação');
        }

        const data = await response.json();

        if (data.token) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('email', data.email);
            sessionStorage.setItem('nome', username);
            console.log('Token salvo com sucesso!');
        } else {
            throw new Error('Token não encontrado na resposta');
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);

        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução na porta 9856.');
        }

        throw error;
    }
}
