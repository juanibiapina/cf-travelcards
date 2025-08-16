interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" data-testid="card">
      {children}
    </div>
  );
};

export default Card;
