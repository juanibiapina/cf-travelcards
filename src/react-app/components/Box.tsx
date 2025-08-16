interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box = ({ children }: BoxProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" data-testid="box">
      {children}
    </div>
  );
};

export default Box;
