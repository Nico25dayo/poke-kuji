const pokemonFormNames = {
  // =========================
  // リージョンフォーム
  // =========================

  "ライチュウ（アローラのすがた）": "raichu-alola",
  "サンド（アローラのすがた）": "sandshrew-alola",
  "サンドパン（アローラのすがた）": "sandslash-alola",
  "ロコン（アローラのすがた）": "vulpix-alola",
  "キュウコン（アローラのすがた）": "ninetales-alola",
  "ディグダ（アローラのすがた）": "diglett-alola",
  "ダグトリオ（アローラのすがた）": "dugtrio-alola",
  "ニャース（アローラのすがた）": "meowth-alola",
  "ペルシアン（アローラのすがた）": "persian-alola",
  "イシツブテ（アローラのすがた）": "geodude-alola",
  "ゴローン（アローラのすがた）": "graveler-alola",
  "ゴローニャ（アローラのすがた）": "golem-alola",
  "ベトベター（アローラのすがた）": "grimer-alola",
  "ベトベトン（アローラのすがた）": "muk-alola",

  "ニャース（ガラルのすがた）": "meowth-galar",
  "ポニータ（ガラルのすがた）": "ponyta-galar",
  "ギャロップ（ガラルのすがた）": "rapidash-galar",
  "ヤドン（ガラルのすがた）": "slowpoke-galar",
  "ヤドラン（ガラルのすがた）": "slowbro-galar",
  "カモネギ（ガラルのすがた）": "farfetchd-galar",
  "マタドガス（ガラルのすがた）": "weezing-galar",
  "バリヤード（ガラルのすがた）": "mr-mime-galar",
  "フリーザー（ガラルのすがた）": "articuno-galar",
  "サンダー（ガラルのすがた）": "zapdos-galar",
  "ファイヤー（ガラルのすがた）": "moltres-galar",
  "サニーゴ（ガラルのすがた）": "corsola-galar",
  "ジグザグマ（ガラルのすがた）": "zigzagoon-galar",
  "マッスグマ（ガラルのすがた）": "linoone-galar",
  "ダルマッカ（ガラルのすがた）": "darumaka-galar",
  "ヒヒダルマ（ガラルのすがた）": "darmanitan-galar-standard",
  "デスマス（ガラルのすがた）": "yamask-galar",
  "マッギョ（ガラルのすがた）": "stunfisk-galar",
  "ヤドキング（ガラルのすがた）": "slowking-galar",

  "ガーディ（ヒスイのすがた）": "growlithe-hisui",
  "ウインディ（ヒスイのすがた）": "arcanine-hisui",
  "ビリリダマ（ヒスイのすがた）": "voltorb-hisui",
  "マルマイン（ヒスイのすがた）": "electrode-hisui",
  "バクフーン（ヒスイのすがた）": "typhlosion-hisui",
  "ニューラ（ヒスイのすがた）": "sneasel-hisui",
  "ダイケンキ（ヒスイのすがた）": "samurott-hisui",
  "ドレディア（ヒスイのすがた）": "lilligant-hisui",
  "ゾロア（ヒスイのすがた）": "zorua-hisui",
  "ゾロアーク（ヒスイのすがた）": "zoroark-hisui",
  "ウォーグル（ヒスイのすがた）": "braviary-hisui",
  "ヌメイル（ヒスイのすがた）": "sliggoo-hisui",
  "ヌメルゴン（ヒスイのすがた）": "goodra-hisui",
  "クレベース（ヒスイのすがた）": "avalugg-hisui",
  "ジュナイパー（ヒスイのすがた）": "decidueye-hisui",

  "ウパー（パルデアのすがた）": "wooper-paldea",

  "ケンタロス（パルデアのすがた・コンバット種）": "tauros-paldea-combat-breed",
  "ケンタロス（パルデアのすがた・ブレイズ種）": "tauros-paldea-blaze-breed",
  "ケンタロス（パルデアのすがた・ウォーター種）": "tauros-paldea-aqua-breed",

  // =========================
  // ロトム
  // =========================

  "ヒートロトム": "rotom-heat",
  "ウォッシュロトム": "rotom-wash",
  "フロストロトム": "rotom-frost",
  "スピンロトム": "rotom-fan",
  "カットロトム": "rotom-mow",

  // =========================
  // 性別・姿違い
  // =========================

  "ニャオニクス（オス）": "meowstic-male",
  "ニャオニクス（メス）": "meowstic-female",

  "イダイトウ（オス）": "basculegion-male",
  "イダイトウ（メス）": "basculegion-female",

  "ルガルガン（まひるのすがた）": "lycanroc-midday",
  "ルガルガン（まよなかのすがた）": "lycanroc-midnight",
  "ルガルガン（たそがれのすがた）": "lycanroc-dusk",

  // =========================
  // 伝説・幻 フォルム
  // =========================

  "デオキシス（ノーマルフォルム）": "deoxys-normal",
  "デオキシス（アタックフォルム）": "deoxys-attack",
  "デオキシス（ディフェンスフォルム）": "deoxys-defense",
  "デオキシス（スピードフォルム）": "deoxys-speed",

  "シェイミ（ランドフォルム）": "shaymin-land",
  "シェイミ（スカイフォルム）": "shaymin-sky",

  "ギラティナ（アナザーフォルム）": "giratina-altered",
  "ギラティナ（オリジンフォルム）": "giratina-origin",

  "トルネロス（けしんフォルム）": "tornadus-incarnate",
  "トルネロス（れいじゅうフォルム）": "tornadus-therian",

  "ボルトロス（けしんフォルム）": "thundurus-incarnate",
  "ボルトロス（れいじゅうフォルム）": "thundurus-therian",

  "ランドロス（けしんフォルム）": "landorus-incarnate",
  "ランドロス（れいじゅうフォルム）": "landorus-therian",

  "ラブトロス（けしんフォルム）": "enamorus-incarnate",
  "ラブトロス（れいじゅうフォルム）": "enamorus-therian",

  "ディアルガ（オリジンフォルム）": "dialga-origin",
  "パルキア（オリジンフォルム）": "palkia-origin",

  "キュレム（キュレムのすがた）": "kyurem",
  "キュレム（ホワイトキュレム）": "kyurem-white",
  "キュレム（ブラックキュレム）": "kyurem-black",

  "ケルディオ（いつものすがた）": "keldeo-ordinary",
  "ケルディオ（かくごのすがた）": "keldeo-resolute",

  "メロエッタ（ボイスフォルム）": "meloetta-aria",
  "メロエッタ（ステップフォルム）": "meloetta-pirouette",

  "フーパ（いましめられしフーパ）": "hoopa",
  "フーパ（ときはなたれしフーパ）": "hoopa-unbound",

  "ネクロズマ": "necrozma",
  "ネクロズマ（たそがれのたてがみ）": "necrozma-dusk",
  "ネクロズマ（あかつきのつばさ）": "necrozma-dawn",

  "ウーラオス（いちげきのかた）": "urshifu-single-strike",
  "ウーラオス（れんげきのかた）": "urshifu-rapid-strike",

  "バドレックス": "calyrex",
  "バドレックス（はくばじょうのすがた）": "calyrex-ice",
  "バドレックス（こくばじょうのすがた）": "calyrex-shadow"
};


