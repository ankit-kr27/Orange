import React from "react";

const Loader = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-col">
                <div className="flex">
                    <div className="relative">
                        <div className="absolute h-12 w-12 rounded-full border-4 border-solid border-gray-200"></div>

                        <div className="border-primary absolute h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
