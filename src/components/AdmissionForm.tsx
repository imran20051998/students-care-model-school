/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  Upload, 
  X, 
  User, 
  MapPin, 
  PlusCircle, 
  Info, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Camera, 
  GraduationCap, 
  Trash2, 
  RotateCcw, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdmissionFormProps {
  lang: 'bn' | 'en';
  onBack?: () => void;
}

export default function AdmissionForm({ lang, onBack }: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    gender: 'Male',
    
    presentDivision: '',
    presentDistrict: '',
    presentFullAddress: '',
    
    permanentDivision: '',
    permanentDistrict: '',
    permanentFullAddress: '',
    sameAsPresent: false,
    
    religion: '',
    nationality: 'Bangladeshi',
    phone: '',
    email: '',
    nidBirthReg: '',
    bloodGroup: '',
    guardianOccupation: '',
    maritalStatus: 'Single',
    selectedClass: '',
    
    declarationAgreed: false,
    signatureType: 'type' as 'type' | 'draw',
    signatureText: '',
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState('');

  // Signature drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [signatureDrawn, setSignatureDrawn] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const divisions = [
    { bn: 'বরিশাল', en: 'Barishal' },
    { bn: 'চট্টগ্রাম', en: 'Chattogram' },
    { bn: 'ঢাকা', en: 'Dhaka' },
    { bn: 'খুলনা', en: 'Khulna' },
    { bn: 'ময়মনসিংহ', en: 'Mymensingh' },
    { bn: 'রাজশাহী', en: 'Rajshahi' },
    { bn: 'রংপুর', en: 'Rangpur' },
    { bn: 'সিলেট', en: 'Sylhet' }
  ];

  const districtsByDivision: Record<string, string[]> = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Manikganj', 'Munshiganj', 'Narsingdi'],
    'Chattogram': ['Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Brahmanbaria', 'Chandpur', 'Noakhali', 'Rangamati', 'Khagrachhari', 'Bandarban'],
    'Barishal': ['Barishal', 'Bhola', 'Patuakhali', 'Barguna', 'Jhalokati', 'Pirojpur'],
    'Khulna': ['Khulna', 'Jashore', 'Satkhira', 'Bagerhat', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Chuadanga', 'Jhenaidah'],
    'Rajshahi': ['Rajshahi', 'Bogura', 'Pabna', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Sirajganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Mymensingh': ['Mymensingh', 'Netrokona', 'Sherpur', 'Jamalpur']
  };

  const classes = [
    'Play', 'Nursery', 'KG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'
  ];

  const religions = [
    { bn: 'ইসলাম', en: 'Islam' },
    { bn: 'হিন্দুধর্ম', en: 'Hinduism' },
    { bn: 'বৌদ্ধধর্ম', en: 'Buddhism' },
    { bn: 'খ্রিস্টধর্ম', en: 'Christianity' },
    { bn: 'অন্যান্য', en: 'Other' }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle present address fields synchronization to permanent address
  useEffect(() => {
    if (formData.sameAsPresent) {
      setFormData(prev => ({
        ...prev,
        permanentDivision: prev.presentDivision,
        permanentDistrict: prev.presentDistrict,
        permanentFullAddress: prev.presentFullAddress
      }));
    }
  }, [formData.sameAsPresent, formData.presentDivision, formData.presentDistrict, formData.presentFullAddress]);

  // Handle canvas drawing setup
  useEffect(() => {
    if (formData.signatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#025644';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [formData.signatureType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    ctx.beginPath();
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.moveTo(x, y);
    setSignatureDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    e.preventDefault();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDrawn(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = lang === 'bn' ? "শিক্ষার্থীর নাম আবশ্যক" : "Student's Name is required";
    }
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = lang === 'bn' ? "পিতার নাম আবশ্যক" : "Father's Name is required";
    }
    if (!formData.motherName.trim()) {
      newErrors.motherName = lang === 'bn' ? "মাতার নাম আবশ্যক" : "Mother's Name is required";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = lang === 'bn' ? "জন্ম তারিখ আবশ্যক" : "Date of Birth is required";
    }
    if (!formData.presentDivision) {
      newErrors.presentDivision = lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Please select present division";
    }
    if (!formData.presentDistrict) {
      newErrors.presentDistrict = lang === 'bn' ? "জেলা নির্বাচন করুন" : "Please select present district";
    }
    if (!formData.presentFullAddress.trim()) {
      newErrors.presentFullAddress = lang === 'bn' ? "বর্তমান ঠিকানা আবশ্যক" : "Present address details are required";
    }

    if (!formData.sameAsPresent) {
      if (!formData.permanentDivision) {
        newErrors.permanentDivision = lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Please select permanent division";
      }
      if (!formData.permanentDistrict) {
        newErrors.permanentDistrict = lang === 'bn' ? "জেলা নির্বাচন করুন" : "Please select permanent district";
      }
      if (!formData.permanentFullAddress.trim()) {
        newErrors.permanentFullAddress = lang === 'bn' ? "স্থায়ী ঠিকানা আবশ্যক" : "Permanent address details are required";
      }
    }

    if (!formData.religion) {
      newErrors.religion = lang === 'bn' ? "ধর্ম নির্বাচন করুন" : "Please select religion";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = lang === 'bn' ? "মোবাইল নম্বর আবশ্যক" : "Phone number is required";
    } else if (!/^(?:\+88)?01[3-9]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = lang === 'bn' ? "সঠিক বাংলাদেশী মোবাইল নম্বর দিন" : "Provide a valid Bangladeshi mobile number";
    }
    if (!formData.selectedClass) {
      newErrors.selectedClass = lang === 'bn' ? "ভর্তির শ্রেণী নির্বাচন করুন" : "Please select class to apply for";
    }
    if (!formData.declarationAgreed) {
      newErrors.declarationAgreed = lang === 'bn' ? "ঘোষণাপত্রে অবশ্যই সম্মতি দিতে হবে" : "You must agree to the declaration";
    }

    if (formData.signatureType === 'type' && !formData.signatureText.trim()) {
      newErrors.signatureText = lang === 'bn' ? "স্বাক্ষর টাইপ করুন" : "Please type your full name as signature";
    }
    if (formData.signatureType === 'draw' && !signatureDrawn) {
      newErrors.signatureText = lang === 'bn' ? "স্বাক্ষর আঁকুন" : "Please draw your signature";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const randomId = `SCMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedAppId(randomId);

      // Create FormData to send to php backend
      const fd = new FormData();
      fd.append('roll', `ADM-${randomId.split('-').pop()}`);
      fd.append('name', formData.studentName);
      fd.append('class', formData.selectedClass || 'N/A');
      fd.append('section', 'A'); // Default for new admission
      fd.append('guardian', formData.fatherName || formData.motherName || 'N/A');
      fd.append('phone', formData.phone);
      if (photoFile) {
        fd.append('photo', photoFile);
      }

      fetch('/insert.php', {
        method: 'POST',
        body: fd
      })
      .then(res => {
        if (!res.ok) {
          console.warn('Admission insert.php returned non-OK status');
        }
        return res.json().catch(() => ({}));
      })
      .then(data => {
        console.log('Admission inserted successfully via backend API:', data);
      })
      .catch(err => {
        console.error('Admission insert.php error:', err);
      });

      // Integrate with local storage to sync with Admin Panel pending admissions
      const local = localStorage.getItem('school_pending_admissions');
      let currentList = [];
      if (local) {
        try {
          currentList = JSON.parse(local);
        } catch (e) {}
      } else {
        currentList = [
          { id: '1', studentName: 'Fahim Shakir', guardianName: 'Md. Shakirul Islam', requestedClass: 'Class 9', previousGPA: '5.00', status: 'pending' },
          { id: '2', studentName: 'Nusrat Zaman', guardianName: 'Md. Zaman Akhter', requestedClass: 'Class 6', previousGPA: '4.85', status: 'pending' },
          { id: '3', studentName: 'Zubayer Al Mahmud', guardianName: 'Dr. Mahmudul Hasan', requestedClass: 'Class 11', previousGPA: '5.00', status: 'pending' }
        ];
      }

      const newAdmission = {
        id: randomId,
        studentName: formData.studentName,
        guardianName: formData.fatherName || formData.motherName || 'N/A',
        requestedClass: formData.selectedClass,
        previousGPA: 'N/A',
        status: 'pending'
      };

      currentList.push(newAdmission);
      localStorage.setItem('school_pending_admissions', JSON.stringify(currentList));

      setSubmissionSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setFormData({
      studentName: '',
      fatherName: '',
      motherName: '',
      birthDate: '',
      gender: 'Male',
      presentDivision: '',
      presentDistrict: '',
      presentFullAddress: '',
      permanentDivision: '',
      permanentDistrict: '',
      permanentFullAddress: '',
      sameAsPresent: false,
      religion: '',
      nationality: 'Bangladeshi',
      phone: '',
      email: '',
      nidBirthReg: '',
      bloodGroup: '',
      guardianOccupation: '',
      maritalStatus: 'Single',
      selectedClass: '',
      declarationAgreed: false,
      signatureType: 'type',
      signatureText: '',
    });
    setPhoto(null);
    setPhotoFile(null);
    setPhotoName('');
    setSignatureDrawn(false);
    setErrors({});
    setSubmissionSuccess(false);
  };

  return (
    <div className="bg-[#f0f9f8] min-h-screen pb-16 flex flex-col items-center">
      
      {/* Back to Home Button Row */}
      <div className="w-full max-w-5xl px-4 sm:px-6 pt-6 flex justify-start">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#004d40] hover:text-[#025644] font-bold text-sm bg-white/80 hover:bg-white border border-emerald-100/60 px-4 py-2 rounded-full transition-all shadow-3xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'bn' ? "মূল পাতায় ফিরুন" : "Back to home"}
          </button>
        )}
      </div>

      {/* Hero Banner Header exactly like screenshot */}
      <div className="w-full max-w-5xl px-4 sm:px-6 mt-6">
        <div className="bg-[#025644] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm">
          <div className="h-16 w-16 bg-white/10 text-white rounded-2xl flex items-center justify-center shadow-inner shrink-0">
            <GraduationCap className="h-10 w-10 text-[#d0f3eb]" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase text-[#d0f3eb] bg-white/10 px-3 py-1 rounded-full border border-white/5">
              {lang === 'bn' ? "অনলাইন ভর্তি" : "ONLINE ADMISSION"}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
              Students Care Model School
            </h1>
            <p className="text-xs sm:text-sm text-[#d0f3eb]/95 font-medium leading-relaxed">
              {lang === 'bn' 
                ? "শিক্ষাবর্ষ ২০২৫–২৬ • তারকা চিহ্নিত (*) সকল ঘর পূরণ করা বাধ্যতামূলক" 
                : "Academic Year 2025–26 • All fields marked are required"}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 sm:px-6 mt-8">
        {!submissionSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Card 1: Application Form intro & Photo upload */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 text-left max-w-xl">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  {lang === 'bn' ? "ভর্তি আবেদন ফরম" : "Application Form"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                  {lang === 'bn' 
                    ? "অনগ্রহ করে ফরমটি সতর্কতার সাথে সম্পূর্ণ করুন। সফলভাবে জমাদানের পর ট্র্যাকিংয়ের জন্য একটি ট্র্যাকিং আবেদন আইডি পাবেন।" 
                    : "Please complete all sections carefully. Once submitted, you will receive an application ID for tracking."}
                </p>
              </div>

              {/* Passport photo upload placeholder container */}
              <div id="field-photo" className="flex flex-col items-center gap-2 shrink-0 self-center md:self-auto">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {photo ? (
                  <div className="relative h-28 w-24 rounded-xl border border-gray-200 overflow-hidden shadow-3xs group bg-gray-50">
                    <img src={photo} alt="Student passport" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoName('');
                      }}
                      className="absolute top-1 right-1 h-6 w-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-3xs"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-28 w-24 border-2 border-dashed border-teal-200 bg-[#f4faf8] hover:bg-[#eaf6f3] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all shadow-3xs hover:border-emerald-400 group"
                  >
                    <Upload className="h-5 w-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-teal-800 leading-tight">
                      {lang === 'bn' ? "পাসপোর্ট ছবি আপলোড" : "Passport size photo"}
                    </span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 bg-[#f0f9f8] hover:bg-[#e2f5f1] text-[#025644] text-xs font-extrabold rounded-full border border-emerald-100 transition-colors cursor-pointer"
                >
                  {photo ? (lang === 'bn' ? "পরিবর্তন করুন" : "Change") : (lang === 'bn' ? "আপলোড করুন" : "Upload")}
                </button>
              </div>
            </div>

            {/* Card 2: Student & Family Information */}
            <div id="field-studentName" className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "শিক্ষার্থী ও পারিবারিক বিবরণ" : "Student & Family Information"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === 'bn' ? "আবেদনকারী এবং পিতামাতার মৌলিক তথ্যাদি" : "Basic details of the applicant and parents"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Student's Name */}
                <div id="field-studentName" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "শিক্ষার্থীর নাম" : "Student's Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "সার্টিফিকেট অনুযায়ী পূর্ণ নাম" : "Full name as per certificate"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.studentName ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.studentName && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.studentName}
                    </p>
                  )}
                </div>

                {/* Father's Name */}
                <div id="field-fatherName" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পিতার নাম" : "Father's Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "পিতার পূর্ণ নাম" : "Father's Name"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.fatherName ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.fatherName && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.fatherName}
                    </p>
                  )}
                </div>

                {/* Mother's Name */}
                <div id="field-motherName" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "মাতার নাম" : "Mother's Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "মাতার পূর্ণ নাম" : "Mother's Name"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.motherName ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.motherName && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.motherName}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div id="field-birthDate" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জন্ম তারিখ" : "Date of Birth"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.birthDate ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.birthDate}
                    </p>
                  )}
                </div>

                {/* Gender Radio buttons */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {lang === 'bn' ? "লিঙ্গ" : "Gender"}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['Male', 'Female', 'Other'].map((g) => {
                      const isSel = formData.gender === g;
                      const displayLabel = lang === 'bn' ? (g === 'Male' ? 'পুরুষ' : g === 'Female' ? 'মহিলা' : 'অন্যান্য') : g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#e2f5f1] border-[#025644]/30 text-[#025644] font-extrabold shadow-3xs'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSel ? 'border-[#025644] bg-[#025644] text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isSel && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                          </div>
                          <span>{displayLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Card 3: Present Address */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "বর্তমান ঠিকানা" : "Present Address"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Division dropdown */}
                <div id="field-presentDivision" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "বিভাগ" : "Division"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="presentDivision"
                    value={formData.presentDivision}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.presentDivision ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Select division"}</option>
                    {divisions.map(d => (
                      <option key={d.en} value={d.en}>{lang === 'bn' ? d.bn : d.en}</option>
                    ))}
                  </select>
                  {errors.presentDivision && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.presentDivision}
                    </p>
                  )}
                </div>

                {/* District dropdown */}
                <div id="field-presentDistrict" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জেলা" : "District"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="presentDistrict"
                    value={formData.presentDistrict}
                    onChange={handleInputChange}
                    disabled={!formData.presentDivision}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.presentDistrict ? 'border-red-300' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  >
                    {!formData.presentDivision ? (
                      <option value="">{lang === 'bn' ? "প্রথমে বিভাগ নির্বাচন করুন" : "Select division first"}</option>
                    ) : (
                      <>
                        <option value="">{lang === 'bn' ? "জেলা নির্বাচন করুন" : "Select district"}</option>
                        {districtsByDivision[formData.presentDivision]?.map(dst => (
                          <option key={dst} value={dst}>{dst}</option>
                        )) || <option value="">No districts loaded</option>}
                      </>
                    )}
                  </select>
                  {errors.presentDistrict && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.presentDistrict}
                    </p>
                  )}
                </div>

                {/* Full Present Address */}
                <div id="field-presentFullAddress" className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পূর্ণ ঠিকানা" : "Full Address"} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="presentFullAddress"
                    rows={3}
                    value={formData.presentFullAddress}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "বাসা নম্বর, সড়ক নম্বর, গ্রাম, ডাকঘর ইত্যাদি" : "House, road, area, post office"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.presentFullAddress ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.presentFullAddress && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.presentFullAddress}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Card 4: Permanent Address */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "স্থায়ী ঠিকানা" : "Permanent Address"}
                </h3>
                
                {/* Same as present address checkbox exactly like screenshot */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#004d40] font-extrabold">
                  <input
                    type="checkbox"
                    name="sameAsPresent"
                    checked={formData.sameAsPresent}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                    formData.sameAsPresent ? 'bg-[#025644] border-[#025644] text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {formData.sameAsPresent && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span>{lang === 'bn' ? "বর্তমান ঠিকানার মতো" : "Same as Present Address"}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Division dropdown */}
                <div id="field-permanentDivision" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "বিভাগ" : "Division"} {!formData.sameAsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="permanentDivision"
                    value={formData.permanentDivision}
                    onChange={handleInputChange}
                    disabled={formData.sameAsPresent}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.permanentDivision ? 'border-red-300' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  >
                    <option value="">{lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Select division"}</option>
                    {divisions.map(d => (
                      <option key={d.en} value={d.en}>{lang === 'bn' ? d.bn : d.en}</option>
                    ))}
                  </select>
                  {!formData.sameAsPresent && errors.permanentDivision && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.permanentDivision}
                    </p>
                  )}
                </div>

                {/* District dropdown */}
                <div id="field-permanentDistrict" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জেলা" : "District"} {!formData.sameAsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="permanentDistrict"
                    value={formData.permanentDistrict}
                    onChange={handleInputChange}
                    disabled={formData.sameAsPresent || !formData.permanentDivision}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.permanentDistrict ? 'border-red-300' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  >
                    {!formData.permanentDivision ? (
                      <option value="">{lang === 'bn' ? "প্রথমে বিভাগ নির্বাচন করুন" : "Select division first"}</option>
                    ) : (
                      <>
                        <option value="">{lang === 'bn' ? "জেলা নির্বাচন করুন" : "Select district"}</option>
                        {districtsByDivision[formData.permanentDivision]?.map(dst => (
                          <option key={dst} value={dst}>{dst}</option>
                        )) || <option value="">No districts loaded</option>}
                      </>
                    )}
                  </select>
                  {!formData.sameAsPresent && errors.permanentDistrict && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.permanentDistrict}
                    </p>
                  )}
                </div>

                {/* Full Permanent Address */}
                <div id="field-permanentFullAddress" className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পূর্ণ ঠিকানা" : "Full Address"} {!formData.sameAsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    name="permanentFullAddress"
                    rows={3}
                    value={formData.permanentFullAddress}
                    onChange={handleInputChange}
                    disabled={formData.sameAsPresent}
                    placeholder={lang === 'bn' ? "বাসা নম্বর, সড়ক নম্বর, গ্রাম, ডাকঘর ইত্যাদি" : "House, road, area, post office"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.permanentFullAddress ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  />
                  {!formData.sameAsPresent && errors.permanentFullAddress && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.permanentFullAddress}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Card 5: Additional Details */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "অতিরিক্ত তথ্য ও বিবরণ" : "Additional Details"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === 'bn' ? "যোগাযোগ, জাতীয়তা, ধর্ম এবং পছন্দের শ্রেণী সংক্রান্ত তথ্য" : "Contact, identification and class preference"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                
                {/* Religion dropdown */}
                <div id="field-religion" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "ধর্ম" : "Religion"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.religion ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? "ধর্ম নির্বাচন করুন" : "Select religion"}</option>
                    {religions.map(r => (
                      <option key={r.en} value={r.en}>{lang === 'bn' ? r.bn : r.en}</option>
                    ))}
                  </select>
                  {errors.religion && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.religion}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জাতীয়তা" : "Nationality"}
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangladeshi"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div id="field-phone" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "মোবাইল নম্বর" : "Phone Number"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 01814913049"
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.phone ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "ইমেইল ঠিকানা" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* NID or Birth Registration */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং" : "National ID / Birth Reg."}
                  </label>
                  <input
                    type="text"
                    name="nidBirthReg"
                    value={formData.nidBirthReg}
                    onChange={handleInputChange}
                    placeholder="NID or Birth Registration number"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Blood Group dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "রক্তের গ্রুপ" : "Blood Group"}
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  >
                    <option value="">{lang === 'bn' ? "রক্তের গ্রুপ নির্বাচন করুন" : "Select blood group"}</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Guardian Occupation */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পেশা (অভিভাবক)" : "Occupation (Guardian)"}
                  </label>
                  <input
                    type="text"
                    name="guardianOccupation"
                    value={formData.guardianOccupation}
                    onChange={handleInputChange}
                    placeholder="Guardian's occupation"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Marital Status (Single / Married) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {lang === 'bn' ? "বৈবাহিক অবস্থা" : "Marital Status"}
                  </label>
                  <div className="flex gap-2">
                    {['Single', 'Married'].map((ms) => {
                      const isSel = formData.maritalStatus === ms;
                      const label = lang === 'bn' ? (ms === 'Single' ? 'অবিবাহিত' : 'বিবাহিত') : ms;
                      return (
                        <button
                          key={ms}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, maritalStatus: ms }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSel
                              ? 'bg-[#e2f5f1] border-[#025644]/30 text-[#025644] font-extrabold shadow-3xs'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course / Class preference */}
                <div id="field-selectedClass" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "আবেদিত শ্রেণী" : "Course / Class"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectedClass"
                    value={formData.selectedClass}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.selectedClass ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? "আবেদনের জন্য শ্রেণী নির্বাচন করুন" : "Select class to apply for"}</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {errors.selectedClass && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.selectedClass}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Card 6: Declaration & Signature */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "অঙ্গীকারনামা ও স্বাক্ষর" : "Declaration & Signature"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === 'bn' ? "জমা দেওয়ার পূর্বে অঙ্গীকারনামাটি সতর্কতার সাথে পড়ুন" : "Read carefully before submitting"}
                </p>
              </div>

              {/* Declaration Statement Box */}
              <div className="bg-[#f0f9f8]/60 border border-emerald-100/60 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                {lang === 'bn' 
                  ? "আমি এতদ্বারা সজ্ঞানে ঘোষণা করছি যে উপরে প্রদত্ত সমস্ত বিবরণী সম্পূর্ণ সত্য ও আমার জ্ঞানমতে নির্ভুল। আমি স্কুলের সকল প্রচলিত বিধি-বিধান ও নিয়মাবলী শৃঙ্খলা মেনে চলব এবং যেকোনো একাডেমিক ও ভর্তি সংক্রান্ত বিষয়ে স্কুল কর্তৃপক্ষের চূড়ান্ত সিদ্ধান্ত সানন্দে মেনে নিতে বাধ্য থাকব।" 
                  : "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I will obey all the rules and regulations of the institution, maintain discipline, and accept the decisions of the school authority regarding admission and academic matters."}
              </div>

              {/* Declaration Checkbox */}
              <div id="field-declarationAgreed" className="space-y-1.5 pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none text-xs sm:text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    name="declarationAgreed"
                    checked={formData.declarationAgreed}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    formData.declarationAgreed ? 'bg-[#025644] border-[#025644] text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {formData.declarationAgreed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="leading-tight">
                    {lang === 'bn' 
                      ? "আমি ঘোষণাটি মনোযোগ দিয়ে পড়েছি এবং এতে সম্পূর্ণ সম্মত আছি।" 
                      : "I have read and agree to the declaration above."}
                  </span>
                </label>
                {errors.declarationAgreed && (
                  <p className="text-red-600 text-[10px] font-bold flex items-center gap-1 pl-8">
                    <AlertCircle className="h-3 w-3" /> {errors.declarationAgreed}
                  </p>
                )}
              </div>

              {/* Signature block with Draw/Type toggles */}
              <div id="field-signatureText" className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "শিক্ষার্থীর স্বাক্ষর" : "Student's Signature"} <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Signature type selector */}
                  <div className="flex bg-gray-100/60 p-1 rounded-xl border border-gray-200/50">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, signatureType: 'type' }))}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        formData.signatureType === 'type'
                          ? 'bg-white text-[#025644] shadow-3xs font-extrabold'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang === 'bn' ? "টাইপ করুন" : "Type"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, signatureType: 'draw' }))}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        formData.signatureType === 'draw'
                          ? 'bg-white text-[#025644] shadow-3xs font-extrabold'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang === 'bn' ? "অঙ্কন করুন" : "Draw"}
                    </button>
                  </div>
                </div>

                {/* Conditional Signature Inputs */}
                {formData.signatureType === 'type' ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      name="signatureText"
                      value={formData.signatureText}
                      onChange={handleInputChange}
                      placeholder={lang === 'bn' ? "স্বাক্ষর হিসেবে আপনার পূর্ণ নাম টাইপ করুন" : "Type your full name as signature"}
                      className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                        errors.signatureText ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                      }`}
                    />
                    
                    {/* Live Signature Font Preview */}
                    {formData.signatureText.trim() && (
                      <div className="pt-2 text-left">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'bn' ? "স্বাক্ষরের নমুনা প্রিভিউ:" : "Signature Preview:"}</p>
                        <p className="font-serif italic text-2xl sm:text-3xl text-emerald-800 tracking-wide mt-1 select-none border-b border-dashed border-emerald-100 pb-2 w-max max-w-full">
                          {formData.signatureText}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden shadow-inner h-32 w-full max-w-md">
                      <canvas
                        ref={canvasRef}
                        width={448}
                        height={128}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full cursor-crosshair touch-none"
                      />
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="absolute bottom-2 right-2 p-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-lg shadow-3xs transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
                        title="Clear Signature"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-red-500" />
                        {lang === 'bn' ? "মুছে ফেলুন" : "Clear"}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {lang === 'bn' ? "মাউস দিয়ে অথবা মোবাইল স্ক্রিনে স্পর্শ করে আপনার স্বাক্ষর আঁকুন।" : "Use your mouse or touchscreen to draw your signature in the box."}
                    </p>
                  </div>
                )}

                {errors.signatureText && (
                  <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.signatureText}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-extrabold text-xs sm:text-sm rounded-2xl shadow-3xs transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {lang === 'bn' ? "রিসেট করুন" : "Reset"}
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-[#025644] hover:bg-[#013f32] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {lang === 'bn' ? "আবেদন জমা দিন" : "Submit Application"}
              </button>
            </div>

          </form>
        ) : (
          
          /* ======================================================= */
          /* SUCCESS STATE - HIGH FIDELITY ADMISSION RECEIPT         */
          /* ======================================================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 text-center shadow-md max-w-2xl mx-auto space-y-6"
          >
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-3xs">
              <CheckCircle className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                {lang === 'bn' ? "ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!" : "Application Submitted Successfully!"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                {lang === 'bn' 
                  ? "স্টুডেন্টস কেয়ার মডেল স্কুলে আবেদন করার জন্য ধন্যবাদ। আপনার সাময়িক নিবন্ধন সম্পন্ন হয়েছে এবং তথ্যগুলো ডাটাবেজে সংরক্ষণ করা হয়েছে।" 
                  : "Thank you for choosing Students Care Model School. Your temporary registration has been verified and logged in our databases."}
              </p>
            </div>

            {/* Simulated Receipt Slip Card */}
            <div className="bg-[#f0f9f8]/40 border border-emerald-100/60 rounded-3xl p-5 sm:p-6 text-left space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dashed border-emerald-100 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">{lang === 'bn' ? "আবেদন আইডি নম্বর" : "Application ID"}</span>
                  <p className="text-lg font-black text-[#025644] font-mono leading-none mt-1">{generatedAppId}</p>
                </div>
                {photo && (
                  <div className="h-14 w-12 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-3xs shrink-0 self-start sm:self-auto">
                    <img src={photo} alt="Receipt preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400 font-bold">{lang === 'bn' ? "শিক্ষার্থীর নাম:" : "Student Name:"}</span>
                  <p className="font-extrabold text-gray-800 mt-0.5">{formData.studentName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold">{lang === 'bn' ? "আবেদিত শ্রেণী:" : "Applied Class:"}</span>
                  <p className="font-extrabold text-emerald-800 mt-0.5">{formData.selectedClass}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold">{lang === 'bn' ? "অভিভাবকের নাম:" : "Guardian Name:"}</span>
                  <p className="font-extrabold text-gray-800 mt-0.5">{formData.fatherName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold">{lang === 'bn' ? "মোবাইল নম্বর:" : "Contact Mobile:"}</span>
                  <p className="font-extrabold text-gray-800 mt-0.5 font-mono">{formData.phone}</p>
                </div>
              </div>

              {/* Admissions Schedule Banner Box */}
              <div className="border border-[#025644]/20 bg-[#025644]/5 p-3.5 rounded-2xl border-dashed text-center">
                <span className="text-[10px] font-extrabold text-[#025644] uppercase tracking-wider block mb-1">
                  {lang === 'bn' ? "ভর্তি পরীক্ষার সাময়িক সময়সূচী" : "Admission Evaluation Schedule"}
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                  {lang === 'bn' ? "শনিবার, ২৫শে জুলাই, ২০২৬ @ সকাল ১০:০০ টা" : "Saturday, July 25th, 2026 @ 10:00 AM"}
                </p>
                <span className="text-[10px] text-gray-500 font-medium block mt-1">
                  {lang === 'bn' ? "স্থান: স্টুডেন্টস কেয়ার প্রধান ক্যাম্পাস অডিটোরিয়াম" : "Venue: Students Care Main Campus Auditorium"}
                </span>
              </div>
            </div>

            {/* Instruction Checklist of Documents */}
            <div className="text-left space-y-2.5 p-1 border border-gray-100 rounded-2xl bg-gray-50/50 p-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <Info className="h-4 w-4 text-emerald-600" />
                {lang === 'bn' ? "পরীক্ষার দিন প্রয়োজনীয় কাগজপত্রাদি (মূল কপি সঙ্গে আনবেন)" : "Required Documents (on Exam Day)"}
              </h4>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5 font-semibold">
                {lang === 'bn' ? (
                  <>
                    <li>শিক্ষার্থীর সাম্প্রতিক ৩ কপি পাসপোর্ট সাইজের রঙিন ছবি।</li>
                    <li>অনলাইন জন্ম নিবন্ধন সনদের সত্যায়িত ফটোকপি।</li>
                    <li>পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র (TC) ও আসল প্রগতি পত্র (রিপোর্ট কার্ড)।</li>
                    <li>এই অনলাইন আবেদন পত্রের প্রিন্ট কপি।</li>
                  </>
                ) : (
                  <>
                    <li>3 Copies of Passport-sized photograph of the candidate.</li>
                    <li>Attested photocopy of candidate's Birth Registration Certificate.</li>
                    <li>Transfer Certificate (TC) & original report card from the previous institution.</li>
                    <li>Printout of this online application receipt page.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Receipt Screen Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'bn' ? "রশিদ প্রিন্ট করুন" : "Print Receipt"}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#025644] hover:bg-[#013f32] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'bn' ? "আরেকটি আবেদন করুন" : "Apply for Another Student"}
              </button>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
