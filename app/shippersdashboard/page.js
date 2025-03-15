import LoadTracking from "../loadtracking/page";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Shipper Dashboard</h1>
      <LoadTracking/>
    </div>
  );
}
