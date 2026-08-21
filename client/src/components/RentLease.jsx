import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/rent-lease";

function RentLease() {
  const [activeTab, setActiveTab] =
    useState("Rent Payments");

  const [lease, setLease] = useState(null);

  const [payments, setPayments] = useState([]);

  const [stats, setStats] = useState({
    monthlyRent: 0,
    nextDueDate: null,
    daysLeft: null,
    advancePaid: 0,
    totalPaid: 0,
    totalDue: 0,
    totalOverdue: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showLeaseModal, setShowLeaseModal] =
    useState(false);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [editingPayment, setEditingPayment] =
    useState(null);

  // =========================================================
  // LEASE FORM
  // =========================================================

  const emptyLease = {
    property: "",
    location: "",
    propertyOwner: "",
    monthlyRent: "",
    agreementStartDate: "",
    agreementEndDate: "",
    securityDeposit: "",
    advancePaid: "",
    noticePeriod: "",
    rentIncrement: "",
    notes: "",
  };

  const [leaseForm, setLeaseForm] =
    useState(emptyLease);

  // =========================================================
  // PAYMENT FORM
  // =========================================================

  const emptyPayment = {
    rentAmount: "",
    dueDate: "",
    paidDate: "",
    paymentMethod: "Due",
    status: "Due",
    notes: "",
  };

  const [paymentForm, setPaymentForm] =
    useState(emptyPayment);

  // =========================================================
  // GET LEASE
  // =========================================================

  const getLease = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/lease`
      );

      if (response.data.success) {
        setLease(response.data.lease);

        if (response.data.lease) {
          setLeaseForm({
            property:
              response.data.lease.property ||
              "",

            location:
              response.data.lease.location ||
              "",

            propertyOwner:
              response.data.lease
                .propertyOwner || "",

            monthlyRent:
              response.data.lease
                .monthlyRent ?? "",

            agreementStartDate:
              response.data.lease
                .agreementStartDate
                ? new Date(
                    response.data.lease
                      .agreementStartDate
                  )
                    .toISOString()
                    .split("T")[0]
                : "",

            agreementEndDate:
              response.data.lease
                .agreementEndDate
                ? new Date(
                    response.data.lease
                      .agreementEndDate
                  )
                    .toISOString()
                    .split("T")[0]
                : "",

            securityDeposit:
              response.data.lease
                .securityDeposit ?? "",

            advancePaid:
              response.data.lease
                .advancePaid ?? "",

            noticePeriod:
              response.data.lease
                .noticePeriod || "",

            rentIncrement:
              response.data.lease
                .rentIncrement || "",

            notes:
              response.data.lease.notes ||
              "",
          });
        }
      }
    } catch (error) {
      console.error(
        "Error fetching lease:",
        error
      );
    }
  };

  // =========================================================
  // GET PAYMENTS
  // =========================================================

  const getPayments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/rent-payments`
      );

      if (response.data.success) {
        setPayments(
          response.data.payments || []
        );
      }
    } catch (error) {
      console.error(
        "Error fetching rent payments:",
        error
      );
    }
  };

  // =========================================================
  // GET STATS
  // =========================================================

  const getStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/stats`
      );

      if (response.data.success) {
        setStats(
          response.data.stats || {}
        );
      }
    } catch (error) {
      console.error(
        "Error fetching rent statistics:",
        error
      );
    }
  };

  // =========================================================
  // LOAD EVERYTHING
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        getLease(),
        getPayments(),
        getStats(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // LEASE FORM CHANGE
  // =========================================================

  const handleLeaseChange = (e) => {
    const { name, value } = e.target;

    setLeaseForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // PAYMENT FORM CHANGE
  // =========================================================

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    setPaymentForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "paymentMethod") {
      if (value === "Due") {
        setPaymentForm((previous) => ({
          ...previous,
          paymentMethod: value,
          status: "Due",
          paidDate: "",
        }));
      } else {
        setPaymentForm((previous) => ({
          ...previous,
          paymentMethod: value,
          status: "Paid",
        }));
      }
    }
  };

  // =========================================================
  // SAVE LEASE
  // =========================================================

  const handleSaveLease = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        property: leaseForm.property,
        location: leaseForm.location,
        propertyOwner:
          leaseForm.propertyOwner,

        monthlyRent:
          Number(leaseForm.monthlyRent) || 0,

        agreementStartDate:
          leaseForm.agreementStartDate,

        agreementEndDate:
          leaseForm.agreementEndDate,

        securityDeposit:
          Number(
            leaseForm.securityDeposit
          ) || 0,

        advancePaid:
          Number(leaseForm.advancePaid) || 0,

        noticePeriod:
          leaseForm.noticePeriod,

        rentIncrement:
          leaseForm.rentIncrement,

        notes: leaseForm.notes,
      };

      let response;

      if (lease?._id) {
        response = await axios.put(
          `${API_URL}/lease/${lease._id}`,
          payload
        );
      } else {
        response = await axios.post(
          `${API_URL}/lease`,
          payload
        );
      }

      if (response.data.success) {
        alert(
          lease
            ? "Lease updated successfully."
            : "Lease created successfully."
        );

        setShowLeaseModal(false);

        await loadData();
      }
    } catch (error) {
      console.error(
        "Save lease error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save lease."
      );
    }
  };

  // =========================================================
  // OPEN PAYMENT MODAL
  // =========================================================

  const handleAddPayment = () => {
    if (!lease) {
      alert(
        "Please create lease information first."
      );
      return;
    }

    setEditingPayment(null);

    setPaymentForm({
      rentAmount: lease.monthlyRent || "",
      dueDate: "",
      paidDate: "",
      paymentMethod: "Due",
      status: "Due",
      notes: "",
    });

    setShowPaymentModal(true);
  };

  // =========================================================
  // EDIT PAYMENT
  // =========================================================

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);

    setPaymentForm({
      rentAmount:
        payment.rentAmount ?? "",

      dueDate:
        payment.dueDate
          ? new Date(payment.dueDate)
              .toISOString()
              .split("T")[0]
          : "",

      paidDate:
        payment.paidDate
          ? new Date(payment.paidDate)
              .toISOString()
              .split("T")[0]
          : "",

      paymentMethod:
        payment.paymentMethod || "Due",

      status:
        payment.status || "Due",

      notes:
        payment.notes || "",
    });

    setShowPaymentModal(true);
  };

  // =========================================================
  // SAVE PAYMENT
  // =========================================================

  const handleSavePayment = async (e) => {
    e.preventDefault();

    if (!lease?._id) {
      alert(
        "Please create lease information first."
      );
      return;
    }

    try {
      const payload = {
        leaseId: lease._id,

        rentAmount:
          Number(paymentForm.rentAmount) || 0,

        dueDate:
          paymentForm.dueDate,

        paidDate:
          paymentForm.paymentMethod ===
          "Due"
            ? null
            : paymentForm.paidDate ||
              new Date()
                .toISOString()
                .split("T")[0],

        paymentMethod:
          paymentForm.paymentMethod,

        status:
          paymentForm.paymentMethod ===
          "Due"
            ? "Due"
            : "Paid",

        notes:
          paymentForm.notes,
      };

      let response;

      if (editingPayment) {
        response = await axios.put(
          `${API_URL}/rent-payment/${editingPayment._id}`,
          payload
        );
      } else {
        response = await axios.post(
          `${API_URL}/rent-payment`,
          payload
        );
      }

      if (response.data.success) {
        alert(
          editingPayment
            ? "Rent payment updated successfully."
            : "Rent payment added successfully."
        );

        setShowPaymentModal(false);

        setEditingPayment(null);

        setPaymentForm(emptyPayment);

        await loadData();
      }
    } catch (error) {
      console.error(
        "Save payment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save rent payment."
      );
    }
  };

  // =========================================================
  // DELETE PAYMENT
  // =========================================================

  const handleDeletePayment = async (
    paymentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this rent payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await axios.delete(
          `${API_URL}/rent-payment/${paymentId}`
        );

      if (response.data.success) {
        alert(
          "Rent payment deleted successfully."
        );

        await loadData();
      }
    } catch (error) {
      console.error(
        "Delete payment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete payment."
      );
    }
  };

  // =========================================================
  // FORMAT MONEY
  // =========================================================

  const formatMoney = (amount) => {
    return `₹ ${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-600";
    }

    if (status === "Overdue") {
      return "bg-red-100 text-red-600";
    }

    return "bg-orange-100 text-orange-600";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-100 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto flex h-full min-h-[calc(100vh-4rem)] w-full max-w-[1400px] flex-col">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-5 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Rent / Lease
            </h2>

            <p className="text-sm text-gray-400">
              Manage your property rent and lease payments
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              if (lease) {
                setShowLeaseModal(true);
              } else {
                setLeaseForm(
                  emptyLease
                );
                setShowLeaseModal(true);
              }
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {lease
              ? "Edit Lease"
              : "+ Add Lease"}
          </button>

        </div>

        {/* ===================================================
            STAT CARDS
        ==================================================== */}

        <div className="mb-5 grid shrink-0 grid-cols-1 gap-4 md:grid-cols-3">

          {/* MONTHLY RENT */}

          <div className="flex items-center gap-3 rounded-xl bg-white p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              📅
            </div>

            <div>

              <p className="text-xs text-gray-500">
                Monthly Rent
              </p>

              <h3 className="text-xl font-semibold">
                {formatMoney(
                  stats.monthlyRent
                )}
              </h3>

            </div>

          </div>

          {/* NEXT DUE */}

          <div className="flex items-center gap-3 rounded-xl bg-white p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              📆
            </div>

            <div>

              <p className="text-xs text-gray-500">
                Next Due Date
              </p>

              <h3 className="text-xl font-semibold">
                {formatDate(
                  stats.nextDueDate
                )}
              </h3>

              <span className="text-xs text-gray-400">

                {stats.daysLeft !== null
                  ? stats.daysLeft >= 0
                    ? `${stats.daysLeft} Days Left`
                    : `${Math.abs(
                        stats.daysLeft
                      )} Days Overdue`
                  : "No upcoming payment"}

              </span>

            </div>

          </div>

          {/* ADVANCE */}

          <div className="flex items-center gap-3 rounded-xl bg-white p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              💰
            </div>

            <div>

              <p className="text-xs text-gray-500">
                Advance Paid
              </p>

              <h3 className="text-xl font-semibold">
                {formatMoney(
                  stats.advancePaid
                )}
              </h3>

            </div>

          </div>

        </div>

        {/* ===================================================
            TABS
        ==================================================== */}

        <div className="mb-4 flex shrink-0 gap-6 border-b border-gray-200">

          {[
            "Rent Payments",
            "Lease Details",
          ].map((tab) => (

            <button
              key={tab}
              type="button"
              onClick={() =>
                setActiveTab(tab)
              }
              className={`pb-2.5 text-sm ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* ===================================================
            RENT PAYMENTS
        ==================================================== */}

        {activeTab === "Rent Payments" ? (

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">

            {/* PAYMENT HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-4">

              <div>

                <h3 className="text-sm font-semibold text-gray-800">
                  Rent Payment History
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {payments.length} payment
                  {payments.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              <button
                type="button"
                onClick={handleAddPayment}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
              >
                + Add Rent Payment
              </button>

            </div>


            <div className="min-h-0 flex-1 overflow-auto">

              <table className="w-full min-w-[1000px] text-sm">

                <thead className="sticky top-0 z-10 bg-gray-50">

                  <tr>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      #
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Property / Location
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Rent Amount
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Due Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Paid Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Payment Method
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="px-4 py-12 text-center text-xs text-gray-400"
                      >
                        Loading rent payments...
                      </td>

                    </tr>

                  ) : payments.length > 0 ? (

                    payments.map(
                      (payment, index) => (

                        <tr
                          key={payment._id}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >

                          <td className="px-4 py-3 text-xs">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3">

                            <p className="m-0 text-xs font-medium">
                              {payment.property}
                            </p>

                            <p className="m-0 text-xs text-gray-400">
                              {payment.location}
                            </p>

                          </td>

                          <td className="px-4 py-3 text-xs font-medium">
                            {formatMoney(
                              payment.rentAmount
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs">
                            {formatDate(
                              payment.dueDate
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs">
                            {formatDate(
                              payment.paidDate
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs">
                            {payment.paymentMethod}
                          </td>

                          <td className="px-4 py-3">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>

                          </td>

                          <td className="px-4 py-3">

                            <div className="flex gap-3">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditPayment(
                                    payment
                                  )
                                }
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeletePayment(
                                    payment._id
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
                        className="px-4 py-12 text-center"
                      >

                        <p className="text-sm text-gray-500">
                          No rent payments available
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Add your first rent payment to see it here.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        ) : (


          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-white p-6">

            {lease ? (

              <>

                <div className="mb-6 flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Lease Information
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Current property lease details
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLeaseModal(true)
                    }
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </button>

                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">

                  <Detail
                    label="Property"
                    value={
                      lease.property
                    }
                  />

                  <Detail
                    label="Location"
                    value={
                      lease.location
                    }
                  />

                  <Detail
                    label="Property Owner"
                    value={
                      lease.propertyOwner
                    }
                  />

                  <Detail
                    label="Monthly Rent"
                    value={formatMoney(
                      lease.monthlyRent
                    )}
                  />

                  <Detail
                    label="Agreement Start Date"
                    value={formatDate(
                      lease.agreementStartDate
                    )}
                  />

                  <Detail
                    label="Agreement End Date"
                    value={formatDate(
                      lease.agreementEndDate
                    )}
                  />

                  <Detail
                    label="Security Deposit"
                    value={formatMoney(
                      lease.securityDeposit
                    )}
                  />

                  <Detail
                    label="Advance Paid"
                    value={formatMoney(
                      lease.advancePaid
                    )}
                  />

                  <Detail
                    label="Notice Period"
                    value={
                      lease.noticePeriod ||
                      "-"
                    }
                  />

                  <Detail
                    label="Rent Increment"
                    value={
                      lease.rentIncrement ||
                      "-"
                    }
                  />

                  <Detail
                    label="Status"
                    value={
                      lease.status ||
                      "Active"
                    }
                  />

                </div>

                {lease.notes && (

                  <div className="mt-8">

                    <p className="mb-2 text-xs text-gray-400">
                      Notes
                    </p>

                    <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                      {lease.notes}
                    </p>

                  </div>

                )}

              </>

            ) : (

              <div className="flex h-full min-h-[300px] flex-col items-center justify-center">

                <div className="mb-3 text-4xl">
                  🏢
                </div>

                <h3 className="text-sm font-semibold text-gray-700">
                  No lease information
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Add your property lease information to get started.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setLeaseForm(
                      emptyLease
                    );
                    setShowLeaseModal(
                      true
                    );
                  }}
                  className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white"
                >
                  + Add Lease
                </button>

              </div>

            )}

          </div>

        )}

      </div>

      {

      {showLeaseModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">

              <div>

                <h2 className="text-lg font-semibold">
                  {lease
                    ? "Edit Lease"
                    : "Add Lease"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Enter your property lease information
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowLeaseModal(
                    false
                  )
                }
                className="text-xl text-gray-400"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSaveLease}
            >

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

                <Input
                  label="Property"
                  name="property"
                  value={
                    leaseForm.property
                  }
                  onChange={
                    handleLeaseChange
                  }
                  required
                  placeholder="e.g. Main Shop"
                />

                <Input
                  label="Location"
                  name="location"
                  value={
                    leaseForm.location
                  }
                  onChange={
                    handleLeaseChange
                  }
                  required
                  placeholder="Enter location"
                />

                <Input
                  label="Property Owner"
                  name="propertyOwner"
                  value={
                    leaseForm.propertyOwner
                  }
                  onChange={
                    handleLeaseChange
                  }
                  required
                  placeholder="Enter owner name"
                />

                <Input
                  label="Monthly Rent"
                  name="monthlyRent"
                  type="number"
                  value={
                    leaseForm.monthlyRent
                  }
                  onChange={
                    handleLeaseChange
                  }
                  required
                  placeholder="0"
                />

                <Input
                  label="Agreement Start Date"
                  name="agreementStartDate"
                  type="date"
                  value={
                    leaseForm.agreementStartDate
                  }
                  onChange={
                    handleLeaseChange
                  }
                  required
                />

                <Input
                  label="Agreement End Date"
                  name="agreementEndDate"
                  type="date"
                  value={
                    leaseForm.agreementEndDate
                  }
                  onChange={
                    handleLeaseChange
                  }
                  required
                />

                <Input
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  value={
                    leaseForm.securityDeposit
                  }
                  onChange={
                    handleLeaseChange
                  }
                  placeholder="0"
                />

                <Input
                  label="Advance Paid"
                  name="advancePaid"
                  type="number"
                  value={
                    leaseForm.advancePaid
                  }
                  onChange={
                    handleLeaseChange
                  }
                  placeholder="0"
                />

                <Input
                  label="Notice Period"
                  name="noticePeriod"
                  value={
                    leaseForm.noticePeriod
                  }
                  onChange={
                    handleLeaseChange
                  }
                  placeholder="e.g. 2 Months"
                />

                <Input
                  label="Rent Increment"
                  name="rentIncrement"
                  value={
                    leaseForm.rentIncrement
                  }
                  onChange={
                    handleLeaseChange
                  }
                  placeholder="e.g. 10% Every Year"
                />

                <div className="sm:col-span-2">

                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={
                      leaseForm.notes
                    }
                    onChange={
                      handleLeaseChange
                    }
                    rows="3"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    placeholder="Additional lease notes"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-2 border-t p-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowLeaseModal(
                      false
                    )
                  }
                  className="rounded-md border px-5 py-2 text-xs text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-5 py-2 text-xs font-medium text-white"
                >
                  {lease
                    ? "Update Lease"
                    : "Add Lease"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {

      {showPaymentModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b p-5">

              <div>

                <h2 className="text-lg font-semibold">
                  {editingPayment
                    ? "Edit Rent Payment"
                    : "Add Rent Payment"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Record your rent payment
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPaymentModal(
                    false
                  )
                }
                className="text-xl text-gray-400"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSavePayment
              }
            >

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

                <Input
                  label="Rent Amount"
                  name="rentAmount"
                  type="number"
                  value={
                    paymentForm.rentAmount
                  }
                  onChange={
                    handlePaymentChange
                  }
                  required
                />

                <Input
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={
                    paymentForm.dueDate
                  }
                  onChange={
                    handlePaymentChange
                  }
                  required
                />

                <div>

                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Payment Method
                  </label>

                  <select
                    name="paymentMethod"
                    value={
                      paymentForm.paymentMethod
                    }
                    onChange={
                      handlePaymentChange
                    }
                    className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-indigo-500"
                  >

                    <option value="Due">
                      Due
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>

                    <option value="QR">
                      QR
                    </option>

                  </select>

                </div>

                <Input
                  label="Paid Date"
                  name="paidDate"
                  type="date"
                  value={
                    paymentForm.paidDate
                  }
                  onChange={
                    handlePaymentChange
                  }
                  disabled={
                    paymentForm.paymentMethod ===
                    "Due"
                  }
                />

                <div className="sm:col-span-2">

                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={
                      paymentForm.notes
                    }
                    onChange={
                      handlePaymentChange
                    }
                    rows="3"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    placeholder="Optional notes"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-2 border-t p-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentModal(
                      false
                    )
                  }
                  className="rounded-md border px-5 py-2 text-xs text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-5 py-2 text-xs font-medium text-white"
                >
                  {editingPayment
                    ? "Update Payment"
                    : "Add Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  placeholder = "",
}) {
  return (
    <div>

      <label className="mb-1 block text-xs font-medium text-gray-700">
        {label}
        {required && " *"}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs outline-none focus:border-indigo-500 disabled:bg-gray-100"
      />

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>

      <p className="mb-1 text-xs text-gray-400">
        {label}
      </p>

      <p className="text-sm font-medium text-gray-800">
        {value}
      </p>

    </div>
  );
}

export default RentLease;
