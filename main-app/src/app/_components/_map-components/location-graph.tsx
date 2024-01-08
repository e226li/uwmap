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

interface AverageDensityTransposed {
    "density": {
        [id: string]: {
            [id: string]: number
        }
    },
    "current_hour": number
}

function cyrb128(str : string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    const str1 = (h1 >>> 0).toString(4).slice(0, 1) + (h2 >>> 0).toString(4).slice(0, 1) + (h3 >>> 0).toString(4).slice(0, 1) + (h4 >>> 0).toString(4).slice(0, 1);
    return str1;
}

function generateMessage(densityPercentage: number) {
    let message = "";
    const currentHour = date.getHours();

    if (densityPercentage > 90000 || Number.isNaN(densityPercentage)) {
        message = "We are having trouble getting the data for this location";
    }

    const densityMessages = {
        60: "It's not very busy",
        85: "It's getting busy",
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
    const [message, setMessage] = useState<string>("Loading...");
    const [loading, setLoading] = useState<boolean>(true);
    const [barWidth, setBarWidth] = useState<number>(400);
    const [graphHeight, setGraphHeight] = useState<number>(window.innerHeight / 5);

    // fetch the average density data for past 24 hr of this device, updating everytime a differnet popup is opened
    useEffect(() => {
        setLoading(true);
        async function getData() {
            const res = await fetch('https://api.uwmap.live/get-average-density-transposed/', {headers: {'x-api-key': apiKey}})
            const resJson: AverageDensityTransposed = await res.json();
            
            const data: AverageDensityData[] = [];
            for (let i = 0; i < 24; i++) {
                // account for null data
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

    // update pink bar live in graph via data that mapviewer fetches periodically
    useEffect(() => {
        setCurrentHour(date.getHours());
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

    // render for different window sizes
    useEffect(() => {
        if (screen.width < 768) {
            setData(data.filter((entry) => entry.hour < (currentHour + 12)));
            if (currentHour > 12) {
                setData(data.filter((entry) => entry.hour > (currentHour - 12 + (23 - currentHour))));
            } else {
                setData(data.filter((entry) => entry.hour >= (currentHour)));
            }
            setBarWidth(300); 
        }
    }, [])

    return (
        <div className='self-center'>
            <div className='mb-4'>
                <div className='flex flex-row'>
                    <h1 className="text-2xl font-bold flex-1">{locationName}</h1>
                    <div className='text-[10px] justify-start text-neutral-500 opacity-75'>#{cyrb128("uwmap" + id.toString())}{id}</div>
                </div>
                <div className="flex flex-row items-center gap-2 my-1">
                    {   currentDensity ?
                        <p className="text-sm bg-gradient-to-br from-[#d63852] to-red-800 w-fit px-1 my-1 rounded-sm font-semibold">LIVE</p>
                            :
                        <p className="text-sm bg-gradient-to-br from-gray-600 to-gray-800 w-fit px-1 my-1 rounded-sm font-semibold">ERR</p>
                    }
                    <p className="text-sm italic text-gray-400">{message}</p>
                </div>  
            </div>
            {!loading ?
                <BarChart
                style={{margin: 'auto'}}
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