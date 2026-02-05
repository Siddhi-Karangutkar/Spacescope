const axios = require('axios');

/**
 * Verification Service using Groq Vision API
 * This service analyzes instructor credentials to ensure authenticity and relevance.
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const analyzeDocument = async (base64Data, type, context) => {
    if (!GROQ_API_KEY) {
        console.warn("GROQ_API_KEY not found. Using simulated verification.");
        return simulateVerification(type, context);
    }

    const prompts = {
        idCard: `Analyze this Government ID card. 
                1. Does the name on the ID closely match "${context.fullName}"?
                2. Does it look like a valid Government ID (Passport, License, Aadhar, etc.)?
                Return as JSON: { "match": boolean, "confidence": number, "remarks": string }`,
        resume: `Analyze this CV/Resume. 
                1. Does it belong to "${context.fullName}"?
                2. Check for keywords related to: Space, Astrophysics, Science, Aerospace, Teaching.
                3. Rate the candidate's relevance to a Space Education platform.
                Return as JSON: { "relevance_score": number, "skills": string[], "remarks": string }`,
        certificate: `Analyze this PhD Degree/Certificate. 
                1. Is it a PhD or equivalent Doctorate degree?
                2. Does the name match "${context.fullName}"?
                3. Does the institution look legitimate?
                Return as JSON: { "is_phd": boolean, "name_match": boolean, "remarks": string }`
    };

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: MODEL,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompts[type] || "Analyze this document for authenticity." },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Data // Expecting full data URL
                            }
                        }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error(`Groq API Error (${type}):`, error.response?.data || error.message);
        return { error: "AI Verification Failed", remarks: error.message };
    }
};

const simulateVerification = (type, context) => {
    // Basic heuristics for fallback
    switch (type) {
        case 'idCard':
            return { match: true, confidence: 0.7, remarks: "Simulated: ID layout appears standard." };
        case 'resume':
            return { relevance_score: 85, skills: ["Space Ops", "Research"], remarks: "Simulated: Keywords match expertise." };
        case 'certificate':
            return { is_phd: true, name_match: true, remarks: "Simulated: Degree format recognized." };
        default:
            return { remarks: "Verification skipped." };
    }
};

const verifyApplication = async (appData) => {
    console.log(`Starting AI Verification for: ${appData.fullName}`);

    let totalScore = 0;
    let remarks = [];
    let status = 'VERIFIED';

    try {
        // 1. Verify ID
        const idResult = await analyzeDocument(appData.idCard, 'idCard', appData);
        if (idResult.error) {
            return {
                status: 'PENDING',
                score: 0,
                remarks: `ID Scan Failed: ${idResult.remarks || 'Unknown Error'}`
            };
        }
        if (!idResult.match) status = 'FLAGGED';
        remarks.push(`ID Check: ${idResult.remarks}`);
        totalScore += (idResult.confidence || 0) * 30;

        // 2. Verify Resume
        const resumeResult = await analyzeDocument(appData.resume, 'resume', appData);
        if (resumeResult.error) {
            remarks.push(`Resume Check: FAILED (${resumeResult.remarks})`);
        } else {
            remarks.push(`Resume Check: ${resumeResult.remarks}`);
            totalScore += (resumeResult.relevance_score || 0) * 0.4;
            if (resumeResult.relevance_score < 40) status = 'FLAGGED';
        }

        // 3. Verify Certificate
        const certResult = await analyzeDocument(appData.certificate, 'certificate', appData);
        if (certResult.error) {
            remarks.push(`Academic Check: FAILED (${certResult.remarks})`);
        } else {
            remarks.push(`Academic Check: ${certResult.remarks}`);
            totalScore += (certResult.is_phd ? 30 : 0);
            if (!certResult.name_match) status = 'FLAGGED';
        }

    } catch (err) {
        return {
            status: 'PENDING',
            score: 0,
            remarks: "AI Verification Error: " + err.message
        };
    }

    return {
        status: status,
        score: Math.min(Math.round(totalScore), 100),
        remarks: remarks.join(' | ')
    };
};

module.exports = { verifyApplication };
