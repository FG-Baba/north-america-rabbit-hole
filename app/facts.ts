export const REPORT_AS_OF = "July 16, 2026";

export const SOURCES = {
  tapestry: {
    label: "USGS · A Tapestry of Time and Terrain",
    url: "https://pubs.usgs.gov/imap/i2781/",
  },
  pangaea: {
    label: "USGS · What was Pangaea?",
    url: "https://www.usgs.gov/faqs/what-was-pangea",
  },
  appalachians: {
    label: "USGS · The making of the Appalachian Mountains",
    url: "https://www.usgs.gov/geology-and-ecology-of-national-parks/geology-great-smoky-mountains-national-park",
  },
  divide: {
    label: "National Park Service · The Continental and Triple Divide",
    url: "https://www.nps.gov/glac/learn/education/continental_divide.htm",
  },
  changingContinent: {
    label: "USGS · Our changing continent",
    url: "https://pubs.usgs.gov/gip/continents/",
  },
  indigenousNations: {
    label: "Smithsonian NMAI · Essential understandings about Native peoples",
    url: "https://americanindian.si.edu/nk360/about/essential-understandings",
  },
  traders: {
    label: "National Park Service · Indigenous traders and travelers",
    url: "https://www.nps.gov/subjects/archeology/traders-and-travelers.htm",
  },
  nightLights: {
    label: "NASA · Night lights across the Americas",
    url: "https://science.nasa.gov/image-detail/amf-gsfc_20171208_archive_e001587/",
  },
  usDensity: {
    label: "U.S. Census Bureau · 2020 population density",
    url: "https://www.census.gov/data/tables/time-series/dec/population-density/2020.html",
  },
  canadaDensity: {
    label: "Statistics Canada · 2021 population maps",
    url: "https://www12.statcan.gc.ca/census-recensement/2021/geo/maps-cartes/thematicmaps-cartesthematiques/index2021-eng.cfm",
  },
  usMilestones: {
    label: "U.S. Office of the Historian · Diplomatic milestones",
    url: "https://history.state.gov/milestones/all",
  },
  canadaBoundaries: {
    label: "Government of Canada · Historical boundaries",
    url: "https://www.canada.ca/en/canadian-heritage/services/historical-boundaries-canada.html",
  },
  canadaTreaties: {
    label: "Government of Canada · Historic treaties dataset",
    url: "https://open.canada.ca/data/en/dataset/f281b150-0645-48e4-9c30-01f55f93f78e",
  },
  indigenousFire: {
    label: "National Park Service · Indigenous fire practices shape land",
    url: "https://www.nps.gov/subjects/fire/indigenous-fire-practices-shape-our-land.htm",
  },
} as const;

export type SourceKey = keyof typeof SOURCES;

export const BORDER_MOMENTS = [
  {
    year: "1803",
    title: "Louisiana",
    text: "The United States bought France’s imperial claim—across existing Indigenous homelands.",
  },
  {
    year: "1848",
    title: "Mexican Cession",
    text: "War and treaty moved a huge western claim to the United States.",
  },
  {
    year: "1867",
    title: "Confederation",
    text: "Canada began with four provinces, not its familiar modern outline.",
  },
  {
    year: "1870",
    title: "Rupert’s Land",
    text: "A company sale and imperial transfer made Canada enormous on paper.",
  },
  {
    year: "1949",
    title: "Newfoundland",
    text: "The newest province completed nearly all of today’s Canadian outline.",
  },
] as const;

export const SOURCE_GROUPS: ReadonlyArray<{
  label: string;
  keys: readonly SourceKey[];
}> = [
  {
    label: "Rock + terrain",
    keys: ["tapestry", "pangaea", "appalachians"],
  },
  {
    label: "Water + fire",
    keys: ["divide", "changingContinent", "indigenousFire"],
  },
  {
    label: "People + movement",
    keys: ["indigenousNations", "traders", "nightLights", "usDensity", "canadaDensity"],
  },
  {
    label: "Borders + power",
    keys: ["usMilestones", "canadaBoundaries", "canadaTreaties"],
  },
];
