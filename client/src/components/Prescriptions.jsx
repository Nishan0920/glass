import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3000/api";

function Prescriptions() {
  // =========================================================
  // STATES
  // =========================================================

  const [prescriptions, setPrescriptions] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] =
    useState("");

  // =========================================================
  // GET CUSTOMER ID FROM URL
  // =========================================================

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const customerId = params.get("customerId");

    if (customerId) {
      setSelectedCustomerId(customerId);
    }
  }, []);

  // =========================================================
  // GET ALL PRESCRIPTIONS
  // =========================================================

  const getPrescriptions = async () => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${API_URL}/prescriptionalldata`
      );

      if (result.data.success) {
        setPrescriptions(
          result.data.prescriptions || []
        );
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.error(
        "Error fetching prescriptions:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
            "Failed to load prescriptions."
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PRESCRIPTIONS
  // =========================================================

  useEffect(() => {
    getPrescriptions();
  }, []);

  // =========================================================
  // SEARCH + CUSTOMER FILTER
  // =========================================================

  const filteredPrescriptions = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return prescriptions.filter((prescription) => {

      // -----------------------------------------------------
      // CUSTOMER ID FILTER
      // -----------------------------------------------------

      if (
        selectedCustomerId &&
        prescription.CustomerId !==
          selectedCustomerId
      ) {
        return false;
      }

      // -----------------------------------------------------
      // SEARCH
      // -----------------------------------------------------

      if (!searchValue) {
        return true;
      }

      return (
        prescription.PrescriptionId?.toLowerCase().includes(
          searchValue
        ) ||
        prescription.CustomerName?.toLowerCase().includes(
          searchValue
        ) ||
        prescription.CustomerPhone?.toLowerCase().includes(
          searchValue
        )
      );
    });
  }, [
    prescriptions,
    search,
    selectedCustomerId,
  ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalPrescriptions =
    prescriptions.length;

  const singleVisionCount =
    prescriptions.filter(
      (p) => p.Type === "Single Vision"
    ).length;

  const bifocalCount =
    prescriptions.filter(
      (p) => p.Type === "Bifocal"
    ).length;

  // =========================================================
  // CLEAR CUSTOMER FILTER
  // =========================================================

  const clearCustomerFilter = () => {
    setSelectedCustomerId("");

    const url = new URL(window.location.href);

    url.searchParams.delete("customerId");

    window.history.replaceState(
      {},
      "",
      url.toString()
    );
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
  // EYE DISPLAY
  // =========================================================

  const formatEye = (eye) => {
    if (!eye) {
      return "-";
    }

    const values = [];

    if (eye.sph) {
      values.push(`SPH ${eye.sph}`);
    }

    if (eye.cyl) {
      values.push(`CYL ${eye.cyl}`);
    }

    if (eye.axis) {
      values.push(`AXIS ${eye.axis}°`);
    }

    if (eye.add) {
      values.push(`ADD ${eye.add}`);
    }

    return values.length > 0
      ? values.join(" ")
      : "-";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto flex w-full max-w-[1400px] flex-col">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Prescriptions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Manage and track customer prescriptions
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">

              {new Date().toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH
        ==================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">

          <div className="flex flex-1 items-center rounded-lg border border-gray-200 bg-white px-4 py-2.5">

            <span className="mr-2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by customer name, phone or prescription ID"
              className="w-full text-sm outline-none"
            />

          </div>

          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + New Prescription
          </button>

        </div>

        {/* ===================================================
            CUSTOMER FILTER
        ==================================================== */}

        {selectedCustomerId && (

          <div className="mb-5 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

            <div>

              <p className="text-xs text-blue-500">
                Showing prescriptions for selected customer
              </p>

              <p className="mt-1 text-sm font-medium text-blue-900">
                Customer Prescription History
              </p>

            </div>

            <button
              type="button"
              onClick={clearCustomerFilter}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Show All
            </button>

          </div>

        )}

        {/* ===================================================
            STAT CARDS
        ==================================================== */}

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* TOTAL */}

          <div className="flex items-center gap-3 rounded-xl bg-white p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              📄
            </div>

            <div>

              <p className="text-xs text-gray-500">
                Total Prescriptions
              </p>

              <h3 className="text-xl font-semibold text-gray-900">
                {totalPrescriptions}
              </h3>

              <span className="text-xs text-gray-400">
                All Records
              </span>

            </div>

          </div>

          {/* SINGLE VISION */}

          <div className="flex items-center gap-3 rounded-xl bg-white p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              👓
            </div>

            <div>

              <p className="text-xs text-gray-500">
                Single Vision
              </p>

              <h3 className="text-xl font-semibold text-gray-900">
                {singleVisionCount}
              </h3>

              <span className="text-xs text-gray-400">
                Records
              </span>

            </div>

          </div>

          {/* BIFOCAL */}

          <div className="flex items-center gap-3 rounded-xl bg-white p-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              🕶️
            </div>

            <div>

              <p className="text-xs text-gray-500">
                Bifocal
              </p>

              <h3 className="text-xl font-semibold text-gray-900">
                {bifocalCount}
              </h3>

              <span className="text-xs text-gray-400">
                Records
              </span>

            </div>

          </div>

        </div>

        {/* ===================================================
            TABLE
        ==================================================== */}

        <div className="overflow-hidden rounded-xl bg-white">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-sm">

              <thead className="border-b border-gray-100 bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    #
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Prescription ID
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Right (OD)
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    Left (OS)
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
                      Loading prescriptions...
                    </td>

                  </tr>

                ) : filteredPrescriptions.length >
                  0 ? (

                  filteredPrescriptions.map(
                    (p, index) => (

                      <tr
                        key={
                          p._id ||
                          p.PrescriptionId ||
                          index
                        }
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >

                        {/* NUMBER */}

                        <td className="px-4 py-4 text-xs text-gray-500">
                          {index + 1}
                        </td>

                        {/* PRESCRIPTION ID */}

                        <td className="px-4 py-4">

                          <span className="text-xs font-semibold text-indigo-600">
                            {p.PrescriptionId ||
                              "-"}
                          </span>

                        </td>

                        {/* CUSTOMER NAME */}

                        <td className="px-4 py-4">

                          <div className="text-xs font-semibold text-gray-800">
                            {p.CustomerName ||
                              "-"}
                          </div>

                        </td>

                        {/* PHONE */}

                        <td className="px-4 py-4">

                          <span className="text-xs text-gray-600">
                            {p.CustomerPhone ||
                              "-"}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-4 py-4">

                          <span className="text-xs text-gray-600">
                            {formatDate(p.Date)}
                          </span>

                        </td>

                        {/* TYPE */}

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-600">
                            {p.Type || "-"}
                          </span>

                        </td>

                        {/* RIGHT */}

                        <td className="px-4 py-4">

                          <span className="text-xs text-gray-600">
                            {formatEye(p.Right)}
                          </span>

                        </td>

                        {/* LEFT */}

                        <td className="px-4 py-4">

                          <span className="text-xs text-gray-600">
                            {formatEye(p.Left)}
                          </span>

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

                      <div className="flex flex-col items-center">

                        <div className="mb-3 text-3xl">
                          📄
                        </div>

                        <p className="text-sm font-medium text-gray-600">
                          {search
                            ? "No prescriptions found"
                            : "No prescriptions available"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {search
                            ? "Try a different customer name, phone number or prescription ID."
                            : "Prescriptions added to customers will appear here."}
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Prescriptions;
