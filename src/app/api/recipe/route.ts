import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
    const payload = await request.json();
    const { ingredients } = payload;
    try {
        const chatCompletion = await getGroqChatCompletion(ingredients);
        const result = chatCompletion.choices[0]?.message?.content || "";
        return NextResponse.json({ result });
    } catch (error) {
        console.error("Error fetching Groq chat completion:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}

export async function getGroqChatCompletion(ingredients: string) {
    try {
        const r = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a world-class chef specializing in creating delicious recipes from available ingredients. Your task is to suggest a recipe based on the provided ingredients, ensuring it's both appealing and practical.",
                },
                {
                    role: "user",
                    content: `Create a recipe using some or all of these ingredients: ${ingredients} please use this items only. 

Please format your response in JSON with the following structure:

{
    "recipeName": "[Recipe Name]",
    "difficultyLevel": "[Difficulty Level]",
    "cookTime": "[Cook Time]",
    "prepTime": "[Preparation Time]",
    "totalTime": "[Total Time]",
    "numberOfServings": "[Number of Servings]",
    "cuisineType": "[Cuisine Type]",
    "dietaryRestrictions": ["[Dietary Restriction 1]", "[Dietary Restriction 2]"],
    "ingredients": [
        "[Ingredient 1 with quantity]",
        "[Ingredient 2 with quantity]",
        "[Ingredient 3 with quantity]"
    ],
    "instructions": [
        "Step 1: [Instruction]",
        "Step 2: [Instruction]",
        "Step 3: [Instruction]"
    ],
    "chefNotes": "[Any additional tips, variations, or serving suggestions]"
}

Ensure the recipe is creative, uses the ingredients efficiently, and provides clear instructions. If there are common pantry items not listed in the ingredients (like salt, pepper, or oil), you can assume they are available and include them in the recipe.`,
                },
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null,
        });
        return r;
    } catch (error) {
        console.error("Error during Groq chat completion:", error);
        throw error;
    }
}
