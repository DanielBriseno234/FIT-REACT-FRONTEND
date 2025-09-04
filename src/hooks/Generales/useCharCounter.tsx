import { useState } from 'react';

export const useCharCounter = (
    maxLength: number,
    initialValue = ""
) => {
    const [charCount, setCharCount] = useState(initialValue.length);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharCount(e.target.value.length);
    };

    const Counter = ({ className = '' }) => (
        <span className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-gray-400'} ${className}`}>
            {charCount}/{maxLength}
        </span>
    );

    return {
        charCount,
        handleChange,
        Counter
    };
};