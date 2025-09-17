export type Order = {
  id: string;
  chefId: string;
  chefName: string;
  date: string;             // ISO string or human date
  people: number;
  status: "Pending" | "Confirmed";
  title: string;            // e.g., "Home dinner"
};

export const orders: Order[] = [
  { id: "ord-001", chefId: "amy-lin", chefName: "Amy Lin", date: "2025-09-20 19:00", people: 2, status: "Pending",   title: "Home dinner" },
  { id: "ord-002", chefId: "raj-singh", chefName: "Raj Singh", date: "2025-09-22 12:00", people: 4, status: "Confirmed", title: "Weekend lunch" },
  { id: "ord-003", chefId: "amy-lin", chefName: "Amy Lin", date: "2025-09-24 18:30", people: 3, status: "Pending",   title: "Birthday tasting" },
];
