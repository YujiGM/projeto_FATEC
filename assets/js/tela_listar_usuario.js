document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPageUser = 15;
    let currentPageUser = 1;
    let totalPagesUser = 1;
    let allUsers = [];
    const token = sessionStorage.getItem('token');

    // Redireciona para o login se não houver token
    if (!token) {
        window.location.href = 'tela_login.html';
        return;
    }

    // Função para renderizar a tabela com os usuários
    function renderUserTable(usuarios) {
        const tabela = document.getElementById('usuariosTabela');
        tabela.innerHTML = '';

        if (!usuarios || usuarios.length === 0) {
            const linha = tabela.insertRow();
            const celula = linha.insertCell();
            celula.colSpan = 4;
            celula.textContent = 'Nenhum usuário encontrado.';
            celula.style.textAlign = 'center';
            return;
        }

        usuarios.forEach(usuario => {
            const linha = tabela.insertRow();
            const isAdmin = usuario.nome === "admin";
            let actionsHtml;
            if (isAdmin) {
                actionsHtml = `
                <a href="#" class="action-btn edit admin-action-disabled" title="Editar (Usuário padrão não pode ser alterado)">
                    <i class="bi bi-pencil-square"></i>
                </a>
                <a href="#" class="action-btn delete user-delete-btn admin-action-disabled" title="Excluir (Usuário padrão não pode ser excluído)" data-id="${usuario.id}" data-nome="${usuario.nome}">
                    <i class="bi bi-trash"></i>
                </a>
            `;
            } else {
                actionsHtml = `
                <a href="tela_alterar_usuario.html?id=${usuario.id}" class="action-btn edit" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </a>
                <a href="#" class="action-btn delete user-delete-btn" title="Excluir" data-id="${usuario.id}" data-nome="${usuario.nome}">
                    <i class="bi bi-trash"></i>
                </a>
            `;
            }
            linha.innerHTML = `
            <td>${usuario.id || ''}</td>
            <td>${usuario.nome || ''} ${isAdmin ? '<span class="badge bg-secondary ms-2">Padrão</span>' : ''}</td>
            <td>${usuario.email || ''}</td>
            <td class="actions">
                ${actionsHtml}
            </td>
        `;
        });
        setupUserDeleteButtons();
    }

    document.getElementById('voltarBtn').addEventListener('click', function () {
        window.location.href = 'tela_listar.html';
    });

    // Função para buscar usuários na API
    async function buscarUsuarios(termo = '') {
        try {
            let url = 'http://localhost:9856/api/usuarios/listarUsuario';
            if (termo) {

                url = `http://localhost:9856/api/usuarios/pesquisar?termo=${encodeURIComponent(termo)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                showSnackbarUser('Sessão expirada. Faça login novamente.');
                localStorage.removeItem('token');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const usuarios = await response.json();
            allUsers = Array.isArray(usuarios) ? usuarios : (usuarios.content || []);

            totalPagesUser = Math.ceil(allUsers.length / itemsPerPageUser);
            currentPageUser = 1; 
            showUserPage(currentPageUser);


        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            showSnackbarUser(error.message || 'Erro ao buscar usuários');
            allUsers = [];
            renderUserTable([]);
            updateUserPagination(1);
        }
    }


    function showUserPage(page) {
        currentPageUser = page;
        const start = (page - 1) * itemsPerPageUser;
        const end = start + itemsPerPageUser;
        const usersToShow = allUsers.slice(start, end);

        renderUserTable(usersToShow);
        updateUserPagination(page);
    }


    function updateUserPagination(page) {
        const pagination = document.getElementById('userPagination');
        pagination.innerHTML = '';

        if (totalPagesUser === 0) return;

        const prevBtn = document.createElement('li');
        prevBtn.className = `page-item ${page === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="${page === 1}"><i class="bi bi-chevron-left"></i></a>`;
        if (page !== 1) {
            prevBtn.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); showUserPage(page - 1); });
        }
        pagination.appendChild(prevBtn);

        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPagesUser, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages && totalPagesUser >= maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        } else if (totalPagesUser < maxVisiblePages) {
            startPage = 1;
            endPage = totalPagesUser;
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === page ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); showUserPage(i); });
            pagination.appendChild(pageItem);
        }

        const nextBtn = document.createElement('li');
        nextBtn.className = `page-item ${page === totalPagesUser ? 'disabled' : ''}`;
        nextBtn.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="${page === totalPagesUser}"><i class="bi bi-chevron-right"></i></a>`;
        if (page !== totalPagesUser) {
            nextBtn.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); showUserPage(page + 1); });
        }
        pagination.appendChild(nextBtn);
    }

    // Configura os botões de delete de usuários

    function setupUserDeleteButtons() {
        document.querySelectorAll('.action-btn.delete.user-delete-btn').forEach(function (originalBtn) {

            const clonedBtn = originalBtn.cloneNode(true);
            originalBtn.parentNode.replaceChild(clonedBtn, originalBtn);

            if (clonedBtn.classList.contains('admin-action-disabled')) {

                clonedBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    showSnackbarUser('O usuário padrão "admin" não pode ser excluído.', false);
                });
            } else {

                clonedBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const userId = this.getAttribute('data-id');
                    const userNome = this.getAttribute('data-nome');

                    document.getElementById('deleteModalUserInfo').textContent = `Usuário: ${userId} : ${userNome || 'N/A'}`;
                    usuarioParaExcluir = userId;
                    deleteUserModal.show();
                });
            }
        });
    }


    const userModalHTML = `
    <div class="modal fade" id="deleteUserConfirmModal" tabindex="-1" aria-labelledby="deleteUserConfirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteUserConfirmModalLabel">Confirmar Exclusão de Usuário</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <p>Tem certeza que deseja excluir este usuário?</p>
                    <p class="user-info" id="deleteModalUserInfo">Usuário</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmUserDeleteBtn">Excluir</button>
                </div>
            </div>
        </div>
    </div>
    `;

    if (!document.getElementById('deleteUserConfirmModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = userModalHTML;
        document.body.appendChild(modalDiv.firstElementChild);
    }

    const deleteUserModalElement = document.getElementById('deleteUserConfirmModal');
    const deleteUserModal = new bootstrap.Modal(deleteUserModalElement);
    let usuarioParaExcluir = null;

    // Função para mostrar mensagens (snackbarUser)
    function showSnackbarUser(message, isSuccess = false) {
        const snackbar = document.getElementById('snackbarUser');
        snackbar.textContent = message;
        snackbar.className = 'show';
        if (isSuccess) {
            snackbar.classList.add('success');
        } else {
            snackbar.classList.remove('success');
        }

        setTimeout(function () {
            snackbar.className = snackbar.className.replace('show', '');
        }, 3000);
    }


    let debounceUserTimer;
    const searchUserInput = document.getElementById('searchUserInput');
    if (searchUserInput) {
        searchUserInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.trim();
            clearTimeout(debounceUserTimer);
            debounceUserTimer = setTimeout(() => {
                currentPageUser = 1;
                buscarUsuarios(searchTerm);
            }, 300);
        });

        searchUserInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.trim();
                clearTimeout(debounceUserTimer);
                currentPageUser = 1;
                buscarUsuarios(searchTerm);
            }
        });
    }



    const refreshUserListBtn = document.getElementById('refreshUserListBtn');
    if (refreshUserListBtn) {
        refreshUserListBtn.addEventListener('click', function () {
            if (searchUserInput) searchUserInput.value = '';
            currentPageUser = 1;
            buscarUsuarios();
            showSnackbarUser('Lista de usuários atualizada!', true);
        });
    }


    const addNewUserBtn = document.getElementById('addNewUserBtn');
    if (addNewUserBtn) {
        addNewUserBtn.addEventListener('click', function () {
            window.location.href = 'tela_cadastrar_usuario.html';
        });
    }


    const logoutBtnUser = document.getElementById('logoutBtnUser');
    if (logoutBtnUser) {
        logoutBtnUser.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            showSnackbarUser('Logout realizado com sucesso!', true);
            setTimeout(() => {
                window.location.href = 'tela_login.html';
            }, 1500);
        });
    }



    const confirmUserDeleteBtn = document.getElementById('confirmUserDeleteBtn');
    if (confirmUserDeleteBtn) {
        confirmUserDeleteBtn.addEventListener('click', async function () {
            if (usuarioParaExcluir) {
                try {

                    const response = await fetch(`http://localhost:9856/api/usuarios/deletarUsuario/${usuarioParaExcluir}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        if (response.status === 401 || response.status === 403) {
                            showSnackbarUser('Sessão expirada ou não autorizada.');
                            localStorage.removeItem('token');
                            setTimeout(() => window.location.href = 'index.html', 2000);
                            return;
                        }
                        const errorData = await response.json().catch(() => ({ message: 'Erro ao excluir usuário.' }));
                        throw new Error(errorData.message || 'Erro ao excluir usuário');
                    }

                    deleteUserModal.hide();
                    showSnackbarUser('Usuário excluído com sucesso!', true);

                    const remainingUsersOnPage = allUsers.slice((currentPageUser - 1) * itemsPerPageUser, currentPageUser * itemsPerPageUser).length - 1;
                    if (remainingUsersOnPage === 0 && currentPageUser > 1) {
                        currentPageUser--;
                    }
                    buscarUsuarios(searchUserInput ? searchUserInput.value.trim() : '');
                } catch (error) {
                    console.error('Erro ao excluir usuário:', error);
                    showSnackbarUser(error.message || 'Erro ao excluir usuário');
                    deleteUserModal.hide();
                }
            }
        });
    }

    buscarUsuarios();
});