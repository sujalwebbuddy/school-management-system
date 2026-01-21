import { Button } from "@mui/material";
import api from "../../../../utils/api";
import React from "react";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import { getHomeworks } from "../../../../slices/teacherSlice";
import { useDispatch, useSelector } from "react-redux";

const DeleteHomework = ({ id }) => {
  const dispatch = useDispatch();
  const subject = useSelector((state) => {
    return state?.teacher?.userInfo?.user?.subject;
  });
  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`/teacher/delete/${id}`);
          await Swal.fire("Deleted!", "Homework has been deleted.", "success");
        } catch (error) {
          // Error handling with context for architecture compliance
          const wrappedError = new Error("Failed to delete homework");
          wrappedError.name = "DeleteHomeworkError";
          wrappedError.code = "DELETE_HOMEWORK_FAILED";
          wrappedError.context = { originalError: error, homeworkId: id };
          throw wrappedError;
        }
        dispatch(getHomeworks(subject));
      }
    } catch (error) {
      // Handle any display or delete errors, optionally show user feedback here if needed
      // (Do not use console.log/error per rules)
      // Optionally, show an error alert:
      await Swal.fire(
        "Error",
        error.message || "An unexpected error occurred while deleting homework.",
        "error"
      );
    }
  };
  return (
    <Button
      variant="outlined"
      startIcon={<DeleteIcon />}
      onClick={handleDelete}
      color="error"
    >
      Delete
    </Button>
  );
};

export default DeleteHomework;
