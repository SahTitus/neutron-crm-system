'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Mic from '@mui/icons-material/Mic';
import { RiEqualizerLine } from 'react-icons/ri';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Icon } from '@components/common/Icon';
import { useStateContext } from '@redux/StateProvider';
import { FilterMenu } from '@components/common/FilterMenu';
import { initialFilters } from '@lib/constants/filters';
import { getSearchResults } from '@lib/getSearchResults';
import { logger } from '@utils/helpers/log';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQueryDataFailure, fetchQueryDataStart, fetchQueryDataSuccess } from '@redux/features/querySlice';
import { useSearchParams, useRouter } from 'next/navigation';
import { Thinking } from '@components/common/loaders/Thinking';

const SearchBox = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const timeoutRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    // Extract query from URL
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [searchTerm, setSearchTerm] = useState("");

    const { toggleSideModal, settings, isSideModalOpen, } = useStateContext();
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const user = useSelector((state) => state.auth.user);

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
        setIsModalOpen(true);
        resetTimeout();
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        setIsModalOpen(false);
        clearTimeout(timeoutRef.current);
        // Set search term only after stopping listening
        setSearchTerm(transcript.trim());
    };

    const handleMicClick = () => {
        if (listening) {
            stopListening();
        } else {
            setSearchTerm("")
            startListening();
        }
    };

    const handleCloseModal = () => {
        stopListening();
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const resetTimeout = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (listening) {
                stopListening();
            }
        }, 3000); // 3 seconds of inactivity
    };

    useEffect(() => {
        if (listening) {
            resetTimeout();
        }
    }, [transcript]);

    const handleFilter = (event) => {
        setAnchorEl(event.currentTarget); // Open the menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close the menu
    };

    const handleSearch = async (event) => {
        event?.preventDefault();

        // Do nothing if the searchTerm is empty
        if (!!searchTerm?.trim()?.length) {
            if (!isSideModalOpen) {
                toggleSideModal("searchResults");
            }

            router.push(`?q=${searchTerm}`);

            dispatch(fetchQueryDataStart());

            try {
                const data = await getSearchResults(searchTerm, filters, user?.companyId);
                dispatch(fetchQueryDataSuccess(data));
            } catch (error) {
                dispatch(fetchQueryDataFailure(error.message));
                logger(error.message);
            }
        };
    };

    useEffect(() => {
        if (!isModalOpen && !!searchTerm?.length) {
            handleSearch();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (!!query?.length) {
            setSearchTerm(query)
        }
    }, [query]);


    return (
        <Suspense>
            <form onSubmit={handleSearch}>
                <div>
                    <div className="flex text-center w-full max-w-80 items-center border border-gray-300 dark:border-none dark:bg-slate-700 shadow-slate-400 bg-white rounded-full px-4 py-1">
                        <Icon title="Search" onClick={handleSearch} ariaLabel={'Search icon'} className="text-gray-400 mr-2">
                            <SearchIcon />
                        </Icon>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleInputChange}
                            className="outline-none bg-transparent text-gray-700 dark:text-gray-200 w-full"
                        />
                        {!settings?.hideVoiceAssistant &&
                            <Icon
                                title='Voice Assistant'
                                onClick={handleMicClick}
                                ariaLabel={'Microphone icon'}
                                className="text-gray-400 mr-1">
                                <Mic />
                            </Icon>}

                        <Icon title='Filter' ariaLabel={'Filter icon'} onClick={handleFilter} className="text-gray-400 mr-1">
                            <RiEqualizerLine />
                        </Icon>
                    </div>
                </div>
                <FilterMenu
                    filters={filters}
                    anchorEl={anchorEl}
                    setFilters={setFilters}
                    onClose={handleMenuClose}
                    initialFilters={initialFilters}
                />

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="flex flex-col bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg w-4/5 max-w-md">
                            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Listening...</h2>
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                                <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                                <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                                <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                                <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200">{transcript}</p>
                            <button
                                className="mt-4 ml-auto bg-red-500 text-white px-4 py-2 rounded-full"
                                onClick={handleCloseModal}
                                aria-label='Close voice modal'
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </Suspense>
    );
};

export default SearchBox;