/* =========================================================
   EMBARQUE IFMG - MOBILE.JS
   Versão mobile simulada (Front-End)
   ========================================================= */

   let dadosPainel = null;
   let eventos = null;
   let climaOnline = false;
   
   /* ================================
      CARREGAMENTO DOS ARQUIVOS .JS
      ================================ */
   async function carregarDados() {
       try {
           // Importa as variáveis globais definidas em dados.js e cronograma.js
           await Promise.all([
               import("../JSON/dados.js"),
               import("../JSON/cronograma.js")
           ]);
   
           dadosPainel = window.DADOS_PAINEL;
           eventos = window.EVENTOS;
   
           inicializar();
       } catch (error) {
           console.error("Erro ao carregar dados:", error);
       }
   }
   
   /* ================================
      INICIALIZAÇÃO GERAL
      ================================ */
   function inicializar() {
       configurarBotoesLinha();
       atualizarRelogio();
       atualizarClima();
       setInterval(atualizarRelogio, 1000);
       setInterval(atualizarClima, 300000);
   }
   
   /* ================================
      SELETOR DE LINHAS
      ================================ */
   function configurarBotoesLinha() {
       const botoes = document.querySelectorAll(".linha-btn");
       botoes.forEach(btn => {
           btn.addEventListener("click", () => {
               const idLinha = btn.getAttribute("data-linha");
               exibirLinha(idLinha);
           });
       });
   }
   
   /* ================================
      EXIBIR LINHA SELECIONADA
      ================================ */
   function exibirLinha(id) {
       const linha = dadosPainel.linhas.find(l => l.id === id);
       if (!linha) return;
   
       const card = document.getElementById("linhaCard");
       const nome = document.getElementById("linhaNome");
       const anterior = document.getElementById("horaAnterior");
       const atual = document.getElementById("horaAtual");
       const proximo = document.getElementById("horaProximo");
       const resto = document.getElementById("tempoRestante");
       const infoExtra = document.getElementById("infoExtra");
   
       card.classList.remove("hidden");
   
       nome.textContent = `Linha ${linha.nome}`;
   
       const agora = new Date();
       const diaSemana = agora.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
       const horariosDia = linha.horarios[diaSemana] || [];
   
       let hAnterior = "---";
       let hAtual = "---";
       let hProximo = "---";
   
       const minutoAgora = agora.getHours() * 60 + agora.getMinutes();
   
       for (let i = 0; i < horariosDia.length; i++) {
           const [h, m] = horariosDia[i].split(":").map(Number);
           const total = h * 60 + m;
   
           if (total <= minutoAgora) {
               hAnterior = horariosDia[i];
           } else if (total > minutoAgora && hAtual === "---") {
               hAtual = horariosDia[i];
               hProximo = horariosDia[i + 1] || "---";
               break;
           }
       }
   
       anterior.textContent = hAnterior;
       atual.textContent = hAtual;
       proximo.textContent = hProximo;
   
       // Tempo restante
       let restante = "---";
       if (hProximo !== "---") {
           restante = calcularDiferenca(agora, hProximo);
       }
       resto.textContent = restante;
   
       // Informações extras do 1012
       if (linha.id === "1012") {
           infoExtra.textContent = Math.random() > 0.5
               ? "🚏 Indo para o Terminal"
               : "🚏 Indo para o Morada da Serra";
       } else {
           infoExtra.textContent = "—";
       }
   
       animar(card);
   }
   
   /* ================================
      ANIMAÇÃO SUAVE
      ================================ */
   function animar(el) {
       el.classList.remove("fade");
       void el.offsetWidth;
       el.classList.add("fade");
   }
   
   /* ================================
      DIFERENÇA DE MINUTOS
      ================================ */
   function calcularDiferenca(agora, hora) {
       const [h, m] = hora.split(":").map(Number);
       const destino = h * 60 + m;
       const atual = agora.getHours() * 60 + agora.getMinutes();
       const diff = destino - atual;
       return diff > 0 ? diff : 0;
   }
   
   /* ================================
      RELÓGIO
      ================================ */
   function atualizarRelogio() {
       const clock = document.getElementById("clock");
       const agora = new Date();
   
       const dataStr = agora.toLocaleDateString("pt-BR", {
           weekday: "long",
           day: "2-digit",
           month: "long"
       });
   
       const horaStr = agora.toLocaleTimeString("pt-BR", {
           hour: "2-digit",
           minute: "2-digit",
           second: "2-digit"
       });
   
       clock.textContent = `${dataStr} | ${horaStr}`;
   }
   
   /* ================================
      CLIMA (ONLINE + FALLBACK)
      ================================ */
   async function atualizarClima() {
       const weather = document.getElementById("weather");
       const status = document.getElementById("status-indicador");
   
       try {
           const req = await fetch("https://wttr.in/?format=j1");
           const dados = await req.json();
   
           const cond = dados.current_condition[0];
           const desc = cond.weatherDesc[0].value;
           const temp = cond.temp_C;
   
           const traducoes = {
               "Sunny": ["Ensolarado", "☀️"],
               "Clear": ["Céu Limpo", "🌞"],
               "Partly cloudy": ["Parcialmente Nublado", "🌤️"],
               "Cloudy": ["Nublado", "☁️"],
               "Overcast": ["Encoberto", "☁️"],
               "Light rain": ["Chuva Leve", "🌧️"],
               "Patchy rain possible": ["Possível Chuva Leve", "🌦️"],
               "Rain": ["Chuva", "🌧️"],
               "Thunderstorm": ["Tempestade", "⛈️"]
           };
   
           const [pt, emoji] = traducoes[desc] || ["Tempo Estável", "🌤️"];
   
           weather.textContent = `${emoji} ${temp}°C — ${pt}`;
           climaOnline = true;
   
       } catch {
           const clima = dadosPainel.climas[Math.floor(Math.random() * dadosPainel.climas.length)];
           const temp = Math.floor(Math.random() * 6) + 22;
   
           weather.textContent = `${clima.icon} ${temp}°C — ${clima.nome}`;
           climaOnline = false;
       }
   
       if (climaOnline) {
           status.textContent = "📡 Online";
           status.style.background = "rgba(140,255,140,0.25)";
       } else {
           status.textContent = "🔴 Simulado";
           status.style.background = "rgba(255,150,150,0.25)";
       }
   }
   
   /* ================================
      INICIAR
      ================================ */
   carregarDados();
   