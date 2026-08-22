const https = require('https');

// Calls Google Gemini API to generate performance insights.
// Falls back to a rule-based summary if the API key is missing or the call fails,
// so the feature still works during local development/demo.
const generateAIInsights = async (employeeData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are an HR performance analyst assistant. Analyze this employee's performance data
and respond ONLY with valid JSON (no markdown, no code fences) in this exact shape:
{
  "summary": "2-3 sentence overview",
  "strengths": ["short strength 1", "short strength 2"],
  "weaknesses": ["short weakness 1", "short weakness 2"],
  "productivitySuggestions": ["suggestion 1", "suggestion 2"],
  "improvementRecommendations": ["recommendation 1", "recommendation 2"],
  "suggestedGoals": ["goal 1", "goal 2"]
}

Employee performance data:
- Task completion score: ${employeeData.taskCompletionScore}%
- Attendance score: ${employeeData.attendanceScore}%
- On-time delivery score: ${employeeData.onTimeDeliveryScore}%
- Productivity score: ${employeeData.productivityScore}%
- Overall score: ${employeeData.overallScore}%
- Completed tasks: ${employeeData.completedTasks}
- Overdue tasks: ${employeeData.overdueTasks}
- Leaves taken this period: ${employeeData.leavesTaken}

Remember: these are recommendations for HR review only, not automatic employment decisions.
`;

  if (!apiKey) {
    return ruleBasedInsights(employeeData);
  }

  try {
    const responseText = await callGemini(apiKey, prompt);
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return { ...parsed, generatedAt: new Date() };
  } catch (error) {
    console.error('Gemini AI insights failed, using fallback:', error.message);
    return ruleBasedInsights(employeeData);
  }
};

// Raw HTTPS call to the Gemini generateContent endpoint
const callGemini = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) return reject(new Error('No content returned from Gemini'));
          resolve(text);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

// Fallback used if Gemini key isn't set / API fails - keeps the feature functional
const ruleBasedInsights = (data) => {
  const strengths = [];
  const weaknesses = [];

  if (data.taskCompletionScore >= 75) strengths.push('Consistently completes assigned tasks');
  else weaknesses.push('Task completion rate needs improvement');

  if (data.attendanceScore >= 90) strengths.push('Excellent attendance record');
  else weaknesses.push('Attendance could be more consistent');

  if (data.onTimeDeliveryScore >= 80) strengths.push('Delivers work on or before deadlines');
  else weaknesses.push('Frequently misses task deadlines');

  if (data.productivityScore >= 75) strengths.push('High overall productivity');
  else weaknesses.push('Productivity is below target');

  return {
    summary: `This employee has an overall performance score of ${data.overallScore}%, based on task completion, attendance, on-time delivery, and productivity.`,
    strengths: strengths.length ? strengths : ['No standout strengths identified yet'],
    weaknesses: weaknesses.length ? weaknesses : ['No major weaknesses identified'],
    productivitySuggestions: [
      'Break large tasks into smaller milestones to track progress better',
      'Use daily check-ins to stay aligned with priorities',
    ],
    improvementRecommendations: [
      'Set clear weekly goals with the manager',
      'Request feedback earlier in the task lifecycle',
    ],
    suggestedGoals: [
      'Improve on-time task delivery by 10% next review period',
      'Maintain attendance above 95%',
    ],
    generatedAt: new Date(),
  };
};

module.exports = { generateAIInsights };
