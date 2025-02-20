import React, { useState, useEffect } from 'react';
import './OrganizationDataForm.css'; // add your styling

// For brevity, only a few countries are listed; in production use a full alphabetical list.
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Bahamas",
  "Behrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia & Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada", 
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Eqypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India", 
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Maozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia",
  "Norway","Oman","Pakistan","Panama","Paragua","Peru","Philippines","Poland",
  "Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts & Nevis","Saint Lucia","Saint Vincent & the Grenadines",
  "Samoa","San Marino","Sao Tome & Principe", "Saudi Arabia","Senegal",
  "Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Somalia","South Africa","Spain",
  "Sri Lanka","Sudan","Sudan, South","Suriname","Sweden",
  "Switzerland","Syria","Taiwan","Tanzania","Thailand","Togo",
  "Tonga","Trinidad & Tobago","Tunisia","Turkey","Uganda",
  "Ukraine","United Arab Emirates",
  "United Kingdom", "United States",
  "Uruguay","Vatican City","Venezuela","Vietnam",
  "Yemen","Zambia","Zimbabwe",

];

const OrganizationDataForm = ({ data, updateData }) => {
  const [localData, setLocalData] = useState({
    organizationName: '',
    organizationalEmail: '',
    country: '',
    organizationType: '',
    nature: '',
    logos: []
  });

  useEffect(() => {
    updateData(localData);
  }, [localData, updateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const logos = files.map((file) => URL.createObjectURL(file));
    setLocalData((prev) => ({
      ...prev,
      logos
    }));
  };

  return (
    <div className="organization-data-form">
      <div className="form-group">
        <label>Organization Name*:</label>
        <input type="text" name="organizationName" value={localData.organizationName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Organizational Email*:</label>
        <input type="email" name="organizationalEmail" value={localData.organizationalEmail} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Country*:</label>
        <select name="country" value={localData.country} onChange={handleChange} required>
          <option value="">Select Country</option>
          {countries.map((k, c, ) => (
            <option key={`${c}-${k}`} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Organization Type*:</label>
        <select name="organizationType" value={localData.organizationType} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="NGO">NGO</option>
        </select>
      </div>
      <div className="form-group">
        <label>Nature*:</label>
        <select name="nature" value={localData.nature} onChange={handleChange} required>
          <option value="">Select Nature</option>
          <option value="Single Managed">Single Managed</option>
          <option value="Branched Managed">Branched Managed</option>
        </select>
      </div>
      <div className="form-group">
        <label>Upload Logos* (max 3):</label>
        <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
      </div>
      <div className="logos-preview">
        {localData.logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            style={{ width: '64px',  height: '64px', objectFit: 'cover', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationDataForm;
