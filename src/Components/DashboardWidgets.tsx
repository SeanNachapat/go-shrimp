"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Weather Mock Data - Keeps mock as no free API without key is reliable/safe to add here
const mockWeather = {
    location: "Chachoengsao, TH",
    temp: 32,
    condition: "Sunny",
    humidity: 65,
    wind: 12,
    hourly: [
        { time: "Now", temp: 32, icon: "wb_sunny" },
        { time: "1PM", temp: 33, icon: "wb_sunny" },
        { time: "2PM", temp: 33, icon: "partly_cloudy_day" },
        { time: "3PM", temp: 31, icon: "cloud" },
        { time: "4PM", temp: 30, icon: "rainy" },
        { time: "5PM", temp: 29, icon: "thunderstorm" },
    ]
};

const mockShrimpPrices = [
    { size: "30 pcs/kg", price: 320, trend: "up" },
    { size: "40 pcs/kg", price: 280, trend: "steady" },
    { size: "50 pcs/kg", price: 240, trend: "down" },
    { size: "60 pcs/kg", price: 210, trend: "steady" },
    { size: "70 pcs/kg", price: 180, trend: "up" },
    { size: "80 pcs/kg", price: 160, trend: "steady" },
];

// Helper to fetch ponds (Simulated hook behavior)
function useMyPonds() {
     const { user } = useAuth();
     const [ponds, setPonds] = useState<any[]>([]);
     
     useEffect(() => {
         const fetchPonds = async () => {
             if (!user) return;
             try {
                // First get user's farm ID
                const farmRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/my-farm`, { credentials: "include" });
                if (farmRes.ok) {
                    const farmData = await farmRes.json();
                    const farmId = farmData.farm._id;
                    
                    // Then get all ponds and filter
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ponds`, { credentials: "include" });
                    if (res.ok) {
                        const allPonds = await res.json();
                        const myPonds = allPonds.filter((p: any) => p.farmId === farmId);
                        setPonds(myPonds);
                    }
                }
             } catch (err) {
                 console.error("Failed to fetch ponds for widget", err);
             }
         };
         fetchPonds();
     }, [user]);

     return ponds;
}

