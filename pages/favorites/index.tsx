import React,{useState, useEffect} from "react";
import { Layout } from "@/components/layouts";
import { Container, Text, Image, Grid, Card } from "@nextui-org/react";

import { NextPage } from "next";
import { NoFavorites } from "@/components/ui";
import { localFavorites } from "@/utils";
import {FavoritesPokemon} from "../../components/pokemon/FavoritesPokemon"


const FavoritesPage: NextPage = () => {

  const [favoritesPokemons, setFavoritePokemons] = useState<number[]>([])

  useEffect(() => {
    setFavoritePokemons(localFavorites.pokemons())
  
    
  }, [])
  

  return (
    <Layout title="Pokémons - Favoritos">
      {
        favoritesPokemons.length === 0 ? (<NoFavorites/>)
        : (
          <FavoritesPokemon pokemons={favoritesPokemons}/>
        )
      }
      
    </Layout>
  );
};

export default FavoritesPage;
