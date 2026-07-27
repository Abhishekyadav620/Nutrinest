import { AlertCircle } from "lucide-react";

const AuthFieldError = ({ message }) => {
  if (!message) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium pl-1 mt-1.5" role="alert">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{message}</span>
    </p>
  );
};

export default AuthFieldError;