export function WeatherWidget() {
    const { t } = useLanguage();
    
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-3xl shadow-xl p-6 text-white group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            {/* Decorative Background Icon */}
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-12 group-hover:rotate-45">
                 <span className="material-symbols-outlined text-[150px]">wb_sunny</span>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border border-white/10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {mockWeather.location}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider opacity-80 border border-white/5">
                        Demo
                    </div>
                </div>

                <div className="mt-4 flex flex-col">
                     <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-6xl drop-shadow-lg">wb_sunny</span>
                        <div>
                            <div className="text-6xl font-black tracking-tighter drop-shadow-sm">
                                {mockWeather.temp}°
                            </div>
                            <div className="text-lg font-medium opacity-90 pl-1">
                                {mockWeather.condition}
                            </div>
                        </div>
                     </div>
                     
                     {/* Hourly Forecast */}
                     <div className="flex gap-4 overflow-x-auto pb-2 mt-6 no-scrollbar mask-gradient-right">
                        {mockWeather.hourly.map((h, i) => (
                            <div key={i} className="flex flex-col items-center min-w-[3rem] gap-1">
                                <span className="text-[10px] opacity-80">{h.time}</span>
                                <span className="material-symbols-outlined text-xl">{h.icon}</span>
                                <span className="text-sm font-bold">{h.temp}°</span>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-lg mb-0.5 opacity-80">water_drop</span>
                        <div className="font-bold text-sm">{mockWeather.humidity}%</div>
                        <div className="text-[9px] opacity-70 uppercase tracking-wider">Humidity</div>
                    </div>
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-2 flex flex-col items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-lg mb-0.5 opacity-80">air</span>
                        <div className="font-bold text-sm">{mockWeather.wind}</div>
                        <div className="text-[9px] opacity-70 uppercase tracking-wider">km/h</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function WaterQualityWidget() {
    const { t } = useLanguage();
    const ponds = useMyPonds();
    const [selectedPondId, setSelectedPondId] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ponds.length > 0 && !selectedPondId) {
            setSelectedPondId(ponds[0]._id);
        }
    }, [ponds]);

    useEffect(() => {
        const fetchLatestRecord = async () => {
             if (!selectedPondId) return;
             
             setLoading(true);
             try {
                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/records`, { credentials: "include" });
                 if (res.ok) {
                     const records = await res.json();
                     // Filter for selected pond and sort descending (API already sorts but client side verification)
                     const pondRecords = records.filter((r: any) => 
                        (typeof r.pondId === 'object' ? r.pondId._id : r.pondId) === selectedPondId
                     );
                     
                     if (pondRecords.length > 0) {
                         const latest = pondRecords[0];
                         setData({
                             do: latest.waterQuality?.dissolvedOxygenMgl ?? 0,
                             ph: latest.waterQuality?.phLevel ?? 0,
                             temp: latest.waterQuality?.temperatureCelsius ?? 0,
                             updated: new Date(latest.readingDatetime)
                         });
                     } else {
                         setData(null);
                     }
                 } else {
                    setData(null);
                 }
             } catch (error) {
                 console.error("Failed to fetch water quality", error);
                 setData(null);
             } finally {
                 setLoading(false);
             }
        };

        fetchLatestRecord();
    }, [selectedPondId]);
    
    const getStatusColor = (val: number, type: 'do' | 'ph' | 'temp') => {
        let isGood = false;
        if (type === 'do') isGood = val > 4;
        if (type === 'ph') isGood = val >= 7.5 && val <= 8.5;
        if (type === 'temp') isGood = val >= 28 && val <= 32;

        return isGood ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400';
    }

    const getProgressBarColor = (val: number, type: 'do' | 'ph' | 'temp') => {
        let isGood = false;
        if (type === 'do') isGood = val > 4;
        if (type === 'ph') isGood = val >= 7.5 && val <= 8.5;
        if (type === 'temp') isGood = val >= 28 && val <= 32;
        return isGood ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500';
    }

    return (
         <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700/50 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">water_drop</span>
                     </div>
                     <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white text-lg leading-tight">{t("waterQuality")}</h3>
                        {ponds.length > 0 ? (
                            <select 
                                className="text-xs text-neutral-500 dark:text-neutral-400 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-orange-500"
                                value={selectedPondId}
                                onChange={(e) => setSelectedPondId(e.target.value)}
                            >
                                {ponds.map(p => <option key={p._id} value={p._id}>{p.pondName}</option>)}
                            </select>
                        ) : (
                            <p className="text-xs text-neutral-500">No ponds found</p>
                        )}
                     </div>
                </div>
                 {data && (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-700/50 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {data.updated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                 )}
            </div>
            
            <div className="space-y-6 flex-1 flex flex-col justify-center">
                {loading ? (
                    <div className="flex justify-center items-center py-10 opacity-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : data ? (
                    [
                        { label: t("do"), val: data.do.toFixed(1), type: 'do', unit: 'mg/L', max: 10, ideal: '> 4.0' },
                        { label: t("ph"), val: data.ph.toFixed(1), type: 'ph', unit: 'pH', max: 14, ideal: '7.5 - 8.5' },
                        { label: t("temp"), val: data.temp.toFixed(1), type: 'temp', unit: '°C', max: 40, ideal: '28 - 32' }
                    ].map((item: any) => (
                        <div key={item.type} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-blue-500 transition-colors">{item.label}</span>
                                    <span className="text-[10px] text-neutral-400">Ideal: {item.ideal}</span>
                                </div>
                                <div className={`text-xl font-bold px-3 py-0.5 rounded-lg ${getStatusColor(parseFloat(item.val), item.type)}`}>
                                    {item.val} <span className="text-xs opacity-70 font-normal">{item.unit}</span>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-700/50 rounded-full overflow-hidden p-[2px]">
                                <div className={`h-full ${getProgressBarColor(parseFloat(item.val), item.type)} rounded-full transition-all duration-1000 ease-out`} style={{width: `${(parseFloat(item.val) / item.max) * 100}%`}}></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl h-full">
                        <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-600 mb-2">assignment_add</span>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium">No readings yet</p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Select a different pond or add a record.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export function MoultingCycleWidget() {
    const { t } = useLanguage();
    const ponds = useMyPonds();
    const [selectedPondId, setSelectedPondId] = useState<string>("");
    const [daysOfCulture, setDaysOfCulture] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ponds.length > 0 && !selectedPondId) {
            setSelectedPondId(ponds[0]._id);
        }
    }, [ponds]);

    useEffect(() => {
        const fetchCycle = async () => {
             if (!selectedPondId) return;
             setLoading(true);
             try {
                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/pond/${selectedPondId}/active-cycle`, { credentials: "include" });
                 if (res.ok) {
                    const cycle = await res.json();
                    if (cycle && cycle.startDate) {
                        const start = new Date(cycle.startDate);
                        const now = new Date();
                        const diffTime = Math.abs(now.getTime() - start.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        setDaysOfCulture(diffDays);
                    } else {
                        setDaysOfCulture(null);
                    }
                 } else {
                     setDaysOfCulture(null);
                 }
             } catch (error) {
                 console.error("Failed to fetch cycle", error);
                 setDaysOfCulture(null);
             } finally {
                 setLoading(false);
             }
        };

        fetchCycle();
    }, [selectedPondId]);

    const cycleLength = 15;
    const currentDayInCycle = daysOfCulture ? daysOfCulture % cycleLength : 0;
    const progress = (currentDayInCycle / cycleLength) * 100;
    const daysUntilMoult = cycleLength - currentDayInCycle;
    
    // Determine phase color
    let phaseColor = "text-blue-500";
    let phaseBg = "bg-blue-50 dark:bg-blue-900/20";
    if (progress > 80) {
        phaseColor = "text-purple-500";
        phaseBg = "bg-purple-50 dark:bg-purple-900/20";
    }

    // Phase calculation
    let phase = "";
    if (progress < 20) phase = t("postMoult");
    else if (progress < 80) phase = t("interMoult");
    else phase = t("preMoult"); 

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700/50 flex flex-col relative overflow-hidden min-h-[300px]">
             
             <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${daysOfCulture !== null ? phaseBg + ' ' + phaseColor : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-700'}`}>
                        <span className="material-symbols-outlined">restart_alt</span>
                     </div>
                     <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white text-lg leading-tight">{t("moultingCycle")}</h3>
                        {ponds.length > 0 ? (
                            <select 
                                className="text-xs text-neutral-500 dark:text-neutral-400 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-blue-500"
                                value={selectedPondId}
                                onChange={(e) => setSelectedPondId(e.target.value)}
                            >
                                {ponds.map(p => <option key={p._id} value={p._id}>{p.pondName}</option>)}
                            </select>
                        ) : (
                            <p className="text-xs text-neutral-500">No ponds</p>
                        )}
                     </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center opacity-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : daysOfCulture !== null ? (
                <>
                    <h3 className="absolute top-6 right-6 text-xs font-bold uppercase tracking-widest opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <span className={phaseColor}>{phase}</span>
                    </h3>
                    
                    <div className="flex-1 flex items-center justify-center relative my-4">
                        {/* Decorative background glow */}
                        <div className={`absolute w-32 h-32 ${phaseBg} rounded-full blur-3xl opacity-50`}></div>

                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                {/* Track */}
                                <circle cx="50%" cy="50%" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-neutral-50 dark:text-neutral-700/30" />
                                {/* Progress */}
                                <circle 
                                    cx="50%" cy="50%" r="80" 
                                    stroke="currentColor" strokeWidth="12" fill="transparent" 
                                    strokeDasharray="502" 
                                    strokeDashoffset={502 - (502 * progress) / 100} 
                                    className={`${phaseColor} transition-all duration-1000 ease-in-out drop-shadow-md`} 
                                    strokeLinecap="round" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-neutral-800 dark:text-white tracking-tighter">{daysOfCulture}</span>
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">{t("days")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-2xl p-4 flex justify-between items-center relative z-10 mx-2">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{t("estimatedMoult")}</div>
                        <div className={`text-xl font-bold ${phaseColor}`}>{daysUntilMoult} <span className="text-xs text-neutral-400 font-normal">{t("days")}</span></div>
                    </div>
                </>
            ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl">
                    <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-600 mb-2">history_toggle_off</span>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">{t("noActiveCycle")}</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Start a cycle to spot moulting.</p>
                </div>
            )}
        </div>
    );
}

