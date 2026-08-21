import axios from "axios";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api";

const emptyCustomer = {
  name: "",
  number: "",
  email: "",
  address: "",
  purchase: "",
};

const emptyPrescription = {
  prescriptionId: "",
  date: new Date().toISOString().split("T")[0],
  type: "Single Vision",

  right: {
    sph: "",
    cyl: "",
    axis: "",
    add: "",
  },

  left: {
    sph: "",
    cyl: "",
    axis: "",
    add: "",
  },
};

const Customers = () => {
  // =========================================================
  // CUSTOMER STATES
  // =========================================================

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [data, setData] = useState(emptyCustomer);

  // =========================================================
  // PRESCRIPTION STATES
  // =========================================================

  const [addPrescription, setAddPrescription] = useState(false);

  const [prescription, setPrescription] =
    useState(emptyPrescription);

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(false);

  // =========================================================
  // GET ALL CUSTOMERS
  // =========================================================

  const getCustomers = async () => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${API_URL}/customeralldata`
      );

      if (result.data.success) {
        setCustomers(result.data.customers || []);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Failed to load customers."
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

  useEffect(() => {
    getCustomers();
  }, []);

  // =========================================================
  // CUSTOMER INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // PRESCRIPTION BASIC INPUT CHANGE
  // =========================================================

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;

    setPrescription((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // RIGHT / LEFT EYE CHANGE
  // =========================================================

  const handleEyeChange = (eye, field, value) => {
    setPrescription((previous) => ({
      ...previous,

      [eye]: {
        ...previous[eye],
        [field]: value,
      },
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setData({
      ...emptyCustomer,
    });

    setPrescription({
      ...emptyPrescription,
      date: new Date().toISOString().split("T")[0],
      right: {
        ...emptyPrescription.right,
      },
      left: {
        ...emptyPrescription.left,
      },
    });

    setAddPrescription(false);
    setEditingCustomer(null);
  };

  // =========================================================
  // OPEN ADD CUSTOMER MODAL
  // =========================================================

  const handleAddCustomer = () => {
    resetForm();
    setShowModal(true);
  };

  // =========================================================
  // OPEN EDIT CUSTOMER MODAL
  // =========================================================

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setData({
      name: customer.Name || "",
      number: customer.PhoneNumber || "",
      email: customer.Email || "",
      address: customer.Address || "",
      purchase: customer.TotalPurchase || "",
    });

    setAddPrescription(false);

    setPrescription({
      ...emptyPrescription,
      date: new Date().toISOString().split("T")[0],
      right: {
        ...emptyPrescription.right,
      },
      left: {
        ...emptyPrescription.left,
      },
    });

    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // =========================================================
  // CHECK WHETHER PRESCRIPTION HAS DATA
  // =========================================================

  const hasPrescriptionData = () => {
    const right = prescription.right;
    const left = prescription.left;

    return (
      prescription.prescriptionId.trim() !== "" ||
      prescription.date.trim() !== "" ||
      prescription.type.trim() !== "" ||
      right.sph.trim() !== "" ||
      right.cyl.trim() !== "" ||
      right.axis.trim() !== "" ||
      right.add.trim() !== "" ||
      left.sph.trim() !== "" ||
      left.cyl.trim() !== "" ||
      left.axis.trim() !== "" ||
      left.add.trim() !== ""
    );
  };

  // =========================================================
  // SUBMIT CUSTOMER
  // =========================================================

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let customerResult;

      const customerData = {
        Name: data.name.trim(),
        PhoneNumber: data.number.trim(),
        Email: data.email.trim(),
        Address: data.address.trim(),
        TotalPurchase:
          data.purchase === ""
            ? 0
            : Number(data.purchase),
      };

      // =====================================================
      // UPDATE CUSTOMER
      // =====================================================

      if (editingCustomer) {
        customerResult = await axios.put(
          `${API_URL}/customer/${editingCustomer._id}`,
          customerData
        );
      }

      // =====================================================
      // CREATE CUSTOMER
      // =====================================================

      else {
        customerResult = await axios.post(
          `${API_URL}/customer`,
          customerData
        );
      }

      if (!customerResult.data.success) {
        alert(
          customerResult.data.message ||
            "Failed to save customer."
        );

        return;
      }

      // =====================================================
      // GET SAVED CUSTOMER
      // =====================================================

      const savedCustomer =
        customerResult.data.customer ||
        customerResult.data.data;

      // =====================================================
      // CREATE OPTIONAL PRESCRIPTION
      // =====================================================

      if (
        !editingCustomer &&
        addPrescription
      ) {
        // -----------------------------------------------
        // Make sure customer ID exists
        // -----------------------------------------------

        if (!savedCustomer?._id) {
          alert(
            "Customer was created, but customer ID was not returned by the server. Prescription was not created."
          );

          handleCloseModal();
          getCustomers();

          return;
        }

        // -----------------------------------------------
        // Generate prescription ID if empty
        // -----------------------------------------------

        const generatedPrescriptionId =
          prescription.prescriptionId.trim() ||
          `RX-${Date.now()}`;

        const prescriptionData = {
          PrescriptionId: generatedPrescriptionId,

          CustomerId: savedCustomer._id,

          CustomerName: savedCustomer.Name,

          CustomerPhone:
            savedCustomer.PhoneNumber,

          Date:
            prescription.date ||
            new Date()
              .toISOString()
              .split("T")[0],

          Type: prescription.type,

          Right: {
            sph: prescription.right.sph.trim(),
            cyl: prescription.right.cyl.trim(),
            axis: prescription.right.axis.trim(),
            add: prescription.right.add.trim(),
          },

          Left: {
            sph: prescription.left.sph.trim(),
            cyl: prescription.left.cyl.trim(),
            axis: prescription.left.axis.trim(),
            add: prescription.left.add.trim(),
          },
        };

        try {
          const prescriptionResult =
            await axios.post(
              `${API_URL}/prescription`,
              prescriptionData
            );

          if (!prescriptionResult.data.success) {
            alert(
              "Customer was created successfully, but the prescription could not be saved."
            );
          } else {
            alert(
              "Customer and prescription created successfully."
            );
          }
        } catch (prescriptionError) {
          console.error(
            "Prescription creation error:",
            prescriptionError
          );

          alert(
            "Customer was created successfully, but there was an error creating the prescription."
          );
        }
      }

      // =====================================================
      // SUCCESS MESSAGE WITHOUT PRESCRIPTION
      // =====================================================

      else {
        alert(
          editingCustomer
            ? "Customer updated successfully."
            : "Customer created successfully."
        );
      }

      // =====================================================
      // CLOSE + REFRESH
      // =====================================================

      handleCloseModal();

      await getCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);

      if (error.response) {
        console.error(
          "Server response:",
          error.response.data
        );

        alert(
          error.response.data.message ||
            "Server error while saving customer."
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const result = await axios.delete(
        `${API_URL}/customer/${customerId}`
      );

      if (result.data.success) {
        alert("Customer deleted successfully.");

        await getCustomers();
      } else {
        alert(
          result.data.message ||
            "Failed to delete customer."
        );
      }
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while deleting customer."
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH CUSTOMERS
  // =========================================================

  const filteredCustomers = customers.filter(
    (customer) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      if (!searchValue) {
        return true;
      }

      return (
        customer.Name?.toLowerCase().includes(
          searchValue
        ) ||
        customer.PhoneNumber?.toLowerCase().includes(
          searchValue
        ) ||
        customer.Email?.toLowerCase().includes(
          searchValue
        )
      );
    }
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Manage customers and their prescriptions
          </p>
        </div>

      </div>

      {/* =====================================================
          SEARCH + ACTIONS
      ====================================================== */}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">

        <div className="relative w-full sm:w-[320px]">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, phone or email"
            className="h-9 w-full rounded-md border border-gray-200 px-3 text-[11px] outline-none focus:border-blue-500"
          />

        </div>

        <div className="hidden flex-1 sm:block" />

        <button
          type="button"
          className="h-9 rounded-md border border-gray-200 px-4 text-[11px] text-gray-600 hover:bg-gray-50"
        >
          Export
        </button>

        <button
          type="button"
          onClick={handleAddCustomer}
          className="h-9 rounded-md bg-blue-600 px-4 text-[11px] font-medium text-white hover:bg-blue-700"
        >
          + Add New Customer
        </button>

      </div>

      {/* =====================================================
          CUSTOMER TABLE
      ====================================================== */}

      <div className="mt-4 overflow-hidden rounded-md border border-gray-200">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

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
                  Prescription
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

              {loading && customers.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-xs text-gray-400"
                  >
                    Loading customers...
                  </td>

                </tr>

              ) : filteredCustomers.length > 0 ? (

                filteredCustomers.map(
                  (customer, index) => (

                    <tr
                      key={customer._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3">

                        <div className="text-xs font-medium text-gray-800">
                          {customer.Name || "-"}
                        </div>

                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.PhoneNumber || "-"}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.Email || "-"}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.TotalPurchase ?? 0}
                      </td>

                      <td className="px-4 py-3">

                        <a
                          href={`/prescriptions?customerId=${customer._id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          View Prescription
                        </a>

                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">

                        {customer.createdAt
                          ? new Date(
                              customer.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      <td className="px-4 py-3">

                        <div className="flex gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(customer)
                            }
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                customer._id
                              )
                            }
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="8"
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

      {/* =====================================================
          ADD / EDIT CUSTOMER MODAL
      ====================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white p-5">

              <div>

                <h2 className="text-lg font-semibold text-gray-800">

                  {editingCustomer
                    ? "Edit Customer"
                    : "Add New Customer"}

                </h2>

                <p className="mt-1 text-[11px] text-gray-400">

                  {editingCustomer
                    ? "Update customer information"
                    : "Add customer information and optional prescription"}

                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleOnSubmit}>

              {/* =================================================
                  CUSTOMER INFORMATION
              ================================================== */}

              <div className="p-5">

                <div className="mb-4">

                  <h3 className="text-sm font-semibold text-gray-800">
                    Customer Information
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* NAME */}

                  <div>

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Customer Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                      placeholder="Enter customer name"
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Phone *
                    </label>

                    <input
                      type="text"
                      name="number"
                      value={data.number}
                      onChange={handleChange}
                      required
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                      placeholder="Enter phone number"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                      placeholder="Enter email"
                    />

                  </div>

                  {/* TOTAL PURCHASE */}

                  <div>

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Total Purchase
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="purchase"
                      value={data.purchase}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                      placeholder="0"
                    />

                  </div>

                  {/* ADDRESS */}

                  <div className="sm:col-span-2">

                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                      placeholder="Enter address"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  OPTIONAL PRESCRIPTION
              ================================================== */}

              {!editingCustomer && (

                <div className="border-t bg-gray-50 p-5">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <h3 className="text-sm font-semibold text-gray-800">
                        Prescription
                      </h3>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Optional — you can add a prescription now or later.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setAddPrescription(
                          !addPrescription
                        )
                      }
                      className={`rounded-md px-4 py-2 text-xs font-medium ${
                        addPrescription
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                    >

                      {addPrescription
                        ? "Remove Prescription"
                        : "+ Add Prescription"}

                    </button>

                  </div>

                  {/* PRESCRIPTION FORM */}

                  {addPrescription && (

                    <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">

                      {/* BASIC DETAILS */}

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                        {/* RX ID */}

                        <div>

                          <label className="mb-1 block text-xs font-medium text-gray-700">
                            Prescription ID
                          </label>

                          <input
                            type="text"
                            name="prescriptionId"
                            value={
                              prescription.prescriptionId
                            }
                            onChange={
                              handlePrescriptionChange
                            }
                            placeholder="Auto-generated if empty"
                            className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                          />

                        </div>

                        {/* DATE */}

                        <div>

                          <label className="mb-1 block text-xs font-medium text-gray-700">
                            Prescription Date
                          </label>

                          <input
                            type="date"
                            name="date"
                            value={prescription.date}
                            onChange={
                              handlePrescriptionChange
                            }
                            className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                          />

                        </div>

                        {/* TYPE */}

                        <div>

                          <label className="mb-1 block text-xs font-medium text-gray-700">
                            Prescription Type
                          </label>

                          <select
                            name="type"
                            value={prescription.type}
                            onChange={
                              handlePrescriptionChange
                            }
                            className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                          >

                            <option value="Single Vision">
                              Single Vision
                            </option>

                            <option value="Bifocal">
                              Bifocal
                            </option>

                            <option value="Progressive">
                              Progressive
                            </option>

                            <option value="Reading">
                              Reading
                            </option>

                            <option value="Computer">
                              Computer
                            </option>

                          </select>

                        </div>

                      </div>

                      {/* RIGHT EYE */}

                      <div className="mt-6">

                        <div className="mb-3">

                          <h4 className="text-xs font-semibold text-gray-800">
                            Right Eye (OD)
                          </h4>

                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                          {[
                            "sph",
                            "cyl",
                            "axis",
                            "add",
                          ].map((field) => (

                            <div key={field}>

                              <label className="mb-1 block text-[11px] font-medium uppercase text-gray-500">
                                {field}
                              </label>

                              <input
                                type="text"
                                value={
                                  prescription.right[
                                    field
                                  ]
                                }
                                onChange={(e) =>
                                  handleEyeChange(
                                    "right",
                                    field,
                                    e.target.value
                                  )
                                }
                                className="h-9 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                                placeholder={
                                  field === "sph"
                                    ? "SPH"
                                    : field === "cyl"
                                    ? "CYL"
                                    : field === "axis"
                                    ? "AXIS"
                                    : "ADD"
                                }
                              />

                            </div>

                          ))}

                        </div>

                      </div>

                      {/* LEFT EYE */}

                      <div className="mt-6">

                        <div className="mb-3">

                          <h4 className="text-xs font-semibold text-gray-800">
                            Left Eye (OS)
                          </h4>

                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                          {[
                            "sph",
                            "cyl",
                            "axis",
                            "add",
                          ].map((field) => (

                            <div key={field}>

                              <label className="mb-1 block text-[11px] font-medium uppercase text-gray-500">
                                {field}
                              </label>

                              <input
                                type="text"
                                value={
                                  prescription.left[
                                    field
                                  ]
                                }
                                onChange={(e) =>
                                  handleEyeChange(
                                    "left",
                                    field,
                                    e.target.value
                                  )
                                }
                                className="h-9 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-blue-500"
                                placeholder={
                                  field === "sph"
                                    ? "SPH"
                                    : field === "cyl"
                                    ? "CYL"
                                    : field === "axis"
                                    ? "AXIS"
                                    : "ADD"
                                }
                              />

                            </div>

                          ))}

                        </div>

                      </div>

                      {/* CUSTOMER LINK INFO */}

                      <div className="mt-5 rounded-md bg-blue-50 p-3">

                        <p className="text-[11px] text-blue-700">

                          This prescription will automatically be linked to:

                        </p>

                        <p className="mt-1 text-xs font-semibold text-blue-900">

                          {data.name || "Customer Name"}

                          {" — "}

                          {data.number || "Phone Number"}

                        </p>

                      </div>

                    </div>

                  )}

                </div>

              )}

              {/* =================================================
                  FOOTER
              ================================================== */}

              <div className="flex justify-end gap-2 border-t bg-white p-5">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="cursor-pointer rounded-md border border-gray-200 px-5 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading
                    ? "Saving..."
                    : editingCustomer
                    ? "Update Customer"
                    : addPrescription
                    ? "Add Customer & Prescription"
                    : "Add Customer"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Customers;
