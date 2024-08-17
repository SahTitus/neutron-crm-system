'use client';
import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { uniqueId } from '@utils/helpers/uniqueId';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Dropzone } from './DropZone';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextEditor } from './TextEditor';
import { useStateContext } from '@redux/StateProvider';

const InputField = ({
  label,
  name,
  fieldName,
  className,
  dropZoneHeight = 'h-32',
  type = 'text',
  isAttributes,
  placeholder = '',
  options = [],
  isRequired = false,
  isMultiSelect = false,
  showPassword,
  setFieldValue,
  labelStyles,
  isSignUp,
  togglePasswordVisibility
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { formSubmitted, setFormSubmitted, } = useStateContext();

  const parseValue = (value, type) => {
    if (type === 'number') {
      return Number(value);
    }
    return value;
  };

  const handleSelectionChange = (selectedValue, field, form, type) => {
    let newValues = selectedValue;

    if (isMultiSelect) {
      newValues = selectedValue.split(',').map(val => val.trim()).filter(val => val).map(val => parseValue(val, type));
    } else {
      newValues = parseValue(selectedValue, type);
    }

    const attribute = {
      id: uniqueId(),
      label,
      value: newValues,
      field: fieldName,
    };

    if (isAttributes) {
      const attributesArray = form.values.attributes || [];
      const existingAttributeIndex = attributesArray.findIndex(attr => attr.field === fieldName);

      if (existingAttributeIndex > -1) {
        attributesArray[existingAttributeIndex] = attribute;
      } else {
        attributesArray.push(attribute);
      }

      form.setFieldValue('attributes', attributesArray);
    } else {
      form.setFieldValue(field.name, newValues);
    }
  };

  const handleInputChange = (e, field, form, type) => {
    if (type === 'number' && e.target.value < 0) {
      e.target.value = 0;
    }
    const newValue = e.target.value;
    setInputValue(newValue);
    handleSelectionChange(newValue, field, form, type);
  };

  const handleInputBlur = () => {
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  // Filter options based on input value
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    // reset input value when formSubmitted is true
    if (formSubmitted) {

      setInputValue('');

      const timer = setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }

  }, [formSubmitted])

  const formik = useFormikContext();

  // Synchronize inputValue with Formik values
  useEffect(() => {
    // Update inputValue from Formik initial values using dot notation for nested fields
    const fieldValue = name?.split('.')?.reduce((acc, key) => acc && acc[key], formik.values);
    setInputValue(fieldValue || '');
  }, [formik.values, name]);
  




  return (
    <div className={`${(type === 'checkbox' || type === 'radio') ? 'flex items-center gap-4' : ''} mb-1 relative`}>
      <label htmlFor={name} className={labelStyles}>
        {label} {isRequired && <span className="text-red-500 text-lg">*</span>}
      </label>
      <Field name={name}>
        {({ field, form }) => (
          <>
            {(type === 'text' || type === 'date' || type === 'time' || type === 'password' || type === 'number') && !options.length ? (
              <input
                {...field}
                type={type === 'password' ? showPassword ? 'password' : 'text' : type}
                id={name}
                placeholder={placeholder}
                className={className}
                onChange={(e) => handleInputChange(e, field, form, type)}
                value={inputValue}
                min={type === 'number' ? 0 : undefined}
              />
            ) : null}

            {type === 'textarea' ? (
              <textarea
                {...field}
                id={name}
                placeholder={placeholder}
                className="shadow bg-white dark:bg-slate-700 dark:text-gray-300 appearance-none border rounded w-full py-3 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                rows="8"
              />
            ) : null}

            {(!!options.length || isMultiSelect) && (
              <>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e, field, form, type)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={placeholder}
                  className={className}
                />
                {showDropdown && (
                  <div className={`absolute z-10 w-full bg-white border border-gray-300 ${!isSignUp ? 'dark:bg-gray-800 dark:text-slate-200' : ''} rounded shadow-md max-h-60 overflow-y-auto`}>
                    {filteredOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer p-2 ${!isSignUp ? 'text-gray-400 hover:text-gray-700' : 'text-gray-700'} hover:bg-slate-300`}
                        onMouseDown={() => {
                          let newValue = option;
                          if (isMultiSelect) {
                            const currentValues = inputValue.split(',').map(val => val.trim()).filter(val => val);
                            if (currentValues.includes(option)) {
                              newValue = currentValues.filter(val => val !== option).join(', ');
                            } else {
                              newValue = [...currentValues, option].join(', ');
                            }
                          }
                          setInputValue(newValue);
                          handleSelectionChange(newValue, field, form, type);
                          setShowDropdown(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {type === 'radio' ? (
              options.map((option, index) => (
                <label key={index} className="mr-4">
                  <input
                    {...field}
                    type="radio"
                    value={option}
                    checked={field.value === option}
                    className="mr-2 leading-tight"
                  />
                  {option}
                </label>
              ))
            ) : null}

            {type === 'checkbox' ? (
              <input
                {...field}
                type="checkbox"
                id={name}
                checked={field.value}
                className="custom-checkbox cursor-pointer mr-2 leading-tight text-customCheckbox-checked focus:ring-customCheckbox-checked border-customCheckbox-checked"
                onChange={() => form.setFieldValue(field.name, !field.value)}
              />

            ) : null}

            {type === 'file' ? (
              <Dropzone
                height={dropZoneHeight}
                values={form?.values}
              />
            ) : null}

            {type === 'textEditor' ? (
              <TextEditor
                code={field.value}
                setFieldValue={setFieldValue}
              />
            ) : null}

            {!!options?.length && <MdOutlineKeyboardArrowDown onClick={toggleDropdown} className="absolute right-3 top-11 h-5 w-5 text-gray-500 cursor-pointer" />}

            {(type === 'password' && fieldName === 'password') && <>
              {showPassword ?
                <VisibilityOff onClick={togglePasswordVisibility} className={`absolute right-3 top-11 h-6 w-6 ${!isSignUp ? 'dark:text-gray-300' : ''} text-gray-500 cursor-pointer hover:text-gray-400`} />
                :
                <Visibility onClick={togglePasswordVisibility} className={`absolute right-3 top-11 h-6 w-6 ${!isSignUp ? 'dark:text-gray-300' : ''} text-gray-500 cursor-pointer hover:text-gray-400`} />}
            </>
            }
          </>
        )}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
    </div>
  );
};

export default InputField;