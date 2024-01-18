/* Site metadata info */

export const siteConfig = {
    name: "UW Map",
    description: "UW Map is a webapp that allows students to find their way around the University of Waterloo campus while avoiding all the traffic.",
    pages: [
        { name: "Map", link: "/" },
        { name: "About", link: "/about" },
        { name: "Code", link: "https://github.com/e226li/uwmap" },
    ]
}

/* Map locations */

export const map_locations = [
    {
        "id": 0,
        "location": "RCH",
        "latitude": 43.47034992121662, 
        "longitude":-80.54058548708272
    },
    {
        "id": 1,
        "location": "E5",
        "latitude": 43.47267889674192, 
        "longitude":-80.53989477574922 
    },
    {
        "id": 3,
        "location": "DC SE Lab",
        "latitude": 43.47246767651742, 
        "longitude":-80.54210960828448
    },
    {
        "id": 4,
        "location": "EIT",
        "latitude": 43.471613120051295,
        "longitude": -80.54200426059484
    },
    {
        "id": 5,
        "location": "DP Library",
        "latitude": 43.46979084374338,
        "longitude": -80.54225618754515
    },
    {
        "id": 7,
        "location": "MC",
        "latitude": 43.47214941468885,
        "longitude":-80.54394884115378
    },
]

/* Goes from colder to warmer colors. Scheme: Light Blue -> Purple -> Pink */

export const heatmap_colors = [
    "#45A9FDff",
    "#6F85FEff",
    "#816FFEff",
    "#AE52B9ff",
    "#E03057ff",
];

/* Messages for density and time */

export const density_messages = {
    40: "It's not busy",
    80: "It's as usual",
    120: "It's getting busy",
    150: "It's busier than usual",
    175: "It's much busier than usual",
    250: "It's extremely busy"
};
  
export const time_messages = {
    6: "this early morning",
    12: "this morning",
    18: "this afternoon",
    24: "this evening"
};