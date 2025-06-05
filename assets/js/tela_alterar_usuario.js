document.addEventListener('DOMContentLoaded', function () {

    const usuarioIdInput = document.getElementById('usuarioId');
    const usuarioNomeInput = document.getElementById('usuarioNome');
    const usuarioEmailInput = document.getElementById('usuarioEmail');
    const usuarioNovaSenhaInput = document.getElementById('usuarioNovaSenha');
    const usuarioConfirmaSenhaInput = document.getElementById('usuarioConfirmaSenha');
    const salvarBtn = document.getElementById('salvarAlteracaoUsuarioBtn');
    const cancelarBtn = document.getElementById('cancelarAlteracaoUsuarioBtn');
    const voltarListaBtn = document.getElementById('voltarListaUsuariosBtn');
    const alterarUsuarioForm = document.getElementById('alterarUsuarioForm');
    const snackbar = document.getElementById('snackbarUsuarioAlterar');

    const params = new URLSearchParams(window.location.search);
    const idUsuario = params.get('id');
    const token = sessionStorage.getItem('token');

    const NOME_USUARIO_ADMIN = "admin";

    // BLOQUEAR CAMPO ID 
    if (usuarioIdInput) {
        usuarioIdInput.disabled = true;
        usuarioIdInput.readOnly = true;
        usuarioIdInput.style.backgroundColor = '#f8f9fa';
        usuarioIdInput.style.cursor = 'not-allowed';
        usuarioIdInput.title = 'ID não pode ser alterado';
    }

    if (!token) {
        window.location.href = 'tela_login.html';
        return;
    }
    if (!idUsuario) {
        showSnackbarUsuario('ID do usuário não fornecido.');
        voltarParaLista();
        return;
    }


    function createCancelConfirmationModal() {
        const modalHtml = `
            <div class="modal fade" id="confirmCancelUsuarioModal" tabindex="-1" aria-labelledby="confirmCancelUsuarioModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmCancelUsuarioModalLabel">Descartar Alterações</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <p><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Deseja realmente descartar as alterações?</p>
                            <p class="text-muted small">Todas as modificações não salvas serão perdidas e os dados originais do usuário serão recarregados.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não, continuar editando</button>
                            <button type="button" class="btn btn-warning" id="confirmCancelUsuarioBtn">Sim, descartar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const confirmCancelBtn = document.getElementById('confirmCancelUsuarioBtn');
        if (confirmCancelBtn) {
            confirmCancelBtn.addEventListener('click', function () {
                buscarUsuario();
                limparValidacoes();
                limparCamposSenha();
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmCancelUsuarioModal'));
                if (modal) {
                    modal.hide();
                }
                showSnackbarUsuario('Alterações descartadas. Dados originais restaurados.', 'info');
            });
        }
    }
    createCancelConfirmationModal();
    

    function showSnackbarUsuario(message, type = 'error') {
        if (!snackbar) return;
        snackbar.className = "";
        snackbar.classList.add(type === 'success' ? 'success' : (type === 'info' ? 'info' : 'error'));

        const icon = type === 'success'
            ? '<i class="bi bi-check-circle-fill"></i> '
            : (type === 'info' ? '<i class="bi bi-info-circle-fill"></i> ' : '<i class="bi bi-exclamation-triangle-fill"></i> ');

        snackbar.innerHTML = icon + message;
        snackbar.classList.add("show");

        setTimeout(function () {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }

    function limparCamposSenha() {

        if (usuarioNovaSenhaInput) usuarioNovaSenhaInput.value = '';
        if (usuarioConfirmaSenhaInput) usuarioConfirmaSenhaInput.value = '';
    }

    function limparValidacoes() {
        document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
            const feedbackEl = el.nextElementSibling;
            if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
                feedbackEl.textContent = '';
                feedbackEl.style.display = 'none';
            }
        });
    }

    function voltarParaLista() {
        window.location.href = 'tela_listar_usuario.html';
    }

    // --- BUSCAR DADOS DO USUÁRIO ---
    async function buscarUsuario() {
        const url = `http://localhost:9856/api/usuarios/buscarUsuario/${idUsuario}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401 || response.status === 403) {
                showSnackbarUsuario('Sessão expirada ou não autorizada. Faça login novamente.');
                sessionStorage.removeItem('token');
                setTimeout(() => window.location.href = 'tela_login.html', 2000);
                return;
            }
            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao buscar dados do usuário.`);
            }
            const usuario = await response.json();


            if (usuarioIdInput) {
                usuarioIdInput.value = usuario.id || '';

                usuarioIdInput.disabled = true;
                usuarioIdInput.readOnly = true;
            }
            if (usuarioNomeInput) usuarioNomeInput.value = usuario.nome || '';
            if (usuarioEmailInput) usuarioEmailInput.value = usuario.email || '';

            limparCamposSenha();

        
            if (usuario.nome === NOME_USUARIO_ADMIN) {
                showSnackbarUsuario('O usuário "admin" não pode ser alterado através desta interface.', 'info');
                if (usuarioNomeInput) usuarioNomeInput.disabled = true;
                if (usuarioEmailInput) usuarioEmailInput.disabled = true;
                if (usuarioNovaSenhaInput) usuarioNovaSenhaInput.disabled = true;
                if (usuarioConfirmaSenhaInput) usuarioConfirmaSenhaInput.disabled = true;
                if (salvarBtn) salvarBtn.disabled = true;
                if (salvarBtn) salvarBtn.title = "Usuário admin não pode ser alterado";
            } else {
               
                if (usuarioNomeInput) usuarioNomeInput.disabled = false;
                if (usuarioEmailInput) usuarioEmailInput.disabled = false;
                if (usuarioNovaSenhaInput) usuarioNovaSenhaInput.disabled = false;
                if (usuarioConfirmaSenhaInput) usuarioConfirmaSenhaInput.disabled = false;
                if (salvarBtn) salvarBtn.disabled = false;
                if (salvarBtn) salvarBtn.title = "Salvar Alterações";
            }
            limparValidacoes();

        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            showSnackbarUsuario(error.message || 'Erro ao carregar dados do usuário.');
            if (salvarBtn) salvarBtn.disabled = true;
        }
    }

    // --- VALIDAÇÃO DO FORMULÁRIO ---
    function validateFormUsuario() {
        limparValidacoes();
        let isValid = true;

        // Validar Nome
        if (!usuarioNomeInput.value.trim()) {
            usuarioNomeInput.classList.add('is-invalid');
            usuarioNomeInput.nextElementSibling.textContent = 'Por favor, informe o nome.';
            usuarioNomeInput.nextElementSibling.style.display = 'block';
            isValid = false;
        } else {
            usuarioNomeInput.classList.add('is-valid');
        }

        // Validar Email
        if (!usuarioEmailInput.value.trim()) {
            usuarioEmailInput.classList.add('is-invalid');
            usuarioEmailInput.nextElementSibling.textContent = 'Por favor, informe o e-mail.';
            usuarioEmailInput.nextElementSibling.style.display = 'block';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(usuarioEmailInput.value.trim())) {
            usuarioEmailInput.classList.add('is-invalid');
            usuarioEmailInput.nextElementSibling.textContent = 'Por favor, informe um e-mail válido.';
            usuarioEmailInput.nextElementSibling.style.display = 'block';
            isValid = false;
        } else {
            usuarioEmailInput.classList.add('is-valid');
        }


        const novaSenha = usuarioNovaSenhaInput.value;
        const confirmaSenha = usuarioConfirmaSenhaInput.value;


        if (novaSenha || confirmaSenha) {
            let novaSenhaValidaParaConfirmacao = true;


            if (!novaSenha) {
                usuarioNovaSenhaInput.classList.add('is-invalid');
                usuarioNovaSenhaInput.nextElementSibling.textContent = 'Por favor, informe a nova senha.';
                usuarioNovaSenhaInput.nextElementSibling.style.display = 'block';
                isValid = false;
                novaSenhaValidaParaConfirmacao = false;
            } else if (novaSenha.length < 6) {
                usuarioNovaSenhaInput.classList.add('is-invalid');
                usuarioNovaSenhaInput.nextElementSibling.textContent = 'A senha deve ter no mínimo 6 caracteres.';
                usuarioNovaSenhaInput.nextElementSibling.style.display = 'block';
                isValid = false;
                novaSenhaValidaParaConfirmacao = false;
            } else {
                usuarioNovaSenhaInput.classList.add('is-valid');
            }


            if (!confirmaSenha) {
                usuarioConfirmaSenhaInput.classList.add('is-invalid');
                usuarioConfirmaSenhaInput.nextElementSibling.textContent = 'Por favor, confirme a nova senha.';
                usuarioConfirmaSenhaInput.nextElementSibling.style.display = 'block';
                isValid = false;
            } else if (novaSenha !== confirmaSenha) {
                usuarioConfirmaSenhaInput.classList.add('is-invalid');
                usuarioConfirmaSenhaInput.nextElementSibling.textContent = 'As senhas não coincidem.';
                usuarioConfirmaSenhaInput.nextElementSibling.style.display = 'block';
                isValid = false;
            } else {
                if (novaSenhaValidaParaConfirmacao) {
                    usuarioConfirmaSenhaInput.classList.add('is-valid');
                } else {
                    usuarioConfirmaSenhaInput.classList.add('is-invalid');
                    if (!usuarioConfirmaSenhaInput.nextElementSibling.textContent) {
                        usuarioConfirmaSenhaInput.nextElementSibling.textContent = 'Corrija a nova senha primeiro.';
                        usuarioConfirmaSenhaInput.nextElementSibling.style.display = 'block';
                    }
                }
            }
        }

        if (!isValid) {
            showSnackbarUsuario('Por favor, corrija os campos destacados.');
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
        return isValid;
    }


    async function submeterAtualizacaoUsuario() {
        if (!validateFormUsuario()) {
            return;
        }


        const dadosUsuario = {
            id: idUsuario,
            nome: usuarioNomeInput.value.trim(),
            email: usuarioEmailInput.value.trim()
        };



        if (usuarioNovaSenhaInput.value &&
            usuarioNovaSenhaInput.value === usuarioConfirmaSenhaInput.value &&
            usuarioNovaSenhaInput.value.length >= 6) {


            dadosUsuario.senha = usuarioNovaSenhaInput.value;
        }
        const url = `http://localhost:9856/api/usuarios/atualizarUsuario/${idUsuario}`;

        try {

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosUsuario)
            });

            const responseText = await response.text();

            if (response.status === 401 || response.status === 403) {
                showSnackbarUsuario('Sessão expirada ou não autorizada. Faça login novamente.');
                sessionStorage.removeItem('token');
                setTimeout(() => window.location.href = 'tela_login.html', 2000);
                return;
            }

            if (!response.ok) {
                let errorMessage = `Erro ${response.status} ao atualizar usuário.`;
                if (responseText) {
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorData.error || responseText;
                    } catch (e) {
                        errorMessage = responseText;
                    }
                }
                throw new Error(errorMessage);
            }

            let resultMessage = "Usuário atualizado com sucesso!";
            if (responseText) {
                try {
                    const jsonData = JSON.parse(responseText);
                    resultMessage = jsonData.message || resultMessage;
                } catch (e) {
                    if (response.ok && responseText.length < 100) {
                        resultMessage = responseText;
                    }
                }
            }

            showSnackbarUsuario(resultMessage, 'success');

          
            limparCamposSenha();
            limparValidacoes();
            usuarioNomeInput.classList.remove('is-valid');
            usuarioEmailInput.classList.remove('is-valid');

            console.log('Usuário atualizado com sucesso!');
            setTimeout(() => {
                voltarParaLista();
            }, 1200);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            showSnackbarUsuario(error.message || 'Erro desconhecido ao atualizar usuário.');
        }
    }


    if (alterarUsuarioForm) {
        alterarUsuarioForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submeterAtualizacaoUsuario();
        });
    }

    if (voltarListaBtn) {
        voltarListaBtn.addEventListener('click', function () {
            voltarParaLista();
        });
    }

    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const cancelModal = bootstrap.Modal.getInstance(document.getElementById('confirmCancelUsuarioModal')) ||
                new bootstrap.Modal(document.getElementById('confirmCancelUsuarioModal'));
            cancelModal.show();
        });
    }


    if (usuarioIdInput) {
        usuarioIdInput.addEventListener('keydown', function (e) {
            e.preventDefault();
            showSnackbarUsuario('O ID não pode ser alterado.', 'info');
        });

        usuarioIdInput.addEventListener('paste', function (e) {
            e.preventDefault();
            showSnackbarUsuario('O ID não pode ser alterado.', 'info');
        });

        usuarioIdInput.addEventListener('input', function (e) {
            e.preventDefault();

            if (idUsuario) usuarioIdInput.value = idUsuario;
        });
    }


    buscarUsuario();
});