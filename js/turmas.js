/* =====================================================
   TURMAS.JS — EMBARCA IFMG
   Responsável por:
   - exibir cursos, períodos e turmas
   - verificar se a turma está no campus agora
   - sugerir salas possíveis
   Autores: Paicheco & Heringe
   ===================================================== */

(function(){

  const painel = document.getElementById("painel");
  if(!painel) return;

  /* ================= UTIL ================= */

  function horaAtualMin(){
    const a = new Date();
    return a.getHours() * 60 + a.getMinutes();
  }

  function intervaloParaMin(horario){
    // Ex: "08:00 às 11:30"
    const [ini, fim] = horario.split(" às ");
    const [h1,m1] = ini.split(":").map(Number);
    const [h2,m2] = fim.split(":").map(Number);
    return {
      inicio: h1*60 + m1,
      fim: h2*60 + m2
    };
  }

  function diaSemana(){
    const dias = [
      "Domingo","Segunda","Terça",
      "Quarta","Quinta","Sexta","Sábado"
    ];
    return dias[new Date().getDay()];
  }

  /* ================= RENDER ================= */

  window.renderTurmas = function(){
    painel.innerHTML = "";

    const agora = horaAtualMin();
    const hoje = diaSemana();

    CONFIG.cursos.forEach(curso => {

      const cardCurso = document.createElement("section");
      cardCurso.className = "card";

      let html = `<h2>${curso.nome}</h2>`;

      if(!curso.periodos){
        html += `<div class="desc">Informações ainda não cadastradas</div>`;
        cardCurso.innerHTML = html;
        painel.appendChild(cardCurso);
        return;
      }

      curso.periodos.forEach(p => {
        html += `<h3 style="margin-top:14px;color:#9fffdc">${p.periodo}</h3>`;

        p.turmas.forEach(turma => {
          const intervalo = intervaloParaMin(turma.horario);
          const emHorario =
            agora >= intervalo.inicio &&
            agora <= intervalo.fim &&
            turma.dias.includes(hoje);

          html += `
            <div style="
              margin-top:10px;
              padding:12px;
              border-radius:14px;
              background:#0c1412;
              border:1px solid ${emHorario ? "#00ff9c" : "rgba(255,255,255,.08)"}
            ">
              <strong>${turma.nome}</strong><br>
              ${turma.dias.join(", ")}<br>
              Horário: ${turma.horario}<br>
              <span style="color:${emHorario ? "#00ff9c" : "#ffda6a"}">
                ${emHorario ? "📍 Turma no campus agora" : "⏳ Turma fora do horário"}
              </span><br>
              Salas possíveis: ${turma.salasPossiveis.join(", ")}
            </div>
          `;
        });
      });

      cardCurso.innerHTML = html;
      painel.appendChild(cardCurso);
    });
  };

})();
