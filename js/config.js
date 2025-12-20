/* =====================================================
   CONFIGURAÇÃO CENTRAL — EMBARCA IFMG
   -----------------------------------------------------
   ESTE É O ÚNICO ARQUIVO QUE VOCÊ DEVE EDITAR
   para mudar horários, rotas, cursos ou eventos.
   ===================================================== */

const CONFIG = {

  /* ================= CLIMA =================
     (ainda não usado, mas já preparado) */
  clima: {
    cidade: "Ibirité",
    atualizacaoMin: 15
  },

  /* ================= ÔNIBUS ================= */
  onibus: [
    {
      linha: "1012",
      descricao: "Terminal ↔ Campus ↔ Morada da Serra",
      rotas: [
        "Terminal de Ibirité",
        "Campus IFMG",
        "Morada da Serra",
        "Campus IFMG",
        "Terminal de Ibirité"
      ],
      horarios: [
        "07:20",
        "08:00",
        "08:40",
        "09:20",
        "10:00",
        "10:40",
        "11:20",
        "12:00"
      ]
    },
    {
      linha: "1750",
      descricao: "Linha direta Terminal ↔ Campus",
      rotas: [
        "Terminal de Ibirité",
        "Campus IFMG",
        "Terminal de Ibirité"
      ],
      horarios: [
        "07:45",
        "08:15",
        "08:45",
        "09:15",
        "09:45",
        "10:15",
        "10:45"
      ]
    },
    {
      linha: "1751",
      descricao: "Linha alternativa Terminal ↔ Campus",
      rotas: [
        "Terminal de Ibirité",
        "Campus IFMG",
        "Terminal de Ibirité"
      ],
      horarios: [
        "07:55",
        "08:25",
        "08:55",
        "09:25",
        "09:55",
        "10:25",
        "10:55"
      ]
    }
  ],

  /* ================= CALENDÁRIO ACADÊMICO ================= */
  calendario: [
    {
      data: "2025-03-20",
      evento: "Início do semestre letivo"
    },
    {
      data: "2025-04-30",
      evento: "Avaliação institucional"
    },
    {
      data: "2025-06-15",
      evento: "Início do recesso acadêmico"
    },
    {
      data: "2025-08-01",
      evento: "Retorno das aulas"
    }
  ],

  /* ================= CURSOS & TURMAS ================= */
  cursos: [
    {
      nome: "Ciência da Computação",
      periodos: [
        {
          periodo: "2º Período",
          turmas: [
            {
              nome: "CC2",
              dias: ["Segunda", "Quarta", "Sexta"],
              horario: "08:00 às 11:30",
              salasPossiveis: ["B201", "B202"]
            }
          ]
        }
      ]
    },

    { nome: "Engenharia de Controle e Automação" },
    { nome: "Mecatrônica" },
    { nome: "Automação Industrial" },
    { nome: "Eletrotécnica" },
    { nome: "Informática" },
    { nome: "Sistemas de Energias Renováveis" }
  ]
};

/* =====================================================
   FIM DO ARQUIVO
   NÃO CRIE FUNÇÕES AQUI
   NÃO USE DOM AQUI
   APENAS DADOS
   ===================================================== */
