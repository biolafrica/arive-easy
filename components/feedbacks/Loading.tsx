export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
       
        <div className="relative">
   
          <div className="w-20 h-20 bg-card rounded-full shadow-lg flex items-center justify-center border border-border">
            <img 
              src="/vercel.svg" 
              alt="Loading" 
              className="w-10 h-10" 
            />
          </div>
          
          <div className="absolute inset-0 border-4 border-separator border-t-accent rounded-full animate-spin"></div>
        </div>

        <div className="w-56 h-1.5 bg-hover rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-loading-bar"></div>
        </div>
        
        <p className="text-sm text-secondary animate-pulse">Loading...</p>
      </div>
    </div>
  );
}