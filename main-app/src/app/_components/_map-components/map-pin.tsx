const densityColors = [
    "#45A9FDff",
    "#6F85FEff",
    "#816FFEff",
    "#AE52B9ff",
    "#E03057ff",
]

export default function MapPin({density, averageDensity} : {density: number, averageDensity: number}) {

    let colorIntensity = (Math.floor(density / (averageDensity / 2)))
    colorIntensity = Math.max(1, Math.min(colorIntensity, 5));

    const pinStyle = {
        cursor: 'pointer',
        fill: `${densityColors[colorIntensity - 1]}`,
        stroke: 'none',
        opacity: 1,
    };

    return (
        <svg viewBox="0 0 24 24" height={20} style={pinStyle}>
            <path d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
    )
}