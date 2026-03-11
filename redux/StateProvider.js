"use client";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

//wrap our app and provide the Data layer
export const StateProvider = ({ children }) => {
  const pathname = usePathname();

  const [showToast, setShowToast] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [formType, setFormType] = useState("customer");
  const [base64String, setBase64String] = useState("");
  const [isEditProfile, setEditProfile] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [recepientEmail, setRecepientEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formItemToEdit, setFormItemToEdit] = useState(null);
  const [modalContentType, setModalContentType] = useState("");
  const [isSideModalOpen, setIsSideModalOpen] = useState(false);
  const [showAddToCartBtn, setShowAddToCartBtn] = useState(false);
  const [showLoaderOverlay, setShowLoaderOverlay] = useState(false);
  const [toastMsg, setToastMsg] = useState({ message: "", isError: false });
  const [toastPersist, setToastPersist] = useState(false);

  const [settings, setSettings] = useState({
    collapseSidebar: false,
    hideScrollToTop: false,
    hideVoiceAssistant: false,
  });
  const [isCollapsed, setIsCollapsed] = useState(settings.collapseSidebar);
  const [currentRoute, setCurrentRoute] = useState({
    label: "Dashboard",
    path: "" || "/",
  });
  // A boolean var to hide sidebar on the login page
  const hideSide = pathname.startsWith("/auth");
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleShowAuthForm = () => {
    setShowAuthForm((prev) => !prev);
  };

  const toggleSideModal = (type) => {
    setModalContentType(type);
    setIsSideModalOpen((prevState) => !prevState);

    if (!isSideModalOpen) {
      setShowAddToCartBtn(false);
    }
  };

  // Automatically close the toast after 5 seconds
  useEffect(() => {
    if (showToast && !toastPersist) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMsg({ message: "", isError: false });
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showToast, toastPersist]); // Run once on component mount

  return (
    <StateContext.Provider
      value={{
        toastMsg,
        hideSide,
        settings,
        formType,
        showToast,
        profileData,
        isCollapsed,
        base64String,
        showAuthForm,
        currentRoute,
        isEditProfile,
        formSubmitted,
        recepientEmail,
        formItemToEdit,
        isSideModalOpen,
        showAddToCartBtn,
        modalContentType,
        showLoaderOverlay,
        toastPersist,
        setSettings,
        setFormType,
        setToastMsg,
        setShowToast,
        setToastPersist,
        toggleSidebar,
        setProfileData,
        setEditProfile,
        toggleSideModal,
        setShowAuthForm,
        setCurrentRoute,
        setBase64String,
        setFormSubmitted,
        setRecepientEmail,
        setFormItemToEdit,
        toggleShowAuthForm,
        setShowLoaderOverlay,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

//Pull information from the data layer
export const useStateContext = () => useContext(StateContext);
