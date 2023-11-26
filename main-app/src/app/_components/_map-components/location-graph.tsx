import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell} from 'recharts';

function generateMessage(densityPercentage: number) {
    let message = "";
    const currentHour = new Date().getHours();

    const densityMessages = {
        25: "It's not very busy",
        50: "It's a little busy",
        75: "It's getting busy",
        100: "It's busy",
        125: "It's busier than usual",
        150: "It's very busy",
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

function getData() {
    const data = Array.from({length: 24}, (_, i) => {
        const hour = i;
        const hour12 = (i % 12 || 12) + (i < 12 ? 'am' : 'pm');
        const density = Math.floor(Math.random() * 100);
        let currentDensity = 0;
        if (hour <= new Date().getHours()) {
            currentDensity = Math.floor(Math.random() * 100);
        }
        return { hour, hour12, density, currentDensity};
    });
    return data;
}

export default function LocationGraphLocationGraph({locationName}: {locationName: string}) {

    const [data, setData] = useState(getData());
    const currentHour = new Date().getHours();
    let message = "It's not very busy";
    if (data !== undefined && currentHour !== undefined) {
        const dataPoint = data[currentHour];
        if (dataPoint !== undefined) {
            message = generateMessage(Math.floor((dataPoint.currentDensity / dataPoint.density) * 100)) ?? "It's not very busy";
        }
    }

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
                    fill="#d63852"
                    radius={[5, 5, 0, 0]}
                >
                    {
                    data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            opacity={entry.hour === currentHour ? 1 : 0}
                            className={entry.hour === currentHour ? "animate-pulse opacity-90" : ""}
                        />
                        ))
                    }
                </Bar>
            </BarChart>
        </div>
    )
}