"use client";

import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Building2, CheckCircle, Clock, Search, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [unverifiedCompanies, setUnverifiedCompanies] = useState<any[]>([]);
  const [verifiedCompanies, setVerifiedCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [unverifiedRes, verifiedRes] = await Promise.all([
        api.get("/admin/companies/unverified"),
        api.get("/admin/companies/verified"),
      ]);
      setUnverifiedCompanies(unverifiedRes.data);
      setVerifiedCompanies(verifiedRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await api.put(`/admin/companies/${id}/verify`);
      // Refresh data
      fetchData();
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-red-500" />
              HireX Admin Panel
            </h1>
            <p className="text-neutral-400 mt-2">Manage companies and app verification statuses.</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 flex items-center px-4 py-2 rounded-xl">
            <Search className="w-5 h-5 text-neutral-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="bg-transparent outline-none text-sm placeholder:text-neutral-600"
            />
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center shadow-lg">
            <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mr-4 border border-amber-500/20">
              <Clock className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium">Pending Verification</p>
              <h2 className="text-3xl font-bold text-white">{unverifiedCompanies.length}</h2>
            </div>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center shadow-lg">
            <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mr-4 border border-green-500/20">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium">Verified Companies</p>
              <h2 className="text-3xl font-bold text-white">{verifiedCompanies.length}</h2>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-center flex-col shadow-lg border-dashed">
            <p className="text-neutral-500 text-sm">More modules coming soon</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 mb-6">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "pending" ? "border-red-500 text-red-400" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Pending Verifications
          </button>
          <button 
            onClick={() => setActiveTab("verified")}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "verified" ? "border-green-500 text-green-400" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            Verified Companies
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-500 font-medium">Fetching Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "pending" ? unverifiedCompanies : verifiedCompanies).map((company) => (
              <div key={company._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl hover:border-neutral-700 transition-colors relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="w-24 h-24" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{company.companyName || "Unnamed Company"}</h3>
                    {company.isVerified ? (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold border border-green-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Founder</p>
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-neutral-400">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Company Info</p>
                      <p className="text-sm text-neutral-300 line-clamp-2">{company.companyInfo || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Ownership Docs</p>
                      {company.companyOwnershipDocs ? (
                        <a href={company.companyOwnershipDocs} target="_blank" className="text-sm text-cyan-400 hover:underline break-all">
                          View Documents
                        </a>
                      ) : (
                        <span className="text-sm text-neutral-600">No documents uploaded</span>
                      )}
                    </div>
                  </div>

                  {!company.isVerified && (
                    <button 
                      onClick={() => handleVerify(company._id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95"
                    >
                      Verify Company
                    </button>
                  )}
                </div>
              </div>
            ))}

            {(activeTab === "pending" ? unverifiedCompanies : verifiedCompanies).length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
                <CheckCircle className="w-12 h-12 text-neutral-700 mb-4" />
                <h3 className="text-xl font-bold text-neutral-500 mb-2">Waitings Queue is Empty</h3>
                <p className="text-neutral-600 text-sm">All companies have been verified.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
