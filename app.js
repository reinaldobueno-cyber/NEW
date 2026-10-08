(function () {
  "use strict";

  const data = window.NEW_APOCALYPSE_DATA;
  if (!data?.months?.length) return;

  const format = new Intl.NumberFormat("pt-BR");
  const total = (player) => player.weeks.reduce((sum, value) => sum + Number(value || 0), 0);
  const rank = (players) => [...players].sort((a, b) => total(b) - total(a));
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const slugName = (name) => name.split(" - ")[0].trim();
  const monthById = (id) => data.months.find((month) => month.id === id);
  const latestMonth = () => [...data.months].sort((a, b) => a.id.localeCompare(b.id)).at(-1);

  const originalShell = document.querySelector(".shell");
  const logoSource = originalShell?.querySelector(".logo img")?.getAttribute("src") || "";
  const existingPhotos = new Map(
    [...(originalShell?.querySelectorAll(".hc") || [])].map((card) => [
      card.querySelector("h3")?.textContent.trim(), card.querySelector("img")?.getAttribute("src")
    ])
  );

  let activeMonthId = latestMonth().id;
  let activeCategory = "team";
  let activeHallIndex = data.hall.length - 1;

  document.title = "NEW! APOCALYPSE — Central de Performance";
  originalShell.className = "experience";
  originalShell.innerHTML = `
    <header class="cinematic-hero original-hero" id="inicio">
      <div class="hero-noise" aria-hidden="true"></div>
      <div class="classic-intro">
        <div class="classic-logo"><img src="${logoSource}" alt="NEW! Apocalypse"></div>
        <div class="classic-eyebrow">Temporada ${data.meta.season} · O Céu é o Limite</div>
        <h1>A Guerra<br>dos Campeões</h1>
        <p>Hall da Fama, rankings completos e a temporada em números.</p>
        <a class="classic-cue" href="#visao" data-view-target="visao">desça para entrar <span>↓</span></a>
      </div>
    </header>

    <aside class="rock-player" id="rock-player">
      <button class="rock-toggle" id="rock-toggle" aria-expanded="false" aria-controls="rock-panel"><span>♫</span><div><b>ROCK MODE</b><small>Rock Classics · Spotify</small></div><i>▲</i></button>
      <div class="rock-panel" id="rock-panel">
        <div class="rock-head"><span>TRILHA DA BATALHA</span><button id="rock-close" aria-label="Minimizar player">×</button></div>
        <iframe title="Playlist Rock Classics no Spotify" src="https://open.spotify.com/embed/playlist/37i9dQZF1DWXRqgorJj26U?utm_source=generator&theme=0" width="100%" height="352" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    </aside>

    <nav class="command-nav" id="command-nav" aria-label="Navegação principal">
      <a class="nav-brand" href="#inicio"><span>NEW!</span> APOCALYPSE</a>
      <div class="nav-links" role="tablist" aria-label="Áreas da central">
        <button class="active" data-view-target="visao" role="tab">Visão geral</button><button data-view-target="arena" role="tab">A Arena</button><button data-view-target="hall" role="tab">Hall da Fama</button><button data-view-target="ranking" role="tab">Rankings</button><button data-view-target="lancamento" role="tab">Editar números</button>
      </div>
      <div class="nav-status"><i></i> BASE ATIVA</div>
    </nav>

    <main class="app-main">
      <section class="experience-section overview-section app-view active" id="visao" data-view="visao">
        <div class="section-intro reveal">
          <div><span class="section-index">01 / VISÃO GERAL</span><h2>A temporada<br>em perspectiva.</h2></div>
          <p>Uma leitura executiva da competição, consolidada a partir da planilha oficial e calculada automaticamente.</p>
        </div>
        <div class="metric-grid" id="metric-grid"></div>
        <div class="trend-panel reveal">
          <div class="panel-heading"><div><span>EVOLUÇÃO MENSAL</span><h3>Volume total da equipe</h3></div><div class="legend"><i></i> Pontos computados</div></div>
          <div class="trend-chart" id="trend-chart"></div>
        </div>
      </section>

      <section class="experience-section arena-section app-view" id="arena" data-view="arena">
        <div class="arena-grid" aria-hidden="true"></div>
        <div class="section-intro reveal">
          <div><span class="section-index">02 / SALA DE JOGOS</span><h2>O céu não é<br>o limite. <em>É a arena.</em></h2></div>
          <p>Conquistas da equipe, próximas missões e inteligência de jogo. Cada vitória abre uma nova fase.</p>
        </div>

        <article class="gold-unlock reveal" id="gold-unlock">
          <div class="unlock-scan"></div>
          <div class="gold-medal" aria-hidden="true"><span>★</span><i></i></div>
          <div class="gold-copy">
            <span class="unlock-code">CONQUISTA 001 · DESBLOQUEADA ESTA SEMANA</span>
            <h3>Ouro<br><em>conquistado.</em></h3>
            <p>A NEW atravessou a rodada como equipe e chegou ao topo. Não é só uma medalha: é a prova de que estratégia, constância e aliança vencem o jogo.</p>
            <button class="celebrate-button" id="celebrate-gold"><span>△</span> Celebrar conquista</button>
          </div>
          <div class="unlock-stats">
            <div><span>STATUS</span><strong>OURO</strong><small>CONQUISTA CONFIRMADA</small></div>
            <div><span>PRÓXIMA FASE</span><strong>02×</strong><small>BUSCAR OURO CONSECUTIVO</small></div>
          </div>
        </article>

        <div class="arena-columns">
          <section class="mission-board reveal">
            <div class="arena-heading"><span>PRÓXIMAS MISSÕES</span><b>03 ATIVAS</b></div>
            <div class="mission-list">
              <article><i class="shape-circle"></i><div><span>MISSÃO 01 · BATATINHA FRITA 1, 2, 3</span><h4>Avance sem perder o ritmo</h4><p>Pontue desde o início da semana. Constância reduz a pressão da última rodada.</p></div><b>01</b></article>
              <article><i class="shape-triangle"></i><div><span>MISSÃO 02 · CABO DE GUERRA</span><h4>Ninguém vence sozinho</h4><p>Compartilhe rotas, atalhos e estratégias no time. Uma descoberta deve fortalecer todos.</p></div><b>02</b></article>
              <article><i class="shape-square"></i><div><span>MISSÃO 03 · PONTE DE VIDRO</span><h4>Transforme risco em leitura</h4><p>Observe antes de agir, aprenda com cada rodada e registre o que funcionou.</p></div><b>03</b></article>
            </div>
          </section>

          <aside class="vault-card reveal">
            <span>COFRE DA EQUIPE</span>
            <div class="vault-ring"><b>01</b><small>TROFÉU</small></div>
            <h4>A coleção começou.</h4>
            <p>Cada conquista semanal ficará registrada aqui. O objetivo não é sobreviver: é construir uma dinastia.</p>
            <div class="vault-slots"><i class="won">★</i><i>?</i><i>?</i><i>?</i><i>?</i><i>?</i></div>
          </aside>
        </div>

        <section class="strategy-deck reveal">
          <div class="arena-heading"><div><span>ARQUIVO CONFIDENCIAL</span><h3>Macetes para sobreviver — e vencer.</h3></div><small>TOQUE EM UMA CARTA PARA ABRIR</small></div>
          <div class="strategy-filters" role="tablist" aria-label="Filtrar estratégias"><button class="active" data-tip-filter="all">Todos</button><button data-tip-filter="timing">Timing</button><button data-tip-filter="rota">Rota</button><button data-tip-filter="equipe">Equipe</button></div>
          <div class="strategy-grid">
            <article class="strategy-card" data-tip="timing" tabindex="0"><div class="card-face"><span>01 · TIMING</span><i>○</i><h4>Batatinha Frita<br>1, 2, 3</h4><p>Movimento curto vence corrida desesperada.</p><b>ABRIR DOSSIÊ +</b></div><div class="card-secret"><span>MACETE DE OURO</span><p>Não largue no primeiro impulso. Use passos curtos, pare antes do sinal e deixe espaço para corrigir o personagem.</p><button>FECHAR ×</button></div></article>
            <article class="strategy-card" data-tip="rota" tabindex="0"><div class="card-face"><span>02 · LEITURA</span><i>△</i><h4>Ponte<br>de Vidro</h4><p>Memória e paciência valem mais que pressa.</p><b>ABRIR DOSSIÊ +</b></div><div class="card-secret"><span>MACETE DE OURO</span><p>Observe a sequência aberta pelos primeiros jogadores, memorize em blocos curtos e mantenha a câmera alinhada antes de saltar.</p><button>FECHAR ×</button></div></article>
            <article class="strategy-card" data-tip="timing" tabindex="0"><div class="card-face"><span>03 · RITMO</span><i>□</i><h4>Pular<br>Corda</h4><p>Cadência primeiro. Velocidade depois.</p><b>ABRIR DOSSIÊ +</b></div><div class="card-secret"><span>MACETE DE OURO</span><p>Leia dois ciclos antes de entrar. Salte pelo ritmo da animação, não pelo susto, e evite mudar de direção no ar.</p><button>FECHAR ×</button></div></article>
            <article class="strategy-card" data-tip="rota" tabindex="0"><div class="card-face"><span>04 · ROTA</span><i>◇</i><h4>Esconde-<br>Esconde</h4><p>A saída começa no mapa, não na corrida.</p><b>ABRIR DOSSIÊ +</b></div><div class="card-secret"><span>MACETE DE OURO</span><p>Faça curvas fechadas para quebrar a visão, guarde uma rota alternativa e não siga a multidão para uma única porta.</p><button>FECHAR ×</button></div></article>
            <article class="strategy-card" data-tip="equipe" tabindex="0"><div class="card-face"><span>05 · ALIANÇA</span><i>◎</i><h4>Mingle</h4><p>Antecipe o grupo antes do número aparecer.</p><b>ABRIR DOSSIÊ +</b></div><div class="card-secret"><span>MACETE DE OURO</span><p>Fique próximo de jogadores atentos, ocupe o centro para alcançar mais portas e decida rápido: hesitação elimina o grupo inteiro.</p><button>FECHAR ×</button></div></article>
            <article class="strategy-card" data-tip="equipe" tabindex="0"><div class="card-face"><span>06 · FINAL</span><i>⬡</i><h4>Sky Squid<br>Game</h4><p>Posicionamento é poder.</p><b>ABRIR DOSSIÊ +</b></div><div class="card-secret"><span>MACETE DE OURO</span><p>Evite bordas no começo, preserve mobilidade e só dispute espaço quando houver rota segura para recuar.</p><button>FECHAR ×</button></div></article>
          </div>
          <p class="arena-disclaimer">Estratégias editoriais da NEW baseadas nas mecânicas públicas do jogo. Round 6: O Céu é o Limite é um jogo da Netflix.</p>
        </section>
      </section>

      <section class="experience-section hall-section app-view" id="hall" data-view="hall">
        <div class="section-intro reveal">
          <div><span class="section-index">03 / LEGADO</span><h2>Hall da<br><em>Fama.</em></h2></div>
          <p>Os nomes que atravessaram o fogo e conquistaram o topo de cada mês.</p>
        </div>
        <div class="hall-experience" id="hall-experience"></div>
      </section>

      <section class="experience-section ranking-section app-view" id="ranking" data-view="ranking">
        <div class="section-intro reveal">
          <div><span class="section-index">04 / ARQUIVO OFICIAL</span><h2>O campo<br>de batalha.</h2></div>
          <p>Selecione um mês e alterne entre equipe e diretoria. Todos os totais são recalculados a partir das semanas.</p>
        </div>
        <div class="ranking-controls reveal">
          <div class="month-tabs" id="month-tabs"></div>
          <div class="category-toggle" id="category-toggle">
            <button class="active" data-category="team">Equipe</button><button data-category="directors">Diretoria</button>
          </div>
        </div>
        <div id="ranking-view"></div>
      </section>

      <section class="experience-section launch-section app-view" id="lancamento" data-view="lancamento">
        <div class="section-intro reveal">
          <div><span class="section-index">05 / ACESSO RESTRITO</span><h2>Uma base.<br><em>Uma verdade.</em></h2></div>
          <p>Os números oficiais agora são mantidos em uma única planilha, com histórico mensal e acesso controlado pela Diretoria.</p>
        </div>
        <div class="admin-access reveal">
          <div class="admin-access-copy">
            <span class="admin-kicker">GOOGLE SHEETS · BASE OFICIAL 2026</span>
            <h3>Painel da Diretoria</h3>
            <p>Edite apenas as semanas. O total de cada jogador é recalculado automaticamente e o histórico permanece organizado por mês e categoria.</p>
            <a class="primary-action button admin-sheet-link" href="https://docs.google.com/spreadsheets/d/1VVoZkg1iqBUwhuQyWMJrAppEbsUAckVTVG4iom62Tb4/edit" target="_blank" rel="noopener noreferrer">Editar números <span>↗</span></a>
          </div>
          <div class="admin-security">
            <span>ACESSO PROTEGIDO</span>
            <strong>Somente contas autorizadas</strong>
            <p>O Google solicita a autenticação antes de permitir alterações. A credencial da Diretoria não fica exposta no código público.</p>
            <ul><li>Histórico de alterações</li><li>Totais automáticos</li><li>Base mensal permanente</li></ul>
          </div>
        </div>
      </section>
    </main>

    <footer class="cinematic-footer">
      <img src="${logoSource}" alt="" aria-hidden="true"><div><strong>NEW! APOCALYPSE</strong><span>O céu é o limite.</span></div>
      <p>Base oficial · Atualizada em ${new Date(data.meta.updatedAt + "T12:00:00").toLocaleDateString("pt-BR")}</p>
    </footer>`;

  function renderHero() {}

  function renderOverview() {
    const latest = latestMonth();
    const allPlayers = new Set(data.months.flatMap((month) => month.team.map((player) => player.name)));
    const allEntries = data.months.reduce((sum, month) => sum + month.team.length + month.directors.length, 0);
    const records = data.months.flatMap((month) => rank(month.team).map((player) => ({ month, player, score: total(player) })));
    const record = records.sort((a, b) => b.score - a.score)[0];
    document.querySelector("#metric-grid").innerHTML = `
      <article class="metric-card reveal"><span>MESES CONSOLIDADOS</span><strong>${String(data.months.length).padStart(2, "0")}</strong><p>Maio e Setembro disponíveis em detalhe.</p></article>
      <article class="metric-card reveal"><span>COMPETIDORES NA BASE</span><strong>${allPlayers.size}</strong><p>${allEntries} registros entre equipe e diretoria.</p></article>
      <article class="metric-card featured reveal"><span>RECORDE INDIVIDUAL</span><strong>${format.format(record.score)}</strong><p>${escapeHtml(slugName(record.player.name))} · ${record.month.name}</p></article>
      <article class="metric-card reveal"><span>ÚLTIMA APURAÇÃO</span><strong>${latest.name.slice(0, 3).toUpperCase()}</strong><p>${latest.status} · ${latest.weekLabels.length} semanas.</p></article>`;

    const monthlyTotals = data.months.map((month) => ({ month, value: month.team.reduce((sum, player) => sum + total(player), 0) }));
    const max = Math.max(...monthlyTotals.map((item) => item.value));
    document.querySelector("#trend-chart").innerHTML = monthlyTotals.map((item) => `
      <button class="trend-column" data-month="${item.month.id}" aria-label="Abrir ${item.month.name}: ${format.format(item.value)} pontos">
        <span class="trend-value">${format.format(item.value)}</span><i style="height:${Math.max(10, item.value / max * 100)}%"></i><b>${item.month.name.slice(0, 3).toUpperCase()}</b>
      </button>`).join("");
    document.querySelectorAll(".trend-column").forEach((button) => button.addEventListener("click", () => {
      activeMonthId = button.dataset.month; renderArchive(); activateView("ranking");
    }));
  }

  function renderHall() {
    const container = document.querySelector("#hall-experience");
    const champion = data.hall[activeHallIndex];
    const photo = champion.useExistingPhoto ? existingPhotos.get(champion.name) : null;
    const avatar = photo ? `<img src="${photo}" alt="${escapeHtml(champion.name)}">` : `<span>${escapeHtml(champion.initials)}</span>`;
    const reigns = champion.name ? data.hall.filter((item) => item.name === champion.name).length : 0;
    container.innerHTML = `<div class="hall-console reveal">
      <div class="hall-timeline" role="tablist" aria-label="Meses da temporada">${data.hall.map((item, index) => `<button class="${index === activeHallIndex ? "active" : ""} ${item.name ? "complete" : "pending"}" data-hall-index="${index}" role="tab" aria-selected="${index === activeHallIndex}"><span>${String(index + 2).padStart(2, "0")}</span><b>${escapeHtml(item.month.slice(0, 3).toUpperCase())}</b><i></i></button>`).join("")}</div>
      <article class="hall-spotlight ${champion.name ? "complete" : "pending"}">
        <div class="hall-copy"><span class="hall-overline">${String(activeHallIndex + 2).padStart(2, "0")} / ${data.meta.season} · ${champion.name ? "REGISTRO CONFIRMADO" : "AGUARDANDO DADOS"}</span><h3>${escapeHtml(champion.month)}</h3><p>${escapeHtml(champion.note)}</p>${champion.monthId ? `<button class="hall-ranking-link" data-open-month="${champion.monthId}">Abrir ranking completo <span>↗</span></button>` : ""}</div>
        <div class="hall-portrait"><div class="portrait-orbit"><i></i><i></i><i></i></div><div class="portrait-core ${champion.portraitOnly ? "portrait-only" : ""}">${avatar}</div><div class="portrait-crown">${champion.name ? "♛" : "—"}</div></div>
        <div class="hall-identity"><span>${champion.name ? "CAMPEÃO DO MÊS" : "SEM CAMPEÃO REGISTRADO"}</span><h4>${champion.name ? escapeHtml(champion.name) : "Em aberto"}</h4><div class="hall-facts"><div><b>${String(reigns).padStart(2, "0")}</b><small>${reigns === 1 ? "CONQUISTA" : "CONQUISTAS"}</small></div><div><b>${champion.monthId ? "OFICIAL" : "LEGADO"}</b><small>STATUS</small></div></div></div>
      </article>
      <div class="hall-navigation"><button data-hall-step="-1" ${activeHallIndex === 0 ? "disabled" : ""}>← Mês anterior</button><span><b>${String(activeHallIndex + 1).padStart(2, "0")}</b> / ${String(data.hall.length).padStart(2, "0")}</span><button data-hall-step="1" ${activeHallIndex === data.hall.length - 1 ? "disabled" : ""}>Próximo mês →</button></div>
    </div>`;
    container.querySelectorAll("[data-hall-index]").forEach((button) => button.addEventListener("click", () => { activeHallIndex = Number(button.dataset.hallIndex); renderHall(); }));
    container.querySelectorAll("[data-hall-step]").forEach((button) => button.addEventListener("click", () => { activeHallIndex = Math.max(0, Math.min(data.hall.length - 1, activeHallIndex + Number(button.dataset.hallStep))); renderHall(); }));
    container.querySelector("[data-open-month]")?.addEventListener("click", (event) => { activeMonthId = event.currentTarget.dataset.openMonth; renderArchive(); activateView("ranking"); });
    observeReveals();
  }

  function podiumMarkup(players) {
    const ordered = [players[1], players[0], players[2]];
    return ordered.map((player, visualIndex) => player ? `<article class="podium-card ${visualIndex === 1 ? "winner" : ""}">
      <span>${visualIndex === 1 ? "♛ CAMPEÃO" : visualIndex === 0 ? "02" : "03"}</span><h3>${escapeHtml(slugName(player.name))}</h3><strong>${format.format(total(player))}</strong><small>PONTOS</small>
    </article>` : "").join("");
  }

  function renderArchive() {
    const month = monthById(activeMonthId) || latestMonth();
    const players = rank(month[activeCategory] || []);
    document.querySelector("#month-tabs").innerHTML = [...data.months].sort((a, b) => a.id.localeCompare(b.id)).map((item) => `
      <button class="${item.id === month.id ? "active" : ""}" data-month="${item.id}"><span>${item.name}</span><small>${item.status}</small></button>`).join("");
    document.querySelectorAll("#month-tabs button").forEach((button) => button.addEventListener("click", () => { activeMonthId = button.dataset.month; renderArchive(); }));
    document.querySelectorAll("#category-toggle button").forEach((button) => button.classList.toggle("active", button.dataset.category === activeCategory));
    const grandTotal = players.reduce((sum, player) => sum + total(player), 0);
    const bestWeek = month.weekLabels.map((label, index) => ({ label, index, value: players.reduce((sum, player) => sum + Number(player.weeks[index] || 0), 0) })).sort((a, b) => b.value - a.value)[0];
    document.querySelector("#ranking-view").innerHTML = `
      <div class="archive-header reveal"><div><span>${month.status.toUpperCase()} · ${month.weekLabels.length} SEMANAS</span><h3>${month.name} / ${activeCategory === "team" ? "Equipe" : "Diretoria"}</h3></div><div class="archive-stats"><div><span>VOLUME</span><b>${format.format(grandTotal)}</b></div><div><span>MELHOR SEMANA</span><b class="best-week">Semana ${(bestWeek?.index ?? 0) + 1}<small>${escapeHtml(bestWeek?.label || "—")}</small></b></div></div></div>
      <div class="week-timeline reveal">${month.weekLabels.map((label, index) => `<div><span>S${index + 1}</span><p><b>Semana ${index + 1}</b><small>${escapeHtml(label)}</small></p></div>`).join("")}</div>
      <div class="podium-grid reveal">${podiumMarkup(players.slice(0, 3))}</div>
      <div class="ranking-table-wrap reveal"><table class="ranking-table"><thead><tr><th>POS</th><th>COMPETIDOR</th>${month.weekLabels.map((label, index) => `<th class="week-heading"><span>SEMANA ${index + 1}</span><small>${escapeHtml(label)}</small></th>`).join("")}<th>TOTAL</th><th>DIF.</th></tr></thead><tbody>${players.map((player, index) => {
        const score = total(player); const gap = total(players[0]) - score;
        return `<tr><td><span class="rank-number ${index < 3 ? "top" : ""}">${String(index + 1).padStart(2, "0")}</span></td><td><strong>${escapeHtml(player.name)}</strong></td>${month.weekLabels.map((_, week) => `<td>${format.format(player.weeks[week] || 0)}</td>`).join("")}<td class="total-cell">${format.format(score)}</td><td class="gap-cell">${index ? "−" + format.format(gap) : "LÍDER"}</td></tr>`;
      }).join("")}</tbody></table></div>
      <div class="source-note">Fonte: ${escapeHtml(data.meta.source)} · Aba original: ${escapeHtml(month.sourceSheet)} · ${escapeHtml(data.meta.methodology)}</div>`;
    observeReveals();
  }

  function observeReveals() {
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll(".reveal:not(.visible)").forEach((item) => observer.observe(item));
  }

  function activateView(viewId, updateHistory = true) {
    const target = document.querySelector(`[data-view="${viewId}"]`);
    if (!target) return;
    document.querySelectorAll(".app-view").forEach((view) => view.classList.toggle("active", view === target));
    document.querySelectorAll("[data-view-target]").forEach((button) => {
      const active = button.dataset.viewTarget === viewId;
      button.classList.toggle("active", active);
      if (button.getAttribute("role") === "tab") button.setAttribute("aria-selected", String(active));
    });
    target.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    if (updateHistory) history.replaceState(null, "", `#${viewId}`);
    document.querySelector("#command-nav")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-view-target]").forEach((button) => button.addEventListener("click", (event) => {
    event.preventDefault(); activateView(button.dataset.viewTarget);
  }));

  document.querySelector("#category-toggle").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]"); if (!button) return;
    activeCategory = button.dataset.category; renderArchive();
  });

  function initArena() {
    const arena = document.querySelector("#arena");
    if (!arena) return;
    const cards = [...arena.querySelectorAll(".strategy-card")];
    const toggleCard = (card, force) => {
      const open = force ?? !card.classList.contains("open");
      cards.forEach((item) => item !== card && item.classList.remove("open"));
      card.classList.toggle("open", open);
    };
    cards.forEach((card) => {
      card.addEventListener("click", (event) => { event.stopPropagation(); toggleCard(card); });
      card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleCard(card); } });
    });
    arena.querySelector(".strategy-filters")?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-tip-filter]"); if (!button) return;
      arena.querySelectorAll(".strategy-filters button").forEach((item) => item.classList.toggle("active", item === button));
      cards.forEach((card) => { card.classList.remove("open"); card.classList.toggle("filtered-out", button.dataset.tipFilter !== "all" && card.dataset.tip !== button.dataset.tipFilter); });
    });
    arena.querySelector("#celebrate-gold")?.addEventListener("click", (event) => {
      const button = event.currentTarget; button.classList.add("celebrating");
      for (let index = 0; index < 34; index += 1) {
        const particle = document.createElement("i"); particle.className = "gold-particle";
        particle.style.setProperty("--x", `${(Math.random() - .5) * 900}px`); particle.style.setProperty("--y", `${-90 - Math.random() * 520}px`);
        particle.style.setProperty("--r", `${Math.random() * 620 - 310}deg`); particle.style.setProperty("--delay", `${Math.random() * .18}s`);
        button.appendChild(particle); setTimeout(() => particle.remove(), 1500);
      }
      setTimeout(() => button.classList.remove("celebrating"), 1500);
    });
  }

  const rockPlayer = document.querySelector("#rock-player");
  const rockToggle = document.querySelector("#rock-toggle");
  const setRockOpen = (open) => { rockPlayer.classList.toggle("open", open); rockToggle.setAttribute("aria-expanded", String(open)); };
  rockToggle.addEventListener("click", () => setRockOpen(!rockPlayer.classList.contains("open")));
  document.querySelector("#rock-close").addEventListener("click", () => setRockOpen(false));

  renderHero(); renderOverview(); renderHall(); renderArchive(); initArena(); observeReveals();
  const requestedView = location.hash.replace("#", "") || new URLSearchParams(location.search).get("section");
  if (requestedView && document.querySelector(`[data-view="${requestedView}"]`)) setTimeout(() => activateView(requestedView, false), 150);
}());
