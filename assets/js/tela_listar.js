document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 15;
    let currentPage = 1;
    let totalPages = 1;
    let allClients = [];
    let token = sessionStorage.getItem('token');
    const userEmail = sessionStorage.getItem('email');
    const userName = sessionStorage.getItem('nome');

    if (!token) {
        window.location.href = 'tela_login.html';
        return;
    }

    function renderTable(clientes) {
        const tabela = document.getElementById('clientesTabela');
        tabela.innerHTML = '';

        if (!clientes || clientes.length === 0) {
            const linha = tabela.insertRow();
            const celula = linha.insertCell();
            celula.colSpan = 10;
            celula.textContent = 'Nenhum cliente encontrado.';
            celula.style.textAlign = 'center';
            return;
        }

        clientes.forEach(cliente => {
            const linha = tabela.insertRow();
            linha.innerHTML = `
                <td>${cliente.codCliente || ''}</td>
                <td>${cliente.tipoPessoa || ''}</td>
                <td>${cliente.tipo || 'N/A'}</td>
                <td>${cliente.cnpjCpf || ''}</td>
                <td>${cliente.nome || ''}</td>
                <td>${cliente.nomeFantasia || ''}</td>
                <td>${cliente.loja || ''}</td>
                <td>${cliente.municipio || ''}</td>
                <td>${cliente.estado || ''}</td>
                <td class="actions">
                    <a href="tela_alterar.html?id=${cliente.id}" class="action-btn edit" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </a>
                    <a href="#" class="action-btn delete" title="Excluir" data-id="${cliente.id}" data-cod="${cliente.codCliente}" data-nome="${cliente.nome}">
                        <i class="bi bi-trash"></i>
                    </a>
                </td>
            `;
        });
        setupDeleteButtons();
    }

    async function buscarClientes(termo = '') {
        try {
            let url = 'http://localhost:9856/api/cliente/listarClientes';
            if (termo) {
                url = `http://localhost:9856/api/cliente/pesquisar?termo=${encodeURIComponent(termo)}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401 || response.status === 403) {
                showSnackbar('Sessão expirada. Faça login novamente.');
                sessionStorage.clear();
                setTimeout(() => window.location.href = 'tela_login.html', 2000);
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            const clientes = await response.json();
            allClients = clientes;
            totalPages = Math.ceil(allClients.length / itemsPerPage);
            currentPage = 1;
            showPage(currentPage);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            showSnackbar(error.message || 'Erro ao buscar clientes');
            allClients = [];
            renderTable([]);
            updatePagination(1);
        }
    }

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const clientsToShow = allClients.slice(start, end);
        renderTable(clientsToShow);
        updatePagination(page);
    }

    function updatePagination(page) {
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';
        if (totalPages === 0) return;

        const prevBtn = document.createElement('li');
        prevBtn.className = `page-item ${page === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="${page === 1}"><i class="bi bi-chevron-left"></i></a>`;
        if (page !== 1) {
            prevBtn.querySelector('a').addEventListener('click', function (e) {
                e.preventDefault(); showPage(page - 1);
            });
        }
        pagination.appendChild(prevBtn);

        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages && totalPages >= maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        } else if (totalPages < maxVisiblePages) {
            startPage = 1; endPage = totalPages;
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === page ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.querySelector('a').addEventListener('click', function (e) {
                e.preventDefault(); showPage(i);
            });
            pagination.appendChild(pageItem);
        }

        const nextBtn = document.createElement('li');
        nextBtn.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="${page === totalPages}"><i class="bi bi-chevron-right"></i></a>`;
        if (page !== totalPages) {
            nextBtn.querySelector('a').addEventListener('click', function (e) {
                e.preventDefault(); showPage(page + 1);
            });
        }
        pagination.appendChild(nextBtn);
    }

    function setupDeleteButtons() {
        document.querySelectorAll('.action-btn.delete').forEach(function (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const clientId = this.getAttribute('data-id');
                const clientCod = this.getAttribute('data-cod');
                const clientNome = this.getAttribute('data-nome');
                document.getElementById('deleteModalInfo').textContent = `Cliente: ${clientCod || 'N/A'} : ${clientNome || 'N/A'}`;
                clienteParaExcluir = clientId;
                deleteModal.show();
            });
        });
    }

    const modalHTML = `
    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
        <div class="modal-dialog"><div class="modal-content"><div class="modal-header">
                    <h5 class="modal-title" id="deleteConfirmModalLabel">Confirmar Exclusão</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div><div class="modal-body">
                    <p>Tem certeza que deseja excluir este item?</p>
                    <p class="cliente-info" id="deleteModalInfo">Cliente</p>
                </div><div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>
                </div></div></div></div>`;
    if (!document.getElementById('deleteConfirmModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv.firstElementChild);
    }
    const deleteModalElement = document.getElementById('deleteConfirmModal');
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    let clienteParaExcluir = null;


    let fiscalExistente = null;

    function showSnackbar(message, isSuccess = false) {
        const snackbar = document.getElementById('snackbar');
        snackbar.textContent = message;
        snackbar.className = 'show';
        if (isSuccess) snackbar.classList.add('success');
        else snackbar.classList.remove('success');
        setTimeout(function () {
            snackbar.className = snackbar.className.replace('show', '');
        }, 3000);
    }

    function setInputValidity(inputElement, isValid, message = '') {
        inputElement.classList.remove('is-valid', 'is-invalid');
        const feedbackElement = inputElement.nextElementSibling;
        if (isValid) {
            inputElement.classList.add('is-valid');
            if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.textContent = '';
            }
        } else {
            inputElement.classList.add('is-invalid');
            if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.textContent = message;
            }
        }
    }


    async function buscarFiscalExistente() {
        try {
            const response = await fetch('http://localhost:9856/api/fiscal/listarFiscais', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                showSnackbar('Sessão expirada. Faça login novamente.');
                sessionStorage.clear();
                setTimeout(() => window.location.href = 'tela_login.html', 2000);
                return null;
            }

            if (!response.ok) {
                console.error('Erro ao buscar fiscal:', response.statusText);
                return null;
            }

            const fiscais = await response.json();

            if (fiscais && fiscais.length > 0) {
                return fiscais[0];
            }

            return null;
        } catch (error) {
            console.error('Erro ao buscar fiscal:', error);
            return null;
        }
    }

    function atualizarModalFiscal(fiscal) {
        const modalTitle = document.getElementById('emailFiscalModalLabel');
        const confirmEmailDiv = fiscalEmailConfirmInput.parentElement;

        if (fiscal) {

            fiscalExistente = fiscal;
            modalTitle.textContent = 'Alterar E-mail do Fiscal';
            fiscalEmailInput.value = fiscal.email || '';


            confirmEmailDiv.style.display = 'none';


            fiscalEmailInput.classList.remove('is-valid', 'is-invalid');
        } else {

            fiscalExistente = null;
            modalTitle.textContent = 'Configurar E-mail do Fiscal';
            fiscalEmailInput.value = '';
            fiscalEmailConfirmInput.value = '';


            confirmEmailDiv.style.display = 'block';


            fiscalEmailInput.classList.remove('is-valid', 'is-invalid');
            fiscalEmailConfirmInput.classList.remove('is-valid', 'is-invalid');
        }
    }

    const emailFiscalModalHTML = `
    <div class="modal fade" id="emailFiscalModal" tabindex="-1" aria-labelledby="emailFiscalModalLabel" aria-hidden="true">
        <div class="modal-dialog"><div class="modal-content"><div class="modal-header">
                    <h5 class="modal-title" id="emailFiscalModalLabel">Configurar E-mail do Fiscal</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div><div class="modal-body">
                    <form id="formEmailFiscal" novalidate>
                        <div class="mb-3">
                            <label for="fiscalEmailInput" class="form-label">E-mail do Fiscal</label>
                            <input type="email" class="form-control" id="fiscalEmailInput" required>
                            <div class="invalid-feedback">Forneça um e-mail válido.</div>
                        </div>
                        <div class="mb-3">
                            <label for="fiscalEmailConfirmInput" class="form-label">Confirmar E-mail do Fiscal</label>
                            <input type="email" class="form-control" id="fiscalEmailConfirmInput" required>
                            <div class="invalid-feedback">Os e-mails não coincidem ou são inválidos.</div>
                        </div>
                    </form>
                </div><div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="salvarEmailFiscalBtn">Salvar</button>
                </div></div></div></div>`;
    if (!document.getElementById('emailFiscalModal')) {
        const modalFiscalDiv = document.createElement('div');
        modalFiscalDiv.innerHTML = emailFiscalModalHTML;
        document.body.appendChild(modalFiscalDiv.firstElementChild);
    }
    const emailFiscalModalElement = document.getElementById('emailFiscalModal');
    const emailFiscalModal = new bootstrap.Modal(emailFiscalModalElement);
    const fiscalEmailInput = document.getElementById('fiscalEmailInput');
    const fiscalEmailConfirmInput = document.getElementById('fiscalEmailConfirmInput');
    const salvarEmailFiscalBtn = document.getElementById('salvarEmailFiscalBtn');


    if (salvarEmailFiscalBtn) {
        salvarEmailFiscalBtn.addEventListener('click', async function () {
            const email = fiscalEmailInput.value.trim();
            let isValid = true;


            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                setInputValidity(fiscalEmailInput, false, 'Forneça um e-mail válido.');
                isValid = false;
            } else {
                setInputValidity(fiscalEmailInput, true);
            }


            if (!fiscalExistente) {
                const confirmEmail = fiscalEmailConfirmInput.value.trim();

                if (!confirmEmail || !/^\S+@\S+\.\S+$/.test(confirmEmail)) {
                    setInputValidity(fiscalEmailConfirmInput, false, 'Confirme com um e-mail válido.');
                    isValid = false;
                } else if (email !== confirmEmail) {
                    setInputValidity(fiscalEmailConfirmInput, false, 'Os e-mails não coincidem.');
                    isValid = false;
                } else {
                    setInputValidity(fiscalEmailConfirmInput, true);
                }
            }

            if (isValid) {
                try {

                    salvarEmailFiscalBtn.disabled = true;
                    salvarEmailFiscalBtn.textContent = fiscalExistente ? 'Alterando...' : 'Salvando...';

                    let response;

                    if (fiscalExistente) {

                        response = await fetch(`http://localhost:9856/api/fiscal/atualizarFiscal/${fiscalExistente.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                email: email
                            })
                        });
                    } else {

                        response = await fetch('http://localhost:9856/api/fiscal/criarFiscal', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                email: email
                            })
                        });
                    }

                    if (response.status === 401 || response.status === 403) {
                        showSnackbar('Sessão expirada. Faça login novamente.');
                        sessionStorage.clear();
                        setTimeout(() => window.location.href = 'tela_login.html', 2000);
                        return;
                    }

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Erro ao salvar e-mail do fiscal');
                    }


                    const mensagem = fiscalExistente ?
                        "E-mail do fiscal alterado com sucesso!" :
                        "E-mail do fiscal configurado com sucesso!";

                    showSnackbar(mensagem, true);
                    emailFiscalModal.hide();


                    fiscalEmailInput.value = '';
                    fiscalEmailConfirmInput.value = '';


                    fiscalEmailInput.classList.remove('is-valid', 'is-invalid');
                    fiscalEmailConfirmInput.classList.remove('is-valid', 'is-invalid');

                } catch (error) {
                    console.error('Erro ao salvar e-mail do fiscal:', error);
                    showSnackbar(error.message || 'Erro ao salvar e-mail do fiscal');
                } finally {

                    salvarEmailFiscalBtn.disabled = false;
                    salvarEmailFiscalBtn.textContent = 'Salvar';
                }
            }
        });
    }

    const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="configuracoesDropdownBtn"]');
    if (dropdownMenu) {
        const fiscalEmailLi = document.createElement('li');
        fiscalEmailLi.innerHTML = `<a class="dropdown-item" href="#" id="configEmailFiscalBtn"><i class="bi bi-envelope-at-fill"></i> E-mail do Fiscal</a>`;
        const logoutLi = Array.from(dropdownMenu.children).find(li => li.querySelector('#logoutBtn'));

        if (logoutLi) {
            const hrElement = Array.from(dropdownMenu.children).find(child => child.tagName === 'HR' && child.nextElementSibling === logoutLi);
            if (hrElement) dropdownMenu.insertBefore(fiscalEmailLi, hrElement);
            else dropdownMenu.insertBefore(fiscalEmailLi, logoutLi);
        } else {
            dropdownMenu.appendChild(fiscalEmailLi);
        }

        const configEmailFiscalBtn = document.getElementById('configEmailFiscalBtn');
        if (configEmailFiscalBtn) {
            configEmailFiscalBtn.addEventListener('click', async function (e) {
                e.preventDefault();


                const fiscal = await buscarFiscalExistente();
                atualizarModalFiscal(fiscal);

                emailFiscalModal.show();
            });
        }
    }

    const listarUsuariosBtn = document.getElementById('listarUsuariosBtn');
    if (listarUsuariosBtn) {
        if (!(userEmail === 'admin@email.com' && userName === 'admin')) {
            const listItem = listarUsuariosBtn.parentElement;
            if (listItem) {
                listarUsuariosBtn.classList.add('disabled');
                listarUsuariosBtn.setAttribute('aria-disabled', 'true');
                listarUsuariosBtn.removeAttribute('href');
                listarUsuariosBtn.style.pointerEvents = 'none';
                listarUsuariosBtn.setAttribute('title', 'Acesso restrito.');
            }
        }
    }

    let debounceTimer;
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.trim();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentPage = 1;
                buscarClientes(searchTerm);
            }, 300);
        });
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.trim();
                clearTimeout(debounceTimer);
                currentPage = 1;
                buscarClientes(searchTerm);
            }
        });
    }

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            currentPage = 1;
            buscarClientes();
            showSnackbar('Lista atualizada!', true);
        });
    }

    const newClientBtn = document.getElementById('newClientBtn');
    if (newClientBtn) {
        newClientBtn.addEventListener('click', function () {
            window.location.href = 'tela_cadastrar.html';
        });
    }

    const newUserBtn = document.getElementById('newUserBtn');
    if (newUserBtn) {
        newUserBtn.addEventListener('click', function () {
            window.location.href = 'tela_cadastrar_usuario.html';
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            sessionStorage.clear();
            localStorage.clear();
            token = null;
            showSnackbar('Logout realizado com sucesso!', true);
            setTimeout(() => {
                window.location.href = 'tela_login.html';
            }, 1500);
        });
    }

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function () {
            if (clienteParaExcluir) {
                try {
                    const response = await fetch(`http://localhost:9856/api/cliente/deletarCliente/${clienteParaExcluir}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        if (response.status === 401 || response.status === 403) {
                            showSnackbar('Sessão expirada ou não autorizada.');
                            sessionStorage.clear();
                            setTimeout(() => window.location.href = 'tela_login.html', 2000);
                            return;
                        }
                        const errorData = await response.json().catch(() => ({ message: 'Erro ao excluir cliente.' }));
                        throw new Error(errorData.message || 'Erro ao excluir cliente');
                    }
                    deleteModal.hide();
                    showSnackbar('Cliente excluído com sucesso!', true);
                    const searchTerm = searchInput ? searchInput.value.trim() : '';
                    await buscarClientes(searchTerm);
                    const newTotalPages = Math.ceil(allClients.length / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        currentPage = newTotalPages;
                    } else if (newTotalPages === 0) {
                        currentPage = 1;
                    }
                    showPage(currentPage);

                } catch (error) {
                    console.error('Erro ao excluir cliente:', error);
                    showSnackbar(error.message || 'Erro ao excluir cliente');
                    deleteModal.hide();
                }
            }
        });
    }
    buscarClientes();
});