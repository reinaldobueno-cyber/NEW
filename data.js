/* Base oficial do NEW! APOCALYPSE.
 * Atualizada a partir de "TABELA VENCEDORES R6.xlsx" em 08/10/2026.
 * Os titulos internos foram usados como referencia porque os nomes das abas
 * FEVEREIRO e JUNHO continham, respectivamente, Maio e Setembro.
 */
window.NEW_APOCALYPSE_DATA = {
  meta: {
    season: 2026,
    updatedAt: "2026-10-08",
    source: "TABELA VENCEDORES R6.xlsx",
    methodology: "Totais calculados pela soma das semanas; classificacao por total decrescente."
  },
  hall: [
    { month: "Fevereiro", name: "Luis", initials: "LU", note: "Abriu a temporada." },
    { month: "Março", name: "Luis", initials: "LU", note: "Dois reinados seguidos." },
    { month: "Abril", name: "Alice", initials: "AL", note: "Quebrou a sequência." },
    { month: "Maio", name: "Aliel", initials: "AL", note: "123.531 pontos. Domínio absoluto.", monthId: "2026-05" },
    { month: "Junho", name: null, initials: "?", note: "Histórico não informado." },
    { month: "Julho", name: "Mallu", initials: "MA", note: "Precisão e fogo." },
    { month: "Agosto", name: "Denner", initials: "DE", note: "Parabéns pelo empenho!", useExistingPhoto: true },
    { month: "Setembro", name: "Denner", initials: "DE", note: "159.741 pontos. O maior total da base.", monthId: "2026-09", useExistingPhoto: true, portraitOnly: true }
  ],
  months: [
    {
      id: "2026-05", name: "Maio", status: "Fechado", sourceSheet: "FEVEREIRO",
      weekLabels: ["28/04 a 05/05", "05/05 a 12/05", "12/05 a 19/05", "19/05 a 26/05"],
      team: [
        { name: "ALIEL - RAGNAR021", weeks: [29792, 30925, 33719, 29095] },
        { name: "MATHEUS - DESEMPREGADO", weeks: [19188, 30937, 28193, 32818] },
        { name: "ALICE - LILLYRJ", weeks: [13016, 24309, 16696, 36065] },
        { name: "REINALDO - REINOLDS", weeks: [20063, 24314, 17143, 18458] },
        { name: "RAFA (PROFESSORDECANTO)", weeks: [18210, 11441, 16122, 24348] },
        { name: "DENNER - LIDER001", weeks: [6290, 22675, 10706, 24454] },
        { name: "MIXERAI27", weeks: [3170, 11776, 21359, 15467] },
        { name: "EMERSON - POCKYBOY", weeks: [15005, 7297, 8791, 19694] },
        { name: "MARIA LUIZA (xXMalluXx)", weeks: [12908, 9160, 17794, 10198] },
        { name: "ANDRESSA - ANDRESSA", weeks: [7328, 8231, 11864, 7120] },
        { name: "ROSES", weeks: [0, 5169, 15208, 9916] },
        { name: "CRISTIAN - MALUQUINHO", weeks: [2436, 7755, 4762, 11195] },
        { name: "DANILOE01", weeks: [3041, 3840, 7171, 11053] },
        { name: "XSICÃO", weeks: [5448, 7740, 8679, 2829] },
        { name: "LUIS - ASSASSINOEMSERIE", weeks: [10158, 6363, 4307, 2944] },
        { name: "RAIANE - RAIANE MONTEIRO", weeks: [8709, 7404, 7134, 303] },
        { name: "JULIANA - SRAONOFRE", weeks: [6795, 5989, 7829, 1784] },
        { name: "ANDRÉ - ANDRECRVG", weeks: [5307, 2384, 5664, 5511] },
        { name: "KAK0101", weeks: [0, 0, 2729, 12334] },
        { name: "AKILLER4873", weeks: [0, 0, 2554, 10380] },
        { name: "PAULINHA", weeks: [1910, 0, 870, 5438] },
        { name: "CAIOSANTOUSA", weeks: [0, 0, 0, 6676] },
        { name: "PANDA", weeks: [3102, 3299, 0, 0] },
        { name: "M4XLEY", weeks: [0, 0, 2553, 1931] },
        { name: "UNICOGUIGU", weeks: [0, 0, 0, 3011] },
        { name: "CAROL2K25", weeks: [0, 0, 0, 1208] }
      ],
      directors: [
        { name: "DJEMERSON - CAETANO", weeks: [28141, 33093, 39590, 17808] },
        { name: "DOUGLAS - EOUSOGROOT", weeks: [22773, 31236, 22055, 14379] },
        { name: "RIQUE - LOKI", weeks: [29505, 15106, 3186, 14030] },
        { name: "GIU - SHREKA", weeks: [7066, 1832, 19786, 11337] }
      ]
    },
    {
      id: "2026-09", name: "Setembro", status: "Fechado", sourceSheet: "JUNHO",
      weekLabels: ["25/08 a 01/09", "01/09 a 08/09", "08/09 a 15/09", "15/09 a 22/09", "22/09 a 29/09"],
      team: [
        { name: "DENNER - LIDER", weeks: [26477, 35592, 42110, 33122, 22440] },
        { name: "LILLY", weeks: [33771, 32760, 28686, 23699, 19079] },
        { name: "FCARV", weeks: [21232, 25279, 13627, 11746, 25115] },
        { name: "DESEMPREGADO", weeks: [11416, 20453, 22494, 27551, 11261] },
        { name: "STEF", weeks: [35413, 8079, 17524, 13113, 4854] },
        { name: "MALLU", weeks: [18406, 15256, 18609, 10612, 5944] },
        { name: "MALUQUINHO", weeks: [7231, 18579, 10381, 8802, 5019] },
        { name: "VITOR - ZOMBIE", weeks: [0, 0, 11044, 13443, 18221] },
        { name: "REINOLDS", weeks: [10531, 255, 30068, 0, 0] },
        { name: "BELINHA", weeks: [0, 0, 0, 0, 39387] },
        { name: "CHERRIE", weeks: [2829, 7008, 5631, 10392, 8405] },
        { name: "ANDRESSA", weeks: [10244, 11382, 1497, 5503, 5491] },
        { name: "DANILOE01", weeks: [6955, 3252, 9544, 8147, 0] },
        { name: "ANDRECRVG", weeks: [8916, 4242, 4731, 3869, 4852] },
        { name: "CAROL2K25", weeks: [4492, 5283, 7831, 6518, 608] },
        { name: "ZACKZIN", weeks: [17317, 1756, 2036, 61, 3388] },
        { name: "FENIX", weeks: [0, 0, 0, 0, 23221] },
        { name: "PUCHALSKI", weeks: [0, 4269, 6155, 7040, 5305] },
        { name: "STEPH - MANDAUMPIX", weeks: [5407, 7081, 4386, 1912, 2858] },
        { name: "ROSES", weeks: [0, 0, 0, 12336, 8297] },
        { name: "ASSASSINOEMSERIE", weeks: [2207, 8036, 4147, 4174, 1178] },
        { name: "RAFAEL - PROFESSOR", weeks: [10257, 0, 0, 0, 3710] },
        { name: "JUH - SRAONOFRE", weeks: [2370, 3491, 1437, 2945, 2124] },
        { name: "LEVI - IIIIIIIIIIIIII", weeks: [903, 2986, 3261, 2569, 712] },
        { name: "COROTESIXSEVEN", weeks: [0, 0, 0, 4686, 5475] },
        { name: "MAIGAMESTER", weeks: [0, 0, 0, 5137, 0] },
        { name: "RAIANE", weeks: [0, 0, 0, 0, 1673] }
      ],
      directors: [
        { name: "ALIEL - RAG", weeks: [31650, 26539, 33681, 29247, 15611] },
        { name: "DOUGLAS - EUSOGROOT", weeks: [28274, 27287, 38096, 27567, 12979] },
        { name: "DJEMERSON - CAETANO", weeks: [15730, 45010, 29669, 17137, 9222] },
        { name: "RIQUE - LOKI", weeks: [3922, 3206, 11773, 4350, 5100] },
        { name: "GIU - SHREKA", weeks: [4502, 2120, 3606, 276, 1572] }
      ]
    }
  ]
};
