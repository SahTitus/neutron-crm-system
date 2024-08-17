'use client';
import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Mic from '@mui/icons-material/Mic';
import { RiEqualizerLine } from 'react-icons/ri';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Icon } from '@components/common/Icon';
import { useStateContext } from '@redux/StateProvider';

export const SearchBox = () => {
    const timeoutRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { settings } = useStateContext();

    const { transcript, listening, resetTranscript } = useSpeechRecognition();

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
    };

    const handleMicClick = () => {
        if (listening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleCloseModal = () => {
        stopListening();
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
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

    useEffect(() => {
        if (!isModalOpen && transcript) {
            setInputValue(transcript.trim());
            resetTranscript();
        }
    }, [isModalOpen, transcript, resetTranscript]);

    return (
        <div>
            <div>
                <div className="flex text-center w-full max-w-80 items-center border dark:border-none dark:bg-slate-700 shadow-slate-400 bg-slate-100 rounded-full px-4 py-1">
                    <Icon onClick={handleMicClick} ariaLabel={'Search icon'} className="text-gray-400 mr-2">
                        <SearchIcon />
                    </Icon>
                    <input
                        type="text"
                        placeholder="Search"
                        value={inputValue}
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

                    <Icon title='Filter' ariaLabel={'Filter icon'} className="text-gray-400 mr-1">
                        <RiEqualizerLine />
                    </Icon>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="flex flex-col bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg w-4/5 max-w-md">
                        <h2 className="text-lg font-bold mb-4">Listening...</h2>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                            <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                            <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                            <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                            <div className={`w-2 h-10 bg-green-500 ${listening ? 'animate-pulse' : ''}`}></div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200">{transcript}</p>
                        <button
                            className="mt-4 ml-auto bg-red-500 text-white px-4 py-2 rounded-full"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
