import { PantryItem } from "@/app/pantry/page";
import { Button } from "../ui/button";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { Edit, Trash } from "lucide-react";

interface PantryItemListProps {
    items: PantryItem[];
    search: string;
    handleEditItem: (item: PantryItem) => void;
    handleDeleteItem: (id: string | undefined) => void;
}

export const PantryItemList: FC<PantryItemListProps> = ({
    items,
    search,
    handleEditItem,
    handleDeleteItem,
}) => {

    const highlightText = (text: string, search: string) => {
        if (!search.trim()) return text;

        const regex = new RegExp(`(${search})`, "gi");
        return text.replace(regex, '<span class="bg-yellow-300">$1</span>');
    };

    return (
        <div className="w-full max-w-2xl mx-auto border-[1px] my-3 rounded-xl">
            {items?.map((item: PantryItem, idx: number) => (
                <li
                    key={idx}
                    className={cn(
                        "border-t  last-of-type:border-b last-of-type:rounded-b-xl md:last-of-type:border-none flex justify-between relative overflow-hidden md:first-of-type:border-none",
                        idx % 2 !== 0 && "bg-muted"
                    )}
                >
                    <div className="flex items-center w-full gap-2 p-5 ">
                        <div>
                            <img
                                className="w-24 h-16 rounded-xl object-cover"
                                src={item.image?.url}
                            />
                        </div>
                        <div className="w-full">
                            <p
                                className="font-semibold truncate dark:text-slate-300"
                                dangerouslySetInnerHTML={{
                                    __html: highlightText(item.name, search),
                                }}
                            />
                            <p className="text-xs dark:text-slate-400 text-slate-600">
                                {item?.type}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <div>
                                <h5 className="text-xs">Quantity</h5>
                                <div className="flex items-center mt-1">
                                    <Button className="h-5 w-1 rounded-none rounded-s-md">
                                        +
                                    </Button>
                                    <Button className="h-5 rounded-none bg-muted text-foreground hover:bg-transparent/5">
                                        {item.quantity}
                                    </Button>
                                    <Button className="h-5 w-1 rounded-none rounded-e-md">
                                        -
                                    </Button>
                                </div>
                            </div>

                            <Edit
                                onClick={() => handleEditItem(item)}
                                className="hover:text-muted-foreground cursor-pointer"
                            />
                            <Trash
                                onClick={() => handleDeleteItem(item._id)}
                                className="hover:text-red-500 cursor-pointer"
                            />
                        </div>
                    </div>
                </li>
            ))}
        </div>
    );
};
