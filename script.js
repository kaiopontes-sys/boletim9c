// ============================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// ============================================================
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 19,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variavel em memória para armazenar o PIN durante a sessão
let pinSessao = "";

// ============================================================
// DADOS FICTÍCIOS DAS DISCIPLINAS (9º ANO)
// ============================================================
let disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// ============================================================
// FUNÇÃO: normalizarNota
// ============================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
    valor = parseFloat(valor);
  }

  if (typeof valor !== "number" || isNaN(valor)) {
    return null;
  }

  if (valor >= 0 && valor <= 10) {
    return valor;
  }

  if (valor > 10 && valor <= 100) {
    return valor / 10;
  }

  return null;
}

// ============================================================
// FUNÇÃO: calcularMedia
// ============================================================
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null;
  }

  const soma = validas.reduce(function (acc, n) {
    return acc + n;
  }, 0);

  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: somarFaltas
// ============================================================
function somarFaltas(faltas) {
  if (!Array.isArray(faltas)) return 0;
  return faltas.reduce(function (acc, f) {
    const num = parseInt(f, 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
}

// ============================================================
// FUNÇÃO: definirSituacao
// ============================================================
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= 6.0) {
    return "Bom desempenho";
  }
  return "Atenção";
}

// ============================================================
// FUNÇÃO: formatarNota
// ============================================================
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// ============================================================
// FUNÇÃO: criarLinhaTabela
// ============================================================
function criarLinhaTabela(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  let classeSituacao = "situacao-indisponivel";
  if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (situacao === "Atenção") classeSituacao = "situacao-atencao";

  const tr = document.createElement("tr");

  const tdDisc = document.createElement("td");
  tdDisc.textContent = item.disciplina;
  tr.appendChild(tdDisc);

  const td1 = document.createElement("td");
  td1.textContent = formatarNota(n1);
  tr.appendChild(td1);

  const td2 = document.createElement("td");
  td2.textContent = formatarNota(n2);
  tr.appendChild(td2);

  const td3 = document.createElement("td");
  td3.textContent = formatarNota(n3);
  tr.appendChild(td3);

  const tdMedia = document.createElement("td");
  tdMedia.textContent = media === null ? "Ainda não lançada" : formatarNota(media);
  tr.appendChild(tdMedia);

  const tdFaltas = document.createElement("td");
  tdFaltas.textContent = totalFaltas;
  tr.appendChild(tdFaltas);

  const tdSit = document.createElement("td");
  tdSit.textContent = situacao;
  tdSit.className = classeSituacao;
  tr.appendChild(tdSit);

  return tr;
}

// ============================================================
// FUNÇÃO: preencherTabela
// ============================================================
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  disciplinas.forEach(function (item) {
    const linha = criarLinhaTabela(item);
    corpo.appendChild(linha);
  });
}

// ============================================================
// FUNÇÃO: preencherCards
// ============================================================
function preencherCards() {
  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltas = 0;
  let totalBom = 0;
  let totalAtencao = 0;

  disciplinas.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);

    if (media !== null) {
      somaMedias += media;
      qtdMedias++;

      if (media >= 6.0) totalBom++;
      else totalAtencao++;
    }

    totalFaltas += somarFaltas(item.faltas);
  });

  const mediaGeral = qtdMedias > 0 ? somaMedias / qtdMedias : null;

  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  document.getElementById("total-faltas").textContent = totalFaltas;
  document.getElementById("total-bom").textContent = totalBom;
  document.getElementById("total-atencao").textContent = totalAtencao;

  document.getElementById("frequencia").textContent = "92%";
  document.getElementById("frequencia-texto").textContent = "Frequência adequada";
}

// ============================================================
// FUNÇÕES DE COMUNICAÇÃO COM A API
// ============================================================
async function entrarBoletim() {
  const inputPin = document.getElementById("input-pin");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Digite o PIN para entrar.";
    msgLogin.className = "mensagem erro";
    return;
  }

  msgLogin.textContent = "Conectando...";
  msgLogin.className = "mensagem info";

  try {
    const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (response.status === 401) {
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      msgLogin.className = "mensagem erro";
      return;
    }

    if (response.status === 429) {
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      msgLogin.className = "mensagem erro";
      return;
    }

    if (!response.ok) {
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      msgLogin.className = "mensagem erro";
      return;
    }

    const resData = await response.json();

    // PIN validado: guarda na sessão e limpa o campo
    pinSessao = pinDigitado;
    inputPin.value = "";

    // Se a API retornar dados, usa os dados da API
    if (resData && resData.dados && Array.isArray(resData.dados.disciplinas)) {
      disciplinas = resData.dados.disciplinas;
    }

    // Exibe a tela principal e atualiza os elementos
    document.getElementById("area-login").classList.add("escondido");
    document.getElementById("conteudo-boletim").classList.remove("escondido");

    preencherTabela();
    preencherCards();
    gerarFormularioEdicao();

  } catch (error) {
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    msgLogin.className = "mensagem erro";
  }
}

// ============================================================
// PAINEL DE EDIÇÃO E VALIDAÇÕES
// ============================================================
function alternarPainelEdicao() {
  const painel = document.getElementById("painel-edicao");
  painel.classList.toggle("escondido");
}

function formatarValorParaInput(val) {
  if (val === null || val === undefined || val === "") return "";
  const norm = normalizarNota(val);
  return norm !== null ? norm.toString().replace(".", ",") : "";
}

