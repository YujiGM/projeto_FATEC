
const token = sessionStorage.getItem('token');

if (!token) {
    window.location.href = 'tela_login.html';
}

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
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmSenha = document.getElementById('confirmSenha').value;
        const termsCheck = document.getElementById('termsCheck').checked;


        if (senha !== confirmSenha) {
            showSnackbar('As senhas não coincidem!');
            return;
        }

        if (senha.length < 6) {
            showSnackbar('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        if (!termsCheck) {
            showSnackbar('Você precisa aceitar os termos e condições!');
            return;
        }
        const dadosCliente = {
            id: 0,
            nome: nome,
            email: email,
            senha: senha

        };
        try {
            await cadastrarUsuario(dadosCliente);
            showSnackbar('Cadastro realizado com sucesso!', true);

            
            setTimeout(() => {
                window.location.href = 'tela_listar_usuario.html';
            }, 1500);
        } catch (error) {
            showSnackbar(error.message || 'Erro ao cadastrar usuário.');
        }

    });
});

//<----------------------------------------->
// Cadastro de Usuário na API
//<----------------------------------------->
async function cadastrarUsuario(dados) {
    try {
        const response = await fetch('http://localhost:9856/api/usuarios/criarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        })
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log('Usuário cadastrado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);


        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução na porta 9856.');
        }

        throw error;
    }
}

document.getElementById('voltarBtn').addEventListener('click', function () {
    window.location.href = 'tela_listar_usuario.html';
});