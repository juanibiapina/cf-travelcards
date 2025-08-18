interface BoxProps {
  children: React.ReactNode;
}

const Box = ({ children }: BoxProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      {children}
    </div>
  );
};

export default Box;
