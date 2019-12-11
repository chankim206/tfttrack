<template>
  <section>
    <div v-if="loading">
      <h3>Loading... <i class="fa fa-spinner fa-spin"></i></h3>
    </div>

    <div v-if="error">
      <h1>{{ error }}</h1>
      <router-link to="/">Go Back</router-link>
    </div>

    <div v-if="profileData" class="container">
      <h1 class="gamertag">
        <img
          :src="
            'http://ddragon.leagueoflegends.com/cdn/9.24.1/img/profileicon/' +
              profileData.meta.profileIconId +
              '.png'
          "
          alt="Player Icon"
          class="platform-avatar"
        />
        {{ profileData.meta.name }}
      </h1>
      <div class="grid">
        <div v-if="profileData.stats">
          <img
            :src="getImgUrl(profileData.stats)"
            :alt="profileData.stats.tier + roman(profileData.stats.rank)"
          />
        </div>
        <div v-else>
          <img :src="getImgUrl(profileData.stats)" :alt="'Unranked'" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      loading: false,
      error: null,
      profileData: null
    };
  },
  beforeCreate() {
    document.body.className = "body-bg-no-image";
  },
  async created() {
    this.loading = true;
    try {
      const response = await axios.get(
        `/api/v1/profile/${this.$route.params.region}/${this.$route.params.summoner}`
      );

      this.profileData = response.data;
      this.loading = false;
    } catch (err) {
      this.loading = false;
      this.error = err.response.data.message;
    }
  },
  methods: {
    getImgUrl(stats) {
      let images = require.context("../assets/tiers/", false, /\.png$/);
      if (stats) {
        return images(
          "./" +
            stats.tier.toLowerCase() +
            "_" +
            stats.rank.toLowerCase() +
            ".png"
        );
      } else {
        return images("./provisional.png");
      }
    },
    roman(str) {
      const converter = { I: 1, II: 2, III: 3, IV: 4 };
      return " " + converter[str];
    }
  }
};
</script>

<style></style>
