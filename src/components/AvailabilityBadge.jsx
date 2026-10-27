export default function AvailabilityBadge({ available, copies }) {
  const isOut = available === 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isOut ? "bg-amber-100 text-amber-900" : "bg-green-100 text-green-900"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${isOut ? "bg-amber-600" : "bg-green-700"}`}
      />
      {isOut ? "All copies checked out" : `${available} of ${copies} available`}
    </span>
  );
}
