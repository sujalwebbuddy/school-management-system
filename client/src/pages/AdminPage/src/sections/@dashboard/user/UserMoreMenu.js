import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// component
import Iconify from "../../../components/Iconify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getNoApprovedUsers } from "../../../../../../slices/adminSlice";

// ----------------------------------------------------------------------

export default function UserMoreMenu({ id, role, userData }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    axios
      .delete(`/api/v1/admin/deleteUser/${id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    dispatch(getNoApprovedUsers());
  };

  const handleApprove = () => {
    // Navigate to the appropriate add user form based on role
    let route = "/dashboard/newuser"; // default for student
    if (role === "teacher") route = "/dashboard/newusert";

    navigate(route, { state: { userData, isApproval: true } });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem sx={{ color: "primary.main" }} onClick={handleApprove}>
          <ListItemIcon>
            <Iconify icon="eva:checkmark-circle-2-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Approve"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }} onClick={handleDelete}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
