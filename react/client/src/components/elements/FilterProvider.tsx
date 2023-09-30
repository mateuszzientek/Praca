import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface FilterContextType {
    selectedBrand: string;
    selectedCategory: string;
    selectedPrice: string;
    selectedMin: string;
    selectedMax: string;
    currentMin: string;
    currentMax: string;
    selectedSort: string;
    searchTerm: string;
    selectedSizes: Array<String>;
    setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedPrice: React.Dispatch<React.SetStateAction<string>>;
    setSelectedMin: React.Dispatch<React.SetStateAction<string>>;
    setSelectedMax: React.Dispatch<React.SetStateAction<string>>;
    setCurrentMin: React.Dispatch<React.SetStateAction<string>>;
    setCurrentMax: React.Dispatch<React.SetStateAction<string>>;
    setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
    setSelectedSizes: React.Dispatch<React.SetStateAction<Array<string>>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

interface FilterProviderProps {
    children: ReactNode;
}

export const FilterContext = createContext<FilterContextType>({
    selectedBrand: 'All',
    selectedPrice: '',
    selectedCategory: '',
    selectedMin: "",
    selectedMax: "",
    selectedSizes: [],
    selectedSort: "",
    searchTerm: '',
    currentMin: "",
    currentMax: '',
    setSelectedMin: () => { },
    setSelectedMax: () => { },
    setCurrentMin: () => { },
    setCurrentMax: () => { },
    setSelectedBrand: () => { },
    setSelectedCategory: () => { },
    setSelectedPrice: () => { },
    setSelectedSizes: () => { },
    setSelectedSort: () => { },
    setSearchTerm: () => { },
});

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedMin, setSelectedMin] = useState("");
    const [selectedMax, setSelectedMax] = useState("");
    const [currentMin, setCurrentMin] = useState("");
    const [currentMax, setCurrentMax] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSizes, setSelectedSizes] = useState<Array<string>>([]);


    useEffect(() => {
        // Check if filters exist in localStorage
        const searchTerm = localStorage.getItem('searchTerm');
        const savedFilters = localStorage.getItem('shopFilters');
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            setSelectedBrand(parsedFilters.selectedBrand || 'All');
            setSelectedCategory(parsedFilters.selectedCategory || '');
            setSelectedPrice(parsedFilters.selectedPrice || '');
            setCurrentMax(parsedFilters.currentMax || '')
            setCurrentMin(parsedFilters.currentMin || '')
            setSelectedMax(parsedFilters.selectedMax || '')
            setSelectedMin(parsedFilters.selectedMin || '')
            setSelectedSizes(parsedFilters.selectedSizes || []);
            setSelectedSort(parsedFilters.selectedSort || '');
        }
        setSearchTerm(searchTerm || '');

    }, []);

    return (
        <FilterContext.Provider
            value={{
                selectedBrand,
                setSelectedBrand,
                selectedCategory,
                setSelectedCategory,
                selectedPrice,
                setSelectedPrice,
                selectedMin,
                setSelectedMin,
                selectedMax,
                setSelectedMax,
                selectedSizes,
                setSelectedSizes,
                selectedSort,
                setSelectedSort,
                searchTerm,
                setSearchTerm,
                currentMax,
                setCurrentMax,
                currentMin,
                setCurrentMin
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
