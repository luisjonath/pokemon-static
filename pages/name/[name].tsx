import React,{FC, useState} from "react";
import { Layout } from "../../components/layouts/Layout";
import { useRouter } from "next/router";
import { GetStaticProps, NextPage, GetStaticPaths } from "next";
import { pokeApi } from "@/api";
import { Pokemon, PokemonListResponse } from "@/interfaces";
import { Button, Card, Container, Grid, Text, Image } from "@nextui-org/react";
import { getPokemonInfo, localFavorites } from "@/utils";
import confetti from "canvas-confetti"

interface Props {
    pokemon: Pokemon;
  }
const PokemonByNamePage:NextPage<Props> = ({pokemon}) => {

    const [isInfavorites, setIsInFavorites] = useState(localFavorites.existInFavorites(pokemon.id))

  const onToggleFavorite =() => {
    localFavorites.toggleFavorite(pokemon.id)
    setIsInFavorites(!isInfavorites)

    if(isInfavorites)return;

confetti({
  zIndex: 999,
  particleCount: 100,
  spread: 160,
  angle: -100,
  origin: {
    x: 1,
    y: 0,
  }
})
    
  }
    
    return (
        <Layout title={pokemon.name}>
          <Grid.Container css={{ marginTop: "5px" }} gap={2}>
            <Grid xs={12} sm={4}>
              <Card isHoverable css={{ padding: "30px" }}>
                <Card.Body>
                  <Card.Image
                    src={
                      pokemon.sprites.other?.dream_world.front_default ||
                      "/no-image.png"
                    }
                    alt={pokemon.name}
                    width="100%"
                    height={200}
                  />
                </Card.Body>
              </Card>
            </Grid>
            <Grid xs={12} sm={8}>
              <Card>
                <Card.Header
                  css={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text h1 transform="capitalize">
                    {pokemon.name}
                  </Text>
                  <Button onClick={onToggleFavorite} color="gradient" ghost={!isInfavorites}>
                   {isInfavorites ? "En favoritos" : "Guardar en favoritos"}
                    
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Text size={30}>Sprites:</Text>
                  <Container direction="row" display="flex" gap={0}>
                    <Image
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                    />
                    <Image
                      src={pokemon.sprites.back_default}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                    />
                    <Image
                      src={pokemon.sprites.front_shiny}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                    />
                    <Image
                      src={pokemon.sprites.back_shiny}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                    />
                  </Container>
                </Card.Body>
              </Card>
            </Grid>
          </Grid.Container>
        </Layout>
      );
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const {data} = await pokeApi.get<PokemonListResponse>("/pokemon?limit=151")
    const pokemonNames: string[] = data.results.map(pokemon => pokemon.name)

    return {
      /* paths: [
        {
          params: {
            id: "1"
          }
        }
      ], */
      paths: pokemonNames.map((name) => ({
        params: { name },
      })),
      /* fallback: false, */
      fallback: "blocking",
    };
  };

  export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { name } = params as { name: string };
  
    const pokemon = await getPokemonInfo(name)

  if(!pokemon) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

    return {
      props: {
        pokemon
      },
      revalidate: 86400,
    };
  };

  export default PokemonByNamePage