// MyForm.js
import React from 'react';
import '../pages/details.css';
function MyForm({ formDataHabits, handleChange }) {
    return (
        <div>
            <h3>Habitude De Vie</h3>
             {/* tabagisme */}
             <div className="condition-section">
                    <h3>Tabagisme</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answerhab-1"
                            value="oui"
                            checked={formDataHabits[1].answerhab === 'oui'}
                            onChange={(e) => handleChange(1, 'answerhab', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answerhab-1"
                            value="non"
                            checked={formDataHabits[1].answerhab === 'non'}
                            onChange={(e) => handleChange(1, 'answerhab', e.target.value)}
                        />
                    </label>
                    {formDataHabits[1].answerhab === 'oui' && (
                        <div>
                            <label>
                                Quantité:
                                <input
                                    type="number"
                                    value={formDataHabits[1].quantite}
                                    onChange={(e) => handleChange(1, 'quantite', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>
                <div className="condition-section">
                    <h3>Consommation De Drogues/Cannabis</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answerhab-2"
                            value="oui"
                            checked={formDataHabits[2].answerhab === 'oui'}
                            onChange={(e) => handleChange(2, 'answerhab', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answerhab-2"
                            value="non"
                            checked={formDataHabits[2].answerhab === 'non'}
                            onChange={(e) => handleChange(2, 'answerhab', e.target.value)}
                        />
                    </label>
                    {formDataHabits[2].answerhab === 'oui' && (
                        <div>
                            <label>
                                Quantité:
                                <input
                                    type="number"
                                    value={formDataHabits[2].quantite}
                                    onChange={(e) => handleChange(2, 'quantite', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>
                <div className="condition-section">
                    <h3>Alcool</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answerhab-3"
                            value="oui"
                            checked={formDataHabits[3].answerhab === 'oui'}
                            onChange={(e) => handleChange(3, 'answerhab', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answerhab-3"
                            value="non"
                            checked={formDataHabits[3].answerhab === 'non'}
                            onChange={(e) => handleChange(3, 'answerhab', e.target.value)}
                        />
                    </label>
                    {formDataHabits[3].answerhab === 'oui' && (
                        <div>
                            <label>
                                Quantité:
                                <input
                                    type="number"
                                    value={formDataHabits[3].quantite}
                                    onChange={(e) => handleChange(3, 'quantite', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>
        </div>
    );
}

export default MyForm;
