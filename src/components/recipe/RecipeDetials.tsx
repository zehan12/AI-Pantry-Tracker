import React from "react";
import { Badge } from "../ui/badge";
import {
    ChefHat,
    Clock,
    CookingPot,
    Users,
    Utensils,
    Vegan,
} from "lucide-react";
import { RoughNotation } from "react-rough-notation";

export interface RecipeDetailsProps {
    recipeName: string;
    difficultyLevel: string;
    cookTime: string;
    prepTime: string;
    totalTime: string;
    numberOfServings: string;
    cuisineType: string;
    dietaryRestrictions: string[];
    ingredients: string[];
    instructions: string[];
    chefNotes: string;
}

export const RecipeDetails: React.FC<RecipeDetailsProps> = ({
    recipeName,
    difficultyLevel,
    cookTime,
    prepTime,
    totalTime,
    numberOfServings,
    cuisineType,
    dietaryRestrictions,
    ingredients,
    instructions,
    chefNotes,
}) => {
    return (
        <>
            <div className="my-10 max-w-4xl mx-auto border-[1px] rounded-3xl shadow-2xl p-10">
                <div className="flex flex-col justify-center items-center gap-3">
                    <h4 className="text-foreground font-semibold text-2xl">
                        Recipe Suggestion
                    </h4>
                    <h2 className="text-foreground font-semibold text-3xl">
                        <RoughNotation
                            type="underline"
                            show={true}
                            color="yellow"
                        >
                            {recipeName}
                        </RoughNotation>{" "}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <Badge>{difficultyLevel}</Badge>
                        <Badge>
                            <Utensils className="w-4 h-4 inline mr-1" />
                            {prepTime}
                        </Badge>
                        <Badge>
                            <CookingPot className="w-4 h-4 inline mr-1" />
                            {cookTime}
                        </Badge>
                        <Badge>
                            <Clock className="w-4 h-4 inline mr-1" />
                            {totalTime}
                        </Badge>
                        <Badge>
                            <Users className="w-4 h-4 inline mr-1" />
                            {numberOfServings}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <Badge>
                            <ChefHat className="w-4 h-4 inline mr-1" />
                            {cuisineType}
                        </Badge>
                        <Badge>
                            <Vegan className="w-4 h-4 inline mr-1" />
                            {dietaryRestrictions.join(" ~ ")}
                        </Badge>
                    </div>
                </div>
                <div className="recipe-ingredients">
                    <h3 className="text-foreground text-2xl font-semibold">
                        Ingredients
                    </h3>
                    <ul className="list-disc ml-4 my-2">
                        {ingredients.map((inc: string, idx: number) => (
                            <li key={idx}>
                                <p className="text-lg font-medium">{inc}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="recipe-instructions">
                    <h3 className="text-foreground text-2xl font-semibold">
                        Instructions
                    </h3>
                    <ol className="ml-4 my-2">
                        {instructions.map(
                            (instruction: string, index: number) => (
                                <li key={index}>
                                    <p>
                                        <b>{instruction.slice(0, 8)}</b>
                                        {instruction.slice(8)}
                                    </p>
                                </li>
                            )
                        )}
                    </ol>
                </div>
                <div className="recipe-chef-notes">
                    <h3 className="text-foreground text-2xl font-semibold flex items-center gap-2">
                        Chef's Notes <ChefHat />
                    </h3>
                    <RoughNotation type="circle" show={true} color="hotpink">
                        <i className="text-foreground">{chefNotes}</i>
                    </RoughNotation>
                </div>
            </div>
        </>
    );
};

export default RecipeDetails;
