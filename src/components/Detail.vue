<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import navbar from './Navbar.vue';

const route = useRoute();
const pokemon = ref(null);
const isLoading = ref(true);
const activeTab = ref('about');
const message = ref(""); 

// Modal catch & collection
const showModal = ref(false)
const catchInProgress = ref(false)
const modalPokemon = ref(null)

// --- Fitur Catch ---
  
async function attemptCatch() {
    showModal.value = true
    catchInProgress.value = true
    // Tampilkan animasi catch selama 3 detik
    setTimeout(async () => {
      catchInProgress.value = false
      // Kesempatan menangkap dinaikkan menjadi 90%
      const success = Math.random() < 0.9
      if (success) {
        modalPokemon.value = await fetchRandomPokemon()
      } else {
        modalPokemon.value = null
      }
      // Jika gagal, modal tetap terbuka (user harus klik tombol "Tutup")
    }, 3000)
  }

// Fungsi untuk mengambil Pokémon acak saat berhasil menangkap
async function fetchRandomPokemon() {
    try {
        const randomId = Math.floor(Math.random() * 151) + 1; // Pokémon dari 1-151 (Generasi 1)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        if (!response.ok) throw new Error("Gagal mengambil Pokémon!");

        const data = await response.json();
        return {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            image: data.sprites.other["official-artwork"].front_default || "/default.png",
            types: data.types.map(t => t.type.name),
        };
    } catch (error) {
        console.error("Error fetching random Pokémon:", error);
        return null;
    }
}

// Fungsi untuk menyimpan Pokémon ke koleksi pemain
function capturePokemon() {
    let collection = JSON.parse(localStorage.getItem("pokemonCollection")) || [];
    if (modalPokemon.value) {
        collection.push(modalPokemon.value);
        localStorage.setItem("pokemonCollection", JSON.stringify(collection));
        message.value = `${modalPokemon.value.name} berhasil ditangkap!`;
    }
    closeModal();
}

// Fungsi untuk menutup modal
function closeModal() {
    showModal.value = false;
    modalPokemon.value = null;
}


const typeColors = {
  grass: "bg-green-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  psychic: "bg-purple-500",
  ice: "bg-cyan-300",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-orange-600",
  flying: "bg-sky-400",
  poison: "bg-purple-400",
  ground: "bg-yellow-700",
  rock: "bg-yellow-800",
  bug: "bg-lime-500",
  ghost: "bg-indigo-400",
  steel: "bg-gray-500",
};

async function fetchPokemonByName(name) {
  try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error("Gagal mengambil data Pokémon!");

        const data = await response.json();
        const totalStats = data.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const averageStats = totalStats / data.stats.length;

        console.log("Moves:", data.moves);
        
        pokemon.value = {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            image: data.sprites.other["official-artwork"].front_default || "/default.png",
            types: data.types.map((t) => t.type.name),
            height: `${data.height / 10} (M)`,
            weight: `${data.weight / 10} (KG)`,
            abilities: data.abilities.map((a) => a.ability.name),
            experience: data.base_experience,
            stats: data.stats,
            moves: data.moves.map((m) => m.move.name),
            averageStats: averageStats.toFixed(2),
        };
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    errorMessage.value = "Error fetching Pokémon data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
    fetchPokemonByName(route.params.name);
});
</script>

