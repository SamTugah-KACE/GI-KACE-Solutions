// src/utils/mappingUtil.js
import stringSimilarity from 'string-similarity';


// Mapping dictionary: UI keys (normalized) -> canonical backend keys.
const CANONICAL_FIELDS  = {
    "title": "title",
    "prefix": "title",
    "given name": "first_name",
    "firstname": "first_name",
    "first": "first_name",
    "surname": "last_name",
    "lastname": "last_name",
    "last name": "last_name",
    "middle name": "middle_name",
    "middle": "middle_name",
    "middle initial": "middle_name",
    "middle_name": "middle_name",
    "family name": "last_name",
    "family": "last_name",
    "family_name": "last_name",
    "sex": "gender",
    "gender": "gender",
    "dob": "date_of_birth",
    "date of birth": "date_of_birth",
    "birth date": "date_of_birth",
    "birthdate": "date_of_birth",
    "date_of_birth": "date_of_birth",
    "birthday": "date_of_birth",
    "email": "email",
    "e-mail": "email",
    "email address": "email",
    "email input": "email",
    "email_input": "email",
    "mail": "email",
    "mail address": "email",
    "phone number": "contact_info",
    "contact": "contact_info",
    "employee type": "employee_type",
    "employee_type": "employee_type", // Synonym for employee_type
    "employment type": "employee_type",
    "employment_type": "employee_type",
    "employmenttype": "employee_type",
    "employment": "employee_type",
    "role selection": "role_id",
    "role": "role_id",
    "role_select": "role_id",
    "system_role": "role_id",
    "role_select_input": "role_id",
    "system role": "role_id",
    "department": "assigned_dept",
    "residential address": "address",
    "residentialaddress": "address",
    "residential": "address",
    "residential_address": "address",
    "address": "address",
    "postal address": "address",
    "postaladdress": "address",
    "postal": "address",
    "postal_code": "address",  
    "postalcode": "address",
    "home": "address",  
    "home_address": "address",
    "home address": "address",
    "homeaddress": "address",
    "personal address": "address",
    "personaladdress": "address",
    "personal": "address",
    "personal_address": "address",
    "rank": "rank",
    "assigned rank": "rank",
    "assignedrank": "rank",
    "assigned_rank": "rank",
    "assigned department": "assigned_dept",  
    "assigneddepartment": "assigned_dept", 
    "assigned dept": "assigned_dept",  
    "assigneddept": "assigned_dept",
    "academic qualifications": "academic_qualifications",
    "professional qualifications": "professional_qualifications",
    "payment details": "payment_details",
    "next of kin": "next_of_kin",
    // "submit button": "submit", // Normally empty
    // ... add as many synonyms as required.
  };

export const mapEmployeeFields = (inputData) => {
  const mapped = {};
  Object.entries(inputData).forEach(([key, value]) => {
    // Normalize the key for comparison.
    const normalizedKey = key.trim().toLowerCase();
    const candidateKeys = Object.keys(CANONICAL_FIELDS);
    const { bestMatch } = stringSimilarity.findBestMatch(normalizedKey, candidateKeys);
    // If the best match is good enough, use the canonical field name.
    if (bestMatch.rating > 0.6) {
      mapped[CANONICAL_FIELDS[bestMatch.target]] = value;
    } else {
      // Otherwise, keep the key as provided.
      mapped[key] = value;
    }
  });
  return mapped;
};

