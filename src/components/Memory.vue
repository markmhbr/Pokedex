<script setup>
import { ref, onMounted } from 'vue';
import navbar from './Navbar.vue';

const pokemonCollection = ref([]);
const isLoading = ref(true); // Menambahkan state untuk loading

// Ambil koleksi dari localStorage saat halaman dimuat
onMounted(() => {
    setTimeout(() => { // Simulasi delay untuk loading
        const storedCollection = JSON.parse(localStorage.getItem("pokemonCollection")) || [];
        pokemonCollection.value = storedCollection;
        isLoading.value = false; // Hentikan loading setelah data selesai dimuat
        console.log("Memuat koleksi dari localStorage:", pokemonCollection.value);
    }, 500); // Set timeout 0,5 detik
});

// Fungsi untuk menghapus Pokémon dari koleksi
const removePokemon = (id) => {
    pokemonCollection.value = pokemonCollection.value.filter(pokemon => pokemon.id !== id);
    localStorage.setItem("pokemonCollection", JSON.stringify(pokemonCollection.value));
};
</script>

<template>
    <navbar/>
    <!-- Tampilkan loading saat data belum dimuat -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <img src="../assets/img/pokecatch.png" alt="Loading..." class="w-20 mx-auto animate-spin">
    </div>

    <div v-else>
        <div class="mx-5 lg:mx-24">
            <div v-if="pokemonCollection.length === 0" class=" text-center text-gray-500 mt-4">
                Belum ada Pokémon yang ditangkap!
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <div v-for="pokemon in pokemonCollection" :key="pokemon.id" class="bg-white shadow-lg rounded-lg p-4">
                    <img :src="pokemon.image" :alt="pokemon.name" class="w-24 mx-auto">
                    <p class="text-center font-semibold mt-2">{{ pokemon.name }}</p>
                    <p class="text-center text-sm text-gray-600">Tipe: {{ pokemon.types.join(', ') }}</p>

                    <!-- Tombol Hapus -->
                    <button 
                        @click="removePokemon(pokemon.id)" 
                        class="mt-3 w-full bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
