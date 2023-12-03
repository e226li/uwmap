import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { BarChart, Bar, XAxis, YAxis, Cell} from 'recharts';

const date = new Date();

const densityColors = [
    "#45A9FDff",
    "#6F85FEff",
    "#816FFEff",
    "#AE52B9ff",
    "#E03057ff",
]

type AverageDensityData = {
    hour: number,
    hour12: string,
    density: number,
    currentDensity: number
}

function generateMessage(densityPercentage: number) {
    let message = "";
    const currentHour = date.getHours();

    const densityMessages = {
        25: "It's not very busy",
        50: "It's a little busy",
        75: "It's getting busy",
        100: "It's busy",
        125: "It's busier than usual",
        150: "It's much busier than usual",
        175: "It's a lot busier than usual"
    }

    const timeMessages = {
        6: "this early morning",
        12: "this morning",
        18: "this afternoon",
        24: "this evening"
    }

    for (const [key, value] of Object.entries(densityMessages)) {
        if (densityPercentage < parseInt(key)) {
            message = value;
            break;
        }
    }

    if (message === "") {
        message = "It's really busier than usual";
    }

    for (const [key, value] of Object.entries(timeMessages)) {
        if (currentHour < parseInt(key)) {
            message += " " + value;
            break;
        }
    }

    return message;
};

export default function LocationGraphLocationGraph({id, locationName, apiKey, currentDensity}: {id: number, locationName: string, apiKey: string, currentDensity: number}) {
    const [data, setData] = useState<AverageDensityData[]>([]);    
    const [currentHour, setCurrentHour] = useState<number>(new Date().getHours()); 
    const [colorIntensity, setColorIntensity] = useState<number>(Math.floor(currentDensity / 15)); 
    const [message, setMessage] = useState<string>("It's not very busy");
    const [loading, setLoading] = useState<boolean>(true);

    // fetch the average density data for past 24 hr of this device, updating everytime a differnet popup is opened
    useEffect(() => {
        setLoading(true);
        async function getData() {
            const res = await fetch('https://api.uwmap.live/get-average-density-transposed/', {headers: {'x-api-key': apiKey}})
            const resJson = await res.json();
            let data: AverageDensityData[] = [];
            for (let i = 0; i < 24; i++) {
                data[i] = {
                    hour: i,
                    hour12: (i % 12 || 12) + (i < 12 ? 'am' : 'pm'),
                    density: resJson.density[id][i] ?? 0,
                    currentDensity: 0
                }
            }
        setData(data);
        setLoading(false);
        }
        getData();
    }, [id])

    // update pink bar live in graph via data that mapviewer fetches periodically
    useEffect(() => {
        setCurrentHour(date.getHours());
        if (data[currentHour] !== undefined && currentHour !== undefined) {
            data[currentHour].currentDensity = currentDensity;
            setData(data);

            const currentHourData = data[currentHour];
            if (currentHourData !== undefined) {
                setMessage(generateMessage(Math.floor((currentDensity / currentHourData.density) * 100)));
                const intensity = (Math.floor(currentDensity / (currentHourData.density / 2)));
                setColorIntensity(Math.max(1, Math.min(intensity, 5)));
            }
        }
    }, [currentDensity, data])

    let barWidth = 400;
    if (screen.width < 768) {
        setData(data.filter((entry) => entry.hour < (currentHour + 12)));
        if (currentHour > 12) {
            setData(data.filter((entry) => entry.hour > (currentHour - 12 + (23 - currentHour))));
        } else {
            setData(data.filter((entry) => entry.hour >= (currentHour)));
        }
        barWidth = 300; 
    }

    return (
        <div className='self-center'>
            <div className='mb-4'>
                <h1 className="text-2xl font-bold">{locationName}</h1>
                <div className="flex flex-row items-center gap-2 my-1">
                    <p className="text-sm bg-gradient-to-br from-[#d63852] to-red-800 w-fit px-1 my-1 rounded-sm font-semibold">LIVE</p>
                    <p className="text-sm italic text-gray-400">{message}</p>
                </div>  
            </div>
            {!loading ?
                <BarChart
                style={{margin: 'auto'}}
                width={barWidth}
                height={200}
                data={data}
                barGap={-30}
                barCategoryGap={1}
                margin={{
                    top: 0,
                    right: 20,
                    left: 20,
                    bottom: 0,
                }}
                >
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
                    <XAxis 
                        xAxisId={2}
                        hide={true}
                    />
                    <Bar 
                        dataKey="density" 
                        stackId="a" 
                        xAxisId={1}
                        fill="#58a9db"
                        radius={[5, 5, 0, 0]}
                    >
                        {
                        data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                opacity={entry.hour === currentHour ? 0.2 : 1}
                                fill={entry.hour === currentHour ? "#fff" : "#58a9db"}
                            />
                            ))
                        }
                    </Bar>
                    <Bar 
                        dataKey="currentDensity" 
                        xAxisId={2}
                        fill={`${densityColors[colorIntensity - 1]}`}
                        radius={[5, 5, 0, 0]}
                    >
                        {
                            data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    opacity={entry.hour === currentHour ? 1 : 0}
                                    className={entry.hour === currentHour ? "animate-pulse" : ""}
                                />
                            ))
                        }
                    </Bar>
                </BarChart> :  <BarLoader color="#58a9db"/>
            }
        </div>
    )
}