<script setup>
import { ref, onMounted } from "vue";

const limit = 21;
let offset = 0;
const pokemons = ref([]);
const isLoading = ref(true); // State untuk loading

async function fetchPokemonList() {
    isLoading.value = true; // Aktifkan loading saat mulai fetch
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error("Gagal mengambil daftar Pokémon!");
        const data = await response.json();
        
        const detailedPokemons = await Promise.all(
            data.results.map(async (pokemon) => {
                const details = await fetchPokemonDetails(pokemon.url);
                return details;
            })
        );

        pokemons.value = detailedPokemons;
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false; // Matikan loading setelah selesai fetch
    }
}

async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Gagal mengambil data Pokémon!");

        const data = await response.json();
        return {
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            id: data.id,
            image: data.sprites.other["official-artwork"].front_default,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function loadMore() {
    isLoading.value = true; // Aktifkan loading saat menambah data
    offset += limit;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error("Gagal mengambil daftar Pokémon!");
        const data = await response.json();
        
        const newPokemons = await Promise.all(
            data.results.map(async (pokemon) => {
                const details = await fetchPokemonDetails(pokemon.url);
                return details;
            })
        );
        

        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 0,5 detik
        pokemons.value.push(...newPokemons);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false; // Matikan loading setelah data ditambahkan
    }
}

onMounted(fetchPokemonList);
</script>

<template>
    <div class="mx-5 lg:mx-24">
      <main>
        <!-- Tampilkan loading saat data belum dimuat -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <img src="../assets/img/pokecatch.png" alt="Loading..." class="w-20 mx-auto animate-spin">
        </div>

        <div v-else>
        <!-- Tampilkan daftar Pokémon jika data sudah tersedia -->
            <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
              <div 
                v-for="pokemon in pokemons" 
                :key="pokemon.id" 
                class="card-pokemon p-8 lg:p-10 relative flex items-center justify-between transform transition-transform duration-300 hover:-translate-y-2 hover:text-yellow-500 mt-10">
                <router-link :to="`/pokemon/${pokemon.name}`">
                  <div class="pl-8">
                    <p class="font-semibold">{{ String(pokemon.id).padStart(4, "0") }}</p>
                    <p class="font-bold text-xl md:text-2xl text-gray-900">{{ pokemon.name }}</p>
                  </div>
                  <div class="absolute z-10 -top-0 md:-top-6 lg:-top-10 right-7 md:-right-2 lg:-right-5">
                    <img src="../assets/img/poke-shadow.png" alt="" class="w-16 md:w-20 lg:w-24">
                  </div>
                  <div class="absolute z-20 -top-2 md:-top-10 lg:-top-14 right-8 md:-right-3 lg:-right-5">
                    <img :src="pokemon.image" :alt="pokemon.name" class="w-28 md:w-36 lg:w-40 xl:w-44 h-auto mt-2">
                  </div>
                </router-link>
              </div>
            </div>
          
            <!-- Tombol Load More dengan efek loading -->
            <div class="flex items-center justify-center">
              <div class="card-load px-5 py-2 hover:bg-yellow-400 rounded-2xl transition-all duration-200 w-30">
                <button @click="loadMore" :disabled="isLoading" class="flex items-center">
                  <!-- <span v-if="isLoading">
                    <img src="../assets/img/loading.gif" alt="Loading..." class="w-5 h-5 mr-2">
                  </span> -->
                  Load More
                </button>
              </div>
            </div>
        </div>
      </main>
    </div>
</template>

<style scoped>
.card-pokemon {
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.35s;
}
.card, .card-pokemon {
  background: #fff;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(196, 202, 226, 0.2);
  margin-bottom: 1rem;
}
.card-pokemon {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 140px;
}
.card-load {
  backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
  border-radius: 15px;
  box-shadow: 0 5px 10px rgba(154, 160, 185, .05), 0 15px 40px rgba(196, 202, 226, .2);
  cursor: pointer;
  margin-bottom: 1rem;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
