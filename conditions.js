/* =========================================================
   ポケくじ
   ⑦ 抽選条件・縛り設定
   conditions.js
========================================================= */

(() => {

  "use strict";


  /* =========================================================
     元の関数を保存
  ========================================================= */

  const originalGetPokemonPool =
    getPokemonPool;

  const originalBuildTeam =
    buildTeam;

  const originalRebuildUnlockedSlots =
    rebuildUnlockedSlots;

  const originalGetAvailablePokemon =
    getAvailablePokemon;

  const originalDrawTodayPokemon =
    drawTodayPokemon;

  const originalDrawPokemon =
    drawPokemon;


  /* =========================================================
     定数
  ========================================================= */

  const CONDITIONS_STORAGE_KEY =
    "pokeKujiConditionsV1";

  let conditionsBypass =
    false;

  let conditionLastError =
    "";


  /* =========================================================
     CSS
  ========================================================= */

  const style =
    document.createElement(
      "style"
    );

  style.textContent = `

    .condition-button {
      width: 100%;
      border: 1px solid #555;
      background: #fff;
      color: #333;
      border-radius: 16px;
      padding: 15px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      margin-bottom: 12px;
    }

    .condition-button.active {
      background: #f4f4f5;
    }

    .condition-panel {
      display: none;
      padding: 18px;
      margin-bottom: 18px;
      border-radius: 18px;
      border: 1px solid #ddd;
      background: #fafafa;
    }

    .condition-panel.show {
      display: block;
    }

    .condition-title {
      font-size: 18px;
      font-weight: 900;
      margin-bottom: 5px;
    }

    .condition-description {
      color: #888;
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 18px;
    }

    .condition-group {
      margin-bottom: 17px;
    }

    .condition-label {
      display: block;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 7px;
    }

    .condition-select {
      width: 100%;
      padding: 12px 35px 12px 12px;
      border-radius: 12px;
      border: 1px solid #ddd;
      background: #fff;
      color: #333;
      font-size: 14px;
      font-weight: 700;
    }

    .condition-help {
      color: #999;
      font-size: 11px;
      line-height: 1.5;
      margin-top: 6px;
    }

    .condition-special {
      padding: 14px;
      border-radius: 14px;
      background: #fff;
      border: 1px solid #e8e8e8;
      margin-bottom: 17px;
    }

    .condition-reset {
      width: 100%;
      border: 1px solid #ddd;
      background: #fff;
      color: #666;
      border-radius: 12px;
      padding: 12px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .condition-summary {
      margin-top: 14px;
      padding: 12px;
      border-radius: 12px;
      background: #f0f1f3;
      color: #666;
      font-size: 12px;
      line-height: 1.7;
    }

    .condition-warning {
      margin-top: 12px;
      color: #d65b00;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.6;
    }

  `;

  document.head.appendChild(
    style
  );


  /* =========================================================
     UI作成
  ========================================================= */

  function createConditionUI() {

    const drawButton =
      document.getElementById(
        "drawButton"
      );

    if (
      !drawButton ||
      document.getElementById(
        "conditionPanel"
      )
    ) {
      return;
    }


    const toggleButton =
      document.createElement(
        "button"
      );

    toggleButton.id =
      "conditionToggleButton";

    toggleButton.className =
      "condition-button";

    toggleButton.type =
      "button";

    toggleButton.textContent =
      "⚙️ 抽選条件・縛り設定";


    const panel =
      document.createElement(
        "div"
      );

    panel.id =
      "conditionPanel";

    panel.className =
      "condition-panel";


    panel.innerHTML = `

      <div class="condition-title">
        ⚙️ 抽選条件
      </div>

      <div class="condition-description">
        通常の抽選に条件をつけられます。
        「今日のポケくじ」には反映されません。
      </div>


      <div class="condition-group">

        <label
          class="condition-label"
          for="conditionRequiredPokemon">
          ✅ 必ず入れるポケモン
        </label>

        <select
          id="conditionRequiredPokemon"
          class="condition-select">
        </select>

        <div class="condition-help">
          指定したポケモンを6匹の中に必ず1匹入れます。
        </div>

      </div>


      <div class="condition-group">

        <label
          class="condition-label"
          for="conditionExcludedPokemon">
          🚫 抽選から除外するポケモン
        </label>

        <select
          id="conditionExcludedPokemon"
          class="condition-select">
        </select>

        <div class="condition-help">
          指定したポケモンを通常抽選から除外します。
        </div>

      </div>


      <div
        id="conditionMegaWrap"
        class="condition-special"
        style="display:none;">

        <label
          class="condition-label"
          for="conditionMega">
          ⭐ メガシンカ枠
        </label>

        <select
          id="conditionMega"
          class="condition-select">

          <option value="auto">
            おまかせ
          </option>

          <option value="force">
            必ずメガ枠あり
          </option>

          <option value="none">
            メガ枠なし
          </option>

        </select>

      </div>


      <div
        id="conditionSpecialWrap"
        class="condition-special"
        style="display:none;">

        <label
          class="condition-label"
          for="conditionSpecial">
          👑 特別なポケモン
        </label>

        <select
          id="conditionSpecial"
          class="condition-select">

          <option value="auto">
            おまかせ
          </option>

          <option value="0">
            0匹
          </option>

          <option value="1">
            1匹
          </option>

          <option value="2">
            2匹
          </option>

        </select>

        <div class="condition-help">
          レギュレーションJのみ使用できます。
        </div>

      </div>


      <button
        id="conditionReset"
        class="condition-reset"
        type="button">
        条件をすべてリセット
      </button>


      <div
        id="conditionSummary"
        class="condition-summary">
      </div>


      <div class="condition-warning">
        🔥 チャレンジモード中は、
        チャレンジのお題を優先するため
        この設定は一時的に無効になります。
      </div>

    `;


    drawButton.parentNode.insertBefore(
      toggleButton,
      drawButton
    );

    drawButton.parentNode.insertBefore(
      panel,
      drawButton
    );


    toggleButton.addEventListener(
      "click",
      () => {

        panel.classList.toggle(
          "show"
        );

        toggleButton.classList.toggle(
          "active",
          panel.classList.contains(
            "show"
          )
        );
      }
    );


    document.getElementById(
      "conditionRequiredPokemon"
    ).addEventListener(
      "change",
      conditionChanged
    );


    document.getElementById(
      "conditionExcludedPokemon"
    ).addEventListener(
      "change",
      conditionChanged
    );


    document.getElementById(
      "conditionMega"
    ).addEventListener(
      "change",
      conditionChanged
    );


    document.getElementById(
      "conditionSpecial"
    ).addEventListener(
      "change",
      conditionChanged
    );


    document.getElementById(
      "conditionReset"
    ).addEventListener(
      "click",
      resetConditions
    );


    setupConditionOptions();

    loadConditions();

    updateConditionSummary();
  }


  /* =========================================================
     ポケモン選択肢
  ========================================================= */

  function escapeHtml(
    value
  ) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }


  function setupConditionOptions() {

    const pool =
      originalGetPokemonPool();

    const required =
      document.getElementById(
        "conditionRequiredPokemon"
      );

    const excluded =
      document.getElementById(
        "conditionExcludedPokemon"
      );


    const options =
      pool.map(
        pokemon => `
          <option value="${escapeHtml(pokemon)}">
            ${escapeHtml(pokemon)}
          </option>
        `
      ).join("");


    required.innerHTML =
      `
        <option value="">
          指定なし
        </option>
      ` +
      options;


    excluded.innerHTML =
      `
        <option value="">
          指定なし
        </option>
      ` +
      options;


    document.getElementById(
      "conditionMegaWrap"
    ).style.display =
      isChampions()
        ? "block"
        : "none";


    document.getElementById(
      "conditionSpecialWrap"
    ).style.display =
      isSVRegJ()
        ? "block"
        : "none";
  }


  /* =========================================================
     設定取得
  ========================================================= */

  function getRequiredPokemon() {

    const element =
      document.getElementById(
        "conditionRequiredPokemon"
      );

    return element
      ? element.value
      : "";
  }


  function getExcludedPokemon() {

    const element =
      document.getElementById(
        "conditionExcludedPokemon"
      );

    return element
      ? element.value
      : "";
  }


  function getMegaCondition() {

    if (
      !isChampions()
    ) {
      return "auto";
    }

    const element =
      document.getElementById(
        "conditionMega"
      );

    return element
      ? element.value
      : "auto";
  }


  function getSpecialCondition() {

    if (
      !isSVRegJ()
    ) {
      return null;
    }

    const element =
      document.getElementById(
        "conditionSpecial"
      );

    if (
      !element ||
      element.value === "auto"
    ) {
      return null;
    }

    return Number(
      element.value
    );
  }


  function conditionsAreActive() {

    return (
      !conditionsBypass &&
      !challengeModeActive
    );
  }


  /* =========================================================
     保存
  ========================================================= */

  function getConditionStorageId() {

    return (
      game +
      "|" +
      rule
    );
  }


  function getAllSavedConditions() {

    try {

      const saved =
        localStorage.getItem(
          CONDITIONS_STORAGE_KEY
        );

      if (
        !saved
      ) {
        return {};
      }

      const parsed =
        JSON.parse(
          saved
        );

      return (
        parsed &&
        typeof parsed ===
          "object"
      )
        ? parsed
        : {};

    } catch (
      error
    ) {

      return {};
    }
  }


  function saveConditions() {

    const all =
      getAllSavedConditions();

    all[
      getConditionStorageId()
    ] = {

      required:
        getRequiredPokemon(),

      excluded:
        getExcludedPokemon(),

      mega:
        getMegaCondition(),

      special:
        getSpecialCondition()
    };


    localStorage.setItem(
      CONDITIONS_STORAGE_KEY,
      JSON.stringify(
        all
      )
    );
  }


  function loadConditions() {

    const all =
      getAllSavedConditions();

    const saved =
      all[
        getConditionStorageId()
      ];

    if (
      !saved
    ) {
      return;
    }


    const pool =
      originalGetPokemonPool();


    const required =
      document.getElementById(
        "conditionRequiredPokemon"
      );

    const excluded =
      document.getElementById(
        "conditionExcludedPokemon"
      );


    if (
      saved.required &&
      pool.includes(
        saved.required
      )
    ) {

      required.value =
        saved.required;
    }


    if (
      saved.excluded &&
      pool.includes(
        saved.excluded
      )
    ) {

      excluded.value =
        saved.excluded;
    }


    if (
      isChampions() &&
      [
        "auto",
        "force",
        "none"
      ].includes(
        saved.mega
      )
    ) {

      document.getElementById(
        "conditionMega"
      ).value =
        saved.mega;
    }


    if (
      isSVRegJ()
    ) {

      const special =
        saved.special;

      document.getElementById(
        "conditionSpecial"
      ).value =
        (
          special === 0 ||
          special === 1 ||
          special === 2
        )
          ? String(
              special
            )
          : "auto";
    }
  }


  function conditionChanged() {

    saveConditions();

    updateConditionSummary();

    document.getElementById(
      "message"
    ).textContent =
      "⚙️ 抽選条件を変更しました。次の通常抽選から反映されます。";
  }


  function resetConditions() {

    document.getElementById(
      "conditionRequiredPokemon"
    ).value =
      "";

    document.getElementById(
      "conditionExcludedPokemon"
    ).value =
      "";

    document.getElementById(
      "conditionMega"
    ).value =
      "auto";

    document.getElementById(
      "conditionSpecial"
    ).value =
      "auto";


    saveConditions();

    updateConditionSummary();


    document.getElementById(
      "message"
    ).textContent =
      "⚙️ 抽選条件をリセットしました。";
  }


  /* =========================================================
     条件表示
  ========================================================= */

  function updateConditionSummary() {

    const summary =
      document.getElementById(
        "conditionSummary"
      );

    if (
      !summary
    ) {
      return;
    }


    const texts =
      [];


    const required =
      getRequiredPokemon();

    const excluded =
      getExcludedPokemon();


    if (
      required
    ) {

      texts.push(
        `✅ 必須：${required}`
      );
    }


    if (
      excluded
    ) {

      texts.push(
        `🚫 除外：${excluded}`
      );
    }


    if (
      isChampions()
    ) {

      const mega =
        getMegaCondition();

      if (
        mega === "force"
      ) {

        texts.push(
          "⭐ メガ枠：必ずあり"
        );

      } else if (
        mega === "none"
      ) {

        texts.push(
          "⭐ メガ枠：なし"
        );
      }
    }


    if (
      isSVRegJ()
    ) {

      const special =
        getSpecialCondition();

      if (
        special !== null
      ) {

        texts.push(
          `👑 特別枠：${special}匹`
        );
      }
    }


    if (
      texts.length === 0
    ) {

      summary.textContent =
        "現在は条件なしです。";

      return;
    }


    summary.innerHTML =
      texts.join(
        "<br>"
      );
  }


  /* =========================================================
     条件チェック
  ========================================================= */

  function setConditionError(
    message
  ) {

    conditionLastError =
      message;

    document.getElementById(
      "message"
    ).textContent =
      "⚠️ " +
      message;
  }


  function validateConditions() {

    if (
      !conditionsAreActive()
    ) {
      return true;
    }


    const required =
      getRequiredPokemon();

    const excluded =
      getExcludedPokemon();


    if (
      required &&
      excluded &&
      required === excluded
    ) {

      setConditionError(
        "同じポケモンを「必ず入れる」と「除外」の両方には指定できません。"
      );

      return false;
    }


    const originalPool =
      originalGetPokemonPool();


    if (
      required &&
      !originalPool.includes(
        required
      )
    ) {

      setConditionError(
        "指定した必須ポケモンはこのレギュレーションでは使用できません。"
      );

      return false;
    }


    if (
      isSVRegJ()
    ) {

      const exactSpecial =
        getSpecialCondition();

      if (
        exactSpecial !== null &&
        required
      ) {

        const requiredIsSpecial =
          isSVJSpecialPokemon(
            required
          );

        if (
          exactSpecial === 0 &&
          requiredIsSpecial
        ) {

          setConditionError(
            "特別なポケモンを必須にしているため、特別枠0匹にはできません。"
          );

          return false;
        }
      }
    }


    return true;
  }


  function validateLocks() {

    if (
      !conditionsAreActive() ||
      currentTeam.length !== 6
    ) {
      return true;
    }


    const excluded =
      getExcludedPokemon();

    const required =
      getRequiredPokemon();


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      if (
        lockedSlots[i] &&
        excluded &&
        currentTeam[i] ===
          excluded
      ) {

        setConditionError(
          `${excluded}が固定中です。固定を解除してから除外条件を使用してください。`
        );

        return false;
      }
    }


    if (
      required &&
      !currentTeam.includes(
        required
      )
    ) {

      const sameSpeciesLocked =
        currentTeam.some(
          (pokemon, index) =>
            lockedSlots[index] &&
            getSpeciesKey(
              pokemon
            ) ===
              getSpeciesKey(
                required
              )
        );


      if (
        sameSpeciesLocked
      ) {

        setConditionError(
          `${required}と同じ種族のポケモンが固定されています。固定を解除してください。`
        );

        return false;
      }
    }


    if (
      isSVRegJ()
    ) {

      const exact =
        getSpecialCondition();

      if (
        exact !== null
      ) {

        let lockedSpecial =
          0;


        for (
          let i = 0;
          i < 6;
          i++
        ) {

          if (
            lockedSlots[i] &&
            isSVJSpecialPokemon(
              currentTeam[i]
            )
          ) {

            lockedSpecial++;
          }
        }


        if (
          lockedSpecial >
            exact
        ) {

          setConditionError(
            `特別なポケモンが${lockedSpecial}匹固定されています。設定した${exact}匹より多いため再抽選できません。`
          );

          return false;
        }
      }
    }


    if (
      isChampions() &&
      getMegaCondition() ===
        "none" &&
      currentMegaEnabled &&
      currentMegaIndex >= 0 &&
      lockedSlots[
        currentMegaIndex
      ]
    ) {

      setConditionError(
        "現在のメガ枠が固定されています。固定を解除してから「メガ枠なし」を使用してください。"
      );

      return false;
    }


    return true;
  }


  /* =========================================================
     プール
  ========================================================= */

  getPokemonPool =
    function() {

      const pool =
        originalGetPokemonPool();


      if (
        !conditionsAreActive()
      ) {

        return pool;
      }


      const excluded =
        getExcludedPokemon();


      if (
        !excluded
      ) {

        return pool;
      }


      return pool.filter(
        pokemon =>
          pokemon !== excluded
      );
    };


  /* =========================================================
     共通処理
  ========================================================= */

  function randomFrom(
    array
  ) {

    if (
      array.length === 0
    ) {
      return null;
    }


    return array[
      Math.floor(
        Math.random() *
        array.length
      )
    ];
  }


  function addPokemonIfPossible(
    team,
    pokemon
  ) {

    if (
      !pokemon
    ) {
      return false;
    }


    if (
      hasSameSpecies(
        team,
        pokemon
      )
    ) {

      return false;
    }


    team.push(
      pokemon
    );

    return true;
  }


  function fillRandomUnique(
    team,
    pool,
    targetLength,
    filterFunction = null
  ) {

    const shuffled =
      shuffleArray(
        pool
      );


    for (
      const pokemon
      of shuffled
    ) {

      if (
        team.length >=
        targetLength
      ) {
        break;
      }


      if (
        hasSameSpecies(
          team,
          pokemon
        )
      ) {
        continue;
      }


      if (
        filterFunction &&
        !filterFunction(
          pokemon
        )
      ) {
        continue;
      }


      team.push(
        pokemon
      );
    }


    return (
      team.length >=
      targetLength
    );
  }


  /* =========================================================
     SV 通常抽選
  ========================================================= */

  function buildConditionedSVTeam() {

    const pool =
      getPokemonPool();

    const itemPool =
      getItemPool();

    const required =
      getRequiredPokemon();

    const team =
      [];


    if (
      required
    ) {

      addPokemonIfPossible(
        team,
        required
      );
    }


    if (
      isSVRegJ()
    ) {

      const exact =
        getSpecialCondition();


      if (
        exact !== null
      ) {

        let currentSpecial =
          countSpecialPokemon(
            team
          );


        const specialPool =
          shuffleArray(
            pool.filter(
              pokemon =>
                isSVJSpecialPokemon(
                  pokemon
                )
            )
          );


        while (
          currentSpecial <
            exact
        ) {

          const next =
            specialPool.find(
              pokemon =>
                !hasSameSpecies(
                  team,
                  pokemon
                )
            );


          if (
            !next
          ) {

            conditionLastError =
              "指定した特別枠数を満たせません。";

            currentTeam =
              [];

            return;
          }


          team.push(
            next
          );


          specialPool.splice(
            specialPool.indexOf(
              next
            ),
            1
          );


          currentSpecial++;
        }


        const normalPool =
          shuffleArray(
            pool.filter(
              pokemon =>
                !isSVJSpecialPokemon(
                  pokemon
                )
            )
          );


        fillRandomUnique(
          team,
          normalPool,
          6
        );


        if (
          team.length !== 6
        ) {

          conditionLastError =
            "条件を満たす6匹を作成できませんでした。";

          currentTeam =
            [];

          return;
        }


      } else {

        const shuffled =
          shuffleArray(
            pool
          );


        let specialCount =
          countSpecialPokemon(
            team
          );


        for (
          const pokemon
          of shuffled
        ) {

          if (
            team.length >= 6
          ) {
            break;
          }


          if (
            hasSameSpecies(
              team,
              pokemon
            )
          ) {
            continue;
          }


          if (
            isSVJSpecialPokemon(
              pokemon
            ) &&
            specialCount >= 2
          ) {
            continue;
          }


          team.push(
            pokemon
          );


          if (
            isSVJSpecialPokemon(
              pokemon
            )
          ) {

            specialCount++;
          }
        }
      }


    } else {

      fillRandomUnique(
        team,
        pool,
        6
      );
    }


    currentTeam =
      shuffleArray(
        team
      );


    currentMegaEnabled =
      false;

    currentMegaIndex =
      -1;

    currentMegaStone =
      "";


    currentItems =
      shuffleArray(
        itemPool
      ).slice(
        0,
        6
      );
  }


  /* =========================================================
     Champions 通常抽選
  ========================================================= */

  function buildConditionedChampionsTeam() {

    const pool =
      getPokemonPool();

    const itemPool =
      getItemPool();

    const required =
      getRequiredPokemon();

    const megaMode =
      getMegaCondition();


    let useMega =
      false;


    if (
      megaMode === "force"
    ) {

      useMega =
        true;

    } else if (
      megaMode === "none"
    ) {

      useMega =
        false;

    } else {

      useMega =
        Math.random() < 0.5;
    }


    let megaPokemon =
      "";

    let megaStone =
      "";


    const team =
      [];


    if (
      useMega
    ) {

      let megaCandidates =
        pool.filter(
          pokemon =>
            getMegaOptions(
              pokemon,
              rule
            ).length > 0
        );


      if (
        required &&
        megaCandidates.includes(
          required
        ) &&
        Math.random() < 0.5
      ) {

        megaPokemon =
          required;

      } else {

        if (
          required
        ) {

          megaCandidates =
            megaCandidates.filter(
              pokemon =>
                getSpeciesKey(
                  pokemon
                ) !==
                getSpeciesKey(
                  required
                ) ||
                pokemon ===
                  required
            );
        }


        megaPokemon =
          randomFrom(
            megaCandidates
          ) || "";
      }


      if (
        !megaPokemon
      ) {

        if (
          megaMode === "force"
        ) {

          conditionLastError =
            "メガシンカできるポケモンを抽選できませんでした。";

          currentTeam =
            [];

          return;
        }


        useMega =
          false;

      } else {

        team.push(
          megaPokemon
        );


        const options =
          getMegaOptions(
            megaPokemon,
            rule
          );


        const selectedOption =
          randomFrom(
            options
          );


        megaStone =
          selectedOption
            ? selectedOption.stone
            : "";
      }
    }


    if (
      required &&
      !hasSameSpecies(
        team,
        required
      )
    ) {

      team.push(
        required
      );
    }


    fillRandomUnique(
      team,
      pool,
      6
    );


    if (
      team.length !== 6
    ) {

      conditionLastError =
        "条件を満たす6匹を作成できませんでした。";

      currentTeam =
        [];

      return;
    }


    currentTeam =
      shuffleArray(
        team
      );


    currentMegaEnabled =
      useMega;

    currentMegaIndex =
      useMega
        ? currentTeam.indexOf(
            megaPokemon
          )
        : -1;

    currentMegaStone =
      useMega
        ? megaStone
        : "";


    currentItems =
      shuffleArray(
        itemPool
      ).slice(
        0,
        6
      );


    if (
      currentMegaEnabled &&
      currentMegaIndex >= 0 &&
      currentMegaStone
    ) {

      currentItems[
        currentMegaIndex
      ] =
        currentMegaStone;
    }
  }


  /* =========================================================
     buildTeam 上書き
  ========================================================= */

  buildTeam =
    function() {

      conditionLastError =
        "";


      if (
        !conditionsAreActive()
      ) {

        originalBuildTeam();

        return;
      }


      if (
        isSV()
      ) {

        buildConditionedSVTeam();

      } else {

        buildConditionedChampionsTeam();
      }
    };


  /* =========================================================
     ロックあり再抽選
  ========================================================= */

  function buildConditionedSVWithLocks() {

    const pool =
      getPokemonPool();

    const required =
      getRequiredPokemon();

    const exact =
      isSVRegJ()
        ? getSpecialCondition()
        : null;


    const nextTeam =
      Array(6).fill(
        ""
      );


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      if (
        lockedSlots[i]
      ) {

        nextTeam[i] =
          currentTeam[i];
      }
    }


    const unlocked =
      [];


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      if (
        !lockedSlots[i]
      ) {

        unlocked.push(
          i
        );
      }
    }


    if (
      required &&
      !nextTeam.includes(
        required
      )
    ) {

      const index =
        unlocked.shift();


      if (
        index === undefined
      ) {

        return false;
      }


      nextTeam[index] =
        required;
    }


    if (
      isSVRegJ() &&
      exact !== null
    ) {

      let specialCount =
        countSpecialPokemon(
          nextTeam
        );


      if (
        specialCount >
          exact
      ) {

        return false;
      }


      while (
        specialCount <
          exact
      ) {

        const target =
          unlocked.find(
            index =>
              !nextTeam[index]
          );


        if (
          target === undefined
        ) {

          return false;
        }


        const candidates =
          pool.filter(
            pokemon =>
              isSVJSpecialPokemon(
                pokemon
              ) &&
              !hasSameSpecies(
                nextTeam,
                pokemon
              )
          );


        const selected =
          randomFrom(
            candidates
          );


        if (
          !selected
        ) {

          return false;
        }


        nextTeam[target] =
          selected;

        specialCount++;
      }


      for (
        const index
        of unlocked
      ) {

        if (
          nextTeam[index]
        ) {
          continue;
        }


        const candidates =
          pool.filter(
            pokemon =>
              !isSVJSpecialPokemon(
                pokemon
              ) &&
              !hasSameSpecies(
                nextTeam,
                pokemon
              )
          );


        const selected =
          randomFrom(
            candidates
          );


        if (
          !selected
        ) {

          return false;
        }


        nextTeam[index] =
          selected;
      }


    } else {

      let specialCount =
        isSVRegJ()
          ? countSpecialPokemon(
              nextTeam
            )
          : 0;


      for (
        const index
        of unlocked
      ) {

        if (
          nextTeam[index]
        ) {
          continue;
        }


        const candidates =
          pool.filter(
            pokemon => {

              if (
                hasSameSpecies(
                  nextTeam,
                  pokemon
                )
              ) {

                return false;
              }


              if (
                isSVRegJ() &&
                specialCount >= 2 &&
                isSVJSpecialPokemon(
                  pokemon
                )
              ) {

                return false;
              }


              return true;
            }
          );


        const selected =
          randomFrom(
            candidates
          );


        if (
          !selected
        ) {

          return false;
        }


        nextTeam[index] =
          selected;


        if (
          isSVRegJ() &&
          isSVJSpecialPokemon(
            selected
          )
        ) {

          specialCount++;
        }
      }
    }


    currentTeam =
      nextTeam;

    currentMegaEnabled =
      false;

    currentMegaIndex =
      -1;

    currentMegaStone =
      "";


    return true;
  }


  function buildConditionedChampionsWithLocks() {

    const pool =
      getPokemonPool();

    const required =
      getRequiredPokemon();

    const megaMode =
      getMegaCondition();


    const oldMegaEnabled =
      currentMegaEnabled;

    const oldMegaIndex =
      currentMegaIndex;

    const oldMegaStone =
      currentMegaStone;


    const nextTeam =
      Array(6).fill(
        ""
      );


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      if (
        lockedSlots[i]
      ) {

        nextTeam[i] =
          currentTeam[i];
      }
    }


    const unlocked =
      [];


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      if (
        !lockedSlots[i]
      ) {

        unlocked.push(
          i
        );
      }
    }


    if (
      required &&
      !nextTeam.includes(
        required
      )
    ) {

      const requiredIndex =
        unlocked.find(
          index =>
            !nextTeam[index]
        );


      if (
        requiredIndex ===
          undefined
      ) {

        return false;
      }


      nextTeam[
        requiredIndex
      ] =
        required;
    }


    let useMega =
      false;

    let megaIndex =
      -1;

    let megaStone =
      "";


    const lockedOldMega =
      oldMegaEnabled &&
      oldMegaIndex >= 0 &&
      lockedSlots[
        oldMegaIndex
      ];


    if (
      megaMode === "none"
    ) {

      useMega =
        false;

    } else if (
      lockedOldMega
    ) {

      useMega =
        true;

      megaIndex =
        oldMegaIndex;

      megaStone =
        oldMegaStone;

    } else {

      useMega =
        megaMode === "force"
          ? true
          : Math.random() < 0.5;
    }


    if (
      useMega &&
      megaIndex < 0
    ) {

      const availableIndices =
        unlocked.filter(
          index =>
            !nextTeam[index] ||
            getMegaOptions(
              nextTeam[index],
              rule
            ).length > 0
        );


      let candidates =
        pool.filter(
          pokemon =>
            getMegaOptions(
              pokemon,
              rule
            ).length > 0
        );


      candidates =
        candidates.filter(
          pokemon => {

            return !nextTeam.some(
              existing =>
                existing &&
                getSpeciesKey(
                  existing
                ) ===
                  getSpeciesKey(
                    pokemon
                  ) &&
                existing !==
                  pokemon
            );
          }
        );


      let chosenPokemon =
        "";


      if (
        required &&
        getMegaOptions(
          required,
          rule
        ).length > 0
      ) {

        const requiredIndex =
          nextTeam.indexOf(
            required
          );


        if (
          requiredIndex >= 0 &&
          !lockedSlots[
            requiredIndex
          ]
        ) {

          chosenPokemon =
            required;

          megaIndex =
            requiredIndex;
        }
      }


      if (
        !chosenPokemon
      ) {

        chosenPokemon =
          randomFrom(
            candidates
          ) || "";


        if (
          chosenPokemon
        ) {

          let target =
            availableIndices.find(
              index =>
                !nextTeam[index]
            );


          if (
            target === undefined
          ) {

            target =
              availableIndices[0];
          }


          if (
            target !== undefined
          ) {

            nextTeam[target] =
              chosenPokemon;

            megaIndex =
              target;
          }
        }
      }


      if (
        !chosenPokemon ||
        megaIndex < 0
      ) {

        if (
          megaMode === "force"
        ) {

          return false;
        }


        useMega =
          false;

        megaIndex =
          -1;

      } else {

        const options =
          getMegaOptions(
            chosenPokemon,
            rule
          );


        const option =
          randomFrom(
            options
          );


        megaStone =
          option
            ? option.stone
            : "";
      }
    }


    for (
      const index
      of unlocked
    ) {

      if (
        nextTeam[index]
      ) {
        continue;
      }


      const candidates =
        pool.filter(
          pokemon =>
            !hasSameSpecies(
              nextTeam,
              pokemon
            )
        );


      const selected =
        randomFrom(
          candidates
        );


      if (
        !selected
      ) {

        return false;
      }


      nextTeam[index] =
        selected;
    }


    currentTeam =
      nextTeam;

    currentMegaEnabled =
      useMega;

    currentMegaIndex =
      useMega
        ? megaIndex
        : -1;

    currentMegaStone =
      useMega
        ? megaStone
        : "";


    return true;
  }


  rebuildUnlockedSlots =
    function() {

      if (
        !conditionsAreActive()
      ) {

        return originalRebuildUnlockedSlots();
      }


      let success =
        false;


      if (
        isSV()
      ) {

        success =
          buildConditionedSVWithLocks();

      } else {

        success =
          buildConditionedChampionsWithLocks();
      }


      if (
        !success
      ) {

        return false;
      }


      if (
        !rebuildItemsWithLocks()
      ) {

        return false;
      }


      rebuildNaturesWithLocks();


      return true;
    };


  /* =========================================================
     1匹引き直し候補
  ========================================================= */

  getAvailablePokemon =
    function(
      index
    ) {

      let available =
        originalGetAvailablePokemon(
          index
        );


      if (
        !conditionsAreActive()
      ) {

        return available;
      }


      const excluded =
        getExcludedPokemon();


      if (
        excluded
      ) {

        available =
          available.filter(
            pokemon =>
              pokemon !==
                excluded
          );
      }


      if (
        isSVRegJ()
      ) {

        const exact =
          getSpecialCondition();


        if (
          exact !== null
        ) {

          const currentPokemon =
            currentTeam[index];

          const currentIsSpecial =
            isSVJSpecialPokemon(
              currentPokemon
            );


          const otherTeam =
            currentTeam.filter(
              (_, i) =>
                i !== index
            );


          const otherCount =
            countSpecialPokemon(
              otherTeam
            );


          const mustBeSpecial =
            otherCount <
              exact;


          available =
            available.filter(
              pokemon => {

                const candidateSpecial =
                  isSVJSpecialPokemon(
                    pokemon
                  );


                if (
                  mustBeSpecial
                ) {

                  return candidateSpecial;
                }


                return (
                  otherCount +
                  (
                    candidateSpecial
                      ? 1
                      : 0
                  )
                ) === exact;
              }
            );
        }
      }


      return available;
    };


  /* =========================================================
     必須ポケモンの1匹引き直し防止
  ========================================================= */

  const originalRerollPokemon =
    rerollPokemon;


  rerollPokemon =
    async function(
      index
    ) {

      if (
        conditionsAreActive()
      ) {

        const required =
          getRequiredPokemon();


        if (
          required &&
          currentTeam[index] ===
            required
        ) {

          document.getElementById(
            "message"
          ).textContent =
            `⚙️ ${required}は「必ず入れるポケモン」に設定されているため引き直せません。`;

          return;
        }
      }


      await originalRerollPokemon(
        index
      );
    };


  /* =========================================================
     通常抽選前チェック
  ========================================================= */

  drawPokemon =
    async function() {

      conditionLastError =
        "";


      if (
        conditionsAreActive()
      ) {

        if (
          !validateConditions()
        ) {

          return;
        }


        if (
          !validateLocks()
        ) {

          return;
        }
      }


      await originalDrawPokemon();


      if (
        conditionLastError
      ) {

        document.getElementById(
          "message"
        ).textContent =
          "⚠️ " +
          conditionLastError;
      }
  };


  /* =========================================================
     今日のポケくじ
     条件を完全無視
  ========================================================= */

  drawTodayPokemon =
    async function() {

      conditionsBypass =
        true;


      try {

        await originalDrawTodayPokemon();

      } finally {

        conditionsBypass =
          false;
      }
    };


  /* =========================================================
     初期化
  ========================================================= */

  createConditionUI();

})();
