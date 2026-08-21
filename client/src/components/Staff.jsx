import axios from "axios";
import React, { useEffect, useState } from "react";

const Staff = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    name: "",
    number: "",
    email: "",
    designation: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  //for getting the data of all staff
  const getStaff = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "http://localhost:3000/api/staffalldata",
      );

      if (result.data.success) {
        setStaff(result.data.staff);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaff();
  }, []);
  // for updating the existing staff
  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);

    setData({
      name: staffMember.StaffName || "",
      number: staffMember.PhoneNumber || "",
      email: staffMember.Email || "",
      designation: staffMember.Designation || "",
    });

    setShowModal(true);
  };

  const handleAddStaff = () => {
    setEditingStaff(null);

    setData({
      name: "",
      number: "",
      email: "",
      designation: "",
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStaff(null);

    setData({
      name: "",
      number: "",
      email: "",
      designation: "",
    });
  };
  //for deleting the exisitng staff
  const handleDelete = async (staffId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?",
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const result = await axios.delete(
        `http://localhost:3000/api/staff/${staffId}`,
      );
      if (result.data.success) {
        alert("Staff deleted successfully");

        getStaff();
      } else {
        alert(result.data.message || "Failed to delete staff");
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while deleting staff",
        );
      } else {
        alert("Something went wrong.");
      }
    }
  };
  //for submitting the staff based on methods
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result;

      if (editingStaff) {
        result = await axios.put(
          `http://localhost:3000/api/staff/${editingStaff._id}`,
          {
            StaffName: data.name,
            PhoneNumber: data.number,
            Email: data.email,
            Designation: data.designation,
          },
        );
      } else {
        result = await axios.post("http://localhost:3000/api/staff", {
          StaffName: data.name,
          PhoneNumber: data.number,
          Email: data.email,
          Designation: data.designation,
        });
      }

      console.log("Response:", result.data);

      if (result.data.success) {
        alert(
          editingStaff
            ? "Staff updated successfully"
            : "Staff created successfully",
        );

        setShowModal(false);

        setEditingStaff(null);

        setData({
          name: "",
          number: "",
          email: "",
          designation: "",
        });

        getStaff();
      } else {
        alert(result.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.log("Server response:", error.response.data);

        alert(
          error.response.data.message || "Server error while saving staff",
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = staff.filter((staffMember) => {
    const searchValue = search.toLowerCase();

    return (
      staffMember.StaffName?.toLowerCase().includes(searchValue) ||
      staffMember.PhoneNumber?.toLowerCase().includes(searchValue) ||
      staffMember.Email?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <>
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Staff</h1>

            <p className="mt-1 text-xs text-gray-500">Manage your staff</p>
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
            onClick={handleAddStaff}
            className="h-9 cursor-pointer rounded-md bg-blue-600 px-4 text-[11px] font-medium text-white hover:bg-blue-700"
          >
            Add New Staff
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b bg-gray-50 text-center ">
                  <th className="px-4 py-3 text-left text-[10px] text-gray-500">
                    #
                  </th>

                  <th className="px-4  py-3  text-[10px] text-gray-500">
                    Staff
                  </th>

                  <th className="px-4 py-3  text-[10px] text-gray-500">
                    Phone
                  </th>

                  <th className="px-4 py-3  text-[10px] text-gray-500">
                    Email
                  </th>

                  <th className="px-4 py-3  text-[10px]  text-gray-500">
                    Designation
                  </th>

                  <th className="px-4 py-3  text-[10px] text-gray-500">
                    Joined
                  </th>

                  <th className="px-4 py-3  text-[10px]  text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-xs text-gray-400"
                    >
                      Loading staff...
                    </td>
                  </tr>
                ) : filteredStaff.length > 0 ? (
                  filteredStaff.map((staffMember, index) => (
                    <tr
                      key={staffMember._id}
                      className="border-b text-center border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 text-xs font-medium text-gray-800">
                        {staffMember.StaffName}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {staffMember.PhoneNumber}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {staffMember.Email}
                      </td>

                      <td className="px-4 py-3 text-xs  text-gray-600">
                        {staffMember.Designation}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-600">
                        {staffMember.createdAt
                          ? new Date(staffMember.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3 text-xs">
                        <div className="flex  justify-around text-sm ">
                          <button
                            type="button"
                            onClick={() => handleEdit(staffMember)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                          >
                            <i className="fa-solid fa-pen text-blue-500"></i>
                          </button>

                          <button
                            onClick={() => handleDelete(staffMember._id)}
                            type="button"
                            className="cursor-pointer text-red-600 hover:text-red-800"
                          >
                            <i className="fa-solid fa-trash-can text-red-500"></i>
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
                      {search ? "No staff found" : "No staff available"}
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
                  {editingStaff ? "Edit Staff" : "Add New Staff"}
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
                      Staff Name
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
                      Designation
                    </label>

                    <input
                      type="text"
                      name="designation"
                      value={data.designation}
                      onChange={handleChange}
                      className="w-full rounded-md border px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t p-5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="cursor-pointer rounded-md border px-5 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-xs text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? editingStaff
                        ? "Updating..."
                        : "Adding..."
                      : editingStaff
                        ? "Update Staff"
                        : "Add Staff"}
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

export default Staff;
