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
  "Côte d'Ivoire",
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
    organizationName: data?.organizationName || '',
    organizationalEmail: data?.organizationalEmail || '',
    country: data?.country || '',
    organizationType: data?.organizationType || '',
    nature: data?.nature || '',
    logos: data?.logos || []
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const validationErrors = {};
    
    if (!localData.organizationName.trim()) {
      validationErrors.organizationName = 'Organization Name is required';
    }

    if (!localData.organizationalEmail.trim()) {
      validationErrors.organizationalEmail = 'Organizational Email is required';
    } else if (!/\S+@\S+\.\S+/.test(localData.organizationalEmail)) {
      validationErrors.organizationalEmail = 'Invalid email format';
    }

    if (!localData.country.trim()) {
      validationErrors.country = 'Country is required';
    }

    if (!localData.organizationType.trim()) {
      validationErrors.organizationType = 'Organization Type is required';
    }

    if (!localData.nature.trim()) {
      validationErrors.nature = 'Nature is required';
    }

    if (!localData.logos.length) {
      validationErrors.logos = 'Please upload at least one logo';
    } else if (localData.logos.length > 3) {
      validationErrors.logos = 'Maximum 3 logos allowed';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateForm();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const logos = files.map((file) => URL.createObjectURL(file));
    setLocalData(prev => ({
      ...prev,
      logos
    }));
    setTouched(prev => ({
      ...prev,
      logos: true
    }));
  };

  useEffect(() => {
    const isValid = validateForm();
    updateData(localData, isValid);
  }, [localData]);

  return (
    <div className="organization-data-form">
      <div className="form-group">
        <label>Organization Name*:</label>
        <input 
          type="text" 
          name="organizationName" 
          value={localData.organizationName} 
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.organizationName && errors.organizationName ? 'error-border' : ''}
          required 
        />
        {touched.organizationName && errors.organizationName && 
          <span className="error">{errors.organizationName}</span>
        }
      </div>

      <div className="form-group">
        <label>Organizational Email*:</label>
        <input 
          type="email" 
          name="organizationalEmail" 
          value={localData.organizationalEmail} 
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.organizationalEmail && errors.organizationalEmail ? 'error-border' : ''}
          required 
        />
        {touched.organizationalEmail && errors.organizationalEmail && 
          <span className="error">{errors.organizationalEmail}</span>
        }
      </div>

      <div className="form-group">
        <label>Country*:</label>
        <select 
          name="country" 
          value={localData.country} 
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.country && errors.country ? 'error-border' : ''}
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {touched.country && errors.country && 
          <span className="error">{errors.country}</span>
        }
      </div>

      <div className="form-group">
        <label>Organization Type*:</label>
        <select 
          name="organizationType" 
          value={localData.organizationType} 
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.organizationType && errors.organizationType ? 'error-border' : ''}
          required
        >
          <option value="">Select Type</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="NGO">NGO</option>
        </select>
        {touched.organizationType && errors.organizationType && 
          <span className="error">{errors.organizationType}</span>
        }
      </div>

      <div className="form-group">
        <label>Nature*:</label>
        <select 
          name="nature" 
          value={localData.nature} 
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.nature && errors.nature ? 'error-border' : ''}
          required
        >
          <option value="">Select Nature</option>
          <option value="Single Managed">Single Managed</option>
          <option value="Branched Managed">Branched Managed</option>
        </select>
        {touched.nature && errors.nature && 
          <span className="error">{errors.nature}</span>
        }
      </div>

      <div className="form-group">
        <label>Upload Logos* (max 3):</label>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileUpload}
          onBlur={handleBlur}
          name="logos"
          className={touched.logos && errors.logos ? 'error-border' : ''}
        />
        {touched.logos && errors.logos && 
          <span className="error">{errors.logos}</span>
        }
      </div>

      <div className="logos-preview">
        {localData.logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationDataForm;
