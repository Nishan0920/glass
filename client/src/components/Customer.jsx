import axios from "axios";
import React, { useEffect, useState } from "react";

const Customers = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [data, setData] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    purchase: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  //for getting the data of all customers
  const getCustomers = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/customeralldata",
      );

      if (result.data.success) {
        setCustomers(result.data.customers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);
  // for updating the existing customer
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
  //for deleting the exisitng customer
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

        // Get latest data from database
        getCustomers();
      } else {
        alert(result.data.message || "Failed to delete customer");
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
    } catch (error) {}
  };
  //for submitting the customer based on methods
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

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
      } else {
        result = await axios.post("http://localhost:3000/api/customer", {
          Name: data.name,
          PhoneNumber: data.number,
          Email: data.email,
          Address: data.address,
          TotalPurchase: data.purchase,
        });
      }

      console.log("Response:", result.data);

      if (result.data.success) {
        alert(
          editingCustomer
            ? "Customer updated successfully"
            : "Customer created successfully",
        );

        setShowModal(false);

        setEditingCustomer(null);

        setData({
          name: "",
          number: "",
          email: "",
          address: "",
          purchase: "",
        });

        getCustomers();
      } else {
        alert(result.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.log("Server response:", error.response.data);

        alert(
          error.response.data.message || "Server error while saving customer",
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();

    return (
      customer.Name?.toLowerCase().includes(searchValue) ||
      customer.PhoneNumber?.toLowerCase().includes(searchValue) ||
      customer.Email?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <>
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Customers</h1>

            <p className="mt-1 text-xs text-gray-500">Manage your customers</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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

          <button
            type="button"
            className="h-9 cursor-pointer rounded-md border border-gray-200 px-4 text-[11px] text-gray-600"
          >
            Export
          </button>

          <button
            type="button"
            onClick={handleAddCustomer}
            className="h-9 cursor-pointer rounded-md bg-blue-600 px-4 text-[11px] font-medium text-white hover:bg-blue-700"
          >
            Add New Customer
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    #
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    Total Purchases
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    Last Visit
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 text-xs font-medium text-gray-800">
                        {customer.Name}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.PhoneNumber}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.Email}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.TotalPurchase}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="flex gap-3 px-4 py-3 text-xs">
                        <button
                          type="button"
                          onClick={() => handleEdit(customer)}
                          className="cursor-pointer text-blue-600 hover:text-blue-800"
                        >
                          u
                        </button>

                        <button
                          onClick={()=> handleDelete(customer._id)}
                          type="button"
                          className="cursor-pointer text-red-600 hover:text-red-800"
                        >
                          d
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-xs text-gray-400"
                    >
                      {search ? "No customers found" : "No customers available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h2>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cursor-pointer text-xl text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleOnSubmit}>
                <div className="space-y-4 p-5">
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
                    {editingCustomer ? "Update Customer" : "Add Customer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Customers;
