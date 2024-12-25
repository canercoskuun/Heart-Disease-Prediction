import React, { useState } from "react";
import axios from "axios";
import './App.css';

const PredictForm = () => {
    const [formData, setFormData] = useState({
        age: "",
        sex: "1",
        cp: "",
        trestbps: "",
        chol: "",
        fbs: "",
        restecg: "",
        thalach: "",
        exang: "",
        oldpeak: "",
        slope: "",
        ca: "",
        thal: ""
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null); // Clear error state on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every(value => value !== "");

        if (!isFormValid) {
            setError("Lütfen tüm alanları doldurduğunuzdan emin olun.");
            return;
        }

        setIsLoading(true);
        setPrediction(null);
        setError(null);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", {
                age: parseFloat(formData.age),
                sex: parseInt(formData.sex),
                cp: parseInt(formData.cp),
                trestbps: parseFloat(formData.trestbps),
                chol: parseFloat(formData.chol),
                fbs: parseInt(formData.fbs),
                restecg: parseInt(formData.restecg),
                thalach: parseFloat(formData.thalach),
                exang: parseInt(formData.exang),
                oldpeak: parseFloat(formData.oldpeak),
                slope: parseInt(formData.slope),
                ca: parseInt(formData.ca),
                thal: parseInt(formData.thal)
            });

            setPrediction(response.data.prediction);
        } catch (err) {
            setError("Bir hata oluştu: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            age: "",
            sex: "1",
            cp: "",
            trestbps: "",
            chol: "",
            fbs: "",
            restecg: "",
            thalach: "",
            exang: "",
            oldpeak: "",
            slope: "",
            ca: "",
            thal: ""
        });
        setPrediction(null);
        setError(null);
    };

    return (
        <div className="form-container">
            <h2>Tahmin Yapın</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Gender:
                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className="input-field"
                        aria-label="Cinsiyet seçimi"
                    >
                        <option value="1">Male(1)</option>
                        <option value="0">Female(0)</option>
                    </select>
                </label>

                {["age", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"].map((field) => (
                    <label key={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                        <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="input-field"
                            placeholder={`Lütfen ${field} değerini girin`}
                            aria-label={`${field} alanı`}
                        />
                    </label>
                ))}

                <div style={{ marginTop: "20px" }}>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? "Tahmin Yapılıyor..." : "Tahmin Yap"}
                    </button>
                    <button
                        type="button"
                        className="submit-button"
                        style={{
                            backgroundColor: "#e0e0e0",
                            color: "#333",
                            marginLeft: "10px"
                        }}
                        onClick={handleReset}
                    >
                        Temizle
                    </button>
                </div>
            </form>

            {isLoading && <p className="loading">Lütfen bekleyin...</p>}

            {error && (
                <div className="error">
                    <h3>Hata:</h3>
                    <p>{error}</p>
                </div>
            )}

            {prediction !== null && (
                <div className="result">
                    <h3>Model Tahmini:</h3>
                    <p>
                        {prediction == 0 ? "Kalp hastalığı yok" : "Kalp hastalığı var"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PredictForm;
