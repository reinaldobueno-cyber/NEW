(function () {
  "use strict";

  const data = window.NEW_APOCALYPSE_DATA;
  if (!data) return;

  const number = new Intl.NumberFormat("pt-BR");
  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const total = (player) => player.weeks.reduce((sum, value) => sum + value, 0);
  const rankedTeam = () => [...data.battle.team].sort((a, b) => total(b) - total(a));

  function renderHall() {
    const track = document.querySelector("#c1 .hall-track");
    if (!track) return;

    const photos = new Map(
      [...track.querySelectorAll(".hc")].map((card) => [
        card.querySelector("h3")?.textContent.trim(),
        card.querySelector("img")?.getAttribute("src")
      ])
    );

    track.innerHTML = data.hall.map((champion, index) => {
      const winner = Boolean(champion.name);
      const photo = champion.useExistingPhoto ? photos.get(champion.name) : null;
      const avatar = photo
        ? `<img src="${photo}" alt="${escapeHtml(champion.name)}">`
        : `<span>${escapeHtml(champion.initials)}</span>`;

      return `<article class="hc${winner ? " win" : ""}" style="animation-delay:${(index * 0.1).toFixed(1)}s">
        <div class="mo">${escapeHtml(champion.displayMonth || champion.month)}</div>
        ${winner ? '<div class="crown">♛</div>' : ""}
        <div class="av">${avatar}</div>
        <div class="bd"><h3>${winner ? escapeHtml(champion.name) : "—"}</h3><div class="note">${escapeHtml(champion.note)}</div></div>
      </article>`;
    }).join("");
  }

  function podiumMarkup(players) {
    const places = [players[1], players[0], players[2]];
    return places.map((player, index) => {
      if (!player) return "";
      const first = index === 1;
      const playerTotal = player.total ?? total(player);
      return `<div class="pc${first ? " f" : ""}">
        <div class="md">${first ? "♛" : index === 0 ? "2º" : "3º"}</div>
        <h3>${escapeHtml(player.name)}</h3>
        <div class="pts">${number.format(playerTotal)}</div>
      </div>`;
    }).join("");
  }

  function renderBattle() {
    const section = document.querySelector("#c2");
    if (!section) return;

    const ranking = rankedTeam();
    const pods = section.querySelectorAll(".pod");
    if (pods[0]) pods[0].innerHTML = podiumMarkup(ranking.slice(0, 3));
    if (pods[1]) {
      const directors = [...data.battle.directors].sort((a, b) => b.total - a.total);
      pods[1].innerHTML = podiumMarkup(directors);
    }

    const tbody = section.querySelector("tbody");
    if (tbody) {
      tbody.innerHTML = ranking.map((player, index) => {
        const rankClass = index < 3 ? ` t${index + 1}` : "";
        const weeks = Array.from({ length: data.battle.totalWeeks }, (_, week) => player.weeks[week] || 0);
        return `<tr>
          <td class="r${rankClass}">${String(index + 1).padStart(2, "0")}</td>
          <td class="nm">${escapeHtml(player.name)}</td>
          ${weeks.map((value) => `<td class="num">${value}</td>`).join("")}
          <td class="tot">${total(player)}</td>
        </tr>`;
      }).join("");
    }

    const remaining = data.battle.totalWeeks - data.battle.computedWeeks;
    const leader = ranking[0];
    const subtitle = section.querySelector(".ch-sub");
    const narrative = section.querySelector(".narr p");
    if (subtitle) subtitle.textContent = `Equipe · ${data.battle.computedWeeks} semanas computadas`;
    if (narrative && leader) {
      narrative.innerHTML = `<strong>${escapeHtml(leader.name.replace(" - LIDER", ""))}</strong> lidera com ${number.format(total(leader))} pts. <strong>${escapeHtml(ranking[1]?.name || "")}</strong> em 2º. ${remaining} semanas restantes no mês.`;
    }
  }

  function renderCharts() {
    const bars = document.querySelectorAll("#c3 .bars");
    const render = (items, director) => items.map((item) => `<div class="c">
      <div class="v">${escapeHtml(item.display || "-")}</div>
      <div class="b${director ? " dir" : ""}" style="height:${Math.max(4, Math.min(100, item.height))}%" role="img" aria-label="${escapeHtml(item.label)}"></div>
      <div class="l">${escapeHtml(item.label)}</div>
    </div>`).join("");

    if (bars[0]) bars[0].innerHTML = render(data.charts.team, false);
    if (bars[1]) bars[1].innerHTML = render(data.charts.directors, true);
  }

  renderHall();
  renderBattle();
  renderCharts();
}());
