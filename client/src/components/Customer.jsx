import axios from "axios";
import React, { useEffect, useState } from "react";
import SalesPOS from "./SalesPOS";

const Customers = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("Customers");

  const tabs = ["Customers", "Sales POS"];

  // Customer form data
  const [data, setData] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    purchase: "",
  });

  // --------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------
  // GET ALL CUSTOMERS
  // --------------------------------
  const getCustomers = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/customeralldata",
      );

      if (result.data.success) {
        setCustomers(result.data.customers || []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  // --------------------------------
  // LOAD CUSTOMERS
  // --------------------------------
  useEffect(() => {
    getCustomers();
  }, []);

  // --------------------------------
  // EDIT CUSTOMER
  // --------------------------------
  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setData({
      name: customer.Name || "",
      number: customer.PhoneNumber || "",
      email: customer.Email || "",
      address: customer.Address || "",
      purchase: customer.TotalPurchase || "",
    });

    setShowModal(true);
  };

  // --------------------------------
  // ADD CUSTOMER
  // --------------------------------
  const handleAddCustomer = () => {
    setEditingCustomer(null);

    setData({
      name: "",
      number: "",
      email: "",
      address: "",
      purchase: "",
    });

    setShowModal(true);
  };

  // --------------------------------
  // CLOSE MODAL
  // --------------------------------
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);

    setData({
      name: "",
      number: "",
      email: "",
      address: "",
      purchase: "",
    });
  };

  // --------------------------------
  // DELETE CUSTOMER
  // --------------------------------
  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const result = await axios.delete(
        `http://localhost:3000/api/customer/${customerId}`,
      );

      if (result.data.success) {
        alert("Customer deleted successfully");

        // Refresh customer list
        await getCustomers();
      } else {
        alert(result.data.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Delete customer error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while deleting customer",
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  // --------------------------------
  // ADD / UPDATE CUSTOMER
  // --------------------------------
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      // UPDATE CUSTOMER
      if (editingCustomer) {
        result = await axios.put(
          `http://localhost:3000/api/customer/${editingCustomer._id}`,
          {
            Name: data.name,
            PhoneNumber: data.number,
            Email: data.email,
            Address: data.address,
            TotalPurchase: data.purchase,
          },
        );
      }

      // CREATE CUSTOMER
      else {
        result = await axios.post(
          "http://localhost:3000/api/customer",
          {
            Name: data.name,
            PhoneNumber: data.number,
            Email: data.email,
            Address: data.address,
            TotalPurchase: data.purchase,
          },
        );
      }

      if (result.data.success) {
        alert(
          editingCustomer
            ? "Customer updated successfully"
            : "Customer created successfully",
        );

        // Close modal
        handleCloseModal();

        // Refresh customer list
        await getCustomers();
      } else {
        alert(result.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving customer:", error);

      if (error.response) {
        console.log("Server response:", error.response.data);

        alert(
          error.response.data.message ||
            "Server error while saving customer",
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  // --------------------------------
  // SEARCH CUSTOMERS
  // --------------------------------
  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();

    return (
      customer.Name?.toLowerCase().includes(searchValue) ||
      String(customer.PhoneNumber || "")
        .toLowerCase()
        .includes(searchValue) ||
      customer.Email?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <>
      <div className="min-h-screen bg-white p-4 sm:p-6">

        {/* ================================
            HEADER
        ================================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Customers / SalesPOS
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Manage your customers and sales
            </p>
          </div>
        </div>

        {/* ================================
            TABS
        ================================= */}
        <div className="mt-5 flex gap-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);

                // Close customer modal when changing tab
                if (tab !== "Customers") {
                  setShowModal(false);
                }
              }}
              className={`pb-2.5 text-sm transition ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* =====================================================
            CUSTOMERS TAB
        ====================================================== */}
        {activeTab === "Customers" && (
          <>
            {/* SEARCH + BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              
              {/* SEARCH */}
              <div className="relative w-full sm:w-[260px]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone or email"
                  className="h-9 w-full rounded-md border border-gray-200 px-3 text-[11px] outline-none focus:border-blue-500"
                />
              </div>

              <div className="hidden flex-1 sm:block" />

              {/* EXPORT */}
              <button
                type="button"
                className="h-9 cursor-pointer rounded-md border border-gray-200 px-4 text-[11px] text-gray-600 hover:bg-gray-50"
              >
                Export
              </button>

              {/* ADD CUSTOMER */}
              <button
                type="button"
                onClick={handleAddCustomer}
                className="h-9 cursor-pointer rounded-md bg-blue-600 px-4 text-[11px] font-medium text-white hover:bg-blue-700"
              >
                Add New Customer
              </button>
            </div>

            {/* ================================
                CUSTOMER TABLE
            ================================= */}
            <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">

                  {/* TABLE HEADER */}
                  <thead>
                    <tr className="border-b bg-gray-50 text-center">

                      <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                        #
                      </th>

                      <th className="px-4 py-3 text-[10px] text-gray-500">
                        Customer
                      </th>

                      <th className="px-4 py-3 text-[10px] text-gray-500">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-[10px] text-gray-500">
                        Email
                      </th>

                      <th className="px-4 py-3 text-[10px] text-gray-500">
                        Total Purchases
                      </th>

                      <th className="px-4 py-3 text-[10px] text-gray-500">
                        Last Visit
                      </th>

                      <th className="px-4 py-3 text-[10px] text-gray-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  {/* TABLE BODY */}
                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer, index) => (
                        <tr
                          key={customer._id}
                          className="border-b border-gray-100 text-center hover:bg-gray-50"
                        >

                          {/* NUMBER */}
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {index + 1}
                          </td>

                          {/* NAME */}
                          <td className="px-4 py-3 text-xs font-medium text-gray-800">
                            {customer.Name}
                          </td>

                          {/* PHONE */}
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {customer.PhoneNumber}
                          </td>

                          {/* EMAIL */}
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {customer.Email}
                          </td>

                          {/* TOTAL PURCHASE */}
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {customer.TotalPurchase}
                          </td>

                          {/* LAST VISIT */}
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {customer.createdAt
                              ? new Date(
                                  customer.createdAt,
                                ).toLocaleDateString()
                              : "-"}
                          </td>

                          {/* ACTION */}
                          <td className="px-4 py-3 text-xs">
                            <div className="flex justify-around text-sm">

                              {/* EDIT */}
                              <button
                                type="button"
                                onClick={() => handleEdit(customer)}
                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                              >
                                <i className="fa-solid fa-pen text-blue-500" />
                              </button>

                              {/* DELETE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(customer._id)
                                }
                                className="cursor-pointer text-red-600 hover:text-red-800"
                              >
                                <i className="fa-solid fa-trash-can text-red-500" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-10 text-center text-xs text-gray-400"
                        >
                          {search
                            ? "No customers found"
                            : "No customers available"}
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>

            {/* ================================
                ADD / EDIT CUSTOMER MODAL
            ================================= */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                  {/* MODAL HEADER */}
                  <div className="flex items-center justify-between border-b p-5">

                    <h2 className="text-lg font-semibold text-gray-800">
                      {editingCustomer
                        ? "Edit Customer"
                        : "Add New Customer"}
                    </h2>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="cursor-pointer text-xl text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>

                  </div>

                  {/* FORM */}
                  <form onSubmit={handleOnSubmit}>

                    <div className="space-y-4 p-5">

                      {/* CUSTOMER NAME */}
                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Customer Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={data.name}
                          onChange={handleChange}
                          className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* PHONE */}
                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Phone
                        </label>

                        <input
                          type="text"
                          name="number"
                          value={data.number}
                          onChange={handleChange}
                          className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={data.email}
                          onChange={handleChange}
                          className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* TOTAL PURCHASE */}
                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Total Purchase
                        </label>

                        <input
                          type="number"
                          name="purchase"
                          value={data.purchase}
                          onChange={handleChange}
                          className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* ADDRESS */}
                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Address
                        </label>

                        <input
                          type="text"
                          name="address"
                          value={data.address}
                          onChange={handleChange}
                          className="w-full rounded-md border px-3 py-2 text-xs outline-none focus:border-blue-500"
                          required
                        />
                      </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-2 border-t p-5">

                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="cursor-pointer rounded-md border px-5 py-2 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-xs text-white hover:bg-blue-700"
                      >
                        {editingCustomer
                          ? "Update Customer"
                          : "Add Customer"}
                      </button>

                    </div>

                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* =====================================================
            SALES POS TAB
        ====================================================== */}
        {activeTab === "Sales POS" && (
          <div className="mt-6">
            <SalesPOS />
          </div>
        )}

      </div>
    </>
  );
};

export default Customers;
