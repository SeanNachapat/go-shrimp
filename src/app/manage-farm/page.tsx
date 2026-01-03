"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import Loading from "@/Components/Loading";

export default function ManageFarm() {
  const { user } = useAuth();
  const { t } = useLanguage();
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/my-farm`, { credentials: "include" });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm/members`, { credentials: "include" });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ponds`, { credentials: "include" });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmId: joinFarmId }),
        credentials: "include"
      });
      if (res.ok) {
        alert(t("joinedSuccessfully"));
        fetchMyFarm();
      } else {
        const err = await res.json();
        alert(`${t("failedToJoin")}: ${err.message}`);
      }
    } catch (error) {
      console.error("Join error:", error);
      alert(t("failedToJoin"));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm(t("areYouSureRemoveMember"))) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm/member/${memberId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        alert(t("memberRemoved"));
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm/${farm._id}`, {
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
    if (!confirm(t("areYouSureDeletePond"))) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/pond/${pondId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (res.ok) {
            alert(t("pondDeleted"));
            fetchPonds();
        } else {
            alert("Failed to delete pond.");
        }
    } catch (error) {
        console.error("Delete pond error:", error);
    }
  };

  const handleLeaveFarm = async () => {
    if (!confirm(t("areYouSureLeaveFarm"))) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm/leave`, {
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
    if (!confirm(t("areYouSureDeleteFarm"))) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm`, {
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
      <div className="p-3 md:p-5 flex flex-col items-center justify-center min-h-[80vh]">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-neutral-900 dark:text-white text-center">{t("notPartOfFarm")}</h2>
        <div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md border border-neutral-100 dark:border-neutral-700">
            <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-6">
                <button 
                    className={`flex-1 py-3 text-center text-sm font-semibold transition-colors relative ${!isEditingFarm ? 'text-orange-600 dark:text-orange-500' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                    onClick={() => setIsEditingFarm(false)}
                >
                    {t("joinFarm")}
                    {!isEditingFarm && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 dark:bg-orange-500 rounded-t-full"></div>}
                </button>
                <button 
                    className={`flex-1 py-3 text-center text-sm font-semibold transition-colors relative ${isEditingFarm ? 'text-orange-600 dark:text-orange-500' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                    onClick={() => setIsEditingFarm(true)}
                >
                    {t("createFarm")}
                    {isEditingFarm && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 dark:bg-orange-500 rounded-t-full"></div>}
                </button>
            </div>

            {!isEditingFarm ? (
                <>
                    <h3 className="text-lg font-bold mb-4 text-neutral-900 dark:text-white">{t("joinFarm")}</h3>
                    <form onSubmit={handleJoinFarm} className="flex flex-col gap-4">
                        <div>
                             <input 
                                type="text" 
                                placeholder={t("enterFarmId")}
                                className="w-full bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                value={joinFarmId}
                                onChange={(e) => setJoinFarmId(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-xl text-sm px-5 py-3 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800 shadow-md transition-all">
                            {t("joinFarm")}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-xs md:text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg">
                        {t("askManager")}
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-bold mb-4 text-neutral-900 dark:text-white">{t("createNewFarm")}</h3>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/farm/new`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(editFarmData),
                                credentials: "include"
                            });
                            if (res.ok) {
                                alert(t("farmCreated"));
                                fetchMyFarm();
                            } else {
                                const err = await res.json();
                                alert(`${t("failedToCreate")}: ${err.message}`);
                            }
                        } catch (error) {
                            console.error("Create farm error:", error);
                            alert(t("failedToCreate"));
                        }
                    }} className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            placeholder={t("farmName")}
                            className="w-full bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            value={editFarmData.farmName}
                            onChange={(e) => setEditFarmData({...editFarmData, farmName: e.target.value})}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder={t("location")}
                            className="w-full bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            value={editFarmData.location}
                            onChange={(e) => setEditFarmData({...editFarmData, location: e.target.value})}
                        />
                        <input 
                            type="number" 
                            placeholder={t("totalArea")}
                            className="w-full bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            value={editFarmData.totalAreaSqm}
                            onChange={(e) => setEditFarmData({...editFarmData, totalAreaSqm: e.target.value})}
                        />
                        <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-xl text-sm px-5 py-3 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 shadow-md transition-all">
                            {t("create")}
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-5 max-w-6xl mx-auto">
      {/* Farm Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 dark:bg-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
            <div className="w-full md:w-auto">
                {isEditingFarm ? (
                    <form onSubmit={handleUpdateFarm} className="space-y-3">
                        <input 
                            type="text" 
                            className="w-full text-xl md:text-2xl font-bold border-b border-neutral-300 focus:outline-none focus:border-orange-500 bg-transparent dark:text-white dark:border-neutral-600"
                            value={editFarmData.farmName}
                            onChange={(e) => setEditFarmData({...editFarmData, farmName: e.target.value})}
                        />
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Location"
                                className="text-sm border p-1 rounded bg-transparent dark:text-white dark:border-neutral-600 flex-1"
                                value={editFarmData.location}
                                onChange={(e) => setEditFarmData({...editFarmData, location: e.target.value})}
                            />
                            <input 
                                type="number" 
                                placeholder="Area (sqm)"
                                className="text-sm border p-1 rounded w-24 bg-transparent dark:text-white dark:border-neutral-600"
                                value={editFarmData.totalAreaSqm}
                                onChange={(e) => setEditFarmData({...editFarmData, totalAreaSqm: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button type="submit" className="text-xs bg-green-600 text-white px-3 py-1 rounded">Save</button>
                            <button type="button" onClick={() => setIsEditingFarm(false)} className="text-xs bg-neutral-300 px-3 py-1 rounded dark:bg-neutral-700 dark:text-neutral-300">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h1 className="text-xl md:text-3xl font-bold text-neutral-900 dark:text-white">{farm.farmName}</h1>
                        <div className="text-neutral-500 mt-1 flex items-center gap-2 dark:text-neutral-400 text-sm md:text-base">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {farm.location || "No location set"}
                        </div>
                        <div className="text-neutral-500 text-xs md:text-sm mt-1 dark:text-neutral-400">
                            Total Area: {farm.totalAreaSqm ? `${farm.totalAreaSqm} sqm` : "N/A"}
                        </div>
                    </>
                )}
            </div>
            
            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 w-full md:w-auto justify-between md:justify-start">
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                    {role === 'owner' ? 'Owner' : 'Employee'}
                </span>
                {role === 'owner' && !isEditingFarm && (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsEditingFarm(true)}
                            className="text-xs md:text-sm text-neutral-600 hover:text-orange-600 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span> {t("editFarm")}
                        </button>
                        <button 
                            onClick={handleDeleteFarm}
                            className="text-xs md:text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">delete_forever</span> {t("deleteFarm")}
                        </button>
                    </div>
                )}
                {role === 'employee' && (
                    <button 
                        onClick={handleLeaveFarm}
                        className="text-xs md:text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span> {t("leaveFarm")}
                    </button>
                )}
            </div>
        </div>
        
        {role === 'owner' && (
            <div className="mt-4 md:mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600">
                <div className="text-xs md:text-sm font-medium text-neutral-700 mb-1 dark:text-neutral-300">{t("inviteCode")}</div>
                <div className="flex items-center gap-2 flex-wrap">
                    <code className="bg-white px-3 py-1 rounded border text-neutral-800 font-mono select-all text-xs md:text-sm dark:bg-neutral-600 dark:text-white dark:border-neutral-500 break-all">
                        {farm._id}
                    </code>
                    <span className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{t("shareInvite")}</span>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Members Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 dark:bg-neutral-800">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <span className="material-symbols-outlined">group</span>
                {t("teamMembers")}
            </h2>
            <div className="space-y-3 md:space-y-4">
                {members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">
                        <div className="flex items-center gap-3">
                            <img 
                                src={member.picture || "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f990.svg"} 
                                alt={member.fullName} 
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                            />
                            <div>
                                <div className="font-medium text-sm md:text-base text-neutral-900 dark:text-white">{member.fullName}</div>
                                <div className="text-xs text-neutral-500 capitalize dark:text-neutral-300">{member.role}</div>
                            </div>
                        </div>
                        {role === 'owner' && member._id !== user?._id && (
                            <button 
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove Member"
                            >
                                <span className="material-symbols-outlined text-lg">person_remove</span>
                            </button>
                        )}
                    </div>
                ))}
                {members.length === 0 && <div className="text-neutral-500 text-center py-4 dark:text-neutral-400 text-sm">{t("noMembers")}</div>}
            </div>
        </div>

        {/* Ponds Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 dark:bg-neutral-800">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <span className="material-symbols-outlined">water_drop</span>
                {t("ponds")}
            </h2>
            <div className="space-y-3">
                {ponds.map((pond) => (
                    <div key={pond._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">
                        <div>
                            <div className="font-medium text-sm md:text-base text-neutral-900 dark:text-white">{pond.pondName}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-300">
                                {pond.areaSqm} sqm • {pond.depthM}m {t("depth")} • {pond.pondType}
                            </div>
                        </div>
                        {role === 'owner' && (
                            <button 
                                onClick={() => handleDeletePond(pond._id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete Pond"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        )}
                    </div>
                ))}
                {ponds.length === 0 && <div className="text-neutral-500 text-center py-4 dark:text-neutral-400 text-sm">{t("noPonds")}</div>}
            </div>
        </div>
      </div>
    </div>
  );
}
