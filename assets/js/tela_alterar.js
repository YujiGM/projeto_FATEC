document.addEventListener('DOMContentLoaded', function () {
    const cnpjcpfInput = document.getElementById('cnpjcpf');
    const fisicaRadio = document.getElementById('fisica');
    const juridicaRadio = document.getElementById('juridica');
    const fisicaJuridHidden = document.getElementById('fisicaJuridHidden');
    const cepInput = document.getElementById('cep');
    const telefoneInput = document.getElementById('telefone');
    const updateBtn = document.getElementById('updateBtn');
    const resetBtn = document.querySelector('.btn-danger');
    const dateInput = document.getElementById('dtAberInest');
    const tipoContainer = document.getElementById('tipoContainer');
    const cnpjcpfContainer = document.getElementById('cnpjcpfContainer');
    const params = new URLSearchParams(window.location.search);
    const idCliente = params.get('id');
    const token = sessionStorage.getItem('token');
    createConfirmationModal();

    if (!token) {
        window.location.href = 'tela_login.html'; 
        return;
    }
    function createConfirmationModal() {
        const modalHtml = `
            <div class="modal fade" id="confirmResetModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmModalLabel">Limpar Campos</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <p><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> Deseja realmente limpar o formulário?</p>
                            <p class="text-muted small">Todas as alterações não salvas serão perdidas e os dados originais serão recuperados.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não, continuar editando</button>
                            <button type="button" class="btn btn-danger" id="confirmResetBtn">Sim, limpar formulário</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('voltarBtn').addEventListener('click', function () {
            window.location.href = 'tela_listar.html';
        });

        document.getElementById('confirmResetBtn').addEventListener('click', function () {
            resetForm();
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmResetModal'));
            modal.hide();
        });
        document.getElementById('confirmResetBtn').addEventListener('click', function () {
            resetForm();
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmResetModal'));
            modal.hide();
            showSnackbar('Informações apagadas !', 'info');
        });
        
    }

    function resetForm() {
      
        buscarCliente();

       
        document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('invalid-feedback')) {
                el.nextElementSibling.style.display = 'none';
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showSnackbar(message, type = 'error') {
        const snackbar = document.getElementById('snackbar');

        snackbar.className = "";
        snackbar.classList.add(type);

        const icon = type === 'success'
            ? '<i class="bi bi-check-circle-fill"></i> '
            : '<i class="bi bi-exclamation-triangle-fill"></i> ';

        snackbar.innerHTML = icon + message;
        snackbar.classList.add("show");

        setTimeout(function () {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }

    function formatCEP(cep) {
        cep = cep.replace(/\D/g, '').substring(0, 8);
        if (cep.length > 5) {
            return cep.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        } else {
            return cep;
        }
    }

    function formatarTelefone(valor) {
        valor = valor.replace(/\D/g, '').substring(0, 11);

        if (valor.length > 10) {
            return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (valor.length > 5) {
            return valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (valor.length > 2) {
            return valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else {
            return valor;
        }
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');

            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;

                if (field.nextElementSibling && field.nextElementSibling.classList.contains('invalid-feedback')) {
                    field.nextElementSibling.textContent = 'Campo obrigatório não preenchido';
                    field.nextElementSibling.style.display = 'block';
                }
            } else {
                if (field.id === 'dtAberInest') {
                    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                    if (!regex.test(field.value)) {
                        field.classList.add('is-invalid');
                        field.nextElementSibling.textContent = 'Data inválida';
                        field.nextElementSibling.style.display = 'block';
                        isValid = false;
                        return;
                    }

                    const matches = field.value.match(regex);
                    const day = parseInt(matches[1], 10);
                    const month = parseInt(matches[2], 10);
                    const year = parseInt(matches[3], 10);

                    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
                        field.classList.add('is-invalid');
                        field.nextElementSibling.textContent = 'Data inválida';
                        field.nextElementSibling.style.display = 'block';
                        isValid = false;
                        return;
                    }
                }

                if (field.id === 'cep') {
                    const value = field.value.replace(/\D/g, '');
                    if (value.length !== 8) {
                        field.classList.add('is-invalid');
                        field.nextElementSibling.textContent = 'CEP inválido';
                        field.nextElementSibling.style.display = 'block';
                        isValid = false;
                        return;
                    }
                }

                field.classList.add('is-valid');
                if (field.nextElementSibling && field.nextElementSibling.classList.contains('invalid-feedback')) {
                    field.nextElementSibling.style.display = 'none';
                }
            }
        });

        if (!isValid) {
            showSnackbar('Por favor, corrija os campos destacados');
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }

        return isValid;
    }

    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            e.target.value = formatCEP(value);
        }
    });

    telefoneInput.addEventListener('input', function (e) {
        e.target.value = formatarTelefone(e.target.value);
    });

    dateInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += '/' + value.substring(2, 4);
        }
        if (value.length > 4) {
            formattedValue += '/' + value.substring(4, 8);
        }

        e.target.value = formattedValue;
    });

    // Função para listar dados do cliente
    async function buscarCliente() {
        const url = `http://localhost:9856/api/cliente/buscarCliente/${idCliente}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar cliente.');
            }
            const cliente = await response.json();
            document.getElementById('tipo').value = cliente.tipo || '';
            document.getElementById('nome').value = cliente.nome || '';
            document.getElementById('unidade').value = cliente.loja || cliente.unidade || '';
            document.getElementById('cep').value = cliente.cep || '';
            document.getElementById('numero').value = cliente.numero || '';
            document.getElementById('endereco').value = cliente.endereco || '';
            document.getElementById('bairro').value = cliente.bairro || '';
            document.getElementById('municipio').value = cliente.municipio || '';
            document.getElementById('estado').value = cliente.estado || '';
            document.getElementById('pais').value = cliente.pais || '';
            document.getElementById('telefone').value = cliente.telefone || '';
            document.getElementById('email').value = cliente.email || '';
            document.getElementById('cnpjcpf').value = cliente.cnpjCpf || cliente.cnpj || '';
            document.getElementById('cdMunicipio').value = cliente.codMunicipio || '';
            document.getElementById('homePage').value = cliente.homePage || '';
            document.getElementById('nFantasia').value = cliente.nomeFantasia || cliente.nome_fantasia || '';
            document.getElementById('codigo').value = cliente.codCliente || '';

           
            if (cliente.tipoPessoa === 'F') {
                document.getElementById('fisica').checked = true;
            } else if (cliente.tipoPessoa === 'J') {
                document.getElementById('juridica').checked = true;
            }

            const dataAbertura = cliente.dataAbertura;
            const partes = dataAbertura.split('-');

            if (partes.length === 3) {
                const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                document.getElementById('dtAberInest').value = dataFormatada;
            }
            document.getElementById('nome').value = cliente.nome || '';

        } catch (error) {
            console.error('Erro ao listar dados do cliente:', error);
            showSnackbar('Erro ao carregar dados do cliente.');
        }
    }

    // Chama a função buscar Cliente ao carregar a página
    window.onload = buscarCliente;

    updateBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (validateForm()) {
            async function atualizarCliente(dados) {
                const url = `http://localhost:9856/api/cliente/atualizarCliente/${idCliente}`;

                try {
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(dados)
                    });

                    const responseText = await response.text();

                    if (!response.ok) {
                        let errorMessage = responseText;
                        try {
                            const errorData = JSON.parse(responseText);
                            errorMessage = errorData.message || responseText;
                        } catch (e) {
                        }
                        throw new Error(errorMessage);
                    }

                    let result;
                    try {
                        result = responseText ? JSON.parse(responseText) : {};
                    } catch (e) {
                        result = { message: responseText };
                    }

                    console.log('Cliente atualizado com sucesso:', result);
                    showSnackbar(result.message || 'Cliente atualizado com sucesso!', 'success');
                    return result;
                } catch (error) {
                    console.error('Erro:', error);
                    showSnackbar(error.message || 'Erro ao atualizar cliente');
                    throw error;
                }
            }
            const dataAbertura = document.getElementById('dtAberInest').value;
            const partes = dataAbertura.split('/');
            const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

            const dadosCliente = {
                id: idCliente,
                tipo: document.getElementById('tipo').value,
                nome: document.getElementById('nome').value,
                loja: document.getElementById('unidade').value,
                cep: document.getElementById('cep').value,
                numero: document.getElementById('numero').value,
                endereco: document.getElementById('endereco').value,
                bairro: document.getElementById('bairro').value,
                municipio: document.getElementById('municipio').value,
                estado: document.getElementById('estado').value,
                pais: document.getElementById('pais').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                cnpjCpf: document.getElementById('cnpjcpf').value,
                codMunicipio: document.getElementById('cdMunicipio').value,
                homePage: document.getElementById('homePage').value,
                tipoPessoa: document.querySelector('input[name="fisicaJurid"]:checked').value,
                nomeFantasia: document.getElementById('nFantasia').value,
                codCliente: document.getElementById('codigo').value,
                cnpj: document.getElementById('cnpjcpf').value,
                razao_social: document.getElementById('nome').value,
                nome_fantasia: document.getElementById('nFantasia').value,
                dataAbertura: dataFormatada
            };

            atualizarCliente(dadosCliente)
                .then(() => {
                })
                .catch(() => {
                });
        }
    });

    resetBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const resetModal = new bootstrap.Modal(document.getElementById('confirmResetModal'));
        resetModal.show();
    });
});