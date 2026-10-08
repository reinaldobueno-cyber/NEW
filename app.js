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

  document.title = "NEW! APOCALYPSE — Central de Performance";
  originalShell.className = "experience";
  originalShell.innerHTML = `
    <header class="cinematic-hero" id="inicio">
      <div class="hero-noise" aria-hidden="true"></div>
      <div class="hero-content">
        <div class="brand-mark"><img src="${logoSource}" alt="NEW! Apocalypse"></div>
        <div class="kicker"><span></span> Central oficial de performance · ${data.meta.season}</div>
        <h1>A guerra é escrita<br><em>em números.</em></h1>
        <p class="hero-copy">Histórico, evolução e glória. Cada semana conta. Cada ponto deixa uma marca.</p>
        <div class="hero-actions">
          <a class="primary-action" href="#ranking">Ver ranking atual <span>↘</span></a>
          <a class="ghost-action" href="#lancamento">Lançar números</a>
        </div>
      </div>
      <div class="hero-dashboard" id="hero-dashboard"></div>
      <div class="scroll-mark">EXPLORE <span></span></div>
    </header>

    <nav class="command-nav" aria-label="Navegação principal">
      <a class="nav-brand" href="#inicio"><span>NEW!</span> APOCALYPSE</a>
      <div class="nav-links">
        <a href="#visao">Visão</a><a href="#hall">Hall</a><a href="#ranking">Ranking</a><a href="#lancamento">Atualizar</a>
      </div>
      <div class="nav-status"><i></i> BASE ATIVA</div>
    </nav>

    <main>
      <section class="experience-section overview-section" id="visao">
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

      <section class="experience-section hall-section" id="hall">
        <div class="section-intro reveal">
          <div><span class="section-index">02 / LEGADO</span><h2>Hall da<br><em>Fama.</em></h2></div>
          <p>Os nomes que atravessaram o fogo e conquistaram o topo de cada mês.</p>
        </div>
        <div class="hall-film" id="hall-film"></div>
      </section>

      <section class="experience-section ranking-section" id="ranking">
        <div class="section-intro reveal">
          <div><span class="section-index">03 / ARQUIVO OFICIAL</span><h2>O campo<br>de batalha.</h2></div>
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

      <section class="experience-section launch-section" id="lancamento">
        <div class="section-intro reveal">
          <div><span class="section-index">04 / CENTRAL DE LANÇAMENTO</span><h2>Novos números.<br><em>Mesma precisão.</em></h2></div>
          <p>Cole uma faixa diretamente do Excel, valide o resultado e gere a base pronta para publicação.</p>
        </div>
        <div class="launch-grid reveal">
          <div class="launch-form">
            <div class="form-row">
              <label>Mês de referência<select id="launch-month"></select></label>
              <label>Categoria<select id="launch-category"><option value="team">Equipe</option><option value="directors">Diretoria</option></select></label>
            </div>
            <label class="paste-label">Dados copiados do Excel
              <textarea id="launch-data" spellcheck="false" placeholder="JOGADOR&#9;SEMANA 1&#9;SEMANA 2&#9;SEMANA 3&#10;NOME DO JOGADOR&#9;12500&#9;18400&#9;22300"></textarea>
            </label>
            <div class="launch-actions">
              <button class="primary-action button" id="apply-launch">Aplicar prévia</button>
              <button class="ghost-action button" id="load-template">Carregar mês atual</button>
              <button class="ghost-action button" id="download-data">Baixar base</button>
            </div>
            <div class="launch-message" id="launch-message" role="status"></div>
          </div>
          <aside class="launch-guide">
            <span class="guide-label">FLUXO RECOMENDADO</span>
            <ol><li><b>01</b><div><strong>Copie do Excel</strong><p>Nome na primeira coluna e uma semana por coluna.</p></div></li><li><b>02</b><div><strong>Valide na tela</strong><p>A classificação e os totais são recalculados na hora.</p></div></li><li><b>03</b><div><strong>Baixe a base</strong><p>Envie o arquivo gerado para publicação no site.</p></div></li></ol>
            <div class="integration-note"><span>PRÓXIMO NÍVEL</span><p>A estrutura já aceita integração futura com Google Sheets para atualização pública sem novo deploy.</p></div>
          </aside>
        </div>
      </section>
    </main>

    <footer class="cinematic-footer">
      <img src="${logoSource}" alt="" aria-hidden="true"><div><strong>NEW! APOCALYPSE</strong><span>O céu é o limite.</span></div>
      <p>Base oficial · Atualizada em ${new Date(data.meta.updatedAt + "T12:00:00").toLocaleDateString("pt-BR")}</p>
    </footer>`;

  function renderHero() {
    const month = latestMonth();
    const ranking = rank(month.team);
    const monthTotal = ranking.reduce((sum, player) => sum + total(player), 0);
    document.querySelector("#hero-dashboard").innerHTML = `
      <div class="live-line"><span><i></i> ÚLTIMO MÊS FECHADO</span><b>${month.name.toUpperCase()}</b></div>
      <div class="hero-rank"><div><span>CAMPEÃO</span><strong>${escapeHtml(slugName(ranking[0].name))}</strong><small>${format.format(total(ranking[0]))} PTS</small></div><div class="hero-crown">♛</div></div>
      <div class="hero-mini-stats"><div><span>PARTICIPANTES</span><b>${ranking.length}</b></div><div><span>VOLUME TOTAL</span><b>${format.format(monthTotal)}</b></div></div>`;
  }

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
      activeMonthId = button.dataset.month; renderArchive(); document.querySelector("#ranking").scrollIntoView({ behavior: "smooth" });
    }));
  }

  function renderHall() {
    document.querySelector("#hall-film").innerHTML = data.hall.map((champion, index) => {
      const photo = champion.useExistingPhoto ? existingPhotos.get(champion.name) : null;
      const avatar = photo ? `<img src="${photo}" alt="${escapeHtml(champion.name)}">` : `<span>${escapeHtml(champion.initials)}</span>`;
      return `<article class="legacy-card ${champion.name ? "won" : "pending"} reveal" style="--delay:${index * .06}s">
        <div class="legacy-top"><span>${String(index + 2).padStart(2, "0")} / 2026</span>${champion.name ? "<i>♛</i>" : "<i>—</i>"}</div>
        <div class="legacy-avatar">${avatar}</div><div class="legacy-month">${escapeHtml(champion.month)}</div>
        <h3>${champion.name ? escapeHtml(champion.name) : "Sem registro"}</h3><p>${escapeHtml(champion.note)}</p>
      </article>`;
    }).join("");
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
    const bestWeek = month.weekLabels.map((label, index) => ({ label, value: players.reduce((sum, player) => sum + Number(player.weeks[index] || 0), 0) })).sort((a, b) => b.value - a.value)[0];
    document.querySelector("#ranking-view").innerHTML = `
      <div class="archive-header reveal"><div><span>${month.status.toUpperCase()} · ${month.weekLabels.length} SEMANAS</span><h3>${month.name} / ${activeCategory === "team" ? "Equipe" : "Diretoria"}</h3></div><div class="archive-stats"><div><span>VOLUME</span><b>${format.format(grandTotal)}</b></div><div><span>MELHOR SEMANA</span><b>${escapeHtml(bestWeek?.label || "—")}</b></div></div></div>
      <div class="podium-grid reveal">${podiumMarkup(players.slice(0, 3))}</div>
      <div class="ranking-table-wrap reveal"><table class="ranking-table"><thead><tr><th>POS</th><th>COMPETIDOR</th>${month.weekLabels.map((_, index) => `<th>S${index + 1}</th>`).join("")}<th>TOTAL</th><th>DIF.</th></tr></thead><tbody>${players.map((player, index) => {
        const score = total(player); const gap = total(players[0]) - score;
        return `<tr><td><span class="rank-number ${index < 3 ? "top" : ""}">${String(index + 1).padStart(2, "0")}</span></td><td><strong>${escapeHtml(player.name)}</strong></td>${month.weekLabels.map((_, week) => `<td>${format.format(player.weeks[week] || 0)}</td>`).join("")}<td class="total-cell">${format.format(score)}</td><td class="gap-cell">${index ? "−" + format.format(gap) : "LÍDER"}</td></tr>`;
      }).join("")}</tbody></table></div>
      <div class="source-note">Fonte: ${escapeHtml(data.meta.source)} · Aba original: ${escapeHtml(month.sourceSheet)} · ${escapeHtml(data.meta.methodology)}</div>`;
    observeReveals();
  }

  function parseNumber(value) {
    const clean = String(value || "0").trim().replace(/\s/g, "");
    if (!clean) return 0;
    if (/^\d{1,3}(\.\d{3})+$/.test(clean)) return Number(clean.replaceAll(".", ""));
    return Number(clean.replace(",", ".")) || 0;
  }

  function parsePastedData(text) {
    const rows = text.trim().split(/\r?\n/).map((line) => line.split(/\t|;/).map((cell) => cell.trim())).filter((row) => row.some(Boolean));
    if (!rows.length) throw new Error("Cole pelo menos uma linha da planilha.");
    const hasHeader = /jogador|player|nome/i.test(rows[0][0]);
    const body = hasHeader ? rows.slice(1) : rows;
    const players = body.filter((row) => row[0]).map((row) => ({ name: row[0], weeks: row.slice(1).map(parseNumber) }));
    if (!players.length || players.some((player) => !player.weeks.length)) throw new Error("Use a primeira coluna para o jogador e as demais para as semanas.");
    const weekCount = Math.max(...players.map((player) => player.weeks.length));
    players.forEach((player) => { while (player.weeks.length < weekCount) player.weeks.push(0); });
    return { players, weekCount };
  }

  function renderLauncher() {
    const select = document.querySelector("#launch-month");
    select.innerHTML = [...data.months].sort((a, b) => a.id.localeCompare(b.id)).map((month) => `<option value="${month.id}" ${month.id === activeMonthId ? "selected" : ""}>${month.name} ${data.meta.season}</option>`).join("") + '<option value="new">+ Novo mês</option>';
    const textarea = document.querySelector("#launch-data");
    const categorySelect = document.querySelector("#launch-category");
    const message = document.querySelector("#launch-message");

    function loadTemplate() {
      const month = monthById(select.value === "new" ? activeMonthId : select.value) || latestMonth();
      const players = month[categorySelect.value] || [];
      textarea.value = ["JOGADOR", ...month.weekLabels.map((_, index) => `SEMANA ${index + 1}`)].join("\t") + "\n" + players.map((player) => [player.name, ...player.weeks].join("\t")).join("\n");
      message.textContent = `${players.length} registros carregados. Edite ou cole novos valores.`;
    }

    document.querySelector("#load-template").addEventListener("click", loadTemplate);
    categorySelect.addEventListener("change", () => { if (select.value !== "new") loadTemplate(); });
    select.addEventListener("change", () => { if (select.value !== "new") loadTemplate(); else { textarea.value = "JOGADOR\tSEMANA 1\tSEMANA 2\tSEMANA 3\tSEMANA 4\n"; message.textContent = "Base vazia criada. Informe os jogadores e valores."; } });
    document.querySelector("#apply-launch").addEventListener("click", () => {
      try {
        const parsed = parsePastedData(textarea.value);
        let month = monthById(select.value);
        if (!month) {
          const nextNumber = Number(prompt("Número do novo mês (1 a 12):", "10"));
          if (!nextNumber || nextNumber < 1 || nextNumber > 12) return;
          const names = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
          month = { id: `${data.meta.season}-${String(nextNumber).padStart(2, "0")}`, name: names[nextNumber - 1], status: "Em apuração", sourceSheet: "Lançamento manual", weekLabels: Array.from({ length: parsed.weekCount }, (_, index) => `Semana ${index + 1}`), team: [], directors: [] };
          data.months.push(month); select.value = month.id;
        }
        month[categorySelect.value] = parsed.players;
        month.weekLabels = Array.from({ length: parsed.weekCount }, (_, index) => month.weekLabels[index] || `Semana ${index + 1}`);
        activeMonthId = month.id; activeCategory = categorySelect.value;
        localStorage.setItem("new-apocalypse-draft", JSON.stringify(data));
        renderHero(); renderOverview(); renderArchive();
        message.innerHTML = `<strong>Prévia aplicada:</strong> ${parsed.players.length} competidores e ${parsed.weekCount} semanas. Rascunho salvo neste navegador.`;
      } catch (error) { message.textContent = error.message; }
    });
    document.querySelector("#download-data").addEventListener("click", () => {
      const contents = `window.NEW_APOCALYPSE_DATA = ${JSON.stringify(data, null, 2)};\n`;
      const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([contents], { type: "text/javascript;charset=utf-8" }));
      link.download = "data.js"; link.click(); URL.revokeObjectURL(link.href);
      message.textContent = "data.js gerado. Este é o arquivo que deve ser publicado no repositório.";
    });
  }

  function observeReveals() {
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll(".reveal:not(.visible)").forEach((item) => observer.observe(item));
  }

  document.querySelector("#category-toggle").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]"); if (!button) return;
    activeCategory = button.dataset.category; renderArchive();
  });

  renderHero(); renderOverview(); renderHall(); renderArchive(); renderLauncher(); observeReveals();
  if (location.hash) requestAnimationFrame(() => {
    const target = document.querySelector(location.hash);
    target?.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    target?.scrollIntoView();
  });
}());
