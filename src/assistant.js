export default {
  name: "Bird hotline caller",
  voice: {
    voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d",
    provider: "cartesia",
  },
  model: {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
                trigger the dtmf tool with 1.
                You are an excellent listener who can not talk. 
                You love birds, and are calling for information about birds. 
                Do not say anything. Do not leave a message.
                Do not hang up until the end of the message.`,
      },
    ],
    provider: "openai",
    maxTokens: 250,
    temperature: 0.3,
    knowledgeBase: {
      topK: 2,
      fileIds: ["30b6dec4-735b-42eb-911a-2d98dbf2bb58"],
      provider: "canonical",
    },
  },
  voicemailMessage: "No birds to report, thanks!",
  endCallFunctionEnabled: false,
  transcriber: {
    model: "nova-2",
    language: "en",
    provider: "deepgram",
  },
  clientMessages: [
    "transcript",
    "hang",
    "function-call",
    "speech-update",
    "metadata",
    "conversation-update",
  ],
  serverMessages: [
    "end-of-call-report",
    "status-update",
    "hang",
    "function-call",
  ],
  responseDelaySeconds: 1,
  dialKeypadFunctionEnabled: true,
  endCallPhrases: ["Leave a message"],
  // firstMessageMode: "assistant-waits-for-user",
  llmRequestDelaySeconds: 2,
  numWordsToInterruptAssistant: 2,
  backgroundSound: "off",
  analysisPlan: {
    structuredDataPrompt:
      "You will be given a call transcript. Extract the bird sightings, who saw them, and where they were seen.",
    structuredDataSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
        },
        birds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              species: {
                description: "The kind of bird",
                type: "string",
              },
              location: {
                type: "string",
              },
              day: {
                type: "string",
              },
              count: {
                type: "number",
                description: "The number of birds seen",
              },
              reporter: {
                description: "The person who reported the bird",
                type: "string",
              },
            },
          },
        },
      },
    },
    successEvaluationPrompt:
      "You are an expert call evaluator. The call succeeded if there were birds reported.",
    successEvaluationRubric: "PassFail",
  },
};
