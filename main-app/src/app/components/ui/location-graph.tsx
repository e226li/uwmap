import { useEffect, useMemo, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { BarChart, Bar, XAxis, Cell} from 'recharts';
import { GET } from "../../api/route";
import { density_messages, heatmap_colors, time_messages } from '~/app/config/site';
import { AverageDensityData, AverageDensityTransposed } from '~/app/types/data';

function generateMessage(densityPercentage: number) {
    let message = "";
    const currentHour = new Date().getHours();

    if (densityPercentage > 90000 || Number.isNaN(densityPercentage)) {
        message = "We are having trouble getting the data for this location";
    }

    for (const [key, value] of Object.entries(density_messages)) {
        if (densityPercentage < parseInt(key)) {
            message = value;
            break;
        }
    }

    if (message === "") {
        message = "It's really busier than usual";
    } 

    for (const [key, value] of Object.entries(time_messages)) {
        if (currentHour < parseInt(key)) {
            message += " " + value;
            break;
        }
    }

    return message;
};

export default function LocationGraphLocationGraph({id, locationName, currentDensity}: {id: number, locationName: string, currentDensity: number}) {
    const [data, setData] = useState<AverageDensityData[]>([]);    
    const [colorIntensity, setColorIntensity] = useState<number>(Math.floor(currentDensity / 15)); 
    const [message, setMessage] = useState<string>("Loading...");
    const [loading, setLoading] = useState<boolean>(true);
    
    const barWidth = 400;
    const graphHeight = (window.innerHeight / 5);
    const currentHour = useMemo(() => {
        return new Date().getHours();
    }, []);

    useEffect(() => {
        setLoading(true);
        async function getData() {
            const response = await fetch('https://api.uwmap.live/get-average-density-transposed/?fast=true');
            const resJson: AverageDensityTransposed = await response.json();
            
            const data: AverageDensityData[] = [];
            for (let i = 0; i < 24; i++) {

                let density = 0;
                if (resJson.density[id]) {
                    density = resJson.density[id]![i] ?? 0;
                }

                data[i] = {
                    hour: i,
                    hour12: (i % 12 || 12) + (i < 12 ? 'am' : 'pm'),
                    density: density,
                    currentDensity: 0
                }
            }
        setData(data);
        setLoading(false);
        }
        getData()
            .catch(err => {console.log(err)});
    }, [id])

    useEffect(() => {
        if (data[currentHour] !== undefined && currentHour !== undefined) {
            data[currentHour]!.currentDensity = currentDensity;
            setData(data);

            const currentHourData = data[currentHour];
            if (currentHourData !== undefined) {
                setMessage(generateMessage(Math.floor((currentDensity / currentHourData.density) * 100)));
                const intensity = (Math.floor(currentDensity / (currentHourData.density / 2)));
                setColorIntensity(Math.max(1, Math.min(intensity, 5)));
            }
        }
    }, [currentDensity, data])

    return (
        <div data-device-number={id.toString()} className="self-center cursor-default">
            <div className="mb-4">
                <div className="flex flex-row">
                    <h1 className="text-2xl font-bold flex-1">{locationName}</h1>
                    <div className="text-[10px] justify-start text-neutral-500 opacity-75"></div>
                </div>
                <div className="flex flex-row items-center gap-2 my-1">
                    {currentDensity ? (
                        <p className="text-sm bg-gradient-to-br from-[#d63852] to-red-800 w-fit px-1 my-1 rounded-sm font-semibold">LIVE</p>
                    ) : (
                        <p className="text-sm bg-gradient-to-br from-gray-600 to-gray-800 w-fit px-1 my-1 rounded-sm font-semibold">ERR</p>
                    )}
                    {!loading ? (
                        <p className="text-sm italic text-gray-400">{message}</p>
                    ) : (
                        <p className="text-sm text-gray-400">Fetching latest data...</p>
                    )}
                </div>
            </div>
            {!loading ? (
                <BarChart
                    style={{margin: "auto"}}
                    width={barWidth}
                    height={graphHeight}
                    data={data}
                    barGap={-30}
                    barCategoryGap={1}
                    margin={{
                        top: 0,
                        right: 20,
                        left: 20,
                        bottom: 0,
                    }}>
                    <XAxis
                        dataKey="hour12"
                        padding="no-gap"
                        interval={2}
                        tickMargin={3}
                        scale="band"
                        tickLine={true}
                        axisLine={true}
                        xAxisId={1}
                    />
                    <XAxis xAxisId={2} hide={true} />
                    <Bar
                        dataKey="density"
                        stackId="a"
                        xAxisId={1}
                        fill="#58a9db"
                        radius={[5, 5, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                opacity={entry.hour === currentHour ? 0.2 : 1}
                                fill={
                                    entry.hour === currentHour ? "#fff" : "#58a9db"
                                }
                            />
                        ))}
                    </Bar>
                    <Bar
                        dataKey="currentDensity"
                        xAxisId={2}
                        fill={`${heatmap_colors[colorIntensity - 1]}`}
                        radius={[5, 5, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                opacity={entry.hour === currentHour ? 1 : 0}
                                className={
                                    entry.hour === currentHour
                                        ? "animate-pulse"
                                        : ""
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            ) : (
                <PuffLoader color="#58a9db" speedMultiplier={2} className='mx-auto my-8'/>
            )}
        </div>
    );
}