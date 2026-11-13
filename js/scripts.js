// Validação do cadastro, resumo em diálogo e carga da grade de horários.

const IDADE_MINIMA = 14;

/*
 * Fonte única dos planos e preços.
 * precoPorAtividade é o valor mensal por atividade; o total do período é
 * precoPorAtividade × meses × quantidade de atividades marcadas.
 * Altere apenas os valores abaixo para atualizar cards, total e resumo.
 */
const PLANOS = {
    mensal: {
        nome: 'Mensal',
        meses: 1,
        precoPorAtividade: 99.90,
        descricao: 'Para começar sem compromisso de longo prazo.'
    },
    trimestral: {
        nome: 'Trimestral',
        meses: 3,
        precoPorAtividade: 89.90,
        descricao: 'O equilíbrio entre economia e flexibilidade.',
        destaque: true
    },
    anual: {
        nome: 'Anual',
        meses: 12,
        precoPorAtividade: 74.90,
        descricao: 'O menor valor mensal para quem treina o ano todo.'
    }
};

const ATIVIDADES_PERMITIDAS = ['musculacao', 'taekwondo', 'fit-dance'];

const DIAS_COLUNAS = {
    segunda: 0,
    terca: 1,
    quarta: 2,
    quinta: 3,
    sexta: 4,
    sabado: 5
};

/*
 * Cópia de emergência da grade de horários.
 * Mantenha esta lista em sincronia com dados/tabela.json.
 * Ela é usada apenas quando o fetch é bloqueado (por exemplo, ao abrir
 * o site diretamente por file://, sem um servidor local).
 */
const AULAS_FALLBACK = [
    { dia: 'Segunda', horario: '07:00', modalidade: 'Musculação', professor: 'Carlos Mendes', nivel: 'Iniciante' },
    { dia: 'Quarta', horario: '07:00', modalidade: 'Musculação', professor: 'Carlos Mendes', nivel: 'Avançado' },
    { dia: 'Sexta', horario: '07:00', modalidade: 'Musculação', professor: 'Carlos Mendes', nivel: 'Intermediário' },
    { dia: 'Terça', horario: '08:00', modalidade: 'Fit Dance', professor: 'Juliana Alves', nivel: 'Todos os níveis' },
    { dia: 'Quinta', horario: '08:00', modalidade: 'Fit Dance', professor: 'Juliana Alves', nivel: 'Todos os níveis' },
    { dia: 'Sábado', horario: '08:30', modalidade: 'Musculação', professor: 'Carlos Mendes', nivel: 'Avançado' },
    { dia: 'Sábado', horario: '09:30', modalidade: 'Taekwondo', professor: 'Rafael Souza', nivel: 'Todos os níveis' },
    { dia: 'Sábado', horario: '11:00', modalidade: 'Fit Dance', professor: 'Juliana Alves', nivel: 'Todos os níveis' },
    { dia: 'Quarta', horario: '15:00', modalidade: 'Fit Dance', professor: 'Juliana Alves', nivel: 'Todos os níveis' },
    { dia: 'Segunda', horario: '18:30', modalidade: 'Taekwondo', professor: 'Rafael Souza', nivel: 'Iniciante' },
    { dia: 'Sexta', horario: '18:30', modalidade: 'Taekwondo', professor: 'Rafael Souza', nivel: 'Avançado' },
    { dia: 'Terça', horario: '19:00', modalidade: 'Taekwondo', professor: 'Rafael Souza', nivel: 'Intermediário' },
    { dia: 'Quarta', horario: '19:00', modalidade: 'Taekwondo', professor: 'Rafael Souza', nivel: 'Iniciante' },
    { dia: 'Quinta', horario: '19:00', modalidade: 'Taekwondo', professor: 'Rafael Souza', nivel: 'Intermediário' },
    { dia: 'Segunda', horario: '20:00', modalidade: 'Fit Dance', professor: 'Juliana Alves', nivel: 'Todos os níveis' },
    { dia: 'Sexta', horario: '20:00', modalidade: 'Fit Dance', professor: 'Juliana Alves', nivel: 'Todos os níveis' },
    { dia: 'Terça', horario: '20:30', modalidade: 'Musculação', professor: 'Carlos Mendes', nivel: 'Intermediário' },
    { dia: 'Quinta', horario: '20:30', modalidade: 'Musculação', professor: 'Carlos Mendes', nivel: 'Iniciante' }
];

