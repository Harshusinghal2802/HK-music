const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-brand-red border-r-brand-blue animate-spin-slow" />
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
};

export default Loader;
