export default function Button({ primary, className = '', disabled, children, ...rest }) {
  const baseClasses = [
    "flex gap-2 items-center py-1 px-4 rounded-md text-opacity-90",
    primary ? "bg-blue-500 text-white" : "text-gray-600",
    disabled ? "text-opacity-70 bg-opacity-70 cursor-not-allowed" : "",
    className, 
  ].join(' ');

  return (
    <button
      {...rest}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
