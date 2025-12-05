import { Music, Music2, Music3, Music4 } from "lucide-react";

const MusicNotes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating music notes */}
      <Music 
        className="absolute top-20 left-[10%] w-8 h-8 text-primary/30 animate-float" 
      />
      <Music2 
        className="absolute top-40 right-[15%] w-6 h-6 text-primary/20 animate-float-delayed" 
      />
      <Music3 
        className="absolute bottom-40 left-[20%] w-10 h-10 text-primary/25 animate-float" 
      />
      <Music4 
        className="absolute top-60 left-[5%] w-5 h-5 text-coral/20 animate-float-delayed" 
      />
      <Music 
        className="absolute bottom-60 right-[10%] w-7 h-7 text-primary/30 animate-float" 
      />
      <Music2 
        className="absolute top-32 right-[30%] w-6 h-6 text-coral/15 animate-float-delayed" 
      />
    </div>
  );
};

export default MusicNotes;
