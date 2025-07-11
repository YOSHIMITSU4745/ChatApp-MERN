


export const WallpaperBackground = () => {
  const imageUrl = "https://images.wallpaperscraft.com/image/single/stains_blending_abstraction_144017_3840x2400.jpg";
  
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40 z-0" />
      
    </div>
  );
};
