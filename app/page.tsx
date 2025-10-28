"use client";
import { useState, useCallback, useEffect } from "react";

// === 定義型別 ===
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  jobTitle: string;
  company: string;
  avatar: string | null;
  website?: string;
  github?: string;
}

interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
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

// === InputField ===
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
        className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 
          placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed
          ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

// === StatCard ===
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

// === 主頁 ===
export default function ModernProfilePage() {
  const defaultProfile: UserProfile = {
    name: "莊霖杰",
    email: "zxc664231@gmail.com",
    phone: "+886 916 531 881",
    location: "高雄市, 台灣",
    bio: "熱愛技術的全端開發者，專精於 React、Next.js 和 Node.js。",
    jobTitle: "軟體工程師",
    company: "無",
    avatar: null,
    github: "https://github.com/LinJie09",
  };

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [tempProfile, setTempProfile] = useState<UserProfile>(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // === 新增 GitHub Repo 狀態 ===
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  // === 載入 localStorage ===
  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const data = JSON.parse(stored);
      setProfile(data);
      setTempProfile(data);
    }
    setHydrated(true);
  }, []);

  // === 抓取 GitHub Repo ===
  useEffect(() => {
    if (!profile.github) return;
    const username = profile.github.split("github.com/")[1];
    if (!username) return;
    setLoadingRepos(true);
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API 請求失敗");
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setRepoError(null);
      })
      .catch((err) => setRepoError(err.message))
      .finally(() => setLoadingRepos(false));
  }, [profile.github]);

  // === 編輯控制 ===
  const handleFieldChange = useCallback(
    (field: keyof UserProfile) => (value: string) => setTempProfile((p) => ({ ...p, [field]: value })),
    []
  );
  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setTempProfile((p) => ({ ...p, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);
  const enterEditMode = () => {
    setTempProfile(profile);
    setEditMode(true);
  };
  const saveChanges = () => {
    setProfile(tempProfile);
    localStorage.setItem("userProfile", JSON.stringify(tempProfile));
    setEditMode(false);
  };
  const cancelEdit = () => {
    setTempProfile(profile);
    setEditMode(false);
  };

  const currentData = editMode ? tempProfile : profile;
  if (!hydrated) return <p className="text-center py-20 text-gray-400">Loading...</p>;

  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-black flex flex-col m-0 p-0">

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">個人檔案</h1>
          <button className="text-gray-500 hover:text-gray-800">⚙️</button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar + Info */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 overflow-hidden">
                {currentData.avatar ? (
                  <img src={currentData.avatar} alt="頭像" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">👨‍💻</div>
                )}
              </div>
              {editMode && (
                <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                  📷
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              )}
            </div>

            <div className="mt-4">
              {editMode ? (
                <>
                  <input
                    value={currentData.name}
                    onChange={(e) => handleFieldChange("name")(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg text-center py-1 mb-2"
                  />
                  <input
                    value={currentData.jobTitle}
                    onChange={(e) => handleFieldChange("jobTitle")(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg text-center py-1"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{currentData.name}</h2>
                  <p className="text-gray-600">{currentData.jobTitle}</p>
                </>
              )}
            </div>
            <div className="mt-4 text-gray-500">{currentData.location}</div>
            <div className="mt-4 text-b">
              {editMode ? (
                <div className="flex gap-2">
                  <button onClick={saveChanges} className="flex-1 bg-green-500 text-white rounded-lg py-2">
                    保存
                  </button>
                  <button onClick={cancelEdit} className="flex-1 bg-gray-400 text-white rounded-lg py-2">
                    取消
                  </button>
                </div>
              ) : (
                <button onClick={enterEditMode} className="w-full bg-blue-500 text-white rounded-lg py-2">
                  編輯檔案
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <StatCard value="18" label="完成專案" color="blue" />
            <StatCard value="1年" label="開發經驗" color="purple" />
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📞 聯絡資訊</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField label="電子郵件" value={currentData.email} onChange={handleFieldChange("email")} disabled={!editMode} />
              <InputField label="電話號碼" value={currentData.phone} onChange={handleFieldChange("phone")} disabled={!editMode} />
              {editMode ? (
                <InputField label="GitHub" value={currentData.github || ""} onChange={handleFieldChange("github")} />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  {currentData.github ? (
                    <a href={currentData.github} target="_blank" rel="noreferrer" className="block border rounded-xl px-4 py-3 hover:bg-gray-50">
                      {currentData.github}
                    </a>
                  ) : (
                    <p className="border rounded-xl px-4 py-3 text-gray-400">未提供</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📝 關於我</h3>
            {editMode ? (
              <textarea
                value={currentData.bio}
                onChange={(e) => handleFieldChange("bio")(e.target.value)}
                className="w-full border rounded-xl p-3"
                rows={5}
              />
            ) : (
              <p className="text-gray-600">{currentData.bio}</p>
            )}
          </div>

          {/* === 新增：GitHub 作品集 === */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">💻 GitHub 作品集</h3>
            {loadingRepos ? (
              <p className="text-gray-400">載入中...</p>
            ) : repoError ? (
              <p className="text-red-500">{repoError}</p>
            ) : repos.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <h4 className="font-semibold text-blue-600">{repo.name}</h4>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{repo.description || "（無描述）"}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      ⭐ {repo.stargazers_count}　·　{repo.language || "未知語言"}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">目前尚無公開專案</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
