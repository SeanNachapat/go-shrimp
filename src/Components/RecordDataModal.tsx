
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface RecordDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RecordDataModal({ isOpen, onClose, onSuccess }: RecordDataModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [ponds, setPonds] = useState<any[]>([]);
  const [selectedPond, setSelectedPond] = useState("");
  const [activeCycle, setActiveCycle] = useState<any>(null);

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
      calciumMgl: "",
      magnesiumMgl: "",
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

  const fetchPonds = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/ponds`);
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

  const fetchActiveCycle = async () => {
    if (!selectedPond) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/pond/${selectedPond}/active-cycle`);
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
    if (isOpen) {
        fetchPonds();
    }
  }, [isOpen]);

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
      alert(t("cannotSubmit"));
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
        calciumMgl: parseFloat(formData.waterQuality.calciumMgl) || undefined,
        magnesiumMgl: parseFloat(formData.waterQuality.magnesiumMgl) || undefined,
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/record/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(t("dataSubmitted"));
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        alert(`${t("submissionFailed")}: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(t("submissionFailed"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-all overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative p-8 border w-full max-w-4xl shadow-2xl rounded-2xl bg-white dark:bg-neutral-800 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{t("newDataRecord")}</h3>
                <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6 gap-6 grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t("pond")}</label>
                <select
                  name="selectedPond"
                  value={selectedPond}
                  onChange={(e) => setSelectedPond(e.target.value)}
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                >
                  {ponds.map((pond) => (
                    <option key={pond._id} value={pond._id}>{pond.pondName}</option>
                  ))}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t("activeCycle")}</label>
                 <div className="p-2.5 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800 font-medium dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-200">
                    {activeCycle ? `${t("started")}: ${new Date(activeCycle.stockDate).toLocaleDateString()}` : t("noActiveCycle")}
                 </div>
              </div>
            </div>

            <div className="mb-6 gap-6 grid grid-cols-1 md:grid-cols-3">
               <div>
                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("date")}</label>
                <input
                  type="date"
                  name="readingDatetime"
                  value={formData.readingDatetime}
                  onChange={handleChange}
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("time")}</label>
                <input
                  type="time"
                  name="readingTime"
                  value={formData.readingTime}
                  onChange={handleChange}
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  required
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("session")}</label>
                <select
                  name="readingSession"
                  value={formData.readingSession}
                  onChange={handleChange}
                  className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                >
                    <option value="morning">{t("morning")}</option>
                    <option value="afternoon">{t("afternoon")}</option>
                    <option value="evening">{t("evening")}</option>
                </select>
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-700 pt-5 mt-5">
                <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white flex items-center gap-2">
                    {t("waterQuality")}
                </h3>
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("temp")}</label>
                    <input
                    required={true}
                    type="number"
                    step="0.1"
                    name="waterQuality.temperatureCelsius"
                    value={formData.waterQuality.temperatureCelsius}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("salinity")}</label>
                    <input
                    required={true}
                    type="number"
                    step="0.1"
                    name="waterQuality.salinityPpt"
                    value={formData.waterQuality.salinityPpt}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("ph")}</label>
                    <input
                    required={true}
                    type="number"
                    step="0.1"
                    name="waterQuality.phLevel"
                    value={formData.waterQuality.phLevel}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("do")}</label>
                    <input
                    type="number"
                    step="0.1"
                    name="waterQuality.dissolvedOxygenMgl"
                    value={formData.waterQuality.dissolvedOxygenMgl}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("ammonia")}</label>
                    <input
                    type="number"
                    step="0.01"
                    name="waterQuality.ammoniaNh3Mgl"
                    value={formData.waterQuality.ammoniaNh3Mgl}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("nitrite")}</label>
                    <input
                    type="number"
                    step="0.01"
                    name="waterQuality.nitriteNo2Mgl"
                    value={formData.waterQuality.nitriteNo2Mgl}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("alkalinity")}</label>
                    <input
                    type="number"
                    step="1"
                    name="waterQuality.alkalinityMgl"
                    value={formData.waterQuality.alkalinityMgl}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("calcium")}</label>
                    <input
                    type="number"
                    step="1"
                    name="waterQuality.calciumMgl"
                    value={formData.waterQuality.calciumMgl}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("magnesium")}</label>
                    <input
                    type="number"
                    step="1"
                    name="waterQuality.magnesiumMgl"
                    value={formData.waterQuality.magnesiumMgl}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("waterColor")}</label>
                    <select
                    name="waterQuality.waterColor"
                    value={formData.waterQuality.waterColor}
                    onChange={handleChange}
                    className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    >
                        <option value="clear">{t("clear")}</option>
                        <option value="light_green">{t("lightGreen")}</option>
                        <option value="dark_green">{t("darkGreen")}</option>
                        <option value="brown">{t("brown")}</option>
                        <option value="murky">{t("murky")}</option>
                    </select>
                </div>
                </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-700 pt-5 mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                            {t("health")}
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("avgWeight")}</label>
                                <input
                                type="number"
                                step="0.1"
                                name="healthObservation.avgWeightG"
                                value={formData.healthObservation.avgWeightG}
                                onChange={handleChange}
                                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("avgLength")}</label>
                                <input
                                type="number"
                                step="0.1"
                                name="healthObservation.avgBodyLengthCm"
                                value={formData.healthObservation.avgBodyLengthCm}
                                onChange={handleChange}
                                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white flex items-center gap-2">
                            {t("feeding")}
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("feedType")}</label>
                                <input
                                type="text"
                                name="feeding.feedType"
                                value={formData.feeding.feedType}
                                onChange={handleChange}
                                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{t("amount")}</label>
                                <input
                                type="number"
                                step="0.1"
                                name="feeding.amountFedKg"
                                value={formData.feeding.amountFedKg}
                                onChange={handleChange}
                                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-700">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors font-medium dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                >
                    {t("cancel")}
                </button>
                <button
                type="submit"
                className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-md transition-colors font-medium flex items-center gap-2"
                >
                <span className="material-symbols-outlined">save</span>
                {t("saveRecord")}
                </button>
            </div>
          </form>
        </div>
    </div>
  );
}
