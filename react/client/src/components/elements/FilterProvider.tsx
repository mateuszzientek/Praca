import React, { createContext, useState, ReactNode } from 'react';

interface FilterContextType {
    selectedBrand: string;
    selectedCategory: string;
    selectedPrice: string;
    selectedMin: string;
    selectedMax: string;
    selectedSort: string;
    selectedSizes: Array<String>;
    setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedPrice: React.Dispatch<React.SetStateAction<string>>;
    setSelectedMin: React.Dispatch<React.SetStateAction<string>>;
    setSelectedMax: React.Dispatch<React.SetStateAction<string>>;
    setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
    setSelectedSizes: React.Dispatch<React.SetStateAction<Array<string>>>;
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
    setSelectedMin: () => { },
    setSelectedMax: () => { },
    setSelectedBrand: () => { },
    setSelectedCategory: () => { },
    setSelectedPrice: () => { },
    setSelectedSizes: () => { },
    setSelectedSort: () => { },
});

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedMin, setSelectedMin] = useState("");
    const [selectedMax, setSelectedMax] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [selectedSizes, setSelectedSizes] = useState<Array<string>>([]);

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
                setSelectedSort
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
