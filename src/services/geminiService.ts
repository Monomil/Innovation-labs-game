/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState, ZONES } from "../types";

export async function getParentalInsights(gameState: GameState): Promise<string> {
  const { moodLogs, playerName, level, progress } = gameState;
  
  if (moodLogs.length === 0) {
    return "No emotional data recorded yet. Encourage your child to share how they feel in the Magical Journal!";
  }

  const moodSummary = moodLogs.slice(-10).map(m => m.mood).join(", ");
  const skillSummary = progress.map(id => ZONES.find(z => z.id === id)?.name || id).join(", ");

  const prompt = `
    You are an expert child development psychologist and emotional intelligence coach.
    Analyze this gameplay data for a child named ${playerName}.
    
    Current Level: ${level}
    Recent Moods (last 10): ${moodSummary}
    Skills Explored: ${skillSummary}
    
    Provide a supportive, professional, and actionable summary for the parent. 
    Focus on:
    1. A positive observation about their emotional range.
    2. A specific "conversation starter" for the parent.
    3. A simple real-world activity to reinforce their learning.
    
    Keep it under 150 words. Be encouraging and gentle.
  `;

  try {
    const response = await fetch("/api/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI insights");
    }

    const data = await response.json();
    return data.text || "Unable to generate insights at this moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "The AI guide is resting. Please check back later for new insights!";
  }
}
