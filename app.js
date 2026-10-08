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

      <section class="experience-section arena-section arena-v2 arena-v3 app-view" id="arena" data-view="arena">
        <section class="shortcut-hub">
          <header class="shortcut-hero">
            <div><span>NEW DATABASE · ROUND 6: O CÉU É O LIMITE</span><h2>ATALHOS<br><em>DA EQUIPE.</em></h2><p>Vídeos curtos. Nome claro. O macete certo na hora da rodada.</p></div>
            <button id="shortcut-add"><i>＋</i><span><b>ADICIONAR ATALHO</b><small>Nome + personagem + vídeo</small></span></button>
          </header>
          <div class="shortcut-toolbar"><div><button class="active" data-shortcut-filter="all">TODOS</button><button data-shortcut-filter="SPUD">SPUD</button><button data-shortcut-filter="RAJA">RAJA</button><button data-shortcut-filter="OUTROS">OUTROS</button></div><span id="shortcut-count">CARREGANDO...</span></div>
          <div class="shortcut-grid" id="shortcut-grid"><div class="shortcut-loading"><i></i><strong>BUSCANDO ATALHOS</strong></div></div>
          <div class="shortcut-empty" id="shortcut-empty" hidden><b>＋</b><h3>Nenhum atalho publicado.</h3><p>Clique em “Adicionar atalho”, dê um nome e envie o vídeo.</p></div>
          <div class="shortcut-admin-modal" id="shortcut-admin-modal" aria-hidden="true">
            <div class="shortcut-admin-card"><button class="shortcut-modal-close" type="button" aria-label="Fechar">×</button>
              <div class="shortcut-form-head"><span>PUBLICAÇÃO DA DIRETORIA</span><h3>Novo atalho</h3><p>Cadastre somente o necessário. O vídeo entra na biblioteca assim que o envio terminar.</p></div>
              <form id="shortcut-form">
                <label class="field-wide"><span>NOME DO ATALHO *</span><input id="shortcut-title" maxlength="120" required placeholder="Ex.: Pulo secreto da ponte"></label>
                <label><span>PERSONAGEM</span><select id="shortcut-character"><option>SPUD</option><option>RAJA</option><option>ACE</option><option>DJ</option><option>DANI</option><option>BINNIE</option><option>KARA</option><option>BEATRIZ</option><option>OUTROS</option></select></label>
                <label><span>MAPA / JOGO</span><select id="shortcut-map"><option>Ponte de Vidro</option><option>Batatinha Frita 1, 2, 3</option><option>Dalgona</option><option>Esconde-Esconde</option><option>Mingle</option><option>Pular Corda</option><option>Sky Squid Game</option><option>Outros</option></select></label>
                <label class="field-wide"><span>DESCRIÇÃO CURTA</span><textarea id="shortcut-description" maxlength="300" placeholder="O que o jogador precisa fazer?"></textarea></label>
                <div class="video-source field-wide"><span>VÍDEO *</span><label class="video-drop" for="shortcut-file"><input type="file" id="shortcut-file" accept="video/*"><b>↑ ESCOLHER VÍDEO</b><small id="shortcut-file-name">MP4, MOV ou WebM</small></label><i>OU</i><input type="url" id="shortcut-url" placeholder="Cole um link do YouTube ou vídeo HTTPS"></div>
                <label class="field-wide password-field"><span>SENHA DA DIRETORIA *</span><input type="password" id="shortcut-password" required autocomplete="current-password" placeholder="••••••••"></label>
                <div class="upload-progress field-wide" id="upload-progress" hidden><span><b id="upload-progress-label">ENVIANDO VÍDEO</b><i id="upload-progress-value">0%</i></span><div><i id="upload-progress-bar"></i></div></div>
                <p class="shortcut-form-error field-wide" id="shortcut-form-error" role="alert"></p>
                <button class="shortcut-submit field-wide" type="submit">PUBLICAR ATALHO <b>→</b></button>
              </form>
            </div>
          </div>
          <div class="shortcut-player-modal" id="shortcut-player-modal" aria-hidden="true"><button class="shortcut-player-close" aria-label="Fechar">×</button><div class="shortcut-player-content" id="shortcut-player-content"></div></div>
        </section>
        <section class="arena-cinema reveal">
          <div class="arena-cinema-bg" aria-hidden="true"></div><div class="cinema-grain" aria-hidden="true"></div>
          <div class="arena-cinema-copy"><span class="cinema-kicker"><i></i> ROUND 6: O CÉU É O LIMITE · CENTRAL NEW</span><h2>CONHEÇA<br>O JOGO.<br><em>DOMINE.</em></h2><p>Personagens, rotas, bugs e conquistas reais da equipe.</p><div class="cinema-actions"><button class="cinema-primary" id="arena-characters">ESCOLHER PERSONAGEM <b>↓</b></button><button class="cinema-secondary" id="arena-enter">▶ ABRIR BUG LAB</button></div></div>
          <aside class="weekly-gold"><span>CONQUISTA DA SEMANA</span><strong>OURO</strong><p>Missão concluída em equipe</p><div><b>01</b><small>TROFÉU<br>DESBLOQUEADO</small></div></aside>
          <div class="cinema-scroll">ROLE PARA EXPLORAR <i></i></div>
        </section>

        <section class="character-command reveal" id="character-command">
          <div class="character-stage"><div class="character-stage-art" aria-label="Personagens oficiais de Round 6: O Céu é o Limite"></div><div class="character-stage-label"><span>ELENCO DO JOGO</span><strong id="character-name">SPUD</strong><small id="character-meta">JOGADOR 444 · PERSONAGEM SELECIONADO</small></div></div>
          <div class="character-console">
            <span class="character-eyebrow">01 / SELECIONE O PERSONAGEM</span><h3>Quem entra<br>na próxima rodada?</h3><p id="character-copy">Use Spud como filtro para reunir vídeos, bugs, rotas e melhores momentos gravados com o personagem.</p>
            <div class="character-roster" role="listbox" aria-label="Personagens do jogo">
              <button class="active" data-character="SPUD" data-meta="JOGADOR 444 · PERSONAGEM SELECIONADO" data-copy="Use Spud como filtro para reunir vídeos, bugs, rotas e melhores momentos gravados com o personagem."><b>444</b><span>SPUD</span></button>
              <button data-character="RAJA" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="Centralize aqui os tutoriais e bugs que a equipe descobriu jogando com Raja."><b>R</b><span>RAJA</span></button>
              <button data-character="ACE" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="Selecione Ace para abrir as jogadas, atalhos e vídeos catalogados pela equipe."><b>A</b><span>ACE</span></button>
              <button data-character="DJ" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="O dossiê de DJ será alimentado com os melhores momentos enviados pela NEW."><b>DJ</b><span>DJ</span></button>
              <button data-character="DANI" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="Organize as técnicas de Dani por mapa, nível e dificuldade de execução."><b>D</b><span>DANI</span></button>
              <button data-character="BINNIE" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="Abra o arquivo de Binnie e conecte cada vídeo ao macete correspondente."><b>B</b><span>BINNIE</span></button>
              <button data-character="KARA" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="As rotas e descobertas com Kara ficarão registradas neste painel."><b>K</b><span>KARA</span></button>
              <button data-character="BEATRIZ" data-meta="PERSONAGEM · DOSSIÊ NEW" data-copy="Transforme as partidas com Beatriz em conhecimento compartilhado pela equipe."><b>BE</b><span>BEATRIZ</span></button>
            </div>
            <button class="character-open-lab" id="character-open-lab">VER BUGS DE <span>SPUD</span> <b>→</b></button>
          </div>
        </section>

        <section class="progress-journey reveal">
          <div class="arena-v2-heading"><span>TRILHA DA EQUIPE</span><h3>Cada rodada deixa uma marca.</h3></div>
          <div class="journey-rail"><button class="journey-node active won" data-stage="gold"><i>★</i><span>OURO</span><small>CONQUISTADO</small></button><button class="journey-node" data-stage="streak"><i>02</i><span>SEQUÊNCIA</span><small>PRÓXIMO ALVO</small></button><button class="journey-node" data-stage="bugs"><i>△</i><span>BUG MASTER</span><small>4 VÍDEOS</small></button><button class="journey-node" data-stage="legend"><i>∞</i><span>LENDA NEW</span><small>FASE FINAL</small></button></div>
          <div class="journey-detail"><span id="stage-label">FASE 01 · CONCLUÍDA</span><strong id="stage-title">Ouro da semana</strong><p id="stage-copy">A primeira grande conquista já entrou para a história da equipe.</p><div><i id="stage-progress" style="width:25%"></i></div></div>
        </section>

        <section class="bug-lab reveal" id="bug-lab">
          <div class="arena-v2-heading"><span>BUG LAB · ARQUIVO DA EQUIPE</span><h3>Os atalhos que mudam a rodada.</h3><p>Selecione um dossiê. A central já está pronta para receber os vídeos gravados pela NEW.</p></div>
          <div class="bug-lab-layout">
            <div class="bug-screen" id="bug-screen"><div class="screen-grid"></div><span class="screen-tag" id="bug-screen-tag">PONTE DE VIDRO</span><button class="screen-play" id="bug-screen-play" aria-label="Abrir vídeo"><i>▶</i></button><div class="screen-copy"><small id="bug-screen-level">BUG LAB 01 · AVANÇADO</small><h4 id="bug-screen-title">Rota segura da ponte</h4><p id="bug-screen-desc">O vídeo mostrará o posicionamento usado pela equipe para ler a rota e reduzir o risco.</p></div><div class="screen-status"><i></i> SLOT PRONTO · AGUARDANDO VÍDEO</div></div>
            <div class="bug-playlist" role="listbox" aria-label="Vídeos do Bug Lab">
              <button class="bug-video-card active" data-tag="PONTE DE VIDRO" data-level="BUG LAB 01 · AVANÇADO" data-title="Rota segura da ponte" data-desc="O vídeo mostrará o posicionamento usado pela equipe para ler a rota e reduzir o risco."><b>01</b><i>▶</i><span><strong>Rota segura da ponte</strong><small>MOVIMENTO · CÂMERA</small></span></button>
              <button class="bug-video-card" data-tag="VISÃO TÁTICA" data-level="BUG LAB 02 · ESSENCIAL" data-title="Câmera antecipada" data-desc="Como ampliar a leitura do cenário e enxergar a ameaça antes do movimento decisivo."><b>02</b><i>▶</i><span><strong>Câmera antecipada</strong><small>VISÃO · TIMING</small></span></button>
              <button class="bug-video-card" data-tag="SPAWN" data-level="BUG LAB 03 · RARO" data-title="Spawn inteligente" data-desc="Uma demonstração do ponto de partida que abre uma rota mais eficiente para o esquadrão."><b>03</b><i>▶</i><span><strong>Spawn inteligente</strong><small>ROTA · VANTAGEM</small></span></button>
              <button class="bug-video-card" data-tag="MOVIMENTO" data-level="BUG LAB 04 · SECRETO" data-title="Atalho de movimento" data-desc="A técnica registrada pela NEW para ganhar tempo sem perder o controle do personagem."><b>04</b><i>▶</i><span><strong>Atalho de movimento</strong><small>BUG · EXECUÇÃO</small></span></button>
              <div class="playlist-note"><strong>04 SLOTS CRIADOS</strong><span>Envie os links ou arquivos dos vídeos para ativá-los.</span></div>
            </div>
          </div>
        </section>

        <section class="decision-room reveal"><div class="decision-copy"><span>SIMULAÇÃO INTERATIVA · 01</span><h3>A ponte abriu.<br>Qual é a chamada?</h3><p>Escolha como se a rodada estivesse valendo.</p></div><div class="decision-console"><div class="decision-timer"><span>DECISÃO DO ESQUADRÃO</span><b id="decision-score">00</b></div><button data-choice="rush"><i>A</i><span><strong>Correr primeiro</strong><small>Ganhar espaço antes da leitura</small></span></button><button data-choice="observe" data-correct="true"><i>B</i><span><strong>Observar e memorizar</strong><small>Transformar cada salto em informação</small></span></button><button data-choice="split"><i>C</i><span><strong>Dividir o esquadrão</strong><small>Testar duas rotas ao mesmo tempo</small></span></button><div class="decision-result" id="decision-result">SELECIONE UMA ESTRATÉGIA</div></div></section>
        <div class="video-modal" id="bug-video-modal" aria-hidden="true"><button class="video-modal-close" aria-label="Fechar">×</button><div><span>ARQUIVO SELECIONADO</span><h3 id="modal-video-title">Rota segura da ponte</h3><i>▶</i><p>O player está pronto. Envie o link do YouTube, Google Drive ou o arquivo gravado para publicarmos o tutorial aqui.</p><small>CONTEÚDO INTERNO DA EQUIPE NEW</small></div></div>
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

  function initShortcutHub() {
    const hub = document.querySelector(".shortcut-hub");
    if (!hub) return;
    const api = "https://new-arena-api.reinaldo-bueno.workers.dev";
    const grid = hub.querySelector("#shortcut-grid"); const empty = hub.querySelector("#shortcut-empty");
    const adminModal = hub.querySelector("#shortcut-admin-modal"); const playerModal = hub.querySelector("#shortcut-player-modal");
    const form = hub.querySelector("#shortcut-form"); let entries = []; let filter = "all";
    const encode = (value) => encodeURIComponent(String(value || ""));
    const youtubeEmbed = (url) => {
      try { const parsed = new URL(url); const id = parsed.hostname.includes("youtu.be") ? parsed.pathname.slice(1) : parsed.searchParams.get("v"); return id ? `https://www.youtube.com/embed/${id}` : ""; } catch { return ""; }
    };
    const render = () => {
      const visible = entries.filter((item) => filter === "all" || (filter === "OUTROS" ? !["SPUD", "RAJA"].includes(item.character) : item.character === filter));
      hub.querySelector("#shortcut-count").textContent = `${visible.length.toString().padStart(2, "0")} ${visible.length === 1 ? "ATALHO" : "ATALHOS"}`;
      empty.hidden = visible.length > 0; grid.hidden = visible.length === 0;
      grid.innerHTML = visible.map((item, index) => `<article class="shortcut-card" data-id="${escapeHtml(item.id)}" style="--delay:${index * 45}ms"><button class="shortcut-card-play" aria-label="Reproduzir ${escapeHtml(item.title)}"><span>▶</span><small>ABRIR VÍDEO</small></button><div class="shortcut-card-number">${String(index + 1).padStart(2, "0")}</div><div class="shortcut-card-copy"><span>${escapeHtml(item.character)} · ${escapeHtml(item.map)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || "Vídeo tático da equipe NEW.")}</p><small>PUBLICADO EM ${new Date(item.createdAt).toLocaleDateString("pt-BR")}</small></div></article>`).join("");
    };
    const load = async () => {
      try { const request = await fetch(`${api}/shortcuts`, { cache: "no-store" }); if (!request.ok) throw new Error(); entries = await request.json(); render(); }
      catch { grid.innerHTML = '<div class="shortcut-load-error"><strong>BASE TEMPORARIAMENTE INDISPONÍVEL</strong><span>Tente novamente em alguns instantes.</span></div>'; hub.querySelector("#shortcut-count").textContent = "OFFLINE"; }
    };
    hub.querySelector("#shortcut-add")?.addEventListener("click", () => { adminModal.classList.add("open"); adminModal.setAttribute("aria-hidden", "false"); setTimeout(() => hub.querySelector("#shortcut-title")?.focus(), 200); });
    const closeAdmin = () => { adminModal.classList.remove("open"); adminModal.setAttribute("aria-hidden", "true"); };
    hub.querySelector(".shortcut-modal-close")?.addEventListener("click", closeAdmin);
    adminModal.addEventListener("click", (event) => { if (event.target === adminModal) closeAdmin(); });
    hub.querySelector("#shortcut-file")?.addEventListener("change", (event) => { const file = event.target.files[0]; hub.querySelector("#shortcut-file-name").textContent = file ? `${file.name} · ${(file.size / 1048576).toFixed(1)} MB` : "MP4, MOV ou WebM"; });
    hub.querySelector(".shortcut-toolbar")?.addEventListener("click", (event) => { const button = event.target.closest("button[data-shortcut-filter]"); if (!button) return; filter = button.dataset.shortcutFilter; hub.querySelectorAll("[data-shortcut-filter]").forEach((item) => item.classList.toggle("active", item === button)); render(); });
    grid.addEventListener("click", (event) => {
      const card = event.target.closest(".shortcut-card"); if (!card) return; const item = entries.find((entry) => entry.id === card.dataset.id); if (!item) return;
      const embed = youtubeEmbed(item.videoUrl); const media = embed ? `<iframe src="${escapeHtml(embed)}" title="${escapeHtml(item.title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>` : `<video src="${escapeHtml(item.videoUrl)}" controls autoplay playsinline></video>`;
      hub.querySelector("#shortcut-player-content").innerHTML = `${media}<div><span>${escapeHtml(item.character)} · ${escapeHtml(item.map)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || "")}</p></div>`;
      playerModal.classList.add("open"); playerModal.setAttribute("aria-hidden", "false");
    });
    const closePlayer = () => { playerModal.classList.remove("open"); playerModal.setAttribute("aria-hidden", "true"); hub.querySelector("#shortcut-player-content").innerHTML = ""; };
    hub.querySelector(".shortcut-player-close")?.addEventListener("click", closePlayer); playerModal.addEventListener("click", (event) => { if (event.target === playerModal) closePlayer(); });
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); const error = hub.querySelector("#shortcut-form-error"); error.textContent = "";
      const title = hub.querySelector("#shortcut-title").value.trim(); const character = hub.querySelector("#shortcut-character").value; const map = hub.querySelector("#shortcut-map").value;
      const description = hub.querySelector("#shortcut-description").value.trim(); const password = hub.querySelector("#shortcut-password").value; const file = hub.querySelector("#shortcut-file").files[0]; const videoUrl = hub.querySelector("#shortcut-url").value.trim();
      if (!file && !videoUrl) { error.textContent = "Selecione um vídeo ou cole um link."; return; }
      const id = crypto.randomUUID(); const progress = hub.querySelector("#upload-progress"); const submit = hub.querySelector(".shortcut-submit"); progress.hidden = false; submit.disabled = true;
      try {
        if (file) {
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest(); xhr.open("PUT", `${api}/shortcuts/${id}/video`); xhr.setRequestHeader("content-type", file.type || "video/mp4"); xhr.setRequestHeader("x-admin-password", password); xhr.setRequestHeader("x-title", encode(title)); xhr.setRequestHeader("x-character", encode(character)); xhr.setRequestHeader("x-map", encode(map)); xhr.setRequestHeader("x-description", encode(description));
            xhr.upload.onprogress = (upload) => { if (!upload.lengthComputable) return; const value = Math.round(upload.loaded / upload.total * 100); hub.querySelector("#upload-progress-value").textContent = `${value}%`; hub.querySelector("#upload-progress-bar").style.width = `${value}%`; };
            xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(JSON.parse(xhr.responseText || "{}").error || "Falha no envio.")); xhr.onerror = () => reject(new Error("Falha de conexão durante o envio.")); xhr.send(file);
          });
        } else {
          const request = await fetch(`${api}/shortcuts/${id}/link`, { method: "POST", headers: { "content-type": "application/json", "x-admin-password": password }, body: JSON.stringify({ title, character, map, description, videoUrl }) });
          const result = await request.json(); if (!request.ok) throw new Error(result.error || "Falha na publicação.");
        }
        hub.querySelector("#upload-progress-label").textContent = "PUBLICADO"; hub.querySelector("#upload-progress-value").textContent = "100%"; hub.querySelector("#upload-progress-bar").style.width = "100%";
        await load(); setTimeout(() => { closeAdmin(); form.reset(); progress.hidden = true; hub.querySelector("#shortcut-file-name").textContent = "MP4, MOV ou WebM"; hub.querySelector("#upload-progress-label").textContent = "ENVIANDO VÍDEO"; }, 650);
      } catch (failure) { error.textContent = failure.message; } finally { submit.disabled = false; }
    });
    load();
  }

  function initArena() {
    const arena = document.querySelector("#arena");
    if (!arena) return;
    arena.querySelector("#arena-enter")?.addEventListener("click", () => arena.querySelector("#bug-lab")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    arena.querySelector("#arena-characters")?.addEventListener("click", () => arena.querySelector("#character-command")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    arena.querySelectorAll(".character-roster button").forEach((button) => button.addEventListener("click", () => {
      arena.querySelectorAll(".character-roster button").forEach((item) => item.classList.toggle("active", item === button));
      arena.querySelector("#character-name").textContent = button.dataset.character;
      arena.querySelector("#character-meta").textContent = button.dataset.meta;
      arena.querySelector("#character-copy").textContent = button.dataset.copy;
      arena.querySelector("#character-open-lab span").textContent = button.dataset.character;
      const stage = arena.querySelector(".character-stage"); stage.classList.remove("character-swap"); requestAnimationFrame(() => stage.classList.add("character-swap"));
    }));
    arena.querySelector("#character-open-lab")?.addEventListener("click", () => arena.querySelector("#bug-lab")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    const stages = {
      gold: ["FASE 01 · CONCLUÍDA", "Ouro da semana", "A primeira grande conquista já entrou para a história da equipe.", "25%"],
      streak: ["FASE 02 · EM ANDAMENTO", "Ouro consecutivo", "A próxima missão é provar que a vitória não foi acaso: é padrão.", "48%"],
      bugs: ["FASE 03 · ARQUIVO ABERTO", "Bug Master", "Publique os quatro vídeos secretos e transforme descoberta em vantagem coletiva.", "72%"],
      legend: ["FASE 04 · BLOQUEADA", "Lenda NEW", "O nível máximo espera a equipe que domina estratégia, execução e constância.", "100%"]
    };
    arena.querySelectorAll(".journey-node").forEach((button) => button.addEventListener("click", () => {
      arena.querySelectorAll(".journey-node").forEach((item) => item.classList.toggle("active", item === button));
      const [label, title, copy, progress] = stages[button.dataset.stage];
      arena.querySelector("#stage-label").textContent = label; arena.querySelector("#stage-title").textContent = title;
      arena.querySelector("#stage-copy").textContent = copy; arena.querySelector("#stage-progress").style.width = progress;
    }));
    const modal = arena.querySelector("#bug-video-modal");
    arena.querySelectorAll(".bug-video-card").forEach((button) => button.addEventListener("click", () => {
      arena.querySelectorAll(".bug-video-card").forEach((item) => item.classList.toggle("active", item === button));
      arena.querySelector("#bug-screen-tag").textContent = button.dataset.tag; arena.querySelector("#bug-screen-level").textContent = button.dataset.level;
      arena.querySelector("#bug-screen-title").textContent = button.dataset.title; arena.querySelector("#bug-screen-desc").textContent = button.dataset.desc;
      const screen = arena.querySelector("#bug-screen"); screen.classList.remove("pulse"); requestAnimationFrame(() => screen.classList.add("pulse"));
    }));
    arena.querySelector("#bug-screen-play")?.addEventListener("click", () => {
      arena.querySelector("#modal-video-title").textContent = arena.querySelector("#bug-screen-title").textContent;
      modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    });
    const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
    modal?.querySelector(".video-modal-close")?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    arena.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
      arena.querySelectorAll("[data-choice]").forEach((item) => { item.classList.remove("right", "wrong"); item.disabled = true; });
      const correct = button.dataset.correct === "true"; button.classList.add(correct ? "right" : "wrong");
      if (!correct) arena.querySelector('[data-correct="true"]').classList.add("right");
      arena.querySelector("#decision-score").textContent = correct ? "100" : "40";
      arena.querySelector("#decision-result").textContent = correct ? "DECISÃO PERFEITA · INFORMAÇÃO É VANTAGEM" : "RISCO ALTO · A MELHOR LEITURA ERA OBSERVAR";
      setTimeout(() => arena.querySelectorAll("[data-choice]").forEach((item) => { item.disabled = false; }), 900);
    }));
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
    arena.querySelector("#celebrate-v2")?.addEventListener("click", (event) => {
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

  renderHero(); renderOverview(); renderHall(); renderArchive(); initShortcutHub(); initArena(); observeReveals();
  const requestedView = location.hash.replace("#", "") || new URLSearchParams(location.search).get("section");
  if (requestedView && document.querySelector(`[data-view="${requestedView}"]`)) setTimeout(() => activateView(requestedView, false), 150);
}());
