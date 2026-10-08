/*
 * Fonte unica de dados do site.
 * Para atualizar o ranking, altere somente este arquivo.
 */
window.NEW_APOCALYPSE_DATA = {
  season: 2026,
  hall: [
    { month: "Fevereiro", name: "Luis", initials: "LU", note: "Abriu a temporada." },
    { month: "Marco", displayMonth: "Março", name: "Luis", initials: "LU", note: "Dois reinados seguidos." },
    { month: "Abril", name: "Alice", initials: "AL", note: "Quebrou a sequência." },
    { month: "Maio", name: "Aliel", initials: "AL", note: "Mês mais dominante." },
    { month: "Junho", name: null, initials: "?", note: "Aguardando..." },
    { month: "Julho", name: "Mallu", initials: "MA", note: "Precisão e fogo." },
    { month: "Agosto", name: "Denner", initials: "DE", note: "Parabéns pelo empenho!", useExistingPhoto: true },
    { month: "Setembro", name: null, initials: "?", note: "Em andamento..." }
  ],
  battle: {
    month: "Setembro",
    computedWeeks: 3,
    totalWeeks: 5,
    team: [
      { name: "DENNER - LIDER", weeks: [26477, 35592, 42110, 0, 0] },
      { name: "LILLY", weeks: [33771, 32760, 28686, 0, 0] },
      { name: "STEF", weeks: [35413, 8079, 17524, 0, 0] },
      { name: "FCARV", weeks: [21232, 25279, 13627, 0, 0] },
      { name: "DESEMPREGADO", weeks: [11416, 20453, 22494, 0, 0] },
      { name: "MALLU", weeks: [18406, 15256, 18609, 0, 0] },
      { name: "REINOLDS", weeks: [10531, 255, 30068, 0, 0] },
      { name: "MALUQUINHO", weeks: [7231, 18579, 10381, 0, 0] },
      { name: "ANDRESSA", weeks: [10244, 11382, 1497, 0, 0] },
      { name: "ZACKZIN", weeks: [17317, 1756, 2036, 0, 0] },
      { name: "DANILOE01", weeks: [6955, 3252, 9544, 0, 0] },
      { name: "ANDRECRVG", weeks: [8916, 4242, 4731, 0, 0] },
      { name: "CAROL2K25", weeks: [4492, 5283, 7831, 0, 0] },
      { name: "STEPH - MANDAUMPIX", weeks: [5407, 7081, 4386, 0, 0] },
      { name: "CHERRIE", weeks: [2829, 7008, 5631, 0, 0] },
      { name: "ASSASSINOEMSERIE", weeks: [2207, 8036, 4147, 0, 0] },
      { name: "VITOR - ZOMBIE", weeks: [0, 0, 11044, 0, 0] },
      { name: "PUCHALSKI", weeks: [0, 4269, 6155, 0, 0] }
    ],
    directors: [
      { name: "DOUGLAS", total: 93657 },
      { name: "ALIEL - RAG", total: 91870 },
      { name: "DJEMERSON", total: 90409 }
    ]
  },
  charts: {
    team: [
      { label: "Fev", height: 4 }, { label: "Mar", height: 4 },
      { label: "Abr", height: 4 }, { label: "Mai", height: 100, display: "Mai" },
      { label: "Jun", height: 4 }, { label: "Jul", height: 4 },
      { label: "Ago", height: 4 }, { label: "Set", height: 85, display: "Set" },
      { label: "Out", height: 4 }, { label: "Nov", height: 4 },
      { label: "Dez", height: 4 }
    ],
    directors: [
      { label: "Fev", height: 4 }, { label: "Mar", height: 4 },
      { label: "Abr", height: 4 }, { label: "Mai", height: 100, display: "Mai" },
      { label: "Jun", height: 4 }, { label: "Jul", height: 4 },
      { label: "Ago", height: 4 }, { label: "Set", height: 72, display: "Set" },
      { label: "Out", height: 4 }, { label: "Nov", height: 4 },
      { label: "Dez", height: 4 }
    ]
  }
};
