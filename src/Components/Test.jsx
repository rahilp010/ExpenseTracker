import React, { createContext } from 'react';
import { ToDo } from './ToDo';

export const Data = createContext();

const Test = () => {
    const name = 'John Doe';
    const age = 30;

    return (
        <Data.Provider value={{ name, age }}>
            <div>
                <ToDo />
            </div>
        </Data.Provider>
    );
};

export default Test;
