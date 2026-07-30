interface ToastProps {
  message: string;
  variant: "success" | "error";
}

export function Toast({ message, variant }: ToastProps) {
  return (
    <div
      className={`fixed right-5 bottom-24 left-5 z-40 rounded-2xl px-4 py-3 text-center text-sm shadow-lg ${
        variant === "error" ? "bg-red-600 text-white" : "bg-green-100 text-green-800"
      }`}
    >
      {message}
    </div>
  );
}
