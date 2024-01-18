export type LocationType = {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
};

export type AverageDensityData = {
    hour: number,
    hour12: string,
    density: number,
    currentDensity: number
}

export type AverageDensityTransposed = {
    density: {
        [id: string]: {
            [id: string]: number
        }
    },
    current_hour: number
}

export type LatestDensityData = {
    density: {
      [id: string]: number
    },
    current_hour: number
}
  
export type AverageDensityDataTable = {
    density: {
      [id: string]: {
        [id: string]: number
      }
    },
    current_hour: number
}