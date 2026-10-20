// ============================================================
// DADOS FICTÍCIOS DAS DISCIPLINAS (9º ANO)
// ============================================================
// Array de objetos: cada objeto é uma disciplina com suas notas e faltas.
const disciplinas = [
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
// Converte qualquer formato de nota para a escala 0–10.
// Regras:
//  - vazio / null / undefined → null (nota ainda não lançada)
//  - 0 a 10 → mantém
//  - >10 e <=100 → divide por 10 (ex: 82 vira 8,2)
//  - aceita ponto ou vírgula decimal ("8,5" vira 8.5)
//  - valores fora das regras → null (inválido)
function normalizarNota(valor) {
  // Se for vazio, null ou undefined, não há nota
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto para o JavaScript entender
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
    valor = parseFloat(valor); // converte texto em número
  }

  // Se não for um número válido, retorna null
  if (typeof valor !== "number" || isNaN(valor)) {
    return null;
  }

  // Regra: entre 0 e 10 mantém
  if (valor >= 0 && valor <= 10) {
    return valor;
  }

  // Regra: maior que 10 e até 100 divide por 10
  if (valor > 10 && valor <= 100) {
    return valor / 10;
  }

  // Fora das regras → inválido
  return null;
}

// ============================================================
// FUNÇÃO: calcularMedia
// ============================================================
// Recebe uma lista de notas já normalizadas (ou null) e calcula a média.
// Ignora as notas null (ausentes). Se não houver nenhuma válida, retorna null.
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null; // nenhuma nota válida
  }

  const soma = validas.reduce(function (acc, n) {
    return acc + n;
  }, 0);

  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: somarFaltas
// ============================================================
// Soma os valores de um array de faltas (números inteiros).
function somarFaltas(faltas) {
  return faltas.reduce(function (acc, f) {
    return acc + f;
  }, 0);
}

// ============================================================
// FUNÇÃO: definirSituacao
// ============================================================
// Decide a situação da disciplina conforme a média.
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
// Mostra a nota com uma casa decimal ou "—" se for null.
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// ============================================================
// FUNÇÃO: criarLinhaTabela
// ============================================================
// Cria uma linha <tr> da tabela para uma disciplina.
function criarLinhaTabela(item) {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula a média somente com as notas disponíveis
  const media = calcularMedia([n1, n2, n3]);

  // Soma as faltas
  const totalFaltas = somarFaltas(item.faltas);

  // Define a situação
  const situacao = definirSituacao(media);

  // Define a classe CSS conforme a situação
  let classeSituacao = "situacao-indisponivel";
  if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (situacao === "Atenção") classeSituacao = "situacao-atencao";

  // Cria o elemento <tr>
  const tr = document.createElement("tr");

  tr.innerHTML =
    "<td>" + item.disciplina + "</td>" +
    "<td>" + formatarNota(n1) + "</td>" +
    "<td>" + formatarNota(n2) + "</td>" +
    "<td>" + formatarNota(n3) + "</td>" +
    "<td>" + (media === null ? "Ainda não lançada" : formatarNota(media)) + "</td>" +
    "<td>" + totalFaltas + "</td>" +
    "<td class='" + classeSituacao + "'>" + situacao + "</td>";

  return tr;
}

// ============================================================
// FUNÇÃO: preencherTabela
// ============================================================
// Percorre todas as disciplinas e adiciona as linhas na tabela.
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");

  disciplinas.forEach(function (item) {
    const linha = criarLinhaTabela(item);
    corpo.appendChild(linha);
  });
}

// ============================================================
// FUNÇÃO: preencherCards
// ============================================================
// Calcula os totais e preenche os cards de resumo.
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

  // Média geral (só das disciplinas que têm nota)
  const mediaGeral = qtdMedias > 0 ? somaMedias / qtdMedias : null;

  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  document.getElementById("total-faltas").textContent = totalFaltas;
  document.getElementById("total-bom").textContent = totalBom;
  document.getElementById("total-atencao").textContent = totalAtencao;

  // FREQUÊNCIA FICTÍCIA — apenas demonstrativa nesta etapa.
  // No futuro, será calculada de outra forma (não a partir das faltas).
  document.getElementById("frequencia").textContent = "92%";
  document.getElementById("frequencia-texto").textContent = "Frequência adequada";
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
// Quando a página terminar de carregar, preenche tabela e cards.
document.addEventListener("DOMContentLoaded", function () {
  preencherTabela();
  preencherCards();
});