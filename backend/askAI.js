import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { costs } from '../config.js';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function askAI(systemPrompt, prompt, model) {
  console.log('asking ai (not streaming)');
  return await anthropic.messages.create({
    model: model == 'opus' ? 'claude-3-opus-20240229' : 'claude-3-haiku-20240307',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });
}

export async function streamAskAI(systemPrompt, prompt, model) {
  const stream = await anthropic.messages.create({
    model: model == 'opus' ? 'claude-3-opus-20240229' : 'claude-3-haiku-20240307',
    max_tokens: 4000,
    system: systemPrompt,
    stream: true,
    messages: [{ role: 'user', content: prompt }],
  });

  let streamObject = {
    text: '',
    inputCost: 0,
    outputCost: 0,
    status: 'connected',
  };

  streamIntoObject(streamObject, stream, costs[model]);

  return streamObject;
}

async function streamIntoObject(object, stream, costs) {
  for await (const part of stream) {
    switch (part.type) {
    case 'message_start':
      object.status = 'streaming...';
      object.inputCost = costs.input * part.message.usage.input_tokens;
      break;

    case 'content_block_delta':
      object.text += part.delta.text;
      break;

    case 'message_delta':
      object.status = 'done';
      object.outputCost = costs.output * part.usage.output_tokens;
      break;

    default:
      continue;
    }
  }
}