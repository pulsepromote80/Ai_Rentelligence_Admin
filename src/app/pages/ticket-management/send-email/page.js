// export default SendNotification;
"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmail } from "@/app/redux/ticketSlice";
import Tiptap from '@/app/common/rich-text-editor'
import { toast } from 'react-toastify';

export const SendEmail = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.ticket);

  const [formData, setFormData] = useState({
    Subject: '',
    Body: '',
    FileUrl: ''
  });

  const [formErrors, setFormErrors] = useState({
    Subject: '',
    Body: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Ensure value is always a string
    const safeValue = value || '';
    setFormData(prev => ({
      ...prev,
      [name]: safeValue
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBodyChange = (htmlContent) => {
    // Ensure htmlContent is a string
    const safeContent = htmlContent || '';
    const plainText = typeof safeContent === 'string' ? safeContent.replace(/<[^>]*>/g, '') : '';
    setFormData(prev => ({
      ...prev,
      Body: safeContent // Keep HTML content for rich text editor
    }));

    // Clear body error when user starts typing
    if (formErrors.Body) {
      setFormErrors(prev => ({
        ...prev,
        Body: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      Subject: '',
      Body: ''
    };

    // Check if Subject exists and is a string before calling trim
    if (!formData.Subject || typeof formData.Subject !== 'string' || !formData.Subject.trim()) {
      errors.Subject = 'Subject is required';
    }

    // Check if Body exists and is a string before calling trim
    if (!formData.Body || typeof formData.Body !== 'string' || !formData.Body.trim()) {
      errors.Body = 'Body is required';
    }

    setFormErrors(errors);
    return !errors.Subject && !errors.Body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!validateForm()) {
      return;
    }

    // Transform form data to match API expected format
    const apiPayload = {
      subject: formData.Subject || '',
      body: formData.Body || '',
      fileUrl: formData.FileUrl || '',
      sendToAll: true // Based on API documentation, this should be true for sending to all users
    };

    const result = await dispatch(sendEmail(apiPayload));

    if (result?.payload?.statusCode === 200) {
      const { successCount, failedCount } = result.payload.data || {};
      toast.success(
        <div>
          <div className="font-semibold">Email sent successfully!</div>
          {/* <div className="mt-1 text-sm">
            <span className="text-green-600">Success: {successCount || 0}</span>
            {failedCount > 0 && (
              <span className="ml-2 text-red-600">Failed: {failedCount}</span>
            )}
          </div> */}
        </div>,
        {
          autoClose: failedCount > 0 ? 5000 : 3000,
        }
      );

      // Reset form after successful submission
      setFormData({ Subject: '', Body: '', FileUrl: '' });
      setFormErrors({ Subject: '', Body: '' });
    } else if (result?.error) {
      // Handle error from rejectWithValue
      toast.error(result.error || "Failed to send email!");
    } else {
      toast.error(result?.payload?.message || "Failed to send email!");
    }
  };

  return (
    <div className="w-full max-w-md min-h-screen px-4 py-6 mx-auto bg-white shadow-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl sm:min-h-0 sm:rounded-xl sm:my-8 sm:border sm:border-gray-200">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Send Email</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start p-3 mb-6 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
          <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="flex-1 break-words">{error}</span>
        </div>
      )}

      {/* Form with novalidate to disable browser validation */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="Subject" className="block mb-2 text-sm font-semibold text-gray-800">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="Subject"
            name="Subject"
            value={formData.Subject}
            onChange={handleInputChange}
            placeholder="Enter Subject"
            className="w-full px-4 py-3 text-base placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formErrors.Subject && (
            <p className="mt-1 text-sm text-red-600">{formErrors.Subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="Body" className="block mb-2 text-sm font-semibold text-gray-800">
            Body <span className="text-red-500">*</span>
          </label>
          <div className="overflow-hidden border border-gray-300 rounded-lg">
            <Tiptap
              value={formData.Body}
              onChange={handleBodyChange}
              placeholder="Type your notification message here..."
              className="min-h-[150px] text-base"
            />
          </div>
          {formErrors.Body && (
            <p className="mt-1 text-sm text-red-600">{formErrors.Body}</p>
          )}
        </div>

        {/* Image Field */}
        <div>
          <label htmlFor="FileUrl" className="block mb-2 text-sm font-semibold text-gray-800">
            File Url <span className="ml-1 font-normal text-gray-500"></span>
          </label>
          <input
            type="url"
            id="FileUrl"
            name="FileUrl"
            value={formData.FileUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 text-base placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-base font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Email...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Email
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendEmail;