document.addEventListener('DOMContentLoaded', aoCarregar);

function aoCarregar() {
    const formulario = document.getElementById('form-cadastro');

    if (formulario) {
        formulario.addEventListener('submit', validarFormulario);
        formulario.addEventListener('input', aoEditarCampo);
        formulario.addEventListener('change', aoEditarCampo);
        configurarDialogo();
        configurarBotoesSenha();
        preencherPrecosDosPlanos();
        aplicarPlanoDaUrl();
        atualizarTotalPlano();
    }

    renderizarPlanosHome();

    if (document.getElementById('corpo-tabela')) {
        carregarTabela();
    }
}

function aoEditarCampo(evento) {
    const campo = evento.target;

    if (campo.matches('input, select, textarea')) {
        if (campo.name === 'telefone') {
            aplicarMascaraTelefone(campo);
        }

        if (campo.name === 'peso') {
            filtrarPeso(campo);
        }

        if (campo.name === 'plano' || campo.name === 'atividade') {
            atualizarTotalPlano();
        }

        limparEstadoCampo(campo);
    }
}

/* ------------------------- Visualizar senha ------------------------- */

function configurarBotoesSenha() {
    document.querySelectorAll('[data-alternar-senha]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const campo = document.getElementById(botao.dataset.alternarSenha);

            if (!campo) {
                return;
            }

            const ficaraVisivel = campo.type === 'password';

            campo.type = ficaraVisivel ? 'text' : 'password';
            botao.setAttribute('aria-label', ficaraVisivel ? 'Ocultar senha' : 'Mostrar senha');
            // Em elementos SVG, hidden não é uma propriedade refletida: use o atributo.
            botao.querySelector('.icone-olho').toggleAttribute('hidden', ficaraVisivel);
            botao.querySelector('.icone-olho-riscado').toggleAttribute('hidden', !ficaraVisivel);
        });
    });
}

/* ----------------------------- Planos ----------------------------- */

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function preencherPrecosDosPlanos() {
    Object.entries(PLANOS).forEach(([chave, plano]) => {
        const preco = document.querySelector(`[data-preco-plano="${chave}"]`);
        const total = document.querySelector(`[data-total-plano="${chave}"]`);

        if (preco) {
            preco.textContent = formatarMoeda(plano.precoPorAtividade);
        }

        if (total) {
            total.textContent = plano.meses === 1
                ? 'Cobrança mensal por atividade'
                : `Total de ${formatarMoeda(plano.precoPorAtividade * plano.meses)} por atividade`;
        }
    });
}

/* Cards de plano da home, gerados a partir do mesmo objeto PLANOS */
function renderizarPlanosHome() {
    const container = document.getElementById('planos-cards');

    if (!container) {
        return;
    }

    const precoBase = PLANOS.mensal.precoPorAtividade;

    Object.entries(PLANOS).forEach(([chave, plano]) => {
        const card = document.createElement('article');
        card.className = 'plano-home';

        if (plano.destaque) {
            card.classList.add('plano-home--destaque');

            const selo = document.createElement('p');
            selo.className = 'plano-home-selo';
            selo.textContent = 'Mais popular';
            card.appendChild(selo);
        }

        const nome = document.createElement('h3');
        nome.textContent = plano.nome;
        card.appendChild(nome);

        const descricao = document.createElement('p');
        descricao.className = 'plano-home-descricao';
        descricao.textContent = plano.descricao;
        card.appendChild(descricao);

        const preco = document.createElement('p');
        preco.className = 'plano-home-preco';

        const valor = document.createElement('span');
        valor.className = 'plano-home-valor';
        valor.textContent = formatarMoeda(plano.precoPorAtividade);

        const periodo = document.createElement('span');
        periodo.className = 'plano-home-periodo';
        periodo.textContent = '/mês';

        preco.append(valor, periodo);
        card.appendChild(preco);

        const porAtividade = document.createElement('p');
        porAtividade.className = 'plano-home-por';
        porAtividade.textContent = 'por atividade';
        card.appendChild(porAtividade);

        const total = document.createElement('p');
        total.className = 'plano-home-total';
        total.textContent = plano.meses === 1
            ? 'Cobrança mensal por atividade.'
            : `Total de ${formatarMoeda(plano.precoPorAtividade * plano.meses)} por atividade no período de ${plano.meses} meses.`;
        card.appendChild(total);

        const desconto = Math.round((1 - plano.precoPorAtividade / precoBase) * 100);

        if (desconto > 0) {
            const economia = document.createElement('p');
            economia.className = 'plano-home-economia';
            economia.textContent = `${desconto}% de desconto em relação ao mensal`;
            card.appendChild(economia);
        }

        const link = document.createElement('a');
        link.className = plano.destaque ? 'btn btn-principal' : 'btn btn-plano';
        link.href = `cadastro.html?plano=${encodeURIComponent(chave)}`;
        link.textContent = 'Quero esse plano';
        link.setAttribute('aria-label', `Quero o plano ${plano.nome}`);
        card.appendChild(link);

        container.appendChild(card);
    });
}

