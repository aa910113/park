<template>
  <div class="p-6 w-auto bg-stone-300">
    <main class="flex">
      <article class="flex-auto w-1/3">
        <nav>
          <h1 class="text-3xl">停掐</h1>
        </nav>
        <router-view />
      </article>
      <aside class="flex-auto w-2/3 rounded-xl overflow-hidden shadow-xl">
        <GoogleMap
          :api-key="mapsKey"
          style="width: 100%; height: 800px"
          :center="center"
          :zoom="15"
        >
          <Marker :options="{ position: center }" />
        </GoogleMap>
      </aside>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const mapsKey = process.env.VUE_APP_MAPS_KEY;
    const center = { lat: 40.689247, lng: -74.044502 };

    return { mapsKey, center };
  },
});
</script>
