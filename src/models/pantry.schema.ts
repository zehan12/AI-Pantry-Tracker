import { model, Model, models, Schema } from "mongoose";

export interface IPantry {
    userId: string;
    name: string;
    type: string;
    quantity: number;
    weight: string;
    image?: {
        id: string;
        url: string;
    };
}

const imageSchema = new Schema({
    id: String,
    url: String,
});

const pantrySchema = new Schema(
    {
        userId: String,
        name: String,
        type: String,
        quantity: Number,
        weight: String,
        image: imageSchema,
    },
    {
        timestamps: true,
    }
);

export const Pantry: Model<IPantry> =
    models?.Pantry || model("Pantry", pantrySchema);
