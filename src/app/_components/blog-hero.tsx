interface BlogHeroProps {
  title: string;
  description: string;
  image: string;
}

export function BlogHero({ title, description, image }: BlogHeroProps) {
  return (
    <div className="hero-container">
      <img src={image} alt={title} className="hero-image brutalist-border" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="scroll-m-20 display-title text-white mb-4 text-shadow-brutal">{title}</h1>
        <p className="hero-description">{description}</p>
      </div>
    </div>
  );
}
