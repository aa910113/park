<template>
  <div class="p-6 w-auto">
    <main class="flex flex-col-reverse md:flex-row">
      <article class="flex-auto w-full md:w-2/3 lg:w-1/3 me-3">
        <nav class="flex justify-between justify-items-center">
          <h1 class="text-3xl text-purple-700">停掐</h1>
        </nav>
        <router-view />
      </article>
      <aside class="
              flex-auto
              w-full
              md:w-1/3
              lg:w-2/3
              h-52
              md:h-full
              rounded-xl
              overflow-hidden
              shadow-xl
              mb-4
              md:mb-0
            "
        >
        <GoogleMap
          :api-key="mapsKey"
          style="width: 100%; height: calc(100vh - 3rem)"
          :center="center"
          :zoom="16"
        >
          <Marker :options="{ position: center }" />
        </GoogleMap>
      </aside>
    </main>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, onMounted, computed } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import axios from 'axios';
import { errorAlert } from '@/plugins/sweetalert2';

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const store = useStore();
    const mapsKey = process.env.VUE_APP_MAPS_KEY;
    const center = computed(() => store.state.parkPosition);

    const getToken = async () => {
      try {
        const { data } = await axios.post(
          'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
          {
            grant_type: 'client_credentials',
            client_id: process.env.VUE_APP_TDX_CLIENT_Id,
            client_secret: process.env.VUE_APP_TDX_CLIENT_SECRET,
          },
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          },
        );
        if (data.access_token && data.expires_in) {
          const accessToken = data.access_token;
          const expiresIn = data.expires_in;
          const now = new Date();
          now.setTime(now.getTime() + expiresIn * 1000);
          document.cookie = `pk=${accessToken}; expires=${now.toUTCString()}; path=/`;
        } else {
          errorAlert();
        }
      } catch (err) {
        errorAlert(err.response);
      }
    };

    onMounted(() => {
      getToken();
    });

    return { mapsKey, center };
  },
});
</script>
