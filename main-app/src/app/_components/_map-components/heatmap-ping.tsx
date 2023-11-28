const minZoom = 14.232424440592853
const maxZoom =  22

const densityColors = [
    "#45A9FDff",
    "#6F85FEff",
    "#816FFEff",
    "#AE52B9ff",
    "#E03057ff",
]

export default function HeatmapPing({density, zoom} : {density: number, zoom: number}) {

    const opacity = (zoom - minZoom)/(maxZoom - minZoom) - 0.2;
    
    let colorIntensity = Math.floor(density / 15);
    colorIntensity = Math.max(1, Math.min(colorIntensity, 5));

    let pingRadius = Math.log2(density) * 50;
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
                background: `radial-gradient(circle, ${densityColors[colorIntensity - 1]} 20%, transparent)`,
            }} 
            className={`rounded-full z-[-100] ${(colorIntensity == 1) ? "animate-slow-ping" : "animate-medium-ping"}`}
        />
    )
}