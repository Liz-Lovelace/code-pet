import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { costs } from '../config';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function askAI(prompt, model) {
  const msg = await anthropic.messages.create({
    model: model == "opus" ? "claude-3-opus-20240229" : "claude-3-haiku-20240307",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  msg.inputCost = Math.round(msg.usage.input_tokens * costs[model].input);
  msg.outputCost = Math.round(msg.usage.output_tokens * costs[model].output);
  msg.totalCost = msg.inputCost + msg.outputCost;
  return msg;
}