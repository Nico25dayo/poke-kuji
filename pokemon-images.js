const pokemonFormNames = {
  "ライチュウ（アローラのすがた）": "raichu-alola",
  "キュウコン（アローラのすがた）": "ninetales-alola",
  "ウインディ（ヒスイのすがた）": "arcanine-hisui",

  "ヤドラン（ガラルのすがた）": "slowbro-galar",
  "ヤドキング（ガラルのすがた）": "slowking-galar",

  "ケンタロス（パルデアのすがた・コンバット種）": "tauros-paldea-combat-breed",
  "ケンタロス（パルデアのすがた・ブレイズ種）": "tauros-paldea-blaze-breed",
  "ケンタロス（パルデアのすがた・ウォーター種）": "tauros-paldea-aqua-breed",

  "バクフーン（ヒスイのすがた）": "typhlosion-hisui",
  "ダイケンキ（ヒスイのすがた）": "samurott-hisui",
  "ゾロアーク（ヒスイのすがた）": "zoroark-hisui",
  "ヌメルゴン（ヒスイのすがた）": "goodra-hisui",
  "クレベース（ヒスイのすがた）": "avalugg-hisui",
  "ジュナイパー（ヒスイのすがた）": "decidueye-hisui",

  "マッギョ（ガラルのすがた）": "stunfisk-galar",

  "ヒートロトム": "rotom-heat",
  "ウォッシュロトム": "rotom-wash",
  "フロストロトム": "rotom-frost",
  "スピンロトム": "rotom-fan",
  "カットロトム": "rotom-mow",

  "ニャオニクス（オス）": "meowstic-male",
  "ニャオニクス（メス）": "meowstic-female",

  "ルガルガン（まひるのすがた）": "lycanroc-midday",
  "ルガルガン（まよなかのすがた）": "lycanroc-midnight",
  "ルガルガン（たそがれのすがた）": "lycanroc-dusk",

  "イダイトウ（オス）": "basculegion-male",
  "イダイトウ（メス）": "basculegion-female"
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

        // 日本語
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

    // 特殊フォルム
    if (pokemonFormNames[name]) {

      endpoint =
        `https://pokeapi.co/api/v2/pokemon/${pokemonFormNames[name]}`;

    } else {

      const japaneseMap = await loadJapanesePokemonMap();

      const speciesId = japaneseMap[name];

      if (!speciesId) {
        console.warn("ポケモンIDが見つかりません:", name);
        return "";
      }

      endpoint =
        `https://pokeapi.co/api/v2/pokemon/${speciesId}`;
    }


    const response = await fetch(endpoint);

    if (!response.ok) {
      console.warn("PokéAPI取得失敗:", name);
      return "";
    }


    const data = await response.json();


    // Pokémon Champions用
    const championsSprite =
      data.sprites?.versions?.["generation-ix"]?.["champions"]?.front_default;


    // Champions画像が無い場合の保険
    const fallbackSprite =
      data.sprites?.front_default;


    return championsSprite || fallbackSprite || "";

  } catch (error) {

    console.error("画像取得エラー:", name, error);

    return "";
  }
}
