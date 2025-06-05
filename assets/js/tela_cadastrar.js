document.addEventListener('DOMContentLoaded', function () {
    const cnpjcpfInput = document.getElementById('cnpjcpf');
    const fisicaRadio = document.getElementById('fisica');
    const juridicaRadio = document.getElementById('juridica');
    const fisicaJuridHidden = document.getElementById('fisicaJuridHidden');
    const cepInput = document.getElementById('cep');
    const telefoneInput = document.getElementById('telefone');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelFormBtn');
    const dateInput = document.getElementById('dtAberInest');
    const tipoContainer = document.getElementById('tipoContainer');
    const cnpjcpfContainer = document.getElementById('cnpjcpfContainer');
    const tipoSelect = document.getElementById('tipo');
    const estadoSelect = document.getElementById('estado');
    const token = sessionStorage.getItem('token');

    if (!token) {
        window.location.href = 'tela_login.html';
        return;
    }

    createConfirmationModal();

    function createConfirmationModal() {
        if (document.getElementById('confirmCancelModal')) return;
        const modalHtml = `
            <div class="modal fade" id="confirmCancelModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div class="modal-dialog"><div class="modal-content"><div class="modal-header">
                            <h5 class="modal-title" id="confirmModalLabel">Confirmar Cancelamento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div><div class="modal-body">
                            <p><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> Deseja realmente cancelar este cadastro?</p>
                            <p class="text-muted small">Todos os dados preenchidos serão perdidos.</p>
                        </div><div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não, voltar ao cadastro</button>
                            <button type="button" class="btn btn-danger" id="confirmCancelActionBtn">Sim, cancelar cadastro</button>
                        </div></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('confirmCancelActionBtn').addEventListener('click', function () {
            resetForm();
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmCancelModal'));
            modal.hide();
            showSnackbar('Cadastro cancelado.', 'info');
        });
    }

    document.getElementById('voltarBtn').addEventListener('click', function () {
        window.location.href = 'tela_listar.html';
    });

    function forceRedValidation(elId, defaultMessageKey) {
        const el = document.getElementById(elId);
        if (el) {
            el.value = (el.tagName === 'SELECT') ? "" : "";
            const message = el.dataset.customMessageRequired || defaultMessageKey || 'Este campo é obrigatório ou afetado por erro anterior.';
            setFieldValidity(el, false, message);
        }
    }

    function clearAddressFieldsCepError() {
        setFieldValidity(cepInput, false, 'CEP inválido ou dados não encontrados.');
        forceRedValidation('endereco', 'Endereço não preenchido devido a erro no CEP.');
        forceRedValidation('bairro', 'Bairro não preenchido devido a erro no CEP.');
        forceRedValidation('municipio', 'Município não preenchido devido a erro no CEP.');
        forceRedValidation('estado', 'Estado não preenchido devido a erro no CEP.');
        forceRedValidation('cdMunicipio', 'Cód. Município não preenchido devido a erro no CEP.');
        if (estadoSelect) estadoSelect.disabled = false;
    }

    function resetForm() {
        const form = document.getElementById('registrationForm');
        form.reset();
        document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
            const feedbackEl = el.nextElementSibling;
            if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
                feedbackEl.textContent = el.dataset.customMessageRequired || (el.hasAttribute('required') ? 'Este campo é obrigatório.' : '');
                feedbackEl.style.display = 'none';
            }
        });
        if (estadoSelect) estadoSelect.disabled = false;
        updatePlaceholder();
        updateLayout();
        ['endereco', 'bairro', 'municipio', 'cdMunicipio', 'estado'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = (el.tagName === 'SELECT') ? "" : "";
                el.classList.remove('is-valid', 'is-invalid');
                const feedbackEl = el.nextElementSibling;
                if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.style.display = 'none'; }
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showSnackbar(message, type = 'error') {
        const snackbar = document.getElementById('snackbar');
        snackbar.className = "show";
        snackbar.classList.remove('success', 'error', 'info');
        snackbar.classList.add(type);
        const icon = type === 'success' ? '<i class="bi bi-check-circle-fill"></i> ' :
            type === 'info' ? '<i class="bi bi-info-circle-fill"></i> ' :
                '<i class="bi bi-exclamation-triangle-fill"></i> ';
        snackbar.innerHTML = icon + message;
        setTimeout(function () {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    }

    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let add = 0;
        for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        add = 0;
        for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        return true;
    }

    function validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj === '' || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return false;
        return true;
    }

    function formatCPF_CNPJ(value, type) {
        const cleaned = value.replace(/\D/g, '');
        if (type === 'cpf') {
            if (cleaned.length <= 3) return cleaned;
            if (cleaned.length <= 6) return cleaned.replace(/(\d{3})(\d)/, '$1.$2');
            if (cleaned.length <= 9) return cleaned.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
            return cleaned.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            if (cleaned.length <= 2) return cleaned;
            if (cleaned.length <= 5) return cleaned.replace(/(\d{2})(\d)/, '$1.$2');
            if (cleaned.length <= 8) return cleaned.replace(/(\d{2})(\d{3})(\d)/, '$1.$2.$3');
            if (cleaned.length <= 12) return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d)/, '$1.$2.$3/$4');
            return cleaned.substring(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    }

    function formatCEP(cep) {
        const cleaned = cep.replace(/\D/g, '').substring(0, 8);
        if (cleaned.length > 5) return cleaned.replace(/(\d{5})(\d)/, '$1-$2');
        return cleaned;
    }

    function formatarTelefone(telefone) {
        const cleaned = telefone.replace(/\D/g, '').substring(0, 11);
        if (cleaned.length > 10) return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (cleaned.length > 6) return cleaned.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
        if (cleaned.length > 2) return cleaned.replace(/(\d{2})(\d)/, '($1) $2');
        return cleaned;
    }

    function formatarDataInput(data) {
        const cleaned = data.replace(/\D/g, '').substring(0, 8);
        let formatted = cleaned;
        if (cleaned.length > 4) {
            formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4, 8)}`;
        } else if (cleaned.length > 2) {
            formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
        }
        return formatted;
    }

    function formatarDataAPI(dataDDMMYYYY) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataDDMMYYYY)) return dataDDMMYYYY;
        const partes = dataDDMMYYYY.split('/');
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    function updatePlaceholder() {
        if (fisicaRadio.checked) {
            cnpjcpfInput.placeholder = "000.000.000-00";
            if (fisicaJuridHidden) fisicaJuridHidden.value = "F";
        } else {
            cnpjcpfInput.placeholder = "00.000.000/0000-00";
            if (fisicaJuridHidden) fisicaJuridHidden.value = "J";
        }
    }

    function updateLayout() {
        if (fisicaRadio.checked) {
            tipoContainer.style.display = 'none';
            tipoSelect.removeAttribute('required');
            tipoSelect.value = '';
            tipoSelect.classList.remove('is-valid', 'is-invalid');
            const tipoFeedback = tipoSelect.nextElementSibling;
            if (tipoFeedback) { tipoFeedback.textContent = ''; tipoFeedback.style.display = 'none'; }
            cnpjcpfContainer.classList.remove('col-md-6');
            cnpjcpfContainer.classList.add('col-md-8');
        } else {
            tipoContainer.style.display = '';
            tipoSelect.setAttribute('required', '');
            tipoSelect.classList.remove('is-valid', 'is-invalid');
            const tipoFeedback = tipoSelect.nextElementSibling;
            if (tipoFeedback) { tipoFeedback.textContent = ''; tipoFeedback.style.display = 'none'; }
            cnpjcpfContainer.classList.remove('col-md-8');
            cnpjcpfContainer.classList.add('col-md-6');
        }
    }

    function setFieldValidity(field, isValid, message = '') {
        const feedbackEl = field.nextElementSibling;
        field.classList.remove('is-valid', 'is-invalid');
        if (isValid) {
            field.classList.add('is-valid');
            if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
                feedbackEl.textContent = '';
                feedbackEl.style.display = 'none';
            }
        } else {
            field.classList.add('is-invalid');
            if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
                feedbackEl.textContent = message;
                feedbackEl.style.display = 'block';
            }
        }
    }

    function validateForm() {
        let isValidOverall = true;
        const form = document.getElementById('registrationForm');

        Array.from(form.elements).forEach(field => {
            if (!field.offsetWidth && !field.offsetHeight && !field.getClientRects().length) return;
            const isRequired = field.hasAttribute('required');
            const isEmpty = !field.value.trim();
            const feedbackEl = field.nextElementSibling;
            const requiredMessage = field.dataset.customMessageRequired || 'Este campo é obrigatório.';

            if (isRequired && isEmpty) {
                setFieldValidity(field, false, requiredMessage);
                isValidOverall = false;
            } else if (isRequired && !isEmpty) {
                if (field.classList.contains('is-invalid') && feedbackEl && feedbackEl.textContent === requiredMessage) {
                    field.classList.remove('is-invalid');
                    if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.style.display = 'none'; }
                }
            }
        });

        const cnpjCpfValue = cnpjcpfInput.value.replace(/\D/g, '');
        const cnpjCpfRequired = cnpjcpfInput.hasAttribute('required');
        if (fisicaRadio.checked) {
            if (cnpjCpfRequired && !cnpjCpfValue) { /* handled by generic */ }
            else if (cnpjCpfValue && (cnpjCpfValue.length !== 11 || !validateCPF(cnpjCpfValue))) {
                setFieldValidity(cnpjcpfInput, false, 'CPF inválido ou incompleto.'); isValidOverall = false;
            } else if (cnpjCpfValue && !cnpjcpfInput.classList.contains('is-invalid')) {
                setFieldValidity(cnpjcpfInput, true);
            } else if (!cnpjCpfValue && !cnpjCpfRequired && !cnpjcpfInput.classList.contains('is-invalid')) {
                setFieldValidity(cnpjcpfInput, true);
            }
        } else {  
            if (cnpjCpfRequired && !cnpjCpfValue) { /* handled by generic */ }
            else if (cnpjCpfValue && (cnpjCpfValue.length !== 14 || !validateCNPJ(cnpjCpfValue))) {
                setFieldValidity(cnpjcpfInput, false, 'CNPJ inválido ou incompleto.'); isValidOverall = false;
            } else if (cnpjCpfValue && !cnpjcpfInput.classList.contains('is-invalid')) {
                setFieldValidity(cnpjcpfInput, true);
            } else if (!cnpjCpfValue && !cnpjCpfRequired && !cnpjcpfInput.classList.contains('is-invalid')) {
                setFieldValidity(cnpjcpfInput, true);
            }
            const tipoRequired = tipoSelect.hasAttribute('required');
            if (tipoSelect.offsetParent !== null && tipoRequired && !tipoSelect.value) { /* handled by generic */ }
            else if (tipoSelect.offsetParent !== null && tipoSelect.value && tipoRequired && !tipoSelect.classList.contains('is-invalid')) {
                setFieldValidity(tipoSelect, true);
            } else if (tipoSelect.offsetParent !== null && !tipoRequired && !tipoSelect.classList.contains('is-invalid')) {
                setFieldValidity(tipoSelect, true);
            }
        }

        const dateValue = dateInput.value;
        const dateRequired = dateInput.hasAttribute('required');
        if (dateRequired && !dateValue) { /* handled by generic */ }
        else if (dateValue) {
            const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            if (!dateRegex.test(dateValue)) {
                setFieldValidity(dateInput, false, 'Data inválida (DD/MM/AAAA).'); isValidOverall = false;
            } else {
                const [, day, month, year] = dateValue.match(dateRegex).map(Number);
                const currentYear = new Date().getFullYear();
                if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > currentYear + 5) {
                    setFieldValidity(dateInput, false, 'Data fora do intervalo válido.'); isValidOverall = false;
                } else if (!dateInput.classList.contains('is-invalid')) {
                    setFieldValidity(dateInput, true);
                }
            }
        } else if (!dateValue && !dateRequired && !dateInput.classList.contains('is-invalid')) {
            setFieldValidity(dateInput, true);
        }

        const cepValueClean = cepInput.value.replace(/\D/g, '');
        const isCepRequired = cepInput.hasAttribute('required');
        if (isCepRequired && !cepValueClean) { /* handled by generic */ }
        else if (cepValueClean && cepValueClean.length !== 8) {
            setFieldValidity(cepInput, false, 'CEP deve ter 8 dígitos.'); isValidOverall = false;
        } else if (cepValueClean && cepValueClean.length === 8) {
            if (cepInput.classList.contains('is-invalid')) {
                isValidOverall = false;
            } else {
                setFieldValidity(cepInput, true);
            }
        } else if (!cepValueClean && !isCepRequired && !cepInput.classList.contains('is-invalid')) {
            setFieldValidity(cepInput, true);
        }

        if (!isValidOverall) {
            showSnackbar('Por favor, corrija os campos destacados.', 'error');
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid && typeof firstInvalid.focus === 'function') {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
        return isValidOverall;
    }

    fisicaRadio.addEventListener('change', function () {
        updatePlaceholder(); updateLayout();
        cnpjcpfInput.value = formatCPF_CNPJ(cnpjcpfInput.value, 'cpf');
        cnpjcpfInput.maxLength = 14;
    });

    juridicaRadio.addEventListener('change', function () {
        updatePlaceholder(); updateLayout();
        cnpjcpfInput.value = formatCPF_CNPJ(cnpjcpfInput.value, 'cnpj');
        cnpjcpfInput.maxLength = 18;
    });

    cnpjcpfInput.addEventListener('input', function (e) {
        e.target.value = fisicaRadio.checked ? formatCPF_CNPJ(e.target.value, 'cpf') : formatCPF_CNPJ(e.target.value, 'cnpj');
    });

    cnpjcpfInput.addEventListener('blur', function (e) {
        const field = e.target;
        const value = field.value.replace(/\D/g, '');
        let specificIsValid = true;
        let specificMessage = '';
        const isRequired = field.hasAttribute('required');

        if (fisicaRadio.checked) {
            if (value && (value.length !== 11 || !validateCPF(value))) {
                specificIsValid = false; specificMessage = 'CPF inválido ou incompleto.';
            } else if (!value && isRequired) {
                specificIsValid = false; specificMessage = field.dataset.customMessageRequired || 'Este campo é obrigatório.';
            } else if (value) {
                specificIsValid = true;
            } else {
                specificIsValid = true;
            }
        } else { 
            if (!value && isRequired) {
                specificIsValid = false; specificMessage = field.dataset.customMessageRequired || 'Este campo é obrigatório.';
            } else if (value) {
                if (value.length === 14 && validateCNPJ(value)) {
                    consultarCNPJAPI(field.value);
                    return;
                } else {
                    specificIsValid = false; specificMessage = 'CNPJ inválido ou incompleto.';
                }
            } else {
                specificIsValid = true;
            }
            if (tipoSelect.offsetParent !== null && tipoSelect.hasAttribute('required')) {
                if (!tipoSelect.value) setFieldValidity(tipoSelect, false, tipoSelect.dataset.customMessageRequired || 'Selecione um tipo.');
                else setFieldValidity(tipoSelect, true);
            }
        }
        setFieldValidity(field, specificIsValid, specificMessage);
    });

    dateInput.addEventListener('input', function (e) { e.target.value = formatarDataInput(e.target.value); });
    dateInput.addEventListener('blur', function (e) {
        const field = e.target; const dateValue = field.value; const isRequired = field.hasAttribute('required');
        if (!dateValue && !isRequired) { setFieldValidity(field, true); return; }
        if (!dateValue && isRequired) { setFieldValidity(field, false, field.dataset.customMessageRequired || 'Este campo é obrigatório.'); return; }
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(dateValue)) { setFieldValidity(field, false, 'Data inválida (DD/MM/AAAA).'); }
        else {
            const [, day, month, year] = dateValue.match(dateRegex).map(Number);
            const currentYear = new Date().getFullYear();
            if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > currentYear + 5) {
                setFieldValidity(field, false, 'Data fora do intervalo válido.');
            } else { setFieldValidity(field, true); }
        }
    });

    cepInput.addEventListener('input', function (e) { e.target.value = formatCEP(e.target.value); });
    cepInput.addEventListener('blur', function (e) {
        const field = e.target; const cep = field.value; const cepClean = cep.replace(/\D/g, '');
        const isRequired = field.hasAttribute('required');
        if (cepClean.length === 8) { consultarCEPAPI(cep); }
        else if (cepClean.length > 0 && cepClean.length < 8) {
            setFieldValidity(field, false, 'CEP deve ter 8 dígitos.');
            clearAddressFieldsCepError();
        } else if (cepClean.length === 0) {
            if (isRequired) {
                setFieldValidity(field, false, field.dataset.customMessageRequired || 'Este campo é obrigatório.');
            } else {
                setFieldValidity(field, true);
            }
            clearAddressFieldsCepError();
        }
    });

    telefoneInput.addEventListener('input', function (e) { e.target.value = formatarTelefone(e.target.value); });

    async function consultarCNPJAPI(cnpj) {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length !== 14 || !validateCNPJ(cnpjLimpo)) {
            setFieldValidity(cnpjcpfInput, false, 'CNPJ inválido para consulta.'); return;
        }
        const url = `http://localhost:9856/cnpj/${cnpjLimpo}`;
        document.body.style.cursor = 'wait';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ${response.status} ao consultar CNPJ.`);
            const data = await response.json();
            if (data.status === "ERROR" || data.situacao === null || !data.razao_social) {
                showSnackbar(data.message || 'CNPJ não encontrado ou dados insuficientes.', 'error');
                setFieldValidity(cnpjcpfInput, false, data.message || 'CNPJ não encontrado ou dados insuficientes.');
            } else {
                preencherCamposCNPJData(data);
                setFieldValidity(cnpjcpfInput, true);
                showSnackbar('CNPJ consultado com sucesso!', 'success');
            }
        } catch (error) {
            console.error('Erro ao consultar CNPJ:', error);
            showSnackbar('Falha ao consultar CNPJ. ' + error.message, 'error');
            setFieldValidity(cnpjcpfInput, false, 'Falha ao consultar CNPJ.');
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    function preencherCamposCNPJData(data) {
        if (data) {
            document.getElementById('nome').value = data.razao_social || '';
            setFieldValidity(document.getElementById('nome'), !!data.razao_social || !document.getElementById('nome').hasAttribute('required'));
            document.getElementById('nFantasia').value = data.nome_fantasia || data.razao_social || '';
            setFieldValidity(document.getElementById('nFantasia'), !!(data.nome_fantasia || data.razao_social) || !document.getElementById('nFantasia').hasAttribute('required'));
            if (data.data_inicio_atividade) {
                const parts = data.data_inicio_atividade.split('-');
                if (parts.length === 3) {
                    dateInput.value = formatarDataInput(`${parts[2]}/${parts[1]}/${parts[0]}`);
                    setFieldValidity(dateInput, true);
                }
            }
            if (data.cep) {
                cepInput.value = formatCEP(data.cep);
                consultarCEPAPI(data.cep, true);
            }
            if (data.ddd_telefone_1) {
                const phonePart = data.telefone_1 || (data.ddd_telefone_2 ? data.telefone_2 : '');
                telefoneInput.value = formatarTelefone(data.ddd_telefone_1 + phonePart);
                setFieldValidity(telefoneInput, true);
            }
            const emailField = document.getElementById('email');
            if (data.email) {
                emailField.value = data.email;
                const feedbackEl = emailField.nextElementSibling;
                if (emailField.classList.contains('is-invalid') && feedbackEl &&
                    feedbackEl.textContent === (emailField.dataset.customMessageRequired || 'Este campo é obrigatório.')) {
                    emailField.classList.remove('is-invalid');
                    feedbackEl.textContent = '';
                    feedbackEl.style.display = 'none';
                }
            }
        }
    }

    function updateEstadoSelect(uf) {
        let found = false;
        if (estadoSelect) {
            for (let i = 0; i < estadoSelect.options.length; i++) {
                if (estadoSelect.options[i].value === uf) {
                    estadoSelect.selectedIndex = i; found = true; break;
                }
            }
            if (found) setFieldValidity(estadoSelect, true);
            else {
                estadoSelect.value = "";
                setFieldValidity(estadoSelect, false, 'UF da API não encontrada na lista.');
            }
        }
    }

    async function consultarCEPAPI(cep, fromCNPJ = false) {
        const cepClean = cep.replace(/\D/g, '');
        if (cepClean.length !== 8) {
            setFieldValidity(cepInput, false, 'CEP deve ter 8 dígitos.');
            clearAddressFieldsCepError();
            return;
        }
        document.body.style.cursor = 'wait';
        let consultaTotalmenteBemSucedida = true;
        try {
            const response = await fetch(`http://localhost:9856/cep/${cepClean}`);
            if (!response.ok) throw new Error('Erro na requisição do CEP.');
            const data = await response.json();
            if (data.erro) {
                showSnackbar('CEP não encontrado.', 'error');
                clearAddressFieldsCepError();
                return;
            }

            document.getElementById('endereco').value = data.logradouro || '';
            setFieldValidity(document.getElementById('endereco'), !!data.logradouro || !document.getElementById('endereco').hasAttribute('required'));

            const bairroEl = document.getElementById('bairro');
            bairroEl.value = data.bairro || '';
            if (data.bairro) setFieldValidity(bairroEl, true);
            else bairroEl.classList.remove('is-valid', 'is-invalid');

            document.getElementById('municipio').value = data.localidade || '';
            setFieldValidity(document.getElementById('municipio'), !!data.localidade || !document.getElementById('municipio').hasAttribute('required'));

            updateEstadoSelect(data.uf);
            if (estadoSelect.classList.contains('is-invalid')) {
                consultaTotalmenteBemSucedida = false;
            }

            document.getElementById('pais').value = 'Brasil';
            setFieldValidity(document.getElementById('pais'), true);

            const cdMunicipioEl = document.getElementById('cdMunicipio');
            cdMunicipioEl.value = data.ibge || '';
            if (data.ibge) setFieldValidity(cdMunicipioEl, true);
            else cdMunicipioEl.classList.remove('is-valid', 'is-invalid');

            if (consultaTotalmenteBemSucedida) {
                setFieldValidity(cepInput, true);
                if (estadoSelect) estadoSelect.disabled = true;
                if (!fromCNPJ) showSnackbar('CEP consultado com sucesso!', 'success');
                if (document.getElementById('numero') && typeof document.getElementById('numero').focus === 'function') {
                    document.getElementById('numero').focus();
                }
            } else {
                setFieldValidity(cepInput, false, 'Dados do CEP resultaram em erro (ex: UF inválida).');
                forceRedValidation('bairro', 'Bairro não preenchido devido a dados inválidos do CEP.');
                forceRedValidation('cdMunicipio', 'Cód. Município não preenchido devido a dados inválidos do CEP.');
                if (estadoSelect) estadoSelect.disabled = false;
            }

        } catch (error) {
            console.error('Erro ao consultar CEP:', error);
            if (!fromCNPJ) showSnackbar('Falha ao consultar CEP.', 'error');
            clearAddressFieldsCepError();
        } finally {
            document.body.style.cursor = 'default';
        }
    }

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        if (validateForm()) {
            const dadosCliente = {

                id: 0, 
                tipo: juridicaRadio.checked ? tipoSelect.value : 'F',

                nome: document.getElementById('nome').value, loja: document.getElementById('unidade').value,
                cep: cepInput.value.replace(/\D/g, ''), numero: document.getElementById('numero').value,
                endereco: document.getElementById('endereco').value, bairro: document.getElementById('bairro').value,
                municipio: document.getElementById('municipio').value, estado: estadoSelect.value,
                pais: document.getElementById('pais').value, telefone: telefoneInput.value.replace(/\D/g, ''),
                email: document.getElementById('email').value, cnpjCpf: cnpjcpfInput.value.replace(/\D/g, ''),
                codMunicipio: document.getElementById('cdMunicipio').value, homePage: document.getElementById('homePage').value,
                tipoPessoa: fisicaRadio.checked ? 'F' : 'J', nomeFantasia: document.getElementById('nFantasia').value,
                codCliente: document.getElementById('codigo').value, dataAbertura: formatarDataAPI(dateInput.value)
            };

            document.body.style.cursor = 'wait'; submitBtn.disabled = true;

            let emailSuccessCount = 0;
            let emailErrorCount = 0;
            let firstErrorMessage = '';
            let emailFiscal = null;
            let fiscalEmailFetched = false;

            try {

                try {
                    emailFiscal = await buscarEmailFiscalAPI();
                    if (emailFiscal) {
                        console.log('E-mail do fiscal obtido com sucesso:', emailFiscal);
                        fiscalEmailFetched = true;
                    } else {

                        throw new Error("E-mail do fiscal não pôde ser determinado ou é inválido.");
                    }
                } catch (error) {
                    console.error('Falha ao obter e-mail do fiscal:', error.message);
                    emailErrorCount++;
                    if (!firstErrorMessage) firstErrorMessage = `Falha ao obter e-mail do fiscal: ${error.message}`;

                }


                const clienteCriado = await criarClienteAPI(dadosCliente);
                console.log('Cliente criado com sucesso:', clienteCriado);


                const emailDestino1 = sessionStorage.getItem('email');
                if (emailDestino1) {
                    const dadosClienteEmail1 = { cliente: { ...dadosCliente }, emailDestino: emailDestino1 };
                    try {
                        await enviarEmailAPI(dadosClienteEmail1);
                        console.log(`E-mail enviado com sucesso para ${emailDestino1}`);
                        emailSuccessCount++;
                    } catch (emailError) {
                        console.error(`Falha ao enviar e-mail para ${emailDestino1}:`, emailError);
                        emailErrorCount++;
                        if (!firstErrorMessage) firstErrorMessage = typeof emailError === 'string' ? emailError : emailError.message;
                    }
                } else {
                    console.warn("E-mail de destino 1 (sessionStorage) não encontrado. E-mail não será enviado.");
                    emailErrorCount++;
                    if (!firstErrorMessage) firstErrorMessage = "E-mail do destinatário principal não encontrado.";
                }



                if (fiscalEmailFetched && emailFiscal) {
                    const dadosClienteEmail2 = { cliente: { ...dadosCliente }, emailDestino: emailFiscal };
                    try {
                        await enviarEmailAPI(dadosClienteEmail2);
                        console.log(`E-mail enviado com sucesso para ${emailFiscal}`);
                        emailSuccessCount++;
                    } catch (emailError) {
                        console.error(`Falha ao enviar e-mail para ${emailFiscal}:`, emailError);
                        emailErrorCount++;
                        if (!firstErrorMessage) firstErrorMessage = typeof emailError === 'string' ? emailError : emailError.message;
                    }
                }

                const totalEmailsTentados = (emailDestino1 ? 1 : 0) + (fiscalEmailFetched ? 1 : 0);

                if (emailSuccessCount === totalEmailsTentados && totalEmailsTentados > 0) {
                    showSnackbar('Cadastro realizado e e-mails de confirmação solicitados com sucesso!', 'success');
                } else if (emailSuccessCount > 0) {
                    showSnackbar(`Cadastro realizado! E-mail enviado para ${emailSuccessCount} de ${totalEmailsTentados} destinatários. Falha para ${emailErrorCount}. ${firstErrorMessage ? `Erro: ${firstErrorMessage}` : ''}`, 'info');
                } else if (clienteCriado && totalEmailsTentados === 0 && !firstErrorMessage) {
                    showSnackbar('Cadastro realizado, mas nenhum e-mail de destino foi configurado para envio.', 'info');
                }
                else {
                    showSnackbar(`Cadastro realizado, mas falha ao solicitar e-mails de confirmação. ${firstErrorMessage ? `Detalhe: ${firstErrorMessage}` : 'Verifique o console para mais detalhes.'}`, 'error');
                }
                resetForm();

            } catch (error) {
                console.error('Falha no processo de cadastro (principal):', error);
                showSnackbar(error.message || 'Erro crítico no cadastro. Verifique o console.', 'error');
            } finally {
                document.body.style.cursor = 'default'; submitBtn.disabled = false;
            }
        }
    });

    async function criarClienteAPI(dadosCliente) {
        const url = 'http://localhost:9856/api/cliente/criarCliente';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(dadosCliente)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return await response.json();
    }

    async function buscarEmailFiscalAPI() {
        const url = 'http://localhost:9856/api/fiscal/listarFiscais';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || `Erro ${response.status} ao buscar dados fiscais.`;
                console.error('Erro na API de fiscais:', errorMessage);
                throw new Error(errorMessage);
            }

            const fiscais = await response.json();

            if (fiscais && fiscais.length > 0) {
                const emailFiscal = fiscais[0].email;
                if (emailFiscal) {
                    return emailFiscal;
                } else {
                    throw new Error('E-mail do fiscal não encontrado no cadastro fiscal.');
                }
            } else {
                throw new Error('Nenhum cadastro fiscal encontrado para obter o e-mail de destino.');
            }
        } catch (error) {
            console.error('Falha ao buscar e-mail do fiscal:', error);
            throw error;
        }
    }

    async function enviarEmailAPI(emailClienteDto) {

        console.log("Enviando para /email/enviar:", JSON.stringify(emailClienteDto, null, 2));

        const url = 'http://localhost:9856/email/enviar';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(emailClienteDto)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro ${response.status} ao enviar e-mail para ${emailClienteDto.emailDestino}.` }));

                throw new Error(errorData.message || `Falha ao enviar e-mail para ${emailClienteDto.emailDestino}. Status: ${response.status}`);
            }
            const data = await response.text();
            console.log(`E-mail enviado com sucesso para ${emailClienteDto.emailDestino} (resposta API):`, data);
            return data;
        } catch (error) {
            console.error(`Erro na função enviarEmailAPI para ${emailClienteDto.emailDestino}:`, error);

            throw error;
        }
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const cancelModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmCancelModal'));
            cancelModal.show();
        });
    }

    const emailJsButton = document.getElementById('emailJsBtn');
    function sendRegistrationEmailWithEmailJS() {
        if (!validateForm()) { showSnackbar('Preencha todos os campos obrigatórios corretamente!', 'error'); return false; }
        const formData = {};
    }
    if (emailJsButton) { emailJsButton.addEventListener('click', function () { sendRegistrationEmailWithEmailJS(); }); }

    document.querySelectorAll('[required]').forEach(el => {
        const label = el.closest('div')?.querySelector('label') || document.querySelector(`label[for='${el.id}']`) || el.previousElementSibling;
        if (label && (label.tagName === 'LABEL' || label.classList.contains('form-label'))) {
            el.dataset.customMessageRequired = `O campo "${label.textContent.replace('*', '').trim()}" é obrigatório.`;
        } else {
            el.dataset.customMessageRequired = `Este campo é obrigatório.`;
        }
    });

    updatePlaceholder();
    updateLayout();
});