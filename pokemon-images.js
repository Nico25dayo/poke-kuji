const pokemonImages = {
  "フシギバナ": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
  "リザードン": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  "カメックス": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
  "ゲンガー": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
  "カビゴン": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
  "カイリュー": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png"
};

function getPokemonImage(name) {
  return pokemonImages[name] || "";
}
