// Validação do cadastro, resumo em diálogo e carga da grade de horários.

const IDADE_MINIMA = 14;
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
    }

    if (document.getElementById('corpo-tabela')) {
        carregarTabela();
    }
}

function aoEditarCampo(evento) {
    const campo = evento.target;

    if (campo.matches('input, select, textarea')) {
        limparEstadoCampo(campo);
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

function validarAtividade(valor) {
    const permitidas = ['musculacao', 'taekwondo', 'fit-dance'];

    if (!permitidas.includes(valor)) {
        return { valido: false, mensagem: 'Escolha uma atividade.' };
    }

    return { valido: true, mensagem: '' };
}

function validarPlano(valor) {
    const permitidos = ['mensal', 'trimestral', 'anual'];

    if (!permitidos.includes(valor)) {
        return { valido: false, mensagem: 'Escolha um plano.' };
    }

    return { valido: true, mensagem: '' };
}

function validarHorarios(valores) {
    if (!Array.isArray(valores) || valores.length === 0) {
        return { valido: false, mensagem: 'Selecione pelo menos um período de preferência.' };
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
        atividade: formulario.elements.namedItem('atividade'),
        experiencia: formulario.elements.namedItem('experiencia'),
        peso: formulario.elements.namedItem('peso'),
        observacoes: formulario.elements.namedItem('observacoes'),
        termos: formulario.elements.namedItem('termos')
    };
    const planoReferencia = formulario.querySelector('input[name="plano"]');
    const horariosReferencia = formulario.querySelector('input[name="horarios"]');
    const planoSelecionado = formulario.querySelector('input[name="plano"]:checked');
    const horariosSelecionados = Array.from(
        formulario.querySelectorAll('input[name="horarios"]:checked'),
        (campo) => campo.value
    );

    const verificacoes = [
        [campos.nome, validarNome(campos.nome.value)],
        [campos.email, validarEmail(campos.email.value)],
        [campos.telefone, validarTelefone(campos.telefone.value)],
        [campos.nascimento, validarNascimento(campos.nascimento.value)],
        [campos.senha, validarSenha(campos.senha.value)],
        [campos.atividade, validarAtividade(campos.atividade.value)],
        [planoReferencia, validarPlano(planoSelecionado ? planoSelecionado.value : '')],
        [horariosReferencia, validarHorarios(horariosSelecionados)],
        [campos.experiencia, validarExperiencia(campos.experiencia.value)],
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
    const rotulosHorarios = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' };
    const horarios = Array.from(
        formulario.querySelectorAll('input[name="horarios"]:checked'),
        (campo) => rotulosHorarios[campo.value] || campo.value
    );
    const rotuloPlano = plano
        ? (plano.labels && plano.labels.length ? plano.labels[0].textContent.trim() : plano.value)
        : '';

    return {
        'Nome': valor('nome').trim(),
        'E-mail': valor('email').trim(),
        'Telefone': valor('telefone').trim(),
        'Data de nascimento': formatarData(valor('nascimento')),
        'Atividade': formulario.elements.namedItem('atividade').selectedOptions[0].textContent.trim(),
        'Plano': rotuloPlano,
        'Horários preferidos': horarios.join(', '),
        'Nível de experiência': `${valor('experiencia')} de 5`,
        'Peso': valor('peso') ? `${valor('peso').replace('.', ',')} kg` : 'Não informado',
        'Observações': valor('observacoes').trim() || 'Nenhuma',
        'Senha': '••••••••',
        'Termos de uso': 'Aceitos'
    };
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
