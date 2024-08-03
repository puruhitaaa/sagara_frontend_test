import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface TableState {
  tableCols: { id: number; title: string; value: string; isActive: boolean }[]
  setIsActive: (id: number) => void
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      tableCols: [
        {
          id: 1,
          title: "Profile",
          value: "name",
          isActive: true,
        },
        {
          id: 2,
          title: "Email Address",
          value: "email",
          isActive: true,
        },
        {
          id: 3,
          title: "Phone Number",
          value: "phoneNumber",
          isActive: true,
        },
        {
          id: 4,
          title: "Instance",
          value: "instance",
          isActive: true,
        },
        {
          id: 5,
          title: "Created At",
          value: "createdAt",
          isActive: true,
        },
      ],
      setIsActive: (id) =>
        set({
          tableCols: get().tableCols.map((col) =>
            col.id === id ? { ...col, isActive: !col.isActive } : { ...col }
          ),
        }),
    }),
    {
      name: "table-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
