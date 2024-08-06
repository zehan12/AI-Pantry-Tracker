"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Cross, Edit, Image, Search, Trash, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { convertBase64 } from "@/utils";
import { PantryItemList } from "@/components/pantry";
import Pagination from "@/components/pantry/Pagination";

export interface PantryItem {
    _id?: string;
    name: string;
    type: string;
    quantity: number;
    weight: string;
    image?: {
        id: string;
        url: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

const pantryTypes = [
    { value: "dryGoods", label: "Dry Goods" },
    { value: "cannedFoods", label: "Canned and Jarred Foods" },
    { value: "spices", label: "Spices and Herbs" },
    { value: "condiments", label: "Condiments and Sauces" },
    { value: "snacks", label: "Snacks and Convenience Foods" },
    { value: "oils", label: "Oils and Vinegars" },
    { value: "beverages", label: "Beverages" },
    { value: "specialty", label: "Specialty Items" },
    { value: "frozenFoods", label: "Frozen Foods" },
    { value: "healthFoods", label: "Health Foods" },
    { value: "preservedFoods", label: "Preserved Foods" },
];

const weightOptions = [
    { value: "g", label: "Grams" },
    { value: "kg", label: "Kilograms" },
    { value: "oz", label: "Ounces" },
    { value: "lb", label: "Pounds" },
];

const initialPantryItemState = {
    name: "",
    quantity: 1,
    weight: "g",
    type: "",
    image: {
        id: "",
        url: "",
    },
};

export default function PantryPage() {
    const { user } = useUser();

    const [item, setItem] = useState<PantryItem>(initialPantryItemState);
    const [items, setItems] = useState<PantryItem[]>([]);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isSearchVisible, setSearchVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [uploadedImage, setUploadedImage] = useState({
        id: "",
        url: "http://res.cloudinary.com/dfgh3x4uh/image/upload/v1722772108/pgwtroyugmpvw8mxvvlq.png",
    });
    const [uploadError, setUploadError] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUserItems = async (userId: string): Promise<void> => {
        const res = await fetch(`api/pantry/user/${userId}`);
        const json = await res.json();
        setItems(json?.items);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem({ ...item, name: e.target.value });
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem({
            ...item,
            quantity: Math.max(1, parseInt(e.target.value, 10)),
        });
    };

    const handleWeightChange = (value: string) => {
        setItem({ ...item, weight: value });
    };

    const handleTypeChange = (value: string) => {
        setItem({ ...item, type: value });
    };

    const handleImageUpload = async (event: any) => {
        const files = event.target.files;
        const file = event.target.files[0];
        if (files.length === 1 && file) {
            const ALLOWED_IMAGE_TYPES = [
                "image/jpeg",
                "image/png",
                "image/gif",
            ];

            // Check if the file type is allowed
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setUploadError(
                    "Only image files are allowed. Please upload a JPEG, PNG, or GIF image."
                );
                return;
            }

            // Define the maximum file size (e.g., 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

            // Check if the file size exceeds the maximum limit
            if (file.size > MAX_FILE_SIZE) {
                setUploadError("File size exceeds the maximum limit of 5MB.");
                return;
            }

            const base64: any = await convertBase64(file);
            const formData = new FormData();
            formData.append("image", base64);
            const response = await fetch("api/upload", {
                method: "POST",
                body: formData,
            });
            const responseJson = await response.json();
            setUploadError("");
            setUploadedImage({
                url: responseJson.data.secure_url,
                id: responseJson.data.public_id,
            });
        }
    };

    const handleAddOrEditItem = async () => {
        if (!user || item.name.trim() === "" || item.type.trim() === "") return;

        const selectedType = pantryTypes.find(
            (type) => type.value === item.type
        );
        const typeLabel = selectedType ? selectedType.label : "";

        const existingItem = items.find(
            (existing) =>
                existing.name.trim().toLowerCase() ===
                item.name.trim().toLowerCase()
        );

        const preservedImage =
            uploadedImage.url &&
            uploadedImage.url !==
                "http://res.cloudinary.com/dfgh3x4uh/image/upload/v1722772108/pgwtroyugmpvw8mxvvlq.png"
                ? { id: uploadedImage.id, url: uploadedImage.url }
                : existingItem?.image || { id: "", url: "" };

        if (existingItem && !isEditMode) {
            // Item with the same name exists and is not in edit mode, update quantity
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + item.quantity,
                weight: item.weight, // Use the new weight value
                image: preservedImage,
            };
            try {
                await fetch(`/api/pantry/${existingItem._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedItem),
                });
                setItem(initialPantryItemState); // Reset form state
                setModalOpen(false);
                await fetchUserItems(user.id); // Fetch updated items
            } catch (error) {
                console.error("Error updating item: ", error);
            }
        } else {
            // Handle adding new item or updating existing item in edit mode
            const newItem = {
                userId: user.id,
                name: item.name.trim(),
                type: typeLabel,
                quantity: item.quantity,
                weight: item.weight,
                image: preservedImage,
            };

            if (isEditMode && selectedItem) {
                // Update existing item in edit mode
                try {
                    await fetch(`/api/pantry/${selectedItem._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...newItem,
                            // _id: selectedItem._id,
                        }),
                    });
                    setItem(initialPantryItemState); // Reset form state
                    setModalOpen(false);
                    setIsEditMode(false);
                    setSelectedItem(null);
                    await fetchUserItems(user.id); // Fetch updated items
                } catch (error) {
                    console.error("Error updating item: ", error);
                }
            } else {
                // Create new item
                try {
                    await fetch("/api/pantry", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newItem),
                    });
                    setItem(initialPantryItemState); // Reset form state
                    setModalOpen(false);
                    await fetchUserItems(user.id); // Fetch updated items
                } catch (error) {
                    console.error("Error adding item: ", error);
                }
            }
        }
    };

    const handleDeleteItem = async (id: string | undefined) => {
        await fetch(`api/pantry/${id}`, {
            method: "DELETE",
        });
    };

    const handleRemoveImage = async () => {
        if (!uploadedImage.id) return;

        try {
            await fetch(`/api/remove-image`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ publicId: uploadedImage.id }),
            });

            setUploadedImage({
                id: "",
                url: "http://res.cloudinary.com/dfgh3x4uh/image/upload/v1722772108/pgwtroyugmpvw8mxvvlq.png",
            });
        } catch (error) {
            console.error("Error removing image: ", error);
        }
    };

    const handleEditItem = (item: PantryItem) => {
        setIsEditMode(true);
        setSelectedItem(item);
        setItem({
            name: item.name,
            type: item.type,
            quantity: item.quantity,
            weight: item.weight,
            image: item.image,
        });
        setModalOpen(true);
    };

    const handleSetSearchVisible = (state: boolean) => {
        if (!state) {
            setSearchQuery("");
            setSearchVisible(state);
        }
        setSearchVisible(state);
    };

    const handleSearchQueryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (user?.id) {
            fetchUserItems(user?.id);
        }
    }, [user]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch(
                `/api/pantry/user/${
                    user?.id
                }?page=${currentPage}&limit=10&search=${encodeURIComponent(
                    searchQuery
                )}`
            );
            const data = await response.json();
            setItems(data.items);
            setTotalPages(data.totalPages);
        };

        fetchItems();
    }, [currentPage, searchQuery]);

    return (
        <>
            <div className="w-full max-w-2xl mx-auto text-balance">
                <h1 className="text-center my-20 text-4xl font-semibold text-foreground">
                    Pantry Tracker
                </h1>
                {isSearchVisible ? (
                    <div className="relative flex items-center max-w-2xl my-3">
                        <Input
                            placeholder="Your search..."
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="py-7 pl-10"
                        />
                        <Search className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 transform rounded-lg" />
                        <Cross
                            onClick={() => handleSetSearchVisible(false)}
                            className="absolute right-2 rotate-45 hover:text-red-500 cursor-pointer"
                        />
                    </div>
                ) : (
                    <Alert className="flex items-center justify-between lg:mx-0">
                        <AlertTitle>Pantry Items!</AlertTitle>
                        <div className="flex gap-3">
                            <Dialog
                                open={isModalOpen}
                                onOpenChange={setModalOpen}
                            >
                                <DialogTrigger asChild>
                                    <Upload className="cursor-pointer hover:text-muted-foreground" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {isEditMode
                                                ? "Edit Pantry Item"
                                                : "Add Pantry Item"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {isEditMode
                                                ? "Update the details of the pantry item."
                                                : "Enter the details of the new pantry item."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Input
                                            value={item.name}
                                            onChange={handleNameChange}
                                            placeholder="Item name"
                                        />
                                        <Select
                                            value={item.type}
                                            onValueChange={handleTypeChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select pantry type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pantryTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={handleQuantityChange}
                                                placeholder="Quantity"
                                                min="1"
                                                className="w-full sm:w-1/2"
                                            />
                                            <Select
                                                value={item.weight}
                                                onValueChange={
                                                    handleWeightChange
                                                }
                                            >
                                                <SelectTrigger className="w-full sm:w-1/2">
                                                    <SelectValue placeholder="Select weight unit" />
                                                </SelectTrigger>
                                                <SelectContent className="absolute z-[100] mt-1">
                                                    {weightOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="relative overflow-hidden inline-block">
                                            <Button className="w-full flex gap-2">
                                                <Image />
                                                Upload Image
                                            </Button>
                                            <input
                                                type="file"
                                                name="myfile"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                            />
                                        </div>
                                        <div className="h-2 py-1 text-xs text-red-500 flex items-center justify-center">
                                            {uploadError}
                                        </div>
                                        {uploadedImage && (
                                            <div className="w-full flex gap-3">
                                                <img
                                                    className="w-20 h-20 object-cover"
                                                    src={uploadedImage.url}
                                                    alt="Uploaded Image"
                                                />
                                                <div className="w-full flex items-center justify-center">
                                                    <Button
                                                        onClick={
                                                            handleRemoveImage
                                                        }
                                                        className="hover:bg-red-500"
                                                        variant={"ghost"}
                                                    >
                                                        Remove upload image
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant={"destructive"}
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleAddOrEditItem}
                                        >
                                            {isEditMode
                                                ? "Update Item"
                                                : "Add Item"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Search
                                onClick={() => handleSetSearchVisible(true)}
                                className="cursor-pointer hover:text-muted-foreground"
                            />
                        </div>
                    </Alert>
                )}
            </div>

            {items.length !== 0 ? (
                <>
                    <PantryItemList
                        items={items}
                        search={searchQuery}
                        handleEditItem={handleEditItem}
                        handleDeleteItem={handleDeleteItem}
                    />
                    {items.length >= 4 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                <div className="w-full max-w-2xl flex flex-col justify-center items-center gap-6 mx-auto my-10">
                    <p>Empty state</p>
                    <div className="flex items-center gap-5">
                        <p>Create new Items</p>
                        <Upload
                            onClick={() => setModalOpen(true)}
                            className="cursor-pointer hover:text-muted-foreground"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
