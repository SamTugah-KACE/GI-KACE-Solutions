import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import request from '../request';


// Modal for Existing Users
const AddRoleModal = ({ organizationId, onClose, onRoleAdded }) => {

    <Modal title="New System Role Panel" onClose={onClose}>
    <p>This content is only available to Admins.</p>
    <button onClick={onRoleAdded}>Add Role</button>
    {/* Admin-specific controls go here */}
  </Modal>



};

export default AddRoleModal;




