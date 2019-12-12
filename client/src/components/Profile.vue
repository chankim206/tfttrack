<template>
  <section>
    <div v-if="loading">
      <h3>
        Loading...
        <i class="fa fa-spinner fa-spin"></i>
      </h3>
    </div>

    <div v-if="error">
      <h1>{{ error }}</h1>
      <router-link to="/">Go Back</router-link>
    </div>

    <div v-if="profileData" class="container">
      <h1 class="summoner">
        <img
          :src="
            'http://ddragon.leagueoflegends.com/cdn/9.24.1/img/profileicon/' +
              profileData.meta.profileIconId +
              '.png'
          "
          alt="Player Icon"
          class="summoner-icon"
        />
        {{ profileData.meta.name }}
        <div class="fireplace">
          <i v-if="profileData.stats && profileData.stats.hotStreak" class="fas fa-fire-alt on"></i>
          <i v-else class="fas fa-fire-alt off"></i>
          <p v-if="profileData.stats && profileData.stats.hotStreak" class="fire">On Fire</p>
          <p v-else class="fire">Off Fire</p>
        </div>
      </h1>
      <div class="grid">
        <div v-if="profileData.stats" class="rankicon">
          <img
            :src="getImgUrl(profileData.stats)"
            :alt="profileData.stats.tier + roman(profileData.stats.rank)"
          />
        </div>
        <div v-else class="rankicon">
          <img :src="getImgUrl(profileData.stats)" :alt="'Unranked'" />
        </div>
        <div>
          <ul>
            <li v-if="profileData.stats">
              <h4>Current Rank</h4>
              <p>{{getRank(profileData.stats.tier, profileData.stats.rank)}} {{profileData.stats.leaguePoints}}LP</p>
              <div class="border">
                <div
                  class="progress"
                  v-bind:style="{width: getWidth(profileData.stats.tier, profileData.stats.leaguePoints) + '%'}"
                ></div>
              </div>
            </li>
            <li v-else>
              <h4>Current Rank</h4>
              <p>Unranked</p>
              <div class="border">
                <div class="progress"></div>
              </div>
            </li>
            <li v-if="profileData.stats">
              <div class="mini-grid">
                <div>
                  <h4>Total</h4>
                  <p>{{profileData.stats.wins + profileData.stats.losses}}</p>
                </div>
                <div>
                  <h4>Wins</h4>
                  <p>{{profileData.stats.wins}}</p>
                </div>
                <div>
                  <h4>Losses</h4>
                  <p>{{profileData.stats.losses}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <router-link to="/">Back</router-link>
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
      if (this.profileData.stats) {
        this.current = this.profileData.stats.leaguePoints + "%";
      }
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
    },
    getRank(tier, rank) {
      const GM = "GrandMaster";
      const M = "Master";
      const C = "Challenger";

      tier = tier.charAt(0) + tier.slice(1).toLowerCase();

      if (tier === GM || tier === M || tier === C) {
        return tier;
      } else {
        return tier + " " + this.roman(rank);
      }
    },
    getWidth(tier, lp) {
      const GM = "GrandMaster";
      const M = "Master";
      const C = "Challenger";
      tier = tier.charAt(0) + tier.slice(1).toLowerCase();
      if (tier === GM || tier === M || tier === C) {
        return 100;
      } else {
        return lp;
      }
    }
  }
};
</script>

<style scoped>
.container {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  max-width: 700px;
  margin: 1rem auto;
  padding: 2rem 1.5rem;
  border-radius: 20px;
  overflow: hidden;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}

.fireplace {
  display: block;
  margin-left: 0.5rem;
}

.fa-fire-alt {
  display: block;
}

.fire {
  font-size: 0.5rem;
}

.on {
  color: #f62817;
}

.off {
  color: #ccc;
}

.border {
  border: 1px solid #fff;
  border-radius: 3px;
}

.progress {
  background-color: #fff;
  height: 0.5rem;
  width: 0%;
}

h1.summoner {
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.3rem 0.5rem;
  text-align: center;
  border-radius: 20px;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.summoner-icon {
  width: 40px;
  margin-right: 0.7rem;
}

a {
  display: inline-block;
  margin-top: 2rem;
  border: #fff 2px solid;
  padding: 0.5rem 0.8rem;
}
a:hover {
  border: #ccc 2px solid;
  color: #ccc;
}

img {
  width: 90%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}

li {
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  margin-bottom: 0.7rem;
  border-radius: 10px;
}
li p {
  font-size: 2rem;
}
li:first-child p {
  font-size: 1.25rem;
}
li span {
  font-size: 1rem;
  color: #ccc;
}

@media (max-width: 500px) {
  .rankicon {
    display: flex;
    justify-content: center;
  }
  img {
    width: 70%;
  }
  h1 {
    font-size: 1.5rem;
    display: block;
    text-align: center;
    justify-content: center;
  }
  .summoner-icon {
    display: none;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  li p {
    font-size: 1.5rem;
  }
}
</style>
