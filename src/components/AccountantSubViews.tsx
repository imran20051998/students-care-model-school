import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Receipt, 
  Coins, 
  Wallet, 
  AlertCircle, 
  Download, 
  X, 
  ChevronRight,
  UserCheck 
} from 'lucide-react';

// ==========================================
// 1. COLLECT FEES VIEW
// ==========================================
interface CollectFeesViewProps {
  lang: 'bn' | 'en';
  spotCashForm: { studentId: string; feeType: string; method: string; amount: string };
  setSpotCashForm: React.Dispatch<React.SetStateAction<{ studentId: string; feeType: string; method: string; amount: string }>>;
  handleSpotCashSubmit: (e: React.FormEvent) => void;
  mockStudents: Record<string, { name: string; class: string }>;
}

export function CollectFeesView({
  lang,
  spotCashForm,
  setSpotCashForm,
  handleSpotCashSubmit,
  mockStudents
}: CollectFeesViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'স্পট ক্যাশ ফি আদায়' : 'Collect Student Fees'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'সরাসরি ছাত্র বা অভিভাবক থেকে ফি রিসিভ করার অফলাইন আদায় ফর্ম।' : 'Record direct cash/bKash/card collection with instant ledger integration.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'ফি আদায় রিসিট ফর্ম' : 'Fee Receipt Logger'}</h3>
          <form onSubmit={handleSpotCashSubmit} className="space-y-4 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'ছাত্র নির্বাচন করুন' : 'Select Student (Mock ID)'}</label>
              <select 
                value={spotCashForm.studentId}
                onChange={(e) => setSpotCashForm(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 focus:outline-none focus:border-[#004D40]"
              >
                {Object.entries(mockStudents).map(([id, stud]) => (
                  <option key={id} value={id}>{stud.name} ({stud.class} - ID: {id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'ফি-র ধরণ' : 'Fee Item Type'}</label>
              <select 
                value={spotCashForm.feeType}
                onChange={(e) => setSpotCashForm(prev => ({ ...prev, feeType: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 focus:outline-none focus:border-[#004D40]"
              >
                <option value="Tuition Fee">{lang === 'bn' ? 'টিউশন ফি' : 'Tuition Fee'}</option>
                <option value="Exam Fee">{lang === 'bn' ? 'পরীক্ষার ফি' : 'Exam Fee'}</option>
                <option value="Session Fee">{lang === 'bn' ? 'সেশন ফি' : 'Session Fee'}</option>
                <option value="Lab Fee">{lang === 'bn' ? 'ল্যাবরেটরি ফি' : 'Lab / Sports Fee'}</option>
                <option value="Admission Fee">{lang === 'bn' ? 'ভর্তি ফি' : 'Admission Fee'}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</label>
              <select 
                value={spotCashForm.method}
                onChange={(e) => setSpotCashForm(prev => ({ ...prev, method: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 focus:outline-none focus:border-[#004D40]"
              >
                <option value="Cash">{lang === 'bn' ? 'ক্যাশ (নগদ)' : 'Cash'}</option>
                <option value="bKash">{lang === 'bn' ? 'বিকাশ (bKash)' : 'bKash (MFS)'}</option>
                <option value="Bank">{lang === 'bn' ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer'}</option>
                <option value="Visa">{lang === 'bn' ? 'ক্রেডিট/ডেবিট কার্ড' : 'Card / POS'}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'টাকার পরিমাণ (৳)' : 'Payment Amount (৳)'}</label>
              <input 
                type="number" 
                value={spotCashForm.amount}
                onChange={(e) => setSpotCashForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 focus:outline-none focus:border-[#004D40] font-bold text-slate-850"
                placeholder="2000"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg transition-all font-semibold shadow-sm text-center cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Check className="h-4 w-4" />
              <span>{lang === 'bn' ? 'আদায় লিপিবদ্ধ করুন' : 'Confirm & Print Receipt'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'বকেয়া ছাত্র তালিকা (দ্রুত আদায় করুন)' : 'Outstanding Student Dues'}</h3>
          <div className="space-y-2.5">
            {[
              { id: '2026101', name: 'Farhan Ishrak', class: 'Class 8A', due: 2000, type: 'Tuition Fee' },
              { id: '2026102', name: 'Nusrat Jahan', class: 'Class 8A', due: 5000, type: 'Admission Fee' },
              { id: '2026103', name: 'Zayan Ahmed', class: 'Class 9B', due: 1200, type: 'Exam Fee' },
              { id: '2026104', name: 'Tasfia Karim', class: 'Class 10A', due: 3500, type: 'Tuition Fee' },
              { id: '2026105', name: 'Abrar Fahad', class: 'Class 7C', due: 2000, type: 'Tuition Fee' },
            ].map((st, idx) => (
              <div key={idx} className="border border-slate-100 p-3 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{st.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{st.class} | ID: {st.id} | <span className="text-amber-600 font-bold">{st.type}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-rose-605">৳{st.due.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => setSpotCashForm({ studentId: st.id, feeType: st.type, method: 'Cash', amount: String(st.due) })}
                    className="px-3 py-1 bg-teal-50 hover:bg-[#004D40] text-[#004D40] hover:text-white border border-teal-100 rounded-md font-bold transition-all text-[11px] cursor-pointer"
                  >
                    + {lang === 'bn' ? 'আদায়' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. EXPENSE REPORTS VIEW
// ==========================================
export function ExpenseReportsView({ lang }: { lang: 'bn' | 'en' }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'স্কুল ব্যয় প্রতিবেদন ও রিপোর্ট' : 'School Expense Reports'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'চলতি মাস এবং বার্ষিক বাজেটের ব্যয়ের পুঙ্খানুপুঙ্খ প্রতিবেদন।' : 'Detailed analysis of monthly expenditures and cost centers.'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">{lang === 'bn' ? 'পেটি ক্যাশ স্থিতি' : 'Petty Cash Pool'}</span>
            <span className="text-xl font-black text-slate-800 block mt-1">৳৫,০০০</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded mt-1.5 inline-block border border-emerald-100">{lang === 'bn' ? '১০০% নিরাপদ' : 'Fully Funded'}</span>
          </div>
          <span className="p-3 bg-teal-50 text-[#004D40] rounded-xl"><Coins className="h-6 w-6" /></span>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">{lang === 'bn' ? 'মঞ্জুরীকৃত বিল' : 'Approved Reimbursements'}</span>
            <span className="text-xl font-black text-emerald-600 block mt-1">৳১২,৩০০</span>
            <span className="text-[9px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded mt-1.5 inline-block border border-teal-100">{lang === 'bn' ? 'বিতরণ সম্পন্ন' : 'Disbursed'}</span>
          </div>
          <span className="p-3 bg-teal-50 text-[#004D40] rounded-xl"><Check className="h-6 w-6" /></span>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">{lang === 'bn' ? 'বকেয়া ভেন্ডর পেমেন্ট' : 'Pending Vendor Dues'}</span>
            <span className="text-xl font-black text-amber-600 block mt-1">৳১৮,৫০০</span>
            <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded mt-1.5 inline-block border border-amber-100">{lang === 'bn' ? '১টি ভাউচার বাকি' : '1 invoice due'}</span>
          </div>
          <span className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="h-6 w-6" /></span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">{lang === 'bn' ? 'বাজেট ব্যবহার শতাংশ' : 'Expense Category Budget Usage'}</h3>
        <div className="space-y-4">
          {[
            { cat: 'Salary & Allowances', spent: 285000, budget: 300000, color: 'bg-[#004D40]' },
            { cat: 'Utilities & Internet', spent: 42000, budget: 50000, color: 'bg-teal-400' },
            { cat: 'Stationery & Papers', spent: 28500, budget: 30000, color: 'bg-amber-400' },
            { cat: 'School Repairs & Paint', spent: 25000, budget: 40000, color: 'bg-rose-400' },
            { cat: 'Transport & Fuel', spent: 22000, budget: 25000, color: 'bg-emerald-400' },
          ].map((x, idx) => {
            const ratio = Math.round((x.spent / x.budget) * 100);
            return (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-center font-bold text-slate-700 mb-1.5">
                  <span>{x.cat}</span>
                  <span className="font-extrabold text-slate-800">৳{x.spent.toLocaleString()} / ৳{x.budget.toLocaleString()} ({ratio}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${x.color}`} style={{ width: `${ratio}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. GENERATE INVOICES VIEW
// ==========================================
interface GenerateInvoicesViewProps {
  lang: 'bn' | 'en';
  isProcessingBulk: boolean;
  bulkProgress: number;
  handleRunBulkInvoice: () => void;
  showToastMsg: (msg: string, type?: 'success' | 'error') => void;
}

export function GenerateInvoicesView({
  lang,
  isProcessingBulk,
  bulkProgress,
  handleRunBulkInvoice,
  showToastMsg
}: GenerateInvoicesViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'ইনভয়েস বিলিং চক্র পরিচালনা' : 'Invoice Billing Engine'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'বাল্ক ইনভয়েস জেনারেট এবং ইনডিভিজুয়াল ছাত্র বিলিং টুলস।' : 'Trigger school-wide monthly billing run or issue individual invoice.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-2">{lang === 'bn' ? 'বাল্ক মাসিক বিলিং রান' : 'Bulk Monthly Billing Cycle'}</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">{lang === 'bn' ? 'প্রতি মাসে নির্দিষ্ট ক্লাসের সকল শিক্ষার্থীর জন্য মাসিক সেশন ও টিউশন ফি ইনভয়েস বাল্ক আকারে এক ক্লিকে জেনারেট করুন।' : 'Run the global billing cycle. System will crawl active rosters and auto-create due invoices for the selected target cycle.'}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'বিলিং মাস' : 'Billing Cycle Month'}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option>July 2026</option>
                  <option>August 2026</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'টার্গেট ক্লাস' : 'Target Roster'}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option>All Classes</option>
                  <option>Class 8</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            {isProcessingBulk ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                  <span>{lang === 'bn' ? 'ইনভয়েস জেনারেট হচ্ছে...' : 'Generating invoices...'}</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#004D40] h-full rounded-full transition-all duration-200" style={{ width: `${bulkProgress}%` }} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleRunBulkInvoice}
                className="w-full py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg transition-all font-semibold shadow-sm text-center flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Receipt className="h-4 w-4" />
                <span>{lang === 'bn' ? 'বাল্ক ইনভয়েস রান করুন' : 'Run Bulk Billing Cycle'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-xs font-bold text-slate-700">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'একক ছাত্র ইনভয়েস ইস্যু' : 'Issue Single Student Invoice'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'ছাত্র আইডি' : 'Student Mock ID'}</label>
              <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg">
                <option>2026101 - Farhan Ishrak</option>
                <option>2026102 - Nusrat Jahan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'ফি বিবরণ' : 'Description'}</label>
                <input type="text" placeholder="e.g. Sports Equipment Fee" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</label>
                <input type="number" placeholder="৳ 1500" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToastMsg(lang === 'bn' ? 'ইনভয়েস ইস্যু করা হয়েছে!' : 'Invoice successfully dispatched to student roster!')}
              className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-800 rounded-lg transition-all border border-slate-200/60 flex items-center justify-center gap-2 cursor-pointer mt-2 text-xs"
            >
              <Plus className="h-4 w-4 text-slate-600" />
              <span>{lang === 'bn' ? 'ইনভয়েস ইস্যু করুন' : 'Issue Custom Invoice'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. FEE STRUCTURE VIEW
// ==========================================
interface FeeStructureViewProps {
  lang: 'bn' | 'en';
  feeStructures: Array<{ classId: string; tuitionFee: number; examFee: number; sportsFee: number; sessionFee: number }>;
  setFeeStructures: React.Dispatch<React.SetStateAction<Array<{ classId: string; tuitionFee: number; examFee: number; sportsFee: number; sessionFee: number }>>>;
  editingFee: any | null;
  setEditingFee: (fee: any | null) => void;
  showToastMsg: (msg: string, type?: 'success' | 'error') => void;
}

export function FeeStructureView({
  lang,
  feeStructures,
  setFeeStructures,
  editingFee,
  setEditingFee,
  showToastMsg
}: FeeStructureViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'ক্লাস-ভিত্তিক ফি কাঠামো' : 'Fee Structure Configuration'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'প্রথম থেকে দশম শ্রেণী পর্যন্ত সকল প্রকার ফি পরিবর্তনের মূল প্যানেল।' : 'Manage tuition fees, exam fees, session and sports fee configurations.'}</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-3.5 px-4">{lang === 'bn' ? 'শ্রেণী' : 'Class Grade'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'পরীক্ষার ফি (টার্ম)' : 'Exam Term Fee'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'ল্যাব ও স্পোর্টস ফি' : 'Sports/Lab Fee'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'বাৎসরিক সেশন ফি' : 'Annual Session'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'bn' ? 'পদক্ষেপ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((fee, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{fee.classId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.tuitionFee.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.examFee.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.sportsFee.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.sessionFee.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setEditingFee(fee)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-[#004D40] border border-slate-200/60 rounded font-extrabold text-[11px] cursor-pointer"
                    >
                      {lang === 'bn' ? 'সম্পাদনা' : 'Edit Fee'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingFee && (
        <div className="fixed inset-0 bg-slate-900/45 z-[120] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">
                {lang === 'bn' ? `${editingFee.classId} ফি পরিবর্তন` : `Edit Fee for ${editingFee.classId}`}
              </h3>
              <button type="button" onClick={() => setEditingFee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'টিউশন ফি (৳)' : 'Tuition Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.tuitionFee}
                  onChange={(e) => setEditingFee({ ...editingFee, tuitionFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'পরীক্ষার ফি (৳)' : 'Exam Term Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.examFee}
                  onChange={(e) => setEditingFee({ ...editingFee, examFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'ল্যাব ও স্পোর্টস ফি (৳)' : 'Sports/Lab Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.sportsFee}
                  onChange={(e) => setEditingFee({ ...editingFee, sportsFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'বাৎসরিক সেশন ফি (৳)' : 'Session Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.sessionFee}
                  onChange={(e) => setEditingFee({ ...editingFee, sessionFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button 
                type="button"
                onClick={() => setEditingFee(null)} 
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setFeeStructures(prev => prev.map(f => f.classId === editingFee.classId ? editingFee : f));
                  setEditingFee(null);
                  showToastMsg(lang === 'bn' ? 'ফি কাঠামো সফলভাবে আপডেট হয়েছে!' : 'Fee structure saved successfully!');
                }} 
                className="px-4 py-1.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg font-bold"
              >
                {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. FEE DISCOUNTS VIEW
// ==========================================
interface FeeDiscountsViewProps {
  lang: 'bn' | 'en';
  feeDiscounts: Array<{ studentId: string; studentName: string; class: string; discountType: string; waiverPercentage: number; amountSaved: number }>;
  setFeeDiscounts: React.Dispatch<React.SetStateAction<Array<{ studentId: string; studentName: string; class: string; discountType: string; waiverPercentage: number; amountSaved: number }>>>;
  discountForm: { studentId: string; discountType: string; waiverPercentage: string };
  setDiscountForm: React.Dispatch<React.SetStateAction<{ studentId: string; discountType: string; waiverPercentage: string }>>;
  showToastMsg: (msg: string, type?: 'success' | 'error') => void;
}

export function FeeDiscountsView({
  lang,
  feeDiscounts,
  setFeeDiscounts,
  discountForm,
  setDiscountForm,
  showToastMsg
}: FeeDiscountsViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'বৃত্তি এবং ফি ডিসকাউন্ট' : 'Scholarships & Fee Discounts'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'মেধাবী ও বিশেষ সুবিধাভোগী শিক্ষার্থীদের কনসেশন ও বৃত্তি বরাদ্দ প্যানেল।' : 'Award waivers, merit-based scholarship discounts, or concession tiers.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-xs font-bold text-slate-700">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'ডিসকাউন্ট বা কনসেশন বরাদ্দ' : 'Waiver Assignment Form'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'শিক্ষার্থী' : 'Target Student'}</label>
              <select 
                value={discountForm.studentId}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
              >
                <option value="2026101">2026101 - Farhan Ishrak</option>
                <option value="2026102">2026102 - Nusrat Jahan</option>
                <option value="2026103">2026103 - Zayan Ahmed</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'বৃত্তির ধরণ' : 'Waiver Category'}</label>
              <select 
                value={discountForm.discountType}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, discountType: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
              >
                <option value="Merit Scholarship">{lang === 'bn' ? 'মেধাবৃত্তি' : 'Merit Scholarship (GPA 5.00)'}</option>
                <option value="Sibling Discount">{lang === 'bn' ? 'সহোদর ডিসকাউন্ট' : 'Sibling Discount'}</option>
                <option value="Special Concession">{lang === 'bn' ? 'বিশেষ কনসেশন' : 'Special Concession'}</option>
                <option value="Sportsperson Waiver">{lang === 'bn' ? 'ক্রীড়া কোটা ছাড়' : 'Sportsperson Waiver'}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'ছাড়ের হার (%)' : 'Waiver Ratio (%)'}</label>
              <input 
                type="number" 
                value={discountForm.waiverPercentage}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, waiverPercentage: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                placeholder="50"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const studLookup: Record<string, string> = { '2026101': 'Farhan Ishrak', '2026102': 'Nusrat Jahan', '2026103': 'Zayan Ahmed' };
                const name = studLookup[discountForm.studentId] || 'Selected Student';
                const wVal = Number(discountForm.waiverPercentage) || 0;
                const newDiscount = {
                  studentId: discountForm.studentId,
                  studentName: name,
                  class: 'Class 8A',
                  discountType: discountForm.discountType,
                  waiverPercentage: wVal,
                  amountSaved: Math.round((2000 * wVal) / 100)
                };
                setFeeDiscounts(prev => [newDiscount, ...prev]);
                showToastMsg(lang === 'bn' ? 'কনসেশন কোটা বরাদ্দ করা হয়েছে!' : 'Waiver successfully assigned!');
              }}
              className="w-full py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Check className="h-4 w-4" />
              <span>{lang === 'bn' ? 'বৃত্তির ছাড় কোটা অনুমোদন করুন' : 'Assign Waiver'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'সক্রিয় বৃত্তি ও ছাড়ের তালিকা' : 'Active Waiver Roster'}</h3>
          <div className="space-y-2.5">
            {feeDiscounts.map((fd, idx) => (
              <div key={idx} className="border border-slate-100 p-3 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{fd.studentName}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{fd.class} | ID: {fd.studentId} | <span className="text-[#004D40] font-bold">{fd.discountType}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold px-2.5 py-1 rounded-md block mb-1">
                    {fd.waiverPercentage}% OFF
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">{lang === 'bn' ? `মাসিক সাশ্রয়: ৳${fd.amountSaved}` : `Saves: ৳${fd.amountSaved}/mo`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. CONCESSION REPORT VIEW
// ==========================================
export function ConcessionReportView({
  lang,
  feeDiscounts
}: {
  lang: 'bn' | 'en';
  feeDiscounts: Array<{ studentId: string; studentName: string; class: string; discountType: string; waiverPercentage: number; amountSaved: number }>;
}) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'ফি ছাড় / কনসেশন বার্ষিক বিবরণী' : 'Concession Report'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'চলতি শিক্ষাবর্ষে বৃত্তিপ্রাপ্ত ও রেয়াত প্রাপ্ত ছাত্র-ছাত্রীদের বিবরণ।' : 'Audit log of waivers and scholarships granted in active rosters.'}</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-3 px-4">{lang === 'bn' ? 'ছাত্র আইডি' : 'ID'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'নাম' : 'Student Name'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'ক্লাস' : 'Roster Class'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'বৃত্তি ধরণ' : 'Concession Tactic'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'ছাড় শতাংশ' : 'Ratio'}</th>
                <th className="py-3 px-4 text-right">{lang === 'bn' ? 'সাশ্রয়কৃত পরিমাণ' : 'Amount Saved'}</th>
              </tr>
            </thead>
            <tbody>
              {feeDiscounts.map((fd, idx) => (
                <tr key={idx} className="border-b border-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">{fd.studentId}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{fd.studentName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{fd.class}</td>
                  <td className="py-3 px-4 text-indigo-700 font-semibold">{fd.discountType}</td>
                  <td className="py-3 px-4 font-black text-emerald-600">{fd.waiverPercentage}%</td>
                  <td className="py-3 px-4 text-right font-black text-slate-800">৳{fd.amountSaved.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. FEES REPORTS VIEW
// ==========================================
export function FeesReportsView({ lang }: { lang: 'bn' | 'en' }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'আদায়কৃত ফি রিপোর্ট এবং চার্ট' : 'Fee Collection Reports'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'শ্রেণী ভিত্তিক আদায়কৃত ও বকেয়া ফি-র বিস্তারিত চার্ট।' : 'Analytics of total fee collections vs pending roster defaults.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'আদায় অর্জিত শতাংশ' : 'Collection Target Ratios'}</h3>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#004D40" strokeWidth="10" strokeDasharray="238.76" strokeDashoffset="45" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#004D40]">81%</span>
              <span className="text-[10px] text-slate-400 font-bold">{lang === 'bn' ? 'আদায় রেশিও' : 'Cleared'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'শ্রেণীভিত্তিক পেমেন্ট সম্পন্ন' : 'Roster Completion status'}</h3>
          <div className="space-y-3.5">
            {[
              { class: 'Class 10', completed: 92 },
              { class: 'Class 9', completed: 85 },
              { class: 'Class 8', completed: 81 },
              { class: 'Class 7', completed: 78 },
              { class: 'Class 6', completed: 74 },
            ].map((cl, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-center font-bold text-slate-650 mb-1">
                  <span>{cl.class}</span>
                  <span className="font-extrabold text-slate-800">{cl.completed}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#004D40] h-full rounded-full" style={{ width: `${cl.completed}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. PROFILE VIEW
// ==========================================
export function ProfileView({ lang }: { lang: 'bn' | 'en' }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'হিসাবরক্ষক প্রোফাইল' : 'Accountant User Profile'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'সিস্টেম অ্যাক্সেস লেভেল এবং ইউজার ক্রিডেনশিয়াল।' : 'Finance Officer workspace configuration.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-[#004D40] text-emerald-105 flex items-center justify-center font-black text-2xl uppercase shadow-md mb-3 border-2 border-emerald-500">
            KH
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Md. Kamrul Hasan</h3>
          <p className="text-xs text-slate-400 font-bold mt-0.5">Senior Financial Controller</p>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full font-bold uppercase mt-3">
            Level 3 Administrator
          </span>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-xs font-bold text-slate-700 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-2">{lang === 'bn' ? 'প্রোফাইল বিবরণী' : 'Credentials & Configuration'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Official Email'}</p>
              <p className="text-slate-800 font-extrabold text-xs">k.hasan@studentscare.edu.bd</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'যোগাযোগ নম্বর' : 'Primary Contact'}</p>
              <p className="text-slate-800 font-extrabold text-xs">+880 1712-345678</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'অ্যাক্সেস কোড' : 'Auth Terminal ID'}</p>
              <p className="text-slate-800 font-mono text-[11px]">SCMS-TERM-801</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'অডিটেবেল ভূমিকা' : 'Roster Signatory'}</p>
              <p className="text-slate-800 font-extrabold text-xs">Principal + Accountant Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
