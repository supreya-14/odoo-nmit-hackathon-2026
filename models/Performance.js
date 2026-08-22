const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    taskCompletionScore: { type: Number, default: 0 },
    attendanceScore: { type: Number, default: 0 },
    onTimeDeliveryScore: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    managerFeedback: { type: String, default: '' },
    aiInsights: {
      summary: { type: String, default: '' },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      productivitySuggestions: [{ type: String }],
      improvementRecommendations: [{ type: String }],
      suggestedGoals: [{ type: String }],
      generatedAt: { type: Date },
    },
    reviewPeriod: { type: String, default: () => new Date().toISOString().slice(0, 7) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Performance', performanceSchema);
