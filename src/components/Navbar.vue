<script setup>
import { ref, onMounted } from 'vue';

const totalCaught = ref(0);

onMounted(() => {
    updateTotalCaught();
});

// Fungsi untuk memperbarui jumlah Pokémon yang ditangkap
function updateTotalCaught() {
    const storedCollection = JSON.parse(localStorage.getItem("pokemonCollection")) || [];
    totalCaught.value = storedCollection.length;
}

// Dengarkan perubahan `localStorage`
window.addEventListener("storage", updateTotalCaught);
</script>

<template>
    <main>
        <div class="mx-5 lg:mx-24">
        <header class="flex items-center justify-between mb-12 lg:mb-24">
            <div>
                <router-link :to="`../`">
                    <img src="../assets/img/pokemon-logo.png" alt="pokemon-logo" class="w-32 lg:w-50 h-auto mt-4 cursor-pointer">
                </router-link>
            </div>
            <router-link :to="`/memory`">
            <div class="card-catch px-5 py-2 hover:bg-yellow-400 flex items-center justify-between rounded-2xl">
                    <p class="font-semi">
                        {{totalCaught}}
                        catch
                    </p>
                    <img src="../assets/img/pokecatch.png" alt="" class="w-5 h-auto ml-3 cursor-pointer">
                </div>
            </router-link>
        </header>
    </div>
    </main>
</template>
<style>
</style>