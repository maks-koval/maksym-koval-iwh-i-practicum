const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN || "";
const HUBSPOT_CARS_URL = "https://api.hubapi.com/crm/v3/objects/2-257265631";

const getHeaders = () => ({
  Authorization: "Bearer " + PRIVATE_APP_ACCESS,
  "Content-Type": "application/json"
});

app.get("/", async (req, res) => {
  try {
    const resp = await axios.get(HUBSPOT_CARS_URL + "?properties=name,brand,year", { headers: getHeaders() });
    res.render("homepage", { title: "Cars | HubSpot Practicum", records: resp.data.results || [] });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send("Error fetching cars");
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});

app.post("/update-cobj", async (req, res) => {
  try {
    const { name, brand, year } = req.body;
    await axios.post(HUBSPOT_CARS_URL, { properties: { name, brand, year } }, { headers: getHeaders() });
    res.redirect("/");
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send("Error creating car");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