export function ShrimpPriceWidget() {
    const { t } = useLanguage();
    
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-0 hover:shadow-xl transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-1 border border-neutral-100 dark:border-neutral-700/50 flex flex-col h-full overflow-hidden">
             <div className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 text-xl shadow-sm">
                        <span>฿</span>
                     </div>
                     <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white text-lg leading-tight">{t("shrimpPrice")}</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Market updates</p>
                     </div>
                </div>
             </div>
             
             <div className="flex-1 overflow-x-auto p-2">
                 <table className="w-full text-sm text-left border-collapse">
                     <thead className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                         <tr>
                             <th className="px-4 py-3 font-medium opacity-70">Size</th>
                             <th className="px-4 py-3 font-medium opacity-70 text-center">Trend</th>
                             <th className="px-4 py-3 font-medium opacity-70 text-right">Price</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-dashed divide-neutral-100 dark:divide-neutral-700/50">
                         {mockShrimpPrices.map((item, index) => (
                             <tr key={index} className="group hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                                 <td className="px-4 py-3.5 font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{item.size}</td>
                                 <td className="px-4 py-3.5 text-center">
                                    {item.trend === 'up' && <span className="material-symbols-outlined text-green-500 text-lg">trending_up</span>}
                                    {item.trend === 'down' && <span className="material-symbols-outlined text-red-500 text-lg">trending_down</span>}
                                    {item.trend === 'steady' && <span className="material-symbols-outlined text-neutral-300 dark:text-neutral-600 text-lg">remove</span>}
                                 </td>
                                 <td className="px-4 py-3.5 text-right">
                                     <div className="font-bold text-neutral-800 dark:text-white text-base">฿{item.price}</div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 text-center border-t border-neutral-100 dark:border-neutral-700/50">
                <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
                    Last update: {new Date().toLocaleDateString()}
                </div>
             </div>
        </div>
    );
}
