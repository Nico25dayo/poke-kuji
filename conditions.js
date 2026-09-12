/* =========================================================
   ポケくじ
   ⑦ 抽選条件・縛り設定
   conditions.js
   検索入力対応版
========================================================= */

(() => {

  "use strict";


  /* =========================================================
     元の関数
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

  const originalRerollPokemon =
    rerollPokemon;


  /* =========================================================
     状態
  ========================================================= */

  const CONDITIONS_STORAGE_KEY =
    "pokeKujiConditionsV2";

  let conditionsBypass =
    false;

  let conditionLastError =
    "";

  let selectedRequiredPokemon =
    "";

  let selectedExcludedPokemon =
    "";


  /* =========================================================
     CSS
  ========================================================= */

  const style =
    document.createElement("style");

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
      margin-bottom: 18px;
    }

    .condition-label {
      display: block;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 7px;
    }

    .condition-search-wrap {
      position: relative;
    }

    .condition-search-input {
      width: 100%;
      padding: 13px 42px 13px 13px;
      border-radius: 12px;
      border: 1px solid #ddd;
      background: #fff;
      color: #333;
      font-size: 16px;
      font-weight: 700;
      outline: none;
    }

    .condition-search-input:focus {
      border-color: #888;
    }

    .condition-search-input.selected {
      border-color: #4a90e2;
      background: #f7fbff;
    }

    .condition-clear-input {
      display: none;
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 50%;
      background: #eee;
      color: #666;
      font-size: 15px;
      font-weight: 900;
      cursor: pointer;
    }

    .condition-clear-input.show {
      display: block;
    }

    .condition-suggestions {
      display: none;
      position: absolute;
      z-index: 1000;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      max-height: 260px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid #ddd;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .condition-suggestions.show {
      display: block;
    }

    .condition-suggestion {
      width: 100%;
      border: none;
      border-bottom: 1px solid #eee;
      background: #fff;
      color: #333;
      padding: 13px 14px;
      text-align: left;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .condition-suggestion:last-child {
      border-bottom: none;
    }

    .condition-suggestion:active {
      background: #f3f4f6;
    }

    .condition-no-result {
      padding: 15px;
      text-align: center;
      color: #999;
      font-size: 13px;
    }

    .condition-selected-text {
      display: none;
      margin-top: 7px;
      color: #2876c7;
      font-size: 12px;
      font-weight: 800;
    }

    .condition-selected-text.show {
      display: block;
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

  document.head.appendChild(style);


  /* =========================================================
     UI
  ========================================================= */

  function createConditionUI() {

    const drawButton =
      document.getElementById("drawButton");

    if (
      !drawButton ||
      document.getElementById("conditionPanel")
    ) {
      return;
    }


    const toggleButton =
      document.createElement("button");

    toggleButton.id =
      "conditionToggleButton";

    toggleButton.className =
      "condition-button";

    toggleButton.type =
      "button";

    toggleButton.textContent =
      "⚙️ 抽選条件・縛り設定";


    const panel =
      document.createElement("div");

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
          for="conditionRequiredInput">
          ✅ 必ず入れるポケモン
        </label>

        <div class="condition-search-wrap">

          <input
            id="conditionRequiredInput"
            class="condition-search-input"
            type="text"
            inputmode="search"
            autocomplete="off"
            placeholder="ポケモン名を入力">

          <button
            id="conditionRequiredClear"
            class="condition-clear-input"
            type="button">
            ×
          </button>

          <div
            id="conditionRequiredSuggestions"
            class="condition-suggestions">
          </div>

        </div>

        <div
          id="conditionRequiredSelected"
          class="condition-selected-text">
        </div>

        <div class="condition-help">
          名前を入力すると候補を絞り込めます。
        </div>

      </div>


      <div class="condition-group">

        <label
          class="condition-label"
          for="conditionExcludedInput">
          🚫 抽選から除外するポケモン
        </label>

        <div class="condition-search-wrap">

          <input
            id="conditionExcludedInput"
            class="condition-search-input"
            type="text"
            inputmode="search"
            autocomplete="off"
            placeholder="ポケモン名を入力">

          <button
            id="conditionExcludedClear"
            class="condition-clear-input"
            type="button">
            ×
          </button>

          <div
            id="conditionExcludedSuggestions"
            class="condition-suggestions">
          </div>

        </div>

        <div
          id="conditionExcludedSelected"
          class="condition-selected-text">
        </div>

        <div class="condition-help">
          名前を入力すると候補を絞り込めます。
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
        🔥 チャレンジモード中は
        チャレンジのお題が優先されます。
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

        panel.classList.toggle("show");

        toggleButton.classList.toggle(
          "active",
          panel.classList.contains("show")
        );
      }
    );


    setupSearchInput(
      "required"
    );

    setupSearchInput(
      "excluded"
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


    loadConditions();

    updateSearchDisplays();

    updateConditionSummary();
  }


  /* =========================================================
     検索入力
  ========================================================= */

  function normalizeSearchText(text) {

    return String(text || "")
      .trim()
      .toLowerCase()
      .replace(/\s/g, "");
  }


  function getSearchElements(type) {

    const prefix =
      type === "required"
        ? "conditionRequired"
        : "conditionExcluded";

    return {

      input:
        document.getElementById(
          prefix + "Input"
        ),

      suggestions:
        document.getElementById(
          prefix + "Suggestions"
        ),

      clear:
        document.getElementById(
          prefix + "Clear"
        ),

      selected:
        document.getElementById(
          prefix + "Selected"
        )
    };
  }


  function getSelectedPokemon(type) {

    return type === "required"
      ? selectedRequiredPokemon
      : selectedExcludedPokemon;
  }


  function setSelectedPokemon(
    type,
    pokemon
  ) {

    if (
      type === "required"
    ) {

      selectedRequiredPokemon =
        pokemon || "";

    } else {

      selectedExcludedPokemon =
        pokemon || "";
    }


    updateSearchDisplays();

    saveConditions();

    updateConditionSummary();
  }


  function setupSearchInput(type) {

    const elements =
      getSearchElements(type);

    const input =
      elements.input;

    const suggestions =
      elements.suggestions;

    const clear =
      elements.clear;


    input.addEventListener(
      "focus",
      () => {

        showPokemonSuggestions(
          type,
          input.value
        );
      }
    );


    input.addEventListener(
      "input",
      () => {

        const selected =
          getSelectedPokemon(type);

        /*
          一度選んだポケモン名を
          書き換え始めたら選択状態解除
        */
        if (
          selected &&
          input.value !== selected
        ) {

          if (
            type === "required"
          ) {
            selectedRequiredPokemon = "";
          } else {
            selectedExcludedPokemon = "";
          }

          updateSearchDisplays();
          saveConditions();
          updateConditionSummary();
        }


        showPokemonSuggestions(
          type,
          input.value
        );
      }
    );


    input.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          const matches =
            getFilteredPokemon(
              input.value
            );

          if (
            matches.length === 1
          ) {

            choosePokemon(
              type,
              matches[0]
            );

            input.blur();
          }
        }


        if (
          event.key === "Escape"
        ) {

          suggestions.classList.remove(
            "show"
          );

          input.blur();
        }
      }
    );


    clear.addEventListener(
      "click",
      () => {

        setSelectedPokemon(
          type,
          ""
        );

        input.value =
          "";

        suggestions.classList.remove(
          "show"
        );

        input.focus();

        showPokemonSuggestions(
          type,
          ""
        );
      }
    );
  }


  function getFilteredPokemon(
    searchText
  ) {

    const pool =
      originalGetPokemonPool();

    const search =
      normalizeSearchText(
        searchText
      );


    if (
      !search
    ) {

      return pool.slice(
        0,
        50
      );
    }


    const startsWith =
      [];

    const contains =
      [];


    for (
      const pokemon
      of pool
    ) {

      const normalized =
        normalizeSearchText(
          pokemon
        );


      if (
        normalized.startsWith(
          search
        )
      ) {

        startsWith.push(
          pokemon
        );

      } else if (
        normalized.includes(
          search
        )
      ) {

        contains.push(
          pokemon
        );
      }
    }


    return [
      ...startsWith,
      ...contains
    ].slice(
      0,
      50
    );
  }


  function showPokemonSuggestions(
    type,
    searchText
  ) {

    const elements =
      getSearchElements(type);

    const suggestions =
      elements.suggestions;

    const matches =
      getFilteredPokemon(
        searchText
      );


    if (
      matches.length === 0
    ) {

      suggestions.innerHTML = `
        <div class="condition-no-result">
          該当するポケモンが見つかりません
        </div>
      `;

      suggestions.classList.add(
        "show"
      );

      return;
    }


    suggestions.innerHTML =
      "";


    for (
      const pokemon
      of matches
    ) {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "condition-suggestion";

      button.textContent =
        pokemon;


      button.addEventListener(
        "mousedown",
        event => {

          event.preventDefault();
        }
      );


      button.addEventListener(
        "click",
        () => {

          choosePokemon(
            type,
            pokemon
          );
        }
      );


      suggestions.appendChild(
        button
      );
    }


    suggestions.classList.add(
      "show"
    );
  }


  function choosePokemon(
    type,
    pokemon
  ) {

    const otherSelected =
      type === "required"
        ? selectedExcludedPokemon
        : selectedRequiredPokemon;


    if (
      otherSelected &&
      otherSelected === pokemon
    ) {

      document.getElementById(
        "message"
      ).textContent =
        "⚠️ 同じポケモンを「必須」と「除外」の両方には設定できません。";

      return;
    }


    setSelectedPokemon(
      type,
      pokemon
    );


    const elements =
      getSearchElements(type);

    elements.input.value =
      pokemon;

    elements.suggestions.classList.remove(
      "show"
    );


    document.getElementById(
      "message"
    ).textContent =
      type === "required"
        ? `✅ ${pokemon}を必ず入れる設定にしました。`
        : `🚫 ${pokemon}を抽選から除外しました。`;
  }


  function updateSearchDisplays() {

    updateSearchDisplay(
      "required",
      selectedRequiredPokemon
    );

    updateSearchDisplay(
      "excluded",
      selectedExcludedPokemon
    );
  }


  function updateSearchDisplay(
    type,
    pokemon
  ) {

    const elements =
      getSearchElements(type);

    if (
      !elements.input
    ) {
      return;
    }


    if (
      pokemon
    ) {

      elements.input.value =
        pokemon;

      elements.input.classList.add(
        "selected"
      );

      elements.clear.classList.add(
        "show"
      );

      elements.selected.textContent =
        `選択中：${pokemon}`;

      elements.selected.classList.add(
        "show"
      );

    } else {

      elements.input.classList.remove(
        "selected"
      );

      elements.clear.classList.remove(
        "show"
      );

      elements.selected.textContent =
        "";

      elements.selected.classList.remove(
        "show"
      );
    }
  }


  /*
    候補以外をタップしたら
    候補欄を閉じる
  */
  document.addEventListener(
    "click",
    event => {

      const required =
        document.getElementById(
          "conditionRequiredSuggestions"
        );

      const excluded =
        document.getElementById(
          "conditionExcludedSuggestions"
        );


      if (
        required &&
        !event.target.closest(
          "#conditionRequiredInput"
        ) &&
        !event.target.closest(
          "#conditionRequiredSuggestions"
        )
      ) {

        required.classList.remove(
          "show"
        );
      }


      if (
        excluded &&
        !event.target.closest(
          "#conditionExcludedInput"
        ) &&
        !event.target.closest(
          "#conditionExcludedSuggestions"
        )
      ) {

        excluded.classList.remove(
          "show"
        );
      }
    }
  );


  /* =========================================================
     条件取得
  ========================================================= */

  function getRequiredPokemon() {

    return selectedRequiredPokemon;
  }


  function getExcludedPokemon() {

    return selectedExcludedPokemon;
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
        typeof parsed === "object"
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
      JSON.stringify(all)
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


    if (
      saved.required &&
      pool.includes(
        saved.required
      )
    ) {

      selectedRequiredPokemon =
        saved.required;
    }


    if (
      saved.excluded &&
      pool.includes(
        saved.excluded
      )
    ) {

      selectedExcludedPokemon =
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

      document.getElementById(
        "conditionSpecial"
      ).value =
        (
          saved.special === 0 ||
          saved.special === 1 ||
          saved.special === 2
        )
          ? String(saved.special)
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

    selectedRequiredPokemon =
      "";

    selectedExcludedPokemon =
      "";


    const requiredInput =
      document.getElementById(
        "conditionRequiredInput"
      );

    const excludedInput =
      document.getElementById(
        "conditionExcludedInput"
      );


    requiredInput.value =
      "";

    excludedInput.value =
      "";


    document.getElementById(
      "conditionMega"
    ).value =
      "auto";


    document.getElementById(
      "conditionSpecial"
    ).value =
      "auto";


    updateSearchDisplays();

    saveConditions();

    updateConditionSummary();


    document.getElementById(
      "message"
    ).textContent =
      "⚙️ 抽選条件をすべてリセットしました。";
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


    summary.innerHTML =
      texts.length === 0
        ? "現在は条件なしです。"
        : texts.join("<br>");
  }


  /* =========================================================
     エラー
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
        "同じポケモンを「必ず入れる」と「除外」の両方には設定できません。"
      );

      return false;
    }


    const pool =
      originalGetPokemonPool();


    if (
      required &&
      !pool.includes(
        required
      )
    ) {

      setConditionError(
        "必須ポケモンがこのレギュレーションに存在しません。"
      );

      return false;
    }


    if (
      isSVRegJ()
    ) {

      const special =
        getSpecialCondition();


      if (
        special === 0 &&
        required &&
        isSVJSpecialPokemon(
          required
        )
      ) {

        setConditionError(
          "特別なポケモンを必須にしているため、特別枠0匹にはできません。"
        );

        return false;
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


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      if (
        lockedSlots[i] &&
        excluded &&
        currentTeam[i] === excluded
      ) {

        setConditionError(
          `${excluded}が固定中です。固定を解除してください。`
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
          lockedSpecial > exact
        ) {

          setConditionError(
            `特別なポケモンが${lockedSpecial}匹固定されています。設定は${exact}匹です。`
          );

          return false;
        }
      }
    }


    if (
      isChampions() &&
      getMegaCondition() === "none" &&
      currentMegaEnabled &&
      currentMegaIndex >= 0 &&
      lockedSlots[
        currentMegaIndex
      ]
    ) {

      setConditionError(
        "現在のメガ枠が固定されています。固定を解除してください。"
      );

      return false;
    }


    return true;
  }


  /* =========================================================
     Pokémon Pool上書き
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
     汎用
  ========================================================= */

  function randomFrom(
    array
  ) {

    if (
      !array ||
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


  function fillRandomUnique(
    team,
    pool,
    targetLength
  ) {

    const shuffled =
      shuffleArray(pool);


    for (
      const pokemon
      of shuffled
    ) {

      if (
        team.length >= targetLength
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


      team.push(
        pokemon
      );
    }


    return (
      team.length >= targetLength
    );
  }


  /* =========================================================
     SV 条件抽選
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

      team.push(
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

        let specialCount =
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


        for (
          const pokemon
          of specialPool
        ) {

          if (
            specialCount >= exact
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


          team.push(
            pokemon
          );

          specialCount++;
        }


        if (
          specialCount !== exact
        ) {

          conditionLastError =
            "指定した特別枠数を作れませんでした。";

          currentTeam =
            [];

          return;
        }


        const normalPool =
          pool.filter(
            pokemon =>
              !isSVJSpecialPokemon(
                pokemon
              )
          );


        fillRandomUnique(
          team,
          normalPool,
          6
        );


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
     Champions 条件抽選
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
      megaMode === "force"
        ? true
        : megaMode === "none"
          ? false
          : Math.random() < 0.5;


    const team =
      [];

    let megaPokemon =
      "";

    let megaStone =
      "";


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
        getMegaOptions(
          required,
          rule
        ).length > 0 &&
        Math.random() < 0.5
      ) {

        megaPokemon =
          required;

      } else {

        megaCandidates =
          megaCandidates.filter(
            pokemon =>
              !required ||
              getSpeciesKey(
                pokemon
              ) !==
                getSpeciesKey(
                  required
                ) ||
              pokemon === required
          );


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
            "メガシンカ可能なポケモンを抽選できませんでした。";

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


        const option =
          randomFrom(
            getMegaOptions(
              megaPokemon,
              rule
            )
          );


        megaStone =
          option
            ? option.stone
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
      Array(6).fill("");


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

        unlocked.push(i);
      }
    }


    if (
      required &&
      !nextTeam.includes(
        required
      )
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


      nextTeam[target] =
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
        specialCount > exact
      ) {
        return false;
      }


      while (
        specialCount < exact
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
      Array(6).fill("");


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

        unlocked.push(i);
      }
    }


    if (
      required &&
      !nextTeam.includes(
        required
      )
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


      nextTeam[target] =
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

      let chosenPokemon =
        "";


      if (
        required
      ) {

        const requiredIndex =
          nextTeam.indexOf(
            required
          );


        if (
          requiredIndex >= 0 &&
          !lockedSlots[
            requiredIndex
          ] &&
          getMegaOptions(
            required,
            rule
          ).length > 0
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

        const candidates =
          pool.filter(
            pokemon =>
              getMegaOptions(
                pokemon,
                rule
              ).length > 0 &&
              !hasSameSpecies(
                nextTeam,
                pokemon
              )
          );


        chosenPokemon =
          randomFrom(
            candidates
          ) || "";


        if (
          chosenPokemon
        ) {

          const target =
            unlocked.find(
              index =>
                !nextTeam[index]
            );


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

        const option =
          randomFrom(
            getMegaOptions(
              chosenPokemon,
              rule
            )
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


      let success;


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
     1匹だけ再抽選
  ========================================================= */

  getAvailablePokemon =
    function(index) {

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
              pokemon !== excluded
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

          const otherTeam =
            currentTeam.filter(
              (_, i) =>
                i !== index
            );


          const otherCount =
            countSpecialPokemon(
              otherTeam
            );


          available =
            available.filter(
              pokemon => {

                const candidateSpecial =
                  isSVJSpecialPokemon(
                    pokemon
                  );


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


  rerollPokemon =
    async function(index) {

      if (
        conditionsAreActive()
      ) {

        const required =
          getRequiredPokemon();


        if (
          required &&
          currentTeam[index] === required
        ) {

          document.getElementById(
            "message"
          ).textContent =
            `⚙️ ${required}は必須ポケモンなので引き直せません。`;

          return;
        }
      }


      await originalRerollPokemon(
        index
      );
    };


  /* =========================================================
     通常抽選
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
     条件を無視
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
