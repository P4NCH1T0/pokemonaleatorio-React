import React, { useState } from "react";

const PokemonGenerator = () => {
  const [pokemon, setPokemon] = useState(null);
  const [isBackSprite, setIsBackSprite] = useState(false); // Controla el cambio de imagen

  const fetchPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Número aleatorio entre 1 y 1011
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Error al obtener los datos");

      const data = await response.json();

      // Extraer información del Pokémon
      const pokemonData = {
        name: data.name.toUpperCase(),
        id: data.id,
        types: data.types.map((t) => t.type.name).join(", "),
        abilities: data.abilities.map((a) => a.ability.name).join(", "),
        weight: data.weight / 10, // Convertir a kg
        height: data.height / 10, // Convertir a metros
        stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
        sprites: {
          front: data.sprites.front_default,
          back: data.sprites.back_default,
          shiny: data.sprites.front_shiny,
        },
      };

      setPokemon(pokemonData);
      setIsBackSprite(false); // Resetear sprite al cambiar de Pokémon
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>Pokémon Aleatorio</h1>
      <button onClick={fetchPokemon}>Generar Pokémon</button>

      {pokemon && (
        <div>
          <h3>
            {pokemon.name} (#{pokemon.id})
          </h3>
          <p>
            <strong>Tipo:</strong> {pokemon.types}
          </p>
          <p>
            <strong>Habilidades:</strong> {pokemon.abilities}
          </p>
          <p>
            <strong>Peso:</strong> {pokemon.weight} kg
          </p>
          <p>
            <strong>Altura:</strong> {pokemon.height} m
          </p>

          <p><strong>Estadísticas base:</strong></p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pokemon.stats.map((stat) => (
              <li key={stat.name}>
                <strong>{stat.name}:</strong> {stat.value}
              </li>
            ))}
          </ul>

          <p><strong>Sprites:</strong></p>
          <img
            src={isBackSprite ? pokemon.sprites.back : pokemon.sprites.front}
            alt={pokemon.name}
            style={{ width: "150px", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={() => setIsBackSprite(true)}
            onMouseLeave={() => setIsBackSprite(false)}
          />
          <img
            src={pokemon.sprites.shiny}
            alt={`Shiny ${pokemon.name}`}
            style={{ width: "150px", marginLeft: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default PokemonGenerator;
