"use client";

import RecipeDetails, {
    RecipeDetailsProps,
} from "@/components/recipe/RecipeDetials";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { CookingPot, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function RecipePage() {
    const { user } = useUser();
    const [ingredients, setIngredients] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<RecipeDetailsProps | null>(null);

    function parseRecipe(input: string) {
        // Extract the JSON part of the input string
        const jsonPartMatch = input.match(/{(?:[^{}]|(?:R))*}/);

        if (!jsonPartMatch) {
            throw new Error("Invalid input format.");
        }

        // Parse the JSON string into a JavaScript object
        try {
            return JSON.parse(jsonPartMatch[0]);
        } catch (error) {
            throw new Error("Failed to parse JSON.");
        }
    }

    const handleGenerateRecipe = async () => {
        try {
            const response = await fetch("/api/recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredients }), // Fix: Wrap ingredients in an object
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseJson = await response.json();
            if (responseJson.error) {
                throw new Error(responseJson.error);
            }

            const recipe: RecipeDetailsProps = parseRecipe(responseJson.result);
            setRecipe(recipe);
        } catch (error: any) {
            setError(
                error.message ||
                    "An error occurred while generating the recipe."
            );
        }
    };

    useEffect(() => {
        if (!user?.id) {
            setError("User ID is not available.");
            return;
        }

        (async () => {
            try {
                const response = await fetch(
                    `/api/pantry/user/${user.id}/items`
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const json = await response.json();
                setIngredients(json.ingredients); // Convert array to comma-separated string if necessary
                setError(null);
            } catch (error: any) {
                setError(
                    error.message ||
                        "An error occurred while fetching the items."
                );
            }
        })();
    }, [user?.id]);

    return (
        <>
            {!recipe ? (
                <div className="w-full h-[calc(100vh-5rem)] max-w-2xl mx-auto text-balance">
                    <div className="flex flex-col justify-center items-center h-full">
                        <CookingPot size={40} className="text-foreground" />
                        <h3 className="mt-2 text-foreground text-sm font-semibold">
                            Generate Recipe
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by recipe.
                        </p>
                        <div className="mt-6">
                            <Button
                                onClick={handleGenerateRecipe}
                                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white"
                            >
                                <PlusIcon
                                    aria-hidden="true"
                                    className="-ml-0.5 mr-1.5 h-5 w-5"
                                />
                                Generate New Recipe
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <>{recipe && <RecipeDetails {...recipe} />}</>
            )}
        </>
    );
}
