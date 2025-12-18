import React from "react";
import "./UserCard.css";
import Iconify from "../pages/AdminPage/src/components/Iconify";
import Swal from "sweetalert2";
import { getApprovedUsers } from "../slices/adminSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
const UserCard = ({ id, firstName, lastName, email, image }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const getProfilePath = () => {
    const pathname = location.pathname  ;
    if (pathname.includes('/teachers')) {
      return `/dashboard/teachers/profile/${id}`;
    } else if (pathname.includes('/students')) {
      return `/dashboard/students/profile/${id}`;
    }
    return ``;
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "User has been deleted.", "success");
        axios
          .delete(`/api/v1/admin/user/${id}`, {
            headers: { token: localStorage.getItem("token") },
          })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        dispatch(getApprovedUsers());
      }
    });
  };
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ width: "20%" }}>
      <div className="our-team">
        <div className="picture">
          <img className="img-fluid" src={image} />
        </div>
        <div className="team-content">
          <h3 className="name">{`${firstName} ${lastName}`}</h3>
          <h4 className="title">{email}</h4>
        </div>
        <ul className="social">
          <li>
            <div>
              <Iconify
                icon={"ant-design:delete-filled"}
                onClick={handleDelete}
              />
            </div>
          </li>
          <li>
            <Link to={`/dashboard/${id}`} state={id}>
              <div>
                <Iconify icon={"carbon:view-filled"} />
              </div>
            </Link>
          </li>
          <li>
            <Link to={getProfilePath()} state={id}>
              <div>
                <Iconify icon={"ant-design:edit-filled"} />
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserCard;