<template>
    <navbar/>
    
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <p class="text-center text-lg font-semibold text-gray-800 animate-pulse">Loading...</p>
    </div>

    <div class="mx-5 lg:mx-24">
        <main v-if="pokemon" class="mb-8 -mt-8 lg:-mt-20">
            <div class="grid grid-rows-1 grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                    <div>
                        <div class="flex items-center justify-center ">
                            <div class="relatif w-full">
                                <div>
                                    <p class="font-semi text-center">{{ String(pokemon.id).padStart(4, "0") }}</p>
                                    <div class="flex items-center justify-center">
                                        <img src="../assets/img/ici.png" alt="pokesmall" class="mr-2">
                                        <p class="font-extra text-3xl tracking-widest text-black-0">{{ pokemon.name }}</p>
                                    </div>
                                </div>
                                <div class="absolute right-34 lg:right-240 inset-y-54 lg:inset-y-60 z-index">
                                    <img src="../assets/img/poke-shadow.png" :alt="pokemon.image">
                                </div>
                                <div class="relative flex items-center justify-center">
                                    <img :src="pokemon.image" :alt="pokemon.name" class="w-72">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                      <div class="flex items-center justify-center mt-6 lg:mt-4">
                        <div 
                          class="card-catch px-5 py-2 hover:bg-yellow-400 flex items-center justify-between cursor-pointer" 
                          @click="attemptCatch"
                        >
                          <img src="../assets/img/pokecatch.png" alt="logo-pokemon" class="w-8 h-auto mr-2 animate-bounce">
                          <p class="font-semi">
                            Catch {{ pokemon.name }}
                          </p>
                        </div>
                      </div>
                
                      <!-- Notifikasi hasil gacha -->
                      <p v-if="message" class="mt-4 text-center font-bold">{{ message }}</p>
                    </div>

                </div>
                <div class="card w-full lg:w-9/12 px-6 py-3">
                    <div class="flex items-center justify-between mb-8">
                        <div @click="activeTab = 'about'" :class="[
                            'cursor-pointer py-1 px-5 rounded-2xl text-slate-800',
                            { 'home-switch-active font-bold bg-yellow-400': activeTab === 'about' },
                            ]">About
                        </div> 
                        <div @click="activeTab = 'stats'" :class="[
                              'cursor-pointer py-1 px-5 rounded-2xl text-slate-800',
                              { 'home-switch-active font-bold bg-yellow-400': activeTab === 'stats' },
                            ]">Stats
                        </div>
                        <div @click="activeTab = 'moves'" :class="[
                              'cursor-pointer py-1 px-5 rounded-2xl text-slate-800',
                              { 'home-switch-active font-bold bg-yellow-400': activeTab === 'moves' },
                            ]">Moves
                        </div>
                    </div>
                    <div v-if="activeTab === 'about'" class="w-full lg:px-7">
                        <div class="grid grid-rows-1 grid-cols-3 gap-3 mb-5 lg:mb-3">
                            <strong class="font-semi">
                                Types
                            </strong>
                            <div class="flex items-center gap-1">
                                <span
                                  v-for="type in pokemon.types"
                                  :key="type"
                                  :class="[typeColors[type] || 'bg-gray-200', 'px-2 py-1 text-slate-800 rounded text-sm capitalize w-fit']"
                                >
                                  {{ type }}
                                </span>
                            </div>
                        </div>
                        <div class="grid grid-rows-1 grid-cols-3 gap-3 mb-5 lg:mb-3">
                            <strong class="font-semi">
                                Height
                            </strong>
                            <div class="col-span-2">
                                {{ pokemon.height }}
                            </div>
                        </div>
                        <div class="grid grid-rows-1 grid-cols-3 gap-3 mb-5 lg:mb-3">
                            <strong class="font-semi">
                                Weight
                            </strong>
                            <div class="col-span-2">
                                {{ pokemon.weight }}
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-3 mb-5 lg:mb-3">
                          <strong>Abilities</strong>
                          <div class="col-span-2">
                            <div class="flex flex-col gap-2">
                              <div
                                v-for="ability in pokemon.abilities"
                                :key="ability"
                                class="flex items-center gap-2 px-2 py-1 bg-yellow-400 text-slate-800 rounded text-sm capitalize w-fit"
                              >
                                <img src="../assets/img/pikachu.png" alt="ability icon" class="w-4 h-4">
                                {{ ability }}
                              </div>
                            </div>
                          </div>    
                        </div>


                        <div class="grid grid-rows-1 grid-cols-3 gap-3 mb-5 lg:mb-3">
                            <strong class="font-semi">
                                Experience
                            </strong>
                            <div class="col-span-2">
                                {{ pokemon.experience }}
                            </div>
                        </div>
                    </div>
                    <div v-if="activeTab === 'stats'" class="w-full lg:px-7">
                        <div v-for="stat in pokemon.stats" :key="stat.stat.name">
                            <p class="text-teks font-semibold pt-2">
                              {{ stat.stat.name.toUpperCase() }}: {{ stat.base_stat }}
                            </p>
                            <div class="w-full bg-white rounded-full h-3">
                                <div
                                  class="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                                  :style="{ width: stat.base_stat + '%' }"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div v-if="activeTab === 'moves'" class="mt-4 space-y-4">
                        <div class="grid grid-cols-2 max-h-[300px] overflow-y-auto p-2 md:grid-cols-3 gap-4">
                            <span v-for="move in pokemon.moves" :key="move" class=" rounded-md text-center text-teks font-medium text-sm">
                              {{ move }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal Catch -->
            <div
              v-if="showModal"
              class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div class="bg-white p-6 rounded-2xl w-80">
                <div v-if="catchInProgress" class="text-center">
                  <p class="font-semi mb-4">Sedang menangkap Pokémon...</p>
                  <!-- Gambar animasi menangkap, misalnya gambar yang berputar atau melompat -->
                  <img
                    src="../assets/img/pokecatch.png"
                    alt="catching"
                    class="w-20 mx-auto animate-spin"
                  />
                </div>
                <div v-else>
                  <div v-if="modalPokemon">
                    <div class="text-center mb-4">
                      <img :src="modalPokemon.image" :alt="modalPokemon.name" class="w-40 mx-auto" />
                      <p class="font-extra text-xl mt-2">{{ modalPokemon.name }}</p>
                      <p class="text-sm">Tipe: {{ modalPokemon.types.join(', ') }}</p>
                    </div>
                    <div class="flex justify-around">
                      <button @click="capturePokemon" class="px-4 py-2 bg-green-400 rounded-lg text-white">
                        Tangkap
                      </button>
                      <button @click="closeModal" class="px-4 py-2 bg-red-400 rounded-lg text-white">
                        Lepaskan
                      </button>
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <p class="font-semi mb-4">Gagal menangkap! Pokémon lolos.</p>
                    <button @click="closeModal" class="px-4 py-2 bg-red-400 rounded-lg text-white">
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </main>
    </div>
</template>

<style>
.card-catch {
    -webkit-backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
    backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
    background-color: hsla(0, 0%, 100%, .618);
    border-radius: 15px;
    box-shadow: 0 5px 10px rgba(154, 160, 185, .05), 0 15px 40px rgba(196, 202, 226, .2);
    cursor: pointer;
    margin-bottom: 1rem;
}

.home-switch-active {
    background: #facc15;
    border-radius: 20px;
    text-align: center;
}

.card, .card-pokemon {
    background: #fff;
    box-shadow: 0 5px 10px rgba(154, 160, 185, .05), 0 15px 40px rgba(196, 202, 226, .2);
    margin-bottom: 1rem;
}
</style>
