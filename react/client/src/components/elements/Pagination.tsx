import React, { Dispatch, SetStateAction, useContext } from 'react';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import classnames from 'classnames';
import { ThemeContext } from '../elements/ThemeContext';


interface PaginationProps {
    page: number;
    pages: number;
    changePage: Dispatch<SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ page, pages, changePage }) => {

    const { theme, setTheme } = useContext(ThemeContext);

    const buttonStyles = {
        base: 'py-2 px-4 border-2 border-black/80 dark:border-white',
        disabled: 'py-2 px-4 border-2 border-black/80 opacity-50 dark:border-white ',
    };

    const numberStyles = {
        base: 'text-black dark:text-white font-bold',
        disabled: 'font-normal',
    };


    let middlePagination;
    if (pages <= 5) {
        middlePagination = [...Array(pages)].map((_, idx) => {
            return (
                <button className={page !== idx + 1 ? classnames(numberStyles.base) : classnames(numberStyles.disabled)} key={idx + 1} onClick={() => changePage(idx + 1)} disabled={page === idx + 1}>
                    {idx + 1}
                </button>
            );
        });
    }
    else {
        const startValue = Math.floor((page - 1) / 5) * 5
        middlePagination = (
            <>
                {[...Array(5)].map((_, idx) => (
                    <button className={page !== startValue + idx + 1 ? classnames(numberStyles.base) : classnames(numberStyles.disabled)} key={startValue + idx + 1} onClick={() => changePage(startValue + idx + 1)} disabled={page === startValue + idx + 1}>
                        {startValue + idx + 1}
                    </button>
                ))}

                <button >...</button>
                <button className={classnames(numberStyles.base)} onClick={() => changePage(pages)}>{pages}</button>
            </>
        )

        if (page > 5) {
            if (pages - page >= 5) {
                middlePagination = (
                    <>
                        <button className={classnames(numberStyles.base)} onClick={() => changePage(1)}>1</button>
                        <button>...</button>
                        <button className={classnames(numberStyles.base)} onClick={() => changePage(startValue)}>{startValue}</button>
                        {[...Array(5)].map((_, idx) => (
                            <button className={page !== startValue + idx + 1 ? classnames(numberStyles.base) : classnames(numberStyles.disabled)} key={startValue + idx + 1} onClick={() => changePage(startValue + idx + 1)} disabled={page === startValue + idx + 1}>
                                {startValue + idx + 1}
                            </button>
                        ))}

                        <button>...</button>
                        <button className={classnames(numberStyles.base)} onClick={() => changePage(pages)}>{pages}</button>
                    </>
                )
            } else {
                let amountLeft = pages - page + 5
                middlePagination = (
                    <>
                        <button className={classnames(numberStyles.base)} onClick={() => changePage(1)}>1</button>
                        <button>...</button>
                        <button className={classnames(numberStyles.base)} onClick={() => changePage(startValue)}>{startValue}</button>
                        {[...Array(amountLeft)].map((_, idx) => (
                            <button className={pages < startValue + idx + 1 ? "hidden" : page !== startValue + idx + 1 ? classnames(numberStyles.base) : classnames(numberStyles.disabled)} key={startValue + idx + 1} onClick={() => changePage(startValue + idx + 1)} disabled={page === startValue + idx + 1} >
                                {startValue + idx + 1}
                            </button>
                        ))}

                    </>
                )
            }
        }
    }

    return pages > 1 ? (
        <div className='flex justify-center px-12 space-x-8 mt-10'>
            <button className={page !== 1 ? classnames(buttonStyles.base) : classnames(buttonStyles.disabled)} disabled={page === 1} onClick={() => changePage(page => page - 1)}>
                <AiOutlineLeft color={theme === 'dark' ? "white" : "black"} />
            </button>
            {middlePagination}
            <button className={page !== pages ? classnames(buttonStyles.base) : classnames(buttonStyles.disabled)} disabled={page === pages} onClick={() => changePage(page => page + 1)}>
                < AiOutlineRight color={theme === 'dark' ? "white" : "black"} />
            </button>
        </div>
    ) : null;
};

export default Pagination;