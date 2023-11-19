import { BarChart, Bar, XAxis, YAxis, Cell} from 'recharts';

function generateMessage(densityPercentage: number) {
    var message = "";
    const currentHour = new Date().getHours();
   
    switch (true) {
        case densityPercentage < 25:
            message = "It's not very busy";
            break;
        case densityPercentage < 50:
            message = "It's a little busy";
            break;
        case densityPercentage < 75:
            message = "It's getting busy";
            break;
        case densityPercentage < 100:
            message = "It's busy";
            break;
        case densityPercentage < 125:
            message = "It's busier than usual";
            break;
        case densityPercentage < 150:
            message = "It's very busy";
            break;
        case densityPercentage > 150:
            message = "It's a lot busier than usual";
            break;
    }

    if (currentHour < 6) {
        message += " this early morning";
    } else if (currentHour < 12) {
        message += " this morning";
    } else if (currentHour < 18) {
        message += " this afternoon";
    } else if (currentHour < 24) {
        message += " this evening";
    }

    return message;
};

//random array of data for testing
function getData() {
    const data = Array.from({length: 24}, (_, i) => {
        const hour = i;
        var hour12 = (i % 12 || 12) + (i < 12 ? 'am' : 'pm');
        var density = Math.floor(Math.random() * 100);
        var currentDensity = 0;
        if (hour <= new Date().getHours()) {
            currentDensity = Math.floor(Math.random() * 100);
        }
        return { hour, hour12, density, currentDensity};
    });
    return data;
}

export default function LocationGraphLocationGraph({locationName}: {locationName: string}) {

    const data = getData();
    const currentHour = new Date().getHours();
    
    var densityPercentage = 0;
    if (data[currentHour]?.currentDensity !== undefined && data[currentHour]?.density !== undefined && data[currentHour]?.density !== 0) {
        densityPercentage = Math.floor((data[currentHour]?.currentDensity / data[currentHour]?.density) * 100);
    }
    const message = generateMessage(densityPercentage);

    return (
        <div>
            <div className='mb-4'>
                <h1 className="text-2xl font-bold">{locationName}</h1>
                <div className="flex flex-row items-center gap-2 my-1">
                    <p className="text-sm bg-[#d63852] w-fit px-1 my-1 rounded-sm font-semibold">LIVE</p>
                    <p className="text-sm italic text-gray-400">{message}</p>
                </div>  
            </div>
            <BarChart
                width={500}
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
                            opacity={entry.hour === currentHour ? 0.1 : 1}
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
                            className={entry.hour === currentHour ? "animate-pulse" : ""}
                        />
                        ))
                    }
                </Bar>
            </BarChart>
        </div>
    )
}