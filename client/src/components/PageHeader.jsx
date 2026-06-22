const PageHeader = ({ title, subtitle, icon: Icon, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#2a303c] pb-6">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-3 bg-[#4E4619] rounded-xl shadow-[0_0_15px_rgba(78,70,25,0.4)]">
          <Icon size={24} className="text-[#dce1a1]" />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight m-0">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
);

export default PageHeader;
