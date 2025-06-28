export function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
              placeholder="Enter your display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>
          <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 