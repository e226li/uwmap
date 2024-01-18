import { heatmap_colors } from "~/app/config/site";

const minZoom = 14.232424440592853
const maxZoom =  22

export default function HeatmapPing({density, averageDensity, zoom} : {density: number, averageDensity: number, zoom: number}) {
    const opacity = (zoom - minZoom)/(maxZoom - minZoom) - 0.2;
    
    let colorIntensity = (Math.floor(density / (averageDensity / 2)))
    colorIntensity = Math.max(1, Math.min(colorIntensity, 5));

    let pingRadius = Math.log2(density + 1) * 50;
    const radiusMultiplier = ((1/(maxZoom - minZoom))*zoom) - (1/(maxZoom - minZoom)*minZoom);
    pingRadius = pingRadius * radiusMultiplier;
    
    return (
        <div 
            style={{
                width: pingRadius,
                height: pingRadius,
                opacity: opacity,
                position: "absolute",
                top: -pingRadius/2,
                left: -pingRadius/2,
                background: `radial-gradient(circle, ${heatmap_colors[colorIntensity - 1]} 20%, transparent)`,
            }} 
            className={`rounded-full ${(colorIntensity == 1) ? "animate-slow-ping" : "animate-medium-ping"}`}
        />
    )
}