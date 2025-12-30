const BackgroundDecoration = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />
      
      {/* Background images with overlay and animations */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 animate-float-slow">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-2/5 h-2/5 opacity-15 animate-float" style={{ animationDelay: '2s' }}>
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 opacity-12 animate-drift">
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80" 
          alt="" 
          className="w-full h-full object-cover rounded-3xl blur-sm"
        />
      </div>

      {/* Animated decorative shapes - more vibrant */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-40 left-10 w-[400px] h-[400px] bg-secondary/25 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '1.5s' }} />
      
      {/* Additional floating orbs - brighter */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-primary/20 rounded-full blur-2xl animate-drift" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-1/3 right-10 w-56 h-56 bg-secondary/18 rounded-full blur-2xl animate-float" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-10 left-1/3 w-40 h-40 bg-primary/15 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '0.5s' }} />
      
      {/* Animated geometric patterns - more visible */}
      <svg className="absolute top-40 left-20 w-40 h-40 text-primary/25 animate-spin-slow" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="40" y="40" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      
      <svg className="absolute bottom-60 right-40 w-32 h-32 text-secondary/25 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      
      <svg className="absolute top-2/3 left-1/3 w-28 h-28 text-primary/20 animate-float" viewBox="0 0 100 100">
        <polygon points="50,5 95,95 5,95" fill="none" stroke="currentColor" strokeWidth="2" />
        <polygon points="50,25 80,80 20,80" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      <svg className="absolute top-1/4 right-1/3 w-24 h-24 text-secondary/20 animate-drift" style={{ animationDelay: '3s' }} viewBox="0 0 100 100">
        <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      
      {/* Floating dots - brighter */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-secondary/40 rounded-full animate-float" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-primary/35 rounded-full animate-float-slow" style={{ animationDelay: '0.8s' }} />
      <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-secondary/45 rounded-full animate-drift" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/5 w-4 h-4 bg-primary/35 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/2 right-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-drift" style={{ animationDelay: '2.8s' }} />
      
      {/* Dotted pattern - slightly more visible */}
      <div className="absolute inset-0 opacity-[0.06]" 
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1.5px, transparent 1.5px)',
          backgroundSize: '35px 35px'
        }}
      />
    </div>
  );
};

export default BackgroundDecoration;
