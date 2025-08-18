import React, { useState } from "react";

export default function Settings() {
  const [featureToggles, setFeatureToggles] = useState({
    digiWarehouse: true,
    b2cModule: true,
    vendorSelfRegistration: false,
    autoApproval: false,
  });

  const [platformDetails, setPlatformDetails] = useState({
    name: "MYFB Fashion Platform",
    url: "https://myfb.com",
    description:
      "Leading B2B and B2C fashion e-Commerce platform connecting brands with retailers and consumers.",
    timezone: "UTC",
    currency: "INR",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // handle input changes
  const handleDetailChange = (field, value) => {
    setPlatformDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // toggle feature switches
  const handleToggle = (feature) => {
    if (!isEditing) return; // disable toggle unless editing
    setFeatureToggles((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  // save action
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call or state update
      console.log("✅ Saved Details:", platformDetails);
      console.log("✅ Saved Feature Toggles:", featureToggles);

      // simulate success
      setTimeout(() => {
        setIsEditing(false);
        setIsSaving(false);
      }, 800);
    } catch (err) {
      console.error("Save failed", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Platform Settings
            </h1>
            <p className="text-sm text-gray-500">
              Configure system, sales, settings and preferences
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-4 py-2 text-sm font-medium rounded-lg 
               hover:bg-gray-800 transition-colors"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-lg 
               hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          )}
        </div>

        {/* Platform Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Platform Information
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Basic platform configuration
          </p>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformDetails.name}
                  disabled={!isEditing}
                  onChange={(e) => handleDetailChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    ${!isEditing 
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
                      : "bg-white text-gray-900"
                    }`}
                />
              </div>

              {/* Platform URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform URL
                </label>
                <input
                  type="text"
                  value={platformDetails.url}
                  disabled={!isEditing}
                  onChange={(e) => handleDetailChange("url", e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    ${!isEditing 
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
                      : "bg-white text-gray-900"
                    }`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Description
              </label>
              <textarea
                rows="3"
                value={platformDetails.description}
                disabled={!isEditing}
                onChange={(e) =>
                  handleDetailChange("description", e.target.value)
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  resize-none
                  ${!isEditing 
                    ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
                    : "bg-white text-gray-900"
                  }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Timezone
                </label>
                <select
                  value={platformDetails.timezone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleDetailChange("timezone", e.target.value)
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    ${!isEditing 
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
                      : "bg-white text-gray-900"
                    }`}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select
                  value={platformDetails.currency}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleDetailChange("currency", e.target.value)
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    ${!isEditing 
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
                      : "bg-white text-gray-900"
                    }`}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Feature Toggles
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enable or disable platform features
          </p>

          <div className="bg-white rounded-lg border border-gray-200">
            <ToggleRow
              title="Digi Warehouse"
              subtitle="Enables Digi warehouse functionality"
              isActive={featureToggles.digiWarehouse}
              onClick={() => handleToggle("digiWarehouse")}
              disabled={!isEditing}
            />

            <ToggleRow
              title="B2C Module"
              subtitle="Enables B2C retail functionality"
              isActive={featureToggles.b2cModule}
              onClick={() => handleToggle("b2cModule")}
              disabled={!isEditing}
            />

            <ToggleRow
              title="Vendor Self - Registration"
              subtitle="Allow vendors to register directly"
              isActive={featureToggles.vendorSelfRegistration}
              onClick={() => handleToggle("vendorSelfRegistration")}
              disabled={!isEditing}
            />

            <ToggleRow
              title="Auto - Approval"
              subtitle="Automatically approve vendor applications"
              isActive={featureToggles.autoApproval}
              onClick={() => handleToggle("autoApproval")}
              disabled={!isEditing}
              border={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Toggle Row Component
function ToggleRow({ title, subtitle, isActive, onClick, disabled, border = true }) {
  return (
    <div className={`p-6 ${border ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            ${isActive ? "bg-green-500" : "bg-gray-300"} 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full shadow-lg transition-transform 
              ${isActive ? "translate-x-6 bg-white" : "translate-x-1 bg-white"}`}
          />
        </button>
      </div>
    </div>
  );
}