/* =====================================================
   CLOCK.JS — EMBARCA IFMG
   Responsável por data e hora em tempo real
   Autores: Paicheco & Heringe
   ===================================================== */

(function(){

  function atualizarHora(){
    const agora = new Date();

    const hora = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const data = agora.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const elHora = document.getElementById("hora");
    const elData = document.getElementById("data");

    if(elHora) elHora.textContent = hora;
    if(elData) elData.textContent = data;
  }

  // Atualiza imediatamente
  atualizarHora();

  // Atualiza a cada segundo
  setInterval(atualizarHora, 1000);

})();
