"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import Loading from "@/Components/Loading";

export default function ManageFarm() {
  const { user } = useAuth();
  const [farm, setFarm] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [ponds, setPonds] = useState<any[]>([]);
  const [joinFarmId, setJoinFarmId] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Farm State
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  const [editFarmData, setEditFarmData] = useState({
    farmName: "",
    location: "",
    totalAreaSqm: ""
  });

  const fetchMyFarm = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/my-farm", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setFarm(data.farm);
        setRole(data.role);
        setEditFarmData({
            farmName: data.farm.farmName,
            location: data.farm.location || "",
            totalAreaSqm: data.farm.totalAreaSqm || ""
        });
      } else {
        setFarm(null);
      }
    } catch (error) {
      console.error("Failed to fetch farm:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/farm/members", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const fetchPonds = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/ponds", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Filter ponds for this farm if needed, but API returns all. 
        // Ideally API should filter, but for now we filter client side or assume API returns relevant ones.
        // Actually the current /api/ponds returns ALL ponds. We should filter by farmId.
        if (farm) {
            setPonds(data.filter((p: any) => p.farmId === farm._id));
        }
      }
    } catch (error) {
      console.error("Failed to fetch ponds:", error);
    }
  };

  useEffect(() => {
    fetchMyFarm();
  }, []);

  useEffect(() => {
    if (farm) {
      fetchMembers();
      fetchPonds();
    }
  }, [farm]);

  const handleJoinFarm = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/farm/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmId: joinFarmId }),
        credentials: "include"
      });
      if (res.ok) {
        alert("Joined farm successfully!");
        fetchMyFarm();
      } else {
        const err = await res.json();
        alert(`Failed to join: ${err.message}`);
      }
    } catch (error) {
      console.error("Join error:", error);
      alert("Failed to join farm.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/farm/member/${memberId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        alert("Member removed.");
        fetchMembers();
      } else {
        alert("Failed to remove member.");
      }
    } catch (error) {
      console.error("Remove member error:", error);
    }
  };

  const handleUpdateFarm = async (e: any) => {
    e.preventDefault();
    try {
        const res = await fetch(`http://localhost:4000/api/farm/${farm._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editFarmData),
            credentials: "include"
        });
        if (res.ok) {
            alert("Farm updated!");
            setIsEditingFarm(false);
            fetchMyFarm();
        } else {
            alert("Failed to update farm.");
        }
    } catch (error) {
        console.error("Update farm error:", error);
    }
  };

  const handleDeletePond = async (pondId: string) => {
    if (!confirm("Are you sure you want to delete this pond? This action cannot be undone.")) return;
    try {
        const res = await fetch(`http://localhost:4000/api/pond/${pondId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (res.ok) {
            alert("Pond deleted.");
            fetchPonds();
        } else {
            alert("Failed to delete pond.");
        }
    } catch (error) {
        console.error("Delete pond error:", error);
    }
  };

  const handleLeaveFarm = async () => {
    if (!confirm("Are you sure you want to leave this farm?")) return;
    try {
        const res = await fetch("http://localhost:4000/api/farm/leave", {
            method: "POST",
            credentials: "include"
        });
        if (res.ok) {
            alert("You have left the farm.");
            setFarm(null);
            setRole("");
            setMembers([]);
            setPonds([]);
        } else {
            const err = await res.json();
            alert(`Failed to leave farm: ${err.message}`);
        }
    } catch (error) {
        console.error("Leave farm error:", error);
    }
  };

  const handleDeleteFarm = async () => {
    if (!confirm("Are you sure you want to delete this farm? This action cannot be undone and will remove all members and data.")) return;
    try {
        const res = await fetch("http://localhost:4000/api/farm", {
            method: "DELETE",
            credentials: "include"
        });
        if (res.ok) {
            alert("Farm deleted successfully.");
            setFarm(null);
            setRole("");
            setMembers([]);
            setPonds([]);
        } else {
            const err = await res.json();
            alert(`Failed to delete farm: ${err.message}`);
        }
    } catch (error) {
        console.error("Delete farm error:", error);
    }
  };

  if (loading) return <Loading />;

  if (!farm) {
    return (
      <div className="p-5 flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">You are not part of a farm yet.</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex border-b mb-4">
                <button 
                    className={`flex-1 py-2 text-center ${!isEditingFarm ? 'border-b-2 border-blue-600 font-semibold text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setIsEditingFarm(false)}
                >
                    Join Farm
                </button>
                <button 
                    className={`flex-1 py-2 text-center ${isEditingFarm ? 'border-b-2 border-blue-600 font-semibold text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setIsEditingFarm(true)}
                >
                    Create Farm
                </button>
            </div>

            {!isEditingFarm ? (
                <>
                    <h3 className="text-lg font-semibold mb-3">Join a Farm</h3>
                    <form onSubmit={handleJoinFarm} className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            placeholder="Enter Farm ID" 
                            className="border p-2 rounded-lg"
                            value={joinFarmId}
                            onChange={(e) => setJoinFarmId(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Join Farm
                        </button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        Ask your manager to share the Farm ID.
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-3">Create a New Farm</h3>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            const res = await fetch("http://localhost:4000/api/farm/new", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(editFarmData),
                                credentials: "include"
                            });
                            if (res.ok) {
                                alert("Farm created successfully!");
                                fetchMyFarm();
                            } else {
                                const err = await res.json();
                                alert(`Failed to create farm: ${err.message}`);
                            }
                        } catch (error) {
                            console.error("Create farm error:", error);
                            alert("Failed to create farm.");
                        }
                    }} className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            placeholder="Farm Name" 
                            className="border p-2 rounded-lg"
                            value={editFarmData.farmName}
                            onChange={(e) => setEditFarmData({...editFarmData, farmName: e.target.value})}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            className="border p-2 rounded-lg"
                            value={editFarmData.location}
                            onChange={(e) => setEditFarmData({...editFarmData, location: e.target.value})}
                        />
                        <input 
                            type="number" 
                            placeholder="Total Area (sqm)" 
                            className="border p-2 rounded-lg"
                            value={editFarmData.totalAreaSqm}
                            onChange={(e) => setEditFarmData({...editFarmData, totalAreaSqm: e.target.value})}
                        />
                        <button type="submit" className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                            Create Farm
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {/* Farm Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
            <div>
                {isEditingFarm ? (
                    <form onSubmit={handleUpdateFarm} className="space-y-3">
                        <input 
                            type="text" 
                            className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            value={editFarmData.farmName}
                            onChange={(e) => setEditFarmData({...editFarmData, farmName: e.target.value})}
                        />
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Location"
                                className="text-sm border p-1 rounded"
                                value={editFarmData.location}
                                onChange={(e) => setEditFarmData({...editFarmData, location: e.target.value})}
                            />
                            <input 
                                type="number" 
                                placeholder="Area (sqm)"
                                className="text-sm border p-1 rounded w-24"
                                value={editFarmData.totalAreaSqm}
                                onChange={(e) => setEditFarmData({...editFarmData, totalAreaSqm: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button type="submit" className="text-xs bg-green-600 text-white px-3 py-1 rounded">Save</button>
                            <button type="button" onClick={() => setIsEditingFarm(false)} className="text-xs bg-gray-300 px-3 py-1 rounded">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900">{farm.farmName}</h1>
                        <div className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {farm.location || "No location set"}
                        </div>
                        <div className="text-gray-500 text-sm mt-1">
                            Total Area: {farm.totalAreaSqm ? `${farm.totalAreaSqm} sqm` : "N/A"}
                        </div>
                    </>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {role === 'owner' ? 'Owner' : 'Employee'}
                </span>
                {role === 'owner' && !isEditingFarm && (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsEditingFarm(true)}
                            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span> Edit Farm
                        </button>
                        <button 
                            onClick={handleDeleteFarm}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">delete_forever</span> Delete Farm
                        </button>
                    </div>
                )}
                {role === 'employee' && (
                    <button 
                        onClick={handleLeaveFarm}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span> Leave Farm
                    </button>
                )}
            </div>
        </div>
        
        {role === 'owner' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Invite Code (Farm ID)</div>
                <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-1 rounded border text-gray-800 font-mono select-all">
                        {farm._id}
                    </code>
                    <span className="text-xs text-gray-500">Share this with your employees to let them join.</span>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">group</span>
                Team Members
            </h2>
            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <img 
                                src={member.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"} 
                                alt={member.fullName} 
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{member.fullName}</div>
                                <div className="text-xs text-gray-500 capitalize">{member.role}</div>
                            </div>
                        </div>
                        {role === 'owner' && member._id !== user?._id && (
                            <button 
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove Member"
                            >
                                <span className="material-symbols-outlined">person_remove</span>
                            </button>
                        )}
                    </div>
                ))}
                {members.length === 0 && <div className="text-gray-500 text-center py-4">No members yet.</div>}
            </div>
        </div>

        {/* Ponds Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">water_drop</span>
                Ponds
            </h2>
            <div className="space-y-3">
                {ponds.map((pond) => (
                    <div key={pond._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">{pond.pondName}</div>
                            <div className="text-xs text-gray-500">
                                {pond.areaSqm} sqm • {pond.depthM}m depth • {pond.pondType}
                            </div>
                        </div>
                        {role === 'owner' && (
                            <button 
                                onClick={() => handleDeletePond(pond._id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete Pond"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        )}
                    </div>
                ))}
                {ponds.length === 0 && <div className="text-gray-500 text-center py-4">No ponds created yet.</div>}
            </div>
        </div>
      </div>
    </div>
  );
}
