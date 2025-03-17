const ErrorComponent = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-red-50">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-600">Please try again later.</p>
    </div>
  );
};

export default ErrorComponent;
