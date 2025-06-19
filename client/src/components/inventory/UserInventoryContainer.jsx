import React from "react";
import CompletedInventories from "../completedInventories/CompletedInventories";
import InventoryContainer from "./InventoryContainer";


export default function UserInventoryContainer() {

    return (
        <div className="flex flex-col gap-6 p-4">
            <InventoryContainer />
                <h1 className="text-3xl font-bold bg-slate-100/5 rounded-xl pt-2 pb-2">Completed Inventories</h1>
            <CompletedInventories />
        </div>
    )
}