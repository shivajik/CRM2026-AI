const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up">
        <span className="text-6xl md:text-8xl mb-6 block animate-wave">👋</span>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-4">
          Hello
        </h1>
        <p className="font-body text-lg md:text-xl text-muted-foreground font-light tracking-wide">
          Welcome to your new page
        </p>
      </div>
    </div>
  );
};

export default Index;
