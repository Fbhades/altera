import React, { useState, useEffect } from "react";
import { reservation } from "../Interface/interface";
import { DeleteButton } from "@/components/ui/delete-button";
import { UpdateButton } from "@/components/ui/update-button";
import { useToast } from "@/components/ui/useToast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Reservations = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<reservation[]>([]);
  const [newReservation, setNewReservation] = useState<reservation>({
    id: 0,
    flightid: 0,
    userid: 0,
    mealid: 0,
    price: 0,
    done: false,
  });
  const [editingReservation, setEditingReservation] =
    useState<reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReservationId, setDeleteReservationId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/resevation");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reservations",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Input validation
    if (type === "number") {
      const numValue = Number(value);
      if (numValue < 0) {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Value cannot be negative",
        });
        return;
      }
      if (name === "price" && !Number.isInteger(numValue * 100)) {
        toast({
          variant: "destructive",
          title: "Invalid Price",
          description: "Price can only have up to 2 decimal places",
        });
        return;
      }
    }

    setNewReservation({
      ...newReservation,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewReservation({
      id: 0,
      flightid: 0,
      userid: 0,
      mealid: 0,
      price: 0,
      done: false,
    });
    setEditingReservation(null);
  };

  const handleUpdate = (reservation: reservation) => {
    setEditingReservation(reservation);
    setNewReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeleteReservationId(id);
    setShowDeleteDialog(true);
  };

  // Add handleConfirmDelete function
  const handleConfirmDelete = async () => {
    if (!deleteReservationId) return;

    try {
      const response = await fetch(
        `/api/admin/resevation/${deleteReservationId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      setReservations(
        reservations.filter((res) => res.id !== deleteReservationId)
      );
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reservation",
      });
    } finally {
      setShowDeleteDialog(false);
      setDeleteReservationId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReservation) {
      // Update existing reservation
      try {
        const response = await fetch(
          `/api/admin/resevation/${editingReservation.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReservation),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const updatedReservation = await response.json();
        setReservations(
          reservations.map((reservation) =>
            reservation.id === updatedReservation.id
              ? updatedReservation
              : reservation
          )
        );
      } catch (error) {
        console.error("Error updating reservation:", error);
      }
    } else {
      // Create new reservation
      try {
        const response = await fetch("/api/admin/resevation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReservation),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const createdReservation = await response.json();
        setReservations([...reservations, createdReservation]);
      } catch (error) {
        console.error("Error creating reservation:", error);
      }
    }

    // Reset form and editing state after submission
    setNewReservation({
      id: 0,
      flightid: 0,
      userid: 0,
      mealid: 0,
      price: 0,
      done: false,
    });
    setEditingReservation(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-yellow-300">
            Manage Reservations
          </h2>
          <button
            onClick={() => {
              setNewReservation({
                id: 0,
                flightid: 0,
                userid: 0,
                mealid: 0,
                price: 0,
                done: false,
              });
              setEditingReservation(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Add New Reservation
          </button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] bg-white rounded-lg shadow-lg z-[100]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editingReservation
                  ? "Edit Reservation"
                  : "Add New Reservation"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                handleModalClose();
              }}
              className="space-y-4 mt-4"
            >
              <div className="space-y-2">
                <label htmlFor="flightid" className="text-sm font-medium">
                  Flight ID
                </label>
                <input
                  id="flightid"
                  type="number"
                  name="flightid"
                  value={newReservation.flightid}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      flightid: Number(e.target.value),
                    })
                  }
                  required
                  min="1"
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="userid" className="text-sm font-medium">
                  User ID
                </label>
                <input
                  id="userid"
                  type="number"
                  name="userid"
                  value={newReservation.userid}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      userid: Number(e.target.value),
                    })
                  }
                  required
                  min="1"
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mealid" className="text-sm font-medium">
                  Meal ID
                </label>
                <input
                  id="mealid"
                  type="number"
                  name="mealid"
                  value={newReservation.mealid}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      mealid: Number(e.target.value),
                    })
                  }
                  required
                  min="1"
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={newReservation.price}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      price: Number(e.target.value),
                    })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="done"
                  type="checkbox"
                  name="done"
                  checked={newReservation.done}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      done: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="done" className="text-sm font-medium">
                  Completed
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingReservation
                    ? "Update Reservation"
                    : "Add Reservation"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Are you sure you want to delete this reservation?</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 rounded-md bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-md bg-red-500 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
          <h3 className="text-xl font-semibold p-4 bg-gray-50 text-gray-700 border-b">
            Existing Reservations
          </h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.flightid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.mealid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.userid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${reservation.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.done ? "Completed" : "Pending"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <UpdateButton onClick={() => handleUpdate(reservation)} />
                      <DeleteButton
                        onClick={() => handleDelete(reservation.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No reservations available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Reservations;
