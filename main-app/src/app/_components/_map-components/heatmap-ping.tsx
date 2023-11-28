const minZoom = 14.232424440592853
const maxZoom =  22

export default function HeatmapPing({radius, zoom} : {radius: number, zoom: number}) {
    
    let pingRadius = radius;
    const radiusMultiplier = ((1/(maxZoom - minZoom))*zoom) - (1/(maxZoom - minZoom)*minZoom);
    pingRadius = pingRadius * radiusMultiplier;

    const opacity = (zoom - minZoom)/(maxZoom - minZoom) - 0.2;

    return (
        <div 
            style={{
                width: pingRadius,
                height: pingRadius,
                opacity: opacity,
                position: "absolute",
                top: -pingRadius/2,
                left: -pingRadius/2,
            }} 
            className="rounded-full z-[-100] circle-gradient animate-medium-ping"
        />
    )
}