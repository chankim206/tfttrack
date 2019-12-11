const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/:region/:summoner", async (req, res) => {
  try {
    const headers = {
      "X-Riot-Token": process.env.RIOT_API_KEY
    };
    const response = await fetch(
      `https://${req.params.region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${req.params.summoner}`,
      {
        headers
      }
    );

    const data = await response.json();
    if (data.status && data.status.status_code === 404) {
      return res.status(404).json({
        message: "Summoner Not Found"
      });
    }
    const id = data.id;
    const puuid = data.puuid;

    //stats for the summoner
    const second = await fetch(
      `https://${req.params.region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}`,
      {
        headers
      }
    );
    const stats = await second.json();

    //configure each region
    const america = "https://americas.api.riotgames.com/tft/match/v1/matches";
    const europe = "https://europe.api.riotgames.com/tft/match/v1/matches";
    const asia = "https://asia.api.riotgames.com/tft/match/v1/matches";
    let riotRegional;

    switch (req.params.region) {
      case "na1":
        riotRegional = america;
        break;
      case "euw1":
        riotRegional = europe;
        break;
      case "eun1":
        riotRegional = europe;
        break;
      case "la1":
        riotRegional = america;
        break;
      case "la2":
        riotRegional = america;
        break;
      case "br1":
        riotRegional = america;
        break;
      case "jp1":
        riotRegional = asia;
        break;
      case "ru":
        riotRegional = europe;
        break;
      case "tr1":
        riotRegional = europe;
        break;
      case "oc1":
        riotRegional = america;
        break;
      case "kr":
        riotRegional = asia;
        break;
    }

    //match list
    const third = await fetch(
      `${riotRegional}/by-puuid/${puuid}/ids?count=20`,
      {
        headers
      }
    );
    const matches = await third.json();

    //last match played
    const fourth = await fetch(`${riotRegional}/${matches[0]}`, {
      headers
    });
    const lastMatch = await fourth.json();
    const combined = Object.assign(
      {},
      { meta: data, stats: stats[0], matches, lastMatch }
    );
    res.json(combined);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
});

module.exports = router;