function gerarFormularioEdicao() {
  const container = document.getElementById("container-formulario-edicao");
  container.innerHTML = "";

  disciplinas.forEach((item, index) => {
    const linha = document.createElement("div");
    linha.className = "linha-edicao";

    const titulo = document.createElement("div");
    titulo.className = "nome-disciplina-edicao";
    titulo.textContent = item.disciplina;
    linha.appendChild(titulo);

    const grid = document.createElement("div");
    grid.className = "campos-grid";

    const f1 = item.faltas && item.faltas[0] !== undefined ? item.faltas[0] : 0;
    const f2 = item.faltas && item.faltas[1] !== undefined ? item.faltas[1] : 0;
    const f3 = item.faltas && item.faltas[2] !== undefined ? item.faltas[2] : 0;

    grid.innerHTML = `
      <div class="campo-grupo">
        <label>1º Tri Nota</label>
        <input type="text" data-index="${index}" data-tipo="nota" data-tri="0" value="${formatarValorParaInput(item.tri1)}">
      </div>
      <div class="campo-grupo">
        <label>2º Tri Nota</label>
        <input type="text" data-index="${index}" data-tipo="nota" data-tri="1" value="${formatarValorParaInput(item.tri2)}">
      </div>
      <div class="campo-grupo">
        <label>3º Tri Nota</label>
        <input type="text" data-index="${index}" data-tipo="nota" data-tri="2" value="${formatarValorParaInput(item.tri3)}">
      </div>
      <div class="campo-grupo">
        <label>1º Tri Faltas</label>
        <input type="text" data-index="${index}" data-tipo="falta" data-tri="0" value="${f1}">
      </div>
      <div class="campo-grupo">
        <label>2º Tri Faltas</label>
        <input type="text" data-index="${index}" data-tipo="falta" data-tri="1" value="${f2}">
      </div>
      <div class="campo-grupo">
        <label>3º Tri Faltas</label>
        <input type="text" data-index="${index}" data-tipo="falta" data-tri="2" value="${f3}">
      </div>
    `;

    linha.appendChild(grid);
    container.appendChild(linha);
  });
}

function validarNotaInput(str) {
  if (str === null || str === undefined || str.trim() === "") {
    return { valido: true, valor: null };
  }
  const limpo = str.trim().replace(",", ".");
  const num = Number(limpo);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

function validarFaltaInput(str) {
  if (str === null || str === undefined || str.trim() === "") {
    return { valido: false };
  }
  const limpo = str.trim();
  if (!/^\d+$/.test(limpo)) {
    return { valido: false };
  }
  const num = parseInt(limpo, 10);
  if (isNaN(num) || num < 0) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

async function salvarAlteracoes() {
  const msgSalvar = document.getElementById("mensagem-salvar");
  msgSalvar.textContent = "";
  msgSalvar.className = "mensagem";

  const inputs = document.querySelectorAll("#container-formulario-edicao input");
  let houverErro = false;

  inputs.forEach(input => input.classList.remove("invalido"));

  // Clona a estrutura atual para validar tudo
  const novasDisciplinas = JSON.parse(JSON.stringify(disciplinas));

  inputs.forEach(input => {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const tipo = input.getAttribute("data-tipo");
    const tri = parseInt(input.getAttribute("data-tri"), 10);
    const val = input.value;

    if (tipo === "nota") {
      const res = validarNotaInput(val);
      if (!res.valido) {
        input.classList.add("invalido");
        houverErro = true;
      } else {
        if (tri === 0) novasDisciplinas[idx].tri1 = res.valor;
        if (tri === 1) novasDisciplinas[idx].tri2 = res.valor;
        if (tri === 2) novasDisciplinas[idx].tri3 = res.valor;
      }
    } else if (tipo === "falta") {
      const res = validarFaltaInput(val);
      if (!res.valido) {
        input.classList.add("invalido");
        houverErro = true;
      } else {
        if (!novasDisciplinas[idx].faltas) novasDisciplinas[idx].faltas = [0, 0, 0];
        novasDisciplinas[idx].faltas[tri] = res.valor;
      }
    }
  });

  if (houverErro) {
    msgSalvar.textContent = "Existem campos com valores inválidos. Verifique os destaques em vermelho.";
    msgSalvar.className = "mensagem erro";
    return;
  }

  msgSalvar.textContent = "Salvando...";
  msgSalvar.className = "mensagem info";

  try {
    const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!response.ok) {
      msgSalvar.textContent = "Falha ao salvar as alterações. Tente novamente.";
      msgSalvar.className = "mensagem erro";
      return;
    }

    disciplinas = novasDisciplinas;

    msgSalvar.textContent = "Dados salvos com sucesso.";
    msgSalvar.className = "mensagem sucesso";

    preencherTabela();
    preencherCards();

  } catch (error) {
    msgSalvar.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    msgSalvar.className = "mensagem erro";
  }
}

// ============================================================
// INICIALIZAÇÃO E EVENTOS
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const btnEntrar = document.getElementById("btn-entrar");
  if (btnEntrar) {
    btnEntrar.addEventListener("click", entrarBoletim);
  }

  const inputPin = document.getElementById("input-pin");
  if (inputPin) {
    inputPin.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        entrarBoletim();
      }
    });
  }

  const btnAlternar = document.getElementById("btn-alternar-edicao");
  if (btnAlternar) {
    btnAlternar.addEventListener("click", alternarPainelEdicao);
  }

  const btnSalvar = document.getElementById("btn-salvar");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarAlteracoes);
  }
});