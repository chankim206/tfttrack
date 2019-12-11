<template>
  <section class="search">
    <h1>Search Summoner Stats</h1>
    <form v-on:submit.prevent="onSubmit">
      <div class="form-group">
        <label for="region">Region</label>
        <select name="region" id="region" v-model="region">
          <option value="na1">North America</option>
          <option value="euw1">EU West</option>
          <option value="eun1">EU Nordic East</option>
          <option value="la1">Latin America North</option>
          <option value="la2">Latin America South</option>
          <option value="br1">Brazil</option>
          <option value="jp1">Japan</option>
          <option value="ru">Russia</option>
          <option value="tr1">Turkey</option>
          <option value="oc1">Oceania</option>
          <option value="kr">Korea</option>
        </select>
      </div>
      <div class="form-group">
        <label for="summoner">Summoner Name</label>
        <input
          type="text"
          name="text"
          id="summoner"
          v-model="summoner"
          placeholder="Summoner Name: DeliciousMilkGG"
        />
      </div>
      <div class="form-group">
        <input type="submit" value="Submit" class="btn" />
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      summoner: "",
      region: "na1"
    };
  },
  beforeCreate() {
    document.body.className = "body-bg-image";
  },
  methods: {
    onSubmit() {
      if (!this.summoner) {
        this.$toasted.show("Please type your summoner name", {
          duration: 3000,
          icon: "exclamation-circle"
        });
      } else {
        this.$router.push(`/profile/${this.region}/${this.summoner}`);
      }
    }
  }
};
</script>

<style></style>
