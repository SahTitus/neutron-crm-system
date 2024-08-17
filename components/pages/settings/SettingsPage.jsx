'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@components/features/ThemeToggle';
import Image from 'next/image';
import { routes } from '@lib/routes';
import { useStateContext } from '@redux/StateProvider';

const SettingsPage = ({ user }) => {
	const router = useRouter();

	const { settings, setSettings, setEditProfile, setProfileData } = useStateContext();

	const [isInitialized, setIsInitialized] = useState(false); // New state to track initialization

	// Retrieve settings from local storage when the component mounts
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedSettings = localStorage.getItem('userSettings');
			if (storedSettings) {
				try {
					const parsedSettings = JSON.parse(storedSettings);
					setSettings(parsedSettings);
				} catch (error) {
					console.error('Failed to parse settings from local storage:', error);
				}
			}
			setIsInitialized(true); // Mark as initialized
		}
	}, []);

	// Store settings in local storage whenever they change, but only after initial load
	useEffect(() => {
		if (typeof window !== 'undefined' && isInitialized) {
			try {
				localStorage.setItem('userSettings', JSON.stringify(settings));
			} catch (error) {
				console.error('Failed to store settings in local storage:', error);
			}
		}
	}, [settings, isInitialized]); // Depend on isInitialized

	const handleSettingChange = (setting) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			[setting]: !prevSettings[setting],
		}));
	};

	const handleEditProfile = () => {
		setEditProfile(true);
		setProfileData(user);
		router.push(`${routes.auth}?id=${user?._id}`);
	};

	return (
		<div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center items-center">
			<div className="w-full min-w-[500px] max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
				{/* Profile Section */}
				<div className="flex flex-col items-center p-6 bg-gray-200 dark:bg-gray-700">
					<Image
						className="rounded-full object-cover shadow-md"
						src={user?.image}
						alt={`${user?.firstName} ${user?.lastName}'s image`}
						width={100}
						height={100}
						priority
					/>
					<h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</h2>
					<p className="text-sm text-gray-600 dark:text-gray-300">{user?.jobTitle}</p>
					<p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
					<p className="text-sm text-gray-600 dark:text-gray-300">{user?.phoneNumber}</p>
					<button
						className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
						onClick={handleEditProfile}
					>
						<span className="ml-2">Edit Profile</span>
					</button>
				</div>

				{/* Company Information */}
				<div className="flex flex-col p-6 bg-gray-100 dark:bg-gray-800 gap-4">
					<div className="flex items-center gap-2 text-center">
						<span className="block text-sm font-medium text-gray-600 dark:text-gray-400">Company</span>
						<span className="block text-base text-gray-900 dark:text-white">{user?.company.companyName || 'N/A'}</span>
					</div>
					<div className="flex items-center gap-2 text-center">
						<span className="block text-sm font-medium text-gray-600 dark:text-gray-400">Industry</span>
						<span className="block text-base text-gray-900 dark:text-white">{user?.company.industry}</span>
					</div>
					<div className="flex items-center gap-2 text-center">
						<span className="block text-sm font-medium text-gray-600 dark:text-gray-400">Location</span>
						<span className="block text-base text-gray-900 dark:text-white">{`${user?.company.town}, ${user?.company.region}, ${user?.company.country}`}</span>
					</div>
				</div>

				{/* Settings Section */}
				<div className="p-6 bg-white dark:bg-gray-800">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>

					<div className="space-y-4">
						{/* Theme Toggle */}
						<div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
							<label className="text-gray-700 dark:text-gray-300 font-medium">Theme</label>
							<ThemeToggle isSwitch={false} />
						</div>

						{/* Collapse Sidebar */}
						<div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
							<label className="text-gray-700 dark:text-gray-300 font-medium">Collapse Sidebar</label>
							<input
								type="checkbox"
								checked={settings.collapseSidebar}
								onChange={() => handleSettingChange('collapseSidebar')}
								className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						{/* Hide Scroll-to-Top Button */}
						<div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
							<label className="text-gray-700 dark:text-gray-300 font-medium">Hide Scroll-to-Top Button</label>
							<input
								type="checkbox"
								checked={settings.hideScrollToTop}
								onChange={() => handleSettingChange('hideScrollToTop')}
								className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
							/>
						</div>

						{/* Hide Voice Assistant */}
						<div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
							<label className="text-gray-700 dark:text-gray-300 font-medium">Hide Voice Assistant</label>
							<input
								type="checkbox"
								checked={settings.hideVoiceAssistant}
								onChange={() => handleSettingChange('hideVoiceAssistant')}
								className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;