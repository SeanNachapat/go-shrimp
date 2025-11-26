"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Database() {
  const { user } = useAuth();
  const [ponds, setPonds] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedPond, setSelectedPond] = useState("");
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  
  // Modals state
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);

  // New Pond Form Data
  const [newPondData, setNewPondData] = useState({
    pondName: "",
    areaSqm: "",
    depthM: "",
    pondType: "semi-intensive",
    farmId: ""
  });

  // New Cycle Form Data
  const [newCycleData, setNewCycleData] = useState({
    stockDate: new Date().toISOString().split('T')[0],
    initialCount: "",
    shrimpSpecies: "Litopenaeus vannamei"
  });

  const [formData, setFormData] = useState({
    readingDatetime: new Date().toISOString().split('T')[0],
    readingTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    readingSession: "morning",
    waterQuality: {
      temperatureCelsius: "",
      salinityPpt: "",
      phLevel: "",
      dissolvedOxygenMgl: "",
      ammoniaNh3Mgl: "",
      nitriteNo2Mgl: "",
      alkalinityMgl: "",
      waterColor: "clear"
    },
    healthObservation: {
      avgWeightG: "",
      avgBodyLengthCm: ""
    },
    feeding: {
      feedType: "",
      amountFedKg: ""
    }
  });

  const fetchRecentRecords = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/records");
      if (res.ok) {
        const data = await res.json();
        setRecentRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch recent records:", error);
    }
  };

  const fetchPonds = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/ponds");
      if (res.ok) {
        const data = await res.json();
        setPonds(data);
        if (data.length > 0 && !selectedPond) {
          setSelectedPond(data[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch ponds:", error);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/farms");
      if (res.ok) {
        const data = await res.json();
        setFarms(data);
        if (data.length > 0) {
            setNewPondData(prev => ({ ...prev, farmId: data[0]._id }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch farms:", error);
    }
  };

  const fetchActiveCycle = async () => {
    if (!selectedPond) return;
    try {
      const res = await fetch(`http://localhost:4000/api/pond/${selectedPond}/active-cycle`);
      if (res.ok) {
        const data = await res.json();
        setActiveCycle(data);
      } else {
        setActiveCycle(null);
      }
    } catch (error) {
      console.error("Failed to fetch active cycle:", error);
      setActiveCycle(null);
    }
  };

  useEffect(() => {
    fetchPonds();
    fetchRecentRecords();
    fetchFarms();
  }, []);

  useEffect(() => {
    if (selectedPond) {
      fetchActiveCycle();
    }
  }, [selectedPond]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!activeCycle) {
      alert("No active cycle for this pond. Cannot submit data.");
      return;
    }

    const payload = {
      pondId: selectedPond,
      cycleId: activeCycle._id,
      readingDatetime: new Date(`${formData.readingDatetime}T${formData.readingTime}`),
      readingSession: formData.readingSession,
      waterQuality: {
        temperatureCelsius: parseFloat(formData.waterQuality.temperatureCelsius) || undefined,
        salinityPpt: parseFloat(formData.waterQuality.salinityPpt) || undefined,
        phLevel: parseFloat(formData.waterQuality.phLevel) || undefined,
        dissolvedOxygenMgl: parseFloat(formData.waterQuality.dissolvedOxygenMgl) || undefined,
        ammoniaNh3Mgl: parseFloat(formData.waterQuality.ammoniaNh3Mgl) || undefined,
        nitriteNo2Mgl: parseFloat(formData.waterQuality.nitriteNo2Mgl) || undefined,
        alkalinityMgl: parseFloat(formData.waterQuality.alkalinityMgl) || undefined,
        waterColor: formData.waterQuality.waterColor
      },
      healthObservation: {
        avgWeightG: parseFloat(formData.healthObservation.avgWeightG) || undefined,
        avgBodyLengthCm: parseFloat(formData.healthObservation.avgBodyLengthCm) || undefined
      },
      feeding: {
        feedType: formData.feeding.feedType,
        amountFedKg: parseFloat(formData.feeding.amountFedKg) || undefined
      },
      recordedBy: user?._id
    };

    try {
      const res = await fetch("http://localhost:4000/api/record/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Data submitted successfully!");
        fetchRecentRecords(); // Refresh table
      } else {
        const errorData = await res.json();
        alert(`Submission failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed.");
    }
  };

  const handleCreatePond = async (e: any) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:4000/api/pond/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newPondData,
                areaSqm: parseFloat(newPondData.areaSqm),
                depthM: parseFloat(newPondData.depthM)
            })
        });
        if (res.ok) {
            alert("Pond created successfully!");
            setIsPondModalOpen(false);
            fetchPonds();
        } else {
            const err = await res.json();
            alert(`Failed to create pond: ${err.message}`);
        }
    } catch (error) {
        console.error("Create pond error:", error);
        alert("Failed to create pond.");
    }
  };

  const handleCreateCycle = async (e: any) => {
    e.preventDefault();
    if (!selectedPond) {
        alert("Please select a pond first.");
        return;
    }
    try {
        const res = await fetch("http://localhost:4000/api/stock/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pondId: selectedPond,
                ...newCycleData,
                initialCount: parseInt(newCycleData.initialCount)
            })
        });
        if (res.ok) {
            alert("Stocking cycle created successfully!");
            setIsCycleModalOpen(false);
            fetchActiveCycle();
        } else {
            const err = await res.json();
            alert(`Failed to create cycle: ${err.message}`);
        }
    } catch (error) {
        console.error("Create cycle error:", error);
        alert("Failed to create cycle.");
    }
  };

  return (
    <div className="gap-3 p-5 relative">
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-white shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4">Daily Shrimp Data</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6 gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-900">Pond</label>
                    <button 
                        type="button" 
                        onClick={() => setIsPondModalOpen(true)}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        + New Pond
                    </button>
                </div>
                <select
                  name="selectedPond"
                  value={selectedPond}
                  onChange={(e) => setSelectedPond(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {ponds.map((pond) => (
                    <option key={pond._id} value={pond._id}>{pond.pondName}</option>
                  ))}
                </select>
              </div>
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-900">Active Cycle</label>
                    <button 
                        type="button" 
                        onClick={() => setIsCycleModalOpen(true)}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        + New Cycle
                    </button>
                 </div>
                 <div className="p-2.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                    {activeCycle ? `Cycle started: ${new Date(activeCycle.stockDate).toLocaleDateString()}` : "No active cycle"}
                 </div>
              </div>
            </div>

            <div className="mb-6 gap-6 grid grid-cols-1 md:grid-cols-3">
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                <input
                  type="date"
                  name="readingDatetime"
                  value={formData.readingDatetime}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Time</label>
                <input
                  type="time"
                  name="readingTime"
                  value={formData.readingTime}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Session</label>
                <select
                  name="readingSession"
                  value={formData.readingSession}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            {/* Water Quality */}
            <h3 className="text-lg font-semibold mb-3">Water Quality</h3>
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="waterQuality.temperatureCelsius"
                  value={formData.waterQuality.temperatureCelsius}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Salinity (ppt)</label>
                <input
                  type="number"
                  step="0.1"
                  name="waterQuality.salinityPpt"
                  value={formData.waterQuality.salinityPpt}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">pH</label>
                <input
                  type="number"
                  step="0.1"
                  name="waterQuality.phLevel"
                  value={formData.waterQuality.phLevel}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">DO (mg/L)</label>
                <input
                  type="number"
                  step="0.1"
                  name="waterQuality.dissolvedOxygenMgl"
                  value={formData.waterQuality.dissolvedOxygenMgl}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Ammonia (mg/L)</label>
                <input
                  type="number"
                  step="0.01"
                  name="waterQuality.ammoniaNh3Mgl"
                  value={formData.waterQuality.ammoniaNh3Mgl}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Nitrite (mg/L)</label>
                <input
                  type="number"
                  step="0.01"
                  name="waterQuality.nitriteNo2Mgl"
                  value={formData.waterQuality.nitriteNo2Mgl}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Alkalinity (mg/L)</label>
                <input
                  type="number"
                  step="1"
                  name="waterQuality.alkalinityMgl"
                  value={formData.waterQuality.alkalinityMgl}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Water Color</label>
                <select
                  name="waterQuality.waterColor"
                  value={formData.waterQuality.waterColor}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                    <option value="clear">Clear</option>
                    <option value="light_green">Light Green</option>
                    <option value="dark_green">Dark Green</option>
                    <option value="brown">Brown</option>
                    <option value="murky">Murky</option>
                </select>
              </div>
            </div>

            {/* Health & Feeding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Health</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Avg Weight (g)</label>
                            <input
                            type="number"
                            step="0.1"
                            name="healthObservation.avgWeightG"
                            value={formData.healthObservation.avgWeightG}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Avg Length (cm)</label>
                            <input
                            type="number"
                            step="0.1"
                            name="healthObservation.avgBodyLengthCm"
                            value={formData.healthObservation.avgBodyLengthCm}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-3">Feeding</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Feed Type</label>
                            <input
                            type="text"
                            name="feeding.feedType"
                            value={formData.feeding.feedType}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Amount (kg)</label>
                            <input
                            type="number"
                            step="0.1"
                            name="feeding.amountFedKg"
                            value={formData.feeding.amountFedKg}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
              type="submit"
              className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit Data
            </button>
          </form>
        </div>

        {/* Recent Data Table */}
        <div className="rounded-2xl bg-white shadow-lg p-5 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Recent Data</h2>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Time</th>
                <th scope="col" className="px-6 py-3">Pond</th>
                <th scope="col" className="px-6 py-3">Temp (°C)</th>
                <th scope="col" className="px-6 py-3">Salinity (ppt)</th>
                <th scope="col" className="px-6 py-3">pH</th>
                <th scope="col" className="px-6 py-3">DO (mg/L)</th>
                <th scope="col" className="px-6 py-3">Avg Weight (g)</th>
                <th scope="col" className="px-6 py-3">Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(record.readingDatetime).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(record.readingDatetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                  <td className="px-6 py-4">{record.pondId?.pondName || "Unknown"}</td>
                  <td className="px-6 py-4">{record.waterQuality?.temperatureCelsius || "-"}</td>
                  <td className="px-6 py-4">{record.waterQuality?.salinityPpt || "-"}</td>
                  <td className="px-6 py-4">{record.waterQuality?.phLevel || "-"}</td>
                  <td className="px-6 py-4">{record.waterQuality?.dissolvedOxygenMgl || "-"}</td>
                  <td className="px-6 py-4">{record.healthObservation?.avgWeightG || "-"}</td>
                  <td className="px-6 py-4">{record.recordedBy?.username || record.recordedBy?.fullName || "Unknown"}</td>
                </tr>
              ))}
              {recentRecords.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center">No recent data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Pond Modal */}
      {isPondModalOpen && (
        <div className="fixed inset-0 backdrop-blur transition-all overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Pond</h3>
                    <form onSubmit={handleCreatePond} className="mt-2 text-left">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pond Name</label>
                            <input 
                                type="text" 
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newPondData.pondName}
                                onChange={(e) => setNewPondData({...newPondData, pondName: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Area (sqm)</label>
                            <input 
                                type="number" 
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newPondData.areaSqm}
                                onChange={(e) => setNewPondData({...newPondData, areaSqm: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Depth (m)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newPondData.depthM}
                                onChange={(e) => setNewPondData({...newPondData, depthM: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newPondData.pondType}
                                onChange={(e) => setNewPondData({...newPondData, pondType: e.target.value})}
                            >
                                <option value="intensive">Intensive</option>
                                <option value="semi-intensive">Semi-intensive</option>
                                <option value="extensive">Extensive</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Farm</label>
                            <select 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newPondData.farmId}
                                onChange={(e) => setNewPondData({...newPondData, farmId: e.target.value})}
                                required
                            >
                                {farms.map(farm => (
                                    <option key={farm._id} value={farm._id}>{farm.farmName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button 
                                type="button"
                                onClick={() => setIsPondModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      {/* Create Cycle Modal */}
      {isCycleModalOpen && (
        <div className="fixed inset-0 backdrop-blur transition-all overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Start New Cycle</h3>
                    <form onSubmit={handleCreateCycle} className="mt-2 text-left">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Stock Date</label>
                            <input 
                                type="date" 
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newCycleData.stockDate}
                                onChange={(e) => setNewCycleData({...newCycleData, stockDate: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Initial Count</label>
                            <input 
                                type="number" 
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newCycleData.initialCount}
                                onChange={(e) => setNewCycleData({...newCycleData, initialCount: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Species</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={newCycleData.shrimpSpecies}
                                onChange={(e) => setNewCycleData({...newCycleData, shrimpSpecies: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button 
                                type="button"
                                onClick={() => setIsCycleModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Start Cycle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
