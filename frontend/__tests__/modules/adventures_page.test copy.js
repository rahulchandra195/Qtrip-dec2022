import {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM
} from "../../modules/adventures_page.js";

require("jest-fetch-mock").enableMocks();

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../../pages/adventures/index.html"),
  "utf8"
);
const mockAdventuresData = require("../fixtures/adventures.json");

jest.dontMock("fs");

Storage.prototype.getItem = jest.fn(() => expectedPayload);

describe("Adventure Page Tests", function () {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    fetch.resetMocks();
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  it("getCityFromURL() - Extracts city from query parameter and return it", async () => {
    const city = await getCityFromURL("?city=london");
    expect(city).toEqual("london");
  });

  it("fetchAdventures() - Makes a fetch call for /adventures API endpoint and returns an array with the adventures data", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockAdventuresData));

    const data = await fetchAdventures("bengaluru");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/adventures"));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?city=bengaluru")
    );

    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(mockAdventuresData);
  });

  it("fetchAdventures() - Catches errors and returns null, if fetch call fails", async () => {
    fetch.mockReject(new Error(null));

    const data = fetchAdventures("bengaluru");

    await expect(data).resolves.toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/adventures"));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?city=bengaluru")
    );
  });

  it("addAdventureToDOM() - Adds a new Adventure with id value set to <a> tag", function () {
    addAdventureToDOM([
      {
        category: "park",
        costPerHead: 20,
        currency: "INR",
        duration: 4,
        image: "",
        name: "park",
        id: "park",
      },
    ]);
    expect(document.getElementById("park")).toBeTruthy();
  });

  it("addAdventureToDOM() - <a> tag links the adventure card correctly to the corresponding Adventure details page", function () {
    addAdventureToDOM([
      {
        category: "park",
        costPerHead: 20,
        currency: "INR",
        duration: 4,
        image: "",
        name: "park",
        id: "123456",
      },
    ]);
    expect(document.getElementById("123456").href).toEqual(
      expect.stringContaining("/detail")
    );
    expect(document.getElementById("123456").href).toEqual(
      expect.stringContaining("?adventure=123456")
    );
  });

});