<template>
  <div class="parking">
    <div class="text-xl mt-2">
      <label for="selectCity">地區 :
        <select
          id="selectCity"
          class=" px-2 py-1 border border-slate-300 rounded-md shadow"
          aria-label="選擇縣市"
          v-model="selectCity"
          @change="getParkingList"
        >
          <option
            v-for="city in cityList.arr"
            :key="city.CityCode"
            :value="city.City"
          >{{ city.CityName }}</option>
        </select>
      </label>
    </div>
    <p class="me-4 text-end text-gray-500 text-YuPearlExtraLight">
      搜尋到 {{ parkingList.arr.length }} 筆
    </p>
    <div
      class="overflow-auto"
      style="height: calc(100vh - 10rem)"
    >
      <div v-if="loading">
        <div
          v-for="item in 2"
          :key="item"
          class="card mb-5 me-2"
        >
          <div class="card-body">
            <div class="animate-pulse">
              <div class="flex-1 space-y-6 py-1">
                <div class="space-y-3">
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-4"></div>
                  </div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-8"></div>
                  </div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                  </div>
                  <div class="h-2 bg-slate-700 rounded"></div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-4"></div>
                  </div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-12"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-12"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-12"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-if="parkingList.arr.length === 0"
          class="text-center text-3xl text-slate-400 mt-60"
        >
          找不到停車場
        </div>
        <ul>
          <li
            v-for="park in parkingList.arr"
            :key="park.CarParkID"
          >
            <div
              class="
              card
              "
              :class="selectId === park.CarParkID ? 'open' : ''"
            >
              <div class="card-body">
                <div class="flex justify-between">
                  <div class="flex">
                    <h4 class="text-2xl mb-4 me-4">{{ park.CarParkName.Zh_tw }}</h4>
                    <div :class="selectId === park.CarParkID ? 'pt-3' : 'pt-1'">
                      <i
                        class="
                        las
                        la-angle-double-down
                        text-purple-600
                        hover:text-purple-300
                        active:text-purple-800
                        text-xl
                        h-5
                        transition
                        duration:0.5s
                        ease-in
                        "
                        :class="selectId === park.CarParkID ? 'rotate-180' : ''"
                        @click="more(park.CarParkID)"
                        @keyup.enter="more(park.CarParkID)"
                      ></i>
                    </div>
                  </div>
                  <div>
                    <i
                      class="
                      las
                      la-route
                      text-3xl
                      text-purple-600
                      hover:text-purple-300
                      active:text-purple-800
                      "
                      @click="getLocation(park)"
                      @keyup.enter="getLocation(park)"
                    ></i>
                    <i
                      class="
                      las
                      la-map-marker-alt
                      text-3xl
                      text-purple-600
                      hover:text-purple-300
                      active:text-purple-800
                      "
                      @click="showPosition(park.CarParkPosition)"
                      @keyup.enter="showPosition(park.CarParkPosition)"
                    ></i>
                  </div>
                </div>
                <div class="grid grid-cols-12 gap-2 text-xl">
                  <div class="col-span-12">剩餘停車位 :
                    <span class="text-orange-500 text-3xl">
                      {{ !park.AvailableSpaces ? '---' : park.AvailableSpaces }}
                    </span>
                  </div>
                  <div class="col-span-2">地址 :</div>
                  <div class="col-span-12 text-gray-500 text-md text-YuPearlExtraLight">
                    {{ !park.Address ? '無' : park.Address }}
                  </div>
                  <div class="col-span-3">車場描述 :</div>
                  <div class="col-span-12 text-gray-500 text-md text-YuPearlExtraLight">
                    {{ park.Description }}
                  </div>
                  <div class="col-span-3">費率 :</div>
                  <div class="col-span-12 text-gray-500 text-md text-YuPearlExtraLight">
                    {{ park.FareDescription }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import alert, { errorAlert } from '@/plugins/sweetalert2';

export default {
  name: 'HomeView',
  setup() {
    const store = useStore();
    const token = ref('');
    const selectCity = ref('Taipei');
    const cityList = reactive({ arr: [] });
    const parkingList = reactive({ arr: [] });
    const loading = ref(false);
    const selectId = ref('');

    const more = (id) => {
      if (selectId.value === id) {
        selectId.value = '';
      } else {
        selectId.value = id;
      }
    };

    function getLocation(info) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const parkName = info.CarParkName.Zh_tw;
          const aLat = position.coords.latitude;
          const aLon = position.coords.longitude;
          const bLat = info.CarParkPosition.PositionLat;
          const bLon = info.CarParkPosition.PositionLon;
          window.open(
            `https://www.google.com/maps/dir/${aLat},${aLon}/${parkName}/@${bLat},${bLon},17z`,
          );
        },
        (error) => {
          alert('warning', error.message);
        },
      );
    }

    function mergeCarParks(carParks, parkingAvailabilities) {
      const carParkInfo = carParks
        .filter((item) => parkingAvailabilities.some((item2) => item.CarParkID === item2.CarParkID))
        .map((item) => ({
          CarParkID: item.CarParkID,
          CarParkName: {
            Zh_tw: item.CarParkName.Zh_tw,
          },
          Address: item.Address,
          Description: item.Description,
          FareDescription: item.FareDescription,
          TotalSpaces: parkingAvailabilities.find(
            (item2) => item.id === item2.id,
          ).TotalSpaces,
          AvailableSpaces: parkingAvailabilities.find(
            (item2) => item.id === item2.id,
          ).AvailableSpaces,
          CarParkPosition: {
            PositionLat: item.CarParkPosition.PositionLat,
            PositionLon: item.CarParkPosition.PositionLon,
          },
        }));
      parkingList.arr = carParkInfo;
    }

    const getRemainingParkingSpace = async () => {
      try {
        const { data } = await axios.get(
          `https://tdx.transportdata.tw/api/basic/v1/Parking/OffStreet/ParkingAvailability/City/${selectCity.value}`,
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          },
        );
        if (data.ParkingAvailabilities.length !== 0) {
          mergeCarParks(parkingList.arr, data.ParkingAvailabilities);
        } else if (data.ParkingAvailabilities.length === 0) {
          alert('warning', '此縣市未提供剩餘車位資料');
        } else {
          errorAlert();
        }
      } catch (err) {
        errorAlert(err.response);
      }
    };

    const getParkingList = async () => {
      try {
        loading.value = true;
        const { data } = await axios.get(
          `https://tdx.transportdata.tw/api/basic/v1/Parking/OffStreet/CarPark/City/${selectCity.value}`,
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          },
        );
        if (data.CarParks.length !== 0) {
          parkingList.arr = data.CarParks;
          getRemainingParkingSpace();
        } else if (data.CarParks.length === 0) {
          parkingList.arr = data.CarParks;
          alert('warning', '查無停車場資料');
        } else {
          errorAlert();
        }
      } catch (err) {
        errorAlert(err.response);
      } finally {
        loading.value = false;
      }
    };

    const getCity = async () => {
      try {
        const { data } = await axios.get(
          'https://tdx.transportdata.tw/api/basic/v2/Basic/City',
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          },
        );
        cityList.arr = await data;
        getParkingList();
      } catch (err) {
        errorAlert(err.response);
      }
    };

    const getCookieValue = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');

      const filteredValues = cookies
        .filter((item) => item.startsWith('pk='))
        .map((item) => item.replace('pk=', ''));
      const [firstValue] = filteredValues;

      if (firstValue) {
        token.value = firstValue;
        getCity();
      } else {
        errorAlert();
      }
    };

    onMounted(() => {
      getCookieValue();
    });

    const showPosition = (coordinate) => {
      store.commit('setParkPosition', {
        lat: coordinate.PositionLat,
        lng: coordinate.PositionLon,
      });
    };

    return {
      cityList,
      selectCity,
      parkingList,
      showPosition,
      getParkingList,
      loading,
      getLocation,
      more,
      selectId,
    };
  },
};
</script>
