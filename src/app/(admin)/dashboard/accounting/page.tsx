import Image from "next/image";
import logo from "../../../../../public/logo.svg";

export default function DashboardPage() {
  return (
    <div className="flex h-[92dvh] flex-col items-center rounded-2xl p-10">
      <div className="flex flex-col items-center justify-center gap-10">
        <Image src={logo} width={50} height={50} alt="Picture of the brand" />
        <h1 className="ml-4 text-2xl font-bold">Bienvenue dans comptabilité</h1>
      </div>
      <p className="mt-20 text-gray-600">Your accounting and management hub</p>
      <div className="mt-10 flex flex-col">
        <p className="text-lg">Explore the features:</p>
        <ul className="mt-8 list-disc">
          <li>Cash Control</li>
          <li>Sales Management</li>
          <li>Expense Tracking</li>
          <li>Financial Reporting</li>
          <li>Customer Management</li>
          <li>Vendor Management</li>
          <li>Inventory Management</li>
          <li>Analytics and Insights</li>
          <li>Settings and Configuration</li>
          <li>Help and Support</li>
        </ul>
      </div>
    </div>
  );
}