/* Pré-seleciona no cadastro o plano indicado pela URL (?plano=trimestral) */
function aplicarPlanoDaUrl() {
    const chave = new URLSearchParams(window.location.search).get('plano');

    if (!chave || !Object.prototype.hasOwnProperty.call(PLANOS, chave)) {
        return;
    }

    const radio = document.getElementById(`plano-${chave}`);

    if (radio) {
        radio.checked = true;
        atualizarTotalPlano();
    }
}

function calcularTotalPlano(formulario) {
    const planoSelecionado = formulario.querySelector('input[name="plano"]:checked');
    const atividades = obterAtividadesSelecionadas(formulario);

    if (!planoSelecionado || !PLANOS[planoSelecionado.value] || atividades.length === 0) {
        return null;
    }

    const plano = PLANOS[planoSelecionado.value];

    return {
        plano,
        quantidadeAtividades: atividades.length,
        total: plano.precoPorAtividade * plano.meses * atividades.length
    };
}

function atualizarTotalPlano() {
    const formulario = document.getElementById('form-cadastro');
    const valor = document.getElementById('total-plano');
    const detalhe = document.getElementById('total-plano-detalhe');

    if (!formulario || !valor || !detalhe) {
        return;
    }

    const calculo = calcularTotalPlano(formulario);

    if (!calculo) {
        const planoSelecionado = formulario.querySelector('input[name="plano"]:checked');
        const atividades = obterAtividadesSelecionadas(formulario);

        valor.textContent = formatarMoeda(0);

        if (planoSelecionado && atividades.length === 0) {
            detalhe.textContent = 'Agora selecione pelo menos uma atividade.';
        } else if (!planoSelecionado && atividades.length > 0) {
            detalhe.textContent = 'Agora escolha um plano.';
        } else {
            detalhe.textContent = 'Selecione um plano e pelo menos uma atividade.';
        }

        return;
    }

    const { plano, quantidadeAtividades, total } = calculo;
    const rotuloAtividades = quantidadeAtividades === 1 ? 'atividade' : 'atividades';
    const rotuloMeses = plano.meses === 1 ? 'mês' : 'meses';
    const mensal = plano.precoPorAtividade * quantidadeAtividades;

    valor.textContent = formatarMoeda(total);
    detalhe.textContent = `${quantidadeAtividades} ${rotuloAtividades} · ${formatarMoeda(mensal)}/mês · ${plano.meses} ${rotuloMeses}`;
}

/* ------------------------- Campo de peso ------------------------- */

function filtrarPeso(campo) {
    const original = campo.value;
    const posicao = campo.selectionStart ?? original.length;
    let resultado = '';
    let separadorVisto = false;
    let removidosAntesDoCursor = 0;

    for (let i = 0; i < original.length; i++) {
        const caractere = original[i];
        const ehDigito = /\d/.test(caractere);
        const ehSeparador = (caractere === ',' || caractere === '.') && !separadorVisto;

        if (ehDigito || ehSeparador) {
            resultado += caractere;

            if (ehSeparador) {
                separadorVisto = true;
            }
        } else if (i < posicao) {
            removidosAntesDoCursor += 1;
        }
    }

    if (resultado !== original) {
        campo.value = resultado;

        if (document.activeElement === campo) {
            const novaPosicao = Math.max(0, posicao - removidosAntesDoCursor);
            campo.setSelectionRange(novaPosicao, novaPosicao);
        }
    }
}

