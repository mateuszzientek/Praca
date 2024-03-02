import React from 'react';

const renderPatch = (selectedPatch: any, style: string, patches: any) => {
    const patch = patches.find((patch: any) => patch.name === selectedPatch);

    if (patch) {
        return (
            <img
                src={patch.url}
                alt="Patch"
                className={style}
            />
        );
    }
};

export default renderPatch;