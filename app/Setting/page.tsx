import { Shield, UserCog, Globe, Bell, Lock } from "lucide-react";

export default function Setting() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-wide">
          System Settings
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ACCOUNT SECTION */}
          <section className="bg-white border-l-4 border-blue-600 p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <UserCog className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Commanding Officer Details
              </h2>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li>• Unit Officer Name: <span className="font-semibold">Editable</span></li>
              <li>• Official Email ID: <span className="font-semibold">Editable</span></li>
              <li>• Contact Number: <span className="font-semibold">Editable</span></li>
              <li>• Update Credentials (Password / PIN)</li>
            </ul>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
              Manage Officer Profile
            </button>
          </section>

          {/* PREFERENCES */}
          <section className="bg-white border-l-4 border-green-600 p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Operational Preferences
              </h2>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li>• Theme Mode: <span className="font-semibold">Light / Dark</span></li>
              <li>• Language: English / Hindi / Odia</li>
              <li>• Units: Kilometers (Default)</li>
              <li>• Map Layer: Terrain / Satellite</li>
            </ul>

            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
              Modify Preferences
            </button>
          </section>

          {/* SECURITY SETTINGS */}
          <section className="bg-white border-l-4 border-red-600 p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-red-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Security & Access Control
              </h2>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li>• Two-Factor Authentication</li>
              <li>• IP Access Restriction</li>
              <li>• Device Authorization</li>
              <li>• Reset Security Keys</li>
            </ul>

            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">
              Configure Security
            </button>
          </section>

          {/* SYSTEM MONITORING */}
          <section className="bg-white border-l-4 border-yellow-500 p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Alerts & Monitoring
              </h2>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li>• Ambush Detection Alerts</li>
              <li>• Basecamp Status Reports</li>
              <li>• Node/Graph Update Notifications</li>
              <li>• Error / Intrusion Logs</li>
            </ul>

            <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg">
              Manage Alerts
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