let japanesePokemonMapPromise = null;


function loadJapanesePokemonMap() {

  if (japanesePokemonMapPromise) {
    return japanesePokemonMapPromise;
  }

  japanesePokemonMapPromise = fetch(
    "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv"
  )
    .then(response => response.text())
    .then(text => {

      const map = {};

      const lines = text.split("\n");

      for (const line of lines) {

        const parts = line.split(",");

        const speciesId = parts[0];
        const languageId = parts[1];
        const name = parts[2];

        if (languageId === "1" && name) {
          map[name] = speciesId;
        }
      }

      return map;
    });

  return japanesePokemonMapPromise;
}


async function getPokemonImage(name) {

  try {

    let endpoint;

    // =========================
    // 特殊フォルム
    // =========================

    if (pokemonFormNames[name]) {

      endpoint =
        `https://pokeapi.co/api/v2/pokemon/${pokemonFormNames[name]}`;

    } else {

      // =========================
      // 通常ポケモン
      // =========================

      const japaneseMap =
        await loadJapanesePokemonMap();

      const speciesId =
        japaneseMap[name];

      if (!speciesId) {
        console.warn(
          "ポケモンIDが見つかりません:",
          name
        );

        return "";
      }

      endpoint =
        `https://pokeapi.co/api/v2/pokemon/${speciesId}`;
    }


    const response =
      await fetch(endpoint);


    if (!response.ok) {

      console.warn(
        "PokéAPI取得失敗:",
        name,
        endpoint
      );

      return "";
    }


    const data =
      await response.json();


    // =========================
    // Pokémon Champions画像
    // =========================

    const championsSprite =
      data.sprites
        ?.versions
        ?.["generation-ix"]
        ?.["champions"]
        ?.front_default;


    // =========================
    // HOME系画像
    // =========================

    const homeSprite =
      data.sprites
        ?.other
        ?.home
        ?.front_default;


    // =========================
    // 公式アート
    // =========================

    const officialArtwork =
      data.sprites
        ?.other
        ?.["official-artwork"]
        ?.front_default;


    // =========================
    // 通常スプライト
    // =========================

    const fallbackSprite =
      data.sprites
        ?.front_default;


    return (
      championsSprite ||
      homeSprite ||
      officialArtwork ||
      fallbackSprite ||
      ""
    );

  } catch (error) {

    console.error(
      "画像取得エラー:",
      name,
      error
    );

    return "";
  }
}
