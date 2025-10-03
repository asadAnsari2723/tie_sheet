import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Utility function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// Custom input component
const FormInput = ({ label, id, name, placeholder, type = 'text', required = false, description = null, value, onChange }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 flex justify-between items-center">
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm w-full"
    />
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

// Logo Input Component
const LogoField = ({ label, id, name, value, onChange, onFileChange }) => (
  <div className="flex flex-col space-y-2 p-4 border border-indigo-200 rounded-xl bg-indigo-50/50">
    <label className="text-sm font-medium text-gray-700 font-semibold">{label} (Optional)</label>

    {/* URL Input */}
    <div className="flex flex-col space-y-1">
      <label htmlFor={`${id}URL`} className="text-xs font-medium text-gray-600">
        Paste Logo URL
      </label>
      <input
        type="text"
        id={`${id}URL`}
        name={name}
        placeholder="e.g., https://.../logo.png"
        value={!value || value.startsWith('data:image/') ? '' : value}
        onChange={onChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm w-full text-sm"
      />
    </div>

    <p className="text-center text-xs text-gray-500 font-medium">-- OR --</p>

    {/* File Input */}
    <div className="flex flex-col space-y-1">
      <label htmlFor={`${id}FILE`} className="text-xs font-medium text-gray-600">
        Upload File (.png, .jpg)
      </label>
      <input
        type="file"
        id={`${id}FILE`}
        name={name}
        accept="image/png, image/jpeg"
        onChange={onFileChange}
        className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
      />
    </div>

    {/* Live Preview */}
    {value && (
      <div className="pt-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">Active Logo Preview:</p>
        <img
          src={value}
          alt={`${label} Preview`}
          className="w-12 h-12 object-contain rounded-lg border border-gray-300 p-1 bg-white shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/48x48/E0E7FF/4F46E5?text=X';
          }}
        />
      </div>
    )}
  </div>
);

// Main Component
const TournamentForm = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const initialData = location.state || {
    tournamentName: '',
    weightCategory: '',
    organizedBy: '',
    tournamentDate: getTodayDate(),
    leftLogoUrl: '',
    rightLogoUrl: '',
    playerList: '',
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) {
      setFormData(prev => ({ ...prev, [name]: '' }));
      return;
    }
    if (file.size > 2097152) {
      alert("File size exceeds 2MB limit.");
      e.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [name]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const playerCount = useMemo(() => {
    if (!formData.playerList) return 0;
    return formData.playerList
      .split('\n')
      .filter(line => line.trim() !== '').length;
  }, [formData.playerList]);

  const GeneratePlayoffs = (e) => {
    if (e) e.preventDefault();

    if (playerCount < 2) {
      alert("Minimum 2 players are required to generate playoffs.");
      return;
    }

    const players = formData.playerList
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        const parts = line.split('|').map(p => p.trim());
        return { name: parts[0] || 'Unknown Player', state: parts[1] || 'N/A' };
      });

    const finalData = {
      ...formData,
      players,
      playerCount,
    };

    navigate('/tournament', { state: finalData });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-200">

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
          New Tournament Setup
        </h1>

        <form id="teamForm" className="space-y-6">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Tournament Name"
              id="TOURNAMENTNAME"
              name="tournamentName"
              placeholder="e.g., Taekwondo"
              value={formData.tournamentName}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Weight Category"
              id="WGHTCAT"
              name="weightCategory"
              placeholder="e.g., Heavyweight (91+ kg)"
              value={formData.weightCategory}
              onChange={handleChange}
            />
            <FormInput
              label="Organized By"
              id="ORG"
              name="organizedBy"
              placeholder="e.g., National Taekwondo Federation"
              value={formData.organizedBy}
              onChange={handleChange}
            />
          </div>

          {/* DATE & LOGOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            <FormInput
              label="Tournament Date"
              id="TOURNAMENTDATE"
              name="tournamentDate"
              type="date"
              value={formData.tournamentDate}
              onChange={handleChange}
              required
              description="Defaults to today's date."
            />
            <LogoField
              label="Left Logo"
              id="LEFTLOGO"
              name="leftLogoUrl"
              value={formData.leftLogoUrl}
              onChange={handleChange}
              onFileChange={handleLogoUpload}
            />
            <LogoField
              label="Right Logo"
              id="RIGHTLOGO"
              name="rightLogoUrl"
              value={formData.rightLogoUrl}
              onChange={handleChange}
              onFileChange={handleLogoUpload}
            />
          </div>

          {/* PLAYER LIST */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <label htmlFor="playerList" className="text-lg font-semibold text-gray-900">
                Player Roster ({playerCount} participating)
              </label>
              <span className={`text-sm font-medium ${playerCount < 2 ? 'text-red-500' : 'text-green-600'}`}>
                Min 2 Players Required
              </span>
            </div>
            <textarea
              name="playerList"
              id="playerList"
              rows="6"
              value={formData.playerList}
              onChange={handleChange}
              placeholder={'Enter one player per line in the format:\nPlayer Name | State'}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono resize-y"
            ></textarea>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-6">
            <button
              type="button"
              onClick={GeneratePlayoffs}
              disabled={playerCount < 2}
              className={`w-full py-3 px-4 font-bold rounded-xl shadow-lg transition duration-200 ease-in-out ${playerCount < 2
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-[1.01] focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                }`}
            >
              Go! Generate Playoffs ({playerCount} / 2 minimum)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm;