/* ------------------------ Máscara do telefone ------------------------ */

function formatarTelefone(valor) {
    let digitos = valor.replace(/\D/g, '');

    // Aceita números colados com o código do Brasil (+55).
    if (digitos.length > 11 && digitos.startsWith('55')) {
        digitos = digitos.slice(2);
    }

    digitos = digitos.slice(0, 11);

    if (digitos.length === 0) {
        return '';
    }

    if (digitos.length <= 2) {
        return `(${digitos}`;
    }

    const ddd = digitos.slice(0, 2);
    const numero = digitos.slice(2);

    if (numero.length <= 4) {
        return `(${ddd}) ${numero}`;
    }

    if (digitos.length === 11) {
        return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
    }

    return `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
}

function aplicarMascaraTelefone(campo) {
    const posicao = campo.selectionStart ?? campo.value.length;
    const digitosAntes = campo.value.slice(0, posicao).replace(/\D/g, '').length;
    const formatado = formatarTelefone(campo.value);

    campo.value = formatado;

    let novaPosicao = 0;
    let digitos = 0;

    while (novaPosicao < formatado.length && digitos < digitosAntes) {
        if (/\d/.test(formatado[novaPosicao])) {
            digitos += 1;
        }

        novaPosicao += 1;
    }

    if (document.activeElement === campo) {
        campo.setSelectionRange(novaPosicao, novaPosicao);
    }
}

/* ----------------------------- Validações ----------------------------- */

function validarNome(valor) {
    const nome = valor.trim();

    if (nome.length < 3) {
        return { valido: false, mensagem: 'Informe o nome completo com pelo menos 3 caracteres.' };
    }

    if (nome.split(/\s+/).length < 2) {
        return { valido: false, mensagem: 'Informe nome e sobrenome.' };
    }

    if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(nome)) {
        return { valido: false, mensagem: 'Use apenas letras, espaços, apóstrofos e hífens.' };
    }

    return { valido: true, mensagem: '' };
}

function validarEmail(valor) {
    const email = valor.trim();

    if (!email) {
        return { valido: false, mensagem: 'Informe o e-mail.' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return { valido: false, mensagem: 'Informe um e-mail válido (ex.: nome@exemplo.com).' };
    }

    return { valido: true, mensagem: '' };
}

function validarTelefone(valor) {
    const digitos = valor.replace(/\D/g, '');

    if (!valor.trim()) {
        return { valido: false, mensagem: 'Informe o telefone.' };
    }

    if (digitos.length !== 10 && digitos.length !== 11) {
        return { valido: false, mensagem: 'Informe DDD + número (10 ou 11 dígitos).' };
    }

    if (/^(\d)\1+$/.test(digitos)) {
        return { valido: false, mensagem: 'Informe um telefone válido.' };
    }

    return { valido: true, mensagem: '' };
}

function validarNascimento(valor) {
    if (!valor) {
        return { valido: false, mensagem: 'Informe a data de nascimento.' };
    }

    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
        return { valido: false, mensagem: 'Informe uma data de nascimento válida.' };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (data > hoje) {
        return { valido: false, mensagem: 'A data de nascimento não pode estar no futuro.' };
    }

    if (ano < 1900) {
        return { valido: false, mensagem: 'Verifique o ano informado.' };
    }

    const idade = calcularIdade(data);

    if (idade > 120) {
        return { valido: false, mensagem: 'Verifique a data informada.' };
    }

    if (idade < IDADE_MINIMA) {
        return {
            valido: false,
            mensagem: `É necessário ter pelo menos ${IDADE_MINIMA} anos para se cadastrar.`
        };
    }

    return { valido: true, mensagem: '' };
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();

    if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    return idade;
}

function validarSenha(valor) {
    if (!valor) {
        return { valido: false, mensagem: 'Informe uma senha.' };
    }

    if (valor.length < 8) {
        return { valido: false, mensagem: 'A senha precisa ter pelo menos 8 caracteres.' };
    }

    if (!/[A-Za-zÀ-ÿ]/.test(valor) || !/[0-9]/.test(valor)) {
        return { valido: false, mensagem: 'A senha precisa ter pelo menos uma letra e um número.' };
    }

    return { valido: true, mensagem: '' };
}

function obterAtividadesSelecionadas(formulario) {
    return Array.from(
        formulario.querySelectorAll('input[name="atividade"]:checked'),
        (campo) => campo.value
    );
}

function validarAtividades(valores) {
    if (!Array.isArray(valores) || valores.length === 0) {
        return { valido: false, mensagem: 'Selecione pelo menos uma atividade.' };
    }

    if (valores.some((valor) => !ATIVIDADES_PERMITIDAS.includes(valor))) {
        return { valido: false, mensagem: 'Selecione apenas atividades disponíveis.' };
    }

    return { valido: true, mensagem: '' };
}

function validarPlano(valor) {
    if (!Object.prototype.hasOwnProperty.call(PLANOS, valor)) {
        return { valido: false, mensagem: 'Escolha um plano.' };
    }

    return { valido: true, mensagem: '' };
}

function validarConfirmacaoSenha(senha, confirmacao) {
    if (!confirmacao) {
        return { valido: false, mensagem: 'Confirme a senha.' };
    }

    if (senha !== confirmacao) {
        return { valido: false, mensagem: 'As senhas não conferem.' };
    }

    return { valido: true, mensagem: '' };
}

function validarExperiencia(valor) {
    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero < 1 || numero > 5) {
        return { valido: false, mensagem: 'Escolha um nível de experiência entre 1 e 5.' };
    }

    return { valido: true, mensagem: '' };
}

function validarPeso(valor) {
    const texto = String(valor).trim();

    if (!texto) {
        return { valido: true, mensagem: '' };
    }

    const numero = Number(texto.replace(',', '.'));

    if (!Number.isFinite(numero)) {
        return { valido: false, mensagem: 'Informe um peso válido.' };
    }

    if (numero < 30 || numero > 300) {
        return { valido: false, mensagem: 'O peso deve estar entre 30 e 300 kg.' };
    }

    return { valido: true, mensagem: '' };
}

function validarObservacoes(valor) {
    if (valor.length > 300) {
        return { valido: false, mensagem: 'As observações devem ter no máximo 300 caracteres.' };
    }

    return { valido: true, mensagem: '' };
}

function validarTermos(marcado) {
    if (!marcado) {
        return { valido: false, mensagem: 'É necessário aceitar os termos de uso e a política de privacidade.' };
    }

    return { valido: true, mensagem: '' };
}

/* --------------------------- Formulário --------------------------- */

function validarFormulario(evento) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const campos = {
        nome: formulario.elements.namedItem('nome'),
        email: formulario.elements.namedItem('email'),
        telefone: formulario.elements.namedItem('telefone'),
        nascimento: formulario.elements.namedItem('nascimento'),
        senha: formulario.elements.namedItem('senha'),
        confirmarSenha: formulario.elements.namedItem('confirmar-senha'),
        peso: formulario.elements.namedItem('peso'),
        observacoes: formulario.elements.namedItem('observacoes'),
        termos: formulario.elements.namedItem('termos')
    };
    const atividadeReferencia = formulario.querySelector('input[name="atividade"]');
    const planoReferencia = formulario.querySelector('input[name="plano"]');
    const experienciaReferencia = formulario.querySelector('input[name="experiencia"]');
    const planoSelecionado = formulario.querySelector('input[name="plano"]:checked');
    const experienciaSelecionada = formulario.querySelector('input[name="experiencia"]:checked');
    const atividadesSelecionadas = obterAtividadesSelecionadas(formulario);

    const verificacoes = [
        [campos.nome, validarNome(campos.nome.value)],
        [campos.email, validarEmail(campos.email.value)],
        [campos.telefone, validarTelefone(campos.telefone.value)],
        [campos.nascimento, validarNascimento(campos.nascimento.value)],
        [campos.senha, validarSenha(campos.senha.value)],
        [campos.confirmarSenha, validarConfirmacaoSenha(campos.senha.value, campos.confirmarSenha.value)],
        [atividadeReferencia, validarAtividades(atividadesSelecionadas)],
        [planoReferencia, validarPlano(planoSelecionado ? planoSelecionado.value : '')],
        [experienciaReferencia, validarExperiencia(experienciaSelecionada ? experienciaSelecionada.value : '')],
        [campos.peso, validarPeso(campos.peso.value)],
        [campos.observacoes, validarObservacoes(campos.observacoes.value)],
        [campos.termos, validarTermos(campos.termos.checked)]
    ];

    let primeiroInvalido = null;

    verificacoes.forEach(([campo, resultado]) => {
        if (resultado.valido) {
            limparErro(campo);
            marcarValido(campo);
        } else {
            mostrarErro(campo, resultado.mensagem);

            if (!primeiroInvalido) {
                primeiroInvalido = campo;
            }
        }
    });

    if (primeiroInvalido) {
        primeiroInvalido.focus();
        return;
    }

    exibirResumo(coletarDados(formulario));
}

function obterCamposDoGrupo(campo) {
    if (campo.type === 'radio' || campo.type === 'checkbox') {
        return Array.from(document.querySelectorAll(`input[name="${campo.name}"]`));
    }

    return [campo];
}

function obterContainerErro(campo) {
    if (campo.type === 'radio') {
        return campo.closest('fieldset') || campo.parentElement;
    }

    if (campo.type === 'checkbox') {
        const camposDoGrupo = obterCamposDoGrupo(campo);

        return camposDoGrupo.length > 1
            ? campo.closest('fieldset') || campo.parentElement
            : campo.closest('.form-check') || campo.parentElement;
    }

    return campo.closest('.mb-3') || campo.parentElement;
}

function mostrarErro(campo, mensagem) {
    limparErro(campo);

    const container = obterContainerErro(campo);
    const erro = document.createElement('p');
    erro.className = 'msg-erro';
    erro.id = `erro-${campo.name}`;
    erro.setAttribute('role', 'alert');
    erro.textContent = mensagem;

    // Mantém a mensagem logo abaixo do campo, antes de textos de ajuda.
    const textoAjuda = container.querySelector('.form-text');

    if (textoAjuda) {
        container.insertBefore(erro, textoAjuda);
    } else {
        container.appendChild(erro);
    }

    obterCamposDoGrupo(campo).forEach((item) => {
        item.classList.add('is-invalid');
        item.classList.remove('is-valid');
        item.setAttribute('aria-invalid', 'true');
        item.setAttribute('aria-describedby', erro.id);
    });
}

function limparErro(campo) {
    const container = obterContainerErro(campo);
    container.querySelectorAll('.msg-erro').forEach((erro) => erro.remove());

    obterCamposDoGrupo(campo).forEach((item) => {
        item.classList.remove('is-invalid', 'is-valid');
        item.removeAttribute('aria-invalid');
        item.removeAttribute('aria-describedby');
    });
}

function marcarValido(campo) {
    obterCamposDoGrupo(campo).forEach((item) => {
        item.classList.remove('is-invalid');
        item.classList.add('is-valid');
        item.removeAttribute('aria-invalid');
    });
}

function limparEstadoCampo(campo) {
    limparErro(campo);
}

function coletarDados(formulario) {
    const valor = (nome) => formulario.elements.namedItem(nome).value;
    const plano = formulario.querySelector('input[name="plano"]:checked');
    const experiencia = formulario.querySelector('input[name="experiencia"]:checked');
    const atividades = Array.from(
        formulario.querySelectorAll('input[name="atividade"]:checked'),
        (campo) => (campo.labels && campo.labels.length ? campo.labels[0].textContent.trim() : campo.value)
    );
    const rotuloPlano = plano && PLANOS[plano.value] ? PLANOS[plano.value].nome : '';
    const calculoTotal = calcularTotalPlano(formulario);
    const peso = valor('peso').trim();

    return {
        'Nome': valor('nome').trim(),
        'E-mail': valor('email').trim(),
        'Telefone': valor('telefone').trim(),
        'Data de nascimento': formatarData(valor('nascimento')),
        'Atividades': atividades.join(', '),
        'Plano': rotuloPlano,
        'Total do plano': calculoTotal ? formatarMoeda(calculoTotal.total) : '—',
        'Nível de experiência': experiencia ? `${experiencia.value} de 5` : '',
        'Peso': peso ? formatarPeso(peso) : 'Não informado',
        'Observações': valor('observacoes').trim() || 'Nenhuma',
        'Termos de uso': 'Aceitos'
    };
}

function formatarPeso(valor) {
    const numero = Number(String(valor).replace(',', '.'));

    if (!Number.isFinite(numero)) {
        return '';
    }

    return `${numero.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`;
}

function formatarData(valor) {
    if (!valor) {
        return '';
    }

    const [ano, mes, dia] = valor.split('-');
    return `${dia}/${mes}/${ano}`;
}

/* ---------------------------- Diálogo ---------------------------- */

function configurarDialogo() {
    const dialogo = document.getElementById('dialogo-resumo');

    if (!dialogo) {
        return;
    }

    dialogo.addEventListener('click', (evento) => {
        if (evento.target === dialogo) {
            dialogo.close();
        }
    });
}

function exibirResumo(dados) {
    const dialogo = document.getElementById('dialogo-resumo');

    if (!dialogo) {
        return;
    }

    dialogo.textContent = '';
    dialogo.setAttribute('aria-labelledby', 'titulo-resumo');

    const titulo = document.createElement('h2');
    titulo.id = 'titulo-resumo';
    titulo.tabIndex = -1;
    titulo.textContent = 'Resumo do cadastro';

    const aviso = document.createElement('p');
    aviso.textContent = 'Confira os dados abaixo. Nada é enviado a um servidor: este é um projeto acadêmico.';

    const lista = document.createElement('dl');
    lista.className = 'resumo';

    Object.entries(dados).forEach(([rotulo, valor]) => {
        const termo = document.createElement('dt');
        termo.textContent = rotulo;

        const descricao = document.createElement('dd');
        descricao.textContent = valor;

        lista.append(termo, descricao);
    });

    const fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'btn btn-principal';
    fechar.textContent = 'Fechar';
    fechar.addEventListener('click', () => dialogo.close());

    dialogo.append(titulo, aviso, lista, fechar);
    dialogo.showModal();
    titulo.focus();
    dialogo.scrollTop = 0;
}

/* --------------------- Grade de horários (AJAX) --------------------- */

async function carregarTabela() {
    const corpo = document.getElementById('corpo-tabela');

    if (!corpo) {
        return;
    }

    mostrarStatusTabela('Carregando grade de horários…', 'carregando');

    if (window.location.protocol === 'file:') {
        usarGradeLocal('A página foi aberta diretamente do computador; exibindo a grade local de segurança.');
        return;
    }

    try {
        const resposta = await fetch('dados/tabela.json');

        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }

        const aulas = await resposta.json();
        const aulasValidas = filtrarAulasValidas(aulas);

        renderizarTabela(aulasValidas);
        mostrarStatusTabela(
            aulasValidas.length > 0 ? '' : 'Nenhuma aula cadastrada na grade.',
            aulasValidas.length > 0 ? '' : 'erro'
        );
    } catch (erro) {
        console.warn('AJAX indisponível; usando a grade local de segurança.', erro);
        usarGradeLocal('Não foi possível atualizar a grade via AJAX. Exibindo a versão local de segurança.');
    }
}

function usarGradeLocal(mensagem) {
    const corpo = document.getElementById('corpo-tabela');
    const aulasFallback = filtrarAulasValidas(AULAS_FALLBACK);

    if (!corpo) {
        return;
    }

    corpo.textContent = '';
    renderizarTabela(aulasFallback);
    mostrarStatusTabela(
        aulasFallback.length > 0 ? mensagem : 'Não foi possível carregar a grade de horários.',
        aulasFallback.length > 0 ? 'aviso' : 'erro'
    );
}

function filtrarAulasValidas(aulas) {
    return Array.isArray(aulas)
        ? aulas.filter((aula) => aula && aula.dia && aula.horario && aula.modalidade)
        : [];
}

function renderizarTabela(aulas) {
    const corpo = document.getElementById('corpo-tabela');

    if (!corpo) {
        return;
    }

    corpo.textContent = '';

    if (!Array.isArray(aulas) || aulas.length === 0) {
        return;
    }

    agruparPorHorario(aulas).forEach(([horario, aulasDoHorario]) => {
        const linha = document.createElement('tr');
        const cabecalho = document.createElement('th');
        cabecalho.scope = 'row';
        cabecalho.textContent = formatarFaixaHorario(horario);
        linha.appendChild(cabecalho);

        for (let coluna = 0; coluna < 6; coluna++) {
            const celula = document.createElement('td');
            const aulasDoDia = aulasDoHorario.filter(
                (aula) => obterColunaDia(aula.dia) === coluna
            );

            if (aulasDoDia.length === 0) {
                celula.textContent = '—';
                celula.className = 'text-center';
            } else {
                const classe = classeModalidade(aulasDoDia[0].modalidade);

                if (classe) {
                    celula.classList.add(classe);
                }

                aulasDoDia.forEach((aula) => celula.appendChild(criarConteudoAula(aula)));
            }

            linha.appendChild(celula);
        }

        corpo.appendChild(linha);
    });
}

function agruparPorHorario(aulas) {
    const grupos = new Map();

    aulas.forEach((aula) => {
        if (!grupos.has(aula.horario)) {
            grupos.set(aula.horario, []);
        }

        grupos.get(aula.horario).push(aula);
    });

    return Array.from(grupos.entries()).sort(
        ([horarioA], [horarioB]) => minutosDoHorario(horarioA) - minutosDoHorario(horarioB)
    );
}

function criarConteudoAula(aula) {
    const fragmento = document.createDocumentFragment();

    const modalidade = document.createElement('strong');
    modalidade.textContent = aula.modalidade;

    const detalhes = document.createElement('small');
    detalhes.className = 'd-block fw-normal';
    detalhes.textContent = `${aula.nivel || 'Todos os níveis'} · ${aula.professor || 'A definir'}`;

    fragmento.append(modalidade, detalhes);
    return fragmento;
}

function obterColunaDia(dia) {
    const chave = normalizarTexto(dia).split('-')[0];
    return Object.prototype.hasOwnProperty.call(DIAS_COLUNAS, chave) ? DIAS_COLUNAS[chave] : -1;
}

function classeModalidade(modalidade) {
    const chave = normalizarTexto(modalidade);

    if (chave === 'musculacao') {
        return 'mod-musculacao';
    }

    if (chave === 'taekwondo') {
        return 'mod-taekwondo';
    }

    if (chave === 'fit dance' || chave === 'fitdance' || chave === 'danca') {
        return 'mod-danca';
    }

    return '';
}

function formatarFaixaHorario(horario) {
    const partes = String(horario).split(':');

    if (partes.length !== 2) {
        return String(horario);
    }

    const hora = Number(partes[0]);
    const minuto = Number(partes[1]);

    if (!Number.isInteger(hora) || !Number.isInteger(minuto)) {
        return String(horario);
    }

    // As aulas da grade têm duração de uma hora.
    const fim = new Date(2000, 0, 1, hora, minuto + 60);
    const formatar = (h, m) => `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;

    return `${formatar(hora, minuto)} às ${formatar(fim.getHours(), fim.getMinutes())}`;
}

function minutosDoHorario(horario) {
    const [hora, minuto] = String(horario).split(':').map(Number);

    if (!Number.isFinite(hora) || !Number.isFinite(minuto)) {
        return Number.POSITIVE_INFINITY;
    }

    return hora * 60 + minuto;
}

function normalizarTexto(texto) {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function mostrarStatusTabela(mensagem, tipo) {
    const status = document.getElementById('status-tabela');

    if (!status) {
        return;
    }

    status.textContent = mensagem;
    status.className = 'status-tabela';

    if (tipo) {
        status.classList.add(tipo);
    }
}
