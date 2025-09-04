import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  deleteUserAccount,
} from "../services/apiClient";
import { useTheme } from "../contexts/ThemeContext";

const SettingsPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false); // new
  const [showSaveError, setShowSaveError] = useState(false); // new

  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getUserProfile();
        const prefs = await getUserPreferences();

        setName(profile.name || "");
        setEmail(profile.email || "");

        // Sync backend theme with frontend
        if ((prefs.theme || "light") === "dark" && !darkMode) toggleTheme();
        else if ((prefs.theme || "light") === "light" && darkMode)
          toggleTheme();
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({ name, email });
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000); // hide after 3s
    } catch (err) {
      console.error(err);
      setShowSaveError(true);
      setTimeout(() => setShowSaveError(false), 3000); // hide after 3s
    }
  };

  const handleToggleDarkMode = async () => {
    try {
      toggleTheme();
      await updateUserPreferences({ theme: !darkMode ? "dark" : "light" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <DashboardLayout title="Settings">
        <div className="p-6 text-gray-500 dark:text-gray-400">Loading...</div>
      </DashboardLayout>
    );

  const sectionClass =
    "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300";
  const inputClass =
    "w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-100";
  const primaryBtn =
    "px-4 py-2 rounded-lg transition font-medium bg-indigo-500 hover:bg-indigo-600 text-white";
  const secondaryBtn =
    "px-4 py-2 rounded-lg transition font-medium bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100";
  const dangerBtn =
    "px-4 py-2 rounded-lg transition font-medium bg-red-500 hover:bg-red-600 text-white";

  return (
    <DashboardLayout title="Settings">
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Profile */}
        <section className={sectionClass}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Profile
          </h3>

          {/* Save Success/Error Toast */}
          {showSaveSuccess && (
            <div className="mb-4 p-2 rounded bg-green-500 text-white">
              Profile saved successfully!
            </div>
          )}
          {showSaveError && (
            <div className="mb-4 p-2 rounded bg-red-500 text-white">
              Failed to save profile.
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className={inputClass}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={inputClass}
            />
            <button onClick={handleSaveProfile} className={primaryBtn}>
              Save Profile
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className={sectionClass}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Preferences
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
            <label className="text-gray-800 dark:text-gray-200 font-medium">
              Dark Mode
            </label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleToggleDarkMode}
              className="accent-indigo-500 dark:accent-indigo-400"
            />
          </div>
        </section>

        {/* Account Actions */}
        <section className={sectionClass + " space-y-4"}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Actions
          </h3>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className={secondaryBtn}
          >
            Log Out
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className={dangerBtn}
          >
            Delete Account
          </button>
        </section>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg w-72 sm:w-80">
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                Are you sure you want to delete your account? This action is
                irreversible.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={secondaryBtn}
                >
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className={dangerBtn}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
