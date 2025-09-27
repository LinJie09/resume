"use client";
import { useState, useCallback, useEffect } from "react";

// 定義用戶資料類型
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  jobTitle: string;
  company: string;
  // joinDate: string;
  avatar: string | null;
  website?: string;
  github?: string;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface StateCardProps {
  value: string | number;
  label: string;
  color: "blue" | "green" | "purple" | "orange";
}

// 輸入框組件
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">{icon}</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 
          placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed
          ${icon ? "pl-10" : ""}
        `}
      />
    </div>
  </div>
);

// 統計卡片組件
const StatCard: React.FC<StateCardProps> = ({ value, label, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${colorClasses[color]}`}>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default function ModernProfilePage() {
  // 初始用戶資料
  const defaultProfile: UserProfile = {
    name: "莊霖杰",
    email: "zxc664231@gmail.com",
    phone: "+886 916 531 881",
    location: "高雄市, 台灣",
    bio: "熱愛技術的全端開發者，專精於 React、Next.js 和 Node.js。喜歡分享知識，持續學習最新技術趨勢。",
    jobTitle: "軟體工程師",
    company: "無",
    // joinDate: "2023年3月",
    avatar: null,
    github: "https://github.com/LinJie09",
  };

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [tempProfile, setTempProfile] = useState<UserProfile>(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 從 localStorage 載入資料
  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const data = JSON.parse(stored);
      setProfile(data);
      setTempProfile(data);
    }
    setHydrated(true);
  }, []);

  // 處理輸入變更
  const handleFieldChange = useCallback(
    (field: keyof UserProfile) => (value: string) => {
      setTempProfile((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 處理頭像上傳
  const handleAvatarUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setTempProfile((prev) => ({ ...prev, avatar: result }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const enterEditMode = useCallback(() => {
    setTempProfile(profile);
    setEditMode(true);
  }, [profile]);

  const saveChanges = useCallback(() => {
    setProfile(tempProfile);
    localStorage.setItem("userProfile", JSON.stringify(tempProfile));
    setEditMode(false);
  }, [tempProfile]);

  const cancelEdit = useCallback(() => {
    setTempProfile(profile);
    setEditMode(false);
  }, [profile]);

  const currentData = editMode ? tempProfile : profile;

  if (!hydrated) {
    return <p className="text-center py-20 text-gray-400">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-xl">←</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">個人檔案</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                設定
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* 主內容 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左側 - 基本信息卡片 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 頭像 & 基本資料 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border-4 border-white/30">
                    {currentData.avatar ? (
                      <img src={currentData.avatar} alt="頭像" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <span className="text-3xl">👨‍💻</span>
                      </div>
                    )}
                  </div>
                  {editMode && (
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <span className="text-sm">📷</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="mt-4 text-white">
                  {editMode ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={currentData.name}
                        onChange={(e) => handleFieldChange("name")(e.target.value)}
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-center text-xl font-bold text-white placeholder-white/70 backdrop-blur-sm"
                        placeholder="您的姓名"
                      />
                      <input
                        type="text"
                        value={currentData.jobTitle}
                        onChange={(e) => handleFieldChange("jobTitle")(e.target.value)}
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-center text-white placeholder-white/70 backdrop-blur-sm"
                        placeholder="職位"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{currentData.name}</h2>
                      <p className="text-white/90 mt-1">{currentData.jobTitle}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* <div className="flex items-center space-x-3 text-gray-600">
                  <span className="text-lg">🏢</span>
                  <span>{currentData.company}</span>
                </div> */}
                <div className="flex items-center space-x-3 text-gray-600">
                  <span className="text-lg">📍</span>
                  <span>{currentData.location}</span>
                </div>
                {/* <div className="flex items-center space-x-3 text-gray-600">
                  <span className="text-lg">📅</span>
                  <span>加入於 {currentData.joinDate}</span>
                </div> */}
              </div>

              <div className="px-6 pb-6">
                {editMode ? (
                  <div className="flex space-x-2">
                    <button onClick={saveChanges} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-medium transition-colors">保存</button>
                    <button onClick={cancelEdit} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl font-medium transition-colors">取消</button>
                  </div>
                ) : (
                  <button onClick={enterEditMode} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-medium transition-colors">編輯檔案</button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <StatCard value="18" label="完成專案" color="blue" />
              {/* <StatCard value="95%" label="客戶滿意度" color="green" /> */}
              <StatCard value="1年" label="開發經驗" color="purple" />
              {/* <StatCard value="18" label="獲得認證" color="orange" /> */}
            </div>
          </div>

          {/* 右側 - 詳細信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 聯絡資訊 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📞</span>
                聯絡資訊
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="電子郵件" value={currentData.email} onChange={handleFieldChange("email")} type="email" placeholder="your@email.com" icon="📧" disabled={!editMode} />
                <InputField label="電話號碼" value={currentData.phone} onChange={handleFieldChange("phone")} type="tel" placeholder="+886 xxx xxx xxx" icon="📱" disabled={!editMode} />
                {editMode ? (
                  <InputField label="GitHub" value={currentData.github || ""} onChange={handleFieldChange("github")} placeholder="https://github.com/username" icon="💻" disabled={!editMode} />
                ) : (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">GitHub</label>
                    {currentData.github ? (
                      <a href={currentData.github} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 hover:bg-gray-50 transition-all duration-200">{currentData.github}</a>
                    ) : (
                      <span className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-400">未提供</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 個人簡介 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📝</span>
                關於我
              </h3>
              {editMode ? (
                <textarea value={currentData.bio} onChange={(e) => handleFieldChange("bio")(e.target.value)} rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none" placeholder="介紹一下您自己..." />
              ) : (
                <p className="text-gray-600 leading-relaxed text-base">{currentData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}