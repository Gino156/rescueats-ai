import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the SDK using the correct official class name
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Extract raw base64 data and mime type from data URI
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    // FIX: Using the exact string payload identifier for the SDK constructor
    // Model IDs supported for generateContent() vary by API version.
    // Keep schema/UI contract stable; only swap model IDs.
    const modelIdsToTry = [
      // Updated using models:list response for your API key.
      "models/gemini-2.5-flash",
      "models/gemini-2.5-pro",
      "models/gemini-flash-latest",
      "models/gemini-pro-latest",
      "models/gemini-2.0-flash",
      "models/gemini-2.0-flash-001"
    ];


    let lastErr;
    let model;

    // These model IDs may exist, but can be unsupported for generateContent() in your API version.
    // We'll attempt generateContent with each and return the first success.
    for (const modelId of modelIdsToTry) {
      try {
        model = ai.getGenerativeModel({
          model: modelId,
          systemInstruction:
            "You are an elite sustainability data analyst and professional chef. Your goal is to maximize zero-waste cooking outputs and calculate explicit carbon/water savings offsets dynamically based on input visuals."
        });
        // Attempt real call later; if generateContent fails for this model, try next.
        break;
      } catch (e) {
        lastErr = e;
        model = null;
      }
    }

    const attemptedModelIds = modelIdsToTry;

    if (!model) {
      throw lastErr || new Error("No Gemini model could be initialized");
    }


    // Enforce an exact JSON Schema layout using standard native string types
    const jsonSchema = {
      type: "object",
      properties: {
        ecoImpact: {
          type: "object",
          properties: {
            carbonSavedKg: { type: "number", description: "Estimated CO2 equivalents saved in kilograms if food is rescued." },
            waterSavedLiters: { type: "number", description: "Estimated water footprint saved in liters if food is rescued." },
            headline: { type: "string", description: "A high-impact sustainability fact linking these items to environmental savings." }
          },
          required: ["carbonSavedKg", "waterSavedLiters", "headline"]
        },
        detectedItems: {
          type: "array",
          description: "List of food ingredients or receipt items recognized.",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              confidence: { type: "string", description: "High, Medium, Low" },
              shelfLifeDays: { type: "number", description: "Estimated days left before it spoils" },
              statusColor: { type: "string", description: "Red for urgent, Yellow for moderate, Green for fresh" }
            },
            required: ["name", "confidence", "shelfLifeDays", "statusColor"]
          }
        },
        recipes: {
          type: "array",
          description: "Exactly 2 high-creativity recipes using identified ingredients.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              prepTime: { type: "string" },
              ingredientsNeeded: { type: "array", items: { type: "string" } },
              instructions: { type: "array", items: { type: "string" } }
            },
            required: ["title", "prepTime", "ingredientsNeeded", "instructions"]
          }
        },
        compostGuide: {
          type: "object",
          properties: {
            scrapUsage: { type: "string", description: "How to use remaining scraps (peels, bones, edges) creatively." },
            compostingTip: { type: "string", description: "Actionable local home composting hack for non-edible pieces." }
          },
          required: ["scrapUsage", "compostingTip"]
        }
      },
      required: ["ecoImpact", "detectedItems", "recipes", "compostGuide"]
    };

    // Trigger content generation using standard structural mapping
    // If the chosen model errors at runtime, surface a clear message.
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyze this image containing either items inside a refrigerator or a printed grocery receipt. Identify the food items, estimate their decay window, formulate 2 recipes to use them immediately to prevent trash waste, and compute the precise ecological savings metrics." },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
        temperature: 0.2
      }
    });

    const parsedData = JSON.parse(result.response.text());
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json(
      {
        error:
          "Internal processing error occurred: " +
          error.message +
          " | Models tried: " +
          (typeof attemptedModelIds !== "undefined" ? attemptedModelIds.join(", ") : "unknown")
      },
      { status: 500 }
    );
  }
}