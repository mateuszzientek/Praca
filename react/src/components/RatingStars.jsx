import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function RatingStars(props) {

    switch (props.rating) {
        case 0.5:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStarHalfAlt />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
            </div>)

        case 1:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
            </div>)

        case 1.5:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStarHalfAlt />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
            </div>)

        case 2:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
            </div>)

        case 2.5:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
                <FaRegStar />
                <FaRegStar />
            </div>)

        case 3:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaRegStar />
                <FaRegStar />
            </div>)

        case 3.5:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
                <FaRegStar />
            </div>)

        case 4:
            return (<div className="flex justify-center mb-6 space-x-1 ">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaRegStar />
            </div>)

        case 4.5:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
            </div>)

        default:
            return (<div className="flex justify-center mb-6 space-x-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
            </div>)
    }
}
export default RatingStars;