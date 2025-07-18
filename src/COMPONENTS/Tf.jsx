import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config"; // adjust path as needed
import Tfquestion from "./Tfquestion";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Tf() {
    const [sectionTitle, setSectionTitle] = useState("");
    const [submittedTitle, setSubmittedTitle] = useState("");
    const [positiveScore, setPositiveScore] = useState("");
    const [negativeScore, setNegativeScore] = useState("");

    const checkTitle = async () => {
        try {
            const token = localStorage.getItem("token");
            const quizTitle = localStorage.getItem("quizTitle");
            if (!token) {
                alert("Unauthorized: No token found. Please log in again.");
                return false;
            }

            const response = await axios.post(
               `${BASE_URL}/check-title`,
                { title: sectionTitle, quizTitle },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.exists) {
                alert("Error: Title already exists. Choose a different title.");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error checking title:", error);
            alert("Failed to check title.");
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!sectionTitle.trim() || !positiveScore || !negativeScore) {
            alert("Please enter section title, positive score, and negative score.");
            return;
        }

        const isTitleValid = await checkTitle();
        if (!isTitleValid) {
            setSectionTitle("");
            setPositiveScore("");
            setNegativeScore("");
            return;
        }

        setSubmittedTitle(sectionTitle);
    };

    return (
        <div className="min-h-screen bg-white py-10 px-4 flex items-center justify-center">
            {!submittedTitle ? (
                <Card className="w-full max-w-xl shadow-lg border border-purple-200 rounded-2xl">
                    <CardContent className="py-8 px-6">
                        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">True / False Section</h2>

                        <div className="mb-4">
                            <Label htmlFor="sectionTitle" className="text-purple-700">
                                Section Title
                            </Label>
                            <Input
                                id="sectionTitle"
                                placeholder="Enter section title"
                                value={sectionTitle}
                                onChange={(e) => setSectionTitle(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <Label htmlFor="positiveScore" className="text-purple-700">
                                    Positive Score
                                </Label>
                                <Input
                                    id="positiveScore"
                                    type="number"
                                    placeholder="e.g., 1"
                                    value={positiveScore}
                                    onChange={(e) => setPositiveScore(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="negativeScore" className="text-purple-700">
                                    Negative Score
                                </Label>
                                <Input
                                    id="negativeScore"
                                    type="number"
                                    placeholder="e.g., -0.25"
                                    value={negativeScore}
                                    onChange={(e) => setNegativeScore(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-md">
                            Submit
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Tfquestion
                    title={submittedTitle}
                    positiveScore={positiveScore}
                    negativeScore={negativeScore}
                />
            )}
        </div>
    );
}
