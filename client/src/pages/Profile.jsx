import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserCircle, LogOut, Mail, Shield } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  const roleLabel =
    user?.role === "coach"
      ? "Trenér"
      : user?.role === "admin"
        ? "Administrátor"
        : "Hráč";

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-500">
      <PageHeader title="Profil" subtitle="Účet a nastavení" icon={UserCircle} />

      <div className="bg-[#1a1a1a] border border-[#2a303c] rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 bg-[#2a303c]/40 rounded-2xl border border-[#2a303c]">
            <UserCircle size={56} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white m-0 tracking-tight">
              {user?.firstName} {user?.lastName}
            </h2>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#4E4619] text-[#dce1a1]">
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-[#2a303c]/30 rounded-xl">
            <Mail size={18} className="text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                E-mail
              </p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#2a303c]/30 rounded-xl">
            <Shield size={18} className="text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Role
              </p>
              <p className="text-white font-medium">{roleLabel}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={logout}
          className="mt-8 w-full bg-transparent hover:bg-red-900/30 text-gray-400 hover:text-red-400 border border-[#2a303c] hover:border-red-900/50 h-12 rounded-xl font-bold uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 transition-all"
        >
          <LogOut size={16} /> Odhlásit se
        </Button>
      </div>
    </div>
  );
};

export default Profile;
