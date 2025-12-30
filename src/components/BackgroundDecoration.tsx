const BackgroundDecoration = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background" />
      
      {/* Background images with overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-[0.08]">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-[0.06]">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 opacity-[0.05]">
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80" 
          alt="" 
          className="w-full h-full object-cover rounded-full blur-sm"
        />
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />
      
      {/* Geometric patterns */}
      <svg className="absolute top-40 left-20 w-32 h-32 text-primary/10" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      
      <svg className="absolute bottom-60 right-40 w-24 h-24 text-secondary/10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      
      {/* Dotted pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default BackgroundDecoration;
