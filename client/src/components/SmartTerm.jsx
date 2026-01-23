import React from 'react';
import { getDefinition } from '../data/spaceTerms';
import './SmartTerm.css';

/**
 * Wraps a term and displays a tooltip definition on hover.
 * If definition is not found, acts as a normal span (or warns in dev).
 * 
 * @param {string} term - The specific term to look up in the dictionary.
 * @param {string} [display] - Optional text to display instead of the term itself.
 * @param {string} [customDef] - Optional override definition.
 */
const SmartTerm = ({ term, display, customDef }) => {
    const definition = customDef || getDefinition(term);
    const text = display || term;

    if (!definition) {
        return <span>{text}</span>;
    }

    return (
        <span className="smart-term">
            {text}
            <span className="smart-tooltip">
                <strong className="block mb-1">{term}</strong>
                {definition}
            </span>
        </span>
    );
};

export default SmartTerm;
